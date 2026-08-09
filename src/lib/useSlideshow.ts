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

  // Deviation from the brief: `ref.current = value` directly in the render
  // body (as the brief's listing has it) trips `react-hooks/refs`
  // ("Cannot update ref during render"), a second lint error the plan's
  // baseline does not allow. Syncing inside a deps-less effect is the
  // standard escape hatch — it still runs before the next paint, and
  // Testing Library's `act()` flushes it before assertions run, so it is
  // behaviorally identical for every case in the test file.
  const lengthRef = useRef(length);
  useEffect(() => {
    lengthRef.current = length;
  });

  /**
   * Clamped during render, never with a corrective setState in an effect —
   * `react-hooks/set-state-in-effect` is an error in this project, and the
   * effect version would also render one frame of a stale index first.
   */
  const safeIndex = index < length ? index : 0;

  const indexRef = useRef(safeIndex);
  useEffect(() => {
    indexRef.current = safeIndex;
  });

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
