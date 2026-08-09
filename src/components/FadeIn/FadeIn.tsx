import { createElement } from 'react';
import { useScrollReveal } from '~/lib/useScrollReveal';
import styles from './FadeIn.module.css';

type FadeInProps = {
  children: React.ReactNode;
  delay?: number;
  as?: string;
  className?: string;
};

export function FadeIn({
  children,
  delay = 0,
  as: Component = 'div',
  className,
}: FadeInProps) {
  const { ref, isVisible } = useScrollReveal();

  return createElement(
    Component,
    {
      ref,
      className: [isVisible ? styles.visible : styles.hidden, className]
        .filter(Boolean)
        .join(' '),
      style: { transitionDelay: `${delay}ms` },
    },
    children,
  );
}
