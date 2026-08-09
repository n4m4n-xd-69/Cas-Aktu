# Home UI Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the home page and shared header to match the cas1/cas2/cas3 references, adding an always-on Explore Campus band and a July–September Admissions rail.

**Architecture:** One `useSlideshow` timing hook and one `<Crossfade>` renderer serve the hero and all five card tiles — six call sites, one implementation. The home route becomes a thin composition of five section components. Photography is curated from the existing 585-image CAS pool by a build script into `public/assets/home/`, with a typed manifest so components never reference raw paths.

**Tech Stack:** React 19, React Router 7 (`ssr: false`, prerendered), CSS Modules, existing design tokens in `src/styles/tokens.css`, `sharp` for asset processing, `vitest` for pure-logic tests.

**Spec:** `docs/superpowers/specs/2026-08-09-home-ui-phase1-design.md`

## Global Constraints

- **Minimal and institutional.** University research centre, not a product page.
- **No `backdrop-filter` anywhere in phase 1**, including the header over the hero.
- **No decorative gradients.** The only permitted gradient is a functional text scrim over photography.
- **No raised card chrome** on the five tiles — full-bleed photo + label only.
- **Authentic CAS photography only.** Every image comes from `source-assets/images`. No stock, no illustration.
- **Never hardcode counts.** Stats read from `src/data/loaders.ts`.
- **Colour only via tokens.** Never write a raw hex or a `[data-theme="dark"]` selector in a component — `tokens.css` uses `light-dark()` and components that write their own dark rule silently break for OS-dark visitors who never touched the toggle.
- **`prefers-reduced-motion: reduce` freezes every slideshow at slide 0**, controls stay operable.
- Nav is exactly nine items: About, Academics, Research, People, Facilities, Publications, Updates, Documents, Contact.
- Verified route paths: `/about` `/academics` `/research` `/people` `/research/facilities` `/research/publications` `/updates` `/documents` `/contact` `/campus` `/admissions`.
- Run `npm test && npm run typecheck && npm run lint` before every commit.
- **`react-hooks/set-state-in-effect` is an ERROR in this project.** Calling a
  setter synchronously in an effect body fails the build. To seed state from a
  browser API (media query, visibility, scroll position), use
  `useSyncExternalStore`, not `useState` + a self-calling effect.
- **Known red baseline:** `src/components/Header/Header.tsx:35` violates that rule
  and predates this plan (commit `259b961`). Until Task 5 clears it, `npm run lint`
  reports exactly `1 problem (1 error, 0 warnings)`. Tasks 2–4 must introduce **no
  additional** lint errors; that one is expected. Task 5 must bring lint to zero.

## Decision flagged for the user

The project has **no test framework**. Task 1 adds `vitest`, `jsdom` and
`@testing-library/react` as devDependencies. Justification: `isAdmissionsSeason` has
month-boundary behaviour that cannot be reached by clicking (you cannot browse in
November today), and `useSlideshow` is shared by six call sites with subtle
visibility/reduced-motion/timer-reset logic. Everything visual is verified in the
browser instead — there are no snapshot or render tests.

If the user prefers zero new tooling, drop Task 1, delete Steps 1–2 and 4 of Task 2, and
rely on browser QA alone. Nothing else in the plan depends on the test stack.

## File Structure

**Create**

| File | Responsibility |
| --- | --- |
| `src/lib/admissions.ts` | `isAdmissionsSeason(date)` + `useAdmissionsSeason()` |
| `src/lib/admissions.test.ts` | Month-boundary tests |
| `src/lib/useSlideshow.ts` | Timing: interval, stagger, pause, reduced-motion, seek |
| `src/lib/useSlideshow.test.ts` | Timer and pause tests |
| `src/components/Crossfade/Crossfade.tsx` `.module.css` `index.ts` | Opacity slide stack |
| `src/components/AdmissionsRail/AdmissionsRail.tsx` `.module.css` `index.ts` | Seasonal notice rail |
| `src/components/home/Hero.tsx` `.module.css` | Hero |
| `src/components/home/CampusBand.tsx` `.module.css` | Explore Campus + rail |
| `src/components/home/CardStrip.tsx` `.module.css` | Five rotating tiles |
| `src/components/home/StatsBand.tsx` `.module.css` | Six metrics |
| `src/components/home/InfoRow.tsx` `.module.css` | Five info columns |
| `src/components/home/index.ts` | Barrel |
| `src/data/home-media.ts` | Typed image manifest |
| `src/components/CommandPalette/paletteStore.ts` | External open/close store |
| `scripts/build-home-media.mjs` | Curate + resize + encode |

**Modify**

| File | Change |
| --- | --- |
| `src/components/Header/Header.tsx` `.module.css` | Nine-item nav, search pill, theme pill |
| `src/components/CommandPalette/CommandPalette.tsx` | Consume `paletteStore` |
| `src/components/ThemeToggle/ThemeToggle.tsx` `.module.css` | Pill form |
| `src/routes/home.tsx` | Compose sections |
| `src/routes/home.module.css` | Strip superseded rules |
| `src/components/index.ts` | Export new components |
| `package.json` | `sharp`, `vitest`, `jsdom`, `@testing-library/react`, `test` script |

---

### Task 1: Test harness and the admissions season gate

**Files:**
- Modify: `package.json`
- Create: `src/lib/admissions.ts`
- Test: `src/lib/admissions.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `isAdmissionsSeason(date: Date): boolean`, `useAdmissionsSeason(): boolean`

- [ ] **Step 1: Install the test stack**

```bash
npm install -D vitest jsdom @testing-library/react
```

Add to `package.json` scripts (keep existing entries):

```json
"test": "vitest run",
"test:watch": "vitest"
```

Add to `vite.config.ts` — Vitest reads this file, so no separate config is needed. Add
the `test` key to the existing `defineConfig` object and add this triple-slash directive
as line 1 of the file so TypeScript accepts the key:

```ts
/// <reference types="vitest/config" />
```

```ts
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
```

- [ ] **Step 2: Write the failing test**

`src/lib/admissions.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

import { isAdmissionsSeason } from './admissions';

/** Month is 1-indexed here for readability; Date's is not. */
const on = (month: number, day = 15) => new Date(2026, month - 1, day);

describe('isAdmissionsSeason', () => {
  it('is open across July, August and September', () => {
    expect(isAdmissionsSeason(on(7))).toBe(true);
    expect(isAdmissionsSeason(on(8))).toBe(true);
    expect(isAdmissionsSeason(on(9))).toBe(true);
  });

  it('is closed in the months either side', () => {
    expect(isAdmissionsSeason(on(6))).toBe(false);
    expect(isAdmissionsSeason(on(10))).toBe(false);
  });

  it('includes both boundary days', () => {
    expect(isAdmissionsSeason(on(7, 1))).toBe(true);
    expect(isAdmissionsSeason(on(9, 30))).toBe(true);
    expect(isAdmissionsSeason(on(6, 30))).toBe(false);
    expect(isAdmissionsSeason(on(10, 1))).toBe(false);
  });

  it('is closed for the rest of the year', () => {
    for (const m of [1, 2, 3, 4, 5, 11, 12]) {
      expect(isAdmissionsSeason(on(m))).toBe(false);
    }
  });
});
```

- [ ] **Step 3: Run it and confirm it fails**

Run: `npm test -- admissions`
Expected: FAIL — cannot resolve `./admissions`.

- [ ] **Step 4: Implement**

`src/lib/admissions.ts`:

```ts
import { useSyncExternalStore } from 'react';

