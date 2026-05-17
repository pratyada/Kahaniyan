#!/bin/bash
# Deploy My Sleepy Tale to AWS — run this after git push
# Usage: bash deploy.sh

set -e
echo "🚀 Deploying My Sleepy Tale to AWS..."

# Build
echo "📦 Building..."
cd client && npm run build && cd ..

# Upload assets (long cache)
echo "☁️  Uploading assets..."
aws s3 sync client/dist/assets/ s3://mysleepytale-app/assets/ \
  --delete --cache-control "public, max-age=31536000, immutable" --quiet

# Upload HTML + config (no cache)
echo "📄 Uploading HTML..."
aws s3 cp client/dist/index.html s3://mysleepytale-app/index.html \
  --cache-control "no-cache" --content-type "text/html" --quiet

aws s3 sync client/dist/blog/ s3://mysleepytale-app/blog/ \
  --cache-control "public, max-age=3600" --content-type "text/html" --quiet

aws s3 cp client/dist/robots.txt s3://mysleepytale-app/robots.txt \
  --cache-control "public, max-age=86400" --content-type "text/plain" --quiet

aws s3 cp client/dist/sitemap.xml s3://mysleepytale-app/sitemap.xml \
  --cache-control "public, max-age=3600" --content-type "application/xml" --quiet

# Static files
aws s3 cp client/dist/favicon.svg s3://mysleepytale-app/favicon.svg \
  --cache-control "public, max-age=604800" --quiet 2>/dev/null || true
aws s3 cp client/dist/bg-night.svg s3://mysleepytale-app/bg-night.svg \
  --cache-control "public, max-age=604800" --quiet 2>/dev/null || true

# Deploy API to Lambda
echo "⚡ Deploying API..."
rm -rf /tmp/lambda-pkg /tmp/lambda.zip
mkdir -p /tmp/lambda-pkg
cp -r api /tmp/lambda-pkg/api
cp -r server /tmp/lambda-pkg/server
cp .github/lambda-handler.mjs /tmp/lambda-pkg/index.mjs
cd /tmp/lambda-pkg
echo '{"type":"module","dependencies":{"stripe":"^14.0.0"}}' > package.json
npm install --production --quiet 2>/dev/null
zip -r /tmp/lambda.zip . -x "*.DS_Store" > /dev/null
cd - > /dev/null
aws lambda update-function-code --function-name mysleepytale-api \
  --zip-file fileb:///tmp/lambda.zip --region us-east-1 --query 'LastUpdateStatus' --output text

# Invalidate CloudFront cache
echo "🔄 Invalidating cache..."
aws cloudfront create-invalidation --distribution-id E2SUVVWBBFCBPE \
  --paths "/index.html" "/blog/*" "/robots.txt" "/sitemap.xml" \
  --query 'Invalidation.Status' --output text

echo "✅ Deployed! Live at https://mysleepytale.com"
