#!/usr/bin/env node

/**
 * Verify SEO metadata in prerendered HTML files.
 *
 * Checks that all pages have:
 * - <title> tag
 * - meta description
 * - lang attribute
 * - viewport meta tag
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

// Get route from file path
function getRoute(file) {
  return file
    .replace(distDir, '')
    .replace(/\\/g, '/')
    .replace('/index.html', '/');
}

// Check metadata
function checkMetadata(html) {
  const issues = [];

  // Check title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
  if (!titleMatch) {
    issues.push('Missing <title> tag');
  } else if (titleMatch[1].trim().length === 0) {
    issues.push('Empty <title> tag');
  }

  // Check meta description
  const descMatch = html.match(
    /<meta[^>]+name="description"[^>]+content="([^"]*)"/,
  );
  if (!descMatch) {
    issues.push('Missing meta description');
  } else if (descMatch[1].trim().length === 0) {
    issues.push('Empty meta description');
  }

  // Check lang attribute
  if (!html.includes('<html lang="')) {
    issues.push('Missing lang attribute on <html>');
  }

  // Check viewport
  if (!html.includes('<meta name="viewport"')) {
    issues.push('Missing viewport meta tag');
  }

  return issues;
}

// Main verification
const htmlFiles = findHtmlFiles(distDir);
console.log(`Checking metadata for ${htmlFiles.length} pages\n`);

const pageIssues = new Map();

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf-8');
  const route = getRoute(file);
  const issues = checkMetadata(html);

  if (issues.length > 0) {
    pageIssues.set(route, issues);
  }
}

if (pageIssues.size === 0) {
  console.log('✓ All pages have complete metadata');
  process.exit(0);
} else {
  console.log(`✗ Found ${pageIssues.size} pages with metadata issues:\n`);

  for (const [route, issues] of pageIssues.entries()) {
    console.log(`  ${route}`);
    for (const issue of issues) {
      console.log(`    - ${issue}`);
    }
    console.log();
  }

  process.exit(1);
}
