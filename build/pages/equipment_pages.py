"""
Equipment & Facilities pages: /research/equipment/ (full list, from
equip.html's "Major Equipments" table) and /research/facilities/ (the subset
of those 48 records whose names identify them as a lab/center rather than a
single instrument).

Why one dataset feeds both pages: the source itself does not cleanly
separate "facility" from "equipment" — equip.html's single 49-row table
mixes named labs (e.g. "3D Printing Lab", "Industrial Robotic Center") with
individual instruments (e.g. "BET Measurement System") with no structural
distinction. infra.html covers mostly the same labs in unstructured prose
with only 3 delimiter markers across ~35,000 characters — not reliably
parseable into separate accurate records. Rather than inventing a
second, parallel "Facility" content set from that unreliable source, the
Facilities page filters the one real, verified dataset. This is disclosed
on the page, not presented as if two independent migrations happened.
"""
from __future__ import annotations

import html
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from data.equipment import EQUIPMENT  # noqa: E402

FACILITY_KEYWORDS = ("lab", "center", "centre", "laboratory")


def slugify(text: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return s[:70] or "equipment"


def with_slugs(records: list[dict]) -> list[dict]:
    used: set[str] = set()
    out = []
    for r in records:
        base = slugify(r["name"])
        slug = base
        n = 2
        while slug in used:
            slug = f"{base}-{n}"
            n += 1
        used.add(slug)
        out.append({**r, "slug": slug})
    return out


def is_facility(name: str) -> bool:
    low = name.lower()
    return any(k in low for k in FACILITY_KEYWORDS)


def build(render_page, load_content, root: Path) -> None:
    records = with_slugs(EQUIPMENT)

    prefix2 = "../../"
    rows = "".join(
        f'<li class="record-row"><div class="record-row__title"><a href="{prefix2}research/equipment/{r["slug"]}/">{html.escape(r["name"])}</a></div>'
        f'<div class="record-row__meta">{html.escape(r["summary"]) if r["summary"] else "Description pending — see note on this record"}</div></li>'
        for r in records
    )
    content = f"""
<div class="u-band u-container">
  <h1>Major equipment</h1>
  <p class="lede">{len(records)} labs and instruments migrated from the legacy site's equipment list.</p>
  <ul class="record-list">{rows}</ul>
</div>
""".strip()
    render_page(
        output_rel_path="research/equipment/index.html", title="Major equipment",
        description="Laboratories and major equipment at Centre for Advanced Studies (CAS), AKTU.",
        content_html=content, active_nav="research",
        breadcrumb_items=[("Research", "/research/"), ("Equipment", None)],
    )

    prefix3 = "../../../"
    for r in records:
        summary_html = f"<p>{html.escape(r['summary'])}</p>" if r["summary"] else (
            '<p class="migration-notice" role="note">The legacy source\'s description for this row is a verbatim '
            'copy of a different equipment entry (Drone Systems Lab) — a content-management error on the source '
            'site, not a real description of this equipment. Left blank here rather than reproducing the wrong text.</p>'
        )
        content = f"""
<div class="u-band u-container">
  <h1>{html.escape(r['name'])}</h1>
  {summary_html}
  <p class="record-row__meta">Facility/location, safety notes, and access contact are not yet structured as
  separate fields — pending further migration. General enquiries: <a href="mailto:info@cas.res.in">info@cas.res.in</a></p>
</div>
""".strip()
        render_page(
            output_rel_path=f"research/equipment/{r['slug']}/index.html", title=r["name"],
            description=(r["summary"] or r["name"]) + " — Centre for Advanced Studies (CAS), AKTU.",
            content_html=content, active_nav="research",
            breadcrumb_items=[("Research", "/research/"), ("Equipment", "/research/equipment/"), (r["name"], None)],
        )

    # --- Facilities: filtered subset, links back to the equipment detail pages ---
    facilities = [r for r in records if is_facility(r["name"])]
    fac_rows = "".join(
        f'<li class="record-row"><div class="record-row__title"><a href="{prefix2}research/equipment/{r["slug"]}/">{html.escape(r["name"])}</a></div>'
        f'<div class="record-row__meta">{html.escape(r["summary"]) if r["summary"] else ""}</div></li>'
        for r in facilities
    )
    fac_content = f"""
<div class="u-band u-container">
  <h1>Laboratories &amp; facilities</h1>
  <p class="lede">{len(facilities)} named labs and centers, filtered from the equipment list below.</p>
  <p class="migration-notice" role="note">The legacy site does not structurally separate facilities from
  individual instruments — both are listed in one "Major Equipments" table. This page is the subset of that
  table identifiable as a named lab or center; detail pages are shared with
  <a href="{prefix2}research/equipment/">Major equipment</a> rather than duplicated. A dedicated facilities page
  (infra.html) exists in the source but is unstructured free text (~35,000 characters, 3 section breaks) and was
  not reliably parseable into separate accurate records for this pass.</p>
  <ul class="record-list">{fac_rows}</ul>
</div>
""".strip()
    render_page(
        output_rel_path="research/facilities/index.html", title="Laboratories & facilities",
        description="Laboratories and research facilities at Centre for Advanced Studies (CAS), AKTU.",
        content_html=fac_content, active_nav="research",
        breadcrumb_items=[("Research", "/research/"), ("Facilities", None)],
    )
