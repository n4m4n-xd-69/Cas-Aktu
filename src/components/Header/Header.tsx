import { useSyncExternalStore } from 'react';
import { Link, NavLink, useLocation } from 'react-router';

import { openCommandPalette } from '../CommandPalette/paletteStore';
import { Container } from '../Container/Container';
import { ThemeToggle } from '../ThemeToggle';
import styles from './Header.module.css';

const NAV = [
  { to: '/about', label: 'About' },
  { to: '/academics', label: 'Academics' },
  { to: '/research', label: 'Research' },
  { to: '/people', label: 'People' },
  { to: '/research/facilities', label: 'Facilities' },
  { to: '/research/publications', label: 'Publications' },
  { to: '/updates', label: 'Updates' },
  { to: '/documents', label: 'Documents' },
  { to: '/contact', label: 'Contact' },
];

const SCROLL_THRESHOLD = 56;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true });
  return () => window.removeEventListener('scroll', onChange);
}

/**
 * Reads real scroll position via useSyncExternalStore rather than
 * useState + useEffect — this project lints `react-hooks/set-state-in-effect`
 * as an error, and the `isHome` gate must live inside the hook (not around
 * the call) so the hook itself is called unconditionally on every render.
 */
function useHasScrolled(active: boolean): boolean {
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > SCROLL_THRESHOLD,
    () => false,
  );
  return active && scrolled;
}

/**
 * Dual-institution masthead.
 *
 * The home-page version is fixed over the hero. Its identity row exits upward
 * after the opening scroll, while the navigation row settles at the top of the
 * viewport. Internal routes keep the same hierarchy in an opaque sticky
 * header so page content never sits under unpredictable photography.
 */
export function Header() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const hasScrolled = useHasScrolled(isHome);

  return (
    <header
      className={[
        styles.header,
        isHome ? styles.home : styles.interior,
        hasScrolled ? styles.scrolled : '',
        'print-hide',
      ]
        .filter(Boolean)
        .join(' ')}
      data-site-chrome={isHome ? undefined : ''}
    >
      <div className={styles.identityWrap}>
        <Container width="wide">
          <div className={styles.identity}>
            <Link to="/" className={styles.casBrand} aria-label="CAS home">
              <img
                src="/assets/brand/cas-emblem.png"
                alt=""
                width={58}
                height={58}
                className={styles.emblem}
              />
              <span className={styles.brandText}>
                <span className={styles.brandName}>
                  Centre for Advanced Studies
                </span>
                <span className={styles.brandSub}>
                  Research. Innovation. Excellence.
                </span>
              </span>
            </Link>

            <a
              href="https://aktu.ac.in/"
              className={styles.aktuBrand}
              aria-label="Dr. A.P.J. Abdul Kalam Technical University website"
            >
              <span className={styles.brandText}>
                <span className={styles.universityName}>
                  Dr. A.P.J. Abdul Kalam Technical University
                </span>
                <span className={styles.brandSub}>Lucknow, Uttar Pradesh</span>
              </span>
              <img
                src="/assets/brand/aktu-emblem.png"
                alt=""
                width={58}
                height={58}
                className={styles.emblem}
              />
            </a>
          </div>
        </Container>
      </div>

      <div className={styles.navWrap}>
        <Container width="wide" className={styles.navContainer}>
          <nav className={styles.nav} aria-label="Primary navigation">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className={styles.navUtility}>
            <button
              type="button"
              className={styles.searchPill}
              onClick={openCommandPalette}
              aria-label="Search the site"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <span>Search…</span>
            </button>
            <ThemeToggle />
          </div>
        </Container>
      </div>
    </header>
  );
}
