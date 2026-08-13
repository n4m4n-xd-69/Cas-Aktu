import styles from './SearchField.module.css';

export type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Required — this is the input's accessible name, there is no visible label. */
  label: string;
  /** Live result count, announced politely to screen readers. */
  resultCount?: number;
};

/**
 * The filter input used by every directory page.
 *
 * Replaces the hand-rolled <input style={{…}}> that had been copied into
 * each listing route with its own spelling of the same nine declarations.
 * The result count is wired through here rather than left to callers so
 * that the aria-live region announcing it cannot be forgotten — that was
 * the accessibility gap S6 caught on two pages.
 */
export function SearchField({
  value,
  onChange,
  placeholder = 'Search…',
  label,
  resultCount,
}: SearchFieldProps) {
  return (
    <div className={styles.wrap}>
      <span className={styles.icon} aria-hidden="true">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </span>
      <input
        type="search"
        className={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      />
      {resultCount !== undefined && (
        <span className="sr-only" role="status" aria-live="polite">
          {resultCount} result{resultCount === 1 ? '' : 's'}
        </span>
      )}
    </div>
  );
}
