"""People section landing. Categories confirmed present in the real crawl:
faculty.html, visitingfaculty.html, pastfaculty.html, staff.html."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from landing import link, render_landing_content  # noqa: E402

CRAWL_DATE = "6 August 2026"


def build(render_page, load_content, root: Path) -> None:
    content = render_landing_content(
        title="People",
        summary="Leadership, faculty, staff, and research scholars at CAS.",
        intro_paragraphs=[
            "The legacy site records current faculty, visiting faculty, past faculty, administrative "
            "and research staff, and research scholars separately. This directory keeps that "
            "separation with explicit status so former people do not appear in current-faculty "
            "listings (PRODUCT_REQUIREMENTS.md FR-05).",
        ],
        child_groups=[
            (
                None,
                [
                    ("Leadership", link("/people/leadership/")),
                    ("Faculty", link("/people/faculty/")),
                    ("Visiting faculty", link("/people/visiting/")),
                    ("Staff", link("/people/staff/")),
                    ("Research scholars", link("/people/research-scholars/")),
                    ("Former faculty", link("/people/former/")),
                    ("International / visiting experts", link("/people/experts/")),
                ],
            )
        ],
        owner="Director's Office / Research Office",
        last_reviewed=CRAWL_DATE + " (legacy site crawl date — pending institutional review)",
        source_note=(
            "Individual profiles are pending structured migration and consent confirmation "
            "(PRODUCT_REQUIREMENTS.md FR-05) — see Remaining Work."
        ),
        section_key="people",
        root=root,
    )
    render_page(
        output_rel_path="people/index.html",
        title="People",
        description="Leadership, faculty, staff, and research scholars at Centre for Advanced Studies (CAS).",
        content_html=content,
        active_nav="people",
        breadcrumb_items=[("People", None)],
    )
