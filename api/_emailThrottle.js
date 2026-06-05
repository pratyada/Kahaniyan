// Email throttle layer — shared helper for all email endpoints
// Tracks sends in Firestore `emailLog`, enforces per-category rate limits,
// and checks newsletter opt-out list.
//
// Categories:
//   transactional — welcome, payment confirmed/failed, story approved: NO limit
//   activity       — contribution submitted/published/shared/rejected, story created: max 5/user/day
//   marketing      — weekly newsletter, blog announcement: max 1/user/week

import { getFirestore } from './_firebase.js';

/**
 * Check whether an email can be sent to this recipient under the given category.
 * @param {string} email  Recipient address
 * @param {string} category  'transactional' | 'activity' | 'marketing'
 * @returns {{ allowed: boolean, reason?: string }}
 */
export async function canSendEmail(email, category) {
  if (!email) return { allowed: false, reason: 'No email provided' };

  const lc = email.toLowerCase();

  // Transactional emails are never throttled
  if (category === 'transactional') return { allowed: true };

  const db = await getFirestore();
  if (!db) return { allowed: true }; // If Firestore is unavailable, allow (fail-open)

  try {
    if (category === 'activity') {
      // Max 5 per user per day
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const snap = await db.collection('emailLog')
        .where('email', '==', lc)
        .where('category', '==', 'activity')
        .where('sentAt', '>=', dayAgo)
        .orderBy('sentAt', 'desc')
        .limit(5)
        .get();
      if (snap.size >= 5) {
        return { allowed: false, reason: 'Activity email limit reached (5/day)' };
      }
    }

    if (category === 'marketing') {
      // Check unsubscribe first
      const unsub = await isUnsubscribed(lc);
      if (unsub) return { allowed: false, reason: 'User unsubscribed from marketing emails' };

      // Max 1 per user per week
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const snap = await db.collection('emailLog')
        .where('email', '==', lc)
        .where('category', '==', 'marketing')
        .where('sentAt', '>=', weekAgo)
        .orderBy('sentAt', 'desc')
        .limit(1)
        .get();
      if (snap.size >= 1) {
        return { allowed: false, reason: 'Marketing email limit reached (1/week)' };
      }
    }
  } catch (e) {
    // On error, allow (fail-open) but log
    console.error('[emailThrottle] canSendEmail error:', e.message);
  }

  return { allowed: true };
}

/**
 * Log a sent email to Firestore for throttle tracking.
 * @param {string} email     Recipient address
 * @param {string} type      Specific email type (e.g. 'series-shared', 'weekly-newsletter')
 * @param {string} category  'transactional' | 'activity' | 'marketing'
 * @param {string} subject   Email subject line
 */
export async function logEmail(email, type, category, subject) {
  if (!email) return;
  const db = await getFirestore();
  if (!db) return;

  try {
    await db.collection('emailLog').add({
      email: email.toLowerCase(),
      type,
      category,
      subject: subject || '',
      sentAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error('[emailThrottle] logEmail error:', e.message);
  }
}

/**
 * Check if an email address has opted out of marketing/newsletter emails.
 * @param {string} email
 * @returns {boolean}
 */
export async function isUnsubscribed(email) {
  if (!email) return false;
  const db = await getFirestore();
  if (!db) return false;

  try {
    const doc = await db.collection('config').doc('newsletterUnsubscribed').get();
    if (!doc.exists) return false;
    const data = doc.data();
    const list = (data.emails || []).map(e => e.toLowerCase());
    return list.includes(email.toLowerCase());
  } catch (e) {
    console.error('[emailThrottle] isUnsubscribed error:', e.message);
    return false;
  }
}
