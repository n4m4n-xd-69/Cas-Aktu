"""
The "Important Links" panel from the legacy CAS home page.

Read from https://cas.res.in/ on 7 August 2026: seventeen links, in the order
the legacy site lists them. Nine resolve to something this build actually
produces; the other eight name material that was never part of the migration
set.

The unresolved eight are kept in this list on purpose. Deleting them would
hide a real content roadmap from whoever picks the migration up, and linking
them would ship a 404 — so they render as a non-interactive row badged
"Planned", the same rule the section hubs already use for unbuilt children.

`path` is site-root-relative; the caller adds its own prefix. `None` means
there is nothing to link to yet.
"""
from __future__ import annotations

# (label, path or None)
IMPORTANT_LINKS: list[tuple[str, str | None]] = [
    ("Academic calendar 2026-27",            "documents/acdedmic-calender-2026-27/"),
    ("B.Tech fee structure",                 "documents/b-tech-fee-structure/"),
    ("AICTE scholarship & fellowship schemes", None),
    ("CGPA to percentage conversion",        None),
    ("AICTE feedback facility",              None),
    ("CAS newsletter",                       "documents/cas-newsletter/"),
    ("AICTE LoA & EoA",                      "documents/aicte-loa-eoa/"),
    ("Grievance cell & committees",          "documents/grievance-cell-and-other-committees/"),
    ("CAS in the news media",                None),
    ("Events & workshops",                   "updates/events/"),
    ("Notices & circulars",                  "updates/notices/"),
    ("NIRF",                                 "documents/nirf/"),
    ("Remote access to the AI DGX-2 server", None),
    ("International conference",             None),
    ("Expert talks",                         None),
    ("International collaborations",         None),
    ("Video tour",                           None),
]
