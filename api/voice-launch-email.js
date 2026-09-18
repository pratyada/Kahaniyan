// Voice-cloning launch email — "hear every story in YOUR voice".
// POST /api/voice-launch-email { to: "email" }   → single recipient (test)
// POST /api/voice-launch-email { sendAll: true }  → every signed-up user (once)
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { logEmail } from './_emailThrottle.js';

const FROM_EMAIL = 'hello@mysleepytale.com';
const ses = new SESClient({ region: 'us-east-1' });
const SUBJECT = 'Now your child can hear every story in YOUR voice 🎙️ (free this month)';
const CTA_URL = 'https://mysleepytale.com/voices';

function greetingName(name) {
  const first = (name || '').trim().split(' ')[0];
  return first ? `Hi ${first},` : 'Hi there,';
}

function buildHtml(name) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${SUBJECT}</title></head>
<body style="margin:0;padding:0;background:#070A19;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">Clone your voice free this month — your child hears every bedtime story in your voice. Even Grandma's, from anywhere.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#070A19;">
    <tr><td align="center" style="padding:28px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:radial-gradient(120% 80% at 50% -10%,#1A1040 0%,#0D1B2A 55%,#070A19 100%);border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">

        <tr><td align="center" style="padding:40px 32px 10px;">
          <div style="font-size:44px;line-height:1;">🌙</div>
          <div style="font-family:Georgia,'Times New Roman',serif;color:#F6C453;font-size:22px;margin-top:10px;letter-spacing:0.3px;">My Sleepy Tale</div>
        </td></tr>

        <tr><td style="padding:14px 32px 6px;">
          <p style="font-family:Arial,Helvetica,sans-serif;color:#B8AAC8;font-size:15px;margin:0 0 14px;">${greetingName(name)}</p>
          <h1 style="font-family:Georgia,'Times New Roman',serif;color:#F7F1E8;font-size:27px;line-height:1.28;margin:0 0 8px;">
            Tonight, your child can hear every story in <span style="color:#F6C453;">your&nbsp;voice</span>.
          </h1>
          <p style="font-family:Arial,Helvetica,sans-serif;color:#CDBFE0;font-size:15.5px;line-height:1.7;margin:14px 0 0;">
            We just launched something we're a little emotional about. Record a short sample of <strong style="color:#F7F1E8;">your voice</strong> — or <strong style="color:#F7F1E8;">Grandma's</strong>, or Dad's — and every bedtime story now plays in that voice. The one your little one loves most.
          </p>
        </td></tr>

        <tr><td style="padding:20px 32px 4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(246,196,83,0.08);border:1px solid rgba(246,196,83,0.22);border-radius:14px;">
            <tr><td style="padding:18px 20px;">
              <p style="font-family:Georgia,serif;color:#F6C453;font-size:16px;margin:0 0 6px;">“Hear Grandma read tonight — even when she's far away.”</p>
              <p style="font-family:Arial,Helvetica,sans-serif;color:#B8AAC8;font-size:13.5px;line-height:1.6;margin:0;">A keepsake in a voice your family will treasure — set it up once, and it's there every night.</p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:22px 32px 6px;">
          <p style="font-family:Arial,Helvetica,sans-serif;color:#7A6B8A;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin:0 0 10px;">How it works — under a minute</p>
          <p style="font-family:Arial,Helvetica,sans-serif;color:#E7DEF2;font-size:15px;line-height:1.8;margin:0;">
            <span style="color:#F6C453;font-weight:bold;">1.</span>&nbsp; Record a short voice sample (just read a few lines).<br>
            <span style="color:#F6C453;font-weight:bold;">2.</span>&nbsp; Give it a name — “Mum”, “Dad”, “Grandma”.<br>
            <span style="color:#F6C453;font-weight:bold;">3.</span>&nbsp; Pick it, and play any story. It's now in that voice. 🌟
          </p>
        </td></tr>

        <tr><td align="center" style="padding:26px 32px 6px;">
          <a href="${CTA_URL}" style="display:inline-block;background:#F6C453;color:#0D1B2A;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;text-decoration:none;padding:15px 34px;border-radius:999px;">Clone my voice — free →</a>
        </td></tr>

        <tr><td align="center" style="padding:8px 32px 4px;">
          <p style="font-family:Arial,Helvetica,sans-serif;color:#F6C453;font-size:14px;font-weight:bold;margin:6px 0 0;">✨ FREE for everyone until the end of this month ✨</p>
          <p style="font-family:Arial,Helvetica,sans-serif;color:#B8AAC8;font-size:13px;line-height:1.6;margin:6px 0 0;">Be one of our first families to try it. After this month, cloned voices become a premium feature — so set yours up now while it's on the house.</p>
        </td></tr>

        <tr><td style="padding:26px 32px 34px;">
          <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:18px;">
            <p style="font-family:Arial,Helvetica,sans-serif;color:#7A6B8A;font-size:12px;line-height:1.7;margin:0;text-align:center;">
              With love,<br>The My Sleepy Tale family · Toronto, Canada<br>
              Questions? Just reply, or write <a href="mailto:hello@mysleepytale.com" style="color:#F6C453;text-decoration:none;">hello@mysleepytale.com</a>.
            </p>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildText(name) {
  const first = (name || '').trim().split(' ')[0];
  return `${first ? `Hi ${first},` : 'Hi there,'}

Tonight, your child can hear every bedtime story in YOUR voice.

Record a short sample of your voice — or Grandma's, or Dad's — and every story now plays in that voice. Set it up once; it's there every night.

"Hear Grandma read tonight — even when she's far away."

How it works (under a minute):
1. Record a short voice sample.
2. Name it — Mum, Dad, Grandma.
3. Pick it and play any story. It's now in that voice.

Try it free: ${CTA_URL}

FREE for everyone until the end of this month. After that, cloned voices become a premium feature — so set yours up now while it's on the house.

With love,
The My Sleepy Tale family · Toronto, Canada
Questions? Reply or write hello@mysleepytale.com`;
}

