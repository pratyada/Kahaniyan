#!/usr/bin/env node
// ──────────────────────────────────────────────────────────────
// migrate-firebase-to-s3.js
// Downloads all story images from Firebase Storage and uploads
// them to S3 (mysleepytale-app bucket).
//
// Usage:  node scripts/migrate-firebase-to-s3.js
// Output: scripts/migration-mapping.json  (episodeId → new S3 URL)
//
// Does NOT update Firestore — run update-firestore-urls.js after
// reviewing the mapping file.
// ──────────────────────────────────────────────────────────────

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { writeFileSync, existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Config ──────────────────────────────────────────────────
const PROJECT_ID = 'qissaa-61a78';
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
const S3_BUCKET = 'mysleepytale-app';
const S3_REGION = 'us-east-1';
const CDN_BASE = 'https://mysleepytale.com';
const S3_KEY_PREFIX = 'media/stories';
const CONCURRENCY = 5;  // parallel downloads/uploads at a time

const s3 = new S3Client({ region: S3_REGION });

// ── Helpers ─────────────────────────────────────────────────

function parseFirestoreFields(fields) {
  const result = {};
  for (const [key, val] of Object.entries(fields || {})) {
    if (val.stringValue !== undefined) result[key] = val.stringValue;
    else if (val.arrayValue) {
      result[key] = (val.arrayValue.values || []).map(v => v.stringValue || '');
    }
  }
  return result;
}

function extFromContentType(ct) {
  if (!ct) return 'jpg';
  if (ct.includes('png')) return 'png';
  if (ct.includes('webp')) return 'webp';
  if (ct.includes('gif')) return 'gif';
  if (ct.includes('svg')) return 'svg';
  return 'jpg'; // default for jpeg and anything else
}

function isFirebaseUrl(url) {
  return url && url.includes('firebasestorage.googleapis.com');
}

function isAlreadyOnS3(url) {
  return url && (url.includes('mysleepytale.com/media') || url.includes('mysleepytale-app.s3'));
}

async function s3KeyExists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} downloading ${url}`);
  const contentType = res.headers.get('content-type') || 'image/jpeg';
  const buffer = Buffer.from(await res.arrayBuffer());
  return { buffer, contentType };
}

async function uploadToS3(key, buffer, contentType) {
  await s3.send(new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'public, max-age=2592000', // 30 days
  }));
  return `${CDN_BASE}/${key}`;
}

// Run tasks in batches of `limit`
async function batchProcess(items, limit, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += limit) {
    const batch = items.slice(i, i + limit);
    const batchResults = await Promise.allSettled(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

// ── Main ────────────────────────────────────────────────────

async function main() {
  console.log('=== Firebase → S3 Image Migration ===\n');

  // 1. Fetch wisdomImages from Firestore REST API
  console.log('[1/4] Fetching wisdomImages from Firestore...');
  const imgRes = await fetch(`${FIRESTORE_URL}/config/wisdomImages`);
  if (!imgRes.ok) {
    console.error(`Failed to fetch wisdomImages: HTTP ${imgRes.status}`);
    process.exit(1);
  }
  const imgData = await imgRes.json();
  const wisdomImages = parseFirestoreFields(imgData.fields);

  // Also fetch wisdomGallery (additional images per episode)
  console.log('[1/4] Fetching wisdomGallery from Firestore...');
  let wisdomGallery = {};
  try {
    const galRes = await fetch(`${FIRESTORE_URL}/config/wisdomGallery`);
    if (galRes.ok) {
      const galData = await galRes.json();
      wisdomGallery = parseFirestoreFields(galData.fields);
    }
  } catch (e) {
    console.warn('  Could not fetch wisdomGallery:', e.message);
  }

  // 2. Categorize entries
  const allEntries = Object.entries(wisdomImages);
  const firebaseEntries = [];
  const skippedS3 = [];
  const skippedOther = [];

  for (const [episodeId, url] of allEntries) {
    if (isAlreadyOnS3(url)) {
      skippedS3.push(episodeId);
    } else if (isFirebaseUrl(url)) {
      firebaseEntries.push({ episodeId, url, type: 'cover' });
    } else {
      skippedOther.push({ episodeId, url });
    }
  }

  // Also process gallery images
  const galleryEntries = [];
  for (const [episodeId, urls] of Object.entries(wisdomGallery)) {
    if (Array.isArray(urls)) {
      urls.forEach((url, idx) => {
        if (isFirebaseUrl(url)) {
          galleryEntries.push({ episodeId, url, type: 'gallery', index: idx });
        }
      });
    }
  }

  console.log(`\n[2/4] Analysis:`);
  console.log(`  Total wisdomImages entries:  ${allEntries.length}`);
  console.log(`  Firebase URLs to migrate:    ${firebaseEntries.length}`);
  console.log(`  Gallery images to migrate:   ${galleryEntries.length}`);
  console.log(`  Already on S3 (skipped):     ${skippedS3.length}`);
  console.log(`  Other URLs (skipped):        ${skippedOther.length}`);

  if (skippedOther.length > 0) {
    console.log('\n  Non-Firebase/non-S3 URLs:');
    skippedOther.slice(0, 10).forEach(({ episodeId, url }) => {
      console.log(`    ${episodeId}: ${url.slice(0, 80)}...`);
    });
    if (skippedOther.length > 10) console.log(`    ... and ${skippedOther.length - 10} more`);
  }

  // 3. Download from Firebase & upload to S3
  const allToMigrate = [...firebaseEntries, ...galleryEntries];
  if (allToMigrate.length === 0) {
    console.log('\nNothing to migrate! All images are already on S3 or non-Firebase.');
    process.exit(0);
  }

  console.log(`\n[3/4] Migrating ${allToMigrate.length} images (${CONCURRENCY} concurrent)...\n`);

  const mapping = {};          // episodeId → new S3 cover URL
  const galleryMapping = {};   // episodeId → [new S3 gallery URLs]
  const errors = [];
  let completed = 0;

  // Resume support: load existing mapping if present
  const mappingPath = join(__dirname, 'migration-mapping.json');
  let existingMapping = {};
  if (existsSync(mappingPath)) {
    try {
      existingMapping = JSON.parse(readFileSync(mappingPath, 'utf-8'));
      console.log(`  Loaded ${Object.keys(existingMapping.covers || {}).length} existing mappings for resume.\n`);
    } catch {}
  }

  const results = await batchProcess(allToMigrate, CONCURRENCY, async (entry) => {
    const { episodeId, url, type, index } = entry;

    // Build S3 key
    let s3Key;
    if (type === 'gallery') {
      s3Key = `${S3_KEY_PREFIX}/${episodeId}_gallery_${index}`;
    } else {
      s3Key = `${S3_KEY_PREFIX}/${episodeId}`;
    }

    // Check if already migrated (resume)
    if (type === 'cover' && existingMapping.covers?.[episodeId]) {
      completed++;
      mapping[episodeId] = existingMapping.covers[episodeId];
      process.stdout.write(`  [${completed}/${allToMigrate.length}] ${episodeId} (resumed)\n`);
      return { episodeId, status: 'resumed' };
    }

    try {
      // Download
      const { buffer, contentType } = await downloadImage(url);
      const ext = extFromContentType(contentType);

      // Add extension to key
      const finalKey = `${s3Key}.${ext}`;

      // Upload
      const newUrl = await uploadToS3(finalKey, buffer, contentType);

      completed++;
      if (type === 'cover') {
        mapping[episodeId] = newUrl;
      } else {
        if (!galleryMapping[episodeId]) galleryMapping[episodeId] = [];
        galleryMapping[episodeId].push(newUrl);
      }

      const sizeKB = Math.round(buffer.length / 1024);
      process.stdout.write(`  [${completed}/${allToMigrate.length}] ${episodeId}${type === 'gallery' ? ` (gallery ${index})` : ''} → ${finalKey} (${sizeKB} KB)\n`);

      return { episodeId, status: 'ok', newUrl };
    } catch (err) {
      completed++;
      errors.push({ episodeId, type, error: err.message });
      process.stdout.write(`  [${completed}/${allToMigrate.length}] ERROR ${episodeId}: ${err.message}\n`);
      return { episodeId, status: 'error', error: err.message };
    }
  });

  // 4. Save mapping
  const output = {
    generatedAt: new Date().toISOString(),
    totalMigrated: Object.keys(mapping).length,
    totalGalleryMigrated: Object.values(galleryMapping).reduce((sum, arr) => sum + arr.length, 0),
    totalErrors: errors.length,
    covers: mapping,
    gallery: galleryMapping,
    errors: errors.length > 0 ? errors : undefined,
    skippedAlreadyOnS3: skippedS3,
  };

  writeFileSync(mappingPath, JSON.stringify(output, null, 2));

  // Summary
  console.log('\n=== Migration Summary ===');
  console.log(`  Cover images migrated:   ${Object.keys(mapping).length}`);
  console.log(`  Gallery images migrated:  ${output.totalGalleryMigrated}`);
  console.log(`  Already on S3:           ${skippedS3.length}`);
  console.log(`  Errors:                  ${errors.length}`);
  console.log(`\n  Mapping saved to: ${mappingPath}`);

  if (errors.length > 0) {
    console.log('\n  Failed items:');
    errors.forEach(({ episodeId, type, error }) => {
      console.log(`    ${episodeId} (${type}): ${error}`);
    });
  }

  console.log('\nNext step: review migration-mapping.json, then run:');
  console.log('  node scripts/update-firestore-urls.js');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
