import { motion } from 'motion/react';
import { Link } from 'react-router';

import { Container } from '~/components';
import { fadeUp, staggerContainer, staggerItem, transition } from '~/lib/motion';
import styles from './Footer.module.css';

const FOOTER_LINKS = {
  academics: [
    { label: 'Programmes', href: '/#programmes' },
    { label: 'Admissions', href: '/about' },
    { label: 'Research', href: '/#research' },
    { label: 'Publications', href: '/#research' },
  ],
  campus: [
    { label: 'Faculty', href: '/#people' },
    { label: 'Staff', href: '/#people' },
    { label: 'Events', href: '/#events' },
    { label: 'Facilities', href: '/about' },
  ],
  connect: [
    { label: 'Contact Us', href: '/#contact' },
    { label: 'Location', href: '/about' },
    { label: 'Careers', href: '/about' },
    { label: 'Alumni', href: '/about' },
  ],
};

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <motion.div
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Brand column */}
          <motion.div className={styles.brandCol} variants={staggerItem}>
            <Link to="/" className={styles.footerLogo}>
              <div className={styles.footerLogoMark}>
                <svg width="32" height="32" viewBox="0 0 36 36" fill="none" aria-hidden="true">
                  <rect width="36" height="36" rx="10" fill="var(--brand)" />
                  <path d="M10 18C10 13.58 13.58 10 18 10C22.42 10 26 13.58 26 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M13 18C13 15.24 15.24 13 18 13C20.76 13 23 15.24 23 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="2" fill="white" />
                  <path d="M18 20V26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <span className={styles.footerLogoTitle}>CAS</span>
                <span className={styles.footerLogoSub}>Centre for Advanced Studies</span>
              </div>
            </Link>
            <p className={styles.footerDesc}>
              Advancing knowledge through interdisciplinary research, innovative teaching,
              and a commitment to academic excellence.
            </p>
            <div className={styles.social}>
              {['Twitter', 'LinkedIn', 'YouTube'].map((name) => (
                <a key={name} href="#" className={styles.socialLink} aria-label={name}>
                  <span aria-hidden="true">{name[0]}</span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <motion.div key={title} className={styles.linkCol} variants={staggerItem}>
              <h4 className={styles.colTitle}>{title}</h4>
              <ul className={styles.linkList}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className={styles.footerLink}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.bottom}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Centre for Advanced Studies. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <a href="#" className={styles.bottomLink}>Privacy Policy</a>
            <a href="#" className={styles.bottomLink}>Terms of Use</a>
            <a href="#" className={styles.bottomLink}>Accessibility</a>
          </div>
        </motion.div>
      </Container>
    </footer>
  );
}
