import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from 'react-router';

import { Container, Header, Footer } from '~/components';
import { ThemeProvider } from '~/theme/ThemeProvider';
import { chromeHeightScript, prePaintScript } from '~/theme/theme-script';

import './styles/tokens.css';
import './styles/base.css';

import type { Route } from './+types/root';

/**
 * RootLayout — the document shell for every page.
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

        <script dangerouslySetInnerHTML={{ __html: prePaintScript }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>

        <Header />

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
    <Container width="prose">
      <h1>{heading}</h1>
      <p>{detail}</p>
    </Container>
  );
}