/**
 * July, August and September, inclusive.
 *
 * Takes an explicit date rather than reading the clock so the boundary
 * months are reachable from a test — you cannot browse in November today.
 */
export function isAdmissionsSeason(date: Date): boolean {
  const month = date.getMonth(); // 0-indexed: July is 6
  return month >= 6 && month <= 8;
}

/** The season never changes mid-session, so there is nothing to subscribe to. */
const subscribe = () => () => {};

/**
 * Client-only season gate.
 *
 * react-router.config.ts sets `ssr: false` with 392 prerendered routes, so this
 * page is static HTML baked at build time. Reading the clock during render would
 * freeze the build month into the artifact: a June build would never open in July,
 * and an August build would still be advertising admissions the following March.
 *
 * The server snapshot is therefore always false — the prerendered HTML ships the
 * closed state, and the rail appears on hydration when genuinely in season.
 */
export function useAdmissionsSeason(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => isAdmissionsSeason(new Date()),
    () => false,
  );
}
```

- [ ] **Step 5: Run tests and typecheck**

Run: `npm test -- admissions && npm run typecheck && npm run lint`
Expected: 4 tests pass, typecheck and lint clean.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vite.config.ts src/lib/admissions.ts src/lib/admissions.test.ts
git commit -m "feat: add admissions season gate with client-only evaluation"
```

---

### Task 2: The slideshow timing hook

