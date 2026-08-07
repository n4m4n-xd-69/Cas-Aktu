"""
Event pages: /updates/events/ listing + /updates/events/<slug>/ detail.
Several workshop titles repeat across different dates in the real source
(e.g. "Artificial Intelligence: Deep Learning and Machine Learning" ran
three separate times) — slugs are built from title+date together so each
run gets its own page instead of colliding.
"""
from __future__ import annotations

import html
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from data.events import EVENTS, VENUE_LABEL, STATUS_BADGE, TIMEZONE  # noqa: E402


def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:70] or "event"


def build_slugs(events: list[dict]) -> list[dict]:
    used: set[str] = set()
    out = []
    for e in events:
        base = slugify(f"{e['title']}-{e['dates']}")
        slug = base
        n = 2
        while slug in used:
            slug = f"{base}-{n}"
            n += 1
        used.add(slug)
        out.append({**e, "slug": slug})
    return out


def _listing_rows(events: list[dict], prefix: str) -> str:
    rows = []
    for e in events:
        badge = STATUS_BADGE.get(e["status"], "badge--draft")
        rows.append(
            f'<li class="record-row">'
            f'<div class="record-row__title"><a href="{prefix}updates/events/{e["slug"]}/">{html.escape(e["title"])}</a></div>'
            f'<div class="record-row__meta">{html.escape(e["dates"])} &middot; {html.escape(e["mode"])}</div>'
            f'<span class="badge {badge}">{html.escape(e["status"])}</span>'
            f"</li>"
        )
    return "".join(rows)


def build(render_page, load_content, root: Path) -> None:
    events = build_slugs(EVENTS)

    prefix2 = "../../"
    content = f"""
<div class="u-band u-container">
  <h1>Events</h1>
  <p class="lede">{len(events)} workshop events migrated from the legacy site — all dated 2022-2023, all archival (no live/upcoming events in the migration source).</p>
  <p class="migration-notice" role="note">Every event below is a completed or postponed training workshop from the legacy site's workshop archive. There is no current/upcoming event content in the crawl data — this section is entirely historical until a live events feed is added.</p>
  <ul class="record-list">{_listing_rows(events, prefix2)}</ul>
</div>
""".strip()
    render_page(
        output_rel_path="updates/events/index.html",
        title="Events",
        description="Past workshop events at Centre for Advanced Studies (CAS), AKTU.",
        content_html=content,
        active_nav="updates",
        breadcrumb_items=[("News & Notices", "/updates/"), ("Events", None)],
    )

    for e in events:
        badge = STATUS_BADGE.get(e["status"], "badge--draft")
        content = f"""
<div class="u-band u-container">
  <h1>{html.escape(e['title'])}</h1>
  <span class="badge {badge}">{html.escape(e['status'])}</span>
  <ul class="record-list" style="margin-top:var(--space-16)">
    <li class="record-row"><div class="record-row__title">Date</div><div class="record-row__meta">{html.escape(e['dates'])} ({TIMEZONE})</div></li>
    <li class="record-row"><div class="record-row__title">Mode</div><div class="record-row__meta">{html.escape(e['mode'])}</div></li>
    <li class="record-row"><div class="record-row__title">Venue</div><div class="record-row__meta">{html.escape(VENUE_LABEL.get(e['mode'], 'Not stated'))}</div></li>
    <li class="record-row"><div class="record-row__title">Organizer</div><div class="record-row__meta">{html.escape(e['organizer'])}</div></li>
  </ul>
  <p class="migration-notice" role="note">Migrated from the legacy workshops archive (workshops.html). Eligibility, last date to apply, and full workshop flyer are in the original source but not yet structured as separate fields — see Remaining Work.</p>
</div>
""".strip()
        render_page(
            output_rel_path=f"updates/events/{e['slug']}/index.html",
            title=e["title"],
            description=f"{e['title']} — {e['dates']}, Centre for Advanced Studies (CAS), AKTU.",
            content_html=content,
            active_nav="updates",
            breadcrumb_items=[
                ("News & Notices", "/updates/"),
                ("Events", "/updates/events/"),
                (e["title"], None),
            ],
        )
