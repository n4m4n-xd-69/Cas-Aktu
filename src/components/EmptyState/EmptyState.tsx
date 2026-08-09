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
    // Deliberately NOT role="status". SearchField already publishes the
    // result count to a live region, and browser testing confirmed a
    // screen reader announcing both — "0 results", then the whole of this
    // panel. The count is the event worth announcing; this is the visual
    // explanation of it.
    <div className={styles.empty}>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {children && <div className={styles.action}>{children}</div>}
    </div>
  );
}