**Files:**
- Create: `src/lib/useSlideshow.ts`
- Test: `src/lib/useSlideshow.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  ```ts
  type SlideshowOptions = { intervalMs: number; offsetMs?: number; paused?: boolean };
  type Slideshow = { index: number; goTo: (i: number) => void; next: () => void; prev: () => void };
  function useSlideshow(length: number, options: SlideshowOptions): Slideshow;
  ```

- [ ] **Step 1: Write the failing test**

`src/lib/useSlideshow.test.ts`:

```tsx
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useSlideshow } from './useSlideshow';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('useSlideshow', () => {
  it('advances once per interval and wraps', () => {
    const { result } = renderHook(() => useSlideshow(3, { intervalMs: 1000 }));
    expect(result.current.index).toBe(0);

    act(() => void vi.advanceTimersByTime(1000));
    expect(result.current.index).toBe(1);

    act(() => void vi.advanceTimersByTime(2000));
    expect(result.current.index).toBe(0);
  });

  it('delays the first advance by the stagger offset', () => {
    const { result } = renderHook(() =>
      useSlideshow(3, { intervalMs: 1000, offsetMs: 500 }),
    );

    act(() => void vi.advanceTimersByTime(999));
    expect(result.current.index).toBe(0);

    act(() => void vi.advanceTimersByTime(501));
    expect(result.current.index).toBe(1);
  });

  it('does not advance while paused', () => {
    const { result } = renderHook(() =>
      useSlideshow(3, { intervalMs: 1000, paused: true }),
    );

    act(() => void vi.advanceTimersByTime(5000));
    expect(result.current.index).toBe(0);
  });

  it('restarts the interval after a manual seek', () => {
    const { result } = renderHook(() => useSlideshow(3, { intervalMs: 1000 }));

    act(() => void vi.advanceTimersByTime(900));
    act(() => result.current.goTo(2));
    expect(result.current.index).toBe(2);

    // The 100ms left on the old timer must not fire.
    act(() => void vi.advanceTimersByTime(100));
    expect(result.current.index).toBe(2);

    act(() => void vi.advanceTimersByTime(900));
    expect(result.current.index).toBe(0);
  });

  it('wraps backwards from the first slide', () => {
    const { result } = renderHook(() => useSlideshow(3, { intervalMs: 1000 }));
    act(() => result.current.prev());
    expect(result.current.index).toBe(2);
  });

  it('stays on slide 0 for a single-slide set', () => {
    const { result } = renderHook(() => useSlideshow(1, { intervalMs: 1000 }));
    act(() => void vi.advanceTimersByTime(5000));
    expect(result.current.index).toBe(0);
  });
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npm test -- useSlideshow`
Expected: FAIL — cannot resolve `./useSlideshow`.

- [ ] **Step 3: Implement**

`src/lib/useSlideshow.ts`:

```ts
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';

export type SlideshowOptions = {
  /** Milliseconds each slide is held. */
  intervalMs: number;
  /** Delay before the first advance, so sibling slideshows do not flip in unison. */
  offsetMs?: number;
  /** Caller-driven pause — hover, focus-within, or a single-slide set. */
  paused?: boolean;
};

export type Slideshow = {
  index: number;
  goTo: (i: number) => void;
  next: () => void;
  prev: () => void;
};

const MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Both of these read a browser preference that lives outside React.
 *
 * They use useSyncExternalStore rather than useState + useEffect because the
 * project lints `react-hooks/set-state-in-effect` as an error: the
 * "set initial value inside the effect" pattern is a build failure here, not a
 * style note. useSyncExternalStore also gets the SSR snapshot right for free,
 * which matters — this site prerenders.
 */
function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia(MOTION_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false,
  );
}

function subscribeToVisibility(onChange: () => void) {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
}

function useDocumentHidden(): boolean {
  return useSyncExternalStore(
    subscribeToVisibility,
    () => document.visibilityState === 'hidden',
    () => false,
  );
}

/**
 * Single owner of slideshow timing for the hero and all five card tiles.
 *
 * Six hand-rolled intervals is how this page would rot, so every rule lives
 * here: stagger, pause on hidden tab, pause on hover/focus, freeze under
 * reduced motion, and reset the clock whenever the user seeks manually.
 */
export function useSlideshow(
  length: number,
  { intervalMs, offsetMs = 0, paused = false }: SlideshowOptions,
): Slideshow {
  const [index, setIndex] = useState(0);
  /** Bumped on every manual seek to retrigger the effect and drop the old timer. */
  const [epoch, setEpoch] = useState(0);

  const reducedMotion = usePrefersReducedMotion();
  const documentHidden = useDocumentHidden();

  const lengthRef = useRef(length);
  lengthRef.current = length;

  /**
   * Clamped during render, never with a corrective setState in an effect —
   * `react-hooks/set-state-in-effect` is an error in this project, and the
   * effect version would also render one frame of a stale index first.
   */
  const safeIndex = index < length ? index : 0;

  const indexRef = useRef(safeIndex);
  indexRef.current = safeIndex;

  const goTo = useCallback((i: number) => {
    const count = lengthRef.current;
    if (count < 1) return;
    setIndex(((i % count) + count) % count);
    setEpoch((e) => e + 1);
  }, []);

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  const frozen = paused || reducedMotion || documentHidden || length < 2;

  useEffect(() => {
    if (frozen) return;

    let interval: ReturnType<typeof setInterval> | undefined;
    const advance = () => setIndex((i) => (i + 1) % lengthRef.current);

    const start = () => {
      advance();
      interval = setInterval(advance, intervalMs);
    };

    // The offset applies to the first advance only; afterwards the interval
    // carries the rhythm. A seek re-arms the offset, which is what makes a
    // manually-advanced slide hold for its full duration.
    const lead = setTimeout(start, intervalMs + offsetMs);

    return () => {
      clearTimeout(lead);
      if (interval) clearInterval(interval);
    };
  }, [frozen, intervalMs, offsetMs, epoch]);

  return { index: safeIndex, goTo, next, prev };
}
```

- [ ] **Step 4: Run tests, typecheck and lint**

Run: `npm test && npm run typecheck && npm run lint`
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/useSlideshow.ts src/lib/useSlideshow.test.ts
git commit -m "feat: add shared useSlideshow timing hook"
```

---

### Task 3: The Crossfade renderer

**Files:**
- Create: `src/components/Crossfade/Crossfade.tsx`, `Crossfade.module.css`, `index.ts`
- Modify: `src/components/index.ts`

**Interfaces:**
- Consumes: nothing (pure presentational)
- Produces:
  ```ts
  type CrossfadeSlide = { src: string; webp: string; alt: string };
  function Crossfade(props: {
    slides: readonly CrossfadeSlide[];
    index: number;
    className?: string;
    priority?: boolean;   // hero only — first slide gets fetchPriority="high"
    sizes?: string;
  }): JSX.Element;
  ```

- [ ] **Step 1: Write the component**

`src/components/Crossfade/Crossfade.tsx`:

```tsx
import styles from './Crossfade.module.css';

export type CrossfadeSlide = {
  src: string;
  webp: string;
  alt: string;
};

export type CrossfadeProps = {
  slides: readonly CrossfadeSlide[];
  index: number;
  className?: string;
  /** Hero only. Gives slide 0 high fetch priority and eager loading. */
  priority?: boolean;
  sizes?: string;
};

/**
 * Opacity-only slide stack.
 *
 * Knows nothing about timing — the caller owns that via useSlideshow. Every
 * slide stays mounted so the browser keeps decoded frames and the fade has
 * something to fade to; only slide 0 is ever eager.
 *
 * The whole stack is aria-hidden: callers always render a real text label
 * beside it, and announcing a photo rotation would be noise.
 */
export function Crossfade({
  slides,
  index,
  className,
  priority = false,
  sizes = '100vw',
}: CrossfadeProps) {
  return (
    <div
      className={[styles.stack, className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      {slides.map((slide, i) => (
        <picture key={slide.src} data-active={i === index ? '' : undefined}>
          <source srcSet={slide.webp} type="image/webp" sizes={sizes} />
          <img
            src={slide.src}
            alt=""
            sizes={sizes}
            loading={priority && i === 0 ? 'eager' : 'lazy'}
            fetchPriority={priority && i === 0 ? 'high' : 'low'}
            decoding={priority && i === 0 ? 'sync' : 'async'}
          />
        </picture>
      ))}
    </div>
  );
}
```

`src/components/Crossfade/Crossfade.module.css`:

```css
.stack {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.stack picture {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity var(--dur-cine) var(--ease-in-out);
}

.stack picture[data-active] {
  opacity: 1;
}

.stack img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

@media (prefers-reduced-motion: reduce) {
  .stack picture {
    transition: none;
  }
}
```

`src/components/Crossfade/index.ts`:

```ts
export { Crossfade } from './Crossfade';
export type { CrossfadeProps, CrossfadeSlide } from './Crossfade';
```

- [ ] **Step 2: Export from the barrel**

Add to `src/components/index.ts`, matching the existing export style in that file:

```ts
export { Crossfade } from './Crossfade';
```

- [ ] **Step 3: Verify**

Run: `npm run typecheck && npm run lint`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/Crossfade src/components/index.ts
git commit -m "feat: add Crossfade slide renderer"
```

---

### Task 4: Curate and process the photography

**Files:**
- Create: `scripts/build-home-media.mjs`, `src/data/home-media.ts`
- Modify: `package.json`
- Output: `public/assets/home/**`

**Interfaces:**
- Consumes: nothing
- Produces: `HERO_SLIDES`, `CAMPUS_TOUR`, `CARD_SETS`, types `MediaSlide`, `CardKey`

**Background the implementer needs:**

`source-assets/images` holds 585 real CAS photographs with content-hashed filenames that
carry no meaning. `research/cas-asset-inventory.csv` maps each `local_path` back to its
original `url`, and the URL directory is the only topic signal — e.g.
`campustour/img/robolab/*` is the robotics lab. Bucket counts are already known:

```
campustour/img/{robolab,nanolab,materiallab,cyberlab,automationlab,library,classroom,commonroom,corridor,…}  4 each
images/equip 49 · images/innov 32 · images/media 76 · images/nano 12 · images/ai 8
images/devices 7 · images/nanoenergy 7 · images/cybercity 4 · images/python 8
images/workshop23 8 · images/seminar 8 · home1/doc/gallery 8 · img 6 · campustour/img 5
```

**`convert` on this machine is Windows' filesystem tool, not ImageMagick.** Use `sharp`.

- [ ] **Step 1: Install sharp**

```bash
npm install -D sharp
```

- [ ] **Step 2: Shortlist candidates by bucket**

Run this to print the local paths for the buckets you need:

```bash
node -e "
const fs=require('fs');
const rows=fs.readFileSync('research/cas-asset-inventory.csv','utf8').split(/\r?\n/).slice(1);
const want=process.argv[1];
for(const line of rows){
  const c=line.split(',');
  if(c[1]!=='image'||c[4]!=='200'||!c[7])continue;
  const p=c[0].replace('https://cas.res.in/','');
  if(p.startsWith(want)) console.log(c[7], c[6]);
}" "campustour/img/robolab"
```

Repeat per bucket. Then **look at the candidates** with the Read tool before choosing —
filenames are hashes, so selection must be visual.

Selection criteria: landscape orientation; ≥1600px wide for hero candidates; no burnt-in
text, watermarks or date stamps; no identifiable face dominating the foreground where a
wider shot of the same room serves equally.

- [ ] **Step 3: Record the chosen files**

Create `scripts/build-home-media.mjs` with the selections hardcoded at the top. Replace
each `PUT_CHOSEN_FILE_HERE` with a real path from Step 2 — the counts below are fixed
(4 hero, 4 campus, 5 per card = 33 total):

```js
import { mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';

import sharp from 'sharp';

const SRC = 'source-assets/images';
const OUT = 'public/assets/home';

/** file: path under source-assets/images · alt: written by hand, never a filename */
const SETS = {
  hero: {
    width: 2400,
    items: [
      { file: 'PUT_CHOSEN_FILE_HERE', alt: 'The Centre for Advanced Studies building on the AKTU campus at dusk' },
      { file: 'PUT_CHOSEN_FILE_HERE', alt: 'Aerial view of the AKTU campus and the CAS block' },
      { file: 'PUT_CHOSEN_FILE_HERE', alt: 'Researcher operating instrumentation in a CAS laboratory' },
      { file: 'PUT_CHOSEN_FILE_HERE', alt: 'Robotic arm in the CAS automation laboratory' },
    ],
  },
  campus: {
    width: 600,
    items: [
      { file: 'PUT_CHOSEN_FILE_HERE', alt: 'Reading area of the CAS library' },
      { file: 'PUT_CHOSEN_FILE_HERE', alt: 'A CAS lecture classroom' },
      { file: 'PUT_CHOSEN_FILE_HERE', alt: 'The student common room at CAS' },
      { file: 'PUT_CHOSEN_FILE_HERE', alt: 'Corridor linking the CAS teaching blocks' },
    ],
  },
  labs: { width: 800, items: [/* 5 items: robolab, nanolab, materiallab, cyberlab, automationlab */] },
  programs: { width: 800, items: [/* 5 items from images/python, workshop23, seminar */] },
  areas: { width: 800, items: [/* 5 items from images/nano, ai, devices, nanoenergy, cybercity */] },
  innovations: { width: 800, items: [/* 5 items from images/innov */] },
  life: { width: 800, items: [/* 5 items from images/media */] },
};

await rm(OUT, { recursive: true, force: true });

const manifest = {};

for (const [set, { width, items }] of Object.entries(SETS)) {
  await mkdir(path.join(OUT, set), { recursive: true });
  manifest[set] = [];

  for (const [i, { file, alt }] of items.entries()) {
    const name = `${set}-${String(i + 1).padStart(2, '0')}`;
    const input = path.join(SRC, file);
    const base = sharp(input).resize({ width, withoutEnlargement: true });

    await base.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(OUT, set, `${name}.jpg`));
    await base.clone().webp({ quality: 78 }).toFile(path.join(OUT, set, `${name}.webp`));

    manifest[set].push({ src: `/assets/home/${set}/${name}.jpg`, webp: `/assets/home/${set}/${name}.webp`, alt });
  }
}

