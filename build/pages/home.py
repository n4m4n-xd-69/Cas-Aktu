"""
Homepage — cinematic institutional landing page.

Ten sections, ten distinct compositions. The old page reached for
`grid grid--3` three times and `rows` twice, which is what made it read
as a template: every band had the same silhouette. Here the sequence is
hero, tile strip, sticky/dense split, asymmetric mosaic, full-bleed
reversed band, 60/40 sticky feature, ruled editorial columns, mirrored
bleed feature, horizontal rail, CTA — alternating side and density so
the eye never settles into a rhythm.

Every figure and record comes from build/data/*.py, which was migrated
from the real CAS site. Sections the brief asked for that have no source
data (recruiters, testimonials, alumni stories, partner logos, rankings)
are absent rather than invented — fabricating an institution's
credentials stays off the table regardless of design brief.
"""
from __future__ import annotations

import html
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from icons import icon  # noqa: E402
from imagepipe import get_pipeline, picture, HERO_W, BAND_W, HALF_W, CARD_W, THUMB_W  # noqa: E402
from data.images import HERO as HERO_IMAGES, CAMPUS, LABS, RESEARCH, EVENTS as EVENT_IMAGES  # noqa: E402
from data.notices import NOTICES  # noqa: E402
from data.programs import PROGRAMS  # noqa: E402
from data.publications import PUBLICATIONS  # noqa: E402
from data.patents import PATENTS  # noqa: E402
from data.projects import PROJECTS  # noqa: E402
from data.equipment import EQUIPMENT  # noqa: E402
from data.events import EVENTS  # noqa: E402
from data.people import CURRENT_FACULTY, VISITING_FACULTY, STAFF  # noqa: E402
from data.past_faculty import PAST_FACULTY  # noqa: E402
from data.important_links import IMPORTANT_LINKS  # noqa: E402

PIPE = None


def _img(rec, *, sizes, width, cls="", priority=False, ratio=None, defer=False):
    meta = PIPE.process(rec["src"], width)
    return picture(meta, rec, sizes=sizes, cls=cls, priority=priority,
                   ratio=ratio, defer=defer)


# Department -> the image that best represents it, chosen from the
# curated set rather than a stock lookup.
DEPARTMENTS = [
    ("Computer Science & Engineering",
     "AI and machine learning, deep learning, cyber security, ICT, data science, IoT, computer vision and cloud computing.",
     LABS[3]),
    ("Mechatronics",
     "Robotics, PLC and SCADA, drones and aerial systems, and industrial automation.",
     LABS[0]),
    ("Manufacturing Technology & Automation",
     "Industry 4.0, additive manufacturing, micro and nano manufacturing, smart factory automation.",
     LABS[5]),
    ("Nanotechnology",
     "Nanomaterial synthesis and characterisation, nanofabrication, MEMS/NEMS devices, microfluidics.",
     LABS[7]),
    ("Energy Science & Technology",
     "Renewable energy, energy conversion and storage, photovoltaics, energy management systems.",
     LABS[1]),
]

CAMPUS_FEATURES = [
    ("wifi", "Campus-wide connectivity",
     "1 Gbps Wi-Fi with 1 Gbps LAN connectivity and 10 Gbps traffic support across the campus."),
    ("shield", "24-hour security",
     "HD CCTV surveillance, round-the-clock security at entry points, and a full perimeter compound wall."),
    ("bed", "Residential facilities",
     "Separate hostels for men and women, approximately 75 single-seater rooms each, with internet and security."),
    ("book", "Digital library",
     "Access to international science and engineering books, journals, and e-resource consortia."),
]


