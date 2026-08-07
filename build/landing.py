"""
Shared section-landing template (docs/INFORMATION_ARCHITECTURE.md #5:
breadcrumb, title/summary, primary tasks, grouped child links, current
highlights, related content, owning office, last reviewed date).

One function, reused by every section landing page, so markup cannot drift
between sections. Upgrading this file upgrades all seven hubs at once.

Composition: compact photographic masthead, editorial intro, highlights as
ruled columns (not another card grid), then a grouped link index. The hubs
deliberately do NOT repeat the homepage's card mosaic — a section landing
page is a wayfinding surface, and its job is to be scannable.
"""
from __future__ import annotations

import html
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from icons import icon  # noqa: E402
from imagepipe import get_pipeline, picture, BAND_W  # noqa: E402
from data import images as IMG  # noqa: E402

# All section landing pages live one level deep (site/<section>/index.html),
# so "../" reaches the site root consistently.
SECTION_PREFIX = "../"

# Each hub gets a real photograph of that part of the institute, chosen from
# the curated manifest rather than a decorative gradient.
# Each entry was checked against the actual photograph on 7 August 2026.
# Three were wrong for their section: People showed an empty computer lab,
# Campus showed an indoor teaching lab rather than the grounds, and News
# showed a lectern shot with a burned-in GPS geotag overlay across it.
SECTION_IMAGE = {
    "about": ("campus", 0),      # main entrance
    "academics": ("teaching", 0),  # lecture room in use
    "admissions": ("campus", 8),   # library reading area
    "research": ("labs", 0),       # automation hall
    "people": ("events", 6),       # a group of people, for the People section
    "campus": ("campus", 1),       # a building and its lawn, i.e. the grounds
    "updates": ("events", 2),      # a visit being hosted — an actual news event
}


def link(path: str, prefix: str = SECTION_PREFIX) -> str:
    return path if path.startswith("http") else f"{prefix}{path.lstrip('/')}"


def _exists(path: str, root: Path | None) -> bool:
    """Does this hub link resolve to a page the generator actually built?

    Hub links are written as "../research/themes/", relative to
    site/<section>/index.html, so stripping the leading "../" gives a path
    under site/."""
    if path.startswith(("http://", "https://", "mailto:", "#")):
        return True
    if root is None:
        return True
    rel = path
    while rel.startswith("../"):
        rel = rel[3:]
    target = root / "site" / rel.strip("/")
    return target.exists() or (target / "index.html").exists()


def _masthead(section_key: str | None, title: str, summary: str, root: Path | None) -> str:
    """Compact photographic masthead. Falls back to a plain heading block if
    the section has no assigned image, so this never hard-fails."""
    pic = ""
    if section_key and section_key in SECTION_IMAGE and root is not None:
        group, idx = SECTION_IMAGE[section_key]
        records = IMG.ALL_GROUPS.get(group) or []
        if idx < len(records):
            rec = records[idx]
            meta = get_pipeline(root).process(rec["src"], BAND_W)
            pic = picture(meta, rec, sizes="100vw", priority=True,
                          prefix=SECTION_PREFIX)

    if not pic:
        return f"""
<div class="page-head container">
  <h1>{html.escape(title)}</h1>
  <p class="lede">{summary}</p>
</div>
""".strip()

    return f"""
<section class="hero hero--compact" aria-label="{html.escape(title)}">
  <div class="hero__media"><div class="hero__slide is-active">{pic}</div></div>
  <div class="hero__scrim" aria-hidden="true"></div>
  <div class="container hero__inner">
    <h1 class="hero__title" style="font-size:var(--text-4xl);max-width:20ch">{html.escape(title)}</h1>
    <p class="hero__lede">{summary}</p>
  </div>
</section>
""".strip()


