// Bulk generate ElevenLabs audio for all series episodes + wisdom stories.
// Runs from command line — no browser needed.
// Usage: node scripts/bulk-generate-audio.mjs [voice] [--series-only] [--wisdom-only]

import { readFileSync } from 'fs';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

// ── Config ──
const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ARG = process.argv[2] || 'george';
const SERIES_ONLY = process.argv.includes('--series-only');
const WISDOM_ONLY = process.argv.includes('--wisdom-only');

const VOICES = {
  george: 'JBFqnCBsd6RMkjVDRZzb',
  lily: 'pFZP5JQG7iQjIQuC4Bku',
  sarah: 'EXAVITQu4vr4xnSDxMaL',
  alice: 'Xb7hH8MSUJpSbSDYk0k2',
  brian: 'nPczCjzI2devNBz1zQrb',
  bill: 'pqHfZKP75CvOlQylNhV4',
  river: 'SAz9YHcvj6GT2YYXdXww',
  jessica: 'cgSgspJ2msm6clMCkdW9',
};

if (!ELEVENLABS_KEY) {
  // Try loading from .env.prod
  try {
    const env = readFileSync('.env.prod', 'utf8');
    const match = env.match(/ELEVENLABS_API_KEY=["']?([^"'\n]+)/);
    if (match) process.env.ELEVENLABS_API_KEY = match[1];
  } catch {}
}

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) { console.error('❌ No ELEVENLABS_API_KEY found'); process.exit(1); }

// ── Firebase init ──
let db, bucket;
try {
  const envFile = readFileSync('.env.prod', 'utf8');
  const getEnv = (key) => {
    const m = envFile.match(new RegExp(`${key}=["']?([^"'\\n]+)`));
    return m ? m[1] : '';
  };

  const serviceAccount = JSON.parse(Buffer.from(getEnv('FIREBASE_SERVICE_ACCOUNT_B64') || '', 'base64').toString());
  const app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET') || 'qissaa-61a78.firebasestorage.app',
  });
  db = getFirestore(app);
  bucket = getStorage(app).bucket();
  console.log('✅ Firebase connected');
} catch (e) {
  console.error('❌ Firebase init failed:', e.message);
  console.log('Falling back to API-only mode (no upload)');
}

// ── Load existing audio URLs from Firestore ──
let existingAudio = {};
if (db) {
  try {
    const snap = await db.doc('config/wisdomAudio').get();
    if (snap.exists) existingAudio = snap.data();
    console.log(`📊 ${Object.keys(existingAudio).length} existing audio files in Firestore`);
  } catch (e) { console.log('Could not load existing audio:', e.message); }
}

// ── Load series data ──
// We need to use dynamic import for ES modules
const { SERIES } = await import('../client/src/data/series.js');
const { CULTURAL_LESSONS } = await import('../client/src/data/culturalLessons.js');

// Build list of all items to generate
const items = [];

if (!WISDOM_ONLY) {
  for (const series of SERIES) {
    for (const ep of series.episodes) {
      if (!existingAudio[ep.id]) {
        items.push({ id: ep.id, title: `${series.icon} ${ep.title}`, body: ep.body, type: 'series' });
      }
    }
  }
}

if (!SERIES_ONLY) {
  for (const lesson of CULTURAL_LESSONS) {
    if (!existingAudio[lesson.id]) {
      items.push({ id: lesson.id, title: lesson.title, body: lesson.body, type: 'wisdom' });
    }
  }
}

console.log(`\n🎯 ${items.length} items to generate (voice: ${VOICE_ARG})`);
if (items.length === 0) { console.log('✅ Nothing to generate!'); process.exit(0); }

const voiceId = VOICES[VOICE_ARG] || VOICES.george;
let success = 0, failed = 0;

for (let i = 0; i < items.length; i++) {
  const item = items[i];
  const text = (item.body || '')
    .replace(/\{childName\}/g, 'little one')
    .replace(/\{sibling\}/g, 'their friend')
    .replace(/\{pet\}/g, 'their puppy')
    .slice(0, 10000);

  console.log(`\n[${i + 1}/${items.length}] ${item.title}`);

  try {
    // Generate audio via ElevenLabs
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.6, similarity_boost: 0.8 },
      }),
    });

    if (!res.ok) {
      console.log(`  ❌ ElevenLabs ${res.status}: ${await res.text()}`);
      failed++;
      await new Promise(r => setTimeout(r, 5000)); // longer wait on error
      continue;
    }

    const audioBuffer = Buffer.from(await res.arrayBuffer());
    console.log(`  🔊 Audio: ${(audioBuffer.length / 1024).toFixed(0)} KB`);

    // Upload to Firebase Storage
    if (bucket) {
      const filePath = `wisdom-audio/${item.id}.mp3`;
      const file = bucket.file(filePath);
      await file.save(audioBuffer, { contentType: 'audio/mpeg' });
      await file.makePublic();
      const audioUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

      // Save URL to Firestore
      if (db) {
        await db.doc('config/wisdomAudio').set({ [item.id]: audioUrl }, { merge: true });
      }
      console.log(`  ✅ Uploaded & saved: ${item.id}`);
    } else {
      console.log(`  ⚠️ Generated but no Firebase — cannot upload`);
    }

    success++;
    // Rate limit: wait 2 seconds between requests
    await new Promise(r => setTimeout(r, 2000));

  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
    failed++;
    await new Promise(r => setTimeout(r, 5000));
  }
}

console.log(`\n════════════════════════════`);
console.log(`✅ Done! ${success} generated, ${failed} failed, ${items.length} total`);
console.log(`════════════════════════════`);
