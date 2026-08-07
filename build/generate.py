#!/usr/bin/env python3
"""
Static site generator for the CAS AKTU public website rebuild.

Stdlib-only (no external dependencies), so the site can be rebuilt with
nothing but the Python already on this machine. The *output* is plain
HTML/CSS/vanilla JS with zero client framework and zero build step required
to view it (open site/index.html or serve the folder statically).

Single source of truth for navigation/footer data lives here so header and
mobile-menu markup can never drift apart (Development Rules: avoid duplicate
code, reuse components).

Usage:
    python build/generate.py
"""
from __future__ import annotations

import html
import json
import re
import shutil
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from icons import icon  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "site"
TEMPLATES = ROOT / "templates"
CONTENT = ROOT / "content"
DATA = ROOT / "data"

SITE_NAME = "Centre for Advanced Studies"
CANONICAL_BASE = "https://cas.res.in"  # PRODUCT_REQUIREMENTS.md "Proposed domain"
GENERATED_FROM_CRAWL_DATE = "6 August 2026"  # research/CAS_SOURCE_AUDIT.md audit date

# ---------------------------------------------------------------------------
# Navigation data (docs/INFORMATION_ARCHITECTURE.md #1)
# ---------------------------------------------------------------------------

# `children` drives the desktop mega menu and the mobile drawer from one
# definition, so the two can never disagree. Every path below is asserted
# to exist by check_links() at the end of the build.
PRIMARY_NAV = [
    {"key": "about", "label": "About", "path": "/about/", "children": [
        ("The institute", [("About CAS", "/about/"), ("Contact", "/contact/"),
                           ("Accessibility", "/accessibility/"), ("Privacy notice", "/privacy/")]),
        ("People", [("Faculty", "/people/faculty/"), ("Staff", "/people/staff/"),
                    ("Visiting faculty", "/people/visiting/")]),
    ]},
    {"key": "academics", "label": "Academics", "path": "/academics/", "children": [
        ("Programmes", [("All programmes", "/academics/programs/"), ("B.Tech", "/academics/btech/"),
                        ("M.Tech", "/academics/mtech/"), ("Ph.D.", "/academics/phd/")]),
        ("Resources", [("Document library", "/documents/"), ("Academic calendar", "/updates/notices/"),
                       ("Admissions", "/admissions/")]),
    ]},
    {"key": "admissions", "label": "Admissions", "path": "/admissions/", "children": [
        ("Apply", [("Admissions overview", "/admissions/"), ("Current notices", "/updates/notices/"),
                   ("Ordinances & fees", "/documents/")]),
        ("Programmes", [("B.Tech", "/academics/btech/"), ("M.Tech", "/academics/mtech/"),
                        ("Ph.D.", "/academics/phd/")]),
    ]},
    {"key": "research", "label": "Research", "path": "/research/", "children": [
        ("Output", [("Research overview", "/research/"), ("Publications", "/research/publications/"),
                    ("Patents", "/research/patents/"), ("Projects", "/research/projects/")]),
        ("Infrastructure", [("Facilities", "/research/facilities/"),
                            ("Major equipment", "/research/equipment/")]),
    ]},
    {"key": "people", "label": "People", "path": "/people/", "children": [
        ("Directory", [("All people", "/people/"), ("Faculty", "/people/faculty/"),
                       ("Visiting faculty", "/people/visiting/"), ("Staff", "/people/staff/"),
                       ("Former members", "/people/former/")]),
    ]},
    {"key": "campus", "label": "Campus", "path": "/campus/", "children": [
        ("On campus", [("Campus & facilities", "/campus/"), ("Research facilities", "/research/facilities/"),
                       ("Events & workshops", "/updates/events/")]),
    ]},
    {"key": "updates", "label": "News & Notices", "path": "/updates/", "children": [
        ("Updates", [("All updates", "/updates/"), ("Notices", "/updates/notices/"),
                     ("Events & workshops", "/updates/events/")]),
        ("Records", [("Document library", "/documents/"), ("Search the site", "/search/")]),
    ]},
]

# These three previously pointed at /academics/resources/, /campus/library/
# and /updates/careers/, none of which the generator produces — so every one
# of the 392 pages shipped three dead links in its utility bar and another
# three in its drawer. Retargeted to the canonical pages that actually hold
# this content; building out dedicated Resources/Library/Careers sections is
# tracked separately.
UTILITY_NAV = [
    {"label": "Apply / Admissions 2026-27", "path": "/admissions/", "external": False},
    {"label": "Academic documents", "path": "/documents/", "external": False},
    {"label": "Research facilities", "path": "/research/facilities/", "external": False},
    {"label": "Events & workshops", "path": "/updates/events/", "external": False},
    {"label": "Contact", "path": "/contact/", "external": False},
    {"label": "AKTU website", "path": "https://aktu.ac.in/", "external": True},
    {"label": "Search", "path": "/search/", "external": False},
]

