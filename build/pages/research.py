"""Research section landing. The legacy research1.html page is 35,169 words
(CAS_SOURCE_AUDIT.md flags it as oversized) — this landing summarizes its own
in-page section list rather than reproducing the dump, per
CONTENT_MIGRATION_LAUNCH.md Phase C: "Split large pages ... into structured
records with relationships." Full records are Stage 3.4 work."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from landing import link, render_landing_content  # noqa: E402

CRAWL_DATE = "6 August 2026"


def build(render_page, load_content, root: Path) -> None:
    content = render_landing_content(
        title="Research",
        summary="Research themes, experts, facilities, and outputs across CAS's five academic disciplines.",
        intro_paragraphs=[
            "The legacy site's Research &amp; Innovation page groups publications, patents, funded "
            "projects, research seminars, webinars, faculty research areas, expert talks, student "
            "innovations, international collaborations, and major equipment on one 35,000-word page. "
            "This site splits that into the structured records below, each with its own filterable "
            "listing, per CONTENT_MIGRATION_LAUNCH.md Phase C.",
        ],
        highlights=[
            (
                "Computer Science &amp; Engineering",
                "AI/ML &amp; deep learning, cybersecurity, ICT, data science, IoT, computer vision, cloud computing.",
            ),
            (
                "Mechatronics",
                "Robotics, PLC &amp; SCADA, AI-based systems, drones and aerial systems.",
            ),
            (
                "Nanotechnology",
                "Nanomaterial synthesis and characterization, nano-fabrication, MEMS/NEMS, microfluidics.",
            ),
        ],
        child_groups=[
            (
                None,
                [
                    ("Research themes", link("/research/themes/")),
                    ("Find an expert", link("/research/experts/")),
                    ("Projects", link("/research/projects/")),
                    ("Publications", link("/research/publications/")),
                    ("Patents", link("/research/patents/")),
                    ("Innovations and prototypes", link("/research/innovations/")),
                    ("Laboratories and facilities", link("/research/facilities/")),
                    ("Major equipment", link("/research/equipment/")),
                    ("Collaborations", link("/research/collaborations/")),
                    ("Research scholars", link("/research/scholars/")),
                    ("Research resources and policies", link("/research/resources/")),
                ],
            )
        ],
        owner="Research Office",
        last_reviewed=CRAWL_DATE + " (legacy site crawl date — pending institutional review)",
        source_note=(
            "Publication, patent, and project records below are pending structured migration from "
            "research1.html and Publications.html — see Remaining Work."
        ),
        section_key="research",
        root=root,
    )
    render_page(
        output_rel_path="research/index.html",
        title="Research",
        description="Research themes, experts, laboratories, equipment, publications, and patents at CAS, AKTU.",
        content_html=content,
        active_nav="research",
        breadcrumb_items=[("Research", None)],
    )
