// Subscription notification emails
// POST /api/subscription-notify { type: "confirmed"|"failed"|"cancelled", email, tier, userName }

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const FROM_EMAIL = 'hello@mysleepytale.com';
const ses = new SESClient({ region: 'us-east-1' });

async function sendEmail(to, subject, html, text) {
  const cmd = new SendEmailCommand({
    Source: `My Sleepy Tale <${FROM_EMAIL}>`,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: {
        Text: { Data: text },
        Html: { Data: html },
      },
    },
  });
  return ses.send(cmd);
}

function wrap(title, body) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#c8c3ba;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:24px;">
    <span style="font-size:40px;">🌙</span>
    <h1 style="color:#f0a500;font-size:18px;margin:8px 0 4px;">${title}</h1>
    <p style="color:#6e6a63;font-size:12px;margin:0;">My Sleepy Tale</p>
  </div>
  <div style="background:#12121c;border-radius:16px;padding:24px;margin-bottom:24px;border:1px solid #1a1a28;">
    ${body}
  </div>
  <p style="color:#4a4a5a;font-size:11px;text-align:center;">
    My Sleepy Tale · <a href="https://mysleepytale.com" style="color:#f0a500;">mysleepytale.com</a> · <a href="https://instagram.com/mysleepytale_official" style="color:#f0a500;">@mysleepytale_official</a>
  </p>
</div></body></html>`;
}

const TIER_FEATURES = {
  'Dreamer': [
    'Unlimited bedtime stories',
    'Personalized story recommendations',
    'Family profile with up to 3 children',
  ],
  'Explorer': [
    'Everything in Dreamer',
    'Create your own stories',
    'Personal series with sharing',
    'Premium narration voices',
    'Family profile with up to 6 children',
  ],
  'Storyteller': [
    'Everything in Explorer',
    'Unlimited personal series',
    'Priority story review',
    'Early access to new features',
    'Unlimited family profiles',
  ],
};

function buildConfirmedEmail(userName, tier) {
  const features = TIER_FEATURES[tier] || TIER_FEATURES['Dreamer'];
  const featureList = features.map(f => `<li style="padding:4px 0;font-size:13px;color:#a8a39a;">${f}</li>`).join('');

  const subject = `Welcome to My Sleepy Tale ${tier}!`;
  const html = wrap(`Welcome to ${tier}!`, `
    <div style="text-align:center;margin-bottom:16px;">
      <span style="font-size:48px;">🎉</span>
    </div>
    <p style="font-size:15px;line-height:1.7;margin:0 0 12px;text-align:center;">
      Welcome, <strong style="color:#f5f0e8;">${userName || 'Storyteller'}</strong>! Your <strong style="color:#f0a500;">${tier}</strong> subscription is now active.
    </p>
    <div style="background:#48bb7810;border:1px solid #48bb7830;border-radius:12px;padding:16px;margin-bottom:16px;">
      <p style="font-size:11px;color:#6e6a63;margin:0 0 8px;">YOUR ${tier.toUpperCase()} FEATURES</p>
      <ul style="margin:0;padding-left:16px;list-style:disc;">${featureList}</ul>
    </div>
    <p style="font-size:14px;color:#a8a39a;margin:0 0 16px;">
      Start exploring your new features tonight at bedtime!
    </p>
    <div style="text-align:center;">
      <a href="https://mysleepytale.com" style="display:inline-block;background:#f0a500;color:#0a0a0f;font-size:14px;font-weight:bold;padding:12px 28px;border-radius:50px;text-decoration:none;">
        Explore Now
      </a>
    </div>
  `);
  const text = `Welcome to My Sleepy Tale ${tier}! Your subscription is active. Features: ${features.join(', ')}. Start exploring: https://mysleepytale.com`;
  return { subject, html, text };
}

