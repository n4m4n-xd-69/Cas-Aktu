import type { ElementType, ReactNode } from 'react';

import styles from './Grid.module.css';

/**
 * `min` is the narrowest a column may get before the grid drops one, not a
 * fixed column count — 3 means "columns of at least 260px", which is why the
 * layout needs no media queries.
 */
export type GridColumns = 2 | 3 | 4;

const COLUMNS: Record<GridColumns, string> = {
  2: styles.cols2!,
  3: styles.cols3!,
  4: styles.cols4!,
};

export type GridProps = {
  columns?: GridColumns;
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

export function Grid({
  columns = 3,
  as: Tag = 'div',
  children,
  className,
}: GridProps) {
  return (
    <Tag
      className={[styles.grid, COLUMNS[columns], className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}
