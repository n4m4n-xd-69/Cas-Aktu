import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [reactRouter()],

  // Vite 8 resolves the `paths` in tsconfig.json natively, so the
  // vite-tsconfig-paths plugin is not installed. One less dependency, and one
  // less place for alias config to drift out of sync with TypeScript.
  resolve: { tsconfigPaths: true },

  server: {
    allowedHosts: true,
  },

  css: {
    modules: {
      // Class names stay readable in dev and hash in production. The readable
      // form matters while porting 34 component sections out of
      // components.css: a DevTools inspection should say which module a rule
      // came from without a source-map round trip.
      generateScopedName:
        process.env.NODE_ENV === 'production'
          ? '[hash:base64:6]'
          : '[name]__[local]',
    },
  },

  build: {
    // Surfaces regressions early rather than at S9. The current site ships
    // 99 KB of render-blocking CSS (docs/AUDIT.md section 11); the point of
    // CSS Modules here is that no single route ever loads all of it.
    chunkSizeWarningLimit: 250,
  },
});
