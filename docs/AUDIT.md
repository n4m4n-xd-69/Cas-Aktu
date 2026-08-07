# CAS Website — Phase 1 Audit

**Date:** 2026-08-07 · **Scope:** entire repository · **Method:** read-only analysis. No file in the project was modified.

---

## 0. How to read this report

Every claim is labelled by how it was established:

| Tag | Meaning |
|---|---|
| **[M]** | Measured — a tool produced the number, and the command is stated |
| **[V]** | Verified — an automated flag was manually checked against the source before reporting |
| **[I]** | Inferred — reasoned from reading code, not measured |

Findings that a first pass got **wrong** are shown with their correction, because a
migration plan built on a false "unused" verdict deletes working code.

**Measurement caveat that applies to every performance number:** the site was served by
`python -m http.server` over **HTTP/1.0 with no gzip or brotli**. Real hosting will compress
text and multiplex. Absolute timings are therefore pessimistic; *relative* differences
between pages, and all CLS/DOM/structural figures, are valid.

---

## 1. Executive summary

The existing site is **substantially better engineered than a typical migration candidate.**
That finding shapes every recommendation in this report.

| Signal | Result |
|---|---|
| Broken internal links | **0** out of 3,253 references **[M]** |
| Pages missing title / description / canonical | **0 / 0 / 0** out of 392 **[M]** |
| Images without `alt` | **0** out of 1,202 **[M]** |
| Dead JavaScript functions | **0** out of 62 **[V]** |
| Unreferenced files in `site/` | **0** out of 523 **[V]** |
| Lighthouse (4 templates) | 100 / 100 / 100, one page at 99 **[M]** |
| npm vulnerabilities | **0** **[M]** |
| Secrets in source | **0** **[M]** |

**The five findings that actually matter:**

1. **142 of 392 pages skip a heading level** (`h1 → h3`) — the site's only real accessibility
   defect, WCAG 1.3.1 Level A. §8
2. **All 50 image records carry `rights_status: "pending-confirmation"`** — a launch blocker
   that is a legal question, not a technical one. §10
3. **The design system has been forked.** 87.3 KB of CSS exists as byte-identical copies in
   two places. §11
4. **No `robots.txt`, no `sitemap.xml`, no structured data** on a 392-page institutional site. §9
5. **468 MB of source assets — 96.5% of the image library — never reach the build.** §7

---

## 2. Complete file inventory **[M]**

2,713 files excluding `node_modules/`, `__pycache__/`, `.astro/`.

| Extension | Count | | Extension | Count |
|---|---:|---|---|---:|
| `.jpg` | 791 | | `.py` | 44 |
| `.html` | 553 | | `.woff2` | 16 |
| `.webp` | 373 | | `.json` | 16 |
| `.avif` | 373 | | `.js` | 12 |
| `.pdf` | 334 | | `.css` | 10 |
| `.jpeg` | 102 | | `.md` | 8 |
| `.png` | 62 | | `.svg` | 5 |
| `.csv` | 4 | | `.astro` | 4 |
| `.gif` | 2 | | `.tsx` / `.ts` / `.mjs` / `.cmd` | 1 each |

### Storage

| Directory | Size | Role |
|---|---:|---|
| `source-assets/` | 448 MB | Build inputs — original images and PDFs |
| `site/` | 238 MB | Generated output (392 pages + served assets) |
| `build/` | 64 MB | Generator — **63 MB of it is `.imgcache/`** |
| `research/` | 2.8 MB | Crawl inventories (CSV/JSON) |
| `web/` | 2.5 MB | Abandoned Astro app (+198 MB `node_modules/`) |
| `assets/` | 625 KB | Authored CSS/JS/fonts |
| `tools/` | 52 KB | Crawlers |
| `docs/` | 28 KB | Specifications |
| `templates/` | 4 KB | `_layout.html` |
| `content/` | **0 B** | **Empty directory** |

Generated pages: **392** — verified against §3 route inventory.

---

