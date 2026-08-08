import { Link } from 'react-router';

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
 * S5: Added theme toggle and interactive features.
 */
export function Header() {
  return (
    <header className={styles.header} data-site-chrome>
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
          <ThemeToggle />
        </div>
      </Container>

      <Container>
        <nav className={styles.nav} aria-label="Primary navigation">
          <Link to="/about">About</Link>
          <Link to="/academics">Academics</Link>
          <Link to="/admissions">Admissions</Link>
          <Link to="/research">Research</Link>
          <Link to="/people">People</Link>
          <Link to="/campus">Campus</Link>
          <Link to="/updates">News &amp; Notices</Link>
        </nav>
      </Container>
    </header>
  );
}
