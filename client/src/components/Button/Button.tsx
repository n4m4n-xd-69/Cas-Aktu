import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'ondark';
export type ButtonSize = 'sm' | 'md' | 'lg';

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
};

type AsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & { href?: never };

type AsAnchor = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & { href: string };

export type ButtonProps = AsButton | AsAnchor;

const VARIANTS: Record<ButtonVariant, string> = {
  primary: styles.primary!,
  secondary: styles.secondary!,
  ghost: styles.ghost!,
  ondark: styles.ondark!,
};

const SIZES: Record<ButtonSize, string | undefined> = {
  sm: styles.sm,
  md: undefined, // the base .btn size
  lg: styles.lg,
};

/**
 * Renders an <a> when `href` is present and a <button> otherwise.
 *
 * That distinction is not cosmetic: the legacy markup uses `.btn` on both, and
 * a control that navigates must be a link so it can be opened in a new tab,
 * copied, and announced as a link by a screen reader.
 *
 * Router-aware navigation (react-router <Link>) is deliberately not wired in
 * here — there are no real routes until S4. Internal links use `href` for now
 * and switch to <Link> when the route tree exists.
 */
export function Button({
  variant = 'secondary',
  size = 'md',
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = [styles.btn, VARIANTS[variant], SIZES[size], className]
    .filter(Boolean)
    .join(' ');

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      className={classes}
      type={buttonProps.type ?? 'button'}
      {...buttonProps}
    >
      {children}
    </button>
  );
}
