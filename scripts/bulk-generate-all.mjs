#!/usr/bin/env node
// Bulk generate ALL missing audio (ElevenLabs) + images (DALL-E)
// Uses the deployed API endpoint — no Firebase admin SDK needed.
//
// Usage:
//   node scripts/bulk-generate-all.mjs                    # all missing
//   node scripts/bulk-generate-all.mjs --audio-only
//   node scripts/bulk-generate-all.mjs --images-only
//   node scripts/bulk-generate-all.mjs --series-only
//   node scripts/bulk-generate-all.mjs --wisdom-only
//   node scripts/bulk-generate-all.mjs --collections-only

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
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  });
} catch {}

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const API_BASE = 'https://637dbvalfk.execute-api.us-east-1.amazonaws.com';

if (DO_AUDIO && !ELEVENLABS_KEY) { console.error('❌ No ELEVENLABS_API_KEY in .env.prod'); process.exit(1); }
if (DO_IMAGES && !OPENAI_KEY) { console.error('❌ No OPENAI_API_KEY in .env.prod'); process.exit(1); }

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

// ── Load story data ──
const { SERIES } = await import('../client/src/data/series.js');
const { CULTURAL_LESSONS } = await import('../client/src/data/culturalLessons.js');
const { COLLECTIONS } = await import('../client/src/data/collections.js');
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

console.log(`📋 Total items: ${items.length} (${items.filter(i => i.type === 'series').length} series, ${items.filter(i => i.type === 'wisdom').length} wisdom, ${items.filter(i => i.type === 'collection').length} collection)`);

// ── Generate Audio via API ──
let audioSuccess = 0, audioFailed = 0, audioSkipped = 0;

if (DO_AUDIO) {
  console.log(`\n═══ AUDIO GENERATION (ElevenLabs) ═══`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const voice = randomVoice();
    const text = (item.body || '')
      .replace(/\{childName\}/g, 'little one')
      .replace(/\{sibling\}/g, 'their friend')
      .slice(0, 10000);

    if (text.length < 50) { audioSkipped++; continue; }

    console.log(`\n🔊 [${i + 1}/${items.length}] ${item.title} → ${voice.name}`);

    try {
      const res = await fetch(`${API_BASE}/api/generate-elevenlabs-audio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: voice.name.toLowerCase() }),
      });

      if (res.status === 401) {
        const err = await res.text();
        if (err.includes('quota_exceeded')) {
          console.log('  ⛔ ElevenLabs quota exceeded — stopping audio');
          break;
        }
        console.log(`  ❌ 401: ${err.substring(0, 100)}`);
        audioFailed++;
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }

      if (!res.ok) {
        console.log(`  ❌ ${res.status}`);
        audioFailed++;
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }

      const contentType = res.headers.get('content-type');
      if (contentType?.includes('audio')) {
        console.log(`  ✅ Audio generated`);
        audioSuccess++;
      } else {
        console.log(`  ⚠️ Unexpected response type: ${contentType}`);
        audioFailed++;
      }

      await new Promise(r => setTimeout(r, 2500));
    } catch (e) {
      console.log(`  ❌ ${e.message}`);
      audioFailed++;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

// ── Generate Images via OpenAI DALL-E directly ──
let imageSuccess = 0, imageFailed = 0;

if (DO_IMAGES) {
  console.log(`\n═══ IMAGE GENERATION (DALL-E 3) ═══`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const scene = STORY_PROMPTS[item.id] || `Children's storybook illustration for "${item.title}". Warm, colorful, bedtime style, Pixar-meets-Ghibli warmth.`;
    const prompt = `${STYLES.thumbnail}. Scene: ${scene}`;

    console.log(`\n🖼️ [${i + 1}/${items.length}] ${item.title}`);

    try {
      const res = await fetch(`${API_BASE}/api/generate-story-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId: item.id, prompt: prompt.substring(0, 4000) }),
      });

      if (!res.ok) {
        console.log(`  ❌ ${res.status}: ${(await res.text()).substring(0, 100)}`);
        imageFailed++;
        await new Promise(r => setTimeout(r, 3000));
        continue;
      }

      const data = await res.json();
      if (data.url || data.imageUrl) {
        console.log(`  ✅ Image generated`);
        imageSuccess++;
      } else {
        console.log(`  ⚠️ No URL in response`);
        imageFailed++;
      }

      await new Promise(r => setTimeout(r, 2000));
    } catch (e) {
      console.log(`  ❌ ${e.message}`);
      imageFailed++;
      await new Promise(r => setTimeout(r, 3000));
    }
  }
}

console.log(`\n════════════════════════════════════════`);
if (DO_AUDIO) console.log(`🔊 Audio: ${audioSuccess} ✅  ${audioFailed} ❌  ${audioSkipped} skipped`);
if (DO_IMAGES) console.log(`🖼️ Images: ${imageSuccess} ✅  ${imageFailed} ❌`);
console.log(`════════════════════════════════════════`);
