import type { Transition, Variants } from 'motion/react';

/**
 * Shared motion configuration.
 *
 * Premium easing curves and timing for a polished, Apple-inspired feel.
 * Durations are seconds (Motion's unit).
 */

export const transition = {
  /** UI feedback: hovers, presses, toggles. */
  fast: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
  /** Entrances and route transitions. */
  base: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  /** Smooth, cinematic entrances. */
  smooth: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  /** Physics-based, for anything that should feel grabbable. */
  spring: { type: 'spring' as const, stiffness: 320, damping: 32, mass: 0.9 },
  /** Gentle spring for larger elements. */
  gentleSpring: { type: 'spring' as const, stiffness: 200, damping: 24, mass: 1 },
  /** Bouncy spring for playful interactions. */
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 20, mass: 0.8 },
} satisfies Record<string, Transition>;

/** Fade up — default entrance for content that scrolls into view. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transition.smooth },
};

/** Fade in — simple opacity entrance. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.smooth },
};

/** Scale up — for cards and interactive elements. */
export const scaleUp: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: transition.smooth },
};

/** Slide in from left. */
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: transition.smooth },
};

/** Slide in from right. */
export const slideRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: transition.smooth },
};

/** Stagger container — children animate in sequence. */
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Stagger item — each child fades up. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition.smooth,
  },
};

/** Hero text reveal — dramatic entrance. */
export const heroReveal: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      delay: i * 0.15,
    },
  }),
};

/** Card hover lift. */
export const cardHover = {
  rest: { y: 0, boxShadow: '0 1px 3px rgba(16,18,28,0.04), 0 6px 16px rgba(16,18,28,0.04)' },
  hover: {
    y: -6,
    boxShadow: '0 4px 12px rgba(16,18,28,0.06), 0 16px 40px rgba(16,18,28,0.08)',
    transition: transition.base,
  },
};

/** Magnetic button effect. */
export const magneticButton = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: transition.fast },
  tap: { scale: 0.97, transition: transition.fast },
};

/** Floating animation for decorative elements. */
export const float: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 6,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

/** Pulse glow for attention. */
export const pulseGlow: Variants = {
  initial: { opacity: 0.6, scale: 1 },
  animate: {
    opacity: [0.6, 1, 0.6],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity,
    },
  },
};

/** Page transition variants. */
export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3, ease: [0.4, 0, 1, 1] } },
};
