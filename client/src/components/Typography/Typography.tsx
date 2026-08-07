import type { ElementType, ReactNode } from 'react';

import styles from './Typography.module.css';

type Base = { children: ReactNode; className?: string };

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = Base & {
  level: HeadingLevel;
  /**
   * Switches from the display serif to the UI sans. Card titles, row titles
   * and navigation use this: Source Serif 4 loses legibility at small sizes.
   */
  ui?: boolean;
};

/**
 * A heading.
 *
 * `level` sets the ELEMENT, which is the document outline and therefore the
 * accessibility contract — it is not a size knob. The audit found 142 of 392
 * legacy pages skipping from h1 straight to h3 (WCAG 1.3.1); taking the level
 * explicitly is what lets S4 get that right per page. Visual size comes from
 * the element via base.css.
 */
export function Heading({
  level,
  ui = false,
  children,
  className,
}: HeadingProps) {
  const Tag = `h${level}` as ElementType;
  return (
    <Tag
      className={[ui ? 'ui-heading' : undefined, className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}

/** Intro paragraph under a heading. */
export function Lede({ children, className }: Base) {
  return (
    <p className={[styles.lede, className].filter(Boolean).join(' ')}>
      {children}
    </p>
  );
}

/** Small uppercase label with a trailing rule. */
export function Eyebrow({
  children,
  onDark = false,
  className,
}: Base & { onDark?: boolean }) {
  return (
    <p
      className={[
        styles.eyebrow,
        onDark ? styles.eyebrowOnDark : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </p>
  );
}

/** Editorial hairline. Renders an <hr>, so it is a separator to assistive tech. */
export function Rule({ className }: { className?: string }) {
  return <hr className={[styles.rule, className].filter(Boolean).join(' ')} />;
}

/** Vertical rhythm for a run of sibling blocks. */
export function Stack({
  children,
  size = 'base',
  as: Tag = 'div',
  className,
}: Base & { size?: 'base' | 'lg'; as?: ElementType }) {
  return (
    <Tag
      className={[size === 'lg' ? styles.stackLg : styles.stack, className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}
