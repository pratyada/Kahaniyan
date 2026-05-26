#!/usr/bin/env node
// Bulk generate ALL missing audio (ElevenLabs) + images (DALL-E) for:
// - Wisdom stories (culturalLessons.js)
// - Collection stories (collections.js)
// - Series episodes (series.js)
//
// Usage:
//   node scripts/bulk-generate-all.mjs                    # all missing audio + images
//   node scripts/bulk-generate-all.mjs --audio-only       # only audio
//   node scripts/bulk-generate-all.mjs --images-only      # only images
//   node scripts/bulk-generate-all.mjs --series-only      # only series
//   node scripts/bulk-generate-all.mjs --wisdom-only      # only wisdom stories
//   node scripts/bulk-generate-all.mjs --collections-only # only collections

import { readFileSync } from 'fs';

// ── Parse args ──
const AUDIO_ONLY = process.argv.includes('--audio-only');
const IMAGES_ONLY = process.argv.includes('--images-only');
const SERIES_ONLY = process.argv.includes('--series-only');
const WISDOM_ONLY = process.argv.includes('--wisdom-only');
const COLLECTIONS_ONLY = process.argv.includes('--collections-only');
const DO_AUDIO = !IMAGES_ONLY;
const DO_IMAGES = !AUDIO_ONLY;