async function sendOne(toEmail, name) {
  await ses.send(new SendEmailCommand({
    Source: `My Sleepy Tale <${FROM_EMAIL}>`,
    Destination: { ToAddresses: [toEmail] },
    Message: {
      Subject: { Data: SUBJECT },
      Body: { Text: { Data: buildText(name) }, Html: { Data: buildHtml(name) } },
    },
  }));
  try { await logEmail(toEmail, 'voice-launch', 'marketing', SUBJECT); } catch {}
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { to, sendAll } = req.body || {};

  if (sendAll) {
    const { getFirestore } = await import('./_firebase.js');
    const db = await getFirestore();
    if (!db) return res.status(503).json({ error: 'Firebase not configured' });

    const sentDoc = await db.collection('config').doc('voiceLaunchEmailsSent').get();
    const alreadySent = new Set(sentDoc.exists ? (sentDoc.data().emails || []) : []);

    const snap = await db.collection('users').get();
    const users = [];
    snap.forEach((d) => {
      const data = d.data();
      const email = (data.email || '').toLowerCase();
      if (email && email.includes('@') && !alreadySent.has(email)) {
        users.push({ email, name: data.displayName || data.name || '' });
      }
    });

    if (users.length === 0) return res.json({ sent: 0, total: 0, message: 'All users already received the voice-launch email', alreadySentCount: alreadySent.size });

    const results = [];
    const newlySent = [];
    for (const u of users) {
      try { await sendOne(u.email, u.name); results.push({ email: u.email, status: 'sent' }); newlySent.push(u.email); }
      catch (e) { results.push({ email: u.email, status: 'failed', error: e.message }); }
    }
    if (newlySent.length > 0) {
      await db.collection('config').doc('voiceLaunchEmailsSent').set({
        emails: [...alreadySent, ...newlySent], lastSentAt: new Date().toISOString(), totalSent: alreadySent.size + newlySent.length,
      });
    }
    return res.json({ sent: results.filter((r) => r.status === 'sent').length, skipped: alreadySent.size, total: results.length, results });
  }

  if (!to || !to.includes('@')) return res.status(400).json({ error: 'Provide "to" email or { sendAll: true }' });
  try {
    await sendOne(to.trim().toLowerCase(), (req.body && req.body.name) || '');
    return res.json({ sent: 1, to: to.trim().toLowerCase() });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
