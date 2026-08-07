"""Campus section landing. Facility facts are real, quoted from
research/cas-content-inventory.json geninfra.html record (Wi-Fi, Security,
Hostel, Canteen, Sports Facilities headings)."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from landing import link, render_landing_content  # noqa: E402

CRAWL_DATE = "6 August 2026"


def build(render_page, load_content, root: Path) -> None:
    content = render_landing_content(
        title="Campus",
        summary="Infrastructure, library, hostels, and student life at the CAS campus.",
        intro_paragraphs=[
            "CAS operates laboratories including a Machine Learning Lab with Nvidia GPUs, a Cybercity "
            "Lab for smart-city cybersecurity research, a Google Developers Codelabs facility, an IoT "
            "Lab, a Linux Lab, a sensors/drives/control lab, and a 3D printing lab, per the legacy "
            "infrastructure page.",
        ],
        highlights=[
            ("Wi-Fi", "Campus-wide Wi-Fi, stated as 1 Gbps with 1 Gbps LAN connectivity and 10 Gbps traffic support."),
            ("Security", "HD CCTV surveillance, 24-hour private security at entry points, and a perimeter compound wall."),
            ("Hostel", "Separate boys' and girls' hostels, approx. 75 single-seater rooms each, with internet and 24-hour security."),
            ("Canteen", "Multiple on-campus canteens run by contracted external caterers."),
            ("Sports facilities", "Outdoor playgrounds and indoor courts for student fitness and recreation."),
        ],
        child_groups=[
            (
                None,
                [
                    ("Infrastructure", link("/campus/infrastructure/")),
                    ("Library", link("/campus/library/")),
                    ("Hostels", link("/campus/hostels/")),
                    ("Student life", link("/campus/student-life/")),
                    ("Clubs and activities", link("/campus/activities/")),
                    ("Student publications", link("/campus/student-publications/")),
                    ("Alumni", link("/campus/alumni/")),
                    ("Gallery", link("/campus/gallery/")),
                    ("Campus tour", link("/campus/tour/")),
                    ("Safety, accessibility, and services", link("/campus/services/")),
                ],
            )
        ],
        owner="Student Affairs / Hostel / Library",
        last_reviewed=CRAWL_DATE + " (legacy site crawl date — pending institutional review)",
        source_note=(
            "Facility figures (Wi-Fi speed, hostel capacity) are migrated from the legacy site and "
            "pending owner confirmation."
        ),
        section_key="campus",
        root=root,
    )
    render_page(
        output_rel_path="campus/index.html",
        title="Campus",
        description="Infrastructure, library, hostels, and student life at the CAS campus.",
        content_html=content,
        active_nav="campus",
        breadcrumb_items=[("Campus", None)],
    )
