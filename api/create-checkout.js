// Creates a Stripe Checkout session for Pro or Enterprise subscription.
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_MAP = {
  pro: process.env.STRIPE_PRO_PRICE_ID,
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tier, uid, email } = req.body || {};

  if (!tier || !PRICE_MAP[tier]) {
    return res.status(400).json({ error: 'Invalid tier. Use "pro" or "enterprise".' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [{ price: PRICE_MAP[tier], quantity: 1 }],
      success_url: `${req.headers.origin || 'https://kahaniyan-sage.vercel.app'}/settings?upgraded=${tier}`,
      cancel_url: `${req.headers.origin || 'https://kahaniyan-sage.vercel.app'}/settings?cancelled=true`,
      metadata: { uid: uid || '', tier },
      subscription_data: {
        metadata: { uid: uid || '', tier },
      },
    });

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: err.message });
  }
}
