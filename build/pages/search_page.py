"""
Search page: /search/. Must run after every other content-generating page
module (registered last in build/generate.py's PAGE_MODULES) so the index
it scans reflects everything actually built, not a stale snapshot.

The index is emitted as a standalone script — assets/js/search-index.js,
assigning window.__CAS_INDEX__ — rather than inlined into this page.

fetch() against a file:// page is blocked by Chromium's CORS policy, and the
site is reviewed by opening site/index.html from disk, so a fetched JSON
index would work in production and silently fail in review. A *classic
script* has no such restriction: it loads over file:// and http alike. The
palette injects it on first open, so the index costs nothing until someone
searches, and is then cached for every subsequent page.

That matters because the index is no longer just this page's concern — the
command palette is on all 392 pages. Inlining 55KB into each of them would
have been indefensible; this way the bytes are lazy and shared, and /search/
itself drops from 49KB of inline JSON to zero.
"""
from __future__ import annotations

import json
import re
from html import unescape as html_unescape
from pathlib import Path

EXCLUDE_FILES = {"404.html", "500.html", "maintenance.html"}
EXCLUDE_DIRS = {"search"}

TITLE_RE = re.compile(r"<title>(.*?)</title>")
DESC_RE = re.compile(r'<meta name="description" content="(.*?)"')

# Every page's meta description ends with the same institutional sign-off, so
# 361 of 389 descriptions were ~half boilerplate. Indexing it would have made
# every record match "centre", "advanced", "studies" and "AKTU" — noise that
# ranks everything equally. Stripped, the remainder is genuinely
# distinguishing ("22 Dell Optiplex i7 systems running Ubuntu Linux and Kali
# Linux") and searchable.
BOILERPLATE = [
    re.compile(r"\s*[—\-–]\s*official document, Centre for Advanced Studies \(CAS\), AKTU\.?", re.I),
    re.compile(r"\s*at Centre for Advanced Studies \(CAS\), AKTU\.?", re.I),
    re.compile(r"\s*[—\-–]\s*Centre for Advanced Studies \(CAS\), AKTU\.?", re.I),
    re.compile(r"\s*Centre for Advanced Studies \(CAS\), AKTU\.?", re.I),
]


def _summary(page_html: str, title: str) -> str:
    """Distinguishing part of the meta description, or "" if it only repeats
    the title. Carried into the index so search can match on more than the
    title — the single largest complaint in the UX audit."""
    m = DESC_RE.search(page_html)
    if not m:
        return ""
    d = html_unescape(m.group(1))
    for pat in BOILERPLATE:
        d = pat.sub("", d)
    d = d.strip(" .—-–—")
    return "" if (not d or d.lower() in title.lower()) else d


def _section_label(rel_path: str) -> str:
    top = rel_path.split("/", 1)[0]
    return {
        "about": "About", "academics": "Academics", "admissions": "Admissions",
        "research": "Research", "people": "People", "campus": "Campus",
        "updates": "News & Notices", "documents": "Documents",
    }.get(top, top.replace("-", " ").title() or "Home")


def build_index(site_dir: Path) -> list[dict]:
    entries = []
    for f in sorted(site_dir.rglob("index.html")):
        rel = f.relative_to(site_dir).as_posix()
        if rel == "index.html":
            path, title, section = "", "Home", "Home"
        else:
            top_dir = rel.split("/", 1)[0]
            if top_dir in EXCLUDE_DIRS:
                continue
            path = rel[: -len("index.html")]
            page_html = f.read_text(encoding="utf-8")
            title_match = TITLE_RE.search(page_html)
            raw_title = title_match.group(1) if title_match else path
            title = raw_title.split(" | Centre for Advanced Studies")[0]
            section = _section_label(rel)
            summary = _summary(page_html, title)
        # Short keys: this ships 388 times, so "t" instead of "title" is worth
        # roughly 6KB across the file.
        entry = {"t": title, "p": path or ".", "s": section}
        if rel != "index.html" and summary:
            entry["d"] = summary
        entries.append(entry)
    for name in EXCLUDE_FILES:
        entries = [e for e in entries if e["p"] != name]
    return entries


def build(render_page, load_content, root: Path) -> None:
    site_dir = root / "site"
    index = build_index(site_dir)

    # Written straight into the generated tree, after copy_assets() has run,
    # so it is not overwritten by the hand-authored assets/js/ copy step.
    index_js = site_dir / "assets" / "js" / "search-index.js"
    index_js.parent.mkdir(parents=True, exist_ok=True)
    index_js.write_text(
        "window.__CAS_INDEX__=" + json.dumps(index, separators=(",", ":"), ensure_ascii=False) + ";",
        encoding="utf-8",
    )
    print(f"wrote {index_js.relative_to(root)} ({len(index)} entries, "
          f"{index_js.stat().st_size / 1024:.1f} KB, loaded on demand)")

    content = """
<div class="page-head container">
  <p class="eyebrow">Find</p>
  <h1>Search</h1>
  <p class="lede">Search page titles and summaries across the site. Press
  <kbd class="kbd">Ctrl</kbd>&thinsp;+&thinsp;<kbd class="kbd">K</kbd> from any page to open the
  quick search.</p>
</div>
<section class="section section--flush-top">
  <div class="container">
    <div style="max-width:var(--prose)">
      <label for="search-input" class="u-visually-hidden">Search this site</label>
      <input id="search-input" class="field field--lg" type="search" data-search-input
             placeholder="Search programmes, people, notices, documents&hellip;">
    </div>
    <p data-search-status role="status" aria-live="polite" class="browse__count"
       style="margin-top:var(--space-6)"></p>
    <ul class="record-list" data-search-results></ul>
    <p class="migration-notice" role="note" style="margin-top:var(--space-12)">This index covers page
    titles and summaries, not full page body text, and has no synonym dictionary or relevance-tuned
    ranker — see PRODUCT_REQUIREMENTS.md FR-09 for the full search requirements still outstanding.</p>
  </div>
</section>
""".strip()
    render_page(
        output_rel_path="search/index.html",
        title="Search",
        description="Search Centre for Advanced Studies (CAS), AKTU website.",
        content_html=content,
        active_nav=None,
        breadcrumb_items=[("Search", None)],
        page_scripts=["search.js"],
    )
