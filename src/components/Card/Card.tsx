import type { ElementType, ReactNode } from 'react';

import styles from './Card.module.css';

export type CardProps = {
  /** Adds the larger padding and subtle background of the feature variant. */
  feature?: boolean;
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

export function Card({
  feature = false,
  as: Tag = 'article',
  children,
  className,
}: CardProps) {
  return (
    <Tag
      className={[styles.card, feature ? styles.feature : undefined, className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}

function part(cls: string | undefined) {
  return function Part({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) {
    return (
      <div className={[cls, className].filter(Boolean).join(' ')}>
        {children}
      </div>
    );
  };
}

Card.Icon = part(styles.icon);
Card.Eyebrow = part(styles.eyebrow);
Card.Body = part(styles.body);
Card.Foot = part(styles.foot);

/**
 * The card's heading. Wrap a link in it to make the whole card clickable —
 * the stylesheet expands that link over the card via ::after, which keeps a
 * single focusable target rather than nesting interactive elements.
 *
 * Defaults to <h2>, not <h3>. Listing pages put a grid of cards directly
 * under the page <h1>, so an h3 default skipped a level on all 16 of them —
 * WCAG 1.3.1 Level A, and the same defect docs/AUDIT.md section 8 measured
 * on 142 legacy pages. Fixing it here rather than per-route is what that
 * audit recommended: one shared template, one change.
 *
 * Lowering the default cannot introduce a skip anywhere else, because a
 * heading that DECREASES in level is always valid. Appearance is unchanged:
 * .title sets its own font-size, weight and family, so the tag carries
 * outline semantics only. Pass `as` where a card genuinely sits under an
 * h2 section heading.
 */
Card.Title = function CardTitle({
  children,
  as: Tag = 'h2',
  className,
}: {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}) {
  return (
    <Tag className={[styles.title, className].filter(Boolean).join(' ')}>
      {children}
    </Tag>
  );
};
