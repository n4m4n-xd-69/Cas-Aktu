import type { ElementType, ReactNode } from 'react';

import styles from './Container.module.css';

export type ContainerWidth = 'default' | 'wide' | 'prose';

const WIDTHS: Record<ContainerWidth, string | undefined> = {
  default: undefined,
  wide: styles.wide,
  prose: styles.prose,
};

export type ContainerProps = {
  width?: ContainerWidth;
  /** Defaults to <div>. Use "header"/"footer"/"nav" where the landmark matters. */
  as?: ElementType;
  children: ReactNode;
  className?: string;
};

/** Centres content and applies the responsive gutter. */
export function Container({
  width = 'default',
  as: Tag = 'div',
  children,
  className,
}: ContainerProps) {
  return (
    <Tag
      className={[styles.container, WIDTHS[width], className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Tag>
  );
}
