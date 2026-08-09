# Home UI — Phase 1 Design

Date: 2026-08-09
Branch: `migration/react-router`
Status: Approved

## Goal

Rebuild the home page and site header to match three supplied references, taking a
different aspect from each:

| Reference  | What it supplies                                                        |
| ---------- | ----------------------------------------------------------------------- |
| `cas3.png` | Top identity bar, nav bar, below-hero page structure, footer            |
| `cas2.png` | Hero text block and slide indicators — minimal, text-only               |
| `cas1.png` | Search field and theme-toggle control styling only                      |

Two additions come from the approval round and are not in any reference: an
always-present **Explore Campus** section below the hero, and a seasonal
**Admissions** section beside it.

Phase 1 is the home page plus the shared header. Interior routes inherit the new
header and must not regress; their bodies are out of scope.

## Design constraints

Stated at approval, binding on every decision below:

- Minimal and institutional. This is a university research centre, not a product page.
- Authentic CAS campus and lab photography. No stock, no illustration, no gradient meshes.
- No excessive cards. Photo tiles with a label are fine; raised panels with shadow,
  border and padding stacked three deep are not.
- No glass effects. `backdrop-filter` is not used anywhere in phase 1, including the
  header over the hero.
- No decorative gradients. The only gradient permitted is a functional scrim whose sole
  job is to lift text to 4.5:1 over photography.

### Resolved tension: info row treatment

`cas3.png` wraps the five-column info row in a raised white panel. The minimalism
constraint forbids that. The row therefore takes **cas3's structure** (five columns:
About CAS, Latest News, Upcoming Events, Notices, Quick Links) with **cas2's flat
rendering** (plain columns on page ground, a short rule under each heading, hairline
vertical dividers). Recorded here so the divergence from cas3 is deliberate, not drift.

## Page architecture

```
Header          cas3 layout + cas1 search/theme controls
Hero            cas2 minimal text · 3s background slideshow · 01–04 counter
Campus band     Explore Campus (always) + Admissions (Jul–Sep, data-gated)
Card strip      5 photo tiles from cas3 · each rotates every 5s, staggered
Stats band      the 6 metrics cas3 placed in its hero, relocated
Info row        About CAS · Latest News · Events · Notices · Quick Links
Footer          cas3 footer
```

The stats band exists because the approved hero is the pure-cas2 minimal variant, which
has no room for cas3's six-metric strip. Relocating it below the cards preserves the
information without crowding the hero.

## Components

### 1. Header (`src/components/Header/`)

Modifies the existing component. Structure follows cas3 exactly:

- **Identity row** — CAS emblem, "Centre for Advanced Studies", the AKTU line, and
  "Research. Innovation. Excellence." on the left; AKTU Devanagari + English lockup and
  emblem on the right.
- **Nav row** — nine items, centred, no dropdown carets:
  About · Academics · Research · People · Facilities · Publications · Updates · Documents · Contact

Admissions and Campus leave the primary nav. Both routes stay live and are reachable
from the Quick Links column and the footer, so neither is orphaned.

The nav-row right cluster takes cas1's treatment rather than cas3's bare magnifier: a
pill search field with an inline icon and "Search…" placeholder, then the theme toggle
as a matching pill. cas1's "EN ∨" language selector is **omitted** — the project has no
i18n and it would be a dead control.

Over the hero the header is transparent with a functional top scrim; it does not use
`backdrop-filter`. The existing scroll behaviour (identity row exits upward, nav row
settles) is retained.

### 2. Hero (`src/routes/home.tsx`)

Text block exactly as cas2:

- "Centre for / Advanced Studies" on two lines, light weight, white
- Short horizontal rule beneath
- Three-line lede: "An in-campus research institute driving excellence in advanced
  research, innovation and emerging technologies."
- `Explore CAS →` as a bare text link, **not** a filled button
- Bottom-left `01 02 03 04`, active number underlined
- Bottom-right two circular outline arrows

Behind it, four slides crossfading every 3000 ms, mixing CAS campus exteriors with lab
interiors. Crossfade only — no Ken Burns, no slide transform. The arrows and the number
indicators both seek; manual interaction resets the timer.

### 3. Campus band (`src/routes/home.tsx` + `AdmissionsRail`)

Two columns directly below the hero.

**Explore Campus** — always present. Heading, one supporting line, and a four-image tour
grid drawn from `campustour/img/{library,classroom,commonroom,corridor}`. Static images,
no rotation; the band is a wayfinding element, not another slideshow. Links to `/campus`.

**Admissions** — a narrow rail beside it. Renders only when **both** conditions hold:

1. The current month is July, August or September, and
2. `getNotices()` yields at least one entry with `notice_type === 'Admission'` and
   `status === 'Open'`.

When it renders it lists those notices with title, session, audience and a link to the
linked document. When it does not, the rail unmounts and Explore Campus takes the full
width. No admission content is fabricated in either state — if the window is open but
the data is empty, the rail stays hidden rather than showing an empty shell.

Current data satisfies both conditions: three open `Admission` notices for session
2026-27, and today is 9 August.

#### Seasonality under prerendering — critical

`react-router.config.ts` sets `ssr: false` with 392 prerendered routes. The home page is
static HTML baked at build time. Evaluating the month during render would freeze the
built output into whatever month the build machine ran in — a June build would never
show admissions in July, and an August build would still show it the following March.

The gate is therefore evaluated **on the client after hydration**, via
`useSyncExternalStore` with a server snapshot of `false`. The prerendered HTML contains
the inactive state; the rail appears on hydration when in season. Consequences accepted:

