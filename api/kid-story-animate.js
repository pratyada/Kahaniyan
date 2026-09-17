// POST /api/kid-story-animate — Animate a kid's story picture with Higgsfield image-to-video.
//
// Replaces the old Google Veo (Gemini) path, which errored because GCP video
// billing was never enabled. Higgsfield exposes the same "animate a still image"
// capability over a plain REST API, so no GCP billing is involved.
//
// ── Higgsfield REST API (image-to-video) ────────────────────────────────────
// Verified from docs.higgsfield.ai (quickstart, requests lifecycle, file-uploads)
// and the official Node SDK (higgsfield-ai/higgsfield-js). A few fine details
// (exact model tier names, per-model duration limits) could only be confirmed
// from the SDK/CLI, so the base URL, endpoint, and model are env-overridable
// below in case Higgsfield renames them — see the "follow-ups" note in comments.
//
//   Base URL : https://platform.higgsfield.ai   (SDK v2 default; docs also show
//              https://api.higgsfield.ai — override with HIGGSFIELD_BASE_URL)
//   Auth     : header  Authorization: Key <KEY_ID>:<KEY_SECRET>
//   Submit   : POST {base}/v1/image2video/dop
//              body { input: {
//                model:        'dop-turbo',          // fastest/cheapest DoP tier
//                prompt:       '<kid-safe motion prompt>',
//                input_images: [{ type:'image_url', image_url:'<https url>' }],
//                duration:     5,                     // seconds
//                aspect_ratio: '9:16',                // vertical for sharing
//                seed:         <int>
//              } }
//   Submit response (async, HTTP 200/202):
//              { status:'queued', request_id, status_url, cancel_url }
//   Poll     : GET <status_url>   (equivalently {base}/requests/{request_id}/status)
//              -> { status, video:{ url }, error }
//   States   : queued | in_progress | completed | failed | nsfw | canceled
//
// Image-to-video is inherently async and commonly takes longer than a Lambda can
// block for. We therefore poll only up to POLL_BUDGET_MS (~55s wall clock) and,
// if the job hasn't finished, persist the request_id and return {status:'processing'}
// (HTTP 200, no videoUrl). The client already treats a missing videoUrl as
// "not animated yet" and never blocks on it. A subsequent call RESUMES polling the
// same request_id instead of paying to generate the clip again.
//
// Entitlement: left OPEN to all signed-in users. The Build UI already throttles
// creation via the per-kid "sparkle" quota, and gating here would break the common
// path (free kids animating their first story). We only verify the parent owns the
// story. Flip GATE_TO_PAID below to require a paid tier if abuse shows up.

import { getFirestore } from './_firebase.js';
import { getUserTier, isPaidTier } from './_entitlement.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// ── Higgsfield config (secrets come from env only — never hard-code) ──────────
// Accepts EITHER two vars (HIGGSFIELD_API_KEY = key id, HIGGSFIELD_SECRET = secret)
// OR a single pre-joined "keyId:secret" value in HIGGSFIELD_API_KEY.
const HF_KEY = process.env.HIGGSFIELD_API_KEY || '';
const HF_SECRET = process.env.HIGGSFIELD_SECRET || '';
const HF_CREDENTIALS = HF_SECRET ? `${HF_KEY}:${HF_SECRET}` : HF_KEY;
const HF_CONFIGURED = HF_CREDENTIALS.split(':').filter(Boolean).length >= 2;

const HF_BASE = (process.env.HIGGSFIELD_BASE_URL || 'https://platform.higgsfield.ai').replace(/\/$/, '');
const HF_I2V_PATH = process.env.HIGGSFIELD_I2V_PATH || '/v1/image2video/dop';
const HF_MODEL = process.env.HIGGSFIELD_MODEL || 'dop-turbo';

const GATE_TO_PAID = false;         // see "Entitlement" note above
const POLL_BUDGET_MS = 55_000;      // stay comfortably under the Lambda timeout
const POLL_INTERVAL_MS = 4_000;