## 3. Component inventory **[M]**

### Python generator — 6,384 LOC across 42 modules

| Module | LOC | | Module | LOC |
|---|---:|---|---|---:|
| `generate.py` | 875 | | `program_pages.py` | 158 |
| `pages/home.py` | 620 | | `pages/search_page.py` | 146 |
| `pages/documents_pages.py` | 428 | | `pages/equipment_pages.py` | 126 |
| `data/people.py` | 391 | | `export_json.py` | 120 |
| `data/past_faculty.py` | 335 | | `data/publications.py` | 116 |
| `imagepipe.py` | 303 | | `data/events.py` | 114 |
| `data/images.py` | 294 | | `pages/events_pages.py` | 100 |
| `landing.py` | 216 | | `pages/notices_pages.py` | 99 |
| `data/programs.py` | 215 | | `pages/error_pages.py` | 91 |
| `pages/research_records_pages.py` | 185 | | `pages/updates.py` | 89 |
| `detail.py` | 177 | | 20 further modules | ≤ 84 each |

`tools/` adds 441 LOC (`crawl_cas.py` 338, `download_cas_documents.py` 103).

### Front-end

| Asset | Bytes | Contents |
|---|---:|---|
| `assets/css/components.css` | 76,768 | 34 major component sections |
| `assets/css/tokens.css` | 13,935 | Colour tokens, 4 self-hosted variable fonts |
| `assets/css/base.css` | 8,442 | Reset, typography, layout primitives |
| **CSS total** | **99,145** | **278 distinct classes** |
| `assets/js/app.js` | 22,969 | 30 functions — nav, theme, ticker, reveal |
| `assets/js/facets.js` | 11,354 | 15 functions — document filtering |
| `assets/js/palette.js` | 9,933 | 14 functions — ⌘K command palette |
| `assets/js/search.js` | 4,577 | 3 functions — search page |
| **JS total** | **48,833** | **62 functions** |

`templates/_layout.html` (3,386 B) is the single HTML shell for all 392 pages.

### Script loading **[M]**

| File | Pages referencing |
|---|---|
| `app.js`, `palette.js` | 392 / 392 |
| `facets.js` | 1 / 392 (`/documents/`) |
| `search.js` | 1 / 392 (`/search/`) |
| `search-index.js` | 0 static references — **injected at runtime**, see §7.1 |

### Abandoned Astro app

4 `.astro` files, 1 `.tsx` (`DocumentFilters.tsx`, 299 LOC), 1 `.ts` (`content.config.ts`,
196 LOC), 11 JSON collections, 3 copied CSS files. Builds 160 / 392 pages in 11.8 s **[M]**.

---

## 4. Dependency audit **[M]**

### npm (`web/`)

| Package | Version | Status |
|---|---|---|
| `astro` | ^7.2.0 | current |
| `@astrojs/react` | ^6.0.2 | current |
| `react` / `react-dom` | ^19.2.8 | current |
| `motion` | ^13.0.0 | current |
| `typescript` | ^7.0.2 | current |
| `@types/react`, `@types/react-dom` | ^19.2.x | current |

`npm outdated` → **nothing outdated**. `npm audit --omit=dev` → **0 vulnerabilities**.

198 MB of `node_modules/` currently supports an application that this migration deletes.

### Python — **undeclared**

Third-party imports found across `build/` and `tools/`: **`bs4`, `fontTools`, `PIL` (Pillow),
`requests`**.

There is **no `requirements.txt`, `pyproject.toml`, or lockfile** anywhere in the repository.
The build is reproducible only on a machine that already happens to have these installed.
Given the generator is scheduled for deletion this is low-impact, but until S7 it means the
site **cannot be rebuilt on a clean machine** — which matters, because the generator is the
verification oracle for the whole migration.

---

## 5. Dead code analysis

### JavaScript — **0 dead functions** of 62 **[V]**

A first automated pass flagged 5 functions as never-called: `scheduleClose`, `onKey`,
`onMotionChange`, `openSheet`, `onSheetKey`.

