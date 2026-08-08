#!/usr/bin/env node

/**
 * Emits robots.txt and sitemap.xml into the build output.
 *
 * docs/AUDIT.md section 9 recorded both as missing on a 392-page
 * institutional site, and recommendation 4 asked for them to be generated
 * "from the same route list that drives prerendering — they cannot drift if
 * generated from one source". That is what this does: the route list is read
 * out of react-router.config.ts, so a route added to the prerender list is in
 * the sitemap by construction and cannot be forgotten.
 *
 * Base URL comes from SITE_URL. It has no default on purpose — a sitemap
 * carrying the wrong origin is worse than no sitemap, because search engines
 * will fetch and cache the wrong canonical set. Without SITE_URL the script
 * emits robots.txt (which needs no origin) and skips the sitemap loudly.
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const outDir = join(root, 'dist', 'client');

const siteUrl = (process.env.SITE_URL ?? '').replace(/\/+$/, '');

/** Routes that must never be indexed, even though they are prerendered. */
const NOINDEX = new Set(['/404', '/500', '/maintenance']);

function readPrerenderRoutes() {
  const config = readFileSync(join(root, 'react-router.config.ts'), 'utf-8');
  const block = config.slice(
    config.indexOf('prerender: ['),
    config.indexOf('],', config.indexOf('prerender: [')),
  );
  return [...block.matchAll(/['"](\/[^'"]*)['"]/g)].map((m) => m[1]);
}

const routes = readPrerenderRoutes();
const indexable = routes.filter((r) => !NOINDEX.has(r));

// ---- robots.txt ----
const robots = [
  'User-agent: *',
  'Allow: /',
  '',
  ...[...NOINDEX].map((r) => `Disallow: ${r}/`),
  '',
  ...(siteUrl ? [`Sitemap: ${siteUrl}/sitemap.xml`, ''] : []),
].join('\n');

writeFileSync(join(outDir, 'robots.txt'), robots, 'utf-8');

// ---- sitemap.xml ----
if (!siteUrl) {
  console.log(
    `  robots.txt written (${routes.length} routes scanned)\n` +
      '  sitemap.xml SKIPPED — set SITE_URL to the production origin\n' +
      '    e.g. SITE_URL=https://cas.res.in npm run build',
  );
  process.exit(0);
}

const lastmod = new Date().toISOString().slice(0, 10);
const urls = indexable
  .map((route) => {
    // Directory-form, matching the shape the whole migration preserves.
    const loc = route === '/' ? `${siteUrl}/` : `${siteUrl}${route}/`;
    const priority =
      route === '/' ? '1.0' : route.split('/').length <= 2 ? '0.8' : '0.6';
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

writeFileSync(join(outDir, 'sitemap.xml'), sitemap, 'utf-8');

console.log(
  `  robots.txt + sitemap.xml written — ${indexable.length} indexable of ${routes.length} routes`,
);
