import { Link } from 'react-router';

import { Container, Crossfade } from '~/components';
import { HERO_SLIDES } from '~/data/home-media';
import { useSlideshow } from '~/lib/useSlideshow';
import styles from './Hero.module.css';

export function Hero() {
  const { index, goTo, next, prev } = useSlideshow(HERO_SLIDES.length, {
    intervalMs: 3000,
  });

  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <Crossfade slides={HERO_SLIDES} index={index} priority sizes="100vw" />
      <div className={styles.scrim} aria-hidden="true" />

      <Container width="wide" className={styles.inner}>
        <div className={styles.content}>
          <h1 id="home-title" className={styles.title}>
            Centre for
            <br />
            Advanced Studies
          </h1>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.lede}>
            An in-campus research institute driving excellence in advanced
            research, innovation and emerging technologies.
          </p>
          <Link to="/about" className={styles.cta}>
            Explore CAS <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={styles.controls}>
          <div className={styles.counters}>
            {HERO_SLIDES.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goTo(i)}
                className={styles.counter}
                data-active={i === index ? '' : undefined}
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
              >
                {String(i + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
          <div className={styles.arrows}>
            <button type="button" onClick={prev} aria-label="Previous slide">
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={next} aria-label="Next slide">
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
