// POST /api/batch-audio — Generate & download audio for entire series
// Founder-only: Prateek + Raksha
// Body: { uid, seriesId, voice, speed } or { uid, mode: 'status', jobId }
// Returns: { episodes: [{ id, title, audioUrl }] }

import { getFirestore, FOUNDER_EMAILS } from './_firebase.js';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const s3 = new S3Client({ region: 'us-east-1' });
const BUCKET = 'mysleepytale-app';

// Allowed founders for audio download — canonical list (Prateek + Raksha)
const AUDIO_FOUNDERS = FOUNDER_EMAILS.map(e => e.toLowerCase());

async function generateTTS(text, voice = 'sage', speed = 0.9) {
  const res = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1-hd',
      input: text.slice(0, 4096),
      voice,
      speed,
      response_format: 'mp3',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TTS error: ${res.status} ${err.slice(0, 200)}`);
  }

  return Buffer.from(await res.arrayBuffer());
}

async function uploadToS3(buffer, key) {
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: buffer,
    ContentType: 'audio/mpeg',
    CacheControl: 'public, max-age=2592000',
  }));
  return `https://mysleepytale.com/${key}`;
}

async function checkS3Exists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch { return false; }
}

// Fill tokens with generic values for podcast/YouTube audio
function fillTokensGeneric(text) {
  return text
    .replace(/\{childName\}/g, 'little one')
    .replace(/\{sibling\}/g, 'their friend')
    .replace(/\{grandfather\}/g, 'Grandpa')
    .replace(/\{grandmother\}/g, 'Grandma')
    .replace(/\{pet\}/g, 'their puppy');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, seriesId, voice = 'sage', speed = 0.9, episodeId, mode } = req.body || {};
  if (!uid) return res.status(400).json({ error: 'uid required' });

  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Firestore not available' });

  // Auth — only founders
  const userSnap = await db.collection('users').doc(uid).get();
  const email = userSnap.exists ? userSnap.data().email?.toLowerCase() : '';
  if (!AUDIO_FOUNDERS.includes(email)) {
    return res.status(403).json({ error: 'Audio download restricted to Prateek & Raksha', debug: { uid, email, allowed: AUDIO_FOUNDERS } });
  }

  if (!OPENAI_KEY) return res.status(503).json({ error: 'OpenAI not configured' });

  // ── LIST available series ──
  if (mode === 'list') {
    // Return series list from static data — client handles this
    return res.json({ message: 'Use client-side series data' });
  }

  // ── GENERATE SINGLE EPISODE ──
  if (episodeId && !seriesId) {
    // Client sends episode text directly
    const { text, title } = req.body;
    if (!text) return res.status(400).json({ error: 'text required' });

    const cleanText = fillTokensGeneric(text);
    const s3Key = `audio/download/${episodeId}.mp3`;

    // Check if already generated
    const exists = await checkS3Exists(s3Key);
    if (exists) {
      return res.json({
        episodeId,
        title,
        audioUrl: `https://mysleepytale.com/${s3Key}`,
        cached: true,
      });
    }

    try {
      const buffer = await generateTTS(cleanText, voice, speed);
      const audioUrl = await uploadToS3(buffer, s3Key);
      return res.json({ episodeId, title, audioUrl, cached: false });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── GENERATE FULL SERIES ──
  if (!seriesId) return res.status(400).json({ error: 'seriesId or episodeId required' });

  // Client sends the full episode data (text included) to avoid importing series.js server-side
  const { episodes } = req.body;
  if (!episodes?.length) {
    return res.status(400).json({ error: 'episodes[] with {id, title, body} required' });
  }

  const results = [];

  for (const ep of episodes) {
    const s3Key = `audio/download/${ep.id}.mp3`;

    // Check if already exists
    const exists = await checkS3Exists(s3Key);
    if (exists) {
      results.push({
        id: ep.id,
        episodeNumber: ep.episodeNumber,
        title: ep.title,
        audioUrl: `https://mysleepytale.com/${s3Key}`,
        status: 'cached',
      });
      continue;
    }

    try {
      const cleanText = fillTokensGeneric(ep.body || '');
      const buffer = await generateTTS(cleanText, voice, speed);
      const audioUrl = await uploadToS3(buffer, s3Key);
      results.push({
        id: ep.id,
        episodeNumber: ep.episodeNumber,
        title: ep.title,
        audioUrl,
        status: 'generated',
      });
    } catch (e) {
      results.push({
        id: ep.id,
        episodeNumber: ep.episodeNumber,
        title: ep.title,
        status: 'failed',
        error: e.message,
      });
    }
  }

  return res.json({ seriesId, voice, speed, episodes: results });
}
