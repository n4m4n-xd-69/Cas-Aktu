import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLocation,
} from 'react-router';

import { CommandPalette, Footer, Header } from '~/components';

// Order is load-bearing: tokens.css declares the custom properties that
// base.css and every CSS Module consume. Vite preserves import order when it
// extracts the stylesheet.
import './styles/tokens.css';
import './styles/base.css';

import type { Route } from './+types/root';

/**
 * Scripts that must execute before first paint.
 *
 * Injected as inline <script> tags below, not run from a component effect.
 * React effects run after hydration, which is far too late.
 */

/**
 * Marks that scripts are running. `js-on` gates the scroll-reveal hidden
 * state in base.css. Without it, every `.reveal` element renders visible —
 * which is exactly what a visitor with no JavaScript, or a failed bundle,
 * must get (FR-02). Never move this into React; if it lands after
 * hydration, content is invisible until then.
 */
const jsOnScript = 'document.documentElement.classList.add("js-on");';

/**
 * Publishes the height of the fixed page chrome as --chrome-h.
 *
 * A full-viewport hero sizes itself against the space the chrome leaves. This
 * has to run inline, immediately after the chrome markup is parsed and before
 * <main> exists, so the hero is laid out correctly on the first pass. Running
 * it from a bundle instead resized the hero after first paint and cost
 * 0.06 CLS on the current site — a measured regression, not a theoretical one.
 *
 * The CSS carries a 140px fallback, so this is a refinement and never a
 * dependency: if it finds nothing it writes nothing.
 *
 * Selector note: the original queried `.site-header`, a global class name.
 * Class names are module-scoped now and hash per build, so the header instead
 * carries a stable `data-site-chrome` attribute. Any element added to the
 * fixed chrome at S4 (alert band, utility bar, header) must carry it.
 */
const chromeHeightScript = `(function(){try{var t=0;
document.querySelectorAll("[data-site-chrome]").forEach(function(e){t+=e.getBoundingClientRect().height;});
if(t>0)document.documentElement.style.setProperty("--chrome-h",Math.round(t)+"px");}catch(e){}})();`;

/**
 * RootLayout — the document shell for every page. Replaces
 * templates/_layout.html.
 *
 * Present at S2: language, viewport, the skip link and #main landmark, the
 * design system, and the pre-paint scripts.
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
        <meta name="theme-color" content="#292B88" />
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

        {/* Must run before first paint and before any bundle: sets js-on.
            A React effect would be far too late — .reveal content would
            start hidden for visitors whose JavaScript never runs. */}
        <script dangerouslySetInnerHTML={{ __html: jsOnScript }} />
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
  // Re-keying on pathname restarts the enter animation on every navigation.
  // The key is the only reason this wrapper exists; it adds no layout.
  const { pathname } = useLocation();

  return (
    <div key={pathname} className="route-fade">
      <Outlet />
    </div>
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
