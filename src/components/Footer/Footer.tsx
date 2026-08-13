import { Link } from 'react-router';

import { Container } from '../Container/Container';
import styles from './Footer.module.css';

/**
 * Site footer.
 *
 * S8: rendered on --ink, one of the two always-dark contrast anchors the
 * token file defines. It stays dark in both themes deliberately — it is the
 * page's closing weight — so every colour inside pairs with --on-ink and
 * never with --text.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={`${styles.footer} print-hide`}>
      <Container>
        <div className={styles.identity}>
          <img
            src="/assets/brand/cas-116.png"
            alt=""
            width={40}
            height={40}
            className={styles.emblem}
          />
          <div>
            <p className={styles.identity__name}>Centre for Advanced Studies</p>
            <p className={styles.identity__sub}>
              Dr. A.P.J. Abdul Kalam Technical University, Lucknow
            </p>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.section}>
            <h3>About</h3>
            <ul>
              <li>
                <Link to="/about">About CAS</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/campus">Campus</Link>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3>Academics</h3>
            <ul>
              <li>
                <Link to="/academics">All programmes</Link>
              </li>
              <li>
                <Link to="/admissions">Admissions</Link>
              </li>
              <li>
                <Link to="/documents">Document library</Link>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3>Research</h3>
            <ul>
              <li>
                <Link to="/research">Research overview</Link>
              </li>
              <li>
                <Link to="/people/faculty">Faculty</Link>
              </li>
              <li>
                <Link to="/research/publications">Publications</Link>
              </li>
            </ul>
          </div>

          <div className={styles.section}>
            <h3>Legal</h3>
            <ul>
              <li>
                <Link to="/privacy">Privacy notice</Link>
              </li>
              <li>
                <Link to="/copyright">Copyright</Link>
              </li>
              <li>
                <Link to="/terms">Terms of use</Link>
              </li>
              <li>
                <Link to="/accessibility">Accessibility</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.copyright}>
          © {year} Centre for Advanced Studies. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
