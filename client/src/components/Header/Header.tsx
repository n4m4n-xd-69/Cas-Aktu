import { NavLink, Link } from 'react-router';

import { Container } from '../Container/Container';
import { ThemeToggle } from '../ThemeToggle';
import styles from './Header.module.css';

/**
 * Site header.
 *
 * Carries `data-site-chrome` so the --chrome-h measurement in theme-script.ts
 * can find it. That measurement must run inline before <main> exists, and the
 * script queries for `[data-site-chrome]` because class names are
 * module-scoped and hash per build.
 *
 * S8: frosted masthead, and NavLink replaces Link so the current section is
 * marked with aria-current. That attribute is what the stylesheet keys the
 * active underline off, so the visual state and the assistive-technology
 * state cannot diverge.
 */

const NAV = [
  { to: '/about', label: 'About' },
  { to: '/academics', label: 'Academics' },
  { to: '/admissions', label: 'Admissions' },
  { to: '/research', label: 'Research' },
  { to: '/people', label: 'People' },
  { to: '/campus', label: 'Campus' },
  { to: '/updates', label: 'News & Notices' },
];

export function Header() {
  return (
    <header className={`${styles.header} print-hide`} data-site-chrome>
      <Container>
        <div className={styles.identity}>
          <Link to="/" className={styles.brand}>
            <img
              src="/assets/brand/cas-emblem.png"
              alt=""
              width={48}
              height={48}
              className={styles.brand__emblem}
            />
            <span className={styles.brand__text}>
              <span className={styles.brand__name}>
                Centre for Advanced Studies
              </span>
              <span className={styles.brand__sub}>
                In-campus institution of AKTU, Lucknow
              </span>
            </span>
          </Link>
          <div className={styles.actions}>
            <ThemeToggle />
          </div>
        </div>
      </Container>

      <Container>
        <nav className={styles.nav} aria-label="Primary navigation">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </Container>
    </header>
  );
}
