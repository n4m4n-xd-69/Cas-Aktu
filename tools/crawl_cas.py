"""Create a content and public-asset inventory of https://cas.res.in/."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import mimetypes
import re
import time
from collections import deque
from pathlib import Path
from urllib.parse import unquote, urldefrag, urljoin, urlparse

import requests
from bs4 import BeautifulSoup


BASE_URL = "https://cas.res.in/"
ALLOWED_HOSTS = {"cas.res.in", "www.cas.res.in"}
PAGE_EXTENSIONS = {"", ".html", ".htm", ".php", ".asp", ".aspx"}
IMAGE_EXTENSIONS = {".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"}
DOCUMENT_EXTENSIONS = {
    ".csv",
    ".doc",
    ".docx",
    ".jpeg",
    ".jpg",
    ".pdf",
    ".png",
    ".ppt",
    ".pptx",
    ".rtf",
    ".txt",
    ".xls",
    ".xlsx",
    ".zip",
}


def normalize_url(url: str, current_url: str = BASE_URL) -> str | None:
    url = (url or "").strip()
    if not url or url.startswith(("#", "data:", "javascript:", "mailto:", "tel:")):
        return None
    absolute, _ = urldefrag(urljoin(current_url, url))
    parsed = urlparse(absolute)
    if parsed.scheme not in {"http", "https"}:
        return None
    if parsed.hostname in ALLOWED_HOSTS:
        parsed = parsed._replace(scheme="https", netloc="cas.res.in")
        absolute = parsed.geturl()
    return absolute


def is_internal(url: str) -> bool:
    return (urlparse(url).hostname or "").lower() in ALLOWED_HOSTS


def url_extension(url: str) -> str:
    return Path(unquote(urlparse(url).path)).suffix.lower()


def is_page(url: str) -> bool:
    return is_internal(url) and url_extension(url) in PAGE_EXTENSIONS


def clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def local_asset_path(url: str, output_dir: Path, content_type: str) -> Path:
    parsed = urlparse(url)
    path = Path(unquote(parsed.path).lstrip("/"))
    suffix = path.suffix.lower()
    if not suffix:
        suffix = mimetypes.guess_extension(content_type.split(";", 1)[0]) or ".bin"
    stem = re.sub(r"[^A-Za-z0-9._-]+", "-", path.stem or "asset").strip("-") or "asset"
    digest = hashlib.sha256(url.encode("utf-8")).hexdigest()[:12]
    return output_dir / f"{stem}-{digest}{suffix}"


def write_csv(path: Path, rows: list[dict], fields: list[str]) -> None:
    with path.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def crawl(output: Path, max_pages: int, delay: float, download_images: bool) -> None:
    output.mkdir(parents=True, exist_ok=True)
    image_dir = output.parent / "source-assets" / "images"
    image_dir.mkdir(parents=True, exist_ok=True)

    session = requests.Session()
    session.headers.update(
        {
            "User-Agent": "CAS-website-content-inventory/1.0 (+migration planning; contact site owner)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        }
    )

    queue = deque([BASE_URL])
    queued = {BASE_URL}
    visited: set[str] = set()
    pages: list[dict] = []
    assets: dict[str, dict] = {}
    links: dict[tuple[str, str], dict] = {}

    while queue and len(visited) < max_pages:
        requested_url = queue.popleft()
        if requested_url in visited:
            continue
        visited.add(requested_url)
        try:
            response = session.get(requested_url, timeout=30, allow_redirects=True)
            content_type = response.headers.get("content-type", "")
            final_url = normalize_url(response.url) or response.url
            if response.status_code >= 400 or "html" not in content_type.lower():
                pages.append(
                    {
                        "url": requested_url,
                        "final_url": final_url,
                        "status": response.status_code,
                        "title": "",
                        "description": "",
                        "h1": "",
                        "word_count": 0,
                        "image_count": 0,
                        "internal_link_count": 0,
                        "external_link_count": 0,
                    }
                )
                continue

            soup = BeautifulSoup(response.content, "html.parser")
            for element in soup(["script", "style", "noscript", "template"]):
                element.decompose()

            title = clean_text(soup.title.get_text(" ", strip=True)) if soup.title else ""
            description_tag = soup.find("meta", attrs={"name": re.compile("^description$", re.I)})
            description = clean_text(description_tag.get("content", "")) if description_tag else ""
            headings = [
                {"level": heading.name, "text": clean_text(heading.get_text(" ", strip=True))}
                for heading in soup.find_all(re.compile(r"^h[1-6]$"))
                if clean_text(heading.get_text(" ", strip=True))
            ]
            body_text = clean_text((soup.body or soup).get_text(" ", strip=True))

            page_links: list[dict] = []
            internal_count = 0
            external_count = 0
            for anchor in soup.find_all("a", href=True):
                target = normalize_url(anchor.get("href", ""), final_url)
                if not target:
                    continue
                label = clean_text(anchor.get_text(" ", strip=True))
                internal = is_internal(target)
                internal_count += int(internal)
                external_count += int(not internal)
                page_links.append({"label": label, "url": target, "internal": internal})
                links[(final_url, target)] = {
                    "source_url": final_url,
                    "target_url": target,
                    "label": label,
                    "internal": internal,
                    "asset_type": "document" if url_extension(target) in DOCUMENT_EXTENSIONS else "page",
                }
                if is_page(target) and target not in queued and target not in visited:
                    queued.add(target)
                    queue.append(target)
                extension = url_extension(target)
                if internal and extension in DOCUMENT_EXTENSIONS:
                    asset_type = "image" if extension in IMAGE_EXTENSIONS else "document"
                    discovered_asset = assets.setdefault(
                        target,
                        {
                            "url": target,
                            "type": asset_type,
                            "source_page": final_url,
                            "alt_or_label": label,
                            "status": "not_fetched",
                            "content_type": "",
                            "bytes": "",
                            "local_path": "",
                        },
                    )
                    if asset_type == "image":
                        discovered_asset["type"] = "image"

            image_urls: list[str] = []
            for image in soup.find_all("img"):
                candidates = [image.get("src", ""), image.get("data-src", "")]
                srcset = image.get("srcset", "") or image.get("data-srcset", "")
                candidates.extend(item.strip().split(" ")[0] for item in srcset.split(",") if item.strip())
                for candidate in candidates:
                    target = normalize_url(candidate, final_url)
                    if not target or not is_internal(target):
                        continue
                    image_urls.append(target)
                    discovered_asset = assets.setdefault(
                        target,
                        {
                            "url": target,
                            "type": "image",
                            "source_page": final_url,
                            "alt_or_label": clean_text(image.get("alt", "")),
                            "status": "not_fetched",
                            "content_type": "",
                            "bytes": "",
                            "local_path": "",
                        },
                    )
                    discovered_asset["type"] = "image"

            pages.append(
                {
                    "url": requested_url,
                    "final_url": final_url,
                    "status": response.status_code,
                    "title": title,
                    "description": description,
                    "h1": next((item["text"] for item in headings if item["level"] == "h1"), ""),
                    "word_count": len(body_text.split()),
                    "image_count": len(set(image_urls)),
                    "internal_link_count": internal_count,
                    "external_link_count": external_count,
                    "headings": headings,
                    "text": body_text,
                    "links": page_links,
                }
            )
            print(f"[{len(visited):03}/{max_pages}] {response.status_code} {final_url}")
        except requests.RequestException as error:
            pages.append(
                {
                    "url": requested_url,
                    "final_url": "",
                    "status": "error",
                    "title": "",
                    "description": "",
                    "h1": "",
                    "word_count": 0,
                    "image_count": 0,
                    "internal_link_count": 0,
                    "external_link_count": 0,
                    "error": str(error),
                }
            )
        time.sleep(delay)

    if download_images:
        image_assets = [asset for asset in assets.values() if asset["type"] == "image"]
        for index, asset in enumerate(image_assets, start=1):
            try:
                expected_path = local_asset_path(
                    asset["url"], image_dir, mimetypes.guess_type(asset["url"])[0] or "application/octet-stream"
                )
                if expected_path.exists():
                    asset["status"] = 200
                    asset["content_type"] = mimetypes.guess_type(expected_path.name)[0] or ""
                    asset["bytes"] = expected_path.stat().st_size
                    asset["local_path"] = expected_path.as_posix()
                    print(f"[image {index:03}/{len(image_assets)}] cached {asset['url']}")
                    continue
                response = session.get(asset["url"], timeout=45, allow_redirects=True)
                content_type = response.headers.get("content-type", "")
                asset["status"] = response.status_code
                asset["content_type"] = content_type
                asset["bytes"] = len(response.content)
                if response.ok and ("image/" in content_type.lower() or url_extension(asset["url"]) in IMAGE_EXTENSIONS):
                    local_path = local_asset_path(asset["url"], image_dir, content_type)
                    local_path.write_bytes(response.content)
                    asset["local_path"] = local_path.as_posix()
                print(f"[image {index:03}/{len(image_assets)}] {response.status_code} {asset['url']}")
            except requests.RequestException as error:
                asset["status"] = "error"
                asset["error"] = str(error)
            time.sleep(delay)

    full_inventory = {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "source": BASE_URL,
        "limits": {"max_pages": max_pages, "delay_seconds": delay},
        "summary": {
            "pages_crawled": len(pages),
            "images_found": sum(1 for asset in assets.values() if asset["type"] == "image"),
            "documents_found": sum(1 for asset in assets.values() if asset["type"] == "document"),
            "links_found": len(links),
        },
        "pages": pages,
        "assets": list(assets.values()),
    }
    (output / "cas-content-inventory.json").write_text(
        json.dumps(full_inventory, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    write_csv(
        output / "cas-page-inventory.csv",
        pages,
        [
            "url",
            "final_url",
            "status",
            "title",
            "description",
            "h1",
            "word_count",
            "image_count",
            "internal_link_count",
            "external_link_count",
            "error",
        ],
    )
    write_csv(
        output / "cas-asset-inventory.csv",
        list(assets.values()),
        ["url", "type", "source_page", "alt_or_label", "status", "content_type", "bytes", "local_path", "error"],
    )
    write_csv(
        output / "cas-link-inventory.csv",
        list(links.values()),
        ["source_url", "target_url", "label", "internal", "asset_type"],
    )
    print(json.dumps(full_inventory["summary"], indent=2))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=Path("research"))
    parser.add_argument("--max-pages", type=int, default=250)
    parser.add_argument("--delay", type=float, default=0.15)
    parser.add_argument("--skip-images", action="store_true")
    args = parser.parse_args()
    crawl(args.output, args.max_pages, args.delay, not args.skip_images)


if __name__ == "__main__":
    main()
