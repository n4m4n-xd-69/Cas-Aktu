import type { ReactNode } from 'react';

import styles from './Badge.module.css';

export type BadgeTone = 'open' | 'closing' | 'archived' | 'draft' | 'canceled';

const TONES: Record<BadgeTone, string> = {
  open: styles.open!,
  closing: styles.closing!,
  archived: styles.archived!,
  draft: styles.draft!,
  canceled: styles.canceled!,
};

export type BadgeProps = {
  tone: BadgeTone;
  children: ReactNode;
  className?: string;
};

/**
 * Status badge.
 *
 * `children` is required and must carry the status as a WORD. The tone only
 * adds colour and a decorative dot; colour alone would fail WCAG 1.4.1, and
 * the legacy CSS is explicit that every badge states its own status in text.
 */
export function Badge({ tone, children, className }: BadgeProps) {
  return (
    <span
      className={[styles.badge, TONES[tone], className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}
