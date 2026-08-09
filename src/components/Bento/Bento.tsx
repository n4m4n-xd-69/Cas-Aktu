import type { CSSProperties, ElementType, ReactNode } from 'react';

import styles from './Bento.module.css';

export type BentoProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Bento grid — a 12-column bed whose children declare their own span.
 *
 * Used where a set of items is genuinely unequal in importance (the home
 * page, section landings). A uniform list of peers should stay in <Grid>;
 * a bento layout that gives every cell the same span is just a grid with
 * extra machinery.
 *
 * Below 700px every item collapses to full width, so span values are a
 * desktop concern only and never need a responsive variant.
 */
export function Bento({ children, className }: BentoProps) {
  return (
    <div className={[styles.bento, className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

export type BentoItemProps = {
  /** Columns to occupy out of 12. Clamped by the stylesheet on small screens. */
  span?: number;
  /** Row span, for the tall cells that give a bento its asymmetry. */
  rows?: number;
  /** Renders the always-dark contrast panel instead of a normal surface. */
  tone?: 'default' | 'ink' | 'subtle';
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

Bento.Item = function BentoItem({
  span = 4,
  rows = 1,
  tone = 'default',
  as: Tag = 'div',
  children,
  className,
}: BentoItemProps) {
  return (
    <Tag
      className={[styles.item, styles[tone], className]
        .filter(Boolean)
        .join(' ')}
      style={{ '--span': span, '--rows': rows } as CSSProperties}
    >
      {children}
    </Tag>
  );
};