# Real, sourced facts — research/cas-content-inventory.json contact1.html record.
CONTACT = {
    "org": "Centre for Advanced Studies (CAS)",
    "affiliation": "Dr. A.P.J. Abdul Kalam Technical University, New Campus (Lucknow)",
    "address": "Sector 11, Jankipuram Vistar Yojna, Lucknow, Uttar Pradesh 226031",
    "phone": "0522-2336808",
    "emails": [
        {"label": "Director", "email": "director@cas.res.in"},
        {"label": "General information", "email": "info@cas.res.in"},
        {"label": "Admissions", "email": "info@cas.res.in"},
        {"label": "Careers", "email": "career@cas.res.in"},
        {"label": "Examination control", "email": "examcontrol@cas.res.in"},
    ],
    # source: research/CAS_SOURCE_AUDIT.md / research/cas-content-inventory.json
    "source_note": "Contact details migrated from the legacy CAS website, crawled "
    + GENERATED_FROM_CRAWL_DATE
    + ". Pending confirmation by the accountable office (PRODUCT_REQUIREMENTS.md #2).",
}

FOOTER_POLICY_LINKS = [
    {"label": "Accessibility statement", "path": "/accessibility/"},
    {"label": "Privacy notice", "path": "/privacy/"},
    {"label": "Terms & disclaimer", "path": "/terms/"},
    {"label": "Copyright", "path": "/copyright/"},
    {"label": "Security reporting", "path": "/security/"},
    {"label": "Sitemap", "path": "/sitemap/"},
]


# ---------------------------------------------------------------------------
# Rendering helpers
# ---------------------------------------------------------------------------


def asset_prefix(output_rel_path: str) -> str:
    """Relative path back to site root, based on output file depth."""
    depth = output_rel_path.count("/")
    return "../" * depth if depth else ""

def render_notice_ticker(alerts: list[dict], prefix: str = "") -> str:
    """Continuously scrolling notice band.

    The legacy CAS site carries these notices in a `<marquee>`: obsolete,
    unpausable, and re-read by a screen reader on every pass. This is the same
    information as a CSS transform on a duplicated track, which gives the
    motion the owner asked for while satisfying WCAG 2.2.2:

    - a visible, persistent pause control, plus pause on hover and on
      keyboard focus within the band;
    - `prefers-reduced-motion: reduce` stops the animation completely and
      leaves a normal horizontally scrollable row;
    - the duplicated track exists only to make the loop seamless and is
      aria-hidden, so each notice is announced exactly once;
    - the band is a labelled region, not a live region — nothing here is new
      information arriving, so announcing it would be noise.
    """
    if not alerts:
        return ""

    items = []
    for a in alerts:
        href = a["href"] if a["href"].startswith("http") else f"{prefix}{a['href'].lstrip('/')}"
        items.append(
            f'<li class="ticker__item"><a href="{html.escape(href)}">'
            f'{html.escape(a["title"])}</a></li>'
        )
    track = "".join(items)

    # Hold a roughly constant reading speed regardless of how many notices are
    # live, rather than a fixed duration that races when there are two and
    # crawls when there are eight.
    characters = sum(len(a["title"]) for a in alerts)
    duration = max(30, round(characters / 4.5))

    return f"""
<div class="ticker" data-ticker style="--ticker-duration:{duration}s">
  <div class="container ticker__inner">
    <span class="ticker__label">{icon("notices", 13)} Notices</span>
    <div class="ticker__viewport">
      <div class="ticker__rail" data-ticker-rail>
        <ul class="ticker__track">{track}</ul>
        <ul class="ticker__track" aria-hidden="true">{track}</ul>
      </div>
    </div>
    <button type="button" class="ticker__pause" data-ticker-pause
            aria-pressed="false" aria-label="Pause scrolling notices">
      <span class="ico-pause">{icon("pause", 12)}</span><span class="ico-play">{icon("play", 12)}</span>
    </button>
  </div>
</div>
""".strip()


