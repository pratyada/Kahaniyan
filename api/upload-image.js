// POST /api/upload-image — Upload a single image to S3.
// Body: { uid, key, image (base64), contentType }
// Returns: { imageUrl }

import { getFirestore } from './_firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, key, image, contentType } = req.body || {};
  if (!uid) return res.status(403).json({ error: 'Authentication required' });
  if (!key || !image) return res.status(400).json({ error: 'key and image required' });

  // Auth check — verify user exists
  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });
  const userSnap = await db.collection('users').doc(uid).get();
  if (!userSnap.exists) return res.status(403).json({ error: 'User not found' });

  try {
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    const s3 = new S3Client({ region: 'us-east-1' });

    await s3.send(new PutObjectCommand({
      Bucket: 'mysleepytale-app',
      Key: key,
      Body: Buffer.from(image, 'base64'),
      ContentType: contentType || 'image/jpeg',
      CacheControl: 'public, max-age=604800',
    }));

    return res.status(200).json({ imageUrl: `https://mysleepytale.com/${key}` });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
