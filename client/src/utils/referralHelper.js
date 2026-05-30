// Referral/Affiliate system — generate codes, track referrals, award credits.
// Credits accumulate. Compensation decided monthly by admin.

import { db, auth } from '../lib/firebase.js';
import { doc, getDoc, setDoc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';

// Credit values
const CREDIT_SIGNUP = 5;       // referrer gets when someone signs up with their code
const CREDIT_PURCHASE = 25;    // referrer gets when referee purchases subscription
const CREDIT_WELCOME = 2;     // new user gets for using a referral code

// Generate a referral code from child name: VEDA-7K3M
export function generateReferralCode(childName) {
  const prefix = (childName || 'USER').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4).padEnd(4, 'X');
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I,O,0,1 to avoid confusion
  let suffix = '';
  for (let i = 0; i < 4; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${suffix}`;
}

// Ensure current user has a referral code (called after login)
export async function ensureReferralCode(uid, childName) {
  if (!db || !uid) return null;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists() && snap.data().referralCode) {
      return snap.data().referralCode;
    }
    const code = generateReferralCode(childName || 'USER');
    await setDoc(userRef, { referralCode: code }, { merge: true });
    return code;
  } catch (e) {
    console.warn('[referral] ensureReferralCode failed:', e.message);
    return null;
  }
}

// Apply a referral code — called when new user signs up with a code
export async function applyReferralCode(code, newUserUid) {
  if (!db || !code || !newUserUid) return { success: false, error: 'Invalid input' };
  const normalizedCode = code.trim().toUpperCase();

  try {
    // Find the referrer by code
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('referralCode', '==', normalizedCode));
    const snap = await getDocs(q);

    if (snap.empty) return { success: false, error: 'Invalid referral code' };

    const referrerDoc = snap.docs[0];
    const referrerUid = referrerDoc.id;

    if (referrerUid === newUserUid) return { success: false, error: 'Cannot use your own code' };

    // Check if already referred
    const newUserRef = doc(db, 'users', newUserUid);
    const newUserSnap = await getDoc(newUserRef);
    if (newUserSnap.exists() && newUserSnap.data().referredBy) {
      return { success: false, error: 'Already used a referral code' };
    }

    // Award credits to referrer
    await updateDoc(doc(db, 'users', referrerUid), {
      referralCredits: increment(CREDIT_SIGNUP),
      referralCount: increment(1),
    });

    // Save referral link on new user + welcome bonus
    await setDoc(newUserRef, {
      referredBy: normalizedCode,
      referredByUid: referrerUid,
      referralCredits: increment(CREDIT_WELCOME),
    }, { merge: true });

    return { success: true, referrerName: referrerDoc.data().displayName || 'a friend' };
  } catch (e) {
    console.warn('[referral] applyReferralCode failed:', e.message);
    return { success: false, error: e.message };
  }
}

// Award credits when referee purchases subscription (called from webhook or admin)
export async function awardPurchaseCredit(refereeUid) {
  if (!db || !refereeUid) return;
  try {
    const userSnap = await getDoc(doc(db, 'users', refereeUid));
    if (!userSnap.exists() || !userSnap.data().referredByUid) return;
    const referrerUid = userSnap.data().referredByUid;
    await updateDoc(doc(db, 'users', referrerUid), {
      referralCredits: increment(CREDIT_PURCHASE),
    });
  } catch (e) {
    console.warn('[referral] awardPurchaseCredit failed:', e.message);
  }
}

// Get referral stats for a user
export async function getReferralStats(uid) {
  if (!db || !uid) return null;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
      code: data.referralCode || null,
      credits: data.referralCredits || 0,
      count: data.referralCount || 0,
      referredBy: data.referredBy || null,
    };
  } catch {
    return null;
  }
}