def build(render_page, load_content, root: Path) -> None:
    global PIPE
    PIPE = get_pipeline(root)

    c = {
        "programs": len(PROGRAMS),
        "faculty": len(CURRENT_FACULTY) + len(VISITING_FACULTY),
        "people": len(CURRENT_FACULTY) + len(VISITING_FACULTY) + len(STAFF) + len(PAST_FACULTY),
        "equipment": len(EQUIPMENT),
        "patents": len(PATENTS),
        "projects": len(PROJECTS),
        "publications": len(PUBLICATIONS),
        "events": len(EVENTS),
    }

    # The ticker sits directly under the photograph rather than above the
    # masthead. Four stacked bands used to separate the top of the window
    # from the hero; now the photograph is the first thing on the page and
    # the notices are the first thing under it.
    from generate import render_notice_ticker  # noqa: E402
    ticker = render_notice_ticker([
        {"type": n["notice_type"], "title": n["title"], "status": n["status"],
         "href": f"updates/notices/{n['slug']}/"}
        for n in NOTICES
    ])

    content = "".join([
        _notice_dialog(),
        _hero(c),
        ticker,
        _notices(),
        _quicklinks(),
        _about(),
        _departments(),
        _statband(c),
        _research(c),
        _programmes(),
        _campus(),
        _events(),
        _important_links(),
        _cta(),
    ])

    render_page(
        output_rel_path="index.html",
        title="Home",
        description=(
            "Centre for Advanced Studies — an in-campus research institute of Dr. A.P.J. Abdul Kalam "
            "Technical University, Lucknow. M.Tech, Ph.D. and B.Tech programmes in computing, mechatronics, "
            "nanotechnology, manufacturing and energy."
        ),
        content_html=content,
        active_nav=None,
        breadcrumb_items=[],
        # Puts the masthead over the photograph instead of above it, so the
        # hero is genuinely edge-to-edge and full-height on first paint.
        body_class="has-hero-overlay",
        head_extra=_preload_hero(),
    )


def _preload_hero() -> str:
    """Preload only the first slide, in the format the browser will actually
    pick. LCP is that image, so it must not wait for CSS to be parsed."""
    meta = PIPE.process(HERO_IMAGES[0]["src"], HERO_W)
    if "avif" in meta.get("sources", {}):
        return (f'<link rel="preload" as="image" type="image/avif" '
                f'imagesrcset="{meta["sources"]["avif"]}" imagesizes="100vw">')
    return (f'<link rel="preload" as="image" type="image/webp" '
            f'imagesrcset="{meta["sources"]["webp"]}" imagesizes="100vw">')


# ------------------------------------------------------- 1. hero
def _hero(c: dict) -> str:
    """A photograph and a statement.

    This hero previously carried twenty competing elements — eyebrow pill,
    headline, a four-line lede, two buttons, four statistics, a slide caption,
    six dots, pause/play, two arrows and a scroll cue — against the five the
    reference institute site uses. Everything removed here still exists
    elsewhere on the page: the statistics have their own full-bleed band, the
    admissions call-to-action leads the notice ticker directly above, and the
    slide caption's information is in each image's alt text.

    What stays is the accessible minimum plus navigation: pause control
    (WCAG 2.2.2), polite live region, arrows, keyboard and swipe. Dots were
    redundant with the arrows and the live region, not an accessibility
    affordance in their own right.
    """
    slides = []
    for n, rec in enumerate(HERO_IMAGES):
        # Slide 1 loads immediately and is the LCP element. Slides 2-6 are
        # deferred until app.js hydrates them, otherwise the browser fetches
        # and decodes all six before first paint (see imagepipe.picture).
        pic = _img(rec, sizes="100vw", width=HERO_W,
                   priority=(n == 0), defer=(n != 0))
        cap = html.escape(rec.get("caption") or "")
        slides.append(
            f'<div class="hero__slide{" is-active" if n == 0 else ""}" data-hero-slide '
            f'data-caption="{cap}" aria-hidden="{"false" if n == 0 else "true"}">{pic}</div>'
        )

    return f"""
<section class="hero" data-hero aria-roledescription="carousel" aria-label="Centre for Advanced Studies">
  <div class="hero__media">{''.join(slides)}</div>
  <div class="hero__scrim" aria-hidden="true"></div>
  <div class="hero__grain" aria-hidden="true"></div>

  <div class="container hero__inner">
    <h1 class="hero__title">Research that moves <em>Uttar Pradesh</em> forward.</h1>
    <p class="hero__lede">
      An in-campus research institute of Dr. A.P.J. Abdul Kalam Technical
      University, Lucknow.
    </p>
    <div class="hero__actions">
      <a class="btn btn--lg btn--primary" href="academics/programs/">Explore programmes {icon("arrow-right", 16)}</a>
    </div>
  </div>

  <button type="button" class="hero__arrow hero__arrow--prev" data-hero-prev
          aria-label="Previous slide">{icon("chevron-left", 24)}</button>
  <button type="button" class="hero__arrow hero__arrow--next" data-hero-next
          aria-label="Next slide">{icon("chevron-right", 24)}</button>

  <div class="hero__controls">
    <button type="button" class="hero__playpause" data-hero-playpause
            aria-pressed="false" aria-label="Pause slideshow">
      <span class="ico-pause">{icon("pause", 14)}</span><span class="ico-play">{icon("play", 14)}</span>
    </button>
  </div>
  <p class="sr-only" aria-live="polite" data-hero-live></p>

  <div class="scroll-cue" aria-hidden="true"><span>Scroll</span>{icon("chevron-down", 16)}</div>
</section>
""".strip()


