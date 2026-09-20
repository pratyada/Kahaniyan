#!/usr/bin/env node
/**
 * blog-standardize.mjs — inject ONE canonical header + footer (+ bottom nav) into
 * every blog POST, plus a branded gradient hero for posts that ship without an image.
 *
 * The /blog listing page (index.html) is owned by scripts/generate-blog-index.js
 * (runs on prebuild) and is intentionally SKIPPED here. Both scripts share the same
 * canonical chrome via scripts/blog-chrome.mjs, so posts and index never drift.
 *
 * Idempotent: strips any previously-injected MST marker blocks + known legacy chrome,
 * then re-injects fresh canonical blocks. Safe to run repeatedly.
 *
 *   node scripts/blog-standardize.mjs           # write changes
 *   node scripts/blog-standardize.mjs --check    # report only, no writes
 *
 * SOURCE OF TRUTH: client/public/blog/*.html  (never dist — Vite overwrites dist).
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CHROME_CSS, HEADER, FOOTER, heroHtml } from './blog-chrome.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = join(__dirname, '..', 'client', 'public', 'blog');
// --check reports without writing. (process.argv can be empty in some sandboxes.)
const CHECK = (typeof process !== 'undefined' && Array.isArray(process.argv) && process.argv.includes('--check'));

/* ── Strip helpers ── */
function stripChrome(html) {
  return html
    // previously-injected marker blocks
    .replace(/<!-- MST-HEADER-START -->[\s\S]*?<!-- MST-HEADER-END -->\n?/g, '')
    .replace(/<!-- MST-FOOTER-START -->[\s\S]*?<!-- MST-FOOTER-END -->\n?/g, '')
    .replace(/<!-- MST-HERO-START -->[\s\S]*?<!-- MST-HERO-END -->\n?/g, '')
    .replace(/[ \t]*<style id="mst-blog-chrome">[\s\S]*?<\/style>\n?/g, '')
    // legacy chrome
    .replace(/[ \t]*<div class="topbar">[\s\S]*?<\/div>\s*<\/div>\n?/, '')
    .replace(/[ \t]*<nav class="bottom-nav">[\s\S]*?<\/nav>\n?/g, '')
    .replace(/[ \t]*<nav class="nav">[\s\S]*?<\/nav>\n?/g, '')
    .replace(/[ \t]*<footer[^>]*>[\s\S]*?<\/footer>\n?/g, '')
    // wrap-style inline top nav + legal footer row
    .replace(/[ \t]*<p><a href="\/">← My Sleepy Tale<\/a> · <a href="\/blog\/">Blog<\/a><\/p>\n?/, '')
    .replace(/[ \t]*<hr[^>]*>\s*\n?[ \t]*<p style="font-size:12px;color:#4a4a5a">[\s\S]*?<\/p>\n?/, '');
}

/* ── Process one post file ── */
function process_(file) {
  const slug = file.replace(/\.html$/, '');
  const path = join(BLOG_DIR, file);
  let html = readFileSync(path, 'utf8');
  const before = html;
  html = stripChrome(html);

  // inject chrome CSS before </head>
  if (!html.includes('id="mst-blog-chrome"')) {
    html = html.replace(/<\/head>/, `${CHROME_CSS}\n</head>`);
  }
  // header (+ hero for imageless posts) right after <body>
  html = html.replace(/<body([^>]*)>\n?/, `<body$1>\n${HEADER}${heroHtml(slug)}\n`);
  // footer + bottom nav before </body>
  html = html.replace(/<\/body>/, `${FOOTER}\n</body>`);

  const changed = html !== before;
  if (changed && !CHECK) writeFileSync(path, html);
  return changed;
}

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.html') && f !== 'index.html');
let n = 0;
for (const f of files) if (process_(f)) n++;
console.log(`${CHECK ? '[check] would update' : 'updated'} ${n}/${files.length} posts${CHECK ? ' (no writes)' : ''} (index.html owned by generate-blog-index.js)`);
