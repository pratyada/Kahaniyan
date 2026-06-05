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
<body style="margin:0;padding:0;font-family:Georgia,serif;color:#333;line-height:1.8;">
  <div style="max-width:580px;margin:0 auto;padding:32px 20px;">

    <p style="font-size:16px;margin:0 0 16px;">Hi ${name},</p>

    <p style="font-size:15px;margin:0 0 16px;">I wanted to share something my wife and I built for our son this year. Summer evenings are long, bedtime gets pushed later, and we were looking for something better than screen time before sleep.</p>

    <p style="font-size:15px;margin:0 0 16px;">So we made <strong>My Sleepy Tale</strong> — audio bedtime stories that use your child's actual name. The stories teach values like kindness and courage, and come from different cultures — Hindu, Sikh, Islamic, Catholic, Filipino, and more.</p>

    <p style="font-size:15px;margin:0 0 16px;">Our son falls asleep to these every night now. No screen. Just a warm voice telling him a story where he is the main character.</p>

    <p style="font-size:15px;margin:0 0 16px;">We have 150+ stories and it is completely free to try. If your kids are between 2 and 10, I think they would love it.</p>

    <p style="font-size:15px;margin:0 0 24px;"><a href="https://mysleepytale.com" style="color:#b8860b;">mysleepytale.com</a></p>

    <p style="font-size:15px;margin:0 0 4px;">Cheers,</p>
    <p style="font-size:15px;margin:0 0 4px;"><strong>Prat</strong></p>
    <p style="font-size:13px;color:#888;margin:0;">Dad of a 5-year-old in Toronto</p>

    <p style="font-size:11px;color:#bbb;margin:32px 0 0;border-top:1px solid #eee;padding-top:12px;">
      <a href="https://mysleepytale.com/settings?unsubscribe=true" style="color:#bbb;">Unsubscribe</a>
    </p>
  </div>
</body>
</html>`;
}

function buildText(firstName) {
  const name = firstName || 'there';
  return `Hi ${name},

I wanted to share something my wife and I built for our son this year. Summer evenings are long, bedtime gets pushed later, and we were looking for something better than screen time before sleep.

So we made My Sleepy Tale — audio bedtime stories that use your child's actual name. The stories teach values like kindness and courage, and come from different cultures.

Our son falls asleep to these every night now. No screen. Just a warm voice telling him a story where he is the main character.

We have 150+ stories and it is completely free to try. If your kids are between 2 and 10, I think they would love it.

mysleepytale.com

Cheers,
Prat
Dad of a 5-year-old in Toronto

Unsubscribe: https://mysleepytale.com/settings?unsubscribe=true`;
}

async function sendOne(to, firstName) {
  const subject = `${firstName || 'Hi'}, something we built for our kids this summer`;
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
