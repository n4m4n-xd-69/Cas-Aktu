"""
Program detail template — docs/INFORMATION_ARCHITECTURE.md #5 "Program
detail": breadcrumb; program name and verified facts; admissions CTA;
overview; eligibility/process; curriculum; outcomes; faculty; research/
facilities; current documents; current notices; contact; last reviewed.

Relationships this build hasn't migrated yet (curriculum documents, notice
records, full faculty profiles) are rendered as explicit "pending" rows
rather than omitted silently or invented — see docs/CONTENT_MIGRATION_LAUNCH.md
disposition rules: nothing defaults to Migrate/invented without a source.
"""
from __future__ import annotations

import html


def _fact_row(label: str, value: str | None) -> str:
    if not value:
        return ""
    # <li>, not <div>: these rows are placed directly inside a
    # <ul class="record-list">, and a list may only contain list items.
    return f'<li class="record-row"><div class="record-row__title">{html.escape(label)}</div><div class="record-row__meta">{value}</div></li>'


def render_program_detail(program: dict, admissions_path: str, prefix: str) -> str:
    p = program
    facts = "".join(
        [
            _fact_row("Level", p.get("level")),
            _fact_row("Department", p.get("department")),
            _fact_row("Established", p.get("established")),
            _fact_row("Seats", p.get("seats")),
            _fact_row("Approval", p.get("approval")),
        ]
    )

    specializations = p.get("specializations") or []
    spec_html = ""
    if specializations:
        items = "".join(f"<li>{html.escape(s)}</li>" for s in specializations)
        spec_html = f"<h2>Specializations / focus areas</h2><ul>{items}</ul>"

    vision_html = f"<h2>Vision</h2><p>{html.escape(p['vision'])}</p>" if p.get("vision") else ""

    mission_html = ""
    if p.get("mission"):
        items = "".join(f"<li>{html.escape(m)}</li>" for m in p["mission"])
        mission_html = f"<h2>Mission</h2><ul>{items}</ul>"

    labs_html = ""
    if p.get("labs"):
        items = "".join(f"<li>{html.escape(l)}</li>" for l in p["labs"])
        labs_html = f"<h2>Laboratories &amp; facilities</h2><ul>{items}</ul>"

    coord_html = ""
    if p.get("coordinators"):
        items = "".join(f"<li>{html.escape(c)}</li>" for c in p["coordinators"])
        coord_html = f"<h2>Faculty coordinators</h2><ul>{items}</ul><p class='record-row__meta'>Full faculty profiles: pending migration to the People directory (Stage 3.4 continued).</p>"
    else:
        coord_html = "<h2>Faculty</h2><p class='record-row__meta'>Pending migration to the People directory.</p>"

    extra_html = f'<p class="migration-notice" role="note">{html.escape(p["extra_note"])}</p>' if p.get("extra_note") else ""

    eligibility_html = f"<h2>Eligibility &amp; how to apply</h2><p>{html.escape(p.get('eligibility') or 'Not stated in the migrated source.')}</p>"
    stipend_html = f"<p class='migration-notice' role='note'>{html.escape(p['stipend_note'])}</p>" if p.get("stipend_note") else ""

    # Two-column detail: the facts panel sticks alongside the prose, so a
    # visitor comparing programmes keeps level/department/seats/approval in
    # view while reading. `--ink-700` used here previously was never a real
    # token, so the subtitle silently inherited body colour.
    return f"""
<div class="page-head container">
  <p class="eyebrow">{html.escape(p['level'])} programme</p>
  <h1>{html.escape(p['title'])}</h1>
  <p class="lede">{html.escape(p.get('department') or '')}</p>
  <div class="hero__actions" style="margin-top:var(--space-8)">
    <a class="btn btn--lg btn--primary" href="{admissions_path}">See {html.escape(p['level'])} admissions</a>
  </div>
</div>
<section class="section section--flush-top">
  <div class="container">
    <div class="feature feature--wide-text">
      <aside class="feature__media feature__media--sticky">
        <h2 class="ui-heading" style="font-size:var(--text-sm)">Verified facts</h2>
        <ul class="record-list" style="margin-top:var(--space-4)">{facts}</ul>
        {extra_html}
      </aside>
      <div class="feature__body u-prose">
        {vision_html}
        {mission_html}
        {spec_html}
        {eligibility_html}
        {stipend_html}
        <h2>Curriculum &amp; outcomes</h2>
        <p class="hub-meta" style="margin-top:0;border:0;padding:0">Curriculum documents and defined outcomes are pending migration to the Document library (Stage 3.5+); the legacy source references syllabus/timetable files by discipline that have not yet been structured as Document records.</p>
        {labs_html}
        {coord_html}
        <h2>Current notices</h2>
        <p class="hub-meta" style="margin-top:0;border:0;padding:0">Programme-specific notices are pending Notice-record migration; see the general <a href="{prefix}updates/">News &amp; Notices</a> section.</p>
        <h2>Contact</h2>
        <p>General enquiries: <a href="mailto:info@cas.res.in">info@cas.res.in</a></p>
        <p class="hub-meta">Source: legacy page <code>{html.escape(p['source_url'])}</code> &middot; Content last reviewed: 6 August 2026 (legacy site crawl date — pending institutional review)</p>
      </div>
    </div>
  </div>
</section>
""".strip()


