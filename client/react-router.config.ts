import type { Config } from '@react-router/dev/config';

export default {
  // The design spec lays the app out as src/components, src/routes, src/styles
  // rather than React Router's default `app/`. See
  // docs/superpowers/specs/2026-08-07-react-migration-design.md section 5.
  appDirectory: 'src',

  // NOT the default `build/`. The repository root already contains build/ —
  // the Python static site generator — and this app is nested one level down,
  // so a default-named output directory invites confusion between the two
  // during the stages where both exist.
  buildDirectory: 'dist',

  // Prerendered SPA: loaders run at build time and every listed URL is written
  // as a complete HTML document, then hydrates client-side. This is the
  // mechanism that keeps 392 indexed URLs crawlable without a server.
  ssr: false,

  // S1 probe set only. These three shapes cover every URL form in the live
  // site: root, single-segment, and deep path with a dynamic segment. The full
  // 392-URL list arrives at S4, generated from the data layer.
  prerender: [
    '/',
    '/about',
    '/people/faculty/vijay-singh',
    '/people/faculty/parul-singh',
  ],
} satisfies Config;
