"""Contact page — reuses the real CONTACT data already defined in
generate.py for the footer (single source of truth, not re-typed)."""
from __future__ import annotations

import html
from pathlib import Path


def build(render_page, load_content, root: Path) -> None:
    import generate  # the running generator module — already has CONTACT loaded

    c = generate.CONTACT
    email_rows = "".join(
        f'<li class="record-row"><div class="record-row__title">{html.escape(e["label"])}</div>'
        f'<div class="record-row__meta"><a href="mailto:{html.escape(e["email"])}">{html.escape(e["email"])}</a></div></li>'
        for e in c["emails"]
    )
    content = f"""
<div class="u-band u-container">
  <h1>Contact</h1>
  <p class="lede">{html.escape(c['org'])}</p>
  <p class="migration-notice" role="note">{html.escape(c['source_note'])}</p>
  <h2>Address</h2>
  <p>{html.escape(c['org'])}<br>{html.escape(c['affiliation'])}<br>{html.escape(c['address'])}</p>
  <h2>Phone</h2>
  <p>{html.escape(c['phone'])}</p>
  <h2>Office contacts</h2>
  <ul class="record-list">{email_rows}</ul>
  <h2>Map</h2>
  <p class="record-row__meta">An accessible map/directions link requires an approved embed source
  (TECHNICAL_SECURITY_OPERATIONS.md &sect;3: "external embeds use an allowlist, privacy review") — not yet added.</p>
  <h2>Enquiry form</h2>
  <p class="record-row__meta">Not built in this pass. PRODUCT_REQUIREMENTS.md FR-10 requires an approved
  owner, privacy notice, retention period, spam controls, and rate limiting before a public form can be
  published — none of which exist yet for this migration draft. Use the email addresses above instead.</p>
</div>
""".strip()
    render_page(
        output_rel_path="contact/index.html",
        title="Contact",
        description="Contact Centre for Advanced Studies (CAS), AKTU — address, phone, and office emails.",
        content_html=content,
        active_nav=None,
        breadcrumb_items=[("Contact", None)],
    )