**All five were false positives.** Each is passed by reference to `addEventListener`, which the
`name(` call-site regex could not see:

```
app.js:171     t.addEventListener("mouseleave", scheduleClose);
app.js:235     document.addEventListener("keydown", onKey);
app.js:400     motionQuery.addEventListener("change", onMotionChange);
facets.js:302  sheetOpen.addEventListener("click", openSheet);
facets.js:290  document.addEventListener("keydown", onSheetKey);
```

Deleting any of them would have silently broken dropdown dismissal, Escape handling, the
reduced-motion listener, and the mobile filter sheet. **No JavaScript should be removed.**

### Python — no dead modules **[I]**

Every module under `build/pages/` is imported by `generate.py`; every module under
`build/data/` is imported by a page module or by `export_json.py`. `warm_images.py` (21 LOC)
is a standalone maintenance script, not dead code.

---

## 6. Duplicate code analysis **[M]**

### The significant one: the design system is forked

| File | `assets/css/` | `web/src/styles/` | Status |
|---|---:|---:|---|
| `base.css` | 8,676 B | 8,676 B | **byte-identical** |
| `components.css` | 78,606 B | 78,606 B | **byte-identical** |
| `tokens.css` | 14,283 B | 14,303 B | 8 differing lines |

**87.3 KB maintained in two places.** The `tokens.css` divergence is benign in intent — four
`@font-face` rules changed from `../fonts/…` to `/assets/fonts/…` for Astro's serving model —
but it is the mechanism of drift, not an exception to it. `tokens.css` opens by documenting a
previous drift incident that shipped a white footer on a dark page. A third identical copy
exists at `site/assets/css/` (expected: build output).

### Python — modest and mostly boilerplate

10 duplicate blocks (≥6 identical non-comment lines) span more than one file:

- **The `sys.path` bootstrap header** repeats verbatim across `about.py`, `academics.py`,
  `admissions.py`, `campus.py` and further page modules — 4 lines each.
- **One genuine logic duplicate:** the hub-link `<li>` builder at `landing.py:135` and
  `home.py:577`.

For 6,384 LOC this is low duplication. The generator is a DRY codebase.

---

## 7. Unused CSS, JavaScript, and assets

### 7.1 Unused CSS — 49 classes, ~7.5 KB **[M]**

Of **278** defined classes:

| Category | Count | ~Bytes | Meaning |
|---|---:|---:|---|
| Used in a `class=` attribute | 203 | 48.9 KB | Confirmed live |
| Dynamic-only | 26 | 4.3 KB | No `class=` occurrence, but the literal appears in JS or generator source — applied at runtime |
| **Unreferenced anywhere** | **49** | **~7.5 KB** | **Safe deletion candidates** |

Unused rule bytes are **12%** of total rule bytes. Byte figures are approximate: a rule's size
is split evenly across the classes in its selector.

**Correction from a first pass:** an initial run reported 62 unused, including `.js-on`. That
was wrong — `js-on` is applied by the inline script in `_layout.html`, which the first scanner
did not read. Widening the corpus to inline scripts, generator f-strings and JS moved 13
classes out of "unused". The **26 dynamic-only** classes below are correctly live and must
**not** be deleted: `.is-stuck`, `.is-paused`, `.is-ticking`, `.is-visible`, `.is-zero`,
`.is-sheet-open`, `.palette__opt*`, `.chip`, `.chip__x`, `.ripple`, `.js-on`, and others.

Largest genuinely-unused blocks:

