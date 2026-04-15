// Stripe checkout for investment contributions — one-time payments.
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { amount, role, uid, email, displayName } = req.body || {};
  const cents = Math.round(Number(amount) * 100);

  if (!cents || cents < 10000) { // min CA$100
    return res.status(400).json({ error: 'Minimum contribution is CA$100' });
  }
  if (cents > 1000000) { // max CA$10,000
    return res.status(400).json({ error: 'Maximum contribution is CA$10,000' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email || undefined,
      line_items: [{
        price_data: {
          currency: 'cad',
          unit_amount: cents,
          product_data: {
            name: `My Sleepy Tale Friends & Family — ${role || 'Investor'}`,
            description: `CA$${amount} contribution to My Sleepy Tale. Tokens allocated after round closes.`,
          },
        },
        quantity: 1,
      }],
      success_url: `${req.headers.origin || 'https://mysleepytale.com'}/invest?paid=true&amount=${amount}`,
      cancel_url: `${req.headers.origin || 'https://mysleepytale.com'}/invest?cancelled=true`,
      metadata: { uid: uid || '', role: role || 'investor', amount: String(amount), displayName: displayName || '' },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Invest checkout error:', err);
    return res.status(500).json({ error: err.message });
  }
}