# ------------------------------------------------------- 2. quick tasks
def _quicklinks() -> str:
    items = [
        ("programs", "Programmes", "academics/programs/"),
        ("admissions", "Admissions", "admissions/"),
        ("notices", "Notices", "updates/notices/"),
        ("documents", "Documents", "documents/"),
        ("experts", "Find an expert", "people/faculty/"),
        ("contact", "Contact", "contact/"),
    ]
    tiles = "".join(
        f'<a class="quicklink reveal" href="{h}"><span class="quicklink__ico">{icon(i, 20)}</span>'
        f"<span>{l}</span></a>"
        for i, l, h in items
    )
    return f"""
<section class="section section--tight section--flush-top" aria-label="Quick links">
  <div class="container"><div class="quicklinks quicklinks--overlap">{tiles}</div></div>
</section>
""".strip()


# ------------------------------------------------------- 3. notices (sticky split)
def _notices() -> str:
    rows = "".join(
        f'<li><div class="row"><div class="row__title">'
        f'<a href="updates/notices/{n["slug"]}/">{html.escape(n["title"])}</a></div>'
        f'<div class="row__meta">{html.escape(n["notice_type"])}'
        f'{" &middot; " + html.escape(n["session"]) if n.get("session") else ""}</div>'
        f'<span class="badge badge--{"open" if n["status"].lower() == "open" else "updated"}">'
        f'{html.escape(n["status"])}</span></div></li>'
        for n in NOTICES
    )
    return f"""
<section class="section section--subtle">
  <div class="container">
    <div class="feature feature--wide-text">
      <div class="feature__media feature__media--sticky reveal">
        <p class="eyebrow">Current</p>
        <h2>Notices &amp; announcements</h2>
        <p class="lede">Live admissions, registration and academic notices for the
        2026&ndash;27 session. Every notice links to the signed original.</p>
        <p style="margin-top:var(--space-6)">
          <a class="arrow-link" href="updates/notices/">All notices {icon("arrow-right", 15)}</a>
        </p>
      </div>
      <div class="feature__body reveal"><ul class="rows">{rows}</ul></div>
    </div>
  </div>
</section>
""".strip()


# ------------------------------------------------------- 4. departments (mosaic)
def _departments() -> str:
    tiles = []
    for n, (title, body, img) in enumerate(DEPARTMENTS):
        lead = n == 0
        pic = _img(
            img,
            sizes="(min-width:1100px) 50vw, (min-width:760px) 33vw, 50vw",
            width=BAND_W if lead else CARD_W,
        )
        tiles.append(
            f'<article class="mosaic__item{" mosaic__item--lead" if lead else ""} reveal">'
            f"{pic}"
            f'<p class="mosaic__eyebrow">Department</p>'
            f'<h3 class="mosaic__title"><a href="research/">{title}</a></h3>'
            f'<p class="mosaic__body">{body}</p>'
            f"</article>"
        )
    return f"""
<section class="section">
  <div class="container">
    <div class="sec-head reveal">
      <div class="sec-head__text">
        <p class="eyebrow">Disciplines</p>
        <h2>Five departments, one interdisciplinary campus</h2>
        <p>Each department runs its own laboratories, doctoral programme and funded research
        portfolio &mdash; and collaborates across the others.</p>
      </div>
      <a class="arrow-link" href="research/">Research at CAS {icon("arrow-right", 15)}</a>
    </div>
    <div class="mosaic">{''.join(tiles)}</div>
  </div>
</section>
""".strip()


