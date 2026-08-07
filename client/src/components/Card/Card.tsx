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
 */
Card.Title = function CardTitle({
  children,
  as: Tag = 'h3',
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
