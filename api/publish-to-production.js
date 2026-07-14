// POST /api/publish-to-production — Auto-add published content to series.js + share.js + deploy.
// Called after Content Publisher saves to Firestore.
// Body: { uid, contentId }
// This endpoint writes to S3 as a "production registry" — the actual series.js stays in git.
// The Player checks this registry as an additional source.

import { getFirestore } from './_firebase.js';

const FOUNDER_EMAILS = ['prateekyadav2010@gmail.com', 'rakshajoshi476@gmail.com'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, contentId } = req.body || {};
  if (!uid || !contentId) return res.status(400).json({ error: 'uid and contentId required' });

  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  // Auth check
  const userSnap = await db.collection('users').doc(uid).get();
  const email = userSnap.exists ? userSnap.data().email : '';
  if (!FOUNDER_EMAILS.includes(email.toLowerCase())) {
    return res.status(403).json({ error: 'Founder access only' });
  }

  // Get published content
  const snap = await db.collection('publishedContent').doc(contentId).get();
  if (!snap.exists) return res.status(404).json({ error: 'Content not found' });
  const content = snap.data();

  // Save to a "production registry" in Firestore that the Player checks
  // This is the bridge — instantly available without rebuilding series.js
  await db.collection('productionStories').doc(contentId).set({
    id: content.id,
    title: content.title,
    subtitle: content.subtitle || '',
    body: content.body,
    tradition: content.tradition || 'universal',
    theme: content.theme || 'kindness',
    value: content.theme || 'kindness',
    durationMinutes: content.durationMinutes || 2,
    source: content.source || '',
    seriesId: content.seriesId || null,
    episodeNumber: content.episodeNumber || null,
    coverImage: content.coverImage || null,
    images: content.images || [],
    gallery: (content.images || []).slice(1),
    ogImage: content.coverImage || null,
    multilingual: content.multilingual || false,
    enableTranslation: content.enableTranslation || false,
    audioUrl: content.audioUrl || null,
    blog: content.blog || null,
    storyArt: content.storyArt || null,
    imagePrompt: content.imagePrompt || '',
    publishedAt: new Date().toISOString(),
    status: 'live',
  });

  // Also update the share API cache
  await db.collection('config').doc('productionStoryMeta').set({
    [contentId]: {
      title: content.title,
      tradition: content.tradition || 'Universal',
      duration: content.durationMinutes || 2,
      series: content.source || null,
      ogImage: content.coverImage || null,
    }
  }, { merge: true });

  return res.status(200).json({
    status: 'live',
    storyLink: `https://mysleepytale.com/api/share?id=${contentId}`,
    message: 'Story is now in production registry — loads instantly.',
  });
}
