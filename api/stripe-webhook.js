// Stripe webhook — updates Firestore tier when a subscription changes.
import Stripe from 'stripe';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Init Firebase Admin
let db = null;
try {
  if (getApps().length === 0) {
    const sa = process.env.FIREBASE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) : null;
    initializeApp(
      sa ? { credential: cert(sa), projectId: 'qissaa-61a78' }
         : { projectId: 'qissaa-61a78' }
    );
  }
  db = getFirestore();
} catch (e) {
  console.warn('Firebase Admin init failed in webhook:', e.message);
}

async function updateUserTier(uid, tier) {
  if (!db || !uid) return;
  const docRef = db.collection('users').doc(uid);
  const snap = await docRef.get();
  if (!snap.exists) return;
  const profiles = snap.data().profiles || [];
  // Update tier on all profiles for this account
  const updated = profiles.map((p) => ({ ...p, tier }));
  await docRef.update({ profiles: updated, subscriptionTier: tier });
}

async function downgradeUser(uid) {
  return updateUserTier(uid, 'free');
}

// Vercel doesn't parse the body for webhooks — we need raw body
export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  let event;
  try {
    const rawBody = await getRawBody(req);
    const sig = req.headers['stripe-signature'];

    if (endpointSecret && sig) {
      event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    } else {
      // No webhook secret set — parse directly (test mode)
      event = JSON.parse(rawBody.toString());
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Webhook signature failed' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const uid = session.metadata?.uid;
        const tier = session.metadata?.tier;
        if (uid && tier) {
          await updateUserTier(uid, tier);
          console.log(`✅ Upgraded ${uid} to ${tier}`);
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.paused': {
        const sub = event.data.object;
        const uid = sub.metadata?.uid;
        if (uid) {
          await downgradeUser(uid);
          console.log(`⬇️ Downgraded ${uid} to free`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const uid = sub.metadata?.uid;
        if (sub.status === 'active' && uid) {
          const tier = sub.metadata?.tier || 'pro';
          await updateUserTier(uid, tier);
        } else if (sub.status === 'past_due' || sub.status === 'unpaid') {
          if (uid) await downgradeUser(uid);
        }
        break;
      }

      default:
        // Unhandled event type
        break;
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
  }

  return res.status(200).json({ received: true });
}
