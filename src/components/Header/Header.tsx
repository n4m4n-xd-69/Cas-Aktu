import { useState, useSyncExternalStore } from 'react';
import { Link, NavLink, useLocation } from 'react-router';

import { openCommandPalette } from '../CommandPalette/paletteStore';
import { Container } from '../Container/Container';
import styles from './Header.module.css';

type NavChild = { to: string; label: string };
type NavItem = { to: string; label: string; children?: NavChild[] };

/**
 * Seven top-level sections, not nine.
 *
 * Facilities and Publications used to sit at the top level beside Research
 * even though both are routes *inside* /research — so the bar advertised two
 * arbitrary leaves of one section and hid the other four. They are now items
 * in the Research menu, which is what makes these dropdowns worth having:
 * every section with sub-routes exposes all of them, and the top-level link
 * still goes to the section overview.
 */
const NAV: NavItem[] = [
  { to: '/about', label: 'About' },
  {
    to: '/academics',
    label: 'Academics',
    children: [
      { to: '/academics', label: 'Overview' },
      { to: '/academics/btech', label: 'B.Tech' },
      { to: '/academics/mtech', label: 'M.Tech' },
      { to: '/academics/phd', label: 'Ph.D.' },
      { to: '/academics/programs', label: 'Programmes' },
    ],
  },
  {
    to: '/research',
    label: 'Research',
    children: [
      { to: '/research', label: 'Overview' },
      { to: '/research/facilities', label: 'Facilities' },
      { to: '/research/publications', label: 'Publications' },
      { to: '/research/projects', label: 'Projects' },
      { to: '/research/patents', label: 'Patents' },
      { to: '/research/equipment', label: 'Equipment' },
    ],
  },
  {
    to: '/people',
    label: 'People',
    children: [
      { to: '/people', label: 'Overview' },
      { to: '/people/faculty', label: 'Faculty' },
      { to: '/people/staff', label: 'Staff' },
      { to: '/people/visiting', label: 'Visiting' },
      { to: '/people/former', label: 'Former members' },
    ],
  },
  {
    to: '/updates',
    label: 'Updates',
    children: [
      { to: '/updates', label: 'Overview' },
      { to: '/updates/notices', label: 'Notices' },
      { to: '/updates/events', label: 'Events' },
    ],
  },
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

  /**
   * Which section menu is open, by index. Pointer users get it on hover;
   * keyboard and touch users toggle the caret button, which is why this is
   * real state rather than a CSS-only :hover/:focus-within trick — a closed
   * panel is visibility: hidden, and focus cannot enter a hidden subtree, so
   * a pure-CSS menu is simply unreachable by keyboard.
   *
   * Closing on navigation happens in the links' onClick rather than in an
   * effect watching pathname: `react-hooks/set-state-in-effect` is an error
   * in this project.
   */
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const close = () => setOpenIdx(null);

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
                src="/assets/brand/cas-116.png"
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
                <span className={styles.universityNameHi} lang="hi">
                  डॉ. ए.पी.जे. अब्दुल कलाम प्राविधिक विश्वविद्यालय, लखनऊ
                </span>
                <span className={styles.universityName}>
                  Dr. A.P.J. Abdul Kalam Technical University
                </span>
                <span className={styles.brandSub}>Lucknow, Uttar Pradesh</span>
              </span>
              <img
                src="/assets/brand/aktu-116.png"
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
          <nav
            className={styles.nav}
            aria-label="Primary navigation"
            onKeyDown={(event) => {
              if (event.key === 'Escape') close();
            }}
            onBlur={(event) => {
              // Only close when focus has actually left the whole nav, not
              // when it moves between a caret and its own panel links.
              if (!event.currentTarget.contains(event.relatedTarget)) close();
            }}
          >
            <ul className={styles.navList}>
              {NAV.map((item, i) => (
                <li
                  key={item.to}
                  className={styles.navItem}
                  data-open={openIdx === i ? '' : undefined}
                  onMouseEnter={item.children ? () => setOpenIdx(i) : undefined}
                  onMouseLeave={item.children ? close : undefined}
                >
                  <span className={styles.navRow}>
                    <NavLink
                      to={item.to}
                      className={styles.navLink}
                      onClick={close}
                      end={item.to === '/about' || item.to === '/contact'}
                    >
                      {item.label}
                    </NavLink>

                    {item.children ? (
                      <button
                        type="button"
                        className={styles.caret}
                        aria-expanded={openIdx === i}
                        aria-controls={`nav-panel-${i}`}
                        aria-label={`${item.label} submenu`}
                        onClick={() => setOpenIdx(openIdx === i ? null : i)}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                    ) : null}
                  </span>

                  {item.children ? (
                    <div id={`nav-panel-${i}`} className={styles.panel}>
                      <ul className={styles.panelList}>
                        {item.children.map((child) => (
                          <li key={child.to}>
                            <NavLink to={child.to} end onClick={close}>
                              {child.label}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.navUtility}>
            <button
              type="button"
              className={styles.searchPill}
              onClick={openCommandPalette}
              aria-label="Search the site"
            >
              <span>Search</span>
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
            </button>
          </div>
        </Container>
      </div>
    </header>
  );
}
