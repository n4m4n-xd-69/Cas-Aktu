"""
People pages: /people/{faculty,visiting,staff}/ listings and one detail page
per record in build/data/people.py at /people/<category>/<slug>/.
"""
from __future__ import annotations

import html
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from data.people import CURRENT_FACULTY, VISITING_FACULTY, STAFF  # noqa: E402
from data.past_faculty import PAST_FACULTY  # noqa: E402
from detail import render_person_detail, CATEGORY_LABELS  # noqa: E402

CATEGORIES = [
    ("faculty", CURRENT_FACULTY, "people/faculty/"),
    ("visiting", VISITING_FACULTY, "people/visiting/"),
    ("staff", STAFF, "people/staff/"),
    ("former", PAST_FACULTY, "people/former/"),
]


def _listing_rows(people: list[dict], category: str, prefix: str) -> str:
    rows = []
    for p in people:
        rows.append(
            f'<li class="record-row">'
            f'<div class="record-row__title"><a href="{prefix}people/{category}/{p["slug"]}/">{html.escape(p["name"])}</a></div>'
            f'<div class="record-row__meta">{html.escape(p["title"])}</div>'
            f"</li>"
        )
    return "".join(rows)


def build(render_page, load_content, root: Path) -> None:
    prefix2 = "../../"
    prefix3 = "../../../"

    for category, people, output_dir in CATEGORIES:
        label = CATEGORY_LABELS[category]
        content = f"""
<div class="u-band u-container">
  <h1>{html.escape(label)}</h1>
  <p class="lede">{len(people)} {html.escape(label.lower())} record(s) migrated so far.</p>
  <ul class="record-list">{_listing_rows(people, category, prefix2)}</ul>
</div>
""".strip()
        render_page(
            output_rel_path=f"{output_dir}index.html",
            title=label,
            description=f"{label} at Centre for Advanced Studies (CAS), AKTU.",
            content_html=content,
            active_nav="people",
            breadcrumb_items=[("People", "/people/"), (label, None)],
        )

        for p in people:
            content = render_person_detail(p, category, prefix3)
            render_page(
                output_rel_path=f"{output_dir}{p['slug']}/index.html",
                title=p["name"],
                description=f"{p['name']}, {p['title']} at Centre for Advanced Studies (CAS), AKTU.",
                content_html=content,
                active_nav="people",
                breadcrumb_items=[
                    ("People", "/people/"),
                    (label, f"/{output_dir}"),
                    (p["name"], None),
                ],
            )
