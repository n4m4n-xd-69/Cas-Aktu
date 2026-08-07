"""Download public CAS documents listed by the content inventory."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import time
from pathlib import Path
from urllib.parse import unquote, urlparse

import requests


def destination_for(url: str, output: Path) -> Path:
    source_name = Path(unquote(urlparse(url).path)).name or "document.pdf"
    suffix = Path(source_name).suffix.lower() or ".bin"
    stem = re.sub(r"[^A-Za-z0-9._-]+", "-", Path(source_name).stem).strip("-") or "document"
    digest = hashlib.sha256(url.encode("utf-8")).hexdigest()[:12]
    return output / f"{stem}-{digest}{suffix}"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--inventory", type=Path, default=Path("research/cas-content-inventory.json"))
    parser.add_argument("--output", type=Path, default=Path("source-assets/documents"))
    parser.add_argument("--report", type=Path, default=Path("research/cas-document-downloads.csv"))
    parser.add_argument("--delay", type=float, default=0.12)
    args = parser.parse_args()

    inventory = json.loads(args.inventory.read_text(encoding="utf-8"))
    documents = [asset for asset in inventory["assets"] if asset["type"] == "document"]
    args.output.mkdir(parents=True, exist_ok=True)
    args.report.parent.mkdir(parents=True, exist_ok=True)

    session = requests.Session()
    session.headers.update(
        {"User-Agent": "CAS-website-content-inventory/1.0 (+migration planning; contact site owner)"}
    )
    rows: list[dict] = []
    for index, asset in enumerate(documents, start=1):
        destination = destination_for(asset["url"], args.output)
        row = {
            "url": asset["url"],
            "source_page": asset["source_page"],
            "status": "",
            "content_type": "",
            "bytes": "",
            "sha256": "",
            "local_path": destination.as_posix(),
            "error": "",
        }
        if destination.exists():
            content = destination.read_bytes()
            row.update(
                {
                    "status": "cached",
                    "bytes": len(content),
                    "sha256": hashlib.sha256(content).hexdigest(),
                }
            )
            rows.append(row)
            print(f"[{index:03}/{len(documents)}] cached {asset['url']}", flush=True)
            continue
        try:
            with session.get(asset["url"], timeout=60, allow_redirects=True, stream=True) as response:
                row["status"] = response.status_code
                row["content_type"] = response.headers.get("content-type", "")
                response.raise_for_status()
                digest = hashlib.sha256()
                byte_count = 0
                with destination.open("wb") as handle:
                    for chunk in response.iter_content(chunk_size=128 * 1024):
                        if not chunk:
                            continue
                        handle.write(chunk)
                        digest.update(chunk)
                        byte_count += len(chunk)
                row["bytes"] = byte_count
                row["sha256"] = digest.hexdigest()
            print(f"[{index:03}/{len(documents)}] {row['status']} {asset['url']}", flush=True)
        except requests.RequestException as error:
            row["error"] = str(error)
            if destination.exists():
                destination.unlink()
            print(f"[{index:03}/{len(documents)}] error {asset['url']}", flush=True)
        rows.append(row)
        time.sleep(args.delay)

    with args.report.open("w", newline="", encoding="utf-8-sig") as handle:
        fields = ["url", "source_page", "status", "content_type", "bytes", "sha256", "local_path", "error"]
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        writer.writerows(rows)

    successful = sum(1 for row in rows if row["status"] in {200, "cached"})
    print(json.dumps({"documents": len(rows), "successful": successful, "failed": len(rows) - successful}, indent=2))


if __name__ == "__main__":
    main()