# ------------------------------------------------------- 5. statistics (full-bleed band)
def _statband(c: dict) -> str:
    stats = [
        (c["publications"], "Indexed publications", "Migrated from the institute's published record"),
        (c["patents"], "Patents filed", "Indian Patent Office applications"),
        (c["projects"], "Funded projects", "DST, SERB, AICTE and MSME"),
        (c["equipment"], "Major equipment &amp; labs", "Across all five departments"),
    ]
    cells = "".join(
        f'<div class="stat reveal"><div class="stat__num" data-count="{n}">{n}</div>'
        f'<div class="stat__label">{l}</div><div class="stat__note">{note}</div></div>'
        for n, l, note in stats
    )
    return f"""
<section class="statband">
  <div class="container statband__inner">
    <div class="statband__head reveal">
      <p class="eyebrow eyebrow--ondark">By the numbers</p>
      <h2>Research output and infrastructure</h2>
      <p>Counts reflect records migrated from the institute's published material and are
      pending institutional confirmation.</p>
    </div>
    <div class="stats">{cells}</div>
  </div>
</section>
""".strip()


# ------------------------------------------------------- 6. research (60/40 sticky)
def _research(c: dict) -> str:
    pubs = "".join(
        f'<li><div class="record-row"><div class="record-row__title">'
        f'{html.escape(p["title"])}</div>'
        f'<div class="record-row__meta">{html.escape(p.get("venue") or "")}'
        f'{" &middot; " + str(p["year"]) if p.get("year") else ""}</div></div></li>'
        for p in PUBLICATIONS[:5]
    )
    img = RESEARCH[3]
    return f"""
<section class="section">
  <div class="container">
    <div class="feature feature--wide-text">
      <div class="feature__media feature__media--sticky reveal">
        {_img(img, sizes="(min-width:900px) 42vw, 100vw", width=HALF_W, ratio="4/5")}
        <p class="feature__cap">{html.escape(img["alt"])}</p>
      </div>
      <div class="feature__body reveal">
        <p class="eyebrow">Research impact</p>
        <h2>Applied work with a measurable outcome</h2>
        <p class="lede">CAS research runs from AI-assisted medical diagnosis and assistive devices
        for the visually impaired, through corrosion science and nano-lubricants, to energy storage
        and photovoltaics.</p>
        <ul class="record-list record-list--stacked" style="margin-top:var(--space-8)">{pubs}</ul>
        <div style="display:flex;gap:var(--space-3);flex-wrap:wrap;margin-top:var(--space-8)">
          <a class="btn btn--secondary" href="research/publications/">All {c["publications"]} publications {icon("arrow-right", 15)}</a>
          <a class="btn btn--ghost" href="research/equipment/">Facilities &amp; equipment</a>
        </div>
      </div>
    </div>
  </div>
</section>
""".strip()


# ------------------------------------------------------- 7. programmes (editorial columns)
def _programmes() -> str:
    levels = [
        ("01", "M.Tech", "academics/mtech/", "mtech"),
        ("02", "Ph.D.", "academics/phd/", "phd"),
        ("03", "B.Tech", "academics/btech/", "btech"),
    ]
    cols = []
    for num, label, href, level_key in levels:
        matching = [p for p in PROGRAMS if level_key in p["slug"]]
        items = "".join(
            f'<li>{html.escape(p["title"])}</li>' for p in matching[:6]
        ) or "<li>Programme details available on the level page.</li>"
        cols.append(
            f'<div class="editorial__col reveal">'
            f'<span class="editorial__num">{num}</span>'
            f'<h3 class="editorial__title"><a href="{href}">{label}</a></h3>'
            f'<p class="editorial__body">{len(matching)} programme{"s" if len(matching) != 1 else ""} '
            f'&mdash; taught with laboratory access and dissertation supervision.</p>'
            f'<ul class="editorial__list">{items}</ul>'
            f'<p class="editorial__foot"><a class="arrow-link" href="{href}">'
            f'View {label} {icon("arrow-right", 15)}</a></p>'
            f"</div>"
        )
    return f"""
<section class="section section--subtle">
  <div class="container">
    <div class="sec-head reveal">
      <div class="sec-head__text">
        <p class="eyebrow">Study at CAS</p>
        <h2>Programmes built around research</h2>
        <p>Every programme is taught inside a working research environment &mdash; laboratory
        access and dissertation supervision are part of the degree, not an add-on.</p>
      </div>
      <a class="arrow-link" href="academics/programs/">Compare all programmes {icon("arrow-right", 15)}</a>
    </div>
    <div class="editorial">{''.join(cols)}</div>
  </div>
</section>
""".strip()


