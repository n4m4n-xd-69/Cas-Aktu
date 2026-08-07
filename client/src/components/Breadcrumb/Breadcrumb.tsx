import { Fragment } from 'react';

import styles from './Breadcrumb.module.css';

export type Crumb = {
  label: string;
  /** Omit on the final crumb — the current page is not a link. */
  href?: string;
};

export type BreadcrumbProps = {
  items: Crumb[];
  /** Accessible name for the landmark. Distinguishes it from other navs. */
  label?: string;
  className?: string;
};

/**
 * Breadcrumb trail.
 *
 * Wrapped in <nav> and marked aria-label so it is a named landmark, with the
 * final crumb carrying aria-current="page". The separator is a CSS
 * pseudo-element rather than text, so "/" is never read aloud.
 *
 * Carries `print-hide`: the legacy print stylesheet hid `.breadcrumbs`, and
 * that rule now works by opt-in because component class names are scoped.
 */
export function Breadcrumb({
  items,
  label = 'Breadcrumb',
  className,
}: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label={label}
      className={['print-hide', styles.breadcrumbs, className]
        .filter(Boolean)
        .join(' ')}
    >
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className={styles.item}>
              {item.href && !isLast ? (
                <a href={item.href}>{item.label}</a>
              ) : (
                <Fragment>
                  <span aria-current={isLast ? 'page' : undefined}>
                    {item.label}
                  </span>
                </Fragment>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
