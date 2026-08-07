"""
Program pages: /academics/programs/ (all-programs directory),
/academics/{btech,mtech,phd}/ (level listings), and one detail page per
record in build/data/programs.py at /academics/programs/<slug>/.

All generated from the same PROGRAMS data — one source of truth, no
hand-duplicated program markup (Development Rules: avoid duplicate code).
"""
from __future__ import annotations

import html
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from data.programs import PROGRAMS  # noqa: E402
from detail import render_program_detail  # noqa: E402

ADMISSIONS_PATH_BY_LEVEL = {
    "B.Tech": "admissions/",
    "M.Tech": "admissions/",
    "Ph.D.": "admissions/",
}


LEVEL_ORDER = ["B.Tech", "M.Tech", "Ph.D."]


def _row_meta(p: dict) -> str:
    """The useful facts about a programme, not an echo of its own name.

    The department was previously the only thing shown beside each row, which
    on this data restates the title almost verbatim — "M.Tech. Nanotechnology"
    against "Nanotechnology". Seats and approval are what a visitor scanning
    the list actually wants, so they come first and the department appears
    only when it adds something the title does not already say."""
    bits = []
    if p.get("seats"):
        bits.append(html.escape(p["seats"]))
    if p.get("approval"):
        bits.append(html.escape(p["approval"]))
    if not bits:
        dept = p.get("department") or ""
        if dept and dept.lower() not in p["title"].lower():
            bits.append(html.escape(dept))
    return " &middot; ".join(bits)


def _listing_rows(programs: list[dict], prefix: str) -> str:
    rows = []
    for p in programs:
        rows.append(
            f'<li class="record-row">'
            f'<div class="record-row__title">'
            f'<a href="{prefix}academics/programs/{p["slug"]}/">{html.escape(p["title"])}</a></div>'
            f'<div class="record-row__meta">{_row_meta(p)}</div>'
            f"</li>"
        )
    return "".join(rows)


def _grouped_sections(prefix: str) -> str:
    """All-programs directory, grouped by level rather than one flat run of
    nine rows in which B.Tech, M.Tech and Ph.D. records are indistinguishable."""
    out = []
    for level in LEVEL_ORDER:
        group = [p for p in PROGRAMS if p["level"] == level]
        if not group:
            continue
        out.append(f"""
    <div class="sec-head reveal" style="margin-top:var(--space-12)"><div class="sec-head__text">
      <p class="eyebrow">{html.escape(level)}</p>
      <h2>{len(group)} {html.escape(level)} programme{'s' if len(group) != 1 else ''}</h2>
    </div></div>
    <ul class="record-list reveal">{_listing_rows(group, prefix)}</ul>""")
    return "".join(out)


def _level_page(render_page, level: str, output_rel_path: str, breadcrumb_label: str, active_nav: str) -> None:
    prefix = "../../"
    programs = [p for p in PROGRAMS if p["level"] == level]
    content = f"""
<div class="page-head container">
  <p class="eyebrow">Programmes</p>
  <h1>{html.escape(level)}</h1>
  <p class="lede">{len(programs)} {html.escape(level)} programme record{'s' if len(programs) != 1 else ''}
  migrated so far.</p>
  <div class="hero__actions" style="margin-top:var(--space-8)">
    <a class="btn btn--lg btn--primary" href="{prefix}{ADMISSIONS_PATH_BY_LEVEL[level]}">See {html.escape(level)} admissions</a>
  </div>
</div>
<section class="section section--flush-top">
  <div class="container">
    <ul class="record-list reveal">{_listing_rows(programs, prefix)}</ul>
  </div>
</section>
""".strip()
    render_page(
        output_rel_path=output_rel_path,
        title=level,
        description=f"{level} programs offered at Centre for Advanced Studies (CAS), AKTU.",
        content_html=content,
        active_nav=active_nav,
        breadcrumb_items=[("Academics", "/academics/"), (breadcrumb_label, None)],
    )


def build(render_page, load_content, root: Path) -> None:
    # All-programs directory
    prefix = "../../"
    content = f"""
<div class="page-head container">
  <p class="eyebrow">Academics</p>
  <h1>All programmes</h1>
  <p class="lede">{len(PROGRAMS)} programme records migrated so far, across B.Tech, M.Tech and Ph.D.</p>
  <div class="hero__actions" style="margin-top:var(--space-8)">
    <a class="btn btn--lg btn--primary" href="{prefix}admissions/">Admissions 2026&ndash;27</a>
  </div>
</div>
<section class="section section--flush-top">
  <div class="container">{_grouped_sections(prefix)}
  </div>
</section>
""".strip()
    render_page(
        output_rel_path="academics/programs/index.html",
        title="All programs",
        description="All B.Tech, M.Tech, and Ph.D. programs at Centre for Advanced Studies (CAS), AKTU.",
        content_html=content,
        active_nav="academics",
        breadcrumb_items=[("Academics", "/academics/"), ("All programs", None)],
    )

    # Level listings
    _level_page(render_page, "B.Tech", "academics/btech/index.html", "B.Tech", "academics")
    _level_page(render_page, "M.Tech", "academics/mtech/index.html", "M.Tech", "academics")
    _level_page(render_page, "Ph.D.", "academics/phd/index.html", "Ph.D.", "academics")

    # Detail pages
    prefix3 = "../../../"
    for p in PROGRAMS:
        content = render_program_detail(
            p,
            admissions_path=prefix3 + ADMISSIONS_PATH_BY_LEVEL[p["level"]],
            prefix=prefix3,
        )
        render_page(
            output_rel_path=f"academics/programs/{p['slug']}/index.html",
            title=p["title"],
            description=f"{p['title']} at Centre for Advanced Studies (CAS), AKTU — overview, eligibility, and facilities.",
            content_html=content,
            active_nav="academics",
            breadcrumb_items=[
                ("Academics", "/academics/"),
                ("All programs", "/academics/programs/"),
                (p["title"], None),
            ],
        )
