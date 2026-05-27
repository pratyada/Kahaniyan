#!/usr/bin/env node
// Apply pending story edits from Firestore → update source files → deploy.
//
// Usage: node scripts/apply-story-edits.mjs
//        node scripts/apply-story-edits.mjs --dry-run   (preview without saving)
//
// Flow:
// 1. Admin edits story in browser → saved to Firestore config/pendingEdits
// 2. Run this script → reads edits, updates series.js/culturalLessons.js/collections.js
// 3. Auto-runs deploy.sh if changes were made
// 4. Clears the pending edits queue

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const DRY_RUN = process.argv.includes('--dry-run');

// ── Load env ──
try {
  const env = readFileSync('.env.prod', 'utf8');
  env.split('\n').forEach(line => {
    const m = line.match(/^([A-Z_]+)=["']?([^"'\n]+)/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  });
} catch {}

// ── Firebase init (client SDK via REST) ──
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'qissaa-61a78';
const API_KEY = process.env.VITE_FIREBASE_API_KEY;

async function fetchFirestoreDoc(docPath) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${docPath}?key=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) { console.error(`Firestore fetch failed: ${res.status}`); return null; }
  const doc = await res.json();
  if (!doc.fields) return null;
  // Convert Firestore format to plain object
  const result = {};
  for (const [key, val] of Object.entries(doc.fields)) {
    if (val.stringValue !== undefined) result[key] = val.stringValue;
    else if (val.integerValue !== undefined) result[key] = parseInt(val.integerValue);
    else if (val.mapValue?.fields) {
      result[key] = {};
      for (const [k2, v2] of Object.entries(val.mapValue.fields)) {
        if (v2.stringValue !== undefined) result[key][k2] = v2.stringValue;
      }
    }
  }
  return result;
}

async function deleteFirestoreDoc(docPath) {
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${docPath}?key=${API_KEY}`;
  await fetch(url, { method: 'DELETE' });
}

// ── Load pending edits ──
console.log('📋 Checking for pending story edits...');

const edits = await fetchFirestoreDoc('config/pendingEdits');
if (!edits || Object.keys(edits).length === 0) {
  console.log('✅ No pending edits.');
  process.exit(0);
}

console.log(`📝 Found ${Object.keys(edits).length} pending edit(s):`);
for (const [storyId, fields] of Object.entries(edits)) {
  if (typeof fields === 'object') {
    console.log(`  → ${storyId}: ${Object.keys(fields).join(', ')}`);
  }
}

if (DRY_RUN) {
  console.log('\n🔍 Dry run — no files will be modified.');
  process.exit(0);
}

// ── Apply edits to source files ──
const FILES = [
  { path: 'client/src/data/series.js', type: 'series' },
  { path: 'client/src/data/culturalLessons.js', type: 'lessons' },
  { path: 'client/src/data/collections.js', type: 'collections' },
];

let totalApplied = 0;

for (const [storyId, fields] of Object.entries(edits)) {
  if (typeof fields !== 'object') continue;

  let found = false;

  for (const file of FILES) {
    let content = readFileSync(file.path, 'utf8');

    // Find the story/episode by ID
    const idPattern = new RegExp(`id:\\s*['"]${storyId}['"]`);
    const idMatch = content.match(idPattern);
    if (!idMatch) continue;

    const idPos = content.indexOf(idMatch[0]);
    found = true;

    // Find the story object boundaries (from id to next closing })
    // For each field to update, find and replace
    for (const [field, newValue] of Object.entries(fields)) {
      if (field === 'body') {
        // Body uses template literal — find body: `...` after this ID
        const bodyStart = content.indexOf('body: `', idPos);
        if (bodyStart === -1 || bodyStart > idPos + 5000) continue; // safety: body should be within 5000 chars of id

        const bodyContentStart = bodyStart + 7; // after 'body: `'
        const bodyEnd = content.indexOf('`,', bodyContentStart);
        if (bodyEnd === -1) continue;

        // Escape backticks in new value
        const escaped = newValue.replace(/`/g, '\\`').replace(/\${/g, '\\${');
        content = content.substring(0, bodyContentStart) + escaped + content.substring(bodyEnd);
        console.log(`  ✅ ${storyId}.body updated in ${file.path}`);
      } else if (field === 'title') {
        // Title uses single quotes — find title: '...' after this ID
        const titleStart = content.indexOf("title: '", idPos);
        if (titleStart === -1 || titleStart > idPos + 500) {
          // Try double quotes
          const titleStart2 = content.indexOf('title: "', idPos);
          if (titleStart2 === -1 || titleStart2 > idPos + 500) continue;
          const titleContentStart = titleStart2 + 8;
          const titleEnd = content.indexOf('"', titleContentStart);
          if (titleEnd === -1) continue;
          content = content.substring(0, titleContentStart) + newValue.replace(/"/g, '\\"') + content.substring(titleEnd);
        } else {
          const titleContentStart = titleStart + 8;
          const titleEnd = content.indexOf("'", titleContentStart);
          if (titleEnd === -1) continue;
          content = content.substring(0, titleContentStart) + newValue.replace(/'/g, "\\'") + content.substring(titleEnd);
        }
        console.log(`  ✅ ${storyId}.title updated in ${file.path}`);
      } else if (field === 'subtitle') {
        const subStart = content.indexOf("subtitle: '", idPos);
        if (subStart === -1 || subStart > idPos + 500) {
          const subStart2 = content.indexOf('subtitle: "', idPos);
          if (subStart2 === -1 || subStart2 > idPos + 500) continue;
          const subContentStart = subStart2 + 11;
          const subEnd = content.indexOf('"', subContentStart);
          if (subEnd === -1) continue;
          content = content.substring(0, subContentStart) + newValue.replace(/"/g, '\\"') + content.substring(subEnd);
        } else {
          const subContentStart = subStart + 11;
          const subEnd = content.indexOf("'", subContentStart);
          if (subEnd === -1) continue;
          content = content.substring(0, subContentStart) + newValue.replace(/'/g, "\\'") + content.substring(subEnd);
        }
        console.log(`  ✅ ${storyId}.subtitle updated in ${file.path}`);
      }
    }

    writeFileSync(file.path, content);
    totalApplied++;
    break; // found in this file, no need to check others
  }

  if (!found) {
    console.log(`  ⚠️  ${storyId} not found in any source file`);
  }
}

if (totalApplied === 0) {
  console.log('\n⚠️  No edits could be applied.');
  process.exit(0);
}

// ── Clear pending edits from Firestore ──
console.log('\n🧹 Clearing pending edits from Firestore...');
await deleteFirestoreDoc('config/pendingEdits');

// ── Deploy ──
console.log('\n🚀 Running deploy...');
try {
  execSync('bash deploy.sh', { stdio: 'inherit' });
  console.log('\n✅ Edits applied and deployed!');
} catch (e) {
  console.error('\n❌ Deploy failed:', e.message);
  process.exit(1);
}
