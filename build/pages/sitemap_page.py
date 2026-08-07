"""HTML sitemap — docs/INFORMATION_ARCHITECTURE.md #2/#9. Lists section
landing pages and listing pages (not all 300+ individual leaf records —
an unnavigable wall of links would defeat the point of a sitemap; the
listing pages it does show link on to every individual record)."""
from __future__ import annotations

from pathlib import Path

SECTIONS = [
    ("About", "/about/", []),
    ("Academics", "/academics/", [
        ("All programs", "/academics/programs/"), ("B.Tech", "/academics/btech/"),
        ("M.Tech", "/academics/mtech/"), ("Ph.D.", "/academics/phd/"),
    ]),
    ("Admissions", "/admissions/", []),
    ("Research", "/research/", [
        ("Publications", "/research/publications/"), ("Patents", "/research/patents/"),
        ("Projects", "/research/projects/"), ("Equipment", "/research/equipment/"),
        ("Facilities", "/research/facilities/"),
    ]),
    ("People", "/people/", [
        ("Faculty", "/people/faculty/"), ("Visiting faculty", "/people/visiting/"),
        ("Staff", "/people/staff/"), ("Former faculty", "/people/former/"),
    ]),
    ("Campus", "/campus/", []),
    ("News & Notices", "/updates/", [
        ("Notices", "/updates/notices/"), ("Events", "/updates/events/"),
    ]),
    ("Documents", "/documents/", []),
    ("Resources", None, [
        ("Search", "/search/"), ("Contact", "/contact/"), ("Accessibility statement", "/accessibility/"),
        ("Privacy notice", "/privacy/"), ("Terms & disclaimer", "/terms/"), ("Copyright", "/copyright/"),
        ("Security reporting", "/security/"),
    ]),
]


def build(render_page, load_content, root: Path) -> None:
    prefix = "../"
    groups = []
    for label, top_path, children in SECTIONS:
        top_link = f'<h2><a href="{prefix}{top_path.strip("/")}/">{label}</a></h2>' if top_path else f"<h2>{label}</h2>"
        child_items = "".join(
            f'<li class="record-row"><div class="record-row__title"><a href="{prefix}{p.strip("/")}/">{c}</a></div></li>'
            for c, p in children
        )
        child_html = f'<ul class="record-list">{child_items}</ul>' if children else ""
        groups.append(f"<div>{top_link}{child_html}</div>")

    content = f"""
<div class="u-band u-container">
  <h1>Sitemap</h1>
  <p class="lede">Section and listing pages. Individual
  records (people, documents, notices, publications, and more) are linked from their listing page above,
  not repeated here.</p>
  <div class="card-grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">{"".join(groups)}</div>
</div>
""".strip()
    render_page(
        output_rel_path="sitemap/index.html", title="Sitemap",
        description="Sitemap of Centre for Advanced Studies (CAS), AKTU website.",
        content_html=content, active_nav=None, breadcrumb_items=[("Sitemap", None)],
    )
