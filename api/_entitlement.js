// Server-side entitlement — the single source of truth for a user's plan.
// The client can DISPLAY a tier, but paid actions must call getUserTier() here,
// which reads the webhook-set `subscriptionTier` (client-immutable via Firestore
// rules). Never trust a tier sent from the client.
import { getFirestore } from './_firebase.js';

const PAID_TIERS = new Set(['pro', 'family', 'enterprise', 'annual', 'premium']);

export function isPaidTier(tier) {
  return PAID_TIERS.has(String(tier || '').toLowerCase());
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
