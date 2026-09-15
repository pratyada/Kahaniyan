// GET /api/plans — public plan catalogue (names, price labels, features) for the
// client to render. Stripe price IDs are NOT here (server-only in create-checkout).
import { PLANS } from './_entitlement.js';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=300');
  return res.status(200).json({ plans: PLANS });
}
