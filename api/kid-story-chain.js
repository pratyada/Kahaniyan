// POST /api/kid-story-chain — Collaborative chain stories
// Kids build stories together: record parts, share link, others add their part
// Actions: create, join, claim-turn, release-turn, add-part, close, compile, get, list-mine

import { getFirestore } from './_firebase.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';

const s3 = new S3Client({ region: 'us-east-1' });
const BUCKET = 'mysleepytale-app';
const MAX_PARTS = 10;
const MAX_OPEN_CHAINS = 5;
const TURN_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function generateToken() {
  return crypto.randomBytes(12).toString('base64url');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { action } = req.body || {};
  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Firestore not available' });

  // ── CREATE chain ──
  if (action === 'create') {
    const { parentUid, profileIndex = 0, title, promptImageUrl, promptType, topic, language, contentType = 'audio/webm' } = req.body;
    if (!parentUid) return res.status(400).json({ error: 'parentUid required' });

    // Verify parent
    const userSnap = await db.collection('users').doc(parentUid).get();
    if (!userSnap.exists) return res.status(403).json({ error: 'User not found' });
    const profiles = userSnap.data().profiles || [];
    const kidProfile = profiles[profileIndex] || {};
    const kidId = `${parentUid}_${profileIndex}`;

    // Limit open chains
    const openChains = await db.collection('storyChains').where('originatorKidId', '==', kidId).where('status', '==', 'open').get();
    if (openChains.size >= MAX_OPEN_CHAINS) {
      return res.status(400).json({ error: `You can have max ${MAX_OPEN_CHAINS} open chain stories. Close one first.` });
    }

    const chainId = `chain_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const inviteToken = generateToken();

    // Create chain doc
    await db.collection('storyChains').doc(chainId).set({
      id: chainId,
      title: (title || 'Our Story').slice(0, 100),
      inviteToken,
      originatorKidId: kidId,
      originatorParentUid: parentUid,
      originatorKidName: kidProfile.childName || 'Creator',
      promptImageUrl: promptImageUrl || '',
      promptType: promptType || 'free',
      topic: (topic || '').slice(0, 200),
      language: language || 'English',
      status: 'open',
      partCount: 0,
      maxParts: MAX_PARTS,
      currentTurnKidId: kidId, // originator gets first turn
      currentTurnClaimedAt: new Date().toISOString(),
      participantKidIds: [kidId],
      participantNames: [kidProfile.childName || 'Creator'],
      totalDurationSeconds: 0,
      compiledParts: null,
      compiledVideoUrl: null,
      createdAt: new Date().toISOString(),
      closedAt: null,
      compiledAt: null,
    });

    // Generate presign URL for first part
    const storyId = `ks_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const ext = contentType.includes('mp4') ? 'mp4' : 'webm';
    const audioKey = `audio/kids/${kidId}/${storyId}.${ext}`;
    const uploadUrl = await getSignedUrl(s3, new PutObjectCommand({
      Bucket: BUCKET, Key: audioKey, ContentType: contentType, CacheControl: 'public, max-age=2592000',
    }), { expiresIn: 600 });

    const shareUrl = `https://mysleepytale.com/incubate/chain/join/${inviteToken}`;

    return res.json({ chainId, inviteToken, shareUrl, uploadUrl, storyId, audioKey, kidId });
  }

  // ── JOIN (lookup by invite token) ──
  if (action === 'join') {
    const { inviteToken } = req.body;
    if (!inviteToken) return res.status(400).json({ error: 'inviteToken required' });

    const snap = await db.collection('storyChains').where('inviteToken', '==', inviteToken).limit(1).get();
    if (snap.empty) return res.status(404).json({ error: 'Chain story not found' });

    const chain = { id: snap.docs[0].id, ...snap.docs[0].data() };

    // Fetch all parts
    const partsSnap = await db.collection('kidStories').where('chainId', '==', chain.id).get();
    const parts = partsSnap.docs.map(d => d.data()).sort((a, b) => (a.chainPartNumber || 0) - (b.chainPartNumber || 0));

    return res.json({ chain, parts });
  }

  // ── GET chain by ID ──
  if (action === 'get') {
    const { chainId } = req.body;
    if (!chainId) return res.status(400).json({ error: 'chainId required' });

    const chainSnap = await db.collection('storyChains').doc(chainId).get();
    if (!chainSnap.exists) return res.status(404).json({ error: 'Chain not found' });
    const chain = { id: chainSnap.id, ...chainSnap.data() };

    const partsSnap = await db.collection('kidStories').where('chainId', '==', chainId).get();
    const parts = partsSnap.docs.map(d => d.data()).sort((a, b) => (a.chainPartNumber || 0) - (b.chainPartNumber || 0));

    return res.json({ chain, parts });
  }

  // ── LIST MY CHAINS ──
  if (action === 'list-mine') {
    const { kidId } = req.body;
    if (!kidId) return res.status(400).json({ error: 'kidId required' });

    const snap = await db.collection('storyChains').where('participantKidIds', 'array-contains', kidId).get();
    const chains = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return res.json({ chains });
  }

  // ── CLAIM TURN ──
  if (action === 'claim-turn') {
    const { chainId, kidId, parentUid } = req.body;
    if (!chainId || !kidId) return res.status(400).json({ error: 'chainId and kidId required' });

    const chainRef = db.collection('storyChains').doc(chainId);
    const chainSnap = await chainRef.get();
    if (!chainSnap.exists) return res.status(404).json({ error: 'Chain not found' });
    const chain = chainSnap.data();

    if (chain.status !== 'open') return res.status(400).json({ error: 'Chain is closed' });
    if (chain.partCount >= chain.maxParts) return res.status(400).json({ error: 'Max parts reached' });

    // Check if someone else has the turn
    if (chain.currentTurnKidId && chain.currentTurnKidId !== kidId) {
      const claimedAt = chain.currentTurnClaimedAt ? new Date(chain.currentTurnClaimedAt).getTime() : 0;
      if (Date.now() - claimedAt < TURN_TIMEOUT_MS) {
        return res.json({ claimed: false, reason: 'Someone else is recording right now. Try again soon!', currentHolder: chain.participantNames[chain.participantKidIds?.indexOf(chain.currentTurnKidId)] || 'Another kid' });
      }
      // Turn expired — allow claim
    }

    await chainRef.update({
      currentTurnKidId: kidId,
      currentTurnClaimedAt: new Date().toISOString(),
    });

    const partNumber = chain.partCount + 1;

    // Generate presign URL
    const contentType = req.body.contentType || 'audio/webm';
    const storyId = `ks_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const ext = contentType.includes('mp4') ? 'mp4' : 'webm';
    const audioKey = `audio/kids/${kidId}/${storyId}.${ext}`;
    const uploadUrl = await getSignedUrl(s3, new PutObjectCommand({
      Bucket: BUCKET, Key: audioKey, ContentType: contentType, CacheControl: 'public, max-age=2592000',
    }), { expiresIn: 600 });

    return res.json({ claimed: true, partNumber, uploadUrl, storyId, audioKey });
  }

  // ── RELEASE TURN ──
  if (action === 'release-turn') {
    const { chainId, kidId } = req.body;
    if (!chainId) return res.status(400).json({ error: 'chainId required' });

    const chainRef = db.collection('storyChains').doc(chainId);
    const chainSnap = await chainRef.get();
    if (chainSnap.exists && chainSnap.data().currentTurnKidId === kidId) {
      await chainRef.update({ currentTurnKidId: null, currentTurnClaimedAt: null });
    }
    return res.json({ released: true });
  }

  // ── ADD PART ──
  if (action === 'add-part') {
    const { chainId, parentUid, profileIndex = 0, storyId, audioKey, title, durationSeconds, transcript } = req.body;
    if (!chainId || !parentUid || !storyId || !audioKey) {
      return res.status(400).json({ error: 'chainId, parentUid, storyId, audioKey required' });
    }

    const chainRef = db.collection('storyChains').doc(chainId);
    const chainSnap = await chainRef.get();
    if (!chainSnap.exists) return res.status(404).json({ error: 'Chain not found' });
    const chain = chainSnap.data();

    if (chain.status !== 'open') return res.status(400).json({ error: 'Chain is closed' });
    if (chain.partCount >= chain.maxParts) return res.status(400).json({ error: 'Max parts reached' });

    const kidId = `${parentUid}_${profileIndex}`;
    const userSnap = await db.collection('users').doc(parentUid).get();
    const kidProfile = (userSnap.data()?.profiles || [])[profileIndex] || {};
    const kidName = kidProfile.childName || 'Storyteller';

    const partNumber = chain.partCount + 1;
    const audioUrl = `https://mysleepytale.com/${audioKey}`;

    // Save as kidStory
    await db.collection('kidStories').doc(storyId).set({
      id: storyId,
      kidId,
      parentUid,
      profileIndex,
      kidName,
      kidAge: kidProfile.age || 7,
      title: (title || `Part ${partNumber}`).slice(0, 100),
      audioUrl,
      audioKey,
      transcript: (transcript || '').slice(0, 5000),
      promptImageUrl: chain.promptImageUrl || '',
      topic: chain.topic || '',
      promptType: chain.promptType || 'free',
      language: chain.language || 'English',
      durationSeconds: durationSeconds || 0,
      plays: 0,
      likes: 0,
      likedBy: [],
      visibility: 'private',
      approved: false,
      status: 'draft',
      videoUrl: null,
      chainId,
      chainPartNumber: partNumber,
      seriesId: null,
      episodeNumber: null,
      createdAt: new Date().toISOString(),
      publishedAt: null,
    });

    // Update chain
    const updates = {
      partCount: partNumber,
      currentTurnKidId: null,
      currentTurnClaimedAt: null,
      totalDurationSeconds: (chain.totalDurationSeconds || 0) + (durationSeconds || 0),
    };

    // Add participant if new
    if (!chain.participantKidIds?.includes(kidId)) {
      const { FieldValue } = await import('firebase-admin/firestore');
      updates.participantKidIds = FieldValue.arrayUnion(kidId);
      updates.participantNames = FieldValue.arrayUnion(kidName);
    }

    await chainRef.update(updates);

    // Award credits
    try {
      const { default: creditsHandler } = await import('./kid-credits.js');
      const creditType = partNumber === 1 ? 'chain_created' : 'chain_part_added';
      const fakeReq = { method: 'POST', body: { action: 'award', kidId, parentUid, type: creditType, storyId } };
      const fakeRes = { status: () => fakeRes, json: () => {} };
      await creditsHandler(fakeReq, fakeRes);
    } catch {}

    return res.json({ added: true, partNumber, storyId, audioUrl });
  }

  // ── CLOSE ──
  if (action === 'close') {
    const { chainId, parentUid } = req.body;
    if (!chainId || !parentUid) return res.status(400).json({ error: 'chainId and parentUid required' });

    const chainRef = db.collection('storyChains').doc(chainId);
    const chainSnap = await chainRef.get();
    if (!chainSnap.exists) return res.status(404).json({ error: 'Chain not found' });
    if (chainSnap.data().originatorParentUid !== parentUid) {
      return res.status(403).json({ error: 'Only the creator can close this chain' });
    }

    await chainRef.update({ status: 'closed', closedAt: new Date().toISOString(), currentTurnKidId: null });
    return res.json({ closed: true });
  }

  // ── COMPILE ──
  if (action === 'compile') {
    const { chainId, parentUid } = req.body;
    if (!chainId || !parentUid) return res.status(400).json({ error: 'chainId and parentUid required' });

    const chainRef = db.collection('storyChains').doc(chainId);
    const chainSnap = await chainRef.get();
    if (!chainSnap.exists) return res.status(404).json({ error: 'Chain not found' });
    const chain = chainSnap.data();
    if (chain.originatorParentUid !== parentUid) {
      return res.status(403).json({ error: 'Only the creator can compile' });
    }

    // Fetch all parts ordered
    const partsSnap = await db.collection('kidStories').where('chainId', '==', chainId).get();
    const parts = partsSnap.docs.map(d => d.data())
      .sort((a, b) => (a.chainPartNumber || 0) - (b.chainPartNumber || 0));

    const compiledParts = parts.map(p => ({
      audioUrl: p.audioUrl,
      kidName: p.kidName,
      partNumber: p.chainPartNumber,
      durationSeconds: p.durationSeconds || 0,
      storyId: p.id,
    }));

    await chainRef.update({
      status: 'compiled',
      compiledParts,
      compiledAt: new Date().toISOString(),
    });

    // Award compile credits to originator
    try {
      const { default: creditsHandler } = await import('./kid-credits.js');
      const fakeReq = { method: 'POST', body: { action: 'award', kidId: chain.originatorKidId, parentUid, type: 'chain_compiled', storyId: chainId } };
      const fakeRes = { status: () => fakeRes, json: () => {} };
      await creditsHandler(fakeReq, fakeRes);
    } catch {}

    return res.json({ compiled: true, parts: compiledParts, totalDuration: parts.reduce((s, p) => s + (p.durationSeconds || 0), 0) });
  }

  return res.status(400).json({ error: 'Invalid action. Use: create, join, claim-turn, release-turn, add-part, close, compile, get, list-mine' });
}