console.log(JSON.stringify(manifest, null, 2));
```

Add to `package.json` scripts:

```json
"media": "node scripts/build-home-media.mjs"
```

- [ ] **Step 4: Run it and check the output weight**

```bash
npm run media
du -sh public/assets/home
```

Expected: 33 jpg + 33 webp pairs. If the directory exceeds ~4 MB total, lower the JPEG
quality to 78 and re-run — the hero is the only large image and the rest are 800px.

- [ ] **Step 5: Write the typed manifest**

Paste the script's JSON output into `src/data/home-media.ts` as typed constants:

```ts
import type { CrossfadeSlide } from '~/components/Crossfade';

export type MediaSlide = CrossfadeSlide;

export type CardKey = 'labs' | 'programs' | 'areas' | 'innovations' | 'life';

/** Four slides, 3s each. Slide 0 is the LCP image. */
export const HERO_SLIDES: readonly MediaSlide[] = [
  // paste hero entries
];

/** Static grid — no rotation. */
export const CAMPUS_TOUR: readonly MediaSlide[] = [
  // paste campus entries
];

/** Five slides per tile, 5s each, staggered 800ms apart by CardStrip. */
export const CARD_SETS: Record<CardKey, readonly MediaSlide[]> = {
  labs: [],
  programs: [],
  areas: [],
  innovations: [],
  life: [],
};
```

- [ ] **Step 6: Verify and commit**

Run: `npm run typecheck && npm run lint`

```bash
git add package.json package-lock.json scripts/build-home-media.mjs src/data/home-media.ts public/assets/home
git commit -m "feat: curate and process home page photography"
```

---

### Task 5: Header — nine-item nav, search pill, theme pill

**Files:**
- Create: `src/components/CommandPalette/paletteStore.ts`
- Modify: `src/components/CommandPalette/CommandPalette.tsx`, `src/components/Header/Header.tsx`, `src/components/Header/Header.module.css`, `src/components/ThemeToggle/ThemeToggle.tsx`, `src/components/ThemeToggle/ThemeToggle.module.css`

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces: `openCommandPalette()`, `closeCommandPalette()`, `useCommandPaletteOpen()`

**Why the store:** `CommandPalette` currently owns `isOpen` in local state (line 19) and
takes no props, so the header cannot open it. Rather than lift state into `root.tsx` and
prop-drill, a three-function module store lets any component open it from anywhere.

**This task also clears the repo's one pre-existing lint error.**
`Header.tsx:35` calls `setHasScrolled(false)` synchronously inside a `useEffect` body,
which `react-hooks/set-state-in-effect` rejects. Replace the whole
`hasScrolled` useState + useEffect block with a `useSyncExternalStore` over the scroll
event, matching the pattern used in `src/lib/useSlideshow.ts`:

```tsx
const SCROLL_THRESHOLD = 56;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}

function useHasScrolled(active: boolean): boolean {
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > SCROLL_THRESHOLD,
    () => false,
  );
  return active && scrolled;
}
```

Call it as `const hasScrolled = useHasScrolled(isHome);` — the hook must be called
unconditionally, so the `isHome` gate lives inside it, not around it. After this task
`npm run lint` must report zero problems.

- [ ] **Step 1: Create the store**

`src/components/CommandPalette/paletteStore.ts`:

```ts
import { useSyncExternalStore } from 'react';

let open = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function openCommandPalette() {
  if (open) return;
  open = true;
  emit();
}

export function closeCommandPalette() {
  if (!open) return;
  open = false;
  emit();
}

export function toggleCommandPalette() {
  open = !open;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCommandPaletteOpen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => open,
    () => false,
  );
}
```

- [ ] **Step 2: Point CommandPalette at the store**

In `CommandPalette.tsx`, delete the `const [isOpen, setIsOpen] = useState(false);` on
line 19 and replace every use:

```tsx
const isOpen = useCommandPaletteOpen();
```

- `setIsOpen((prev) => !prev)` in the keyboard handler → `toggleCommandPalette()`
- every `setIsOpen(false)` → `closeCommandPalette()`

Import from `./paletteStore`. Leave `query` and `selectedIndex` as local state — they are
genuinely internal.

- [ ] **Step 3: Rewrite the nav list and utility cluster**

In `Header.tsx`, replace the `NAV` constant:

```tsx
const NAV = [
  { to: '/about', label: 'About' },
  { to: '/academics', label: 'Academics' },
  { to: '/research', label: 'Research' },
  { to: '/people', label: 'People' },
  { to: '/research/facilities', label: 'Facilities' },
  { to: '/research/publications', label: 'Publications' },
  { to: '/updates', label: 'Updates' },
  { to: '/documents', label: 'Documents' },
  { to: '/contact', label: 'Contact' },
];
```

Replace the `navUtility` div with the cas1 pill cluster:

```tsx
<div className={styles.navUtility}>
  <button
    type="button"
    className={styles.searchPill}
    onClick={openCommandPalette}
    aria-label="Search the site"
  >
    <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16"
         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
    <span>Search…</span>
  </button>
  <ThemeToggle />
