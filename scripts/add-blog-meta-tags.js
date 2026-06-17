#!/usr/bin/env node
/**
 * add-blog-meta-tags.js
 * One-time migration: adds blog:category, blog:tag, blog:reading-time
 * (and optional blog:featured / blog:featured-label) meta tags to all
 * existing blog posts in client/public/blog/.
 *
 * Zero npm dependencies — uses only fs and path.
 *
 * Usage:  node scripts/add-blog-meta-tags.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_DIR = path.join(__dirname, '..', 'client', 'public', 'blog');

// ── Exact mapping from the static index ──────────────────────────────
const META_MAP = {
  'vozinha-cape-verde-world-cup-hero':           { cat: 'fifa',       tag: '🧤 Trending — FIFA 2026',  min: 8,  featured: true, featuredLabel: '🧤 Trending — FIFA 2026' },
  'fifa-world-cup-kids-audiobook':               { cat: 'fifa',       tag: '⚽ New Series — Live Now',  min: 8,  featured: true, featuredLabel: '⚽ New Series — Live Now' },
  'fifa-world-cup-dallas-kids-audiobook':         { cat: 'fifa',       tag: '⚽ New Series — Dallas',   min: 8,  featured: true, featuredLabel: '⚽ New Series — Dallas' },
  'jean-lumb-kindergarten-bedtime-stories-toronto': { cat: 'toronto', tag: 'Featured',                 min: 8,  featured: true, featuredLabel: 'Featured' },
  'why-kids-love-who-would-win':                 { cat: 'psychology', tag: 'Psychology',                min: 7 },
  'why-kids-love-cars-buses':                    { cat: 'psychology', tag: 'Psychology',                min: 6 },
  'why-kids-love-planets':                       { cat: 'psychology', tag: 'Psychology',                min: 6 },
  'why-kids-love-sports-stories':                { cat: 'psychology', tag: 'Psychology',                min: 6 },
  'why-kids-need-superhero-stories':             { cat: 'psychology', tag: 'Psychology',                min: 6 },
  'why-family-stories-matter':                   { cat: 'psychology', tag: 'Research',                  min: 7 },
  'why-kids-love-countries':                     { cat: 'psychology', tag: 'Global',                    min: 6 },
  'why-bedtime-stories-matter':                  { cat: 'guide',      tag: 'Guide',                    min: 5 },
  'best-bedtime-story-app-2026':                 { cat: 'comparison', tag: 'Comparison',                min: 7 },
  'best-bedtime-story-app-toronto':              { cat: 'toronto',    tag: 'Toronto',                  min: 8 },
  'indian-bedtime-stories':                      { cat: 'culture',    tag: 'Hindu · Indian',           min: 6 },
  'islamic-stories-for-kids':                    { cat: 'culture',    tag: 'Islamic',                  min: 6 },
  'technology-stack':                            { cat: 'guide',      tag: 'Engineering',              min: 10 },
  'multilingual-bedtime-stories':                { cat: 'guide',      tag: 'Multilingual',             min: 6 },
  'belief-stories-for-kids':                     { cat: 'culture',    tag: 'Values',                   min: 7 },
  'security-improvements-guide':                 { cat: 'guide',      tag: 'Security',                 min: 6 },
  'private-series-contributor-guide':            { cat: 'creators',   tag: 'New Feature',              min: 8 },
  'email-notifications-guide':                   { cat: 'guide',      tag: 'Transparency',             min: 6 },
  'become-a-creator':                            { cat: 'creators',   tag: 'Creator Guide',            min: 10 },
  'creator-credits-guide':                       { cat: 'creators',   tag: 'Credits',                  min: 5 },
  'rainbow-kindergarten-series-2026':            { cat: 'creators',   tag: 'Series Spotlight',         min: 5 },
  'series-launch-little-astronaut':              { cat: 'psychology', tag: 'Series',                   min: 4 },
  'series-launch-animal-battles':                { cat: 'psychology', tag: 'Series',                   min: 4 },
  'series-launch-camping-outdoors':              { cat: 'psychology', tag: 'Series',                   min: 4 },
  'series-launch-music-lessons':                 { cat: 'psychology', tag: 'Series',                   min: 4 },
  'series-launch-water-and-swim':                { cat: 'psychology', tag: 'Series',                   min: 4 },
  'series-launch-maths-adventures':              { cat: 'psychology', tag: 'Series',                   min: 4 },
  'series-launch-geometry-shapes':               { cat: 'psychology', tag: 'Series',                   min: 4 },
  'series-launch-discover-india':                { cat: 'culture',    tag: 'Series',                   min: 4 },
  'series-launch-tallest-towers':                { cat: 'psychology', tag: 'Series',                   min: 4 },
  'series-launch-planets-and-stars':             { cat: 'psychology', tag: 'Series',                   min: 4 },
  'screen-free-bedtime-routines':                { cat: 'guide',      tag: 'Guide',                    min: 8 },
  'kindergarten-learning-through-bedtime-stories': { cat: 'toronto',  tag: 'Toronto',                  min: 7 },
  'hispanic-bedtime-stories-for-kids':           { cat: 'culture',    tag: 'Cultural',                 min: 8 },
  'bluey-bingo-niagara-victoria-day':            { cat: 'toronto',    tag: 'Toronto',                  min: 5 },
  'hindi-bedtime-stories':                       { cat: 'culture',    tag: 'Hindu · Indian',           min: 6 },
};

const DEFAULTS = { cat: 'guide', tag: 'Guide', min: 5 };

// ── Main ─────────────────────────────────────────────────────────────
function run() {
  const files = fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.html') && f !== 'index.html')
    .sort();

  let added = 0;
  let skipped = 0;
  const warnings = [];

  for (const file of files) {
    const filePath = path.join(BLOG_DIR, file);
    let html = fs.readFileSync(filePath, 'utf8');
    const slug = file.replace(/\.html$/, '');

    // Re-run safety: skip if meta tags already present
    if (html.includes('name="blog:category"')) {
      skipped++;
      continue;
    }

    // Look up mapping
    let meta = META_MAP[slug];
    if (!meta) {
      meta = DEFAULTS;
      warnings.push(`WARNING: No mapping for "${slug}" — using defaults (cat=guide, tag=Guide, min=5)`);
    }

    // Build the meta tag block
    let metaBlock = '';
    metaBlock += `  <meta name="blog:category" content="${meta.cat}">\n`;
    metaBlock += `  <meta name="blog:tag" content="${meta.tag}">\n`;
    metaBlock += `  <meta name="blog:reading-time" content="${meta.min}">`;
    if (meta.featured) {
      metaBlock += `\n  <meta name="blog:featured" content="true">`;
      metaBlock += `\n  <meta name="blog:featured-label" content="${meta.featuredLabel}">`;
    }

    // Insert AFTER the <meta name="description"...> line
    const descRegex = /(<meta\s+name="description"\s+content="[^"]*">)/;
    const match = html.match(descRegex);
    if (!match) {
      warnings.push(`WARNING: No <meta name="description"> found in "${file}" — skipping`);
      skipped++;
      continue;
    }

    html = html.replace(descRegex, match[1] + '\n' + metaBlock);
    fs.writeFileSync(filePath, html, 'utf8');
    added++;
  }

  // Summary
  console.log(`Added meta tags to ${added} files, skipped ${skipped}`);
  for (const w of warnings) {
    console.log(w);
  }
}

run();
