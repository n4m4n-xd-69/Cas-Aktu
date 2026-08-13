-- ignore "claude --resume d0fb7479-316d-47f8-aa31-c100c9faa6c1"

# HANDOFF — CAS Website React Migration

**Written:** 2026-08-08
**Branch:** `migration/react-router`
**Last commit:** `ec6b221247fd7f26c7dc497af5f9e42ec98225f1` — `feat(s2): migrate design system and component primitives`
**Working tree:** clean at time of writing (this file is untracked and uncommitted)

---

## Current phase

`docs/master.md` **Phase 3 — Complete React Migration**, executing the staged plan in
`docs/superpowers/specs/2026-08-07-react-migration-design.md`.

Phases 1 (Audit) and 2 (Migration Strategy) are complete. Stages **S1 and S2 of S1–S9**
are done. **S3 is next.**

---

## Completed stages

| Stage | Result | Commit |
|---|---|---|
| Phase 1 — Audit | `docs/AUDIT.md`, 19 sections, all measured | (in baseline) |
| Phase 2 — Design spec | `docs/superpowers/specs/2026-08-07-react-migration-design.md` | (in baseline) |
| Version control | git init, baseline of 1,775 files; restore tested end-to-end | `33f7f1d` |
| Python deps | `requirements.txt`, verified in a clean venv | `944e8f8` |
| **S1** — Scaffold | React 19 + Vite 8 + React Router 8, prerender proven | `de442dc` |
| **S2** — Design system | tokens/base ported, theme wired, 10 primitives | `ec6b221` |

### S1 headline

React Router 8 emits **directory-form URLs natively** — `/about` →
`dist/client/about/index.html`. No post-build reshaping needed; this retired the top risk
in the design spec (§3.2). `scripts/verify-urls.mjs` enforces it on every build and
was itself tested against a simulated regression.

### S2 headline

Zero visual regression, established by comparing **computed styles** against the running
legacy site — primary button (11 properties), badge (including the exact
`color(srgb 0.117647 0.419608 0.227451 / 0.1)` mix), h1, eyebrow, container, breadcrumb all
identical. Theme verified in the **production** build, not only dev.

---

## Next objective — S3: data layer

Goal: all institutional content behind typed loaders, with a single swap point for a
future CMS. **No pages yet** — that is S4.

**Deliverables**

```
src/data/
  collections/*.json   11 collections, machine-exported (never retyped)
  schema.ts            TypeScript types for every record shape
  loaders.ts           getFaculty(), getDocuments(), … the ONE CMS swap point
```

1. Run `python build/export_json.py` — it already exists and writes to `web/src/data`.
   Retarget it to `src/data/collections/`, or copy its output. **Do not hand-type
   records**: programme names, seat counts, patent numbers and faculty credentials must be
   machine-exported, per `build/export_json.py`'s own docstring.
2. Write `schema.ts` from the exported shapes.
3. Write `loaders.ts`. Route modules import only from here, never from JSON directly.

**Exit gate — record counts must match the Python modules exactly:**

| Collection | Expected | Collection | Expected |
|---|---:|---|---:|
| faculty | 13 | equipment | 48 |
| former faculty | 32 | publications | 16 |
| staff | 9 | patents | 10 |
| visiting faculty | 5 | projects | 9 |
| programmes | 9 | events | 42 |
| documents | 158 | notices | 6 |

---

## Remaining tasks

| Stage | Work | Gate |
|---|---|---|
| **S3** | Data layer (above) | Record counts match Python exactly |
| S4 | Route modules — all 392 pages prerendering | Page count = 392 |
| S5 | Features: ⌘K palette, document facets, listings, motion | Functional parity |
| S6 | Parity harness + accessibility suite | All 392 pages pass |
| S7 | Delete legacy (`web/`, `build/`, `templates/`, `assets/`, `site/`, `preview.cmd`) | Build still green |
| S8 | Phase 6/7 premium layer — glass, bento, motion | Diffed against parity baseline |
| S9 | Lighthouse ≥95, CWV, bundle analysis | Targets met |

---

## Known issues

### 1. Public GitHub repo, and something is auto-pushing — UNRESOLVED, needs your decision

A remote nobody configured in this session exists and **the repository is public**
(verified with an unauthenticated API call):

```
origin  https://github.com/n4m4n-xd-69/Cas-Aktu.git   visibility: public   license: none
```

All **577 source images** and the document library are publicly readable. This collides
directly with `docs/AUDIT.md` §10: all 50 image records carry
`rights_status: "pending-confirmation"`, and `build/data/images.py` says in its own words
that nothing there should be treated as cleared. Several images show identifiable people.

The automation has acted twice unprompted — it also created the
`chore: initialize node_modules directory for client project` commit during S1 (which
tracked 8,815 `node_modules` files and had to be unwound). **It will likely publish S3 too.**