// Optional prompt polish (best-effort; falls back to a fixed kid-safe template).
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

const s3 = new S3Client({ region: 'us-east-1' });
const BUCKET = 'mysleepytale-app';

function hfHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Key ${HF_CREDENTIALS}`,
  };
}

// Build a kid-safe animation prompt from the child's transcript. Deterministic
// template first (always works); optionally let Claude tighten it (best-effort).
async function buildAnimationPrompt(transcript, topic) {
  const gist = (transcript || topic || 'a cozy little story').slice(0, 300);
  const base =
    `Gently animate this children's illustration to match: ${gist}. ` +
    `Soft, whimsical, calm bedtime motion with warm golden light and a few floating sparkles. ` +
    `Keep the original characters and colors. No scary, fast, or violent motion. No text or words.`;

  if (!ANTHROPIC_KEY) return base;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 180,
        system:
          `You write ONE short (1-2 sentence) image-to-video motion prompt for a children's ` +
          `bedtime platform. Style: warm, cozy, Pixar-meets-Ghibli, soft golden light, gentle ` +
          `movement, a few magical sparkles. Never scary/fast/violent. Never mention text, words, ` +
          `or UI. Reply with ONLY the prompt.`,
        messages: [{ role: 'user', content: `Topic: ${topic || 'a story'}\n\nChild's story:\n"${gist}"` }],
      }),
    });
    if (!res.ok) return base;
    const data = await res.json();
    const text = data?.content?.[0]?.text?.trim();
    return text ? `${text} No scary or violent motion. No text or words.` : base;
  } catch {
    return base; // never fail animation because the prompt polish is down
  }
}

