"""
Document library: /documents/ (grouped listing) + one page per record at
/documents/<slug>/.

Unlike people/programs, this record type is built directly from the
research CSVs at build time rather than hand-transcribed into a Python data
file — the source is already structured tabular data (URL, label, checksum,
file size), so re-typing it by hand would only add transcription risk with
no accuracy benefit. Real PDF files are copied into site/assets/documents/
so downloads actually work (FR-08: "zero broken public files").

Editorial normalization applied here (all mechanical, not invented):
  - Deduplicate by SHA-256: 3 of 161 downloaded files are the same PDF
    fetched from two URL-encoding variants of the same legacy path
    (CONTENT_MIGRATION_LAUNCH.md flags exactly this: "research1.html"/
    "Research1.html" case-variant problem, same pattern here).
  - Titles: use the real link label when it's descriptive; fall back to a
    cleaned-up filename when the source label is UI chrome ("click here",
    "pdf", "view flyer" — 47 of 161 records). Never publish a raw filename
    with its hash suffix as a title.
  - Type: classified from keywords in the title/filename against the
    Document type taxonomy in docs/INFORMATION_ARCHITECTURE.md #4. Falls
    back to "Other" rather than guessing.
"""
from __future__ import annotations

import csv
import html
import re
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from icons import icon  # noqa: E402

RESEARCH = None  # set in build()

DOC_TYPE_KEYWORDS = [
    ("Ordinance", ["ordinance"]),
    ("Timetable", ["time table", "timetable", "tt-", " tt "]),
    ("Calendar", ["calender", "calendar"]),
    ("Syllabus", ["syllabus", "scheme and syllabus", "programme structure", "program structure", "program stucture"]),
    ("Fee notice", ["fee", "fees"]),
    ("Newsletter", ["newsletter", "magzine", "magazine", "agragaman"]),
    ("Publication list", ["publication", "scie journal", "list of scie"]),
    ("Guideline", ["guideline", "guidelines", "notice", "circular", "attendance", "registration", "counselling", "reporting"]),
    ("Report", ["report", "nirf"]),
    ("Form", ["form", "undertaking", "application"]),
]

# Which part of the legacy site linked the document. This is the strongest
# facet available and, unlike the type classifier, it is a *fact* rather than
# an inference: the crawl recorded the page each file was linked from.
#
# It exists because type alone is close to useless for filtering here — 119 of
# 158 records classify as "Other" and 152 carry no session, so a type filter
# leaves three quarters of the library in one bucket. Area spreads the same
# 158 records across eleven meaningful groups.
#
# Anything not listed falls to "Unassigned" rather than being guessed at.
AREA_BY_SOURCE_PAGE = {
    "research1.html": "Research",
    "workshops.html": "Workshops & training",
    "library.html": "Library resources",
    "notices.html": "Notices & circulars",
    "infra.html": "Facilities & infrastructure",
    "faculty.html": "People — faculty",
    "pastfaculty.html": "People — former faculty",
    "visitingfaculty.html": "People — visiting faculty",
    "btech.html": "B.Tech",
    "mtechcse.html": "M.Tech — Computer Science & Engineering",
    "mtechmanufacturing.html": "M.Tech — Manufacturing Technology & Automation",
    "mtechmecha.html": "M.Tech — Mechatronics",
    "mtechnano.html": "M.Tech — Nanotechnology",
    "mtechenergy.html": "M.Tech — Energy Science & Technology",
}

_YEAR_RE = re.compile(r"\b(20[0-2]\d)\b")


def classify_area(source_page: str) -> str:
    """Area is read from the linking page, lower-cased so the legacy site's
    inconsistent capitalisation (Btech.html vs btech.html, Mtechcse.html vs
    mtechcse.html) does not split one area into two."""
    leaf = (source_page or "").rstrip("/").split("/")[-1].lower()
    return AREA_BY_SOURCE_PAGE.get(leaf, "Unassigned")


def extract_year(title: str, source_url: str) -> str | None:
    """Earliest plausible 4-digit year mentioned in the title or the original
    filename. Only 32 of 158 records carry one; the rest are honestly labelled
    "Not dated" rather than being assigned a fabricated date."""
    years = _YEAR_RE.findall(f"{title} {source_url}")
    return min(years) if years else None


JUNK_LABELS = {
    "click here", "pdf", "click here to view more", "download resume",
    "view flyer", "(view details)", "students", "report", "→", "",
    "workshop details",  # repeats ~29 times across workshops.html, describes the
                          # action ("see details"), not the content — see module docstring
}


