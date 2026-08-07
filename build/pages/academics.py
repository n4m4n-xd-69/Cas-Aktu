"""Academics section landing. Program list sourced from
docs/INFORMATION_ARCHITECTURE.md #2 and the real crawled program pages
(Mtechcse.html, mtechnano.html, mtechenergy.html, mtechmecha.html,
mtechmanufacturing.html, Btech.html, csephd.html)."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from landing import link, render_landing_content  # noqa: E402

CRAWL_DATE = "6 August 2026"


def build(render_page, load_content, root: Path) -> None:
    content = render_landing_content(
        title="Academics",
        summary="B.Tech, M.Tech, and Ph.D. programs across five engineering and technology disciplines.",
        intro_paragraphs=[
            "CAS's academic offer spans three levels: B.Tech, five M.Tech disciplines (Computer Science "
            "and Engineering, Nanotechnology, Energy Science and Technology, Mechatronics, and "
            "Manufacturing Technology &amp; Automation), and Ph.D. study across the same disciplines. "
            "Program names, seat counts, and approvals require confirmation by the Academic Office "
            "before publication (PRODUCT_REQUIREMENTS.md &sect;2).",
        ],
        child_groups=[
            (
                "Programs",
                [
                    ("All programs", link("/academics/programs/")),
                    ("B.Tech", link("/academics/btech/")),
                    ("M.Tech", link("/academics/mtech/")),
                    ("Ph.D.", link("/academics/phd/")),
                ],
            ),
            (
                "Academic resources",
                [
                    ("Academic calendar", link("/academics/calendar/")),
                    ("Curriculum and syllabi", link("/academics/curriculum/")),
                    ("Ordinances and regulations", link("/academics/regulations/")),
                    ("Fees", link("/academics/fees/")),
                    ("Academic resources", link("/academics/resources/")),
                ],
            ),
        ],
        owner="Academic Office",
        last_reviewed=CRAWL_DATE + " (legacy site crawl date — pending institutional review)",
        source_note=(
            "Program list migrated from the legacy CAS website. CAS must confirm canonical program "
            "names and current status before launch (INFORMATION_ARCHITECTURE.md &sect;2)."
        ),
        section_key="academics",
        root=root,
    )
    render_page(
        output_rel_path="academics/index.html",
        title="Academics",
        description="B.Tech, M.Tech, and Ph.D. programs at Centre for Advanced Studies (CAS), AKTU.",
        content_html=content,
        active_nav="academics",
        breadcrumb_items=[("Academics", None)],
    )