def render_header(active_key: str | None, prefix: str) -> str:
    def path(p: str) -> str:
        return p if p.startswith("http") else f"{prefix}{p.lstrip('/')}"

    util_items = []
    for item in UTILITY_NAV:
        cls = ' class="utilbar__cta"' if item.get("cta") else ""
        ext = (' target="_blank" rel="noopener"' if item["external"] else "")
        tail = icon("external", 12) if item["external"] else ""
        sr = ' <span class="sr-only">(opens in a new tab)</span>' if item["external"] else ""
        util_items.append(
            f'<li><a href="{html.escape(path(item["path"]))}"{cls}{ext}>{html.escape(item["label"])}{tail}{sr}</a></li>'
        )
    # Desktop nav. A section with children gets aria-haspopup/aria-expanded
    # and a matching panel; app.js wires hover, click, arrow-down and Escape
    # so the menu is fully operable without a pointer.
    nav_parts = []
    for i in PRIMARY_NAV:
        current = ' aria-current="page"' if i["key"] == active_key else ""
        kids = i.get("children")
        if kids:
            # The panel is nested inside its own nav item so it can be
            # positioned against that item. It previously lived at the end of
            # the header as a full-width band, which meant a three-item menu
            # opened a panel the width of the page with two sparse columns
            # floating in it.
            groups = "".join(
                (f'<p class="dropdown__group">{html.escape(title)}</p>' if title else "")
                + '<ul class="dropdown__list">'
                + "".join(
                    f'<li><a href="{html.escape(path(p))}">{html.escape(l)}</a></li>'
                    for l, p in links
                )
                + "</ul>"
                for title, links in kids
            )
            nav_parts.append(
                f'<div class="nav__item">'
                f'<a class="nav__link" href="{html.escape(path(i["path"]))}"{current} '
                f'data-menu-trigger="{i["key"]}" aria-haspopup="true" aria-expanded="false" '
                f'aria-controls="menu-{i["key"]}">{html.escape(i["label"])}'
                f'{icon("chevron-down", 14)}</a>'
                f'<div class="dropdown" id="menu-{i["key"]}" data-menu-panel="{i["key"]}" hidden>'
                f'{groups}</div>'
                f'</div>'
            )
        else:
            nav_parts.append(
                f'<div class="nav__item">'
                f'<a class="nav__link" href="{html.escape(path(i["path"]))}"{current}>'
                f'{html.escape(i["label"])}</a></div>'
            )
    nav_links = "".join(nav_parts)

    # Mobile drawer mirrors the same tree using native <details>, which gives
    # keyboard and screen-reader behaviour for free.
    drawer_items = []
    for i in PRIMARY_NAV:
        current = ' aria-current="page"' if i["key"] == active_key else ""
        kids = i.get("children")
        head = (f'<a href="{html.escape(path(i["path"]))}"{current}>'
                f'{html.escape(i["label"])}{icon("chevron-right", 18)}</a>')
        if not kids:
            drawer_items.append(f"<li>{head}</li>")
            continue
        sub = "".join(
            f'<li><a href="{html.escape(path(p))}">{html.escape(l)}</a></li>'
            for _, links in kids for l, p in links
        )
        drawer_items.append(f'<li>{head}<ul class="drawer__sub">{sub}</ul></li>')
    drawer_links = "".join(drawer_items)
    drawer_util = "".join(
        f'<li><a href="{html.escape(path(i["path"]))}"'
        f'{" target=\"_blank\" rel=\"noopener\"" if i["external"] else ""}>{html.escape(i["label"])}</a></li>'
        for i in UTILITY_NAV
    )

    # Both institutional marks sit at the top beside the name, the way IIT
    # Kanpur carries its crest. The emblems are decorative here because the
    # adjacent text already names the institute — announcing them again would
    # make a screen reader read the same name three times.
    brand = f"""
<a class="brand" href="{html.escape(path('/'))}">
  <img class="brand__emblem" src="{prefix}assets/brand/cas-emblem.png"
       alt="" width="120" height="120" decoding="async">
  <span class="brand__text">
    <span class="brand__name">Centre for Advanced Studies</span>
    <span class="brand__sub">In-campus institution of AKTU, Lucknow</span>
  </span>
</a>""".strip()

    # The parent university sits at the opposite end of the identity row, the
    # way an affiliation strip pairs two institutions rather than stacking
    # both marks against one edge.
    parent = f"""
<a class="parentmark" href="https://aktu.ac.in/" target="_blank" rel="noopener">
  <span class="parentmark__text">
    <span class="parentmark__label">Affiliated technical university</span>
    <span class="parentmark__name">Dr. A.P.J. Abdul Kalam Technical University</span>
  </span>
  <img class="brand__emblem" src="{prefix}assets/brand/aktu-emblem.png"
       alt="" width="125" height="125" decoding="async">
  <span class="sr-only">(opens in a new tab)</span>
</a>""".strip()

    # Two rows, both inside one overlay: institutional identity, then
    # navigation. The notice ticker and the utility bar used to sit above
    # these, which put four stacked bands between the top of the window and
    # the photograph. The notices are now a section directly below the hero,
    # and the utility links live in the drawer and the footer, where they
    # already were.
    return f"""
<div class="masthead" data-masthead>
<header class="site-header" data-header>
  <div class="container identity">
    {brand}
    {parent}
  </div>
  <div class="container site-header__inner">
    <nav class="nav" aria-label="Primary">{nav_links}</nav>
    <div class="header-actions">
      <a class="icon-btn" href="{html.escape(path('/search/'))}" data-palette-open
         aria-label="Search this site" title="Search (Ctrl+K)">{icon("search", 18)}</a>
      <button type="button" class="icon-btn theme-toggle" data-theme-toggle aria-label="Switch colour theme">
        <span class="icon-moon">{icon("moon", 18)}</span><span class="icon-sun">{icon("sun", 18)}</span>
      </button>
      <button type="button" class="icon-btn nav-toggle" data-drawer-toggle aria-expanded="false"
              aria-controls="drawer" aria-label="Open menu">{icon("menu", 20)}</button>
    </div>
  </div>
</header>
</div>
<dialog class="palette" data-palette aria-label="Search and jump to a page">
  <div class="palette__head">
    {icon("search", 18)}
    <input class="palette__input" type="text" data-palette-input
           role="combobox" aria-expanded="false" aria-controls="palette-list"
           aria-autocomplete="list" autocomplete="off" spellcheck="false"
           placeholder="Search or jump to&hellip;" aria-label="Search or jump to a page">
    <span class="palette__hint" data-palette-hint aria-hidden="true"></span>
    <!-- WCAG 2.5.3 Label in Name: the accessible name must contain the
         visible text, so it leads with "esc" rather than replacing it. -->
    <button type="button" class="palette__esc" data-palette-close
            aria-label="esc, close search">esc</button>
  </div>
  <ul class="palette__list" id="palette-list" role="listbox" data-palette-list
      aria-label="Search results"></ul>
  <p class="u-visually-hidden" role="status" aria-live="polite" data-palette-status></p>
  <div class="palette__foot" aria-hidden="true">
    <span><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> navigate</span>
    <span><kbd class="kbd">↵</kbd> open</span>
    <span><kbd class="kbd">#</kbd> documents <kbd class="kbd">@</kbd> people <kbd class="kbd">&gt;</kbd> sections</span>
  </div>
</dialog>
<div class="drawer" id="drawer" data-drawer hidden>
  <div class="drawer__head">
    {brand}
    <button type="button" class="icon-btn" data-drawer-close aria-label="Close menu">{icon("close", 20)}</button>
  </div>
  <div class="drawer__body">
    <p class="drawer__label">Explore</p>
    <ul class="drawer__nav">{drawer_links}</ul>
    <p class="drawer__label">Quick links</p>
    <ul class="drawer__util">{drawer_util}</ul>
  </div>
</div>
""".strip()


