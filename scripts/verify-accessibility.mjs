#!/usr/bin/env node

/**
 * Basic accessibility checks for prerendered HTML.
 *
 * Checks for common WCAG AA issues:
 * - Images without alt text
 * - Form inputs without labels
 * - Buttons without accessible text
 * - Links without text
 * - Heading hierarchy
 * - Skip links
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist', 'client');

function findHtmlFiles(dir, files = []) {
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory() && entry !== '.vite' && entry !== 'assets') {
      findHtmlFiles(fullPath, files);
    } else if (entry === 'index.html') {
      files.push(fullPath);
    }
  }

  return files;
}

function getRoute(file) {
  return file
    .replace(distDir, '')
    .replace(/\\/g, '/')
    .replace('/index.html', '/');
}

function checkAccessibility(html, route) {
  const issues = [];

  // Check for images without alt
  const imgRegex = /<img[^>]*>/g;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    const img = match[0];
    if (!img.includes('alt=')) {
      issues.push('Image without alt attribute');
      break; // Only report once per page
    }
  }

  // Check for form inputs without labels
  const inputRegex = /<input[^>]*type="(?!hidden)[^"]*"[^>]*>/g;
  while ((match = inputRegex.exec(html)) !== null) {
    const input = match[0];
    if (!input.includes('aria-label=') && !input.includes('id=')) {
      issues.push('Form input without label or aria-label');
      break;
    }
  }

  // Check for buttons without accessible text
  const buttonRegex = /<button[^>]*>([^<]*)<\/button>/g;
  while ((match = buttonRegex.exec(html)) !== null) {
    const button = match[0];
    const text = match[1].trim();
    if (text.length === 0 && !button.includes('aria-label=')) {
      issues.push('Button without accessible text');
      break;
    }
  }

  // Check for empty links
  const linkRegex = /<a[^>]*>([^<]*)<\/a>/g;
  while ((match = linkRegex.exec(html)) !== null) {
    const link = match[0];
    const text = match[1].trim();
    if (text.length === 0 && !link.includes('aria-label=')) {
      issues.push('Link without accessible text');
      break;
    }
  }

  // Check for skip link (only on home page)
  if (route === '/') {
    if (!html.includes('skip-link') && !html.includes('Skip to')) {
      issues.push('Missing skip link');
    }
  }

  // Check for main landmark
  if (!html.includes('<main') && !html.includes('role="main"')) {
    issues.push('Missing main landmark');
  }

  // Heading order — WCAG 1.3.1 (Level A).
  //
  // Added at S9. docs/AUDIT.md section 8 measured this defect on 142 of the
  // 392 legacy pages (always h1 -> h3, one shared template reproduced 142
  // times) and HANDOFF.md listed fixing it as an S4 contract. It was not
  // fixed, and this checker did not look for it, so it survived S4 through
  // S8 and was only caught when Lighthouse flagged /documents/ at S9.
  //
  // Only headings inside <main> are considered: the header and footer are
  // site chrome and their headings are not part of the page outline. The
  // slice must be bounded at </main> — taking everything after <main>
  // swept in the footer's <h3> column titles and reported a skip on all
  // 392 pages.
  const mainStart = html.indexOf('<main');
  const mainEnd = html.indexOf('</main>');
  const main =
    mainStart === -1 || mainEnd === -1 ? '' : html.slice(mainStart, mainEnd);
  const levels = [...main.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  let prev = 0;
  for (const level of levels) {
    if (prev && level > prev + 1) {
      issues.push(`Heading order skips h${prev} -> h${level}`);
      break;
    }
    prev = level;
  }

  return issues;
}

// Main verification
const htmlFiles = findHtmlFiles(distDir);
console.log(`Checking accessibility for ${htmlFiles.length} pages\n`);

const pageIssues = new Map();

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf-8');
  const route = getRoute(file);
  const issues = checkAccessibility(html, route);

  if (issues.length > 0) {
    pageIssues.set(route, issues);
  }
}

if (pageIssues.size === 0) {
  console.log('✓ No common accessibility issues found');
  process.exit(0);
} else {
  console.log(
    `⚠ Found ${pageIssues.size} pages with potential accessibility issues:\n`,
  );

  // Show first 10 pages with issues
  let count = 0;
  for (const [route, issues] of pageIssues.entries()) {
    if (count >= 10) {
      console.log(`\n... and ${pageIssues.size - 10} more pages\n`);
      break;
    }
    console.log(`  ${route}`);
    for (const issue of issues) {
      console.log(`    - ${issue}`);
    }
    console.log();
    count++;
  }

  console.log(
    'Note: These are basic checks. Run a full audit with axe or Lighthouse for comprehensive testing.',
  );
  process.exit(0); // Don't fail build for warnings
}
