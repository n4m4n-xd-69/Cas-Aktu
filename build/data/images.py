"""
Curated image manifest.

`source-assets/images/` holds 576 files crawled from the legacy CAS website on
6 August 2026. They arrived with hash filenames, no captions and no rights
metadata. This module is the auditable subset that the generated site is
allowed to use, and the record of what still needs owner sign-off.

Selection rules applied (see docs/UX_UI_SPECIFICATION.md):

  * Photographs only. The 127 portrait "Inspiring Student Innovation" posters
    and ~40 newspaper clippings are text rendered as pixels — unreadable to
    screen readers, unreadable at card size, and untranslatable. Their content
    is surfaced as HTML text elsewhere; the scans stay linked as downloads.
  * Scanned timetables are excluded for the same reason even though several
    are large enough to pass a naive resolution filter.
  * `alt` describes only what is visibly in the frame. Where a person, event
    or date cannot be established from the image itself, the alt text stays
    descriptive rather than inventing an identification. Faces are not named.

`rights_status` is "pending-confirmation" for every record: these are migrated
from the legacy public site, so CAS is the probable owner, but PRODUCT_
REQUIREMENTS.md #14 requires a rights/consent audit before launch. Nothing here
should be treated as cleared. `python build/generate.py --rights-report` prints
the sign-off list.
"""
from __future__ import annotations

PENDING = "pending-confirmation"

# Focal point (x%, y%) tells the CSS where to anchor a crop, so faces and
# signage survive aggressive aspect ratios instead of being cut off centre.


def _img(src, category, alt, *, focal=(50, 50), caption=None, priority=False):
    return {
        "src": src,
        "category": category,
        "alt": alt,
        "caption": caption,
        "focal": focal,
        "priority": priority,
        "credit": "Centre for Advanced Studies (legacy website migration)",
        "rights_status": PENDING,
    }


# ---------------------------------------------------------------------------
# Hero — the only genuine high-resolution photography in the library.
# Ordered as a narrative: identity, research, computing, innovation, teaching.
# ---------------------------------------------------------------------------

HERO = [
    _img(
        "campus-191abaff61a7.jpg", "campus",
        "The main entrance of the Centre for Advanced Studies, a colonnaded "
        "portico with the institute name mounted above it and cars parked in "
        "the forecourt.",
        focal=(50, 58), priority=True,
        caption="Centre for Advanced Studies, AKTU campus, Lucknow",
    ),
    _img(
        "2-e11fb1749ef2.jpg", "labs",
        "A long instrumentation laboratory bench lined with red-panelled "
        "electrical measurement rigs and stools.",
        focal=(50, 55),
        caption="Instrumentation and measurement laboratory",
    ),
    _img(
        "5-ca8c86fdb015.jpg", "labs",
        "Rows of desktop workstations on wooden benches in a computing "
        "laboratory, monitors switched on.",
        focal=(50, 50),
        caption="Computing laboratory",
    ),
    _img(
        "1-feb83970814a.jpg", "innovation",
        "A large tabletop scale model of a city with roads, rail track, "
        "buildings and green space, used for teaching and demonstration.",
        focal=(50, 48),
        caption="Smart-infrastructure demonstration model",
    ),
    _img(
        "3-0a9ffe7f4952.jpg", "teaching",
        "Students seated at desks in a lecture room facing a projected "
        "presentation.",
        focal=(50, 45),
        caption="Teaching session in progress",
    ),
    _img(
        "audi-2fdfdffa21e1.jpg", "campus",
        "The institute auditorium, with rows of black seating on a patterned "
        "red carpet and a stage at the far end.",
        focal=(50, 52),
        caption="Institute auditorium",
    ),
]

# ---------------------------------------------------------------------------
# Campus and infrastructure
# ---------------------------------------------------------------------------

