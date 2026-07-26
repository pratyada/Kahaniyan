#!/usr/bin/env node
// ──────────────────────────────────────────────────────────────
// update-firestore-urls.js
// Reads migration-mapping.json and updates Firestore wisdomImages
// via the publish-content API (registerImage action).
//
// Usage:  node scripts/update-firestore-urls.js
//         node scripts/update-firestore-urls.js --dry-run
//
// Prerequisites: run migrate-firebase-to-s3.js first.
// ──────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ── Config ──────────────────────────────────────────────────
const API_URL = 'https://mysleepytale.com/api/publish-content';
const BATCH_SIZE = 10;
const DELAY_BETWEEN_BATCHES_MS = 2000; // 2 seconds between batches
const MAPPING_FILE = join(__dirname, 'migration-mapping.json');

const DRY_RUN = process.argv.includes('--dry-run');

// ── Helpers ─────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function registerImage(episodeId, imageUrl, gallery) {
  const body = { action: 'registerImage', episodeId, imageUrl };
  if (gallery && gallery.length > 0) {
    body.gallery = gallery;
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return res.json();
}

// ── Main ────────────────────────────────────────────────────

async function main() {
  console.log('=== Update Firestore Image URLs ===\n');

  if (DRY_RUN) {
    console.log('  ** DRY RUN — no changes will be made **\n');
  }

  // 1. Load mapping
  let mapping;
  try {
    mapping = JSON.parse(readFileSync(MAPPING_FILE, 'utf-8'));
  } catch (err) {
    console.error(`Could not read ${MAPPING_FILE}`);
    console.error('Run migrate-firebase-to-s3.js first.');
    process.exit(1);
  }

  const covers = mapping.covers || {};
  const gallery = mapping.gallery || {};
  const episodeIds = Object.keys(covers);

  if (episodeIds.length === 0) {
    console.log('No cover mappings found. Nothing to update.');
    process.exit(0);
  }

  console.log(`  Cover images to update:   ${episodeIds.length}`);
  console.log(`  Episodes with gallery:    ${Object.keys(gallery).length}`);
  console.log(`  Batch size:               ${BATCH_SIZE}`);
  console.log(`  Delay between batches:    ${DELAY_BETWEEN_BATCHES_MS}ms\n`);

  // 2. Process in batches
  const results = { success: 0, failed: 0, errors: [] };

  for (let i = 0; i < episodeIds.length; i += BATCH_SIZE) {
    const batch = episodeIds.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(episodeIds.length / BATCH_SIZE);

    console.log(`  Batch ${batchNum}/${totalBatches} (${batch.length} items)...`);

    const promises = batch.map(async (episodeId) => {
      const newUrl = covers[episodeId];
      const galleryUrls = gallery[episodeId] || null;

      if (DRY_RUN) {
        console.log(`    [DRY] ${episodeId} → ${newUrl}`);
        if (galleryUrls) console.log(`          + ${galleryUrls.length} gallery images`);
        return { episodeId, status: 'dry-run' };
      }

      try {
        const result = await registerImage(episodeId, newUrl, galleryUrls);
        console.log(`    OK    ${episodeId}`);
        results.success++;
        return { episodeId, status: 'ok' };
      } catch (err) {
        console.log(`    FAIL  ${episodeId}: ${err.message}`);
        results.failed++;
        results.errors.push({ episodeId, error: err.message });
        return { episodeId, status: 'error', error: err.message };
      }
    });

    await Promise.all(promises);

    // Delay between batches (not after the last one)
    if (i + BATCH_SIZE < episodeIds.length) {
      await sleep(DELAY_BETWEEN_BATCHES_MS);
    }
  }

  // 3. Summary
  console.log('\n=== Update Summary ===');
  if (DRY_RUN) {
    console.log(`  Would update: ${episodeIds.length} episodes`);
    console.log('\n  Run without --dry-run to apply changes.');
  } else {
    console.log(`  Successful:  ${results.success}`);
    console.log(`  Failed:      ${results.failed}`);

    if (results.errors.length > 0) {
      console.log('\n  Failed items:');
      results.errors.forEach(({ episodeId, error }) => {
        console.log(`    ${episodeId}: ${error}`);
      });

      // Save errors for retry
      const errPath = join(__dirname, 'migration-update-errors.json');
      writeFileSync(errPath, JSON.stringify(results.errors, null, 2));
      console.log(`\n  Errors saved to: ${errPath}`);
    }
  }

  console.log('\nDone.');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
