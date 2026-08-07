"""
Notice records — docs/INFORMATION_ARCHITECTURE.md #3 "Notice" content type.
Real content: the repeated ticker text from the home page record in
research/cas-content-inventory.json (deduplicated — the legacy site repeats
each line 5+ times in a scrolling ticker, exactly what
PRODUCT_REQUIREMENTS.md #3 complains about: "Important admissions notices
compete in repeated tickers... link directly to inconsistently named
files"). Each notice here is linked to its real attachment in the Document
library (build/pages/documents_pages.py) by slug, resolved by inspecting the
actual generated document records rather than guessed.

All six are the *same* six lines from the live 2026-27 ticker — there is no
older/historical notice content in the crawl distinct from what's already on
data_notices.ARCHIVED_ITEMS (workshops.html / notices.html), so this list
does not duplicate those.
"""

NOTICES = [
    {
        "slug": "btech-admission-notice-guidelines-2026-27",
        "title": "Admission notice and guidelines for B.Tech students allotted, session 2026-27",
        "notice_type": "Admission",
        "audience": "Prospective B.Tech student",
        "session": "2026-27",
        "status": "Open",
        "summary": "Reporting instructions and guidelines for B.Tech students allotted a seat for the 2026-27 session.",
        "document_slug": "admission-notice-and-guidelines-for-b-tech-students-alloted-",
    },
    {
        "slug": "mtech-counselling-2026-27",
        "title": "Counselling for M.Tech admissions, session 2026-27",
        "notice_type": "Admission",
        "audience": "Prospective M.Tech student",
        "session": "2026-27",
        "status": "Open",
        "summary": "Counselling round guidelines for M.Tech admissions, session 2026-27.",
        "document_slug": "guidelines-for-m-tech-4th-round-of-counselling",
    },
    {
        "slug": "mandatory-attendance-btech-mtech",
        "title": "Mandatory minimum attendance for B.Tech and M.Tech students",
        "notice_type": "Academic",
        "audience": "Current student",
        "session": None,
        "status": "Open",
        "summary": "Circular on the mandatory minimum attendance requirement for B.Tech and M.Tech students.",
        "document_slug": "mandatory-minimum-attendance-for-b-tech-m-tech-students",
    },
    {
        "slug": "provisional-registration-odd-sem-2026-27",
        "title": "Provisional registration, B.Tech and M.Tech, odd semester 2026-27",
        "notice_type": "Registration",
        "audience": "Current student",
        "session": "2026-27",
        "status": "Open",
        "summary": "Circular for provisional registration of B.Tech and M.Tech students, odd semester 2026-27.",
        "document_slug": "provisional-registration-b-tech-and-m-tech-odd-semester-2026",
    },
    {
        "slug": "academic-calendar-2026-27",
        "title": "Academic calendar 2026-27",
        "notice_type": "Academic",
        "audience": "All",
        "session": "2026-27",
        "status": "Open",
        "summary": "The academic calendar for the 2026-27 session.",
        "document_slug": "acdedmic-calender-2026-27",
    },
    {
        "slug": "mtech-admissions-open-2026-27",
        "title": "M.Tech admissions open, session 2026-27",
        "notice_type": "Admission",
        "audience": "Prospective M.Tech student",
        "session": "2026-27",
        "status": "Open",
        "summary": "M.Tech admissions announcement for Centre for Advanced Studies, AKTU Lucknow, session 2026-27.",
        "document_slug": "m-tech-admissions-open-in-centre-for-advanced-studies-aktu-l",
    },
]
