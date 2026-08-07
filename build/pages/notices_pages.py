"""
Notice pages: /updates/notices/ listing + /updates/notices/<slug>/ detail.
Each notice cross-checks its linked document slug against the real,
generated Document records at build time — if documents_pages.py ever
changes its title-derivation logic and a slug shifts, this fails the build
loudly instead of shipping a silently broken download link.
"""
from __future__ import annotations

import html
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from data.notices import NOTICES  # noqa: E402
from pages import documents_pages  # noqa: E402

STATUS_BADGE = {"Open": "badge--open", "Closing soon": "badge--closing", "Archived": "badge--archived"}


def _listing_rows(notices: list[dict], prefix: str) -> str:
    rows = []
    for n in notices:
        badge = STATUS_BADGE.get(n["status"], "badge--draft")
        rows.append(
            f'<li class="record-row">'
            f'<div class="record-row__title"><a href="{prefix}updates/notices/{n["slug"]}/">{html.escape(n["title"])}</a></div>'
            f'<div class="record-row__meta">{html.escape(n["notice_type"])}{" &middot; " + html.escape(n["session"]) if n["session"] else ""}</div>'
            f'<span class="badge {badge}">{html.escape(n["status"])}</span>'
            f"</li>"
        )
    return "".join(rows)


def build(render_page, load_content, root: Path) -> None:
    documents = documents_pages.load_records(root)
    doc_slugs = {d["slug"]: d for d in documents}

    for n in NOTICES:
        if n["document_slug"] not in doc_slugs:
            raise RuntimeError(
                f"Notice {n['slug']!r} references document slug {n['document_slug']!r}, "
                "which does not exist in the generated Document records. "
                "documents_pages.py's title-derivation must have changed — fix the "
                "notice's document_slug in build/data/notices.py rather than shipping "
                "a broken download link."
            )

    prefix2 = "../../"
    content = f"""
<div class="u-band u-container">
  <h1>Notices</h1>
  <p class="lede">{len(NOTICES)} current notice(s), deduplicated from the legacy site's repeated ticker.</p>
  <ul class="record-list">{_listing_rows(NOTICES, prefix2)}</ul>
</div>
""".strip()
    render_page(
        output_rel_path="updates/notices/index.html",
        title="Notices",
        description="Current notices from Centre for Advanced Studies (CAS), AKTU.",
        content_html=content,
        active_nav="updates",
        breadcrumb_items=[("News & Notices", "/updates/"), ("Notices", None)],
    )

    prefix3 = "../../../"
    for n in NOTICES:
        doc = doc_slugs[n["document_slug"]]
        badge = STATUS_BADGE.get(n["status"], "badge--draft")
        content = f"""
<div class="u-band u-container">
  <h1>{html.escape(n['title'])}</h1>
  <span class="badge {badge}">{html.escape(n['status'])}</span>
  <ul class="record-list" style="margin-top:var(--space-16)">
    <li class="record-row"><div class="record-row__title">Type</div><div class="record-row__meta">{html.escape(n['notice_type'])}</div></li>
    <li class="record-row"><div class="record-row__title">Audience</div><div class="record-row__meta">{html.escape(n['audience'])}</div></li>
    <li class="record-row"><div class="record-row__title">Session</div><div class="record-row__meta">{html.escape(n['session']) if n['session'] else 'Not session-specific'}</div></li>
  </ul>
  <h2>Summary</h2>
  <p>{html.escape(n['summary'])}</p>
  <h2>Attachment</h2>
  <div class="hero__actions" style="margin:var(--space-16) 0">
    <a class="btn btn--primary btn--download" href="{prefix3}documents/{doc['slug']}/">View document record ({documents_pages.format_size(doc['size_bytes'])})</a>
  </div>
  <p class="migration-notice" role="note">This notice is migrated from the legacy site's homepage ticker (deduplicated from 5+ repeated occurrences). Owner, correction history, and expiry date are not yet governed — pending CMS workflow (PRODUCT_REQUIREMENTS.md FR-04/FR-11).</p>
</div>
""".strip()
        render_page(
            output_rel_path=f"updates/notices/{n['slug']}/index.html",
            title=n["title"],
            description=n["summary"],
            content_html=content,
            active_nav="updates",
            breadcrumb_items=[
                ("News & Notices", "/updates/"),
                ("Notices", "/updates/notices/"),
                (n["title"], None),
            ],
        )
