// ElevenLabs TTS — premium audio generation for pre-loaded stories AND cloned voices.
// Pass `voiceId` (a cloned ElevenLabs voice) for personalized playback — paid only.
import { getUserTier, canUseClonedVoice, isPaidTier } from './_entitlement.js';
import { getFirestore } from './_firebase.js';
import crypto from 'crypto';
import { S3Client, HeadObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;
const s3 = new S3Client({ region: 'us-east-1' });
const CACHE_BUCKET = 'mysleepytale-app';

// ─────────────────────────────────────────────────────────────────────────────
// BEDTIME PACING — tunable knobs
// These control how the story text is normalized and slowed down for a calm,
// unhurried cloned-voice read. Change these to re-tune the cadence.
// ─────────────────────────────────────────────────────────────────────────────

// Bump this whenever the pacing logic below changes. It is folded into the S3
// cache key so old "rushed" clips are never served after a pacing update.
const PACING_VERSION = 'pace-v2'; // bumped: id3-strip fix — busts stale broken (undecodable) cached mixes

// ElevenLabs MP3 chunks each carry a leading ID3v2 tag. Concatenating chunks inserts
// ID3 tags MID-STREAM, which Chrome refuses to decode (readyState 0 → silent failure /
// no audio for long, multi-chunk stories). Strip the leading ID3v2 tag from each chunk
// so Buffer.concat yields a clean, decodable MP3 frame stream.
function stripId3(buf) {
  if (buf.length > 10 && buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) { // "ID3"
    const size = ((buf[6] & 0x7f) << 21) | ((buf[7] & 0x7f) << 14) | ((buf[8] & 0x7f) << 7) | (buf[9] & 0x7f);
    const start = 10 + size;
    if (start > 0 && start < buf.length) return buf.subarray(start);
  }
  return buf;
}

// Delivery speed passed to ElevenLabs voice_settings.speed.
// Range ~0.7 (very slow) … 1.0 (normal) … 1.2 (fast). 0.9 = gentle bedtime read.
// If the model/API rejects `speed`, we retry without it (graceful degrade).
const NARRATION_SPEED = 0.9;

// Voice-setting defaults tuned for a soothing, consistent bedtime read:
//  - higher stability  → less expressive swing, steadier tone
//  - lower style       → calmer, less dramatic delivery
// All three remain overridable per-request via req.body.
const DEFAULT_STABILITY = 0.7;
const DEFAULT_SIMILARITY = 0.8;
const DEFAULT_STYLE = 0.15;

// ElevenLabs `<break>` tags reliably insert silence, but the provider caps the
// TOTAL break time per request and support varies by model (turbo_v2_5 is
// inconsistent with them). We therefore DEFAULT OFF and rely on punctuation +
// newlines, which reliably slow delivery. Flip USE_BREAK_TAGS on to add a single
// short break ONLY at paragraph boundaries (never per-sentence) if desired.
const USE_BREAK_TAGS = false;
const PARAGRAPH_BREAK_TAG = '<break time="0.6s" />';

// ─────────────────────────────────────────────────────────────────────────────
// paceStoryText — normalize punctuation/whitespace and add a calm bedtime cadence
// WITHOUT ever changing the words or their meaning (kid-safe: only spacing,
// punctuation and pauses are touched).
// ─────────────────────────────────────────────────────────────────────────────
function paceStoryText(raw) {
  if (!raw) return raw;
  let t = String(raw);

  // 1) Normalize whitespace ---------------------------------------------------
  t = t.replace(/\r\n?/g, '\n');                     // CRLF / CR → LF
  t = t.replace(/[ \t  -​]+/g, ' ');  // any run of h-space → 1 space
  t = t.replace(/ *\n */g, '\n');                    // trim spaces around newlines
  t = t.replace(/\n{2,}/g, '\n\n');                  // collapse to paragraph breaks
  t = t.replace(/(?<!\n)\n(?!\n)/g, ' ');            // lone newline → space (only \n\n = paragraph)

  // 2) Fix doubled / awkward punctuation (no words changed) --------------------
  t = t.replace(/\s+([,.;:!?…])/g, '$1');  // no space BEFORE punctuation
  t = t.replace(/([,;:])\1+/g, '$1');      // ",," → ","  ";;" → ";"
  t = t.replace(/\.{3,}/g, '…');           // "..." / "...." → single ellipsis
  t = t.replace(/([.!?])[.!?]+/g, '$1');   // "?!" "!!" ".." → first mark only

  // 3) Ensure a single space AFTER sentence punctuation when a word follows ----
  t = t.replace(/([.!?…])(["')\]]?)(?=[A-Za-zÀ-ɏ"'(¡¿])/g, '$1$2 ');
  t = t.replace(/([,;:])(?=[A-Za-zÀ-ɏ"'(])/g, '$1 '); // single space after , ; :
  t = t.replace(/[ ]{2,}/g, ' ');          // squeeze any doubles introduced above

  // 4) Rebuild with a calm cadence -------------------------------------------
  // Each paragraph → its sentences, one per line (a newline gives ElevenLabs a
  // gentle micro-pause). Paragraphs are separated by a blank line for a longer,
  // settling pause. Every sentence is guaranteed terminal punctuation.
  const paragraphs = t.split('\n\n').map(p => p.trim()).filter(Boolean);

  const pacedParagraphs = paragraphs.map(para => {
    // Split into sentences, keeping the delimiter on each piece.
    const sentences = (para.match(/[^.!?…]+[.!?…]*/g) || [para])
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => (/[.!?…"')\]]$/.test(s) ? s : s + '.')); // guarantee terminal punct
    return sentences.join('\n'); // one sentence per line → gentle in-para pauses
  });

  const paragraphJoiner = USE_BREAK_TAGS
    ? `\n\n${PARAGRAPH_BREAK_TAG}\n\n`   // short silence only at paragraph breaks
    : '\n\n';                            // blank line = reliable settling pause

  return pacedParagraphs.join(paragraphJoiner).trim();
}

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
  const {
    text,
    voice = 'george',
    voiceId,
    uid,
    model = 'eleven_turbo_v2_5',
    stability = DEFAULT_STABILITY,
    similarity = DEFAULT_SIMILARITY,
    style = DEFAULT_STYLE,
  } = req.body || {};

  if (!text || text.length < 10) {
    return res.status(400).json({ error: 'Text too short' });
  }

  const voiceConfig = VOICES[voice] || VOICES.george;

  // A cloned voice (raw voiceId) is a paid feature — verify server-side.
  let resolvedVoiceId = voiceConfig.id;
  let tier = 'free';
  if (voiceId) {
    tier = await getUserTier(uid);
    if (!canUseClonedVoice(tier)) {
      return res.status(402).json({ error: 'upgrade_required', message: 'Cloned voices need Family Plus.' });
    }
    resolvedVoiceId = voiceId;
  }

  // Split long text into small chunks and generate ALL in parallel to stay under 30s
  const MAX_CHUNK = 2000; // chars per chunk — small enough for ~8s each
  // Raw story text (unmodified) — used for the monthly cap so the SAME story always
  // counts once, regardless of how we pace it.
  const rawText = text.slice(0, 10000);
  // Paced text — normalized punctuation + calm bedtime cadence. THIS is what we
  // actually send to ElevenLabs and cache.
  const fullText = paceStoryText(rawText);
  // Cache key by voice + PACING_VERSION + model + exact text → same story in same
  // voice replays instantly. PACING_VERSION busts stale "rushed" clips when the
  // pacing logic changes so the new cadence takes effect immediately.
  const cacheKey = `tts-cache/${resolvedVoiceId}/${crypto.createHash('sha256').update(PACING_VERSION + '|' + model + '|' + fullText).digest('hex').slice(0, 40)}.mp3`;
  // Story key by RAW text only (voice-agnostic, pacing-agnostic) → monthly cap.
  const storyKey = crypto.createHash('sha256').update(rawText).digest('hex').slice(0, 40);

  // Soothing, consistent read. `speed` slows delivery for a calm bedtime pace.
  const baseVoiceSettings = { stability, similarity_boost: similarity, style, use_speaker_boost: true };

  const generateChunk = async (chunk) => {
    const call = (settings) => fetch(`https://api.elevenlabs.io/v1/text-to-speech/${resolvedVoiceId}`, {
      method: 'POST',
      headers: { 'xi-api-key': ELEVENLABS_KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
      body: JSON.stringify({ text: chunk, model_id: model, voice_settings: settings }),
    });

    // First try WITH speed. If the model/API rejects it (400/422), degrade
    // gracefully by retrying without `speed` so playback never breaks.
    let r = await call({ ...baseVoiceSettings, speed: NARRATION_SPEED });
    if (!r.ok && (r.status === 400 || r.status === 422)) {
      r = await call(baseVoiceSettings);
    }
    if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${await r.text()}`);
    // Strip the per-chunk ID3 header so concatenated chunks form one decodable stream.
    return stripId3(Buffer.from(await r.arrayBuffer()));
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

    // ── Monthly cap: 10 distinct cloned-voice stories per user per month (non-paid) ──
    // Runs only on a cache MISS (a genuinely new generation). Replays are served from
    // cache above and never count. The same story in a different voice counts once.
    if (voiceId && uid && !isPaidTier(tier)) {
      const db = await getFirestore();
      if (db) {
        const month = new Date().toISOString().slice(0, 7); // YYYY-MM
        const uref = db.collection('users').doc(uid);
        const snap = await uref.get();
        let usage = (snap.exists && snap.data().clonedVoiceUsage) || {};
        if (usage.month !== month) usage = { month, stories: [] };
        if (!usage.stories.includes(storyKey)) {
          if ((usage.stories || []).length >= 10) {
            return res.status(429).json({ error: 'monthly_limit', message: "You've reached 10 stories in your cloned voice this month. It resets next month." });
          }
          usage.stories.push(storyKey);
          await uref.set({ clonedVoiceUsage: usage }, { merge: true });
        }
      }
    }

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