- The rail is invisible to non-JS visitors and to crawlers reading the static HTML.
  Acceptable — `/admissions` remains a real, prerendered, crawlable route and the notices
  are listed there.
- A brief appear-in on first paint during season. It sits below the hero and Explore
  Campus does not reflow into its space, so there is no above-the-fold CLS.

`isAdmissionsSeason(date)` is a pure exported function taking an injectable date so the
boundary months can be exercised without mocking the clock.

### 4. Card strip

The five tiles from cas3: Research Labs, Academic Programs, Research Areas, Innovations,
Campus Life. Each is a full-bleed photo tile with a label, short line and arrow — no
raised card chrome.

Each tile owns a five-image set rotating every 5000 ms. Rotations are **staggered
800 ms apart** so the strip breathes instead of flipping in unison.

### 5. Stats band

The six cas3 metrics, derived from real collections — the reference numbers came from
this dataset and match it exactly:

| Metric              | Source                | Value |
| ------------------- | --------------------- | ----- |
| Academic Programmes | `programs.json`       | 9     |
| Faculty Members     | `faculty.json`        | 13    |
| Research Facilities | `equipment.json`      | 48    |
| Publications        | `publications.json`   | 16    |
| Funded Projects     | `projects.json`       | 9     |
| Events & Workshops  | `events.json`         | 42    |

Counts are read from the loaders, never hardcoded. Rendered as a plain row with hairline
dividers and simple line icons — no panel, no background gradient.

### 6. Info row and footer

Five columns as listed above, flat per the resolved tension. Quick Links carries
Admissions, Campus, Academic Calendar, Research Policies, Forms & Downloads and Contact
Directory, which is what keeps the two de-navved routes discoverable. Footer follows
cas3: copyright left, Privacy / Terms / Sitemap centre, social icons right.

## Slideshow engine

One hook and one component, shared by the hero and all five tiles. Six independently
written timers is how this page would rot.

`useSlideshow(length, { intervalMs, offsetMs, paused })` returns `{ index, goTo, next, prev }`
and is the single owner of:

- interval scheduling and the stagger offset
- pausing when `document.visibilityState === 'hidden'`
- pausing on hover and on focus-within, for the tiles
- freezing at slide 0 under `prefers-reduced-motion: reduce`
- timer reset on manual seek

`<Crossfade slides={…} index={…} />` renders the stack, applies opacity transitions, and
marks every slide after the first `loading="lazy"`.

Interfaces are narrow on purpose: the hook knows nothing about images, the component
knows nothing about timing. Either can be changed without touching the other.

## Assets

Roughly 33 images are curated from the 585 real CAS photographs in `source-assets/images`,
which the inventory already buckets by topic. Mapping:

| Destination            | Source buckets                                                      | Count |
| ---------------------- | ------------------------------------------------------------------- | ----- |
| Hero                   | `img/`, `home1/doc/gallery`, `campustour/img` (root)                 | 4     |
| Research Labs tile     | `campustour/img/{robolab,nanolab,materiallab,cyberlab,automationlab}`| 5     |
| Academic Programs tile | `images/{python,workshop23,seminar}`                                 | 5     |
| Research Areas tile    | `images/{nano,ai,devices,nanoenergy,cybercity}`                      | 5     |
| Innovations tile       | `images/innov`                                                       | 5     |
| Campus Life tile       | `images/media`                                                       | 5     |
| Explore Campus grid    | `campustour/img/{library,classroom,commonroom,corridor}`             | 4     |

Output to `public/assets/home/<set>/`, resized and re-encoded to WebP with a JPEG
fallback. Hero slides target 2400px wide; tiles 800px; the campus grid 600px.

This step is not optional. The source pool holds files up to 8.7 MB (`img/4.jpg`), and
shipping 33 of them unprocessed would make the page unusable. Only hero slide 1 gets
`fetchPriority="high"`; every other image is lazy.

Curation is by eye against the topic buckets — the filenames are content-hashed and
carry no meaning. Selection criteria: landscape orientation, ≥1600px for hero
candidates, no visible text overlays or date stamps, no identifiable faces in the
foreground where a wider shot serves equally.

## Accessibility

- Slideshows are decorative: the container is `aria-hidden` where the tile already has a
  text label, so rotation is never announced.
- Hero indicators are real `<button>`s with `aria-label="Show slide N"` and
  `aria-current` on the active one.
- `prefers-reduced-motion: reduce` freezes every slideshow at slide 0. Controls remain
  operable — reduced motion removes automatic movement, not user agency.
- The card strip and campus grid are keyboard reachable in DOM order; focus-within pauses
  the rotation so a keyboard user is not reading a moving target.
- Text over photography clears 4.5:1 against the scrimmed backdrop, verified per hero
  slide rather than assumed from one.

## Verification

The project has no test framework, so verification is:

1. `npm run typecheck` — clean
2. `npm run lint` — clean
3. `npm run build` — succeeds, including `verify-urls.mjs`
4. Browser QA via chrome-devtools MCP: hero rotation at 3s, tile rotation at 5s and
   staggered, admissions rail present in August and absent when `isAdmissionsSeason` is
   given an out-of-season date, light and dark themes, 1440 / 1024 / 390px widths,
   reduced-motion emulation
5. Lighthouse on the home page — no regression against the current build

## Out of scope

Interior route bodies, the mobile nav drawer beyond making the header not break, the
`EN` language selector, dropdown menus on nav items, and the video-thumbnail element
from cas1's hero.