| Class | Rules | ~Bytes |
|---|---:|---:|
| `.accordion` (+ `.accordion__body`) | 7 | 856 |
| `.hero__dot` / `.hero__dots` | 7 | 629 |
| `.timeline` (+ `__date`, `__title`, `__body`) | 7 | 908 |
| `.hero__caption` | 2 | 520 |
| `.hero__eyebrow` (+ `-dot`) | 3 | 723 |
| `.hero__stats` (+ `-num`, `-label`) | 6 | 723 |
| `.card__title` / `__icon` / `__body` / `__foot` / `.card--feature` | 10 | 761 |
| `.gallery` (+ `__item`, `__cap`) | 6 | 552 |
| `.media-frame` (+ `__cap`) | 2 | 245 |
| `.section-heading` (+ `__viewall`) | 2 | 254 |
| Remainder (grid/container/callout/badge modifiers) | ~19 | ~1,300 |

These are an unused component library — accordion, timeline, gallery, hero variants — built but
never wired into a page.

### 7.2 Unused JavaScript — none **[V]**

See §5. All four files are referenced, all 62 functions are reachable.

### 7.3 Unused assets **[M]**

**Served assets — nothing to delete.** All 523 files under `site/assets/` are referenced by the
392 pages:

| Directory | Files | Referenced | Unreferenced |
|---|---:|---:|---:|
| `site/assets/img` | 351 | 351 | 0 |
| `site/assets/documents` | 158 | 158 | 0 |
| `site/assets/fonts` | 4 | 4 | 0 |
| `site/assets/brand` | 2 | 2 | 0 |
| `site/assets/css` | 3 | 3 | 0 |
| `site/assets/js` | 5 | 4 | **1 → see below** |

**Correction:** `search-index.js` was flagged unreferenced because no `<script src>` points at
it. It is live — `palette.js:53` injects it: `s.src = prefix + "assets/js/search-index.js"`. A
classic script is used deliberately rather than `fetch()`, because `fetch()` is blocked on
`file://` and the site is reviewed by opening it from disk. Runtime confirms the design works:
loading `/documents/` fetches 3 scripts and **not** the index. **Corrected result: 0 of 523
unreferenced.**

**Build inputs — where the waste actually is.**

| Source pool | Files | Size | Used | Unused |
|---|---:|---:|---:|---:|
| `source-assets/images` | 577 | 224 MB | **20 distinct images** | **557 (~96.5%)** |
| `source-assets/documents` | 176 | 243.6 MB | 161 | 15 (22.6 MB) |
| `build/.imgcache` | — | 63 MB | — | regenerable cache |

The 20 selected images expand to 351 derivatives (7 widths × 3 formats — AVIF/WebP/JPEG).
Selection is deliberate: `build/data/images.py` documents excluding scanned notices and
timetables as "unreadable at card size and untranslatable", with their content surfaced as
HTML text instead.

The 15 unpublished PDFs are student-activity reports (AGRAGAMAN 2019 at 16.3 MB, bike rally,
debate, essay, quiz, slogan, tug-of-war). Several are **near-duplicate pairs** from the crawl —
`Bike-Rally-1-a638d70f1085.pdf` and `bike_rally-80c786d75eac.pdf`, `Debate-Competition-1-rpt`
and `Debate_Competition`, and three more.

---

## 8. Accessibility audit (WCAG AA)

### Lighthouse, four distinct templates **[M]**

| Page | Device | A11y | Best Practices | SEO | Agentic |
|---|---|---:|---:|---:|---:|
| `/` | mobile | **100** | 100 | 100 | 100 |
| `/documents/` | desktop | **100** | 100 | 100 | 96 |
| `/people/faculty/vijay-singh/` | desktop | **100** | 100 | 100 | 100 |
| `/search/` | desktop | **99** | 100 | 100 | 100 |

*A first `/documents/` run returned all zeros with `runtimeError: NO_FCP` — a browser
backgrounding + cache-clear timeout, not a page defect. The retry above is the valid result.
This is noted because an all-zero row is easy to mistake for a real score.*

### The one real defect: 142 pages skip a heading level **[M]**

Lighthouse failed `heading-order` on `/search/`. Independent static analysis of all 392 pages
confirms and quantifies it: **142 pages (36%)**, and **every single instance is the same
pattern — `h1 → h3`, never any other skip.**