# ------------------------------------------------------- 8. campus (mirrored bleed)
def _campus() -> str:
    feats = "".join(
        f'<div class="feat"><span class="feat__ico">{icon(i, 18)}</span>'
        f'<div><div class="feat__title">{t}</div><div class="feat__body">{b}</div></div></div>'
        for i, t, b in CAMPUS_FEATURES
    )
    img = CAMPUS[4]
    return f"""
<section class="section">
  <div class="container">
    <div class="feature feature--bleed feature--reverse">
      <div class="feature__media reveal">
        {_img(img, sizes="(min-width:900px) 50vw, 100vw", width=BAND_W, ratio="3/2")}
      </div>
      <div class="feature__body reveal">
        <p class="eyebrow">Campus life</p>
        <h2>A campus designed for focused work</h2>
        <p class="lede">Purpose-built laboratories, high-speed connectivity, on-campus residence
        and a digital library &mdash; everything within a single secure campus.</p>
        <div class="feat-list" style="margin-top:var(--space-8)">{feats}</div>
        <p style="margin-top:var(--space-8)">
          <a class="btn btn--secondary" href="campus/">Explore campus {icon("arrow-right", 15)}</a>
        </p>
      </div>
    </div>
  </div>
</section>
""".strip()


# ------------------------------------------------------- 9. events (rail)
def _events() -> str:
    upcoming = [e for e in EVENTS if e.get("status", "").lower() != "completed"]
    shown = (upcoming or EVENTS)[:10]
    imgs = EVENT_IMAGES
    cards = []
    for n, e in enumerate(shown):
        rec = imgs[n % len(imgs)]
        cards.append(
            f'<article class="rail-card">'
            f'{_img(rec, sizes="320px", width=THUMB_W)}'
            f'<div class="rail-card__body">'
            f'<p class="card__eyebrow">{html.escape(e.get("mode") or "Workshop")}</p>'
            f'<h3 class="rail-card__title"><a href="updates/events/">{html.escape(e["title"])}</a></h3>'
            f'<p class="rail-card__meta">{html.escape(e.get("dates") or "")}</p>'
            f"</div></article>"
        )
    note = "" if upcoming else (
        '<p class="callout" style="margin-top:var(--space-6)">'
        f'<span class="callout__ico">{icon("info", 18)}</span>'
        "<span>No current or upcoming programmes are listed. The workshops below are the "
        "institute's completed training record, shown because they document real capability "
        "&mdash; they are not open for registration.</span></p>"
    )
    return f"""
<section class="section section--subtle">
  <div class="container">
    <div class="sec-head reveal">
      <div class="sec-head__text">
        <p class="eyebrow">Activity</p>
        <h2>Workshops &amp; training</h2>
        <p>Short-term courses run by CAS departments in robotics, nanotechnology, corrosion
        science, additive manufacturing and applied AI.</p>
      </div>
      <div class="rail-nav">
        <button type="button" class="rail-btn" data-rail-prev aria-label="Scroll left">{icon("chevron-left", 18)}</button>
        <button type="button" class="rail-btn" data-rail-next aria-label="Scroll right">{icon("chevron-right", 18)}</button>
      </div>
    </div>
    <div class="rail-wrap">
      <div class="rail" data-rail tabindex="0" role="group" aria-label="Workshops and training, scrollable">
        {''.join(cards)}
      </div>
    </div>
    {note}
  </div>
</section>
""".strip()


