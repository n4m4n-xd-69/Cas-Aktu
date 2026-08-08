#!/usr/bin/env python3
"""
Export the Python record modules to JSON for the Astro build.

Deliberately an *export*, not a hand-transcription. build/data/*.py is the
migrated source of truth for institutional content — programme names, seat
counts, faculty records, patent numbers. Retyping any of it into TypeScript
would introduce exactly the transcription risk the migration notes warn about
(documents_pages.py: "re-typing it by hand would only add transcription risk
with no accuracy benefit").

So both builds read the same records: the Python generator imports them
directly, and Astro reads the JSON this emits. Until the Python generator is
retired at S8, run this whenever build/data/ changes.

    python build/export_json.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "build"))

OUT = ROOT / "client" / "src" / "data" / "collections"

# (output name, module, symbol)
EXPORTS = [
    ("programs", "data.programs", "PROGRAMS"),
    ("faculty", "data.people", "CURRENT_FACULTY"),
    ("former-faculty", "data.past_faculty", "PAST_FACULTY"),
    ("staff", "data.people", "STAFF"),
    ("visiting-faculty", "data.people", "VISITING_FACULTY"),
    ("notices", "data.notices", "NOTICES"),
    ("events", "data.events", "EVENTS"),
    ("publications", "data.publications", "PUBLICATIONS"),
    ("patents", "data.patents", "PATENTS"),
    ("equipment", "data.equipment", "EQUIPMENT"),
    ("projects", "data.projects", "PROJECTS"),
]


def slugify(text: str) -> str:
    import re
    s = re.sub(r"[^a-z0-9]+", "-", (text or "").lower()).strip("-")
    return s[:80] or "record"


def with_ids(records: list[dict], key: str) -> list[dict]:
    """Give every record a stable `id`.

    Astro's file loader keys entries by id. Publications, patents, equipment,
    projects and events have no slug in the Python build because they are
    never individually addressable there — they only ever render as list rows.
    Ids are derived from the record's own title so they stay stable across
    exports, with a numeric suffix only where two records genuinely share a
    title (which happens: several patents do).
    """
    seen: dict[str, int] = {}
    out = []
    for r in records:
        base = r.get("slug") or slugify(r.get(key, ""))
        seen[base] = seen.get(base, 0) + 1
        rid = base if seen[base] == 1 else f"{base}-{seen[base]}"
        out.append({"id": rid, **r})
    return out


# Collections whose records carry no slug — the field their id derives from.
ID_SOURCE = {
    "publications": "title", "patents": "title", "equipment": "name",
    "projects": "title", "events": "title",
}


def main() -> None:
    import importlib

    OUT.mkdir(parents=True, exist_ok=True)
    total = 0
    for name, module_path, symbol in EXPORTS:
        module = importlib.import_module(module_path)
        records = getattr(module, symbol)
        if name in ID_SOURCE:
            records = with_ids(records, ID_SOURCE[name])
        # Tuples (focal points, coordinate pairs) become arrays; everything
        # else in these modules is already JSON-native.
        path = OUT / f"{name}.json"
        path.write_text(
            json.dumps(records, indent=2, ensure_ascii=False, default=list),
            encoding="utf-8",
        )
        print(f"  {len(records):4d}  {path.relative_to(ROOT)}")
        total += len(records)

    # Documents are derived from the research CSVs at build time rather than
    # stored, so they are exported through their own loader.
    from pages import documents_pages

    docs = documents_pages.load_records(ROOT)
    slim = [
        {
            "slug": d["slug"], "title": d["title"], "type": d["type"],
            "area": d["area"], "year": d["year"], "session": d["session"],
            "sizeBytes": d["size_bytes"], "sourceUrl": d["source_url"],
            "sourcePage": d["source_page"], "filename": d["filename"],
        }
        for d in docs
    ]
    path = OUT / "documents.json"
    path.write_text(json.dumps(slim, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"  {len(slim):4d}  {path.relative_to(ROOT)}")
    total += len(slim)

    print(f"\nexported {total} records to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