| Section | Pages | Section | Pages |
|---|---:|---|---:|
| `research/equipment` | 49 | `research/projects` | 10 |
| `updates/events` | 43 | root (`500.html`, `maintenance.html`) | 2 |
| `research/publications` | 17 | 10 further sections | 1 each |
| `research/patents` | 11 | | |

**Root cause [I]:** the shared record-listing and record-detail templates emit record titles as
`<h3>` directly beneath the page `<h1>`, with no intervening `<h2>`. The uniformity of the
pattern means this is one template bug reproduced 142 times, not 142 separate mistakes.

**Standard:** WCAG 2.2 §1.3.1 Info and Relationships (Level A). Screen-reader users navigating
by heading perceive a missing level of structure.

### Everything else passes **[M]**

| Check | Result |
|---|---|
| Images without `alt` | 0 / 1,202 |
| Pages missing `<html lang>` | 0 / 392 |
| Pages with 0 `<h1>` | 0 / 392 |
| Pages with >1 `<h1>` | 0 / 392 |
| Pages with skip link | **392 / 392** |
| `target="_blank"` without `rel="noopener"` | 0 / 784 |

---

## 9. SEO audit **[M]**

### Strong

| Check | Result |
|---|---|
| Missing `<title>` | 0 / 392 |
| Missing meta description | 0 / 392 |
| Missing canonical | 0 / 392 |
| Distinct meta descriptions | **392 / 392** — no duplication at all |
| Distinct titles | 389 / 392 |
| Broken internal links | **0** of 3,253 references |
| Lighthouse SEO | 100 on all four sampled templates |

Three duplicate titles are legitimately recurring events (an AI/DL/ML workshop run three times,
a drone-technology training run twice). They need disambiguation by date.

### Gaps

| Missing | Impact |
|---|---|
| **`robots.txt`** | No crawl directives; no sitemap discovery hint |
| **`sitemap.xml`** | 392 URLs rely on link discovery. An HTML sitemap exists at `/sitemap/`, which is a user-facing page, not a machine-readable one |
| **JSON-LD structured data — 0 pages** | No `EducationalOrganization`, `Person` (faculty), `Course` (programmes), or `Event` markup. For an institution whose content *is* people, courses and events, this is the single largest missed SEO opportunity |
| `site.webmanifest` | No install/PWA metadata |

---

## 10. Security observations **[M]**

| Check | Result |
|---|---|
| Secrets / API keys / private keys in source | **0** |
| npm vulnerabilities | **0** |
| External origins referenced | **2 only** — `aktu.ac.in` (784), `cas.res.in` (776) |
| `target="_blank"` without `noopener` | 0 |
| Third-party scripts, trackers, analytics, font CDNs | **none** |

### Observations

1. **784 inline `<script>` blocks — 2 per page.** These are the pre-paint theme resolver and the
   `--chrome-h` measurement, both of which *must* stay inline for correctness (§11). But they
   mean a strict `Content-Security-Policy` requires per-page **nonces or hashes**; a plain
   `script-src 'self'` would break every page. Worth deciding deliberately during the migration
   rather than discovering at deploy.
2. **No security headers are configurable from the repo** — no `_headers`, `.htaccess`, or host
   config. CSP, HSTS, `X-Content-Type-Options` and `Referrer-Policy` are currently entirely
   host-side and undocumented.
3. **Python dependencies are undeclared** (§4) — nothing pins `Pillow`, `requests`, `bs4` or
   `fontTools`, so no supply-chain review is possible for the build toolchain.

### Rights clearance — a launch blocker **[M]**

Every one of the **50 image records** in `build/data/images.py` is constructed by `_img()`,
which hard-codes:

```python
"credit": "Centre for Advanced Studies (legacy website migration)",
"rights_status": PENDING,   # "pending-confirmation"
```

The module states plainly: *"these are migrated from the legacy public site, so CAS is the
probable owner… Nothing here should be treated as cleared."* A rights/consent audit was
required before launch by the (now missing) `PRODUCT_REQUIREMENTS.md` #14.

