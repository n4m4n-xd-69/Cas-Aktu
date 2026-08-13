import type { ReactNode } from 'react';

import styles from './Chip.module.css';

export type ChipProps = {
  children: ReactNode;
  /** When provided the chip becomes a button that removes the filter. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss action, e.g. "Remove filter: Patents". */
  dismissLabel?: string;
  className?: string;
};

/**
 * An applied-filter chip.
 *
 * The legacy markup renders the "x" as a decorative glyph inside a clickable
 * chip. It stays decorative here (aria-hidden) and the accessible name comes
 * from `dismissLabel`, so a screen reader announces the action rather than the
 * character "×".
 */
export function Chip({
  children,
  onDismiss,
  dismissLabel,
  className,
}: ChipProps) {
  const classes = [styles.chip, className].filter(Boolean).join(' ');

  if (!onDismiss) {
    return <span className={classes}>{children}</span>;
  }

  return (
    <button
      type="button"
      className={classes}
      onClick={onDismiss}
      aria-label={dismissLabel}
    >
      {children}
      <span className={styles.dismiss} aria-hidden="true">
        ×
      </span>
    </button>
  );
}

/** Wrapper that lays out a row of applied filters. */
export function ChipGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={[styles.chips, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}
