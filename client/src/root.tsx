import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from 'react-router';

import { CommandPalette, Footer, Header } from '~/components';
import { ThemeProvider } from '~/theme/ThemeProvider';
import { chromeHeightScript, prePaintScript } from '~/theme/theme-script';

// Order is load-bearing: tokens.css declares the custom properties that
// base.css and every CSS Module consume. Vite preserves import order when it
// extracts the stylesheet.
import './styles/tokens.css';
import './styles/base.css';

import type { Route } from './+types/root';

/**
 * RootLayout — the document shell for every page. Replaces
 * templates/_layout.html.
 *
 * Present at S2: language, viewport, the skip link and #main landmark, the
 * design system, the pre-paint scripts, and the theme provider.
 *
 * Still to come: the alert band, utility bar, header, notice ticker and
 * footer (S4). Each of those must carry `data-site-chrome` if it is part of
 * the fixed chrome, so the --chrome-h measurement below can see it, and
 * `print-hide` if it must not appear in print.
 */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="theme-color"
          content="#292B88"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#0B0C11"
          media="(prefers-color-scheme: dark)"
        />
        <Meta />
        <Links />

        {/* Self-hosted, so there is no third-party origin to preconnect to.
            Only the latin subsets are preloaded; latin-ext is fetched on
            demand through its unicode-range. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin=""
          href="/assets/fonts/inter-latin.woff2"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin=""
          href="/assets/fonts/source-serif-4-latin.woff2"
        />

        {/* Must run before first paint and before any bundle: sets js-on and
            resolves the stored theme. A React effect would be far too late —
            the theme would flash and .reveal content would start hidden for
            visitors whose JavaScript never runs. */}
        <script dangerouslySetInnerHTML={{ __html: prePaintScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>

        <Header />
        <CommandPalette />

        {/* Measures the chrome and publishes --chrome-h. Sits exactly where it
            sat in _layout.html: after the chrome markup, before <main> exists,
            so a full-viewport hero is laid out correctly on the first pass.
            Running this from a bundle instead cost 0.06 CLS. */}
        <script dangerouslySetInnerHTML={{ __html: chromeHeightScript }} />

        <main id="main">{children}</main>

        <Footer />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  );
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
    <section style={{ padding: 'var(--space-8) var(--gutter)' }}>
      <h1>{heading}</h1>
      <p>{detail}</p>
    </section>
  );
}