**This is a legal question, not a technical one, and no amount of migration work resolves it.**
Several images depict identifiable people. `python build/generate.py --rights-report` prints
the sign-off list — note that this invokes the generator, so run it only when a build is
acceptable.

---

## 11. Performance bottlenecks and Core Web Vitals **[M]**

*Local server, HTTP/1.0, no compression — see §0.*

| Metric | `/` | `/documents/` |
|---|---:|---:|
| LCP | 1,302 ms | not captured |
| — TTFB | 31 ms | 94 ms |
| — render delay | 1,272 ms | — |
| **CLS** | **0.00** | **0.088** |
| FCP | — | 2,240 ms |
| DOM content loaded | — | 2,565 ms |
| DOM nodes | — | 1,404 |
| Requests / transferred | — | 11 / 372 KB |

### Bottleneck 1 — three render-blocking stylesheets on all 392 pages

| Request | Duration | Render-blocking |
|---|---:|---|
| `components.css` | 138 ms | yes |
| `base.css` | 123 ms | yes |
| `tokens.css` | 123 ms | yes |

99 KB of CSS blocks first paint on every page, and **no page uses more than a fraction of it** —
`/documents/` needs the facet UI; a faculty profile does not. Nothing is split or deferred.
LCP is 98% render delay (1,272 ms of 1,302 ms), not network.

### Bottleneck 2 — CLS 0.088 on `/documents/`

Measured twice, independently: Lighthouse `cumulative-layout-shift` 0.0883 and a
`PerformanceObserver` script 0.0883. Home is 0.00, so this is specific to the facet UI, which
renders and then reflows. Still inside the "good" threshold (≤ 0.1) but the only page that
fails a Lighthouse metric audit, and it is the site's most-used utility page.

### Bottleneck 3 — 63 MB image cache, 224 MB of unbuilt sources

`build/.imgcache` and 557 never-built source images make any clone or CI checkout carry ~290 MB
of dead weight (§7.3).

### What is already right

- Self-hosted variable fonts, `unicode-range`-split so latin-ext downloads only on demand
- Only latin subsets preloaded; no third-party font origin, no `preconnect` needed
- Images served as AVIF/WebP/JPEG at 7 widths
- The 55 KB search index is genuinely lazy — confirmed absent from initial page loads
- CLS 0.00 on the home page despite a full-viewport hero, because `--chrome-h` is measured
  inline pre-paint

---

## 12. Architecture issues

1. **A second, incompatible migration is half-built.** `web/` is an Astro 7 + React islands app
   covering 160 / 392 pages. The approved design (`docs/superpowers/specs/2026-08-07-react-migration-design.md`)
   goes to React Router instead, so `web/` is now a fork to delete, not a base to build on.
2. **The design system is forked** — §6. Two maintained copies, drift already visible.
3. **The specification suite is missing.** `docs/` holds `master.md` and this report. Roughly 20
   source files cite five specs that no longer exist:
   `INFORMATION_ARCHITECTURE.md` (`generate.py:40`, `detail.py:2`, `landing.py:2`, every
   `data/*.py`), `PRODUCT_REQUIREMENTS.md` (`web/src/content.config.ts:15`),
   `UX_UI_SPECIFICATION.md` (`data/images.py:9`, `error_pages.py:2`),
   `CONTENT_MIGRATION_LAUNCH.md` (`detail.py:9`), `MIGRATION_ASTRO.md` (`astro.config.mjs`).
   Code comments also cite requirement IDs (FR-02, FR-04–FR-12) that are now unresolvable.
4. **The repository is not under version control.** No `git` repository. There is no history, no
   diff, and no rollback for a migration that will delete ~750 MB and 6,384 LOC. Combined with
   issue 3 — where a prior specification set has already been lost — this is the highest-severity
   process risk in this audit.
5. **The build cannot run on a clean machine** — no dependency manifest (§4).
6. **`content/` is an empty directory.**

