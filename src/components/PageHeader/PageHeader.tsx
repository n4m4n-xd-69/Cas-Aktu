import type { ReactNode } from 'react';

import { Container } from '../Container/Container';
import { Heading, Lede } from '../Typography/Typography';
import styles from './PageHeader.module.css';

export type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  lede?: string;
  /** Filters, actions or counts that belong with the title block. */
  children?: ReactNode;
  /** Constrains the header to prose width on long-form pages. */
  prose?: boolean;
};

/**
 * The masthead every page family opens with.
 *
 * Before S8 each route wrote its own <Section><Container><Heading> stack,
 * so the gap between title and content varied page to page and the eyebrow
 * was sometimes a styled <p>. One component means one vertical rhythm and
 * one place to change it.
 *
 * The hairline at the foot is the only always-on decoration in the system;
 * it replaces the heavier bordered band the legacy site used.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  children,
  prose = false,
}: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <Container width={prose ? 'prose' : undefined}>
        <div className={styles.inner}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <Heading level={1} className={styles.title}>
            {title}
          </Heading>
          {lede && <Lede>{lede}</Lede>}
          {children && <div className={styles.slot}>{children}</div>}
        </div>
      </Container>
    </header>
  );
}
