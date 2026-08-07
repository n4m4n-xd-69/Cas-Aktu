// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://cas.res.in',

  integrations: [react()],

  build: {
    // 'file' emits about.html rather than about/index.html, which keeps the
    // build reviewable by opening it straight from disk — the workflow the
    // current static site relies on. See docs/MIGRATION_ASTRO.md §5.9.
    //
    // NOTE: this changes canonical URL shape. `trailingSlash` and the
    // canonical tags in BaseLayout compensate so public URLs stay identical
    // to the ones already indexed (docs/INFORMATION_ARCHITECTURE.md §8).
    format: 'file',
    inlineStylesheets: 'never',
  },

  // Public URLs keep their directory form; only the emitted filenames differ.
  trailingSlash: 'ignore',

  vite: {
    build: {
      // The design system is three hand-authored files that are already
      // deduplicated. Splitting them per-route would re-download tokens on
      // every navigation.
      cssCodeSplit: false,
    },
  },
});
