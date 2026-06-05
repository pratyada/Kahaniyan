// Summer outreach email — personalized campaign for parent leads
// POST /api/summer-outreach { to, firstName } — single send
// POST /api/summer-outreach { sendBatch: true, limit: 50 } — batch send to first N new leads

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
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#c8c3ba;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:48px;">🌙</span>
      <h1 style="color:#f0a500;font-size:22px;margin:12px 0 4px;">My Sleepy Tale</h1>
      <p style="color:#6e6a63;font-size:13px;margin:0;">Bedtime stories that teach roots &amp; values</p>
    </div>

    <!-- Summer Banner -->
    <div style="background:linear-gradient(135deg,#f0a50015,#f0a50005);border:1px solid #f0a50030;border-radius:16px;padding:24px;text-align:center;margin-bottom:24px;">
      <span style="font-size:32px;">☀️</span>
      <h2 style="color:#f0a500;font-size:18px;margin:8px 0 4px;">Summer is here, ${name}!</h2>
      <p style="color:#a8a39a;font-size:14px;margin:0;">The perfect time to start a bedtime tradition your children will remember forever.</p>
    </div>

    <!-- Main Content -->
    <div style="background:#12121c;border-radius:16px;padding:28px 24px;margin-bottom:24px;border:1px solid #1a1a28;">
      <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
        Hi <strong style="color:#f5f0e8;">${name}</strong>,
      </p>
      <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
        Imagine this: your child drifts off to sleep hearing a story with <strong style="color:#f0a500;">their own name</strong> in it. A story about courage from their own culture. Narrated in a warm, soothing voice.
      </p>
      <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
        That is what <strong style="color:#f5f0e8;">My Sleepy Tale</strong> does. We have built a free bedtime story platform with <strong style="color:#f0a500;">150+ audio stories</strong> from 11 cultural traditions — Hindu, Islamic, Sikh, Catholic, Buddhist, Filipino, Hispanic, and more.
      </p>
      <p style="font-size:14px;line-height:1.7;margin:0;color:#a8a39a;">
        Every story is personalized with your child's name, teaches real values like kindness and courage, and is designed to be the last beautiful thing they hear before sleep.
      </p>
    </div>

    <!-- What makes it special -->
    <div style="background:#12121c;border-radius:16px;padding:28px 24px;margin-bottom:24px;border:1px solid #1a1a28;">
      <h3 style="color:#f0a500;font-size:15px;margin:0 0 16px;">Why families love it this summer</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 12px;vertical-align:top;width:28px;font-size:18px;">🎧</td>
          <td style="padding:10px 0;">
            <strong style="color:#f5f0e8;font-size:13px;">No screens</strong>
            <p style="font-size:12px;color:#a8a39a;margin:4px 0 0;">Audio-only stories. No blue light. No screen time guilt. Just a warm voice and imagination.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;vertical-align:top;width:28px;font-size:18px;">🌍</td>
          <td style="padding:10px 0;">
            <strong style="color:#f5f0e8;font-size:13px;">Your culture, their bedtime</strong>
            <p style="font-size:12px;color:#a8a39a;margin:4px 0 0;">Stories from your tradition — so your child grows up knowing where they come from.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;vertical-align:top;width:28px;font-size:18px;">✨</td>
          <td style="padding:10px 0;">
            <strong style="color:#f5f0e8;font-size:13px;">Their name in every story</strong>
            <p style="font-size:12px;color:#a8a39a;margin:4px 0 0;">Add your child's name, family members, even their pet — and hear it woven into the story.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;vertical-align:top;width:28px;font-size:18px;">🆓</td>
          <td style="padding:10px 0;">
            <strong style="color:#f5f0e8;font-size:13px;">100% free to start</strong>
            <p style="font-size:12px;color:#a8a39a;margin:4px 0 0;">No credit card. No catch. Listen to stories tonight.</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:24px;">
      <a href="https://mysleepytale.com" style="display:inline-block;background:#f0a500;color:#0a0a0f;font-size:16px;font-weight:bold;padding:14px 36px;border-radius:50px;text-decoration:none;">
        Try a Free Bedtime Story Tonight
      </a>
      <p style="color:#6e6a63;font-size:12px;margin:12px 0 0;">
        No signup needed to browse. Takes 30 seconds.
      </p>
    </div>

    <!-- Personal note -->
    <div style="background:#12121c;border-radius:16px;padding:20px 24px;margin-bottom:24px;border:1px solid #1a1a28;">
      <p style="font-size:13px;line-height:1.7;margin:0;">
        We are a small team of parents in Toronto who built this for our own kids. We hope your family loves it as much as ours does.
      </p>
      <p style="font-size:13px;line-height:1.7;margin:8px 0 0;">
        Warm regards,<br>
        <strong style="color:#f5f0e8;">Deepti &amp; Prat</strong><br>
        <span style="color:#6e6a63;">Founders, My Sleepy Tale</span>
      </p>
    </div>

    <!-- Footer -->
    <p style="color:#4a4a5a;font-size:11px;text-align:center;margin-top:32px;">
      My Sleepy Tale · Toronto, Canada<br>
      <a href="https://mysleepytale.com" style="color:#f0a500;">mysleepytale.com</a> · <a href="https://instagram.com/mysleepytale_official" style="color:#f0a500;">@mysleepytale_official</a><br>
      <span style="color:#3a3832;font-size:10px;margin-top:8px;display:inline-block;">You received this because you expressed interest in children's activities in Toronto. <a href="https://mysleepytale.com/settings?unsubscribe=true" style="color:#4a4a5a;">Unsubscribe</a></span>
    </p>
  </div>