def render_breadcrumbs(items: list[tuple[str, str | None]], prefix: str) -> str:
    if not items:
        return ""
    parts = [f'<li><a href="{html.escape(prefix or "./")}">Home</a></li>']
    for label, p in items:
        if p:
            href = p if p.startswith("http") else f"{prefix}{p.lstrip('/')}"
            parts.append(f'<li><a href="{html.escape(href)}">{html.escape(label)}</a></li>')
        else:
            parts.append(f'<li aria-current="page">{html.escape(label)}</li>')
    return f'<nav class="breadcrumbs container" aria-label="Breadcrumb"><ol>{"".join(parts)}</ol></nav>'


def render_footer(prefix: str) -> str:
    def path(p: str) -> str:
        return p if p.startswith("http") else f"{prefix}{p.lstrip('/')}"

    explore = "".join(
        f'<li><a href="{html.escape(path(i["path"]))}">{html.escape(i["label"])}</a></li>' for i in PRIMARY_NAV
    )
    policies = "".join(
        f'<li><a href="{html.escape(path(i["path"]))}">{html.escape(i["label"])}</a></li>'
        for i in FOOTER_POLICY_LINKS
    )
    resources = "".join(
        f'<li><a href="{html.escape(path(p))}">{html.escape(l)}</a></li>'
        for l, p in [
            ("Document library", "/documents/"),
            ("Search", "/search/"),
            ("Admissions", "/admissions/"),
            ("Notices", "/updates/notices/"),
            ("Contact", "/contact/"),
        ]
    )
    emails = "".join(
        f'<div>{html.escape(e["label"])}: <a href="mailto:{html.escape(e["email"])}">{html.escape(e["email"])}</a></div>'
        for e in CONTACT["emails"][:3]
    )

    return f"""
<footer class="site-footer">
  <div class="container">
    <div class="site-footer__grid">
      <div>
        <div class="footer-brand">
          <span class="brand__mark" aria-hidden="true">CAS</span>
          <span class="brand__text">
            <span class="brand__name">Centre for Advanced Studies</span>
            <span class="brand__sub">An institute of AKTU, Lucknow</span>
          </span>
        </div>
        <div class="footer-contact">
          {html.escape(CONTACT["address"])}<br>
          Phone: {html.escape(CONTACT["phone"])}
          <div style="margin-top:var(--space-3)">{emails}</div>
        </div>
      </div>
      <div><h3>Explore</h3><ul>{explore}</ul></div>
      <div><h3>Resources</h3><ul>{resources}</ul></div>
      <div>
        <h3>Policies</h3><ul>{policies}</ul>
        <div class="footer-note">{html.escape(CONTACT["source_note"])}</div>
      </div>
    </div>
    <div class="site-footer__bottom">
      <span>&#169; Centre for Advanced Studies (CAS), AKTU. Draft migration &mdash; content pending institutional confirmation.</span>
      <span>Source crawled {html.escape(GENERATED_FROM_CRAWL_DATE)}</span>
    </div>
  </div>
</footer>
""".strip()


