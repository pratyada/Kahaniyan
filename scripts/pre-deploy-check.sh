#!/bin/bash
# Pre-deploy validation — catches data bugs BEFORE they hit production.
# Runs automatically at the start of deploy.sh
# Exit code 1 = deployment blocked.

set -e
echo "🔍 Pre-deploy checks..."

FAIL=0

# ── 1. Build must succeed ──
echo "  📦 Build check..."
cd client && npm run build --silent 2>&1 | tail -1
if [ $? -ne 0 ]; then echo "  ❌ Build failed"; FAIL=1; fi
cd ..

# ── 2. Data integrity checks ──
echo "  📊 Data integrity..."

node -e "
const errors = [];

// Check series.js
try {
  const { SERIES } = require('./client/src/data/series.js');
  const undef = SERIES.filter(s => !s);
  if (undef.length > 0) errors.push('series.js has ' + undef.length + ' undefined entries (trailing comma?)');
  SERIES.filter(Boolean).forEach(s => {
    if (!s.id) errors.push('Series missing id: ' + JSON.stringify(s).substring(0, 50));
    if (!s.episodes || !Array.isArray(s.episodes)) errors.push('Series ' + s.id + ' missing episodes array');
    if (s.episodes) s.episodes.forEach(ep => {
      if (!ep.id) errors.push('Episode missing id in series ' + s.id);
      if (!ep.body) errors.push('Episode ' + ep.id + ' has no body text');
      if (!ep.title) errors.push('Episode ' + ep.id + ' has no title');
    });
  });
  console.log('  series.js: ' + SERIES.filter(Boolean).length + ' series, ' + SERIES.filter(Boolean).reduce((a,s) => a + s.episodes.length, 0) + ' episodes');
} catch(e) { errors.push('series.js PARSE ERROR: ' + e.message); }

// Check culturalLessons.js
try {
  const { CULTURAL_LESSONS } = require('./client/src/data/culturalLessons.js');
  const undef = CULTURAL_LESSONS.filter(s => !s);
  if (undef.length > 0) errors.push('culturalLessons.js has ' + undef.length + ' undefined entries');
  CULTURAL_LESSONS.filter(Boolean).forEach(l => {
    if (!l.id) errors.push('Lesson missing id');
    if (!l.body) errors.push('Lesson ' + l.id + ' has no body text');
    if (!l.tradition) errors.push('Lesson ' + l.id + ' has no tradition');
  });
  console.log('  culturalLessons.js: ' + CULTURAL_LESSONS.filter(Boolean).length + ' stories');
} catch(e) { errors.push('culturalLessons.js PARSE ERROR: ' + e.message); }

// Check collections.js
try {
  const { COLLECTIONS } = require('./client/src/data/collections.js');
  const undef = COLLECTIONS.filter(s => !s);
  if (undef.length > 0) errors.push('collections.js has ' + undef.length + ' undefined entries');
  const totalStories = COLLECTIONS.filter(Boolean).reduce((a,c) => a + c.stories.length, 0);
  console.log('  collections.js: ' + COLLECTIONS.filter(Boolean).length + ' collections, ' + totalStories + ' stories');
} catch(e) { errors.push('collections.js PARSE ERROR: ' + e.message); }

// Check FR translations exist and match
try {
  const { CULTURAL_LESSONS: EN } = require('./client/src/data/culturalLessons.js');
  const { CULTURAL_LESSONS: FR } = require('./client/src/data/culturalLessons.fr.js');
  if (FR.length < EN.length) errors.push('FR lessons (' + FR.length + ') < EN lessons (' + EN.length + ') — translations missing');
  const frUndef = FR.filter(s => !s);
  if (frUndef.length > 0) errors.push('culturalLessons.fr.js has ' + frUndef.length + ' undefined entries');
} catch(e) { /* FR file may not exist yet, that's OK */ }

// Check locale JSON files parse
try {
  require('./client/src/locales/en.json');
  require('./client/src/locales/fr.json');
  require('./client/src/locales/es.json');
  console.log('  locale files: en.json, fr.json, es.json OK');
} catch(e) { errors.push('Locale JSON parse error: ' + e.message); }

// Check sitemap.xml is valid
try {
  const fs = require('fs');
  const sitemap = fs.readFileSync('client/public/sitemap.xml', 'utf8');
  if (!sitemap.includes('</urlset>')) errors.push('sitemap.xml is malformed (no closing </urlset>)');
  const urlCount = (sitemap.match(/<loc>/g) || []).length;
  console.log('  sitemap.xml: ' + urlCount + ' URLs');
} catch(e) { errors.push('sitemap.xml read error: ' + e.message); }

// Report
if (errors.length > 0) {
  console.error('');
  console.error('❌ ' + errors.length + ' error(s) found:');
  errors.forEach(e => console.error('  → ' + e));
  process.exit(1);
} else {
  console.log('  ✅ All data checks passed');
}
" 2>&1

if [ $? -ne 0 ]; then
  echo ""
  echo "🚫 DEPLOY BLOCKED — fix errors above before deploying"
  exit 1
fi

echo "✅ Pre-deploy checks passed"
