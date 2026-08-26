import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router';

import { transition } from '~/lib/motion';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Programmes', href: '/#programmes' },
  { label: 'Research', href: '/#research' },
  { label: 'People', href: '/#people' },
  { label: 'Contact', href: '/#contact' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      <motion.header
        className={[styles.header, scrolled ? styles.scrolled : ''].filter(Boolean).join(' ')}
        data-site-chrome
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      >
        <div className={styles.inner}>
          <Link to="/" className={styles.logo} aria-label="Centre for Advanced Studies — Home">
            <div className={styles.logoMark}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                <rect width="36" height="36" rx="10" fill="var(--brand)" />
                <path d="M10 18C10 13.58 13.58 10 18 10C22.42 10 26 13.58 26 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M13 18C13 15.24 15.24 13 18 13C20.76 13 23 15.24 23 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="18" cy="18" r="2" fill="white" />
                <path d="M18 20V26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className={styles.logoText}>
              <span className={styles.logoTitle}>CAS</span>
              <span className={styles.logoSub}>Centre for Advanced Studies</span>
            </div>
          </Link>

          <nav className={styles.nav} aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.href || (item.href === '/' && location.pathname === '/');
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={[styles.navLink, isActive ? styles.navActive : ''].filter(Boolean).join(' ')}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      className={styles.navIndicator}
                      layoutId="nav-indicator"
                      transition={transition.spring}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className={styles.actions}>
            <Link to="/about" className={styles.cta}>
              Apply Now
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <button
              className={styles.mobileToggle}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <motion.span
                className={styles.toggleLine}
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={transition.fast}
              />
              <motion.span
                className={styles.toggleLine}
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={transition.fast}
              />
              <motion.span
                className={styles.toggleLine}
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={transition.fast}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileNav}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={transition.base}
          >
            <nav className={styles.mobileNavInner}>
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, ...transition.base }}
                >
                  <Link
                    to={item.href}
                    className={styles.mobileNavLink}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