// Submit an image-to-video job. Returns { requestId, statusUrl }.
async function submitJob(imageUrl, prompt) {
  const res = await fetch(`${HF_BASE}${HF_I2V_PATH}`, {
    method: 'POST',
    headers: hfHeaders(),
    body: JSON.stringify({
      // Higgsfield expects the top-level field `params` (verified live: `input` → 422).
      params: {
        model: HF_MODEL,
        prompt,
        input_images: [{ type: 'image_url', image_url: imageUrl }],
        duration: 5,
        aspect_ratio: '9:16',
        seed: Math.floor(Math.random() * 1_000_000),
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Higgsfield submit ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  const requestId = data.request_id || data.id;
  if (!requestId) throw new Error('Higgsfield submit: no request_id in response');
  const statusUrl = data.status_url || `${HF_BASE}/requests/${requestId}/status`;
  return { requestId, statusUrl };
}

// Poll one job. Returns { done, status, videoUrl?, error? } once — no waiting.
async function pollOnce(statusUrl) {
  const res = await fetch(statusUrl, { headers: hfHeaders() });
  if (!res.ok) return { done: false, status: 'in_progress' }; // transient — keep polling
  const data = await res.json();
  const status = data.status;
  if (status === 'completed') {
    const videoUrl = data.video?.url || data.result?.video?.url || null;
    return { done: true, status, videoUrl };
  }
  if (status === 'failed' || status === 'nsfw' || status === 'canceled') {
    return { done: true, status, error: data.error || status };
  }
  return { done: false, status: status || 'in_progress' };
}

// Poll until done or the time budget runs out. Returns the last pollOnce result;
// { done:false } means "still processing, come back later".
async function pollUntil(statusUrl, deadline) {
  let last = { done: false, status: 'queued' };
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    try {
      last = await pollOnce(statusUrl);
    } catch {
      last = { done: false, status: 'in_progress' };
    }
    if (last.done) return last;
  }
  return last;
}

// Mirror the finished clip onto our own S3/CDN (durable + mysleepytale.com branding).
// Best-effort: on any failure we fall back to Higgsfield's hosted URL.
async function mirrorToS3(videoUrl, kidId, storyId) {
  try {
    const r = await fetch(videoUrl);
    if (!r.ok) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    const key = `video/kids/${kidId}/${storyId}.mp4`;
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buf,
      ContentType: 'video/mp4',
      CacheControl: 'public, max-age=2592000',
    }));
    return `https://mysleepytale.com/${key}`;
  } catch (e) {
    console.error('[kid-story-animate] S3 mirror failed, using provider URL:', e.message);
    return null;
  }
}

// Persist the produced video and award credits (credits are best-effort).
async function finalize(storyRef, story, parentUid, providerVideoUrl) {
  const mirrored = await mirrorToS3(providerVideoUrl, story.kidId, storyRef.id);
  const videoUrl = mirrored || providerVideoUrl;

  await storyRef.update({
    videoUrl,
    animatedAt: new Date().toISOString(),
    animateRequestId: null, // clear the pending-job marker
  });

  try {
    const { default: creditsHandler } = await import('./kid-credits.js');
    const fakeReq = { method: 'POST', body: { action: 'award', kidId: story.kidId, parentUid, type: 'story_animated', storyId: storyRef.id } };
    const fakeRes = { status: () => fakeRes, json: () => {} };
    await creditsHandler(fakeReq, fakeRes);
  } catch { /* credits are non-critical */ }

  return videoUrl;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  // Not configured → 503, never crash. Client treats this as "animation unavailable".
  if (!HF_CONFIGURED) return res.status(503).json({ error: 'Animation not configured' });

  const { parentUid, storyId } = req.body || {};
  if (!parentUid || !storyId) return res.status(400).json({ error: 'parentUid and storyId required' });

  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Firestore not available' });

  try {
    const storyRef = db.collection('kidStories').doc(storyId);
    const storySnap = await storyRef.get();
    if (!storySnap.exists) return res.status(404).json({ error: 'Story not found' });

    const story = storySnap.data();
    if (story.parentUid !== parentUid) return res.status(403).json({ error: 'Not your story' });

    // Already animated → short-circuit (unchanged contract).
    if (story.videoUrl) return res.json({ videoUrl: story.videoUrl, cached: true });

    // Need a hosted picture to animate.
    const imageUrl = story.promptImageUrl;
    if (!imageUrl) return res.status(400).json({ error: 'No prompt image to animate. Record with an image prompt.' });

    // Optional paid gate (off by default — see header note).
    if (GATE_TO_PAID) {
      const tier = await getUserTier(parentUid);
      if (!isPaidTier(tier)) return res.status(402).json({ error: 'Animation is a premium feature' });
    }

    const deadline = Date.now() + POLL_BUDGET_MS;

    // Resume an in-flight job (from a previous call that timed out) instead of
    // paying to generate the clip again.
    if (story.animateRequestId) {
      const statusUrl = `${HF_BASE}/requests/${story.animateRequestId}/status`;
      const result = await pollUntil(statusUrl, deadline);
      if (result.done && result.videoUrl) {
        const videoUrl = await finalize(storyRef, story, parentUid, result.videoUrl);
        return res.json({ videoUrl, cached: false });
      }
      if (result.done && !result.videoUrl) {
        // Prior job failed/nsfw/canceled — clear it and fall through to a fresh submit.
        await storyRef.update({ animateRequestId: null });
      } else {
        return res.json({ status: 'processing', requestId: story.animateRequestId });
      }
    }

    // Fresh job: build prompt → submit → record request_id → poll within budget.
    const animationPrompt = await buildAnimationPrompt(story.transcript || '', story.topic || '');
    const { requestId, statusUrl } = await submitJob(imageUrl, animationPrompt);
    await storyRef.update({ animateRequestId: requestId });

    const result = await pollUntil(statusUrl, deadline);
    if (result.done && result.videoUrl) {
      const videoUrl = await finalize(storyRef, story, parentUid, result.videoUrl);
      return res.json({ videoUrl, cached: false });
    }
    if (result.done && !result.videoUrl) {
      await storyRef.update({ animateRequestId: null });
      return res.status(502).json({ error: `Animation ${result.status || 'failed'}` });
    }

    // Still running — persisted request_id lets the next call resume it.
    return res.json({ status: 'processing', requestId });
  } catch (e) {
    console.error('[kid-story-animate] Error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