// ── Load env ──
try {
  const env = readFileSync('.env.prod', 'utf8');
  env.split('\n').forEach(line => {
    const m = line.match(/^([A-Z_]+)=["']?([^"'\n]+)/);
    if (m) process.env[m[1]] = m[2];
  });
} catch {}

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

if (DO_AUDIO && !ELEVENLABS_KEY) { console.error('❌ No ELEVENLABS_API_KEY'); process.exit(1); }
if (DO_IMAGES && !OPENAI_KEY) { console.error('❌ No OPENAI_API_KEY'); process.exit(1); }

// ── ElevenLabs voices — rotate randomly ──
const VOICES = [
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian' },
  { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River' },
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica' },
];
const randomVoice = () => VOICES[Math.floor(Math.random() * VOICES.length)];

// ── Firebase init ──
let db, bucket;
try {
  const { initializeApp, cert } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  const { getStorage } = await import('firebase-admin/storage');

  const sa = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64 || '', 'base64').toString());
  const app = initializeApp({
    credential: cert(sa),
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || 'qissaa-61a78.firebasestorage.app',
  });
  db = getFirestore(app);
  bucket = getStorage(app).bucket();
  console.log('✅ Firebase connected');
} catch (e) {
  console.error('❌ Firebase failed:', e.message);
  process.exit(1);
}

// ── Load existing data from Firestore ──
const audioSnap = await db.doc('config/wisdomAudio').get();
const imageSnap = await db.doc('config/wisdomImages').get();
const existingAudio = audioSnap.exists ? audioSnap.data() : {};
const existingImages = imageSnap.exists ? imageSnap.data() : {};
console.log(`📊 Existing: ${Object.keys(existingAudio).length} audio, ${Object.keys(existingImages).length} images`);

// ── Load story data ──
const { SERIES } = await import('../client/src/data/series.js');
const { CULTURAL_LESSONS } = await import('../client/src/data/culturalLessons.js');
const { COLLECTIONS } = await import('../client/src/data/collections.js');

// ── Load image prompts ──
const { STORY_PROMPTS, STYLES } = await import('../client/src/utils/imagePrompts.js');

// ── Build item list ──
const items = [];

if (!COLLECTIONS_ONLY && !WISDOM_ONLY) {
  for (const s of SERIES) {
    if (!s) continue;
    for (const ep of s.episodes) {
      items.push({ id: ep.id, title: `${s.icon} ${ep.title}`, body: ep.body, type: 'series' });
    }
  }
}

if (!SERIES_ONLY && !COLLECTIONS_ONLY) {
  for (const l of CULTURAL_LESSONS) {
    if (!l) continue;
    items.push({ id: l.id, title: l.title, body: l.body, type: 'wisdom' });
  }
}

if (!SERIES_ONLY && !WISDOM_ONLY) {
  for (const col of COLLECTIONS) {
    if (!col) continue;
    for (const s of col.stories) {
      items.push({ id: s.id, title: `${col.icon} ${s.title}`, body: s.body, type: 'collection' });
    }
  }
}

// Filter to only missing
const needAudio = DO_AUDIO ? items.filter(i => !existingAudio[i.id]) : [];
const needImages = DO_IMAGES ? items.filter(i => !existingImages[i.id]) : [];

console.log(`\n🎯 To generate: ${needAudio.length} audio, ${needImages.length} images`);

// ── Generate Audio ──
let audioSuccess = 0, audioFailed = 0;
for (let i = 0; i < needAudio.length; i++) {
  const item = needAudio[i];
  const voice = randomVoice();
  const text = (item.body || '')
    .replace(/\{childName\}/g, 'little one')
    .replace(/\{sibling\}/g, 'their friend')
    .slice(0, 10000);

  console.log(`\n🔊 [${i + 1}/${needAudio.length}] ${item.title} (${voice.name})`);

  try {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice.id}`, {
      method: 'POST',
      headers: { 'xi-api-key': ELEVENLABS_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.6, similarity_boost: 0.8 } }),
    });

    if (!res.ok) {
      const err = await res.text();
      if (err.includes('quota_exceeded')) { console.log('  ⛔ Quota exceeded — stopping audio generation'); break; }
      console.log(`  ❌ ${res.status}: ${err.substring(0, 100)}`);
      audioFailed++;
      await new Promise(r => setTimeout(r, 3000));
      continue;
    }

    const audioBuffer = Buffer.from(await res.arrayBuffer());
    const filePath = `wisdom-audio/${item.id}.mp3`;
    const file = bucket.file(filePath);
    await file.save(audioBuffer, { contentType: 'audio/mpeg' });
    await file.makePublic();
    const audioUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    await db.doc('config/wisdomAudio').set({ [item.id]: audioUrl }, { merge: true });
    console.log(`  ✅ ${(audioBuffer.length / 1024).toFixed(0)} KB → ${voice.name}`);
    audioSuccess++;
    await new Promise(r => setTimeout(r, 2000));
  } catch (e) {
    console.log(`  ❌ ${e.message}`);
    audioFailed++;
    await new Promise(r => setTimeout(r, 3000));
  }
}

// ── Generate Images ──
let imageSuccess = 0, imageFailed = 0;
for (let i = 0; i < needImages.length; i++) {
  const item = needImages[i];
  const scene = STORY_PROMPTS[item.id] || `Children's storybook illustration for "${item.title}". Warm, colorful, bedtime style, Pixar-meets-Ghibli warmth.`;
  const prompt = `${STYLES.thumbnail}. Scene: ${scene}`;

  console.log(`\n🖼️ [${i + 1}/${needImages.length}] ${item.title}`);

  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'dall-e-3', prompt: prompt.substring(0, 4000), n: 1, size: '1024x1024', quality: 'standard' }),
    });

    if (!res.ok) {
      console.log(`  ❌ ${res.status}: ${(await res.text()).substring(0, 100)}`);
      imageFailed++;
      await new Promise(r => setTimeout(r, 3000));
      continue;
    }

    const data = await res.json();
    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) { console.log('  ❌ No URL in response'); imageFailed++; continue; }

    // Download and upload to Firebase
    const imgRes = await fetch(imageUrl);
    const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
    const filePath = `wisdom-images/${item.id}.png`;
    const file = bucket.file(filePath);
    await file.save(imgBuffer, { contentType: 'image/png' });
    await file.makePublic();
    const permanentUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    await db.doc('config/wisdomImages').set({ [item.id]: permanentUrl }, { merge: true });
    console.log(`  ✅ ${(imgBuffer.length / 1024).toFixed(0)} KB`);
    imageSuccess++;
    await new Promise(r => setTimeout(r, 1500));
  } catch (e) {
    console.log(`  ❌ ${e.message}`);
    imageFailed++;
    await new Promise(r => setTimeout(r, 3000));
  }
}

console.log(`\n════════════════════════════════════════`);
console.log(`🔊 Audio: ${audioSuccess} ✅ ${audioFailed} ❌ (${needAudio.length} needed)`);
console.log(`🖼️ Images: ${imageSuccess} ✅ ${imageFailed} ❌ (${needImages.length} needed)`);
console.log(`════════════════════════════════════════`);
