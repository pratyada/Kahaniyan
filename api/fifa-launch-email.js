// FIFA World Cup 2026 launch email — announce new series
// POST /api/fifa-launch-email { to, firstName } — single send
// POST /api/fifa-launch-email { sendBatch: true, limit: 50 } — batch send to leads

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { escapeHtml, sanitizeEmail } from './_emailSanitize.js';
import { getFirestore } from './_firebase.js';
import { canSendEmail, logEmail } from './_emailThrottle.js';

const FROM_EMAIL = 'hello@mysleepytale.com';
const ses = new SESClient({ region: 'us-east-1' });

function buildHtml(firstName) {
  const name = escapeHtml(firstName || 'there');
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:Georgia,'Times New Roman',serif;color:#333;line-height:1.8;background:#fdf8f0;">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;">

    <!-- Hero -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:64px;margin-bottom:8px;">⚽</div>
      <h1 style="font-size:24px;color:#006837;margin:0 0 8px;">FIFA World Cup 2026</h1>
      <p style="font-size:16px;color:#888;margin:0;">Kids Bedtime Audiobook Series — Live Now</p>
    </div>

    <p style="font-size:16px;margin:0 0 16px;">Hi ${name},</p>

    <p style="font-size:15px;margin:0 0 16px;">The FIFA World Cup 2026 starts <strong>TODAY</strong> — and it is happening in <strong>our backyard</strong>. Toronto, Vancouver, New York, Los Angeles, Mexico City. Forty-eight countries. The biggest World Cup in history.</p>

    <p style="font-size:15px;margin:0 0 16px;">We just launched a brand new bedtime audiobook series so your kids can learn about the World Cup while falling asleep. No screens. Just stories.</p>

    <!-- Episodes -->
    <div style="background:#fff;border-radius:16px;padding:24px;margin:24px 0;border:1px solid #e8e0d4;">
      <h2 style="font-size:17px;color:#006837;margin:0 0 16px;">5 Episodes — Ready Tonight</h2>

      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe0;font-size:14px;">
          <strong>⚽ Ep 1:</strong> How the World Cup Began — from 1930 Uruguay to 2026
        </td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe0;font-size:14px;">
          <strong>🏟️ Ep 2:</strong> The Host Cities — Toronto, Vancouver, NY, LA, Mexico City
        </td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe0;font-size:14px;">
          <strong>⚽ Ep 3:</strong> The Beautiful Game — offside, penalties, and why goalkeepers cry
        </td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #f0ebe0;font-size:14px;">
          <strong>🏆 Ep 4:</strong> Legends — Pelé, Messi, Marta, Mbappé
        </td></tr>
        <tr><td style="padding:10px 0;font-size:14px;">
          <strong>🌟 Ep 5:</strong> Your Country's World Cup Dream — personalized with your child's name
        </td></tr>
      </table>
    </div>

    <!-- Languages -->
    <div style="background:#fff;border-radius:16px;padding:20px;margin:24px 0;border:1px solid #e8e0d4;text-align:center;">
      <h3 style="font-size:14px;color:#006837;margin:0 0 12px;">Available in 4 Languages</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px;font-size:14px;">🇬🇧 English</td>
          <td style="padding:8px;font-size:14px;">🇪🇸 Spanish</td>
          <td style="padding:8px;font-size:14px;">🇫🇷 French</td>
          <td style="padding:8px;font-size:14px;">🇮🇳 Hindi</td>
        </tr>
      </table>
    </div>

    <!-- FOMO -->
    <div style="background:#006837;border-radius:16px;padding:24px;margin:24px 0;color:#fff;">
      <h2 style="font-size:16px;margin:0 0 12px;color:#ffd700;">Don't let your kids miss out</h2>
      <p style="font-size:14px;margin:0 0 12px;color:#d4edda;line-height:1.7;">
        Toronto families are already listening. New episodes drop as matches progress. By the time the tournament ends, your child will know more about world geography, sportsmanship, and different cultures than most adults.
      </p>
      <p style="font-size:14px;margin:0;color:#d4edda;line-height:1.7;">
        Their friends are learning about FIFA through stories. Get started tonight.
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:28px 0;">
      <a href="https://mysleepytale.com/series/fifa-world-cup-2026?utm_source=email&utm_medium=launch&utm_campaign=fifa2026" style="display:inline-block;background:#006837;color:#fff;font-size:16px;font-weight:bold;padding:14px 40px;border-radius:50px;text-decoration:none;">
        Start the World Cup Tonight ⚽
      </a>
      <p style="color:#999;font-size:12px;margin:10px 0 0;">
        Free to listen. No sign up needed. Just tap play.
      </p>
    </div>

    <!-- Pro upsell -->
    <div style="background:#fff5e8;border-radius:16px;padding:20px;margin:24px 0;border:1px solid #e8d9c4;text-align:center;">
      <h3 style="font-size:14px;color:#b8860b;margin:0 0 8px;">🔓 Pro: Personalized FIFA Stories</h3>
      <p style="font-size:13px;color:#666;margin:0;line-height:1.6;">
        Upgrade to Pro ($9.99/mo) and hear YOUR child's name in every World Cup story. Plus unlimited episodes, all languages, and new match-day stories as they happen.
      </p>
    </div>

    <!-- Sign off -->
    <p style="font-size:15px;margin:24px 0 4px;">Let's go! ⚽</p>
    <p style="font-size:15px;margin:0 0 4px;"><strong>The My Sleepy Tale Team</strong></p>
    <p style="font-size:13px;color:#888;margin:0;">Prat, Deepti & Sahil · Toronto, Canada</p>

    <!-- Unsubscribe -->
    <p style="font-size:11px;color:#bbb;margin:32px 0 0;border-top:1px solid #eee;padding-top:12px;">
      <a href="https://mysleepytale.com/settings?unsubscribe=true" style="color:#bbb;">Unsubscribe</a> · Toronto, Canada
    </p>
  </div>
</body>
</html>`;
}

function buildText(firstName) {
  const name = firstName || 'there';
  return `Hi ${name},

The FIFA World Cup 2026 starts TODAY — and it is happening in our backyard. Toronto, Vancouver, New York, Los Angeles, Mexico City. 48 countries. The biggest World Cup in history.

We just launched a brand new bedtime audiobook series so your kids can learn about the World Cup while falling asleep. No screens. Just stories.

5 EPISODES — READY TONIGHT
1. How the World Cup Began — from 1930 Uruguay to 2026
2. The Host Cities — Toronto, Vancouver, NY, LA, Mexico City
3. The Beautiful Game — offside, penalties, and why goalkeepers cry
4. Legends — Pelé, Messi, Marta, Mbappé
5. Your Country's World Cup Dream — personalized with your child's name

Available in English, Spanish, French & Hindi.

DON'T LET YOUR KIDS MISS OUT
Toronto families are already listening. New episodes drop as matches progress. Their friends are learning about FIFA through stories.

Start tonight: https://mysleepytale.com/series/fifa-world-cup-2026

PRO: Personalized FIFA Stories ($9.99/mo)
Hear YOUR child's name in every World Cup story. Plus unlimited episodes and new match-day stories.

Let's go!
The My Sleepy Tale Team
Prat, Deepti & Sahil · Toronto

Unsubscribe: https://mysleepytale.com/settings?unsubscribe=true`;
}

