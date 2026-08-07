"""
Error/maintenance pages — docs/UX_UI_SPECIFICATION.md #6:
"404 suggests Search, Admissions, Programs, Notices, and Contact and
records the missing path. 500/maintenance pages avoid stack details and
provide status/contact guidance."

Output as flat files (404.html, 500.html, maintenance.html) at site root,
not folder+index.html, matching the convention most static hosts look for
automatically.
"""
from __future__ import annotations

from pathlib import Path


def build(render_page, load_content, root: Path) -> None:
    _build_404(render_page)
    _build_500(render_page)
    _build_maintenance(render_page)


def _links_block() -> str:
    # error_pages output at site root (404.html etc.), same depth as index.html,
    # so relative paths with no prefix reach these correctly — an absolute
    # leading "/" would resolve to the filesystem/domain root instead of the
    # site root, breaking file:// preview and any non-root deployment (real
    # bug caught by the link-graph audit, not a style preference).
    return """
  <ul class="record-list">
    <li class="record-row"><div class="record-row__title"><a href="search/">Search</a></div></li>
    <li class="record-row"><div class="record-row__title"><a href="admissions/">Admissions</a></div></li>
    <li class="record-row"><div class="record-row__title"><a href="academics/programs/">Programs</a></div></li>
    <li class="record-row"><div class="record-row__title"><a href="updates/notices/">Notices</a></div></li>
    <li class="record-row"><div class="record-row__title"><a href="contact/">Contact</a></div></li>
  </ul>
""".strip()


def _build_404(render_page) -> None:
    content = f"""
<div class="u-band u-container">
  <h1>Page not found</h1>
  <p class="lede">The page you're looking for doesn't exist, or
  has moved.</p>
  <p class="record-row__meta">Missing-path logging for redirect-map maintenance is not yet wired up in this
  static build (CONTENT_MIGRATION_LAUNCH.md Phase E) — a real deployment needs server or edge logging for
  this, which a static file can't do on its own.</p>
  <h2>Try one of these instead</h2>
  {_links_block()}
</div>
""".strip()
    render_page(
        output_rel_path="404.html", title="Page not found",
        description="The requested page could not be found on the Centre for Advanced Studies (CAS) website.",
        content_html=content, active_nav=None, breadcrumb_items=[],
    )


def _build_500(render_page) -> None:
    content = """
<div class="u-band u-container">
  <h1>Something went wrong</h1>
  <p class="lede">An unexpected error occurred. No stack trace
  or technical detail is shown here by design (UX_UI_SPECIFICATION.md &sect;6).</p>
  <p>If this keeps happening, contact <a href="mailto:info@cas.res.in">info@cas.res.in</a>.</p>
</div>
""".strip()
    render_page(
        output_rel_path="500.html", title="Something went wrong",
        description="An unexpected error occurred on the Centre for Advanced Studies (CAS) website.",
        content_html=content, active_nav=None, breadcrumb_items=[],
    )


def _build_maintenance(render_page) -> None:
    content = """
<div class="u-band u-container">
  <h1>Site under maintenance</h1>
  <p class="lede">Centre for Advanced Studies is currently
  performing scheduled maintenance. Please check back shortly.</p>
  <p>Urgent enquiries: <a href="mailto:info@cas.res.in">info@cas.res.in</a></p>
  <p class="record-row__meta">TECHNICAL_SECURITY_OPERATIONS.md &sect;12 calls for this page to be served
  independently of the CMS during an outage — this static file satisfies that as long as it's hosted
  separately from whatever serves the rest of the site in production.</p>
</div>
""".strip()
    render_page(
        output_rel_path="maintenance.html", title="Site under maintenance",
        description="Centre for Advanced Studies (CAS) website is temporarily under maintenance.",
        content_html=content, active_nav=None, breadcrumb_items=[],
    )
