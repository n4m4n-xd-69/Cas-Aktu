"""
Archived (non-current) notice-adjacent items — dated items from
notices.html / workshops.html that are clearly past (2022/2023), status
Archived not Open, per UX_UI_SPECIFICATION.md #6 ("Status labels ...
Archived").

Current notices moved to build/data/notices.py (NOTICES) once they became
real linked records with attachments, owner, and detail pages — keeping a
second, plain-string copy here would have let the two drift (Development
Rules: avoid duplicate code). This file now holds only what notices.py
doesn't cover.
"""

ARCHIVED_ITEMS = [
    ("Nanotechnology for Battery and Super Capacitor Applications — workshop", "2-3 June 2023"),
    ("Interview for Faculty Positions (Assistant Professor on contract)", "undated in source"),
    ("Shortlisted students for internship 2022", "2022"),
]
