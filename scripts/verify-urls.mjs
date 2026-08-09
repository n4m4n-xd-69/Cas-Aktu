/**
 * URL parity gate. Runs after every build (see package.json "build").
 *
 * The 392 public URLs of this site are already indexed at cas.res.in in
 * directory form — /about/, /people/faculty/vijay-singh/. A build that emitted
 * about.html instead of about/index.html would silently change every one of
 * them. React Router 8 gets this right by default, which S1 established
 * empirically; this script exists so that it stays right, because the failure
 * is invisible until traffic drops.
 *
 * Checks, per prerendered URL:
 *   1. the directory-form file exists
 *   2. no flat sibling (about.html) exists alongside it
 *   3. the document has a <title>
 *   4. <main> is not empty — a crawler must receive content, not a shell
 *
 * Exits non-zero on any failure so the build fails loudly.
 */
import { readFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

// pathToFileURL, not the bare path: on Windows an absolute path starts with a
// drive letter, which Node's ESM loader reads as an unsupported "c:" URL
// scheme. Relies on Node >= 22 stripping the config's TypeScript types.
const config = (
  await import(pathToFileURL(join(ROOT, 'react-router.config.ts')).href)
).default;
const outDir = join(ROOT, config.buildDirectory ?? 'build', 'client');
const urls = config.prerender ?? [];

if (!Array.isArray(urls) || urls.length === 0) {
  console.error(
    'verify-urls: no prerender list found in react-router.config.ts',
  );
  process.exit(1);
}

const exists = async (p) =>
  access(p).then(
    () => true,
    () => false,
  );

/** "/about" -> "about/index.html";  "/" -> "index.html" */
const expectedFile = (url) => {
  const clean = url.replace(/^\/+|\/+$/g, '');
  return clean === '' ? 'index.html' : join(...clean.split('/'), 'index.html');
};

const results = [];
for (const url of urls) {
  const rel = expectedFile(url);
  const abs = join(outDir, rel);
  const problems = [];

  if (!(await exists(abs))) {
    problems.push('missing');
  } else {
    const html = await readFile(abs, 'utf8');
    if (!/<title>[^<]+<\/title>/i.test(html)) problems.push('no <title>');
    const main = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    if (!main) problems.push('no <main>');
    else if (main[1].replace(/<[^>]+>/g, '').trim().length === 0) {
      problems.push('<main> is empty (shell only)');
    }
  }

  // A flat sibling means the output shape has drifted.
  const clean = url.replace(/^\/+|\/+$/g, '');
  if (clean && (await exists(join(outDir, `${clean}.html`)))) {
    problems.push(`flat sibling ${clean}.html also emitted`);
  }

  results.push({ url, rel, problems });
}

const failed = results.filter((r) => r.problems.length > 0);
const pad = Math.max(...results.map((r) => r.url.length));

console.log('\nURL parity — prerender output shape');
for (const r of results) {
  const status = r.problems.length === 0 ? 'ok  ' : 'FAIL';
  console.log(
    `  ${status}  ${r.url.padEnd(pad)}  ->  ${r.rel.replace(/\\/g, '/')}` +
      (r.problems.length ? `   [${r.problems.join('; ')}]` : ''),
  );
}

if (failed.length) {
  console.error(
    `\nverify-urls: ${failed.length} of ${results.length} URLs failed. ` +
      `Public URLs would change shape — see docs/superpowers/specs/` +
      `2026-08-07-react-migration-design.md section 3.2.\n`,
  );
  process.exit(1);
}

console.log(
  `\n  ${results.length}/${results.length} URLs verified in directory form\n`,
);