CATEGORY_LABELS = {
    "faculty": "Faculty",
    "visiting": "Visiting Faculty",
    "staff": "Administrative & Research Staff",
    "former": "Former Faculty",
}
CATEGORY_STATUS = {"faculty": "Current", "visiting": "Current", "staff": "Current", "former": "Former"}


def render_person_detail(person: dict, category: str, prefix: str) -> str:
    """Person profile template — docs/INFORMATION_ARCHITECTURE.md #5:
    identity/role; approved contact; biography; interests; related programs/
    themes; selected outputs; identifiers; office; last reviewed. Photos are
    intentionally not used (rights/consent review pending, see homepage);
    the person's name always carries identity."""
    person_p = person

    degrees_html = ""
    if person_p.get("degrees"):
        items = "".join(f"<li>{html.escape(d)}</li>" for d in person_p["degrees"])
        degrees_html = f"<h2>Qualifications</h2><ul>{items}</ul>"

    interests_html = ""
    if person_p.get("interests"):
        items = "".join(f"<li>{html.escape(i)}</li>" for i in person_p["interests"])
        interests_html = f"<h2>Areas of interest</h2><ul>{items}</ul>"

    dept = person_p.get("department")
    dept_row = _fact_row("Department", dept) if dept else ""

    return f"""
<div class="page-head container">
  <p class="eyebrow">{html.escape(CATEGORY_LABELS.get(category, category))}</p>
  <h1>{html.escape(person_p['name'])}</h1>
  <p class="lede">{html.escape(person_p['title'])}</p>
</div>
<section class="section section--flush-top">
  <div class="container">
    <div class="feature feature--wide-text">
      <aside class="feature__media feature__media--sticky">
        <ul class="record-list">
          {_fact_row("Category", CATEGORY_LABELS.get(category, category))}
          {_fact_row("Status", CATEGORY_STATUS.get(category, "Current"))}
          {dept_row}
        </ul>
      </aside>
      <div class="feature__body u-prose">
  <h2>Biography</h2>
  <p>{html.escape(person_p['bio'])}</p>
  {degrees_html}
  {interests_html}
  <h2>Selected outputs &amp; identifiers</h2>
  <p class="migration-notice" role="note">The legacy source lists external profile links (Google Scholar,
  Scopus, ORCID, ResearchGate, publication lists) for this person, but several are ambiguously labeled in
  the source itself and are not linked here until verified against the correct person — see
  CONTENT_MIGRATION_LAUNCH.md editorial acceptance checklist &sect;8.</p>
  <h2>Related programmes</h2>
  <p class="hub-meta" style="margin-top:0;border:0;padding:0">Pending relationship migration to Programme records (Stage 3.4 continued).</p>
  <h2>Contact</h2>
  <p>No individual email is published in the migrated source. General enquiries:
  <a href="mailto:info@cas.res.in">info@cas.res.in</a></p>
  <p class="hub-meta">Source: legacy page <code>{html.escape(person_p['source_url'])}</code>
  &middot; Content last reviewed: 6 August 2026 (legacy site crawl date — pending institutional review)</p>
      </div>
    </div>
  </div>
</section>
""".strip()
