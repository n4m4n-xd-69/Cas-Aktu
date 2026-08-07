import type { Transition, Variants } from 'motion/react';

/**
 * Shared motion configuration.
 *
 * Centralised so that Phase 7 work has one place to tune timing, and so every
 * animation inherits the reduced-motion contract instead of re-deciding it.
 * The current site already honours prefers-reduced-motion in app.js; the React
 * port must not regress that.
 *
 * Durations are seconds (Motion's unit), not milliseconds.
 */
export const transition = {
  /** UI feedback: hovers, presses, toggles. */
  fast: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
  /** Entrances and route transitions. */
  base: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  /** Physics-based, for anything that should feel grabbable. */
  spring: { type: 'spring', stiffness: 320, damping: 32, mass: 0.9 },
} satisfies Record<string, Transition>;

/**
 * Fade up. The default entrance for content that scrolls into view.
 *
 * RULE — never pass this as `initial` on a prerendered route's first paint.
 * The prerenderer serialises the `hidden` state into the static HTML, so the
 * page ships as `style="opacity:0"` and is blank for any visitor whose
 * JavaScript has not run. Verified during S1.
 *
 * Use it for client-side navigation and scroll reveal, where hydration has
 * already happened. On first paint use `initial={false}`, or gate the hidden
 * state behind the `js-on` class the way templates/_layout.html does.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: transition.base },
};