</div>
```

Update the identity block's `brandSub` for the CAS side to match cas3's wording exactly:
`Research. Innovation. Excellence.` (full stops, not middot separators).

- [ ] **Step 4: Style the pills**

Append to `Header.module.css`. No `backdrop-filter` — the global constraint forbids it,
and over the hero these sit on the scrim already:

```css
.searchPill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  height: 34px;
  padding: 0 var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-full);
  background: var(--surface);
  color: var(--text-tertiary);
  font: inherit;
  font-size: var(--text-sm);
  cursor: pointer;
  transition:
    border-color var(--dur-fast) var(--ease-out),
    color var(--dur-fast) var(--ease-out);
}

.searchPill:hover {
  border-color: var(--border-strong);
  color: var(--text-secondary);
}

.home:not(.scrolled) .searchPill {
  border-color: rgb(255 255 255 / 0.32);
  background: rgb(255 255 255 / 0.12);
  color: rgb(255 255 255 / 0.86);
}

.home:not(.scrolled) .searchPill:hover {
  border-color: rgb(255 255 255 / 0.55);
  color: #fff;
}
```

- [ ] **Step 5: Make ThemeToggle a matching pill**

In `ThemeToggle.module.css`, change `.toggle` to `height: 34px; min-width: 34px;
border-radius: var(--radius-full);` with the same border and background tokens as
`.searchPill`. Keep the existing three-state cycle and `aria-label` logic in
`ThemeToggle.tsx` untouched — only the shape changes.

- [ ] **Step 6: Verify in the browser**

```bash
npm run typecheck && npm run lint && npm run dev
```

Using chrome-devtools MCP on `http://localhost:5173/`: confirm nine nav items, the search
pill opens the palette, Ctrl+K still opens it, Escape closes it, the theme pill cycles
light → dark → system, and the header renders correctly on `/about` (interior variant).

- [ ] **Step 7: Commit**

```bash
git add src/components/CommandPalette src/components/Header src/components/ThemeToggle
git commit -m "feat: rebuild header nav with search and theme pills"
```

---

### Task 6: Hero

**Files:**
- Create: `src/components/home/Hero.tsx`, `src/components/home/Hero.module.css`
- Modify: `src/routes/home.tsx`

**Interfaces:**
- Consumes: `useSlideshow`, `Crossfade`, `HERO_SLIDES`
- Produces: `<Hero />`, no props

- [ ] **Step 1: Write the component**

`src/components/home/Hero.tsx`:

```tsx
import { Link } from 'react-router';

import { Container, Crossfade } from '~/components';
import { HERO_SLIDES } from '~/data/home-media';
import { useSlideshow } from '~/lib/useSlideshow';
import styles from './Hero.module.css';

export function Hero() {
  const { index, goTo, next, prev } = useSlideshow(HERO_SLIDES.length, {
    intervalMs: 3000,
  });

  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <Crossfade slides={HERO_SLIDES} index={index} priority sizes="100vw" />
      <div className={styles.scrim} aria-hidden="true" />

      <Container width="wide" className={styles.inner}>
        <div className={styles.content}>
          <h1 id="home-title" className={styles.title}>
            Centre for
            <br />
            Advanced Studies
          </h1>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.lede}>
            An in-campus research institute driving excellence in advanced
            research, innovation and emerging technologies.
          </p>
          <Link to="/about" className={styles.cta}>
            Explore CAS <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.controls}>
          <div className={styles.counters}>
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goTo(i)}
                className={styles.counter}
                data-active={i === index ? '' : undefined}
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
          <div className={styles.arrows}>
            <button type="button" onClick={prev} aria-label="Previous slide">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={next} aria-label="Next slide">
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Write the styles**

`src/components/home/Hero.module.css`. The scrim is the one permitted gradient — its job
is 4.5:1 contrast for the headline, nothing decorative:

```css
.hero {
  position: relative;
  min-height: clamp(30rem, 78vh, 46rem);
  display: flex;
  isolation: isolate;
  background: var(--ink);
}

.scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    96deg,
    rgb(8 9 26 / 0.86) 0%,
    rgb(8 9 26 / 0.62) 46%,
    rgb(8 9 26 / 0.28) 100%
  );
}

.inner {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: var(--space-12);
  padding-block: var(--space-24) var(--space-10);
  width: 100%;
}

.content {
  max-width: 34rem;
}

.title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: var(--weight-normal);
  font-size: var(--text-5xl);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: #fff;
}

.rule {
  display: block;
  width: 3.5rem;
  height: 2px;
  margin-block: var(--space-6);
  background: rgb(255 255 255 / 0.7);
}

.lede {
  margin: 0;
  max-width: 26rem;
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  color: rgb(255 255 255 / 0.88);
}

.cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-8);
  padding-bottom: 2px;
  border-bottom: 1px solid rgb(255 255 255 / 0.45);
  color: #fff;
  font-size: var(--text-sm);
  text-decoration: none;
  transition: border-color var(--dur-fast) var(--ease-out);
}

.cta:hover {
  border-color: #fff;
}

.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.counters {
  display: flex;
  gap: var(--space-6);
}

.counter {
  padding: 0 0 var(--space-1);
  border: 0;
  border-bottom: 1px solid transparent;
  background: none;
  color: rgb(255 255 255 / 0.55);
  font: inherit;
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
  cursor: pointer;
}

.counter[data-active] {
  border-bottom-color: #fff;
  color: #fff;
}

.arrows {
  display: flex;
  gap: var(--space-3);
}

.arrows button {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 0.38);
  border-radius: var(--radius-full);
  background: none;
  color: #fff;
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease-out);
}

.arrows button:hover {
  border-color: #fff;
}

@media (max-width: 640px) {
  .title {
    font-size: var(--text-4xl);
  }
  .controls {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-6);
  }
}
```

- [ ] **Step 3: Swap it into the route**

In `src/routes/home.tsx`, delete the existing `<section className={styles.hero}>` block
(lines 86–122) and render `<Hero />` in its place. Keep the `meta()` export and the
loader calls for now — later tasks consume them.

- [ ] **Step 4: Verify**

Run: `npm run typecheck && npm run lint`, then in the browser confirm the slide advances
every 3s, the counter underline tracks it, arrows and numbers both seek and reset the
timer, and reduced-motion emulation freezes it on slide 1.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/Hero.tsx src/components/home/Hero.module.css src/routes/home.tsx
git commit -m "feat: add minimal hero with 3s background slideshow"
```

---

### Task 7: Campus band and the Admissions rail

**Files:**
- Create: `src/components/AdmissionsRail/AdmissionsRail.tsx`, `.module.css`, `index.ts`; `src/components/home/CampusBand.tsx`, `.module.css`
- Modify: `src/routes/home.tsx`, `src/components/index.ts`

**Interfaces:**
- Consumes: `useAdmissionsSeason`, `CAMPUS_TOUR`, `getNotices` from `~/data/loaders`
- Produces: `<CampusBand />`, `<AdmissionsRail />` (returns `null` when out of season or empty)

