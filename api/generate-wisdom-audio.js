// Admin endpoint: generate TTS audio for a wisdom story and cache to Firebase Storage.
// POST /api/generate-wisdom-audio { lessonId, text, narrator }
// Returns { audioUrl } — the Firebase Storage download URL.

const OPENAI_KEY = process.env.OPENAI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!OPENAI_KEY) return res.status(503).json({ error: 'OpenAI not configured' });

  const { lessonId, text } = req.body || {};
  if (!lessonId || !text) return res.status(400).json({ error: 'lessonId and text required' });

  // Cap at OpenAI TTS limit
  const trimmed = text.slice(0, 4096);

  try {
    // Generate audio via OpenAI TTS
    const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: trimmed,
        voice: 'nova', // warm female — best for storytelling
        speed: 0.9,
        response_format: 'opus',
      }),
    });

    if (!ttsRes.ok) {
      const err = await ttsRes.text();
      console.error('TTS error:', ttsRes.status, err);
      return res.status(ttsRes.status).json({ error: 'TTS failed' });
    }

    // Read the audio as a buffer
    const arrayBuffer = await ttsRes.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    // Upload to Firebase Storage
    const { initializeApp, cert, getApps } = await import('firebase-admin/app');
    const { getStorage } = await import('firebase-admin/storage');

    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET,
      });
    }

    const bucket = getStorage().bucket();
    const filePath = `wisdom-audio/${lessonId}.opus`;
    const file = bucket.file(filePath);

    await file.save(audioBuffer, {
      contentType: 'audio/ogg',
      metadata: { cacheControl: 'public, max-age=31536000' }, // cache forever
    });

    await file.makePublic();
    const audioUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    // Also save to Firestore for quick lookup
    const { getFirestore } = await import('firebase-admin/firestore');
    const db = getFirestore();
    await db.collection('config').doc('wisdomAudio').set(
      { [lessonId]: audioUrl },
      { merge: true }
    );

    return res.json({ audioUrl, lessonId });
  } catch (err) {
    console.error('Generate wisdom audio error:', err);
    return res.status(500).json({ error: err.message });
  }
}
