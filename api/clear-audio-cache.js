// One-time admin endpoint to clear cached audioUrl from all stories.
// This forces regeneration with the latest TTS model on next play.
// Usage: POST /api/clear-audio-cache (admin only)

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db = null;
try {
  if (getApps().length === 0) {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;
    initializeApp(
      serviceAccount
        ? { credential: cert(serviceAccount), projectId: process.env.FIREBASE_PROJECT_ID || 'qissaa-61a78' }
        : { projectId: process.env.FIREBASE_PROJECT_ID || 'qissaa-61a78' }
    );
  }
  db = getFirestore();
} catch {}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!db) return res.status(500).json({ error: 'No database' });

  // Verify admin — simple secret check since Firebase Admin may not have service account
  const { email, secret } = req.body || {};
  const ADMIN_SECRET = process.env.ADMIN_SECRET || 'mysleepytale2024';
  if (secret !== ADMIN_SECRET) {
    // Try Firestore admin check as fallback
    try {
      const configDoc = await db.collection('config').doc('app').get();
      if (!configDoc.exists || !(configDoc.data().adminEmails || []).includes(email)) {
        return res.status(403).json({ error: 'Admin only' });
      }
    } catch {
      return res.status(403).json({ error: 'Auth failed' });
    }
  }

  let cleared = { sharedStories: 0, users: 0 };

  try {
    // Clear audioUrl from all shared stories
    const shared = await db.collection('sharedStories').get();
    const batch1 = db.batch();
    shared.forEach((doc) => {
      if (doc.data().audioUrl) {
        batch1.update(doc.ref, { audioUrl: null });
        cleared.sharedStories++;
      }
    });
    if (cleared.sharedStories > 0) await batch1.commit();

    // Clear audioUrl from all user libraries
    const users = await db.collection('users').get();
    for (const userDoc of users.docs) {
      const lib = userDoc.data().library;
      if (!lib || !Array.isArray(lib)) continue;
      const hasAudio = lib.some((s) => s.audioUrl);
      if (!hasAudio) continue;
      const cleaned = lib.map((s) => {
        if (s.audioUrl) { const { audioUrl, ...rest } = s; return rest; }
        return s;
      });
      await userDoc.ref.update({ library: cleaned });
      cleared.users++;
    }

    return res.status(200).json({
      success: true,
      cleared,
      message: `Cleared ${cleared.sharedStories} shared stories + ${cleared.users} user libraries. All stories will regenerate with tts-1-hd on next play.`,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
