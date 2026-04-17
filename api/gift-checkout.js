// Stripe checkout for gift story packs — 1 month Pro subscription as a gift.
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { senderUid, senderEmail, recipientName, recipientEmail, message } = req.body || {};

  if (!recipientEmail) {
    return res.status(400).json({ error: 'Recipient email is required' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: senderEmail || undefined,
      line_items: [{
        price_data: {
          currency: 'cad',
          unit_amount: 999, // CA$9.99
          product_data: {
            name: 'My Sleepy Tale — Gift Story Pack',
            description: `1 month of unlimited bedtime stories for ${recipientName || recipientEmail}`,
          },
        },
        quantity: 1,
      }],
      metadata: {
        type: 'gift',
        senderUid: senderUid || '',
        senderEmail: senderEmail || '',
        recipientName: recipientName || '',
        recipientEmail,
        message: (message || '').slice(0, 500),
      },
      success_url: `${req.headers.origin || 'https://mysleepytale.com'}/settings?gift=success`,
      cancel_url: `${req.headers.origin || 'https://mysleepytale.com'}/settings?gift=cancel`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Gift checkout error:', err);
    return res.status(500).json({ error: 'Could not create gift checkout' });
  }
}
