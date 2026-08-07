"""About section landing. Content sourced from research/cas-content-inventory.json
(about-us.html, director.html) — real crawl text, paraphrased for length."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from landing import link, render_landing_content  # noqa: E402

CRAWL_DATE = "6 August 2026"


def build(render_page, load_content, root: Path) -> None:
    content = render_landing_content(
        title="About CAS",
        summary=(
            "Centre for Advanced Studies (CAS) is an in-campus, research-driven institute of "
            "Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow."
        ),
        intro_paragraphs=[
            "Established by the Uttar Pradesh State Government in 2017, CAS offers M.Tech. and Ph.D. "
            "programs in Computer Science and Engineering, Mechatronics, Nanotechnology, Manufacturing "
            "Technology and Automation, and Energy Science and Technology, alongside B.Tech. offerings. "
            "The stated objective is to provide a platform for research scholars and academicians to "
            "create and disseminate research-based knowledge and technologies.",
        ],
        highlights=[
            (
                "Director",
                "Dr. Virendra Pathak. Full biography, qualifications, and administrative history are "
                'on the Director page (planned).',
            ),
            (
                "Established",
                "2017, by the Uttar Pradesh State Government, as an in-campus institute of AKTU Lucknow.",
            ),
        ],
        child_groups=[
            (
                None,
                [
                    ("Overview", link("/about/overview/")),
                    ("History and milestones", link("/about/history/")),
                    ("Vision and mission", link("/about/vision-mission/")),
                    ("Director", link("/about/director/")),
                    ("Governance and administration", link("/about/governance/")),
                    ("Approvals, accreditation, disclosures", link("/about/approvals/")),
                    ("Key statistics", link("/about/facts/")),
                    ("Institutional reports and newsletters", link("/about/reports/")),
                    ("Contact and location", link("/contact/")),
                ],
            )
        ],
        owner="Director's Office / Administration",
        last_reviewed=CRAWL_DATE + " (legacy site crawl date — pending institutional review)",
        source_note=(
            "Institutional facts on this page are migration candidates from the legacy CAS website, "
            "not independently verified claims (PRODUCT_REQUIREMENTS.md &sect;2)."
        ),
        section_key="about",
        root=root,
    )
    render_page(
        output_rel_path="about/index.html",
        title="About",
        description="About Centre for Advanced Studies (CAS): history, leadership, governance, and institutional facts.",
        content_html=content,
        active_nav="about",
        breadcrumb_items=[("About", None)],
    )