def classify_type(title: str, filename: str) -> str:
    hay = (title + " " + filename).lower()
    for doc_type, keywords in DOC_TYPE_KEYWORDS:
        if any(k in hay for k in keywords):
            return doc_type
    return "Other"


def clean_title_from_filename(filename: str) -> str:
    # strip the trailing "-<12 hex char hash>" the crawler appended, and the extension
    stem = re.sub(r"-[0-9a-f]{12}$", "", Path(filename).stem)
    words = re.sub(r"[-_]+", " ", stem).strip()
    words = re.sub(r"\s+", " ", words)
    return words[:1].upper() + words[1:] if words else "Untitled document"


def _source_page_slug(source_page: str) -> str:
    return Path(source_page.rstrip("/")).stem or "cas.res.in"


def derive_title(raw_label: str, filename: str, source_page: str = "", label_counts: dict | None = None) -> str:
    label = raw_label.strip().lstrip("→").strip()
    # A label repeated many times across the dataset describes the *action*
    # ("see the list", "view details"), not this specific document, even if
    # it isn't in the fixed JUNK_LABELS set — e.g. "List of Research
    # Publication" is the real anchor text for 18 different people's PDFs.
    # Root-caused from a real bug: the fixed set alone missed "Workshop
    # Details" (29 repeats) until this general rule was added.
    is_generic_by_repetition = label_counts is not None and label_counts.get(label.lower(), 0) >= 2
    if label.lower() in JUNK_LABELS or len(label) < 4 or is_generic_by_repetition:
        cleaned = clean_title_from_filename(filename)
        # A bare number ("1", "17") or single short token can't be told apart
        # from its siblings without matching it to the right table row on the
        # source page, which the crawl doesn't record precisely enough to do
        # safely (see module docstring — same "don't guess pairing" policy
        # as the faculty external-profile links). Label it honestly instead
        # of implying false precision.
        if cleaned.isdigit() or len(cleaned) <= 2:
            page = _source_page_slug(source_page)
            return f"Untitled attachment from {page} (item {cleaned})"
        return cleaned
    # normalize whitespace and stray straight-quote artifacts from the crawl
    return re.sub(r"\s+", " ", label)


def extract_session(text: str) -> str | None:
    m = re.search(r"20\d{2}-\d{2}", text)
    return m.group(0) if m else None


def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:60] or "document"


def format_size(num_bytes: int) -> str:
    mb = num_bytes / (1024 * 1024)
    if mb >= 1:
        return f"{mb:.1f} MB"
    return f"{num_bytes / 1024:.0f} KB"


def load_records(root: Path) -> list[dict]:
    with open(root / "research/cas-asset-inventory.csv", encoding="utf-8-sig") as f:
        assets_by_url = {r["url"]: r for r in csv.DictReader(f) if r["type"] == "document"}

    with open(root / "research/cas-document-downloads.csv", encoding="utf-8-sig") as f:
        downloads = [r for r in csv.DictReader(f) if r["status"] == "cached" and r["local_path"]]

    label_counts: dict[str, int] = {}
    for row in downloads:
        label = assets_by_url.get(row["url"], {}).get("alt_or_label", "").strip().lstrip("→").strip().lower()
        if label:
            label_counts[label] = label_counts.get(label, 0) + 1

    seen_hashes: set[str] = set()
    records = []
    used_slugs: set[str] = set()
    for row in downloads:
        h = row["sha256"]
        if h in seen_hashes:
            continue  # duplicate content at a different URL — keep first only
        seen_hashes.add(h)

        asset = assets_by_url.get(row["url"], {})
        local_path = root / row["local_path"]
        if not local_path.exists():
            continue  # be defensive: don't reference a file that isn't actually on disk

        filename = Path(row["local_path"]).name
        source_page = asset.get("source_page") or row.get("source_page", "")
        title = derive_title(asset.get("alt_or_label", ""), filename, source_page, label_counts)
        doc_type = classify_type(title, filename)
        session = extract_session(title)

        slug = slugify(title)
        base_slug = slug
        n = 2
        while slug in used_slugs:
            slug = f"{base_slug}-{n}"
            n += 1
        used_slugs.add(slug)

        records.append(
            {
                "slug": slug,
                "title": title,
                "type": doc_type,
                "area": classify_area(source_page),
                "year": extract_year(title, row["url"]),
                "session": session,
                "size_bytes": int(row["bytes"]) if row["bytes"] else 0,
                "source_page": asset.get("source_page") or row.get("source_page", ""),
                "source_url": row["url"],
                "sha256": row["sha256"],
                "src_path": local_path,
                "filename": f"{slug}.pdf",
            }
        )
    records.sort(key=lambda r: r["title"].lower())
    return records