**Data shape** (`src/data/collections/notices.json`, 6 records, 3 of type `Admission`):

```ts
{ slug, title, notice_type, audience, session, status, summary, document_slug }
```

- [ ] **Step 1: Write the rail**

`src/components/AdmissionsRail/AdmissionsRail.tsx`:

```tsx
import { Link } from 'react-router';

import { getNotices } from '~/data/loaders';
import { useAdmissionsSeason } from '~/lib/admissions';
import styles from './AdmissionsRail.module.css';

/**
 * Admission notices, shown only during the July–September intake.
 *
 * Two independent gates. The season gate is client-only because the site is
 * prerendered (see useAdmissionsSeason). The data gate means an open window
 * with no live notices renders nothing at all rather than an empty shell —
 * we never invent admission content.
 */
export function AdmissionsRail() {
  const inSeason = useAdmissionsSeason();
  const notices = getNotices().filter(
    (notice) => notice.notice_type === 'Admission' && notice.status === 'Open',
  );

  if (!inSeason || notices.length === 0) return null;

  return (
    <aside className={styles.rail} aria-labelledby="admissions-title">
      <p className={styles.eyebrow}>Admissions open</p>
      <h3 id="admissions-title" className={styles.title}>
        Applying to CAS
      </h3>

      <ul className={styles.list}>
        {notices.map((notice) => (
          <li key={notice.slug}>
            <Link to={`/updates/notices/${notice.slug}`}>
              <span className={styles.noticeTitle}>{notice.title}</span>
              <span className={styles.noticeMeta}>
                {notice.session ? `Session ${notice.session}` : notice.audience}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Link to="/admissions" className={styles.all}>
        All admission information <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
```

`index.ts`:

```ts
export { AdmissionsRail } from './AdmissionsRail';
```

- [ ] **Step 2: Style the rail**

`AdmissionsRail.module.css` — flat, hairline-ruled, no panel or shadow:

```css
.rail {
  border-left: 1px solid var(--border);
  padding-left: var(--space-8);
}

.eyebrow {
  margin: 0 0 var(--space-2);
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--accent);
}

.title {
  margin: 0 0 var(--space-6);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--weight-normal);
  color: var(--text);
}

.list {
  margin: 0 0 var(--space-6);
  padding: 0;
  list-style: none;
}

.list li + li {
  border-top: 1px solid var(--rule);
}

.list a {
  display: block;
  padding: var(--space-3) 0;
  text-decoration: none;
}

.noticeTitle {
  display: block;
  font-size: var(--text-sm);
  line-height: var(--leading-snug);
  color: var(--text);
}

.list a:hover .noticeTitle {
  color: var(--brand);
}

.noticeMeta {
  display: block;
  margin-top: var(--space-1);
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

.all {
  font-size: var(--text-sm);
  color: var(--brand);
  text-decoration: none;
}

.all:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .rail {
    border-left: 0;
    border-top: 1px solid var(--border);
    padding-left: 0;
    padding-top: var(--space-8);
  }
}
```

- [ ] **Step 3: Write the band**

`src/components/home/CampusBand.tsx`. The grid is `1fr` when the rail returns `null`,
which is why the rail's presence is computed here as well as inside it:

```tsx
import { Link } from 'react-router';

import { AdmissionsRail, Container } from '~/components';
import { CAMPUS_TOUR } from '~/data/home-media';
import styles from './CampusBand.module.css';

export function CampusBand() {
  return (
    <section className={styles.band} aria-labelledby="campus-title">
      <Container width="wide" className={styles.grid}>
        <div className={styles.campus}>
          <h2 id="campus-title" className={styles.title}>
            Explore campus
          </h2>
          <p className={styles.lede}>
            Teaching blocks, specialist laboratories and study spaces across the
            CAS campus at AKTU, Lucknow.
          </p>

          <ul className={styles.tour}>
            {CAMPUS_TOUR.map((image) => (
              <li key={image.src}>
                <picture>
                  <source srcSet={image.webp} type="image/webp" />
                  <img src={image.src} alt={image.alt} loading="lazy" />
                </picture>
              </li>
            ))}
          </ul>

          <Link to="/campus" className={styles.link}>
            Take the campus tour <span aria-hidden="true">→</span>
          </Link>
        </div>

        <AdmissionsRail />
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Style the band**

`CampusBand.module.css`:

```css
.band {
  padding-block: var(--section-y);
  background: var(--bg);
  border-bottom: 1px solid var(--rule);
}

/* auto collapses to a single column when AdmissionsRail renders null. */
.grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: clamp(var(--space-8), 4vw, var(--space-16));
  align-items: start;
}

.title {
  margin: 0 0 var(--space-2);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--weight-normal);
  color: var(--text);
}

.lede {
  margin: 0 0 var(--space-8);
  max-width: 46ch;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.tour {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin: 0 0 var(--space-6);
  padding: 0;
  list-style: none;
}

.tour img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  display: block;
  border-radius: var(--radius-sm);
}

