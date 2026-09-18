// Voice-cloning launch email — "hear every story in YOUR voice".
// POST /api/voice-launch-email { to: "email" }   → single recipient (test)
// POST /api/voice-launch-email { sendAll: true }  → every signed-up user (once)
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { logEmail } from './_emailThrottle.js';

const FROM_EMAIL = 'hello@mysleepytale.com';
const ses = new SESClient({ region: 'us-east-1' });
// Personal, plain subject (no "FREE"/emoji/marketing words) → lands in Primary, not Promotions.
const SUBJECT = 'Your voice, for every bedtime story';
const CTA_URL = 'https://mysleepytale.com/voices';

function greetingName(name) {
  const first = (name || '').trim().split(' ')[0];
  return first ? `Hi ${first},` : 'Hi there,';
}

function buildHtml(name) {
  // Deliberately simple — looks like a real person typed it (Primary inbox, not Promotions):
  // default background, system font, no images, one plain text link, a "just reply" ask.
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${SUBJECT}</title></head>
<body style="margin:0;padding:0;">
  <div style="max-width:560px;margin:0 auto;padding:20px 22px;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#222;">
    <p style="margin:0 0 14px;">${greetingName(name)}</p>
    <p style="margin:0 0 14px;">Quick note — I'm Prateek, one of the parents who builds My Sleepy Tale.</p>
    <p style="margin:0 0 14px;">We just added something I really wanted for my own son: you can record a short sample of <strong>your voice</strong> — or Grandma's, or Dad's — and every bedtime story plays in <em>that</em> voice. Set it up once, and it's there every night.</p>
    <p style="margin:0 0 8px;">It takes under a minute:</p>
    <p style="margin:0 0 14px;">
      1. Record a few lines<br>
      2. Name it — “Mum”, “Dad”, “Grandma”<br>
      3. Pick it and play any story — now it's in that voice
    </p>
    <p style="margin:0 0 14px;">It's free for everyone this month while we test it with our first families, and I'd love for you to be one of them. Here's the link:<br>
      <a href="${CTA_URL}" style="color:#1a56db;">${CTA_URL}</a>
    </p>
    <p style="margin:0 0 14px;">If you try it, just hit reply and tell me what you think — I read every email.</p>
    <p style="margin:0 0 4px;">Warmly,<br>Prateek</p>
    <p style="margin:0;color:#888;font-size:13px;">My Sleepy Tale · Toronto</p>
  </div>
</body>
</html>`;
}

function buildText(name) {
  const first = (name || '').trim().split(' ')[0];
  return `${first ? `Hi ${first},` : 'Hi there,'}

Quick note — I'm Prateek, one of the parents who builds My Sleepy Tale.

We just added something I really wanted for my own son: you can record a short sample of your voice — or Grandma's, or Dad's — and every bedtime story plays in that voice. Set it up once, and it's there every night.

It takes under a minute:
1. Record a few lines
2. Name it — "Mum", "Dad", "Grandma"
3. Pick it and play any story — now it's in that voice

It's free for everyone this month while we test it with our first families, and I'd love for you to be one of them. Here's the link:
${CTA_URL}

If you try it, just hit reply and tell me what you think — I read every email.

Warmly,
Prateek
My Sleepy Tale · Toronto`;
}

async function sendOne(toEmail, name) {
  await ses.send(new SendEmailCommand({
    // A person's name + reply-to invites replies → Gmail Primary, not Promotions.
    Source: `Prateek at My Sleepy Tale <${FROM_EMAIL}>`,
    ReplyToAddresses: [FROM_EMAIL],
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
