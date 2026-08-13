import { Link } from 'react-router';

import { AdmissionsRail, Container } from '~/components';
import { CAMPUS_TOUR } from '~/data/home-media';
import styles from './CampusBand.module.css';

export function CampusBand() {
  return (
    <section className={styles.band} aria-labelledby="campus-title">
      <Container width="wide" className={styles.grid}>
        <div className={styles.campus}>
          <h2 id="campus-title" className={styles.title}>
            Explore campus
          </h2>
          <p className={styles.lede}>
            Teaching blocks, specialist laboratories and study spaces across the
            CAS campus at AKTU, Lucknow.
          </p>

          <ul className={styles.tour}>
            {CAMPUS_TOUR.map((image) => (
              <li key={image.src}>
                <picture>
                  <source srcSet={image.webp} type="image/webp" />
                  <img src={image.src} alt={image.alt} loading="lazy" />
                </picture>
              </li>
            ))}
          </ul>

          <Link to="/campus" className={styles.link}>
            Take the campus tour <span aria-hidden="true">→</span>
          </Link>
        </div>

        <AdmissionsRail />
      </Container>
    </section>
  );
}
