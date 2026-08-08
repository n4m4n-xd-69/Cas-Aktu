import { Link } from 'react-router';

import { Container } from '../Container/Container';
import styles from './Footer.module.css';

/**
 * Site footer.
 *
 * S4: minimal static version with key links. S5: full link grid, newsletter
 * signup, and enhanced copyright/trust badges.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
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
