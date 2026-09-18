// ElevenLabs TTS — premium audio generation for pre-loaded stories AND cloned voices.
// Pass `voiceId` (a cloned ElevenLabs voice) for personalized playback — paid only.
import { getUserTier, isPaidTier } from './_entitlement.js';
import crypto from 'crypto';
import { S3Client, HeadObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;
const s3 = new S3Client({ region: 'us-east-1' });
const CACHE_BUCKET = 'mysleepytale-app';

const VOICES = {
  george: { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George - Warm Storyteller' },
  lily: { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily - Velvety Actress' },
  sarah: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah - Mature, Reassuring' },
  alice: { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice - Clear Educator' },
  brian: { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian - Deep, Comforting' },
  bill: { id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill - Wise, Mature' },
  muskaan: { id: 'xoV6iGVuOGYHLWjXhVC7', name: 'Muskaan - Hindi' },
  river: { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River - Relaxed, Neutral' },
  jessica: { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica - Playful, Warm' },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!ELEVENLABS_KEY) {
    return res.status(503).json({ error: 'ElevenLabs not configured' });
  }

  // Turbo v2.5 is ~3-4x faster than multilingual_v2 with near-identical quality —
  // big cut to the first-play wait for cloned voices.
  const { text, voice = 'george', voiceId, uid, model = 'eleven_turbo_v2_5', stability = 0.6, similarity = 0.8 } = req.body || {};

  if (!text || text.length < 10) {
    return res.status(400).json({ error: 'Text too short' });
  }

  const voiceConfig = VOICES[voice] || VOICES.george;

  // A cloned voice (raw voiceId) is a paid feature — verify server-side.
  let resolvedVoiceId = voiceConfig.id;
  if (voiceId) {
    const tier = await getUserTier(uid);
    if (!isPaidTier(tier)) {
      return res.status(402).json({ error: 'upgrade_required', message: 'Cloned voices need Family Plus.' });
    }
    resolvedVoiceId = voiceId;
  }

  // Split long text into small chunks and generate ALL in parallel to stay under 30s
  const MAX_CHUNK = 2000; // chars per chunk — small enough for ~8s each
  const fullText = text.slice(0, 10000);
  // Cache key by voice + model + exact text → same story in same voice replays instantly.
  const cacheKey = `tts-cache/${resolvedVoiceId}/${crypto.createHash('sha256').update(model + '|' + fullText).digest('hex').slice(0, 40)}.mp3`;

  const generateChunk = async (chunk) => {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${resolvedVoiceId}`, {
      method: 'POST',
      headers: { 'xi-api-key': ELEVENLABS_KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
      body: JSON.stringify({ text: chunk, model_id: model, voice_settings: { stability, similarity_boost: similarity, style: 0.3, use_speaker_boost: true } }),
    });
    if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${await r.text()}`);
    return Buffer.from(await r.arrayBuffer());
  };

  try {
    // ── Cache HIT: serve the previously generated clip instantly (instant replay) ──
    try {
      await s3.send(new HeadObjectCommand({ Bucket: CACHE_BUCKET, Key: cacheKey }));
      const obj = await s3.send(new GetObjectCommand({ Bucket: CACHE_BUCKET, Key: cacheKey }));
      const cached = Buffer.from(await obj.Body.transformToByteArray());
      if (cached.length > 0) {
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('X-Cache', 'HIT');
        res.write(cached);
        res.end();
        return;
      }
    } catch { /* cache miss → generate below */ }

    let audioBuffer;
    if (fullText.length <= MAX_CHUNK) {
      audioBuffer = await generateChunk(fullText);
    } else {
      // Split at paragraph boundaries into chunks of ~2000 chars
      const chunks = [];
      let remaining = fullText;
      while (remaining.length > MAX_CHUNK) {
        let splitAt = remaining.lastIndexOf('\n\n', MAX_CHUNK);
        if (splitAt < MAX_CHUNK * 0.4) splitAt = remaining.lastIndexOf('. ', MAX_CHUNK) + 1;
        if (splitAt < MAX_CHUNK * 0.4) splitAt = MAX_CHUNK;
        chunks.push(remaining.slice(0, splitAt).trim());
        remaining = remaining.slice(splitAt).trim();
      }
      if (remaining.length > 0) chunks.push(remaining);

      // Generate ALL chunks in parallel — each ~8s, all finish in ~8-12s
      const buffers = await Promise.all(chunks.map(c => generateChunk(c)));
      audioBuffer = Buffer.concat(buffers);
    }

    // Store for instant replay next time (best-effort — never fail playback on this).
    try {
      await s3.send(new PutObjectCommand({ Bucket: CACHE_BUCKET, Key: cacheKey, Body: audioBuffer, ContentType: 'audio/mpeg', CacheControl: 'public, max-age=2592000' }));
    } catch { /* cache write failed — fine */ }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('X-Cache', 'MISS');
    // Match api/tts.js: write() then end() — the Lambda adapter drops a buffer
    // passed directly to res.end(audioBuffer) (produced an empty 0-byte response).
    res.write(audioBuffer);
    res.end();
  } catch (err) {
    console.error('ElevenLabs error:', err);
    return res.status(500).json({ error: 'Audio generation failed' });
  }
}

// Export voices list for admin panel
export const VOICE_LIST = VOICES;