</body>
</html>`;
}

function buildText(firstName) {
  const name = firstName || 'there';
  return `Hi ${name},

Summer is here! The perfect time to start a bedtime tradition your children will remember forever.

Imagine this: your child drifts off to sleep hearing a story with their own name in it. A story about courage from their own culture. Narrated in a warm, soothing voice.

That is what My Sleepy Tale does. 150+ audio bedtime stories from 11 cultural traditions — Hindu, Islamic, Sikh, Catholic, Buddhist, Filipino, Hispanic, and more.

Why families love it:
- No screens — audio only, no blue light
- Your culture, their bedtime — stories from your tradition
- Their name in every story — personalized narration
- 100% free to start — no credit card needed

Try a free story tonight: https://mysleepytale.com

We are a small team of parents in Toronto who built this for our own kids.

Warm regards,
Deepti & Prat
Founders, My Sleepy Tale
mysleepytale.com | @mysleepytale_official

Unsubscribe: https://mysleepytale.com/settings?unsubscribe=true`;
}

async function sendOne(to, firstName) {
  const subject = `${firstName || 'Hey'}, summer bedtime stories your kids will remember forever ☀️`;
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

  // Single test send
  if (to && !sendBatch) {
    const toEmail = sanitizeEmail(to);
    const throttle = await canSendEmail(toEmail, 'marketing');
    if (!throttle.allowed) return res.json({ sent: 0, throttled: true, reason: throttle.reason });

    try {
      await sendOne(toEmail, firstName);
      await logEmail(toEmail, 'summer-outreach', 'marketing', 'Summer bedtime stories');
      return res.json({ sent: 1, to: toEmail });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Batch send to first N new leads
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
        await logEmail(email, 'summer-outreach', 'marketing', 'Summer bedtime stories');
        // Mark lead as contacted
        await db.collection('outreachLeads').doc(doc.id).update({
          status: 'contacted',
          outreachSent: true,
          outreachSentAt: new Date().toISOString(),
          outreachType: 'summer-2026',
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

  return res.status(400).json({ error: 'Provide "to" for test or "sendBatch: true" for batch' });
}
