import styles from './Stat.module.css';

export type StatProps = {
  value: number | string;
  label: string;
  /** Optional qualifier under the label — "Filed and under examination". */
  detail?: string;
  /** Inverts for use on --ink panels. */
  onInk?: boolean;
};

/**
 * A single institutional figure.
 *
 * Exists because the same "big number over a small label" markup was being
 * rebuilt inline on every page that showed a count, each time with its own
 * font-size and colour. The number is tabular-figure aligned so a row of
 * stats does not jitter between values of different widths.
 */
export function Stat({ value, label, detail, onInk = false }: StatProps) {
  return (
    <div
      className={[styles.stat, onInk ? styles.onInk : undefined]
        .filter(Boolean)
        .join(' ')}
    >
      <span className={styles.value}>{value}</span>
      <span className={styles.label}>{label}</span>
      {detail && <span className={styles.detail}>{detail}</span>}
    </div>
  );
}
