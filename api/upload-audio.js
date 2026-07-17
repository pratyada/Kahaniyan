// POST /api/upload-audio — Upload TTS audio blob to S3.
// Body: { storyId, audio (base64), contentType, textHash }
// Returns: { audioUrl }

import { getFirestore } from './_firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, storyId, audio, contentType, textHash } = req.body || {};
  if (!uid) return res.status(403).json({ error: 'Authentication required' });
  if (!storyId || !audio) return res.status(400).json({ error: 'storyId and audio required' });

  // Auth check — verify user exists
  const db2 = await getFirestore();
  if (!db2) return res.status(500).json({ error: 'Database unavailable' });
  const userSnap = await db2.collection('users').doc(uid).get();
  if (!userSnap.exists) return res.status(403).json({ error: 'User not found' });

  try {
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    const s3 = new S3Client({ region: 'us-east-1' });

    const ext = (contentType || '').includes('ogg') ? 'opus' : 'mp3';
    const key = `audio/${storyId}.${ext}`;

    await s3.send(new PutObjectCommand({
      Bucket: 'mysleepytale-app',
      Key: key,
      Body: Buffer.from(audio, 'base64'),
      ContentType: contentType || 'audio/ogg',
      CacheControl: 'public, max-age=604800',
    }));

    const audioUrl = `https://mysleepytale.com/${key}`;

    // Update Firestore caches
    const db = await getFirestore();
    if (db) {
      const updates = {};
      updates[storyId] = audioUrl;
      await db.collection('config').doc('wisdomAudio').set(updates, { merge: true });

      if (textHash) {
        const hashUpdates = {};
        hashUpdates[storyId] = textHash;
        await db.collection('config').doc('audioHashes').set(hashUpdates, { merge: true });
      }

      await db.collection('sharedStories').doc(storyId).set(
        { audioUrl, ...(textHash ? { textHash } : {}) },
        { merge: true }
      ).catch(() => {});
    }

    return res.status(200).json({ audioUrl });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