# ------------------------------------------------------- 10. CTA
# ------------------------------------------- opening notice dialog
def _notice_dialog() -> str:
    """Admissions notice shown once per visit, as the owner asked for.

    Built on native <dialog>, so the focus trap, Escape handling and inert
    background come from the browser rather than from hand-written JS. It is
    opened by app.js and only when the visitor has not already dismissed it
    this session — a modal that reappears on every navigation is the thing
    people hate about announcement popups.

    Nothing here is exclusive to the dialog: every notice it lists is also in
    the ticker and in the notices section below the hero, so a visitor who
    never sees it (JS blocked, or already dismissed) loses nothing.
    """
    items = "".join(
        f'<li class="record-row">'
        f'<div class="record-row__title">'
        f'<a href="updates/notices/{n["slug"]}/">{html.escape(n["title"])}</a></div>'
        f'<span class="badge badge--open">{html.escape(n["status"])}</span></li>'
        for n in NOTICES[:4]
    )
    return f"""
<dialog class="notice-dialog" id="notice-dialog" data-notice-dialog
        aria-labelledby="notice-dialog-title">
  <div class="notice-dialog__head">
    <div>
      <p class="eyebrow">Admissions 2026&ndash;27</p>
      <h2 id="notice-dialog-title">Current notices</h2>
    </div>
    <button type="button" class="icon-btn" data-notice-close
            aria-label="Close notices">{icon("close", 20)}</button>
  </div>
  <ul class="record-list">{items}</ul>
  <div class="notice-dialog__foot">
    <a class="btn btn--primary" href="updates/notices/">All notices {icon("arrow-right", 16)}</a>
    <button type="button" class="btn btn--secondary" data-notice-close>Dismiss</button>
  </div>
</dialog>
""".strip()


# ------------------------------------------- about the institute
def _about() -> str:
    """A short summary band, matching the legacy home page's "About the
    Institute" section. Prose is the opening paragraph of the About hub, not
    new copy — this is a doorway, not a second version of the institute's
    description that could drift out of step with the first."""
    rec = CAMPUS[0]
    pic = _img(rec, sizes="(min-width: 900px) 44vw, 100vw", width=HALF_W, ratio="4/3")
    return f"""
<section class="section">
  <div class="container">
    <div class="feature reveal">
      <div class="feature__media">{pic}</div>
      <div class="feature__body">
        <p class="eyebrow">About the institute</p>
        <h2>An in-campus research institute of AKTU</h2>
        <p>Established by the Uttar Pradesh State Government in 2017, the Centre for
        Advanced Studies offers M.Tech. and Ph.D. programmes in computer science and
        engineering, mechatronics, nanotechnology, manufacturing technology and
        automation, and energy science and technology, alongside B.Tech. offerings.</p>
        <p>Its stated objective is to give research scholars and academicians a platform
        to create and disseminate research-based knowledge and technologies.</p>
        <a class="arrow-link" href="about/">More about CAS {icon("arrow-right", 16)}</a>
      </div>
    </div>
  </div>
</section>
""".strip()


# ------------------------------------------- important links
def _important_links() -> str:
    """The legacy home page's "Important Links" panel, rebuilt.

    Same rule as the section hubs: a destination this build does not produce
    is shown as a "Planned" row rather than a link that 404s, so the roadmap
    stays visible and the internal-link check stays green.
    """
    rows = []
    for label, path in IMPORTANT_LINKS:
        if path:
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
    live = sum(1 for _, p in IMPORTANT_LINKS if p)
    return f"""
<section class="section section--tight section--subtle">
  <div class="container">
    <div class="sec-head reveal"><div class="sec-head__text">
      <p class="eyebrow">Quick reference</p>
      <h2>Important links</h2>
    </div>
    <a class="arrow-link" href="documents/">All documents {icon("arrow-right", 16)}</a></div>
    <ul class="linkgrid reveal">{''.join(rows)}</ul>
    <p class="hub-meta">{live} of {len(IMPORTANT_LINKS)} destinations migrated so far &middot;
    the remainder are named here because the legacy site lists them, and are pending migration.</p>
  </div>
</section>
""".strip()


def _cta() -> str:
    return f"""
<section class="section">
  <div class="container">
    <div class="cta-band reveal">
      <p class="eyebrow eyebrow--ondark">Collaborate</p>
      <h2>Work with CAS</h2>
      <p>Industry partners, collaborating institutions and prospective research scholars can
      reach the institute directly. We welcome collaboration on funded research, laboratory
      access and doctoral supervision.</p>
      <div class="cta-band__actions">
        <a class="btn btn--lg btn--primary" href="contact/">Contact the institute {icon("arrow-right", 16)}</a>
        <a class="btn btn--lg btn--ondark" href="people/faculty/">Find an expert</a>
      </div>
    </div>
  </div>
</section>
""".strip()