# ---------------------------------------------------------------------------
# file:// compatibility
# ---------------------------------------------------------------------------

# Internal links are written as directory URLs ("../academics/programs/").
# An HTTP server resolves those to the folder's index.html; the file://
# protocol does NOT — the browser shows a raw directory listing instead, so
# opening site/index.html from disk and clicking any nav item lands on a file
# index rather than the page. Appending the explicit index.html makes a link
# behave identically whether the site is double-clicked or served.
#
# Only <a href> is rewritten. The canonical URL and og: URLs live on <link>/
# <meta> and must keep the clean public form, so they are left untouched.
_ANCHOR_HREF = re.compile(r'(<a\b[^>]*?\shref=")([^"]*)(")', re.IGNORECASE)
_NON_PAGE_HREF = ("http://", "https://", "//", "mailto:", "tel:", "#", "javascript:", "data:")


def localize_href(href: str) -> str:
    """Turn a directory-style link into an explicit index.html link."""
    if not href or href.startswith(_NON_PAGE_HREF):
        return href
    base, sep, frag = href.partition("#")
    if base == "":
        base = "index.html"
    elif base.endswith("/"):
        base += "index.html"
    return base + sep + frag


def localize_links(page_html: str) -> str:
    return _ANCHOR_HREF.sub(
        lambda m: f"{m.group(1)}{localize_href(m.group(2))}{m.group(3)}", page_html
    )


def render_page(
    output_rel_path: str,
    title: str,
    description: str,
    content_html: str,
    active_nav: str | None = None,
    breadcrumb_items: list[tuple[str, str | None]] | None = None,
    head_extra: str = "",
    body_class: str = "",
    page_scripts: list[str] | None = None,
) -> None:
    """`page_scripts` names JS modules loaded only by the pages that need
    them — facets.js is 8 KB and is useless on 390 of the 392 pages, so it is
    not in the shared bundle."""
    layout = (TEMPLATES / "_layout.html").read_text(encoding="utf-8")
    prefix = asset_prefix(output_rel_path)
    canonical_path = output_rel_path.replace("index.html", "")
    page = (
        layout.replace("{{TITLE}}", html.escape(f"{title} | {SITE_NAME}"))
        .replace("{{DESCRIPTION}}", html.escape(description))
        .replace("{{CANONICAL}}", f"{CANONICAL_BASE}/{canonical_path}")
        .replace("{{ASSET_PREFIX}}", prefix)
        .replace("{{BODY_CLASS}}", html.escape(body_class))
        .replace("{{HEAD_EXTRA}}", head_extra)
        .replace("{{PAGE_SCRIPTS}}", "".join(
            f'<script src="{prefix}assets/js/{m}" defer></script>'
            for m in (page_scripts or [])
        ))
        .replace("{{HEADER}}", render_header(active_nav, prefix))
        .replace("{{BREADCRUMBS}}", render_breadcrumbs(breadcrumb_items or [], prefix))
        .replace("{{CONTENT}}", content_html)
        .replace("{{FOOTER}}", render_footer(prefix))
    )
    page = localize_links(page)
    out_path = SITE / output_rel_path
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(page, encoding="utf-8")
    print(f"wrote {out_path.relative_to(ROOT)}")


def clean_site() -> None:
    """site/ is 100% generated output — wipe it before every build so a
    renamed/removed record (e.g. a document whose derived slug changes)
    can never leave a stale orphan page behind. Hand-authored source lives
    in assets/ (repo root) and templates/, never in site/ directly."""
    # Empty site/ by removing its CONTENTS rather than the directory itself.
    # On Windows a running static file server holds a handle to the folder,
    # so shutil.rmtree(SITE) fails with WinError 32 and blocks every rebuild
    # while the preview server is up.
    SITE.mkdir(parents=True, exist_ok=True)
    for child in SITE.iterdir():
        if child.is_dir():
            shutil.rmtree(child, ignore_errors=True)
        else:
            try:
                child.unlink()
            except OSError:
                pass


