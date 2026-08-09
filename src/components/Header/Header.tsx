import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';

import { Container } from '../Container/Container';
import { ThemeToggle } from '../ThemeToggle';
import styles from './Header.module.css';

const NAV = [
  { to: '/about', label: 'About' },
  { to: '/academics', label: 'Academics' },
  { to: '/admissions', label: 'Admissions' },
  { to: '/research', label: 'Research' },
  { to: '/people', label: 'People' },
  { to: '/research/facilities', label: 'Facilities' },
  { to: '/campus', label: 'Campus' },
  { to: '/updates', label: 'Updates' },
  { to: '/contact', label: 'Contact' },
];

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
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setHasScrolled(false);
      return;
    }

    const updateHeader = () => setHasScrolled(window.scrollY > 56);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    return () => window.removeEventListener('scroll', updateHeader);
  }, [isHome]);

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
                  Research · Innovation · Excellence
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
            <ThemeToggle />
          </div>
        </Container>
      </div>
    </header>
  );
}