def render_landing_content(
    title: str,
    summary: str,
    intro_paragraphs: list[str],
    child_groups: list[tuple[str | None, list[tuple[str, str]]]],
    # `extra_sections` is raw markup dropped between the highlights and the
    # link index. News & Notices needs to list current and superseded notices,
    # which no other hub does; before this slot existed it hand-built the whole
    # page and quietly lost the photographic masthead the other six carry.
    highlights: list[tuple[str, str]] | None = None,
    extra_sections: str = "",
    owner: str = "",
    last_reviewed: str = "",
    source_note: str = "",
    section_key: str | None = None,
    root: Path | None = None,
) -> str:
    intro_html = "".join(f"<p>{p}</p>" for p in intro_paragraphs)

    # Link index: grouped rows, not cards. Dense, repeated wayfinding
    # records read better as rows (UX_UI_SPECIFICATION.md §6).
    #
    # These lists were authored from the information architecture, so they
    # name sub-sections the generator does not yet produce — Research alone
    # pointed at themes/, experts/, innovations/, collaborations/, scholars/
    # and resources/. Deleting them would hide a real content roadmap;
    # linking them ships a 404. So an unbuilt destination renders as a
    # non-interactive row marked "Planned", and the build's internal-link
    # check stays green because no dead href is emitted.
    groups_html = []
    for group_label, links in child_groups:
        rows = []
        for label, path in links:
            if _exists(path, root):
                rows.append(
                    f'<li><a class="hublink" href="{html.escape(path)}">'
                    f'<span>{html.escape(label)}</span>{icon("arrow-right", 15)}</a></li>'
                )
            else:
                rows.append(
                    f'<li><span class="hublink hublink--planned">'
                    f'<span>{html.escape(label)}</span>'
                    f'<span class="badge badge--draft">Planned</span></span></li>'
                )
        heading = f"<h3>{html.escape(group_label)}</h3>" if group_label else ""
        groups_html.append(f'<div class="hubgroup">{heading}<ul class="hublist">{"".join(rows)}</ul></div>')

    highlights_html = ""
    if highlights:
        cols = "".join(
            f'<div class="editorial__col reveal">'
            f'<span class="editorial__num">{n:02d}</span>'
            f'<h3 class="editorial__title">{html.escape(h_title)}</h3>'
            f'<p class="editorial__body">{h_body}</p></div>'
            for n, (h_title, h_body) in enumerate(highlights, 1)
        )
        highlights_html = f"""
<section class="section section--subtle">
  <div class="container">
    <div class="sec-head reveal"><div class="sec-head__text">
      <p class="eyebrow">Current highlights</p>
      <h2>What this section covers</h2>
    </div></div>
    <div class="editorial">{cols}</div>
  </div>
</section>
"""

    source_html = (
        f'<p class="callout" role="note"><span class="callout__ico">{icon("info", 18)}</span>'
        f"<span>{source_note}</span></p>"
        if source_note else ""
    )

    meta_bits = []
    if owner:
        meta_bits.append(f"Owning office: {html.escape(owner)}")
    if last_reviewed:
        meta_bits.append(f"Content last reviewed: {html.escape(last_reviewed)}")
    meta_html = (
        f'<p class="hub-meta">{" &middot; ".join(meta_bits)}</p>' if meta_bits else ""
    )

    # The intro is a two-column split only when there is a source note to put
    # in the left column. Without one — News & Notices has no note — the split
    # rendered an empty column and pushed the opening paragraph to the right
    # half of an otherwise blank band.
    if source_html:
        intro_section = f"""
    <div class="feature feature--wide-text">
      <div class="feature__media feature__media--sticky reveal">
        {source_html}
      </div>
      <div class="feature__body reveal u-prose">{intro_html}</div>
    </div>"""
    else:
        intro_section = f'<div class="reveal u-prose" style="max-width:68ch">{intro_html}</div>'

    return f"""
{_masthead(section_key, title, summary, root)}
<section class="section">
  <div class="container">{intro_section}
  </div>
</section>
{highlights_html}
{extra_sections}
<section class="section">
  <div class="container">
    <div class="sec-head reveal"><div class="sec-head__text">
      <p class="eyebrow">Explore</p>
      <h2>Everything in this section</h2>
    </div></div>
    <div class="hubgrid reveal">{"".join(groups_html)}</div>
    {meta_html}
  </div>
</section>
""".strip()
