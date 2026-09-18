// ElevenLabs Voice Cloning — creates a cloned voice from an audio sample.
// Accepts audio as base64 or fetches from Firebase Storage URL.
// Gated server-side: the FIRST clone is free; additional voices require a paid tier.
// Persists the clone to users/{uid}.voiceClones (admin SDK) so it's the source of truth.
import { getFirestore } from './_firebase.js';
import { getUserTier, isPaidTier } from './_entitlement.js';

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;
const FREE_CLONES = 1;

export const config = { api: { bodyParser: { sizeLimit: '6mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!ELEVENLABS_KEY) {
    return res.status(503).json({ error: 'ElevenLabs not configured' });
  }

  const { uid, name, relation, audioBase64, audioUrl, language, description, contentType } = req.body || {};

  if (!name) {
    return res.status(400).json({ error: 'Voice name is required' });
  }
  if (!uid) {
    return res.status(401).json({ error: 'Sign in required' });
  }

  // ── Paid gating: first voice free, extras require a paid plan (server-authoritative) ──
  const db = await getFirestore();
  let existing = [];
  try {
    const snap = db ? await db.collection('users').doc(uid).get() : null;
    existing = (snap && snap.exists && snap.data().voiceClones) || [];
  } catch { existing = []; }
  if (existing.length >= FREE_CLONES) {
    const tier = await getUserTier(uid);
    if (!isPaidTier(tier)) {
      return res.status(402).json({ error: 'upgrade_required', message: 'Your first voice is free — add more with Family Plus.' });
    }
  }

  try {
    let audioBuffer;

    if (audioBase64) {
      // Audio sent as base64
      audioBuffer = Buffer.from(audioBase64, 'base64');
    } else if (audioUrl) {
      // Fetch audio from Firebase Storage URL
      const audioRes = await fetch(audioUrl);
      if (!audioRes.ok) throw new Error('Failed to fetch audio from storage');
      audioBuffer = Buffer.from(await audioRes.arrayBuffer());
    } else {
      return res.status(400).json({ error: 'Audio data required (audioBase64 or audioUrl)' });
    }

    // Create form data for ElevenLabs API
    const formData = new FormData();
    formData.append('name', `My Sleepy Tale - ${name}`);
    formData.append('description', description || `Voice clone for ${name} (${language || 'English'})`);
    // ElevenLabs accepts wav/mp3/m4a reliably; webm/opus often fails. Client sends WAV.
    const ct = contentType || 'audio/webm';
    const ext = ct.includes('wav') ? 'wav' : (ct.includes('mp4') || ct.includes('m4a')) ? 'm4a' : (ct.includes('mpeg') || ct.includes('mp3')) ? 'mp3' : 'webm';
    formData.append('files', new Blob([audioBuffer], { type: ct }), `${name}.${ext}`);

    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('ElevenLabs clone error:', response.status, err);
      return res.status(response.status).json({
        error: response.status === 401 ? 'Invalid API key'
             : response.status === 429 ? 'Rate limit reached'
             : `Voice cloning failed (${response.status})`,
      });
    }

    const data = await response.json();

    const clone = {
      id: data.voice_id,
      name,
      relation: relation || '',
      language: language || 'English',
      createdAt: new Date().toISOString(),
    };

    // Persist to users/{uid}.voiceClones (server-owned source of truth)
    try {
      if (db) {
        const fb = (await import('firebase-admin')).default;
        await db.collection('users').doc(uid).set(
          { voiceClones: fb.firestore.FieldValue.arrayUnion(clone) },
          { merge: true }
        );
      }
    } catch (e) { console.warn('voiceClones persist failed:', e.message); }

    return res.status(200).json({ voiceId: data.voice_id, name: data.name, clone });
  } catch (err) {
    console.error('Clone voice error:', err);
    return res.status(500).json({ error: 'Voice cloning failed' });
  }
}
