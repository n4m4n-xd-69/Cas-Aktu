import styles from './Pagination.module.css';

export type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** How many pages to show either side of the current one. */
  siblingCount?: number;
  label?: string;
  className?: string;
};

type Slot = number | 'gap';

/**
 * Builds the visible page list: always the first and last page, the current
 * page with `siblingCount` neighbours, and a gap marker where pages were
 * elided. Returns every page when the range is short enough that eliding
 * would show more markers than it saved.
 */
function buildSlots(page: number, total: number, siblings: number): Slot[] {
  const window = siblings * 2 + 5;
  if (total <= window) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, total);
  const slots: Slot[] = [1];

  if (left > 2) slots.push('gap');
  for (let p = Math.max(left, 2); p <= Math.min(right, total - 1); p++)
    slots.push(p);
  if (right < total - 1) slots.push('gap');

  slots.push(total);
  return slots;
}

/**
 * Paginated navigation.
 *
 * NOTE: net new at S2 — the legacy site has no pagination, so there is no
 * previous appearance to preserve. Styling is composed entirely from existing
 * tokens (see Pagination.module.css).
 *
 * The list is a <nav> landmark; the current page carries aria-current="page";
 * and every control meets the --touch (44px) minimum target size.
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  label = 'Pagination',
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const slots = buildSlots(page, totalPages, siblingCount);
  const atStart = page <= 1;
  const atEnd = page >= totalPages;

  return (
    <nav
      aria-label={label}
      className={[styles.pagination, className].filter(Boolean).join(' ')}
    >
      <button
        type="button"
        className={[styles.item, atStart ? styles.disabled : undefined]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onPageChange(page - 1)}
        disabled={atStart}
        aria-label="Previous page"
      >
        ‹
      </button>

      {slots.map((slot, index) =>
        slot === 'gap' ? (
          <span
            key={`gap-${index}`}
            className={styles.ellipsis}
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={slot}
            type="button"
            className={[styles.item, slot === page ? styles.current : undefined]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onPageChange(slot)}
            aria-label={`Page ${slot}`}
            aria-current={slot === page ? 'page' : undefined}
          >
            {slot}
          </button>
        ),
      )}

      <button
        type="button"
        className={[styles.item, atEnd ? styles.disabled : undefined]
          .filter(Boolean)
          .join(' ')}
        onClick={() => onPageChange(page + 1)}
        disabled={atEnd}
        aria-label="Next page"
      >
        ›
      </button>
    </nav>
  );
}