def copy_assets() -> None:
    # Hand-authored CSS/JS live in assets/ (repo root) — copy into the
    # generated site/assets/ on every build, same as images/documents below.
    css_dest = SITE / "assets" / "css"
    js_dest = SITE / "assets" / "js"
    css_dest.mkdir(parents=True, exist_ok=True)
    js_dest.mkdir(parents=True, exist_ok=True)
    for f in (ROOT / "assets" / "css").glob("*.css"):
        shutil.copyfile(f, css_dest / f.name)
    for f in (ROOT / "assets" / "js").glob("*.js"):
        shutil.copyfile(f, js_dest / f.name)

    # Self-hosted variable fonts. Kept in the repo rather than fetched from a
    # font CDN: no third-party request on any page, no privacy leak, and the
    # preloaded latin subsets are on the same origin as the HTML.
    favicon = ROOT / "assets" / "favicon.svg"
    if favicon.exists():
        shutil.copyfile(favicon, SITE / "assets" / "favicon.svg")

    # Institutional emblems, cropped from the official CAS lockup
    # (source-assets/images/newlogo5.1). Both marks are shown in the header,
    # the way IIT Kanpur carries its crest beside the institute name.
    brand_src = ROOT / "assets" / "brand"
    if brand_src.exists():
        brand_dest = SITE / "assets" / "brand"
        brand_dest.mkdir(parents=True, exist_ok=True)
        for f in brand_src.glob("*.png"):
            shutil.copyfile(f, brand_dest / f.name)

    font_src = ROOT / "assets" / "fonts"
    if font_src.exists():
        font_dest = SITE / "assets" / "fonts"
        font_dest.mkdir(parents=True, exist_ok=True)
        for f in font_src.glob("*.woff2"):
            shutil.copyfile(f, font_dest / f.name)

    # Curated images referenced by generated pages are copied here from
    # source-assets/images so the images/ folder documents WHICH source files
    # are actually used (auditable subset, not a blind 577-file dump).
    (SITE / "assets" / "img").mkdir(parents=True, exist_ok=True)


def load_content(name: str) -> str:
    return (CONTENT / f"{name}.html").read_text(encoding="utf-8")


# Order matters. Record/detail pages are written FIRST so that the section
# hubs, which render a link as "Planned" when its destination does not exist
# on disk, see the finished set. Building hubs first made every later page
# look unbuilt.
PAGE_MODULES = [
    # 1. leaf and record pages
    "program_pages",
    "people_pages",
    "documents_pages",
    "notices_pages",
    "events_pages",
    "research_records_pages",
    "equipment_pages",
    "contact_page",
    "trust_pages",
    "error_pages",
    # 2. section hubs (depend on step 1 existing)
    "about",
    "academics",
    "admissions",
    "research",
    "people",
    "campus",
    "updates",
    # 3. home
    "home",
    # 4. indexes over everything above
    "sitemap_page",
    "search_page",  # must stay last: indexes everything the modules above just wrote
]


def check_nav_targets() -> list[str]:
    """Assert every navigation destination actually exists on disk.

    Three utility links (/academics/resources/, /campus/library/,
    /updates/careers/) pointed at pages the generator never produced, so a
    dead link shipped on all 392 pages. Nav data and page output are
    maintained separately, so nothing but a check keeps them honest."""
    targets: set[str] = set()
    for item in PRIMARY_NAV:
        targets.add(item["path"])
        for _, links in item.get("children", []):
            targets.update(p for _, p in links)
    for item in UTILITY_NAV:
        if not item["external"]:
            targets.add(item["path"])
    for item in FOOTER_POLICY_LINKS:
        targets.add(item["path"])

    broken = []
    for t in sorted(targets):
        if not (SITE / t.strip("/") / "index.html").exists():
            broken.append(t)
    return broken


def check_internal_links() -> dict[str, list[str]]:
    """Resolve every internal href in every generated page against disk.

    The nav check above only covers navigation data. Section landing pages
    also hand-write link lists (Research alone points at themes/, experts/,
    innovations/, collaborations/, scholars/ and resources/), and nothing
    previously verified those resolved."""
    import re

    href_re = re.compile(r'href="([^"]+)"')
    broken: dict[str, list[str]] = {}

    for page in SITE.rglob("*.html"):
        rel_dir = page.parent
        page_id = str(page.relative_to(SITE)).replace("\\", "/")
        for href in set(href_re.findall(page.read_text(encoding="utf-8"))):
            if href.startswith(("http://", "https://", "mailto:", "tel:", "#", "data:")):
                continue
            target = href.split("#")[0].split("?")[0]
            if not target:
                continue
            resolved = (rel_dir / target).resolve()
            ok = resolved.exists() or (resolved / "index.html").exists()
            if not ok:
                broken.setdefault(page_id, []).append(href)
    return broken


