"""News & Notices section landing (IA path /updates/). Demonstrates the
Open vs Archived status distinction the PRD requires (FR-07): current
2026-27 notices are badged Open, dated 2022/2023 items from the legacy
notices.html / workshops.html pages are badged Archived, never silently
mixed together as if both current."""
from __future__ import annotations

import html
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from landing import link, render_landing_content  # noqa: E402
from data.notices import NOTICES  # noqa: E402
from data_notices import ARCHIVED_ITEMS  # noqa: E402

CRAWL_DATE = "6 August 2026"


def build(render_page, load_content, root: Path) -> None:
    current_rows = "".join(
        f'<li class="record-row"><div class="record-row__title"><a href="{link("/updates/notices/" + n["slug"] + "/")}">{html.escape(n["title"])}</a></div>'
        f'<span class="badge badge--open">{html.escape(n["status"])}</span></li>'
        for n in NOTICES
    )
    archived_rows = "".join(
        f'<li class="record-row"><div class="record-row__title">{html.escape(title)}</div>'
        f'<div class="record-row__meta">{html.escape(date)}</div>'
        '<span class="badge badge--archived">Archived</span></li>'
        for title, date in ARCHIVED_ITEMS
    )

    intro = (
        "News, events, notices, workshops, careers, and media coverage are kept as separate, "
        "typed record lists rather than one shared page, per PRODUCT_REQUIREMENTS.md FR-07. "
        "The legacy site mixed current 2026-27 notices with items dated 2022 and 2023 on the "
        "same page with no distinguishing status &mdash; this section keeps them visibly separate."
    )

    # The notice lists are what makes this hub different from the other six.
    # They go in the shared template's extra_sections slot so this page keeps
    # the photographic masthead, intro and link index every other hub has.
    notices_section = f"""
<section class="section section--subtle">
  <div class="container">
    <div class="sec-head reveal"><div class="sec-head__text">
      <p class="eyebrow">Current</p><h2>Current notices</h2>
    </div></div>
    <ul class="record-list reveal">{current_rows}</ul>

    <div class="sec-head reveal" style="margin-top:var(--space-16)"><div class="sec-head__text">
      <p class="eyebrow">Superseded</p><h2>Archived &mdash; legacy, not current</h2>
    </div></div>
    <ul class="record-list reveal">{archived_rows}</ul>
  </div>
</section>
""".strip()

    body = render_landing_content(
        title="News & Notices",
        summary=("Current admissions, academic and institutional notices, plus news, "
                 "events, workshops and careers."),
        intro_paragraphs=[intro],
        extra_sections=notices_section,
        child_groups=[
            (None, [
                ("News", link("/updates/news/")),
                ("Events", link("/updates/events/")),
                ("Notices", link("/updates/notices/")),
                ("Workshops", link("/updates/workshops/")),
                ("Careers and project openings", link("/updates/careers/")),
                ("Media coverage", link("/updates/media/")),
                ("Archive", link("/updates/archive/")),
            ]),
        ],
        owner="Varies by record type (see governance table, CONTENT_MIGRATION_LAUNCH.md §3)",
        last_reviewed=CRAWL_DATE,
        section_key="updates",
        root=root,
    )

    render_page(
        output_rel_path="updates/index.html",
        title="News & Notices",
        description="Current news, events, notices, workshops, and careers at Centre for Advanced Studies (CAS).",
        content_html=body,
        active_nav="updates",
        breadcrumb_items=[("News & Notices", None)],
    )