.link {
  font-size: var(--text-sm);
  color: var(--brand);
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 560px) {
  .tour {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

- [ ] **Step 5: Mount it and export**

Add `export { AdmissionsRail } from './AdmissionsRail';` to `src/components/index.ts`.
In `home.tsx`, render `<CampusBand />` immediately after `<Hero />`.

- [ ] **Step 6: Verify both states**

Run: `npm run typecheck && npm run lint && npm test`

In the browser: the rail is visible today (August, three open notices). Then temporarily
change `isAdmissionsSeason` to `return false;`, confirm Explore Campus goes full width
with no layout hole, and **revert the change**.

- [ ] **Step 7: Commit**

```bash
git add src/components/AdmissionsRail src/components/home/CampusBand.tsx src/components/home/CampusBand.module.css src/components/index.ts src/routes/home.tsx
git commit -m "feat: add campus band with seasonal admissions rail"
```

---

### Task 8: Card strip

**Files:**
- Create: `src/components/home/CardStrip.tsx`, `.module.css`
- Modify: `src/routes/home.tsx`

**Interfaces:**
- Consumes: `useSlideshow`, `Crossfade`, `CARD_SETS`, `CardKey`
- Produces: `<CardStrip />`

- [ ] **Step 1: Write the tile and strip**

`src/components/home/CardStrip.tsx`. Each tile owns its own hook call — that is what
makes the stagger and the per-tile hover pause possible:

```tsx
import { useState } from 'react';
import { Link } from 'react-router';

import { Crossfade } from '~/components';
import { CARD_SETS, type CardKey } from '~/data/home-media';
import { useSlideshow } from '~/lib/useSlideshow';
import styles from './CardStrip.module.css';

type Card = { key: CardKey; title: string; detail: string; href: string };

const CARDS: readonly Card[] = [
  { key: 'labs', title: 'Research Labs', detail: 'State-of-the-art labs empowering discoveries', href: '/research/facilities' },
  { key: 'programs', title: 'Academic Programs', detail: 'Interdisciplinary programs for future leaders', href: '/academics' },
  { key: 'areas', title: 'Research Areas', detail: 'Exploring frontiers of knowledge', href: '/research' },
  { key: 'innovations', title: 'Innovations', detail: 'Ideas transforming into impactful solutions', href: '/research/patents' },
  { key: 'life', title: 'Campus Life', detail: 'A vibrant community of curious minds', href: '/campus' },
];

/** 800ms apart so the five tiles never flip in unison. */
const STAGGER_MS = 800;

function Tile({ card, offsetMs }: { card: Card; offsetMs: number }) {
  const [paused, setPaused] = useState(false);
  const slides = CARD_SETS[card.key];
  const { index } = useSlideshow(slides.length, {
    intervalMs: 5000,
    offsetMs,
    paused,
  });

  return (
    <Link
      to={card.href}
      className={styles.tile}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Crossfade slides={slides} index={index} sizes="(max-width: 900px) 50vw, 20vw" />
      <span className={styles.scrim} aria-hidden="true" />
      <span className={styles.body}>
        <span className={styles.title}>{card.title}</span>
        <span className={styles.detail}>{card.detail}</span>
      </span>
      <span className={styles.arrow} aria-hidden="true">→</span>
    </Link>
  );
}

export function CardStrip() {
  return (
    <section className={styles.strip} aria-label="Explore the centre">
      {CARDS.map((card, i) => (
        <Tile key={card.key} card={card} offsetMs={i * STAGGER_MS} />
      ))}
    </section>
  );
}
```

- [ ] **Step 2: Style it**

`CardStrip.module.css` — full-bleed photo tiles, no card chrome:

```css
.strip {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--bg);
}

.tile {
  position: relative;
  display: block;
  aspect-ratio: 16 / 11;
  overflow: hidden;
  border-radius: var(--radius-sm);
  isolation: isolate;
  text-decoration: none;
  background: var(--ink);
}

.scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgb(8 9 26 / 0) 40%,
    rgb(8 9 26 / 0.78) 100%
  );
}

.body {
  position: absolute;
  inset-inline: var(--space-5);
  bottom: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.title {
  font-size: var(--text-base);
  font-weight: var(--weight-semibold);
  color: #fff;
}

.detail {
  font-size: var(--text-xs);
  line-height: var(--leading-snug);
  color: rgb(255 255 255 / 0.82);
}

.arrow {
  position: absolute;
  right: var(--space-5);
  bottom: var(--space-5);
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 0.5);
  border-radius: var(--radius-full);
  color: #fff;
  font-size: var(--text-sm);
  transition: background-color var(--dur-fast) var(--ease-out);
}

.tile:hover .arrow,
.tile:focus-visible .arrow {
  background: rgb(255 255 255 / 0.18);
}

@media (max-width: 900px) {
  .strip {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 520px) {
  .strip {
    grid-template-columns: 1fr;
  }
}
```

Note: `.body` and `.arrow` overlap at narrow widths. Give `.body` a
`padding-right: 2.75rem;` so the detail text clears the arrow.

- [ ] **Step 3: Mount and verify**

Render `<CardStrip />` after `<CampusBand />` in `home.tsx`.

Run: `npm run typecheck && npm run lint`. In the browser confirm five tiles rotate at 5s,
visibly out of phase, hovering one pauses only that tile, and tabbing to a tile pauses it.

- [ ] **Step 4: Commit**

```bash
git add src/components/home/CardStrip.tsx src/components/home/CardStrip.module.css src/routes/home.tsx
git commit -m "feat: add rotating card strip with staggered timing"
```

---

### Task 9: Stats band and info row

**Files:**
- Create: `src/components/home/StatsBand.tsx`, `.module.css`, `src/components/home/InfoRow.tsx`, `.module.css`, `src/components/home/index.ts`
- Modify: `src/routes/home.tsx`, `src/routes/home.module.css`

**Interfaces:**
- Consumes: loaders `getPrograms`, `getFaculty`, `getEquipment`, `getPublications`, `getProjects`, `getEvents`, `getNotices`
- Produces: `<StatsBand />`, `<InfoRow />`

- [ ] **Step 1: Write StatsBand**

Counts come from the loaders and currently resolve to 9 / 13 / 48 / 16 / 9 / 42, which is
exactly what cas3 shows — the reference numbers came from this dataset. Never hardcode them.

```tsx
import { Container } from '~/components';
import {
  getEquipment,
  getEvents,
  getFaculty,
  getProjects,
  getPrograms,
  getPublications,
} from '~/data/loaders';
import styles from './StatsBand.module.css';

export function StatsBand() {
  const stats = [
    { value: getPrograms().length, label: 'Academic Programmes' },
    { value: getFaculty().length, label: 'Faculty Members' },
    { value: getEquipment().length, label: 'Research Facilities' },
    { value: getPublications().length, label: 'Publications' },
    { value: getProjects().length, label: 'Funded Projects' },
    { value: getEvents().length, label: 'Events & Workshops' },
  ];

  return (
    <section className={styles.band} aria-label="The centre in numbers">
      <Container width="wide" className={styles.row}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </Container>
    </section>
  );
}
```

`StatsBand.module.css`:

```css
.band {
  padding-block: var(--section-y-tight);
  background: var(--bg-subtle);
  border-block: 1px solid var(--rule);
}

.row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: var(--space-4);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding-left: var(--space-5);
  border-left: 1px solid var(--border);
}

.stat:first-child {
  padding-left: 0;
  border-left: 0;
}

.stat strong {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--weight-normal);
  color: var(--text);
  font-variant-numeric: tabular-nums;
}

.stat span {
  font-size: var(--text-xs);
  color: var(--text-tertiary);
}

@media (max-width: 900px) {
  .row {
    grid-template-columns: repeat(3, 1fr);
    row-gap: var(--space-6);
  }
  .stat:nth-child(3n + 1) {
    padding-left: 0;
    border-left: 0;
  }
}

@media (max-width: 520px) {
  .row {
    grid-template-columns: repeat(2, 1fr);
  }
  .stat:nth-child(3n + 1) {
    padding-left: var(--space-5);
    border-left: 1px solid var(--border);
  }
  .stat:nth-child(2n + 1) {
    padding-left: 0;
    border-left: 0;
  }
}
```

- [ ] **Step 2: Write InfoRow**

Five columns, flat per the spec's resolved tension — cas3's structure with cas2's
rendering. Quick Links carries Admissions and Campus, which is what keeps the two routes
dropped from the nav discoverable.

```tsx
import { Link } from 'react-router';

import { Container } from '~/components';
import { getEvents, getNotices } from '~/data/loaders';
import styles from './InfoRow.module.css';

const QUICK_LINKS = [
  { to: '/admissions', label: 'Admissions' },
  { to: '/campus', label: 'Campus' },
  { to: '/documents', label: 'Forms & Downloads' },
  { to: '/people/faculty', label: 'Faculty Directory' },
  { to: '/contact', label: 'Contact Directory' },
];

export function InfoRow() {
  const notices = getNotices().filter((notice) => notice.status === 'Open');
  const events = getEvents().slice(0, 3);

  return (
    <section className={styles.row} aria-label="News, events and notices">
      <Container width="wide" className={styles.grid}>
        <div className={styles.col}>
          <h2 className={styles.heading}>About CAS</h2>
          <p className={styles.text}>
            The Centre for Advanced Studies at AKTU fosters cutting-edge
            research, interdisciplinary collaboration and innovation for
            societal impact.
          </p>
          <Link to="/about" className={styles.more}>
            Know more <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.col}>
          <h2 className={styles.heading}>Latest News</h2>
          <ul className={styles.list}>
            {notices.slice(0, 3).map((notice) => (
              <li key={notice.slug}>
                <Link to={`/updates/notices/${notice.slug}`}>{notice.title}</Link>
              </li>
            ))}
          </ul>
          <Link to="/updates" className={styles.more}>
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.col}>
          <h2 className={styles.heading}>Upcoming Events</h2>
          <ul className={styles.list}>
            {events.map((event) => (
              <li key={event.id}>
                <Link to={`/updates/events/${event.id}`}>{event.title}</Link>
              </li>
            ))}
          </ul>
          <Link to="/updates/events" className={styles.more}>
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.col}>
          <h2 className={styles.heading}>Notices</h2>
          <ul className={styles.list}>
            {notices.slice(0, 4).map((notice) => (
              <li key={notice.slug}>
                <Link to={`/updates/notices/${notice.slug}`}>{notice.title}</Link>
              </li>
            ))}
          </ul>
          <Link to="/updates/notices" className={styles.more}>
            View all <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.col}>
          <h2 className={styles.heading}>Quick Links</h2>
          <ul className={styles.list}>
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
```

> Check `getEvents()`'s return type in `src/data/schema.ts` before writing this — if the
> identifier is not `id`, use whatever `getEvent(id)` keys on and adjust the `key` and
> the link path to match.

`InfoRow.module.css`:

```css
.row {
  padding-block: var(--section-y);
  background: var(--bg);
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: clamp(var(--space-6), 2.5vw, var(--space-10));
}

.col + .col {
  padding-left: clamp(var(--space-6), 2.5vw, var(--space-10));
  border-left: 1px solid var(--rule);
}

.heading {
  margin: 0 0 var(--space-4);
  padding-bottom: var(--space-2);
  border-bottom: 2px solid var(--brand);
  display: inline-block;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--weight-normal);
  color: var(--text);
}

.text {
  margin: 0 0 var(--space-4);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  color: var(--text-secondary);
}

.list {
  margin: 0 0 var(--space-4);
  padding: 0;
  list-style: none;
}

.list li + li {
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--rule);
}

.list a {
  font-size: var(--text-sm);
  line-height: var(--leading-snug);
  color: var(--text);
  text-decoration: none;
}

.list a:hover {
  color: var(--brand);
}

.more {
  font-size: var(--text-xs);
  color: var(--brand);
  text-decoration: none;
}

.more:hover {
  text-decoration: underline;
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    row-gap: var(--space-10);
  }
  .col + .col {
    padding-left: 0;
    border-left: 0;
  }
  .col:nth-child(2n) {
    padding-left: var(--space-8);
    border-left: 1px solid var(--rule);
  }
}

@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .col:nth-child(2n) {
    padding-left: 0;
    border-left: 0;
  }
}
```

- [ ] **Step 3: Add the barrel and finish the route**

`src/components/home/index.ts`:

```ts
export { CampusBand } from './CampusBand';
export { CardStrip } from './CardStrip';
export { Hero } from './Hero';
export { InfoRow } from './InfoRow';
export { StatsBand } from './StatsBand';
```

`src/routes/home.tsx` becomes a thin composition — keep the existing `meta()` export
verbatim and delete every now-unused loader import and the `EXPLORE` constant:

```tsx
import { CampusBand, CardStrip, Hero, InfoRow, StatsBand } from '~/components/home';

// meta() unchanged

export default function Home() {
  return (
    <div data-home-page>
      <Hero />
      <CampusBand />
      <CardStrip />
      <StatsBand />
      <InfoRow />
    </div>
  );
}
```

Then delete the superseded rules from `src/routes/home.module.css` — everything for
`.hero*`, `.explore*`, `.card*`, `.snapshot*`, `.stat*`, `.researchFeature`, `.updates*`,
`.notice*`, `.quick*`. If nothing remains, delete the file and its import.

- [ ] **Step 4: Verify**

Run: `npm run typecheck && npm run lint && npm test`
Expected: clean. Lint will catch any loader import left unused.

- [ ] **Step 5: Commit**

```bash
git add src/components/home src/routes/home.tsx src/routes/home.module.css
git commit -m "feat: add stats band and info row, compose home route"
```

---

### Task 10: Full-page verification

**Files:** none created — fixes only

- [ ] **Step 1: Full gate**

```bash
npm test && npm run typecheck && npm run lint && npm run build
```

Expected: all pass, including `scripts/verify-urls.mjs` in the build. That script
validates internal links — a typo in any `to=` will fail here rather than in production.

- [ ] **Step 2: Browser QA**

`npm run dev`, then with chrome-devtools MCP on `http://localhost:5173/`:

- Hero advances every 3s; counters and arrows seek and reset the timer
- Five tiles rotate at 5s, visibly out of phase; hover and keyboard focus pause one tile only
- Admissions rail present (August, three open notices); Explore Campus always present
- Light, dark and system themes — no unreadable text, especially the header over the hero
- 1440 / 1024 / 390px widths — no horizontal scroll at any width
- Reduced-motion emulation freezes every slideshow at slide 0 while buttons still work
- `/about` renders with the new header and no layout break

- [ ] **Step 3: Console and network**

Check for console errors, hydration warnings (`useAdmissionsSeason` is the likely source
if any appear), and 404s on `/assets/home/**`.

- [ ] **Step 4: Lighthouse**

Run a Lighthouse audit on the home page. Performance should not regress against the
pre-change build. If LCP regressed, confirm only hero slide 0 is eager and every other
image is lazy.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "fix: address home UI verification findings"
```

---

## Self-Review

**Spec coverage** — every spec section maps to a task: header → 5; hero → 6; campus band
and seasonality → 1, 7; card strip → 8; stats → 9; info row and footer → 9; slideshow
engine → 2, 3; assets → 4; accessibility → distributed with a dedicated pass in 10;
verification → 10.

**Two deliberate deviations from the spec, both narrowing:**

1. The spec's asset table lists `images/equip` as a source bucket, but the five card sets
   are fully supplied by the other buckets. `equip` is unused in phase 1.
2. The spec lists the footer under "Info row and footer". `Footer.tsx` already exists at
   99 lines and matches cas3's structure closely enough; Task 10 verifies it rather than
   rewriting it. If browser QA shows it diverging from cas3, fix it there.

**Type consistency** — `MediaSlide` is an alias of `CrossfadeSlide` so the manifest feeds
`<Crossfade>` directly. `CardKey` is used identically in `home-media.ts` and
`CardStrip.tsx`. `useSlideshow` is called with the same option names at all six sites.
Two known snags are flagged inline for the implementer: the `indexRef` hoisting order in
Task 2, and confirming the event identifier in Task 9.