---

## 13. Technical debt

| Debt | Evidence | Severity |
|---|---|---|
| No version control | §12.4 | **Critical** |
| Rights clearance outstanding on all 50 images | §10 | **Critical (launch blocker)** |
| 142 pages with heading-order violation | §8 | High |
| Missing specification suite, dangling citations | §12.3 | High |
| Forked design system, 87.3 KB | §6 | High |
| Undeclared Python dependencies | §4 | Medium |
| No `robots.txt` / `sitemap.xml` / JSON-LD | §9 | Medium |
| 290 MB unused build inputs + cache | §7.3 | Medium |
| Abandoned Astro app, 198 MB `node_modules` | §12.1 | Medium |
| 49 unused CSS classes (~7.5 KB) | §7.1 | Low |
| `sys.path` bootstrap repeated across page modules | §6 | Low |
| Empty `content/` directory | §2 | Trivial |

---

## 14. Refactoring opportunities

Ordered by value to the migration:

1. **Fix heading order once, in the shared record template** — repairs 142 pages in a single
   change. Do this in the React port rather than the Python generator being retired.
2. **Split CSS per route.** CSS Modules (the approved approach) directly addresses bottleneck 1;
   a faculty page should not download the facet UI.
3. **Add JSON-LD from the existing typed data.** `Person`, `Course`, `Event` and
   `EducationalOrganization` markup is derivable from records already structured for it — near-zero
   marginal cost during the port, and the largest SEO gain available (§9).
4. **Emit `robots.txt` + `sitemap.xml` at build time** from the same route list that drives
   prerendering — they cannot drift if generated from one source.
5. **Drop the 49 unused classes** during the CSS split, not before (§16).
6. **Collapse the `sys.path` bootstrap** — obsolete once the generator is deleted; no action needed.
7. **Reserve layout space in the facet UI** to eliminate CLS 0.088.

---

## 15. Migration risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| No git — a bad deletion is unrecoverable | High | **Severe** | **`git init` and commit before S1.** Non-negotiable given §12.3 precedent |
| RR8 prerender emits flat `.html`, breaking 392 indexed URLs | Medium | Severe | S1 gate in the design spec; prove output shape before porting |
| Deleting "unused" CSS/JS that is applied dynamically | Medium | High | §7.1/§7.2 corrections; never delete a class that appears in JS or generator source |
| Losing the verification oracle before parity | Medium | High | Keep `build/` + `site/` until the parity harness passes; undeclared deps (§4) mean a deleted generator may be unrebuildable |
| Hydration cost breaks the Lighthouse-95 goal | Medium | Medium | Current baseline is 100 on three templates — the migration can only regress this. Measure per stage |
| Reintroducing CLS by moving `--chrome-h` out of inline | Medium | Medium | Documented 0.06 CLS precedent; keep pre-paint |
| Rights clearance never completes | Unknown | **Blocks launch** | Escalate now — independent of engineering |
| Content transcription errors | Low | High | Machine export only; never retype records |

---

## 16. Safe deletion candidates, with evidence

**Gate: nothing here is deleted before `git init` (§15) and before the S6 parity harness passes.**

### Tier 1 — delete now, zero risk

| Target | Size | Evidence |
|---|---:|---|
| `content/` | 0 B | Empty directory **[M]** |
| `build/.imgcache/` | 63 MB | Regenerable cache; `imagepipe.py` rebuilds from fingerprints **[I]** |

### Tier 2 — delete after the parity harness passes (S7)

| Target | Size | Evidence |
|---|---:|---|
| `web/` + `node_modules` | 200 MB | Superseded by the approved design; 0 imports from `build/` or `assets/` **[M]** |
| `build/` | 1 MB | Replaced by the React build — **only after** parity, it is the oracle |
| `templates/` | 4 KB | `_layout.html` → `RootLayout` |
| `assets/` | 625 KB | Ported into `src/` |
| `site/` | 238 MB | Regenerated output |
| `preview.cmd` | 1 KB | Serves the retired generator |
| 49 CSS classes | ~7.5 KB | §7.1 — **the 26 dynamic-only classes are NOT in this set** |

