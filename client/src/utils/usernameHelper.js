// Auto-generate and resolve usernames for creators.
// If user has no username, generates one from their name + random suffix.

import { db, auth } from '../lib/firebase.js';

export async function getOrCreateUsername() {
  if (!db || !auth?.currentUser) return null;

  const uid = auth.currentUser.uid;
  const email = auth.currentUser.email || '';
  const displayName = auth.currentUser.displayName || email.split('@')[0] || 'creator';

  try {
    const { doc, getDoc, setDoc } = await import('firebase/firestore');

    // Check if user already has a username
    const userSnap = await getDoc(doc(db, 'users', uid));
    if (userSnap.exists() && userSnap.data().username) {
      return userSnap.data().username;
    }

    // Generate username from name + random suffix
    const base = displayName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 15);
    const suffix = Math.random().toString(36).slice(2, 6);
    let username = `${base}-${suffix}`;

    // Check availability (unlikely to collide but be safe)
    const existing = await getDoc(doc(db, 'usernames', username));
    if (existing.exists()) {
      username = `${base}-${Math.random().toString(36).slice(2, 8)}`;
    }

    // Claim it
    await setDoc(doc(db, 'usernames', username), { uid, email });
    await setDoc(doc(db, 'users', uid), { username }, { merge: true });

    return username;
  } catch (e) {
    console.warn('[usernameHelper] Failed:', e.message);
    return null;
  }
}
