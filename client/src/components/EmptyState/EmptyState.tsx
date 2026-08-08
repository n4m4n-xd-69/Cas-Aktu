import type { ReactNode } from 'react';

import styles from './EmptyState.module.css';

export type EmptyStateProps = {
  title: string;
  description?: string;
  /** A reset action — "Clear filters". */
  children?: ReactNode;
};

/**
 * Shown when a filter or search returns nothing.
 *
 * Deliberately quiet: no illustration, no exclamation. An empty result on
 * an institutional directory is an ordinary outcome, not an error, and
 * styling it as one makes the site feel brittle.
 */
export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className={styles.empty} role="status">
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {children && <div className={styles.action}>{children}</div>}
    </div>
  );
}
