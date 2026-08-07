import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from 'react-router';

import type { Route } from './+types/root';
import styles from './styles/root.module.css';

/**
 * RootLayout — the document shell for every page.
 *
 * Replaces templates/_layout.html. What has been carried over at S1 is only
 * structure: language, viewport, the skip link, and the #main landmark that
 * the skip link targets. The current site ships that skip link on 392 of 392
 * pages (docs/AUDIT.md section 8) and losing it would be a regression.
 *
 * NOT yet present, deliberately — S2 work, tracked in the design spec section 5.1:
 *
 *   1. The pre-paint theme resolver. It reads localStorage["cas-theme"] and
 *      sets data-theme before first paint. It is meaningless until tokens.css
 *      is ported, and must land as an inline script in <head>, never as a
 *      component effect, or the wrong theme flashes.
 *
 *   2. The --chrome-h measurement. Running it after paint instead of inline
 *      cost 0.06 CLS on the current site; that regression is documented in
 *      templates/_layout.html and must not be reintroduced.
 *
 *   3. The js-on class, which lets scroll-reveal start hidden only when
 *      scripts actually run, so non-JS visitors still see all content.
 */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <a className={styles.skipLink} href="#main">
          Skip to main content
        </a>
        <main id="main">{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let heading = 'Something went wrong';
  let detail = 'An unexpected error occurred.';

  if (isRouteErrorResponse(error)) {
    heading = error.status === 404 ? 'Page not found' : `${error.status}`;
    detail =
      error.status === 404
        ? 'The page you asked for does not exist.'
        : error.statusText;
  } else if (import.meta.env.DEV && error instanceof Error) {
    detail = error.message;
  }

  return (
    <section className={styles.errorPage}>
      <h1>{heading}</h1>
      <p>{detail}</p>
    </section>
  );
}
