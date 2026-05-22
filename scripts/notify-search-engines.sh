#!/bin/bash
# Notify search engines of new/updated content after deploy.
# Runs automatically at the end of deploy.sh
#
# 1. Ping Google & Bing with sitemap URL
# 2. IndexNow → Bing, Yandex, Seznam (instant indexing)
# 3. Extracts all URLs from sitemap and submits them

SITE="https://mysleepytale.com"
SITEMAP="${SITE}/sitemap.xml"
INDEXNOW_KEY="18137a4143436357685e617a0d601e4f"

echo "🔍 Notifying search engines..."

# ── 1. Sitemap ping (Google + Bing) ──
echo "  📡 Pinging Google sitemap..."
curl -s "https://www.google.com/ping?sitemap=${SITEMAP}" > /dev/null 2>&1 && echo "    ✓ Google pinged" || echo "    ✗ Google ping failed"

echo "  📡 Pinging Bing sitemap..."
curl -s "https://www.bing.com/ping?sitemap=${SITEMAP}" > /dev/null 2>&1 && echo "    ✓ Bing pinged" || echo "    ✗ Bing ping failed"

# ── 2. IndexNow (Bing, Yandex, Seznam — instant indexing) ──
# Extract all URLs from sitemap
URLS=$(curl -s "${SITEMAP}" | grep -oP '(?<=<loc>)[^<]+' 2>/dev/null || \
       curl -s "${SITEMAP}" | sed -n 's:.*<loc>\(.*\)</loc>.*:\1:p')

URL_COUNT=$(echo "$URLS" | wc -l | tr -d ' ')
echo "  📋 Found ${URL_COUNT} URLs in sitemap"

# Build JSON payload for IndexNow batch submission
URL_JSON=$(echo "$URLS" | awk '{printf "    \"%s\"", $0; if(NR>0) printf ",\n"}' | sed '$ s/,$//')

PAYLOAD=$(cat <<EOF
{
  "host": "mysleepytale.com",
  "key": "${INDEXNOW_KEY}",
  "keyLocation": "${SITE}/${INDEXNOW_KEY}.txt",
  "urlList": [
${URL_JSON}
  ]
}
EOF
)

# Submit to IndexNow endpoints
for ENGINE in "api.indexnow.org" "www.bing.com" "yandex.com"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    "https://${ENGINE}/indexnow" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" 2>/dev/null)
  if [ "$STATUS" = "200" ] || [ "$STATUS" = "202" ]; then
    echo "    ✓ IndexNow → ${ENGINE} (${STATUS})"
  else
    echo "    ✗ IndexNow → ${ENGINE} (${STATUS})"
  fi
done

echo "  ✅ Search engine notifications complete (${URL_COUNT} URLs submitted)"
