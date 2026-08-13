#!/usr/bin/env node

/**
 * Verify internal links in prerendered HTML files.
 *
 * Checks that all internal links (<a href="/...">) point to valid routes
 * that exist in the prerendered output.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist', 'client');

// Find all index.html files
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

// Extract internal links from HTML
function extractInternalLinks(html) {
  const linkRegex = /<a[^>]+href="([^"]*)"[^>]*>/g;
  const links = [];
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    // Only internal links (start with / but not //)
    if (href.startsWith('/') && !href.startsWith('//')) {
      links.push(href);
    }
  }

  return [...new Set(links)]; // Remove duplicates
}

// Check if a route exists in prerendered output
function routeExists(route) {
  // Normalize route to directory form
  let normalized = route;

  // Remove query string and hash
  normalized = normalized.split('?')[0].split('#')[0];

  // Ensure trailing slash
  if (!normalized.endsWith('/')) {
    normalized += '/';
  }

  // Convert to file path
  const filePath = join(distDir, normalized.slice(1), 'index.html');

  try {
    statSync(filePath);
    return true;
  } catch {
    return false;
  }
}

// Main verification
const htmlFiles = findHtmlFiles(distDir);
console.log(`Found ${htmlFiles.length} HTML files\n`);

const allLinks = new Map(); // route -> Set of pages that link to it
const brokenLinks = new Map(); // broken link -> Set of pages that have it

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf-8');
  const links = extractInternalLinks(html);

  // Get route from file path
  const route = file
    .replace(distDir, '')
    .replace(/\\/g, '/')
    .replace('/index.html', '/');

  for (const link of links) {
    if (!allLinks.has(link)) {
      allLinks.set(link, new Set());
    }
    allLinks.get(link).add(route);

    // Check if link is broken
    if (!routeExists(link)) {
      if (!brokenLinks.has(link)) {
        brokenLinks.set(link, new Set());
      }
      brokenLinks.get(link).add(route);
    }
  }
}

console.log(`Checked ${allLinks.size} unique internal links\n`);

if (brokenLinks.size === 0) {
  console.log('✓ All internal links are valid');
  process.exit(0);
} else {
  console.log(`✗ Found ${brokenLinks.size} broken links:\n`);

  for (const [link, pages] of brokenLinks.entries()) {
    console.log(`  ${link}`);
    console.log(`    Referenced by ${pages.size} page(s):`);
    for (const page of Array.from(pages).slice(0, 3)) {
      console.log(`      - ${page}`);
    }
    if (pages.size > 3) {
      console.log(`      ... and ${pages.size - 3} more`);
    }
    console.log();
  }

  process.exit(1);
}