### Tier 3 — needs a human decision, not an engineering one

| Target | Size | Why it is not an engineering call |
|---|---:|---|
| 557 unbuilt source images | ~215 MB | Archival originals. Deleting forecloses ever re-cropping or re-selecting. **Recommend: archive off-repo, do not delete** |
| 15 unpublished PDFs | 22.6 MB | Student-activity reports. Several are near-duplicate crawl pairs. CAS should confirm they are genuinely out of scope |

### Never delete

`source-assets/` (irreplaceable originals) · `research/` (crawl provenance; 158 document
records derive from these CSVs) · `docs/` · `meow/` (owner's reference screenshots) ·
all 62 live JS functions · the 26 dynamic-only CSS classes.

---

## 17. Recommendations

### Before Stage S1 — do these first

1. **`git init`, commit everything, and confirm the commit.** §12.4. The specification suite has
   already been lost once; the migration deletes 750 MB and 6,384 LOC.
2. **Recover the five missing specs from the Recycle Bin** (§12.3). They encode decisions no
   audit can reconstruct. If unrecoverable, reconstruct a minimal IA document before porting.
3. **Escalate image rights clearance to CAS** (§10). Independent of engineering, blocks launch,
   and has a long human turnaround. Start it now, not at S9.
4. **Write `requirements.txt`** pinning `Pillow`, `requests`, `beautifulsoup4`, `fonttools` — the
   generator must stay rebuildable while it is the verification oracle.

### During the migration

5. Fix heading order in the shared record template — 142 pages, one change (§8).
6. Split CSS per route via CSS Modules; drop the 49 unused classes then (§7.1, §14).
7. Generate `robots.txt`, `sitemap.xml` and JSON-LD from the route list and typed records (§9).
8. Reserve layout space in the facet UI to clear CLS 0.088 (§11).
9. Keep both inline pre-paint scripts inline (§10.1, §11).

### Calibration

**The current site scores 100 / 100 / 100 on three of four sampled templates, has zero broken
links, zero missing alt text, and zero dead JavaScript.** The migration's realistic goal is to
*match* this while gaining a component architecture — not to improve it. Any stage that regresses
these numbers has failed, and the parity harness should treat them as the baseline to defend.

---

## Appendix — methodology

| Analysis | Method |
|---|---|
| File inventory, storage | `find`, `du`, `wc` over the working tree |
| Component inventory | `wc -l` per module; CSS selector parser (brace-matched, `@media`-aware) |
| Dependencies | `npm outdated`, `npm audit --omit=dev`; import extraction from 44 `.py` files |
| Unused CSS | Custom parser: 278 classes vs `class=` attributes in 392 pages, plus corpus-wide literal search across inline scripts, JS and generator source |
| Dead JS | Declaration extraction + call-site counting, then **manual verification of every flag** |
| Duplicate code | `diff` for CSS; 6-line normalised sliding-window matcher for Python |
| Unused assets | Reference map from `src`/`srcset`/`href`/`url()` across 392 pages + CSS; MD5 content matching for source→published PDFs |
| Lighthouse | Chrome DevTools MCP, navigation mode, 4 templates |
| Core Web Vitals | DevTools performance trace + in-page `PerformanceObserver` |
| SEO / a11y statics | Custom parser over all 392 pages |
| Secrets | Pattern scan across source directories |

**Environment:** Windows 11, Python 3.14.3, `python -m http.server` on `127.0.0.1:8765`,
HTTP/1.0, no compression, no CPU or network throttling.

**Not covered:** cross-browser testing (Chromium only), real-device performance, keyboard and
screen-reader walkthroughs (automated a11y catches roughly 30–40% of WCAG issues — the 100
scores in §8 should not be read as full WCAG AA conformance), load testing, and legal review of
the rights question in §10.
