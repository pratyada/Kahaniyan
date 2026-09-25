// Server-side entitlement — the single source of truth for a user's plan.
// The client can DISPLAY a tier, but paid actions must call getUserTier() here,
// which reads the webhook-set `subscriptionTier` (client-immutable via Firestore
// rules). Never trust a tier sent from the client.
import { getFirestore } from './_firebase.js';

const PAID_TIERS = new Set(['pro', 'family', 'enterprise', 'annual', 'premium']);

export function isPaidTier(tier) {
  return PAID_TIERS.has(String(tier || '').toLowerCase());
}

// ── Launch promo: voice cloning + cloned-voice playback FREE for EVERYONE until
// this date (announced by the "hear your voice" launch email). After it lapses,
// voice reverts to a paid feature. Change VOICE_FREE_UNTIL to extend/end it.
export const VOICE_FREE_UNTIL = process.env.VOICE_FREE_UNTIL || '2026-10-06T04:00:00Z'; // extended so the "free next week" weekend newsletter stays truthful (~Oct 5 EOD ET)
export function isVoicePromoActive() {
  return new Date() < new Date(VOICE_FREE_UNTIL);
}
// True if the user may use cloned voices right now (paid OR during the free promo).
export function canUseClonedVoice(tier) {
  return isPaidTier(tier) || isVoicePromoActive();
}

// Authoritative tier for a uid, read from users/{uid}.subscriptionTier.
// Falls back to 'free' on any error / missing config (fail closed).
export async function getUserTier(uid) {
  if (!uid) return 'free';
  try {
    const db = await getFirestore();
    if (!db) return 'free';
    const snap = await db.collection('users').doc(uid).get();
    if (!snap.exists) return 'free';
    return snap.data().subscriptionTier || 'free';
  } catch {
    return 'free';
  }
}

export async function requirePaid(uid) {
  const tier = await getUserTier(uid);
  return { tier, paid: isPaidTier(tier) };
}

// Plan catalogue — the ONE place pricing/features live. Price labels come from
// env so they can be changed to match Stripe without a code deploy. Stripe price
// IDs stay server-only (in create-checkout.js) and are never exposed here.
export const PLANS = [
  {
    tier: 'free',
    name: 'Free',
    priceLabel: 'Free',
    period: '',
    checkoutTier: null,
    features: ['150+ audio stories', 'Default narrator', 'Search & categories'],
  },
  {
    tier: 'family',
    name: 'Family Plus',
    priceLabel: process.env.FAMILY_PRICE_LABEL || 'CA$6.99',
    period: process.env.FAMILY_PRICE_PERIOD || '/mo',
    checkoutTier: 'family',
    highlighted: true,
    trial: process.env.FAMILY_TRIAL || '7 nights free',
    features: ['Everything in Free', 'Family voice clones', 'Unlimited creations', 'Ad-free', 'Up to 3 kids'],
  },
];