CAMPUS = [
    _img("campus-191abaff61a7.jpg", "campus",
         "The colonnaded main entrance of the Centre for Advanced Studies with "
         "the institute name above the portico.", focal=(50, 58)),
    _img("canteen-861ca3be9d07.jpg", "campus",
         "A single-storey campus building with a wide lawn in front of it."),
    _img("sports-8f98a51a7b5a.jpg", "campus",
         "An indoor recreation room with table-tennis tables and chairs along "
         "the wall."),
    _img("audi-2fdfdffa21e1.jpg", "campus",
         "Rows of seating on red patterned carpet inside the institute "
         "auditorium."),
    _img("4-c73c601205bf.jpeg", "campus",
         "A wide view across the campus grounds towards multi-storey academic "
         "blocks, with a decorative garden made from painted tyres in the "
         "foreground."),
    _img("3-8d3ee23d57e1.jpeg", "campus",
         "A multi-storey academic block with coloured panel cladding, seen "
         "from the campus lawn."),
    _img("3-72709efdc225.jpg", "campus",
         "A student collaboration lounge with low colourful seating and a "
         "Google Developers Codelabs sign on the wall."),
    _img("hostel-5d00213679c0.jpeg", "campus",
         "A campus residential block."),
    _img("3-3e3165184a5b.jpg", "campus",
         "The institute library reading area, with tall bookshelves and study "
         "seating."),
]

# ---------------------------------------------------------------------------
# Laboratories and facilities
# ---------------------------------------------------------------------------

LABS = [
    _img("3-64f20bd9819f.jpg", "labs",
         "An industrial automation hall with a green epoxy floor and a large "
         "yellow and green process-control rig running through it."),
    _img("3-fb8defe50f10.jpg", "labs",
         "A process-control training rig with pipework, tanks and instrument "
         "panels on a green laboratory floor."),
    _img("2-e11fb1749ef2.jpg", "labs",
         "A long bench of red-panelled electrical measurement rigs in an "
         "instrumentation laboratory."),
    _img("5-ca8c86fdb015.jpg", "labs",
         "Rows of desktop workstations on wooden benches in a computing "
         "laboratory."),
    _img("4-34063d4e9ecc.jpg", "labs",
         "A long computing laboratory with paired workstations along both "
         "sides of the room."),
    _img("2-e02b0f1d7ed1.jpg", "labs",
         "A large enclosed industrial 3D printer with its build chamber "
         "visible through the front window."),
    _img("3-42a89367c41f.jpg", "labs",
         "A benchtop additive-manufacturing machine in a fabrication "
         "laboratory."),
    _img("5-a5d54dc84361.jpg", "labs",
         "The entrance to the Materials Chemistry and Synthesis Laboratory, "
         "with equipment visible through the glazed partition."),
    _img("1-1-52bacaf764e8.jpeg", "labs",
         "A large blue and white benchtop analytical instrument in a "
         "laboratory."),
    _img("5-d0bab9192228.jpg", "labs",
         "An analytical instrument with an attached workstation in a "
         "characterisation laboratory."),
    _img("1-8-b3381beba030.jpeg", "labs",
         "Laboratory benching with characterisation equipment and a fume "
         "cabinet."),
    _img("1-02709494b801.jpg", "labs",
         "A corridor leading to the Industrial Automation Laboratory."),
    _img("1-d27cd082f1a0.jpg", "labs",
         "Floor-standing electrical control and distribution cabinets in a "
         "power systems laboratory."),
    _img("pos2-54af7edd4028.jpeg", "labs",
         "Server and network racks in the institute data facility."),
]

# ---------------------------------------------------------------------------
# Research, innovation and equipment
# ---------------------------------------------------------------------------

RESEARCH = [
    _img("1-feb83970814a.jpg", "innovation",
         "A large tabletop scale model of a city with roads, rail track and "
         "buildings."),
    _img("3-668a58dfd590.jpg", "innovation",
         "A detailed scale model of transport and building infrastructure "
         "used for demonstration."),
    _img("4-1ce4c50cd294.jpeg", "innovation",
         "A robotics competition arena with a barriered track and spectators "
         "gathered around it."),
    _img("1-1-52bacaf764e8.jpeg", "research",
         "A large analytical instrument used for materials characterisation."),
    _img("2-e02b0f1d7ed1.jpg", "research",
         "An industrial 3D printer used for additive manufacturing research."),
    _img("3-fb8defe50f10.jpg", "research",
         "A process-control rig with instrumented pipework and tanks."),
]

