"""
Legal/trust pages: privacy, terms, copyright, accessibility, security.

These are NOT drafted with real policy text. PRODUCT_REQUIREMENTS.md FR-12
requires these be "confirmed by CAS/AKTU counsel and administration" before
publication, and TECHNICAL_SECURITY_OPERATIONS.md requires a real security
disclosure process, retention schedule, and accessibility conformance
report behind them. Inventing plausible-sounding legal text would be worse
than leaving a page thin — a fabricated privacy policy or terms-of-service
could be mistaken for a real, binding one. Each page states clearly what it
is (a structural placeholder) and what's needed before it can carry real
content, per docs/INFORMATION_ARCHITECTURE.md #5 "Policy" template fields
(owner, approval date, effective date, version, next review) — those fields
are shown as "Not yet set" rather than populated with invented dates.
"""
from __future__ import annotations

from pathlib import Path

PAGES = [
    {
        "slug": "privacy",
        "title": "Privacy notice",
        "purpose": "States what personal data this site collects, why, and how it is retained.",
        "requires": "Legal basis review, data inventory (PRODUCT_REQUIREMENTS.md &sect;12), and privacy-owner sign-off (TECHNICAL_SECURITY_OPERATIONS.md &sect;5).",
    },
    {
        "slug": "terms",
        "title": "Terms &amp; disclaimer",
        "purpose": "States conditions of site use and disclaims liability where appropriate.",
        "requires": "CAS/AKTU counsel review (PRODUCT_REQUIREMENTS.md FR-12).",
    },
    {
        "slug": "copyright",
        "title": "Copyright",
        "purpose": "States ownership and permitted use of site content, imagery, and documents.",
        "requires": "Rights confirmation for migrated images/documents (CONTENT_MIGRATION_LAUNCH.md Phase D) and institutional copyright policy.",
    },
    {
        "slug": "accessibility",
        "title": "Accessibility statement",
        "purpose": "States the site's accessibility conformance target and how to report a barrier.",
        "requires": "An independent WCAG 2.2 AA conformance audit (PRODUCT_REQUIREMENTS.md &sect;10, release gate &sect;13.3) — not yet run.",
    },
    {
        "slug": "security",
        "title": "Security reporting",
        "purpose": "States how to responsibly report a security vulnerability in this site.",
        "requires": "A named security contact/inbox and response SLA (TECHNICAL_SECURITY_OPERATIONS.md &sect;13).",
    },
]


def build(render_page, load_content, root: Path) -> None:
    for p in PAGES:
        content = f"""
<div class="u-band u-container">
  <h1>{p['title']}</h1>
  <p class="migration-notice" role="note">This page is a structural placeholder, not a published policy. It is
  not legally binding and must not be treated as CAS's actual {p['title'].lower()}.</p>
  <h2>What this page will contain</h2>
  <p>{p['purpose']}</p>
  <h2>What's needed before this can be real</h2>
  <p>{p['requires']}</p>
  <ul class="record-list">
    <li class="record-row"><div class="record-row__title">Owner</div><div class="record-row__meta">Not yet assigned</div></li>
    <li class="record-row"><div class="record-row__title">Approval date</div><div class="record-row__meta">Not yet set</div></li>
    <li class="record-row"><div class="record-row__title">Effective date</div><div class="record-row__meta">Not yet set</div></li>
    <li class="record-row"><div class="record-row__title">Version</div><div class="record-row__meta">Draft 0 (unpublished)</div></li>
    <li class="record-row"><div class="record-row__title">Next review</div><div class="record-row__meta">Not applicable — not yet published</div></li>
  </ul>
</div>
""".strip()
        render_page(
            output_rel_path=f"{p['slug']}/index.html",
            title=p["title"],
            description=f"{p['title']} for Centre for Advanced Studies (CAS), AKTU — pending institutional review.",
            content_html=content,
            active_nav=None,
            breadcrumb_items=[(p["title"], None)],
        )
