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

  // S4 prerender list.
  // Group 1 (Home): 1 route
  // Group 2 (Core): 7 routes
  // Group 3 (Academics): 14 routes
  // S1 probe routes (/people/faculty/*) remain until Group 4 replaces them.
  prerender: [
    '/',
    '/about',
    '/contact',
    '/campus',
    '/admissions',
    '/search',
    '/accessibility',
    '/sitemap',
    '/academics',
    '/academics/btech',
    '/academics/mtech',
    '/academics/phd',
    '/academics/programs',
    '/academics/programs/mtech-cse',
    '/academics/programs/mtech-nanotechnology',
    '/academics/programs/mtech-energy-science-technology',
    '/academics/programs/mtech-mechatronics',
    '/academics/programs/mtech-manufacturing-technology-automation',
    '/academics/programs/phd-cse',
    '/academics/programs/phd-mechatronics',
    '/academics/programs/phd-nanotechnology',
    '/academics/programs/btech',
    '/people/faculty/vijay-singh',
    '/people/faculty/parul-singh',
  ],
} satisfies Config;