def check_asset_refs() -> dict[str, list[str]]:
    """Resolve every image/script/style URL in every page against disk.

    check_internal_links only follows <a href>. The image pipeline writes its
    URLs as "assets/img/...", which resolves only from a page at the site
    root; every section landing page one level down asked for
    academics/assets/img/... instead. Nothing failed the build — the pages
    just showed the blurred placeholder where the photograph should be."""
    attr_re = re.compile(r'\b(?:src|data-src)="([^"]+)"')
    srcset_re = re.compile(r'\b(?:srcset|data-srcset)="([^"]+)"')
    css_re = re.compile(r'<link[^>]+href="([^"]+\.css)"')
    broken: dict[str, list[str]] = {}

    for page in SITE.rglob("*.html"):
        text = page.read_text(encoding="utf-8")
        page_id = str(page.relative_to(SITE)).replace("\\", "/")
        urls: set[str] = set(attr_re.findall(text)) | set(css_re.findall(text))
        for srcset in srcset_re.findall(text):
            for candidate in srcset.split(","):
                candidate = candidate.strip()
                if candidate:
                    urls.add(candidate.split(" ")[0])

        for url in urls:
            if url.startswith(("http://", "https://", "//", "data:", "mailto:", "#")):
                continue
            resolved = (page.parent / url.split("?")[0]).resolve()
            if not resolved.exists():
                broken.setdefault(page_id, []).append(url)
    return broken


# Set by app.js at runtime rather than declared in the stylesheet. Each is
# read with a fallback, so an undefined name here is expected, not a bug.
RUNTIME_CUSTOM_PROPERTIES = {"--reveal-delay", "--tilt-x", "--tilt-y"}


def check_custom_properties() -> list[str]:
    """Find var(--x) references to custom properties nothing ever defines.

    A misremembered token name fails silently: the declaration is dropped and
    the element renders unstyled. The search input asked for --border-default,
    --radius-max and --touch-min, none of which existed, and shipped as a
    borderless square slab with 3rem of padding. Several page ledes asked for
    --ink-700 and simply inherited body colour."""
    css = "".join(
        f.read_text(encoding="utf-8")
        for f in (SITE / "assets" / "css").glob("*.css")
    )
    defined = set(re.findall(r"(--[a-zA-Z0-9-]+)\s*:", css))
    used: set[str] = set(re.findall(r"var\(\s*(--[a-zA-Z0-9-]+)", css))

    for page in SITE.rglob("*.html"):
        text = page.read_text(encoding="utf-8")
        used |= set(re.findall(r"var\(\s*(--[a-zA-Z0-9-]+)", text))
        # A property may also be declared on the element itself — the ticker
        # sets its own duration with style="--ticker-duration:40s" so the
        # speed can follow how much text there is. Scanning HTML for uses but
        # not for declarations reported those as undefined.
        for style_attr in re.findall(r'style="([^"]*)"', text):
            defined |= set(re.findall(r"(--[a-zA-Z0-9-]+)\s*:", style_attr))

    return sorted(used - defined - RUNTIME_CUSTOM_PROPERTIES)


def check_hidden_attribute() -> list[str]:
    """Every element shipped with `hidden` must actually be hidden.

    `hidden` is only a UA `display: none`, so any class rule that sets display
    silently beats it. The faceted document list shipped its filter rail with
    `hidden` for visitors without JavaScript, and `.browse__rail{display:grid}`
    put it straight back on screen — a control that cannot work, shown to the
    only people who cannot use it. base.css now carries
    `[hidden]{display:none!important}`; this asserts it stays there."""
    css_dir = SITE / "assets" / "css"
    css = "".join(f.read_text(encoding="utf-8") for f in css_dir.glob("*.css"))
    normalised = re.sub(r"\s+", "", css)
    if not re.search(r"\[hidden\]\{display:none!important;?\}", normalised):
        return ["base.css must declare [hidden] { display: none !important; } — "
                "without it any class setting `display` overrides the attribute"]
    return []


