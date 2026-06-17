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

// Check imagePrompts.js parses without errors (ISS-028)
try {
  require('./client/src/utils/imagePrompts.js');
  console.log('  imagePrompts.js: parses OK');
} catch(e) { errors.push('imagePrompts.js PARSE ERROR: ' + e.message); }

// Check series episode count matches totalEpisodes
try {
  const { SERIES } = require('./client/src/data/series.js');
  SERIES.filter(Boolean).forEach(s => {
    if (s.totalEpisodes && s.episodes && s.episodes.length !== s.totalEpisodes) {
      errors.push('Series ' + s.id + ': episodes.length (' + s.episodes.length + ') !== totalEpisodes (' + s.totalEpisodes + ')');
    }
  });
  console.log('  series episode counts: verified');
} catch(e) { /* already checked above */ }

// Check for duplicate IDs across all data files
try {
  const { SERIES } = require('./client/src/data/series.js');
  const { CULTURAL_LESSONS } = require('./client/src/data/culturalLessons.js');
  const { COLLECTIONS } = require('./client/src/data/collections.js');
  const allIds = [];
  SERIES.filter(Boolean).forEach(s => {
    allIds.push(s.id);
    if (s.episodes) s.episodes.forEach(ep => allIds.push(ep.id));
  });
  CULTURAL_LESSONS.filter(Boolean).forEach(l => allIds.push(l.id));
  COLLECTIONS.filter(Boolean).forEach(c => {
    allIds.push(c.id);
    if (c.stories) c.stories.forEach(s => allIds.push(s.id));
  });
  const seen = {};
  const dupes = [];
  allIds.forEach(id => {
    if (seen[id]) dupes.push(id);
    seen[id] = true;
  });
  if (dupes.length > 0) errors.push('Duplicate IDs found: ' + dupes.join(', '));
  else console.log('  unique IDs: ' + allIds.length + ' IDs, no duplicates');
} catch(e) { errors.push('Duplicate ID check failed: ' + e.message); }

// Check blog index is up-to-date
try {
  const blogDir = require('path').join('client', 'public', 'blog');
  const blogFiles = require('fs').readdirSync(blogDir).filter(f => f.endsWith('.html') && f !== 'index.html').length;
  const indexContent = require('fs').readFileSync(require('path').join(blogDir, 'index.html'), 'utf8');
  const indexPosts = (indexContent.match(/data-post/g) || []).length;
  if (blogFiles > indexPosts) errors.push('Blog index has ' + indexPosts + ' entries but found ' + blogFiles + ' blog files — run: node scripts/generate-blog-index.js');
  else console.log('  blog index: ' + blogFiles + ' posts, index up-to-date');
} catch(e) { errors.push('Blog index check failed: ' + e.message); }

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

# ── 3. Unescaped apostrophes in imagePrompts.js (ISS-028) ──
echo "  🔤 Checking for unescaped apostrophes in imagePrompts.js..."
APOSTROPHE_HITS=$(grep -n "': '.*[^\\\\]'[a-z]" client/src/utils/imagePrompts.js 2>/dev/null || true)
if [ -n "$APOSTROPHE_HITS" ]; then
  echo "  ❌ Unescaped apostrophes found in imagePrompts.js:"
  echo "$APOSTROPHE_HITS"
  FAIL=1
fi

# ── 4. CloudFront bundle hash check ──
echo "  🔗 Checking bundle hash in build output..."
if [ -f client/dist/index.html ]; then
  BUNDLE_HASH=$(grep -o 'index-[a-zA-Z0-9]*\.js' client/dist/index.html || true)
  if [ -n "$BUNDLE_HASH" ]; then
    echo "  Bundle: $BUNDLE_HASH"
  else
    echo "  ⚠️  No bundle hash found in dist/index.html — check Vite output"
  fi
else
  echo "  ⚠️  dist/index.html not found (build may not have run)"
fi

# ── 5. Lambda env vars check (ISS-031) ──
echo "  🔑 Checking Lambda env vars..."
LAMBDA_KEYS=$(aws lambda get-function-configuration --function-name mysleepytale-api --region us-east-1 --query 'Environment.Variables' --output json 2>/dev/null || echo "{}")
for KEY in ANTHROPIC_API_KEY OPENAI_API_KEY ELEVENLABS_API_KEY; do
  HAS_KEY=$(echo "$LAMBDA_KEYS" | grep -c "\"$KEY\"" || true)
  if [ "$HAS_KEY" = "0" ]; then
    echo "  ❌ Lambda missing $KEY"
    FAIL=1
  fi
done
# Check generate-story.js guards Firestore calls (ISS-031 prevention)
if grep -q "initializeApp(" api/generate-story.js && ! grep -q "serviceAccount)" api/generate-story.js; then
  echo "  ❌ generate-story.js initializes Firebase without checking credentials (ISS-031)"
  FAIL=1
fi
echo "  Lambda env vars: OK"

# ── 6. Story generation API health (non-blocking) ──
echo "  🌐 API health check (non-blocking)..."
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "https://mysleepytale.com/api/health" 2>/dev/null || echo "timeout")
if [ "$API_STATUS" = "200" ]; then
  echo "  API: healthy (200)"
elif [ "$API_STATUS" = "timeout" ]; then
  echo "  ⚠️  API health check timed out (non-blocking, continuing)"
else
  echo "  ⚠️  API returned $API_STATUS (non-blocking, continuing)"
fi

if [ $FAIL -ne 0 ]; then
  echo ""
  echo "🚫 DEPLOY BLOCKED — fix errors above before deploying"
  exit 1
fi

echo "✅ Pre-deploy checks passed"