# ---------------------------------------------------------------------------
# Events and institute life
# ---------------------------------------------------------------------------

# Every description in this group was rewritten on 7 August 2026 after each
# photograph was opened and compared against its text. The migrated alt text
# described a different picture entirely — marigold garlands for a lectern
# talk, a ceremonial lamp for a laboratory visit, a cultural gathering for two
# instruments on a bench — and five of the eight ship on the homepage events
# rail, so screen-reader users were being read invented scenes.
#
# Three of these files (marked below) carry a burned-in "GPS Map Camera"
# geotag overlay from the original photographer. CAS should re-shoot or crop
# them before launch; the alt text names what is actually visible meanwhile.
EVENTS = [
    _img("2-8c5474510f6a.jpeg", "events",
         "A speaker presenting at a lectern in front of a projection screen "
         "during an institute session."),  # has GPS geotag overlay
    _img("3-dbfbab2ec35f.jpeg", "events",
         "A training room with a software demonstration projected on the "
         "screen and equipment benches along the walls."),
    _img("1-984347a34b1f.jpeg", "events",
         "Visiting dignitaries and uniformed officers being shown "
         "workstations in a computing laboratory."),
    _img("veer-b948d6ead282.jpg", "events",
         "A staff member working at a desk with two monitors and a laptop."),
    _img("3-759db7600eb5.jpeg", "events",
         "A laboratory hall lined with instrument cabinets, with yellow floor "
         "markings along the walkway."),
    _img("4-1ce4c50cd294.jpeg", "events",
         "A speaker addressing a seated audience in the institute hall."),  # has GPS geotag overlay
    _img("1-3bfebe7c8397.jpg", "events",
         "Participants seated at a short-term course, photographed together "
         "in front of the course banner."),
    _img("4-26a5944919b9.jpg", "events",
         "Two benchtop measurement instruments set up on a laboratory bench."),
]

# ---------------------------------------------------------------------------
# Teaching spaces
# ---------------------------------------------------------------------------

TEACHING = [
    _img("3-0a9ffe7f4952.jpg", "teaching",
         "Students seated at desks in a lecture room facing a projected "
         "presentation."),
    # Corrected 7 August 2026: the room in this photograph is empty. It was
    # described as "busy ... with students working at workstations".
    _img("4-8692af3b5e0b.jpg", "teaching",
         "An empty computing laboratory, with monitors set out along rows of "
         "wooden benches."),
    _img("3-66896ee844b6.jpg", "teaching",
         "A tiered lecture theatre with fixed seating."),
    _img("3-669366fe798c.jpg", "teaching",
         "A seminar room with a whiteboard and a long central table."),
    _img("1-1f96312a71ea.jpg", "teaching",
         "A doorway sign reading 111 B MOOC Room."),
    _img("3-3e3165184a5b.jpg", "teaching",
         "The library reading area with bookshelves and study seating."),
]


ALL_GROUPS = {
    "hero": HERO,
    "campus": CAMPUS,
    "labs": LABS,
    "research": RESEARCH,
    "events": EVENTS,
    "teaching": TEACHING,
}


def all_images() -> list[dict]:
    """Every referenced record, de-duplicated by source filename."""
    seen: dict[str, dict] = {}
    for group in ALL_GROUPS.values():
        for rec in group:
            seen.setdefault(rec["src"], rec)
    return list(seen.values())


def rights_report() -> str:
    """Sign-off list for the content owner (PRODUCT_REQUIREMENTS.md #14)."""
    rows = sorted(all_images(), key=lambda r: (r["category"], r["src"]))
    out = [
        "Image rights sign-off required before launch",
        "=" * 46,
        f"{len(rows)} images referenced by the generated site.",
        "",
    ]
    for r in rows:
        out.append(f"[{r['rights_status']}] {r['category']:>10}  {r['src']}")
        out.append(f"{'':>13} alt: {r['alt']}")
    return "\n".join(out)