def _listing_rows(records: list[dict], prefix: str, *, faceted: bool = False) -> str:
    """`faceted=True` adds the data- attributes facets.js filters and sorts on.

    Every one of the 158 rows is present in the HTML. Filtering hides rows
    rather than fetching them, so the complete library is readable, printable
    and Ctrl-F-able with scripting switched off, and search engines see the
    whole set on one URL."""
    rows = []
    for r in records:
        attrs = ""
        if faceted:
            attrs = (
                f' data-area="{html.escape(r["area"], quote=True)}"'
                f' data-type="{html.escape(r["type"], quote=True)}"'
                f' data-year="{r["year"] or ""}"'
                f' data-size="{r["size_bytes"]}"'
                f' data-title="{html.escape(r["title"].lower(), quote=True)}"'
            )
        meta_bits = [html.escape(r["type"])]
        if r["area"] != "Unassigned":
            meta_bits.append(html.escape(r["area"]))
        if r["year"]:
            meta_bits.append(r["year"])
        rows.append(
            f'<li class="record-row"{attrs}>'
            f'<div class="record-row__title"><a href="{prefix}documents/{r["slug"]}/">{html.escape(r["title"])}</a></div>'
            f'<div class="record-row__meta">{" &middot; ".join(meta_bits)}</div>'
            f'<div class="record-row__meta">PDF, {format_size(r["size_bytes"])}</div>'
            f"</li>"
        )
    return "".join(rows)


def _facet_group(key: str, legend: str, counts: dict[str, int]) -> str:
    """One filter group. Counts are computed at build time and shown up front,
    so a visitor can see a filter is worth applying before applying it."""
    boxes = []
    for value, n in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0])):
        vid = f"f-{key}-{slugify(value)}"
        boxes.append(
            f'<div class="facet__opt">'
            f'<input type="checkbox" id="{vid}" value="{html.escape(value, quote=True)}" '
            f'data-facet="{key}">'
            f'<label for="{vid}">{html.escape(value)}'
            f'<span class="facet__count" data-facet-count>{n}</span></label>'
            f"</div>"
        )
    return (
        f'<fieldset class="facet"><legend class="facet__legend">{html.escape(legend)}</legend>'
        f'{"".join(boxes)}</fieldset>'
    )


