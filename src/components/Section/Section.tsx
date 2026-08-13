import type { ElementType, ReactNode } from 'react';

import styles from './Section.module.css';

export type SectionTone = 'default' | 'subtle' | 'muted';
export type SectionSpacing = 'default' | 'tight' | 'loose';

const TONES: Record<SectionTone, string | undefined> = {
  default: undefined,
  subtle: styles.subtle,
  muted: styles.muted,
};

const SPACING: Record<SectionSpacing, string | undefined> = {
  default: undefined,
  tight: styles.tight,
  loose: styles.loose,
};

export type SectionProps = {
  tone?: SectionTone;
  spacing?: SectionSpacing;
  /** Removes top padding where a band butts against the one above it. */
  flushTop?: boolean;
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

/** A full-width horizontal band. Pair with <Container> for the inner measure. */
export function Section({
  tone = 'default',
  spacing = 'default',
  flushTop = false,
  as: Tag = 'section',
  children,
  className,
}: SectionProps) {
  return (
    <Tag
      className={[
        styles.section,
        TONES[tone],
        SPACING[spacing],
        flushTop ? styles.flushTop : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}
