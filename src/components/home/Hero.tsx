import { useState } from 'react';
import { Link } from 'react-router';

import { Container, Crossfade } from '~/components';
import { HERO_SLIDES } from '~/data/home-media';
import { useSlideshow } from '~/lib/useSlideshow';
import styles from './Hero.module.css';

/**
 * Photo-forward hero.
 *
 * The scrim darkens only the top strip (so the fixed masthead stays legible)
 * and the bottom strip (so the headline does), leaving the middle of the
 * frame close to unmodified — the photograph is the content here, not a
 * texture behind a wash. Slide controls are deliberately reduced to a single
 * advance chevron: numbered counters and paired circle buttons put four
 * competing marks on the image for a rotation the visitor is not asked to
 * track.
 */
export function Hero() {
  /**
   * The copy block is remounted on every slide change (see `key` below), so
   * an unpaused rotation would tear focus out of the "Explore CAS" link every
   * 3 seconds while a keyboard user was sitting on it. Holding the rotation
   * while focus is anywhere inside the hero fixes that, and doubles as the
   * pause mechanism for auto-updating content. Hover deliberately does NOT
   * pause: the pointer rests over the hero most of the time on desktop, and
   * pausing on hover would stop the slideshow almost permanently.
   */
  const [focusWithin, setFocusWithin] = useState(false);

  const { index, next } = useSlideshow(HERO_SLIDES.length, {
    intervalMs: 3000,
    paused: focusWithin,
  });

  return (
    <section
      className={styles.hero}
      aria-labelledby="home-title"
      onFocus={() => setFocusWithin(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusWithin(false);
        }
      }}
    >
      <Crossfade slides={HERO_SLIDES} index={index} priority sizes="100vw" />
      <div className={styles.scrim} aria-hidden="true" />

      <button
        type="button"
        onClick={next}
        className={styles.advance}
        aria-label="Next slide"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 5 7 7-7 7" />
        </svg>
      </button>

      <Container width="wide" className={styles.inner}>
        {/* `key={index}` is what ties the copy's fade to the slideshow: a new
            slide remounts this block, which restarts its CSS animation from
            the top. The animation is deliberately a little longer than the
            slide interval so a remount always preempts its final frame —
            meaning that if the rotation ever stalls (hidden tab, reduced
            motion), the animation runs out and the element falls back to its
            own `opacity: 1`, leaving the copy visible rather than stranded
            invisible. See .content in Hero.module.css. */}
        <div className={styles.content} key={index}>
          <h1 id="home-title" className={styles.title}>
            Centre for Advanced Studies
          </h1>
          <p className={styles.lede}>
            An in-campus research institute of Dr. A.P.J. Abdul Kalam Technical
            University, driving excellence in advanced research, innovation and
            emerging technologies.
          </p>
          <Link to="/about" className={styles.cta}>
            Explore CAS
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </Container>

      {/* Anchors to the first heading of the band below. `scroll-behavior` and
          `scroll-padding-top` are already set globally in base.css, and the
          former is disabled under reduced motion there, so this needs no
          script and no motion handling of its own. */}
      <a
        href="#campus-title"
        className={styles.scrollCue}
        aria-label="Scroll to page content"
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4v15M6 13.5 12 20l6-6.5" />
        </svg>
      </a>
    </section>
  );
}