def build(render_page, load_content, root: Path) -> None:
    records = load_records(root)

    dest_dir = root / "site" / "assets" / "documents"
    dest_dir.mkdir(parents=True, exist_ok=True)
    for r in records:
        shutil.copyfile(r["src_path"], dest_dir / r["filename"])

    # --- Library landing: one faceted list ---
    #
    # This was 158 records in ten type-grouped stacks with no way to narrow
    # them: on a phone, roughly 28 screens of scrolling to find a fee
    # structure. It is now a single filterable list.
    #
    # The facet rail ships `hidden` and is revealed by facets.js. A static
    # host cannot answer a query string, so shipping visible controls that do
    # nothing without JavaScript would be worse than shipping none — with
    # scripting off the page is simply the complete 158-record list, which is
    # what it always was.
    prefix1 = "../"

    def counts(field: str) -> dict[str, int]:
        out: dict[str, int] = {}
        for r in records:
            v = r[field]
            if v:
                out[v] = out.get(v, 0) + 1
        return out

    year_counts = counts("year")
    year_counts["Not dated"] = sum(1 for r in records if not r["year"])

    facet_rail = (
        _facet_group("area", "Area", counts("area"))
        + _facet_group("type", "Type", counts("type"))
        + _facet_group("year", "Year", year_counts)
    )

    landing_content = f"""
<div class="page-head container">
  <p class="eyebrow">Records</p>
  <h1>Document library</h1>
  <p class="lede">{len(records)} official documents migrated from the legacy site.</p>
</div>
<section class="section section--flush-top">
  <div class="container">
    <p class="migration-notice" role="note">Every document below passed a basic sanity check (file exists on disk, matched to a real source URL) but has <strong>not</strong> been through the malware scan, accessibility remediation, or current/archived status review that PRODUCT_REQUIREMENTS.md FR-08 and TECHNICAL_SECURITY_OPERATIONS.md &sect;4 require before public launch. Treat this as a migration working set, not a launch-ready library.</p>

    <div class="browse" data-facets data-total="{len(records)}">
      <button type="button" class="btn btn--secondary browse__sheet-open" data-facet-sheet-open hidden>
        {icon("filter", 16)} Filters <span class="badge" data-facet-applied-count hidden>0</span>
      </button>

      <aside class="browse__rail" data-facet-rail hidden aria-label="Filter documents">
        <div class="browse__rail-head">
          <h2 class="browse__rail-title">Filter</h2>
          <button type="button" class="btn btn--ghost btn--sm" data-facet-clear hidden>Clear all</button>
          <button type="button" class="icon-btn browse__sheet-close" data-facet-sheet-close hidden
                  aria-label="Close filters">{icon("close", 20)}</button>
        </div>
        {facet_rail}
      </aside>

      <div class="browse__results">
        <div class="browse__bar">
          <div class="browse__search" data-facet-searchwrap hidden>
            <label for="doc-search" class="u-visually-hidden">Filter documents by title</label>
            <input type="search" id="doc-search" class="field" data-facet-search
                   placeholder="Filter by title&hellip;" autocomplete="off">
          </div>
          <div class="browse__sort" data-facet-sortwrap hidden>
            <label for="doc-sort" class="u-visually-hidden">Sort documents</label>
            <select id="doc-sort" class="field" data-facet-sort>
              <option value="title">Title A&ndash;Z</option>
              <option value="-title">Title Z&ndash;A</option>
              <option value="-year">Newest first</option>
              <option value="-size">Largest file</option>
              <option value="size">Smallest file</option>
            </select>
          </div>
        </div>

        <div class="chips" data-facet-chips hidden></div>

        <p class="browse__count" data-facet-status role="status" aria-live="polite">{len(records)} documents</p>

        <ul class="record-list" data-facet-list>{_listing_rows(records, prefix1, faceted=True)}</ul>

        <div class="empty-state" data-facet-empty hidden>
          {icon("search", 28)}
          <p class="empty-state__title">No documents match these filters</p>
          <p class="empty-state__body" data-facet-empty-detail></p>
          <button type="button" class="btn btn--secondary" data-facet-clear-2>Clear all filters</button>
        </div>

        <div class="browse__more" data-facet-more hidden>
          <button type="button" class="btn btn--secondary" data-facet-load-more></button>
        </div>
      </div>
    </div>
  </div>
</section>
""".strip()
    render_page(
        output_rel_path="documents/index.html",
        title="Document library",
        description="Official CAS AKTU documents: ordinances, syllabi, calendars, fee notices, and more.",
        content_html=landing_content,
        active_nav=None,
        breadcrumb_items=[("Document library", None)],
        page_scripts=["facets.js"],
    )

    # --- Detail pages ---
    prefix2 = "../../"
    for r in records:
        content = f"""
<div class="u-band u-container">
  <h1>{html.escape(r['title'])}</h1>
  <ul class="record-list">
    <li class="record-row"><div class="record-row__title">Type</div><div class="record-row__meta">{html.escape(r['type'])}</div></li>
    <li class="record-row"><div class="record-row__title">Format</div><div class="record-row__meta">PDF, {format_size(r['size_bytes'])}</div></li>
    <li class="record-row"><div class="record-row__title">Session</div><div class="record-row__meta">{html.escape(r['session']) if r['session'] else 'Not stated in source'}</div></li>
    <li class="record-row"><div class="record-row__title">Status</div><div class="record-row__meta"><span class="badge badge--draft">Unreviewed migration copy</span></div></li>
  </ul>
  <div class="hero__actions" style="margin:var(--space-16) 0">
    <a class="btn btn--primary btn--download" href="{prefix2}assets/documents/{r['filename']}">Download PDF ({format_size(r['size_bytes'])})</a>
  </div>
  <h2>Provenance</h2>
  <p class="record-row__meta">Originally linked from <code>{html.escape(r['source_page'])}</code> &middot;
  source file <code>{html.escape(r['source_url'])}</code> &middot; SHA-256 <code>{html.escape(r['sha256'][:16])}&hellip;</code></p>
  <h2>Accessibility</h2>
  <p class="record-row__meta">Not yet checked for tagging, reading order, or screen-reader compatibility
  (UX_UI_SPECIFICATION.md &sect;8: "PDFs must be tagged, ordered, titled, searchable, and checked"). An HTML
  summary is not yet available for this document.</p>
  <h2>Related</h2>
  <p class="record-row__meta">Program/notice relationships pending (Stage 3.4 continued).</p>
</div>
""".strip()
        render_page(
            output_rel_path=f"documents/{r['slug']}/index.html",
            title=r["title"],
            description=f"{r['title']} — official document, Centre for Advanced Studies (CAS), AKTU.",
            content_html=content,
            active_nav=None,
            breadcrumb_items=[("Document library", "/documents/"), (r["title"], None)],
        )