async function sendOne(to, firstName) {
  const subject = `⚽ ${firstName || 'Hey'}, the World Cup starts TODAY — new kids audiobook series`;
  const cmd = new SendEmailCommand({
    Source: `My Sleepy Tale <${FROM_EMAIL}>`,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: {
        Text: { Data: buildText(firstName) },
        Html: { Data: buildHtml(firstName) },
      },
    },
  });
  return ses.send(cmd);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { to, firstName, sendBatch, limit = 50 } = req.body || {};

  if (to && !sendBatch) {
    const toEmail = sanitizeEmail(to);
    const throttle = await canSendEmail(toEmail, 'marketing');
    if (!throttle.allowed) return res.json({ sent: 0, throttled: true, reason: throttle.reason });

    try {
      await sendOne(toEmail, firstName);
      await logEmail(toEmail, 'fifa-launch', 'marketing', 'FIFA World Cup 2026 launch');
      return res.json({ sent: 1, to: toEmail });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (sendBatch) {
    const db = await getFirestore();
    if (!db) return res.status(503).json({ error: 'Firebase not configured' });

    const snap = await db.collection('outreachLeads').where('status', '==', 'new').limit(limit).get();
    const results = [];

    for (const doc of snap.docs) {
      const lead = doc.data();
      const email = sanitizeEmail(lead.email);
      if (!email) continue;

      const throttle = await canSendEmail(email, 'marketing');
      if (!throttle.allowed) {
        results.push({ email, status: 'throttled', reason: throttle.reason });
        continue;
      }

      try {
        await sendOne(email, lead.firstName);
        await logEmail(email, 'fifa-launch', 'marketing', 'FIFA World Cup 2026 launch');
        const { FieldValue } = await import('firebase-admin/firestore');
        await db.collection('outreachLeads').doc(doc.id).update({
          status: 'contacted',
          outreachSent: true,
          outreachSentAt: new Date().toISOString(),
          outreachType: 'fifa-launch-2026',
        });
        results.push({ email, name: lead.firstName, status: 'sent' });
      } catch (e) {
        results.push({ email, status: 'failed', error: e.message });
      }
    }

    return res.json({
      sent: results.filter(r => r.status === 'sent').length,
      throttled: results.filter(r => r.status === 'throttled').length,
      failed: results.filter(r => r.status === 'failed').length,
      total: results.length,
      results,
    });
  }

  return res.status(400).json({ error: 'Provide "to" for single or "sendBatch: true" for batch' });
}
