// POST /api/kid-story-presign — Generate pre-signed S3 URL for kid audio upload
// Avoids Lambda body size limit. Client uploads directly to S3.

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getFirestore } from './_firebase.js';

const s3 = new S3Client({ region: 'us-east-1' });
const BUCKET = 'mysleepytale-app';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { parentUid, profileIndex = 0, contentType = 'audio/webm' } = req.body || {};
  if (!parentUid) return res.status(400).json({ error: 'parentUid required' });

  // Verify parent exists
  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Firestore not available' });
  const userSnap = await db.collection('users').doc(parentUid).get();
  if (!userSnap.exists) return res.status(403).json({ error: 'User not found' });

  const kidId = `${parentUid}_${profileIndex}`;
  const storyId = `ks_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const ext = contentType.includes('mp4') ? 'mp4' : 'webm';
  const audioKey = `audio/kids/${kidId}/${storyId}.${ext}`;

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: audioKey,
      ContentType: contentType,
      CacheControl: 'public, max-age=2592000',
    });
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 600 }); // 10 min

    return res.json({ uploadUrl, storyId, audioKey, kidId });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
