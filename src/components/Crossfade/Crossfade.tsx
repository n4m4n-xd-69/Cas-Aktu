import styles from './Crossfade.module.css';

export type CrossfadeSlide = {
  src: string;
  webp: string;
  alt: string;
};

export type CrossfadeProps = {
  slides: readonly CrossfadeSlide[];
  index: number;
  className?: string;
  /** Hero only. Gives slide 0 high fetch priority and eager loading. */
  priority?: boolean;
  sizes?: string;
};

/**
 * Opacity-only slide stack.
 *
 * Knows nothing about timing — the caller owns that via useSlideshow. Every
 * slide stays mounted so the browser keeps decoded frames and the fade has
 * something to fade to; only slide 0 is ever eager.
 *
 * The whole stack is aria-hidden: callers always render a real text label
 * beside it, and announcing a photo rotation would be noise.
 */
export function Crossfade({
  slides,
  index,
  className,
  priority = false,
  sizes = '100vw',
}: CrossfadeProps) {
  return (
    <div
      className={[styles.stack, className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      {slides.map((slide, i) => (
        <picture key={slide.src} data-active={i === index ? '' : undefined}>
          <source srcSet={slide.webp} type="image/webp" sizes={sizes} />
          <img
            src={slide.src}
            alt=""
            sizes={sizes}
            loading={priority && i === 0 ? 'eager' : 'lazy'}
            fetchPriority={priority && i === 0 ? 'high' : 'low'}
            decoding={priority && i === 0 ? 'sync' : 'async'}
          />
        </picture>
      ))}
    </div>
  );
}
