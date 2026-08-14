// POST /api/kid-story-save — Save kid story metadata to Firestore after S3 upload
// Also handles publish, approve, play, like actions

import { getFirestore } from './_firebase.js';

const BUCKET = 'mysleepytale-app';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { action } = req.body || {};

  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Firestore not available' });

  // ── SAVE new story ──
  if (!action || action === 'save') {
    const { parentUid, profileIndex = 0, storyId, audioKey, title, topic, promptImageUrl, promptType, language, durationSeconds, transcript } = req.body;
    if (!parentUid || !storyId || !audioKey) return res.status(400).json({ error: 'parentUid, storyId, audioKey required' });

    // Get kid name from profile
    const userSnap = await db.collection('users').doc(parentUid).get();
    if (!userSnap.exists) return res.status(403).json({ error: 'User not found' });
    const userData = userSnap.data();
    const profiles = userData.profiles || [];
    const kidProfile = profiles[profileIndex] || {};

    const kidId = `${parentUid}_${profileIndex}`;
    const audioUrl = `https://mysleepytale.com/${audioKey}`;

    const story = {
      id: storyId,
      kidId,
      parentUid,
      profileIndex,
      kidName: kidProfile.childName || 'Little Creator',
      kidAge: kidProfile.age || 7,
      title: (title || 'My Story').slice(0, 100),
      audioUrl,
      audioKey,
      transcript: (transcript || '').slice(0, 5000),
      promptImageUrl: promptImageUrl || '',
      topic: (topic || '').slice(0, 200),
      promptType: promptType || 'free',
      language: language || 'English',
      durationSeconds: durationSeconds || 0,
      plays: 0,
      likes: 0,
      likedBy: [],
      visibility: 'private',
      approved: false,
      status: 'draft',
      videoUrl: null,
      seriesId: null,
      episodeNumber: null,
      createdAt: new Date().toISOString(),
      publishedAt: null,
    };

    await db.collection('kidStories').doc(storyId).set(story);

    // Award credits (+5 for creating a story)
    try {
      const { default: creditsHandler } = await import('./kid-credits.js');
      const fakeReq = { method: 'POST', body: { action: 'award', kidId, parentUid, type: 'story_created', storyId } };
      const fakeRes = { status: () => fakeRes, json: () => {} };
      await creditsHandler(fakeReq, fakeRes);
    } catch {}

    return res.json({ saved: true, storyId, audioUrl });
  }

  // ── PUBLISH ──
  if (action === 'publish') {
    const { parentUid, storyId, visibility = 'private' } = req.body;
    if (!parentUid || !storyId) return res.status(400).json({ error: 'parentUid and storyId required' });

    const storyRef = db.collection('kidStories').doc(storyId);
    const storySnap = await storyRef.get();
    if (!storySnap.exists) return res.status(404).json({ error: 'Story not found' });
    if (storySnap.data().parentUid !== parentUid) return res.status(403).json({ error: 'Not your story' });

    const updates = { visibility, updatedAt: new Date().toISOString() };
    if (visibility === 'public') {
      updates.status = 'pending_approval'; // needs parent approval
    } else {
      updates.status = 'published';
      updates.publishedAt = new Date().toISOString();
      updates.approved = true;
    }

    await storyRef.update(updates);
    return res.json({ published: true, status: updates.status });
  }

  // ── APPROVE (parent approves public story) ──
  if (action === 'approve') {
    const { parentUid, storyId, decision } = req.body; // decision: 'approve' | 'reject'
    if (!parentUid || !storyId) return res.status(400).json({ error: 'parentUid and storyId required' });

    const storyRef = db.collection('kidStories').doc(storyId);
    const storySnap = await storyRef.get();
    if (!storySnap.exists) return res.status(404).json({ error: 'Story not found' });
    if (storySnap.data().parentUid !== parentUid) return res.status(403).json({ error: 'Not your story' });

    if (decision === 'approve') {
      await storyRef.update({ status: 'published', approved: true, publishedAt: new Date().toISOString() });
    } else {
      await storyRef.update({ status: 'rejected' });
    }

    return res.json({ approved: decision === 'approve' });
  }

  // ── PLAY (increment counter) ──
  if (action === 'play') {
    const { storyId } = req.body;
    if (!storyId) return res.status(400).json({ error: 'storyId required' });

    const storyRef = db.collection('kidStories').doc(storyId);
    const { FieldValue } = await import('firebase-admin/firestore');
    await storyRef.update({ plays: FieldValue.increment(1) });

    // Award +1 credit to story creator
    try {
      const storyData = (await storyRef.get()).data();
      if (storyData?.kidId) {
        const { default: creditsHandler } = await import('./kid-credits.js');
        const fakeReq = { method: 'POST', body: { action: 'award', kidId: storyData.kidId, parentUid: storyData.parentUid, type: 'play_received', storyId } };
        const fakeRes = { status: () => fakeRes, json: () => {} };
        await creditsHandler(fakeReq, fakeRes);
      }
    } catch {}

    return res.json({ played: true });
  }

  // ── LIKE / UNLIKE ──
  if (action === 'like' || action === 'unlike') {
    const { storyId, uid } = req.body;
    if (!storyId || !uid) return res.status(400).json({ error: 'storyId and uid required' });

    const storyRef = db.collection('kidStories').doc(storyId);
    const { FieldValue } = await import('firebase-admin/firestore');

    if (action === 'like') {
      await storyRef.update({
        likes: FieldValue.increment(1),
        likedBy: FieldValue.arrayUnion(uid),
      });
      // Award +2 credit to story creator
      try {
        const storyData = (await storyRef.get()).data();
        if (storyData?.kidId) {
          const { default: creditsHandler } = await import('./kid-credits.js');
          const fakeReq = { method: 'POST', body: { action: 'award', kidId: storyData.kidId, parentUid: storyData.parentUid, type: 'like_received', storyId } };
          const fakeRes = { status: () => fakeRes, json: () => {} };
          await creditsHandler(fakeReq, fakeRes);
        }
      } catch {}
    } else {
      await storyRef.update({
        likes: FieldValue.increment(-1),
        likedBy: FieldValue.arrayRemove(uid),
      });
    }
    return res.json({ [action + 'd']: true });
  }

  // ── DELETE ──
  if (action === 'delete') {
    const { parentUid, storyId } = req.body;
    if (!parentUid || !storyId) return res.status(400).json({ error: 'parentUid and storyId required' });

    const storyRef = db.collection('kidStories').doc(storyId);
    const storySnap = await storyRef.get();
    if (!storySnap.exists) return res.status(404).json({ error: 'Story not found' });
    if (storySnap.data().parentUid !== parentUid) return res.status(403).json({ error: 'Not your story' });

    await storyRef.delete();
    // Optionally delete S3 audio — skip for now (keep for safety review)
    return res.json({ deleted: true });
  }

  return res.status(400).json({ error: 'Invalid action' });
}
