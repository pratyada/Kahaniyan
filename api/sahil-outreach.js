// Sahil's outreach email — UX-focused introduction to My Sleepy Tale
// POST /api/sahil-outreach { to, firstName } — single send
// POST /api/sahil-outreach { sendBatch: true, limit: 50 } — batch send to first N new leads

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { escapeHtml, sanitizeEmail } from './_emailSanitize.js';
import { getFirestore } from './_firebase.js';
import { canSendEmail, logEmail } from './_emailThrottle.js';

const FROM_EMAIL = 'hello@mysleepytale.com';
const ses = new SESClient({ region: 'us-east-1' });

// Platform screenshots hosted on mysleepytale.com/og/
const IMAGES = {
  hero: 'https://mysleepytale.com/og/cover.jpg',
  traditions: 'https://mysleepytale.com/og/traditions-grid.png',
  player: 'https://mysleepytale.com/og/player-preview.png',
};

function buildHtml(firstName) {
  const name = escapeHtml(firstName || 'there');
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:Georgia,'Times New Roman',serif;color:#333;line-height:1.8;background:#fdf8f0;">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;">

    <!-- Header with platform screenshot -->
    <div style="text-align:center;margin-bottom:24px;">
      <img src="${IMAGES.hero}" alt="My Sleepy Tale — bedtime stories for every culture" style="width:100%;max-width:560px;border-radius:16px;border:1px solid #e8e0d4;" />
    </div>

    <p style="font-size:16px;margin:0 0 16px;">Hi ${name},</p>

    <p style="font-size:15px;margin:0 0 16px;">I am Sahil — a UX Designer and Co-Founder of <strong>My Sleepy Tale</strong>. I completed my Master of Information in User Experience Design from the <strong>University of Toronto</strong>, where I studied inclusive design, accessibility, and how to build technology that genuinely serves diverse communities.</p>

    <p style="font-size:15px;margin:0 0 16px;">That research led me here — to building something I wish existed when I was growing up: a free platform of <strong>audio bedtime stories</strong> that help children connect with their cultural roots while falling asleep peacefully.</p>

    <!-- What makes it different -->
    <div style="background:#fff;border-radius:16px;padding:24px;margin:24px 0;border:1px solid #e8e0d4;">
      <h2 style="font-size:17px;color:#6B4FA8;margin:0 0 16px;">What makes My Sleepy Tale different?</h2>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:16px;text-align:center;background:#f7f1e8;border-radius:12px;width:33%;">
            <div style="font-size:28px;margin-bottom:6px;">🎧</div>
            <div style="font-size:22px;font-weight:bold;color:#6B4FA8;">200+</div>
            <div style="font-size:11px;color:#666;">Audio Stories</div>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:16px;text-align:center;background:#f7f1e8;border-radius:12px;width:33%;">
            <div style="font-size:28px;margin-bottom:6px;">🌍</div>
            <div style="font-size:22px;font-weight:bold;color:#6B4FA8;">20+</div>
            <div style="font-size:11px;color:#666;">Cultures & Beliefs</div>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:16px;text-align:center;background:#f7f1e8;border-radius:12px;width:33%;">
            <div style="font-size:28px;margin-bottom:6px;">🧒</div>
            <div style="font-size:22px;font-weight:bold;color:#6B4FA8;">Ages 2-10</div>
            <div style="font-size:11px;color:#666;">Screen-Free</div>
          </td>
        </tr>
      </table>
    </div>

    <p style="font-size:15px;margin:0 0 16px;">Every story is designed with <strong>accessibility and inclusivity</strong> at its core — the same principles I studied at UofT. We built this for Hindu, Islamic, Sikh, Christian, Catholic, Buddhist, Filipino, Indigenous families and more. Stories come in <strong>English, French, and Spanish</strong>.</p>

    <!-- Visual: traditions -->
    <div style="background:#fff;border-radius:16px;padding:20px;margin:24px 0;border:1px solid #e8e0d4;">
      <h3 style="font-size:14px;color:#6B4FA8;margin:0 0 12px;text-align:center;">Stories from every tradition</h3>
      <div style="text-align:center;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:8px;text-align:center;font-size:13px;">🕉️ Hindu</td>
            <td style="padding:8px;text-align:center;font-size:13px;">☪️ Islamic</td>
            <td style="padding:8px;text-align:center;font-size:13px;">🙏 Sikh</td>
            <td style="padding:8px;text-align:center;font-size:13px;">✝️ Christian</td>
          </tr>
          <tr>
            <td style="padding:8px;text-align:center;font-size:13px;">☸️ Buddhist</td>
            <td style="padding:8px;text-align:center;font-size:13px;">🇵🇭 Filipino</td>
            <td style="padding:8px;text-align:center;font-size:13px;">🪶 Indigenous</td>
            <td style="padding:8px;text-align:center;font-size:13px;">🌎 Universal</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Why I'm reaching out -->
    <div style="background:#6B4FA8;border-radius:16px;padding:24px;margin:24px 0;color:#fff;">
      <h2 style="font-size:16px;margin:0 0 12px;color:#fff;">Why I am reaching out to you</h2>
      <p style="font-size:14px;margin:0 0 12px;color:#e8dff5;line-height:1.7;">
        We are a small team of parents and designers in Toronto building this with love. We are not a big tech company — just people who believe bedtime should be a moment of connection, not screen time.
      </p>
      <p style="font-size:14px;margin:0;color:#e8dff5;line-height:1.7;">
        I would genuinely love your feedback. Even 2 minutes of trying it with your child and telling me what worked (or did not) would mean the world to us.
      </p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:28px 0;">
      <a href="https://mysleepytale.com" style="display:inline-block;background:#6B4FA8;color:#fff;font-size:16px;font-weight:bold;padding:14px 40px;border-radius:50px;text-decoration:none;">
        Try It Free — No Sign Up Needed
      </a>
      <p style="color:#999;font-size:12px;margin:10px 0 0;">
        Just tap play on any story. Takes 10 seconds.
      </p>
    </div>

    <!-- How it works - visual steps -->
    <div style="background:#fff;border-radius:16px;padding:24px;margin:24px 0;border:1px solid #e8e0d4;">
      <h3 style="font-size:14px;color:#6B4FA8;margin:0 0 16px;text-align:center;">How it works</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px;text-align:center;width:33%;">
            <div style="font-size:32px;margin-bottom:4px;">1️⃣</div>
            <div style="font-size:12px;font-weight:bold;color:#333;">Pick a story</div>
            <div style="font-size:11px;color:#999;">By culture, theme, or age</div>
          </td>
          <td style="padding:12px;text-align:center;width:33%;">
            <div style="font-size:32px;margin-bottom:4px;">2️⃣</div>
            <div style="font-size:12px;font-weight:bold;color:#333;">Tap play</div>
            <div style="font-size:11px;color:#999;">Calming voice reads aloud</div>
          </td>
          <td style="padding:12px;text-align:center;width:33%;">
            <div style="font-size:32px;margin-bottom:4px;">3️⃣</div>
            <div style="font-size:12px;font-weight:bold;color:#333;">Sweet dreams</div>
            <div style="font-size:11px;color:#999;">Screen off, story on</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Sign off -->
    <p style="font-size:15px;margin:24px 0 4px;">Thank you for reading this far,</p>
    <p style="font-size:15px;margin:0 0 4px;"><strong>Sahil Faraz</strong></p>
    <p style="font-size:13px;color:#888;margin:0 0 2px;">Co-Founder & UX Designer, My Sleepy Tale</p>
    <p style="font-size:12px;color:#999;margin:0 0 2px;">M.I. User Experience Design — University of Toronto</p>
    <p style="font-size:13px;margin:0;">
      <a href="https://mysleepytale.com" style="color:#6B4FA8;text-decoration:none;">mysleepytale.com</a> ·
      <a href="https://www.linkedin.com/in/sahilfaraz/" style="color:#6B4FA8;text-decoration:none;">LinkedIn</a> ·
      <a href="https://instagram.com/mysleepytale_official" style="color:#6B4FA8;text-decoration:none;">@mysleepytale_official</a>
    </p>

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

I am Sahil — a UX Designer and Co-Founder of My Sleepy Tale. I completed my Master of Information in User Experience Design from the University of Toronto, where I studied inclusive design, accessibility, and how to build technology that genuinely serves diverse communities.

That research led me here — to building something I wish existed when I was growing up: a free platform of audio bedtime stories that help children connect with their cultural roots while falling asleep peacefully.

WHAT MAKES MY SLEEPY TALE DIFFERENT?
- 200+ audio bedtime stories across 20+ cultures and beliefs
- Hindu, Islamic, Sikh, Christian, Buddhist, Filipino, Indigenous and more
- Available in English, French, and Spanish
- Designed for ages 2-10, screen-free
- 100% free — no sign up needed

We are a small team of parents and designers in Toronto building this with love. We are not a big tech company — just people who believe bedtime should be a moment of connection, not screen time.

I would genuinely love your feedback. Even 2 minutes of trying it with your child and telling me what worked (or did not) would mean the world to us.

Try it: https://mysleepytale.com
Just tap play on any story. Takes 10 seconds.

Thank you for reading this far,
Sahil Faraz
Co-Founder & UX Designer, My Sleepy Tale
M.I. User Experience Design — University of Toronto
mysleepytale.com | LinkedIn: linkedin.com/in/sahilfaraz/

Unsubscribe: https://mysleepytale.com/settings?unsubscribe=true`;
}

async function sendOne(to, firstName) {
  const subject = `${firstName || 'Hi'}, bedtime stories from every culture — built by a UofT designer`;
  const cmd = new SendEmailCommand({
    Source: `Sahil from My Sleepy Tale <${FROM_EMAIL}>`,
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

  // Single send
  if (to && !sendBatch) {
    const toEmail = sanitizeEmail(to);
    const throttle = await canSendEmail(toEmail, 'marketing');
    if (!throttle.allowed) return res.json({ sent: 0, throttled: true, reason: throttle.reason });

    try {
      await sendOne(toEmail, firstName);
      await logEmail(toEmail, 'sahil-outreach', 'marketing', 'Sahil UX outreach');
      return res.json({ sent: 1, to: toEmail });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Batch send to next N new leads (skips already contacted)
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
        await logEmail(email, 'sahil-outreach', 'marketing', 'Sahil UX outreach');
        // Mark lead as contacted
        const { FieldValue } = await import('firebase-admin/firestore');
        await db.collection('outreachLeads').doc(doc.id).update({
          status: 'contacted',
          outreachSent: true,
          outreachSentAt: new Date().toISOString(),
          outreachType: 'sahil-ux-2026',
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
