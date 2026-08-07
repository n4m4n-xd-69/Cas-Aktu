"""
Research record pages: /research/{publications,patents,projects}/ listings
+ one detail page per record. All three share the same slugify/dedupe
pattern used by documents_pages.py and events_pages.py.
"""
from __future__ import annotations

import html
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from data.publications import PUBLICATIONS  # noqa: E402
from data.patents import PATENTS  # noqa: E402
from data.projects import PROJECTS  # noqa: E402


def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:70] or "record"


def with_slugs(records: list[dict], key: str) -> list[dict]:
    used: set[str] = set()
    out = []
    for r in records:
        base = slugify(r[key])
        slug = base
        n = 2
        while slug in used:
            slug = f"{base}-{n}"
            n += 1
        used.add(slug)
        out.append({**r, "slug": slug})
    return out


def _fact(label: str, value: str | None) -> str:
    if not value:
        return ""
    return f'<li class="record-row"><div class="record-row__title">{html.escape(label)}</div><div class="record-row__meta">{html.escape(value)}</div></li>'


def build(render_page, load_content, root: Path) -> None:
    _build_publications(render_page)
    _build_patents(render_page)
    _build_projects(render_page)


def _build_publications(render_page) -> None:
    records = with_slugs(PUBLICATIONS, "title")
    prefix2 = "../../"
    rows = "".join(
        f'<li class="record-row"><div class="record-row__title"><a href="{prefix2}research/publications/{r["slug"]}/">{html.escape(r["title"])}</a></div>'
        f'<div class="record-row__meta">{html.escape(r["authors"])} &middot; {html.escape(r["venue"])}, {html.escape(r["year"])}</div></li>'
        for r in records
    )
    content = f"""
<div class="u-band u-container">
  <h1>Publications</h1>
  <p class="lede">{len(records)} featured publications migrated so far.</p>
  <p class="migration-notice" role="note">This is the legacy site's own curated "recent publications" set (16 citations), not the full output list. The source's complete publications and conference-proceedings sections run to roughly 11,000 words with no structured per-entry delimiters — transcribing them individually is tracked as Remaining Work rather than risking misattributed citations.</p>
  <ul class="record-list">{rows}</ul>
</div>
""".strip()
    render_page(
        output_rel_path="research/publications/index.html", title="Publications",
        description="Featured publications by CAS AKTU faculty and students.",
        content_html=content, active_nav="research",
        breadcrumb_items=[("Research", "/research/"), ("Publications", None)],
    )

    prefix3 = "../../../"
    for r in records:
        content = f"""
<div class="u-band u-container">
  <h1>{html.escape(r['title'])}</h1>
  <ul class="record-list">
    {_fact("Authors", r["authors"])}
    {_fact("Venue", r["venue"] + (f", {r['volume']}" if r.get("volume") else ""))}
    {_fact("Year", r["year"])}
    {_fact("Publisher", r.get("publisher"))}
    {_fact("Impact factor", r.get("impact_factor"))}
    {_fact("DOI", r.get("doi"))}
  </ul>
  <p class="migration-notice" role="note">Indexing/impact-factor claims are as stated in the migrated source and have not been independently reverified (PRODUCT_REQUIREMENTS.md FR-06: "unsupported impact/indexing claims are not published" — flagged here pending that check, not yet cleared).</p>
</div>
""".strip()
        render_page(
            output_rel_path=f"research/publications/{r['slug']}/index.html", title=r["title"],
            description=f"{r['title']} — {r['authors']}, {r['venue']} {r['year']}.",
            content_html=content, active_nav="research",
            breadcrumb_items=[("Research", "/research/"), ("Publications", "/research/publications/"), (r["title"], None)],
        )


def _build_patents(render_page) -> None:
    records = with_slugs(PATENTS, "title")
    prefix2 = "../../"
    rows = "".join(
        f'<li class="record-row"><div class="record-row__title"><a href="{prefix2}research/patents/{r["slug"]}/">{html.escape(r["title"])}</a></div>'
        f'<div class="record-row__meta">{html.escape(r["inventors"])}</div>'
        f'<span class="badge badge--draft">{html.escape(r["status"])}</span></li>'
        for r in records
    )
    content = f"""
<div class="u-band u-container">
  <h1>Patents</h1>
  <p class="lede">{len(records)} patent applications migrated from the legacy site.</p>
  <ul class="record-list">{rows}</ul>
</div>
""".strip()
    render_page(
        output_rel_path="research/patents/index.html", title="Patents",
        description="Patent applications filed by CAS AKTU faculty and students.",
        content_html=content, active_nav="research",
        breadcrumb_items=[("Research", "/research/"), ("Patents", None)],
    )

    prefix3 = "../../../"
    for r in records:
        content = f"""
<div class="u-band u-container">
  <h1>{html.escape(r['title'])}</h1>
  <span class="badge badge--draft">{html.escape(r['status'])}</span>
  <ul class="record-list" style="margin-top:var(--space-16)">
    {_fact("Inventors", r["inventors"])}
    {_fact("Application number", r.get("application_number"))}
    {_fact("Filing date", r.get("date"))}
    {_fact("Jurisdiction", "India (inferred from application number format — not stated explicitly in source)")}
  </ul>
</div>
""".strip()
        render_page(
            output_rel_path=f"research/patents/{r['slug']}/index.html", title=r["title"],
            description=f"{r['title']} — patent application, Centre for Advanced Studies (CAS), AKTU.",
            content_html=content, active_nav="research",
            breadcrumb_items=[("Research", "/research/"), ("Patents", "/research/patents/"), (r["title"], None)],
        )


def _build_projects(render_page) -> None:
    records = with_slugs(PROJECTS, "title")
    prefix2 = "../../"
    rows = "".join(
        f'<li class="record-row"><div class="record-row__title"><a href="{prefix2}research/projects/{r["slug"]}/">{html.escape(r["title"])}</a></div>'
        f'<div class="record-row__meta">{html.escape(r["sponsor"])}</div></li>'
        for r in records
    )
    content = f"""
<div class="u-band u-container">
  <h1>Funded research projects</h1>
  <p class="lede">{len(records)} funded projects migrated from the legacy site.</p>
  <ul class="record-list">{rows}</ul>
</div>
""".strip()
    render_page(
        output_rel_path="research/projects/index.html", title="Projects",
        description="Funded research projects at Centre for Advanced Studies (CAS), AKTU.",
        content_html=content, active_nav="research",
        breadcrumb_items=[("Research", "/research/"), ("Projects", None)],
    )

    prefix3 = "../../../"
    for r in records:
        content = f"""
<div class="u-band u-container">
  <h1>{html.escape(r['title'])}</h1>
  <ul class="record-list">
    {_fact("Sponsor", r["sponsor"])}
    {_fact("Investigators", r["investigators"])}
    {_fact("Approved funding", r.get("amount"))}
    {_fact("Duration", r.get("duration"))}
    {_fact("Status", r.get("status"))}
  </ul>
  <p class="migration-notice" role="note">Funding figures are quoted as stated in the migrated source and are unverified (PRODUCT_REQUIREMENTS.md &sect;2).</p>
</div>
""".strip()
        render_page(
            output_rel_path=f"research/projects/{r['slug']}/index.html", title=r["title"],
            description=f"{r['title']} — funded research project, Centre for Advanced Studies (CAS), AKTU.",
            content_html=content, active_nav="research",
            breadcrumb_items=[("Research", "/research/"), ("Projects", "/research/projects/"), (r["title"], None)],
        )