def check_list_markup() -> dict[str, list[str]]:
    """Find <ul>/<ol> that directly contain something other than <li>.

    A shared row helper emitted <div class="record-row"> while every caller
    dropped it straight into a <ul class="record-list">, which put a div where
    only list items are allowed on every program and person detail page. It
    looked correct — the CSS styles the class, not the tag — so only an
    accessibility audit caught it. This makes the build catch it instead."""
    from html.parser import HTMLParser

    ALLOWED = {"li", "script", "template"}
    VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input",
            "link", "meta", "source", "track", "wbr"}

    class ListChecker(HTMLParser):
        def __init__(self) -> None:
            super().__init__(convert_charrefs=True)
            self.stack: list[str] = []
            self.bad: list[str] = []

        def handle_starttag(self, tag: str, attrs) -> None:
            if self.stack and self.stack[-1] in ("ul", "ol") and tag not in ALLOWED:
                self.bad.append(f"<{tag}> directly inside <{self.stack[-1]}>")
            if tag not in VOID:
                self.stack.append(tag)

        def handle_endtag(self, tag: str) -> None:
            # Unwind to the matching open tag; generated markup is well formed,
            # but optional end tags (</li>) still need tolerating.
            if tag in self.stack:
                while self.stack and self.stack.pop() != tag:
                    pass

    problems: dict[str, list[str]] = {}
    for page in SITE.rglob("*.html"):
        checker = ListChecker()
        checker.feed(page.read_text(encoding="utf-8"))
        if checker.bad:
            page_id = str(page.relative_to(SITE)).replace("\\", "/")
            problems[page_id] = sorted(set(checker.bad))
    return problems


def main() -> None:
    import argparse
    import importlib

    ap = argparse.ArgumentParser(description="Build the CAS static site.")
    ap.add_argument("--rights-report", action="store_true",
                    help="Print the image rights sign-off list and exit.")
    args = ap.parse_args()

    if args.rights_report:
        from data.images import rights_report
        print(rights_report())
        return

    clean_site()
    copy_assets()

    for name in PAGE_MODULES:
        module = importlib.import_module(f"pages.{name}")
        module.build(render_page=render_page, load_content=load_content, root=ROOT)

    from imagepipe import get_pipeline
    get_pipeline(ROOT).save()

    broken = check_nav_targets()
    if broken:
        print("\nBROKEN NAV TARGETS (these ship on every page):")
        for b in broken:
            print(f"  {b}")
        raise SystemExit(1)
    print("\nnav target check: all destinations exist")

    link_errors = check_internal_links()
    if link_errors:
        total = sum(len(v) for v in link_errors.values())
        missing = sorted({h for v in link_errors.values() for h in v})
        print(f"\nBROKEN INTERNAL LINKS: {total} across {len(link_errors)} pages")
        for h in missing[:40]:
            pages = [p for p, v in link_errors.items() if h in v]
            print(f"  {h}   ({len(pages)} page{'s' if len(pages) != 1 else ''})")
        if len(missing) > 40:
            print(f"  ... and {len(missing) - 40} more distinct targets")
        raise SystemExit(1)
    print("internal link check: all internal hrefs resolve")

    asset_errors = check_asset_refs()
    if asset_errors:
        total = sum(len(v) for v in asset_errors.values())
        missing = sorted({u for v in asset_errors.values() for u in v})
        print(f"\nBROKEN ASSET REFERENCES: {total} across {len(asset_errors)} pages")
        for u in missing[:20]:
            pages = [p for p, v in asset_errors.items() if u in v]
            print(f"  {u}   ({len(pages)} page{'s' if len(pages) != 1 else ''})")
        if len(missing) > 20:
            print(f"  ... and {len(missing) - 20} more distinct URLs")
        raise SystemExit(1)
    print("asset reference check: every image/style URL resolves")

    undefined_props = check_custom_properties()
    if undefined_props:
        print(f"\nUNDEFINED CSS CUSTOM PROPERTIES: {len(undefined_props)}")
        for p in undefined_props:
            print(f"  var({p})  — referenced but never declared, so the rule is dropped")
        raise SystemExit(1)
    print("design token check: every var(--token) referenced is defined")

    hidden_errors = check_hidden_attribute()
    if hidden_errors:
        print("\nHIDDEN ATTRIBUTE NOT ENFORCED:")
        for e in hidden_errors:
            print(f"  {e}")
        raise SystemExit(1)
    print("hidden attribute check: [hidden] is enforced over class display rules")

    list_errors = check_list_markup()
    if list_errors:
        total = sum(len(v) for v in list_errors.values())
        print(f"\nINVALID LIST MARKUP: {total} kind(s) across {len(list_errors)} pages")
        for page_id, items in sorted(list_errors.items())[:20]:
            print(f"  {page_id}: {', '.join(items)}")
        raise SystemExit(1)
    print("list markup check: every <ul>/<ol> contains only list items")


if __name__ == "__main__":
    main()