function buildFailedEmail(userName, tier) {
  const subject = `Payment issue with your subscription`;
  const html = wrap('Payment Issue', `
    <p style="font-size:15px;line-height:1.7;margin:0 0 12px;">
      Hi <strong style="color:#f5f0e8;">${userName || 'there'}</strong>,
    </p>
    <p style="font-size:14px;line-height:1.7;color:#a8a39a;margin:0 0 16px;">
      We had trouble processing the payment for your <strong style="color:#f0a500;">${tier || ''}</strong> subscription. To keep your features active, please update your payment details.
    </p>
    <div style="background:#ff634710;border:1px solid #ff634730;border-radius:12px;padding:16px;margin-bottom:16px;">
      <p style="font-size:13px;color:#ff6347;margin:0;">If your payment method isn't updated soon, your subscription features may be paused.</p>
    </div>
    <div style="text-align:center;">
      <a href="https://mysleepytale.com/settings" style="display:inline-block;background:#f0a500;color:#0a0a0f;font-size:14px;font-weight:bold;padding:12px 28px;border-radius:50px;text-decoration:none;">
        Update Payment Details
      </a>
    </div>
  `);
  const text = `Hi ${userName || 'there'}, we had trouble processing the payment for your ${tier || ''} subscription. Please update your payment details at https://mysleepytale.com/settings`;
  return { subject, html, text };
}

function buildCancelledEmail(userName, tier) {
  const features = TIER_FEATURES[tier] || TIER_FEATURES['Dreamer'];
  const lostList = features.map(f => `<li style="padding:4px 0;font-size:13px;color:#a8a39a;text-decoration:line-through;opacity:0.7;">${f}</li>`).join('');

  const subject = `We're sorry to see you go`;
  const html = wrap('Subscription Cancelled', `
    <p style="font-size:15px;line-height:1.7;margin:0 0 12px;">
      Hi <strong style="color:#f5f0e8;">${userName || 'there'}</strong>,
    </p>
    <p style="font-size:14px;line-height:1.7;color:#a8a39a;margin:0 0 16px;">
      Your <strong style="color:#f0a500;">${tier || ''}</strong> subscription has been cancelled. We're sorry to see you go.
    </p>
    <div style="background:#ff634710;border:1px solid #ff634730;border-radius:12px;padding:16px;margin-bottom:16px;">
      <p style="font-size:11px;color:#6e6a63;margin:0 0 8px;">YOU'LL LOSE ACCESS TO</p>
      <ul style="margin:0;padding-left:16px;list-style:disc;">${lostList}</ul>
    </div>
    <p style="font-size:14px;color:#a8a39a;margin:0 0 16px;">
      You can still enjoy our free stories anytime. And if you change your mind, you can resubscribe whenever you like — we'll be here with a warm welcome.
    </p>
    <div style="text-align:center;">
      <a href="https://mysleepytale.com/settings" style="display:inline-block;background:#f0a500;color:#0a0a0f;font-size:14px;font-weight:bold;padding:12px 28px;border-radius:50px;text-decoration:none;">
        Resubscribe Anytime
      </a>
    </div>
  `);
  const text = `Hi ${userName || 'there'}, your ${tier || ''} subscription has been cancelled. You can resubscribe anytime at https://mysleepytale.com/settings`;
  return { subject, html, text };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { type, email, tier, userName } = req.body || {};

  if (!type || !email) {
    return res.status(400).json({ error: 'Missing type or email' });
  }

  let emailData;
  switch (type) {
    case 'confirmed':
      emailData = buildConfirmedEmail(userName, tier);
      break;
    case 'failed':
      emailData = buildFailedEmail(userName, tier);
      break;
    case 'cancelled':
      emailData = buildCancelledEmail(userName, tier);
      break;
    default:
      return res.status(400).json({ error: 'Invalid type. Use confirmed, failed, or cancelled.' });
  }

  try {
    await sendEmail(email, emailData.subject, emailData.html, emailData.text);
    return res.json({ sent: 1, email, type });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