Note: `main` (the pristine baseline) is *not* on the remote — only this working branch.

Options, none of them taken: make private · delete repo · purge assets from history
(needs `git filter-repo` + force-push) · disable the automation. Containment is
time-sensitive; the automation should be found regardless.

### 2. TypeScript pinned to 6.0.3, not 7

`typescript-eslint` hard-refuses TS 7 with an explicit runtime guard; no release supports
it, including canaries, and npm `overrides` cannot nest a TS 6 copy under the linter
because peers hoist. Both workarounds were tested. Nothing in this codebase uses a TS 7
feature. **Revisit when [typescript-eslint#10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940) lands** — it is a one-line change in
`package.json`.

### 3. Image rights clearance — launch blocker, not an engineering task

See `docs/AUDIT.md` §10. Needs CAS sign-off and has the longest lead time of anything in
the project. Not started as far as I know.

### 4. Five specification documents are missing

~20 source files cite `docs/INFORMATION_ARCHITECTURE.md`, `PRODUCT_REQUIREMENTS.md`,
`UX_UI_SPECIFICATION.md`, `CONTENT_MIGRATION_LAUNCH.md`, `MIGRATION_ASTRO.md`. Code
comments also cite requirement IDs (FR-02, FR-04–FR-12) that cannot currently be resolved.
Check the Recycle Bin — a session on 2026-08-07 ~19:19 had them. Recovery beats
reconstruction.

### 5. Lightning CSS rewrites `light-dark()`

Vite 8's minifier converts it to `--lightningcss-light` / `--lightningcss-dark` custom
properties. **The theming mechanism in production is not the one in the source.** Always
verify theme changes against a production build, not just `npm run dev`.

### 6. Contracts later stages must honour

- Chrome elements need **`data-site-chrome`**, or the `--chrome-h` measurement finds
  nothing (documented 0.06 CLS regression if it moves out of the inline script).
- Page furniture needs **`print-hide`** — the legacy print rule listed global class names
  that are module-scoped now.
- **`Heading level` must not skip.** 142 of 392 legacy pages jump h1→h3 (WCAG 1.3.1). Fix
  it once in the shared record template at S4.
- **Motion: `initial={false}` on first paint.** Declarative `initial` serialises the hidden
  state into prerendered HTML, shipping pages as `style="opacity:0"` that are blank without
  JavaScript. See `src/lib/motion.ts`.

### 7. Minor

- `build/warm_images.py` has no `__main__` guard — importing it encodes the whole image
  library and writes to disk. Excluded from the dependency check for that reason.
- `isbot` was auto-added to `package.json` by React Router's typegen. It is used by
  the build-time server entry only and ships **0 bytes** to clients.
- Motion accounts for ~118 KB on the one route using it. The spec's ~180 KB/page estimate
  holds only if Motion stays selective. Watch this at S9.

---

## Commands to resume tomorrow

```bash
cd "C:/Users/V3X0R/ZPROJECTs/X1/Cas Aktu"

# 1. Confirm where things stand
git status
git log --oneline -5
git remote -v          # see known issue 1 before doing anything that pushes

# 2. App (promoted to repo root — no more `cd client`)
npm install            # if node_modules is missing; no --legacy-peer-deps needed
npm run dev            # http://localhost:5173
                       # http://localhost:5173/_primitives  <- component gallery (dev only)

# 3. Verification gates — all four must pass before any commit
npx eslint .
npx prettier --check .
npm run typecheck
npm run build          # also runs scripts/verify-urls.mjs (URL parity gate)

# 4. Compare against the legacy site (the parity oracle)
cd "C:/Users/V3X0R/ZPROJECTs/X1/Cas Aktu/site"
python -m http.server 8765 --bind 127.0.0.1     # http://127.0.0.1:8765

# 5. Rebuild the legacy site if ever needed (deps are pinned)
cd "C:/Users/V3X0R/ZPROJECTs/X1/Cas Aktu"
python -m venv .venv && .venv/Scripts/python -m pip install -r requirements.txt
.venv/Scripts/python build/generate.py

# 6. Start S3
python build/export_json.py    # exports the 11 collections; retarget to src/data/
```

### Rollback

`main` holds the untouched pre-migration baseline and is intentionally never built on:

```bash
git checkout main          # pristine: build/, site/, assets/, templates/, source-assets/
```

---

## Read these first

| File | Why |
|---|---|
| `docs/AUDIT.md` | Phase 1 audit. §10 rights, §11 performance baseline, §16 deletion evidence |
| `docs/superpowers/specs/2026-08-07-react-migration-design.md` | Approved architecture, stage gates, risks |
| `docs/master.md` | Original brief |
| `src/lib/motion.ts` | The prerender/animation rule |
| `src/theme/theme-script.ts` | Why the pre-paint scripts must stay inline |
