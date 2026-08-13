import styles from './Skeleton.module.css';

type SkeletonProps = {
  width?: string;
  height?: string;
  variant?: 'text' | 'rect' | 'circle';
};

export function Skeleton({
  width = '100%',
  height,
  variant = 'text',
}: SkeletonProps) {
  const style = {
    width,
    height: height || (variant === 'text' ? '1em' : '100%'),
  };

  return (
    <div
      className={`${styles.skeleton} ${styles[variant]}`}
      style={style}
      aria-busy="true"
      aria-live="polite"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <Skeleton variant="rect" height="200px" />
      <div className={styles.content}>
        <Skeleton width="60%" />
        <Skeleton width="100%" />
        <Skeleton width="80%" />
      </div>
    </div>
  );
}
