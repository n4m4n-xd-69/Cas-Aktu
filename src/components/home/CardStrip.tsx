import { useState } from 'react';
import { Link } from 'react-router';

import { Crossfade } from '~/components';
import { CARD_SETS, type CardKey } from '~/data/home-media';
import { useSlideshow } from '~/lib/useSlideshow';
import styles from './CardStrip.module.css';

type Card = { key: CardKey; title: string; detail: string; href: string };

const CARDS: readonly Card[] = [
  { key: 'labs', title: 'Research Labs', detail: 'State-of-the-art labs empowering discoveries', href: '/research/facilities' },
  { key: 'programs', title: 'Academic Programs', detail: 'Interdisciplinary programs for future leaders', href: '/academics' },
  { key: 'areas', title: 'Research Areas', detail: 'Exploring frontiers of knowledge', href: '/research' },
  { key: 'innovations', title: 'Innovations', detail: 'Ideas transforming into impactful solutions', href: '/research/patents' },
  { key: 'life', title: 'Campus Life', detail: 'A vibrant community of curious minds', href: '/campus' },
];

/** 800ms apart so the five tiles never flip in unison. */
const STAGGER_MS = 800;

function Tile({ card, offsetMs }: { card: Card; offsetMs: number }) {
  const [paused, setPaused] = useState(false);
  const slides = CARD_SETS[card.key];
  const { index } = useSlideshow(slides.length, {
    intervalMs: 5000,
    offsetMs,
    paused,
  });

  return (
    <Link
      to={card.href}
      className={styles.tile}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Crossfade slides={slides} index={index} sizes="(max-width: 900px) 50vw, 20vw" />
      <span className={styles.scrim} aria-hidden="true" />
      <span className={styles.body}>
        <span className={styles.title}>{card.title}</span>
        <span className={styles.detail}>{card.detail}</span>
      </span>
      <span className={styles.arrow} aria-hidden="true">→</span>
    </Link>
  );
}

export function CardStrip() {
  return (
    <section className={styles.strip} aria-label="Explore the centre">
      {CARDS.map((card, i) => (
        <Tile key={card.key} card={card} offsetMs={i * STAGGER_MS} />
      ))}
    </section>
  );
}
