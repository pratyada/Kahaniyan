// Voice link — generate a secure, expiring link for remote voice recording.
// Token is stored in Firestore voiceLinks/{token} with a 5-minute TTL.

import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../lib/firebase.js';

const EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

function generateToken() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function createVoiceLink({ characterName, relation, emoji }) {
  if (!db || !auth?.currentUser) throw new Error('Not authenticated');
  const token = generateToken();
  const data = {
    token,
    userId: auth.currentUser.uid,
    userEmail: auth.currentUser.email || '',
    characterName,
    relation,
    emoji: emoji || '🎤',
    expiresAt: new Date(Date.now() + EXPIRY_MS).toISOString(),
    used: false,
    audioUrl: null,
    createdAt: new Date().toISOString(),
  };
  await setDoc(doc(db, 'voiceLinks', token), data);
  const url = `${window.location.origin}/record/${token}`;
  return { token, url, expiresAt: data.expiresAt };
}

export async function getVoiceLink(token) {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'voiceLinks', token));
  if (!snap.exists()) return null;
  const data = snap.data();
  const expired = new Date(data.expiresAt) < new Date();
  return { ...data, expired };
}

export async function uploadVoiceRecording(token, blob) {
  if (!storage || !db) throw new Error('Storage not configured');
  // Upload audio blob to Firebase Storage
  const storageRef = ref(storage, `voices/${token}.webm`);
  await uploadBytes(storageRef, blob, { contentType: blob.type || 'audio/webm' });
  const audioUrl = await getDownloadURL(storageRef);
  // Update the voiceLink doc
  await setDoc(doc(db, 'voiceLinks', token), { used: true, audioUrl, recordedAt: new Date().toISOString() }, { merge: true });
  return audioUrl;
}
