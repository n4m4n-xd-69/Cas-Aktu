"""Admissions section landing. Sourced from real crawl text:
apply-to-M.Tech.html (GATE/non-GATE eligibility) and apply-to-PhD.html
(Rs. 40,000/month DDU-QIP stipend claim)."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from landing import link, render_landing_content  # noqa: E402

CRAWL_DATE = "6 August 2026"


def build(render_page, load_content, root: Path) -> None:
    content = render_landing_content(
        title="Admissions",
        summary="B.Tech, M.Tech, and Ph.D. admissions for session 2026-27.",
        intro_paragraphs=[
            "M.Tech admissions: GATE-qualified candidates with a valid score are eligible for admission "
            "with a monthly stipend as per AICTE/MHRD/University rules. Non-GATE-qualified candidates "
            "are also eligible based on merit in CUET PG or the Institute-level exam, per the legacy "
            "notice text. Ph.D. admission: the legacy site states a monthly stipend of Rs. 40,000 under "
            "the Deen Dayal Upadhyaya Quality Improvement Programme for admitted students &mdash; this "
            "figure requires Admissions Office confirmation before publication, as fee/stipend claims "
            "are explicitly unverified in the migration source (PRODUCT_REQUIREMENTS.md &sect;2).",
        ],
        highlights=[
            ("B.Tech", "Admission notice and guidelines issued for allotted students, session 2026-27."),
            ("M.Tech", "Admissions open; counselling in progress, session 2026-27."),
            ("Ph.D.", "Eligibility, research areas, and how to apply."),
        ],
        child_groups=[
            (
                "By pathway",
                [
                    ("B.Tech admissions", link("/admissions/btech/")),
                    ("M.Tech admissions", link("/admissions/mtech/")),
                    ("Ph.D. admissions", link("/admissions/phd/")),
                ],
            ),
            (
                "Details",
                [
                    ("Key dates", link("/admissions/dates/")),
                    ("Eligibility and process", link("/admissions/process/")),
                    ("Fees and financial assistance", link("/admissions/fees-aid/")),
                    ("Hostel information", link("/admissions/hostel/")),
                    ("Admissions notices", link("/admissions/notices/")),
                    ("FAQs", link("/admissions/faqs/")),
                    ("Admissions contact", link("/admissions/contact/")),
                ],
            ),
        ],
        owner="Admissions Office",
        last_reviewed=CRAWL_DATE + " (legacy site crawl date — pending institutional review)",
        source_note=(
            "Dates, eligibility, and stipend figures are migrated from legacy admission notices and "
            "have not been reconfirmed by the Admissions Office. Do not treat as final "
            "(CONTENT_MIGRATION_LAUNCH.md, editorial acceptance checklist &sect;8)."
        ),
        section_key="admissions",
        root=root,
    )
    render_page(
        output_rel_path="admissions/index.html",
        title="Admissions",
        description="B.Tech, M.Tech, and Ph.D. admissions information for Centre for Advanced Studies (CAS), session 2026-27.",
        content_html=content,
        active_nav="admissions",
        breadcrumb_items=[("Admissions", None)],
    )
