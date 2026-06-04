// Blog announcement email — notify users about new blog posts / features
// POST /api/blog-announcement { to: "email" } — single recipient
// POST /api/blog-announcement { sendAll: true } — all users

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { getFirestore } from './_firebase.js';

const FROM_EMAIL = 'hello@mysleepytale.com';
const ses = new SESClient({ region: 'us-east-1' });

function buildHtml() {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#c8c3ba;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:48px;">🌙</span>
      <h1 style="color:#f0a500;font-size:20px;margin:12px 0 4px;">My Sleepy Tale</h1>
      <p style="color:#6e6a63;font-size:12px;margin:0;">Bedtime stories that teach roots &amp; values</p>
    </div>

    <!-- New Feature Badge -->
    <div style="text-align:center;margin-bottom:24px;">
      <span style="display:inline-block;background:rgba(240,165,0,.12);border:1px solid rgba(240,165,0,.3);border-radius:2rem;padding:6px 20px;font-size:12px;font-weight:700;color:#f0a500;letter-spacing:.08em;text-transform:uppercase;">New Feature</span>
    </div>

    <!-- Hero Image -->
    <div style="margin-bottom:24px;border-radius:16px;overflow:hidden;">
      <a href="https://mysleepytale.com/blog/private-series-contributor-guide">
        <img src="https://mysleepytale.com/blog/images/og-private-series-contributor.jpeg" alt="Private Series & Contributor Flow" style="width:100%;display:block;border-radius:16px;" />
      </a>
    </div>

    <!-- Main Content -->
    <div style="background:#12121c;border-radius:16px;padding:28px 24px;margin-bottom:24px;border:1px solid #1a1a28;">
      <h2 style="color:#f5f0e8;font-size:20px;margin:0 0 12px;font-family:Georgia,serif;">Private Series &amp; Contributor Flow</h2>
      <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
        You can now create <strong style="color:#f5f0e8;">private bedtime story series</strong> and share them only with the people you choose — family, friends, anyone you trust.
      </p>
      <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
        But here is the best part: <strong style="color:#f0a500;">anyone you share with can contribute their own episodes.</strong>
      </p>
      <p style="font-size:14px;line-height:1.7;margin:0;color:#a8a39a;">
        Imagine a grandmother starting a series about family traditions. A cousin adds an episode about their first snow day. A friend contributes their favourite childhood memory. You review, edit, add images, generate AI narration, and publish. Together, you build a bedtime story collection that is truly yours.
      </p>
    </div>

    <!-- How it works -->
    <div style="background:#12121c;border-radius:16px;padding:28px 24px;margin-bottom:24px;border:1px solid #1a1a28;">
      <h2 style="color:#f0a500;font-size:16px;margin:0 0 16px;">How it works</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 12px;vertical-align:top;width:32px;font-size:20px;">1</td>
          <td style="padding:10px 0;">
            <strong style="color:#f5f0e8;font-size:14px;">Create a Private Series</strong>
            <p style="font-size:13px;color:#a8a39a;margin:4px 0 0;">Go to Create, toggle "Personal", write your episodes. Published instantly.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;vertical-align:top;width:32px;font-size:20px;">2</td>
          <td style="padding:10px 0;">
            <strong style="color:#f5f0e8;font-size:14px;">Share with Family &amp; Friends</strong>
            <p style="font-size:13px;color:#a8a39a;margin:4px 0 0;">Enter their email. They see the series in their "Shared with me" tab.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;vertical-align:top;width:32px;font-size:20px;">3</td>
          <td style="padding:10px 0;">
            <strong style="color:#f5f0e8;font-size:14px;">They Contribute Episodes</strong>
            <p style="font-size:13px;color:#a8a39a;margin:4px 0 0;">They write a story (or quick notes), upload photos, and submit for your review.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;vertical-align:top;width:32px;font-size:20px;">4</td>
          <td style="padding:10px 0;">
            <strong style="color:#f5f0e8;font-size:14px;">You Review &amp; Publish</strong>
            <p style="font-size:13px;color:#a8a39a;margin:4px 0 0;">Edit the text, add images, generate AI audio narration, and publish. Everyone can listen.</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="https://mysleepytale.com/blog/private-series-contributor-guide" style="display:inline-block;background:#f0a500;color:#0a0a0f;font-size:16px;font-weight:700;padding:14px 36px;border-radius:50px;text-decoration:none;">
        Read the Full Guide
      </a>
      <p style="color:#6e6a63;font-size:12px;margin:12px 0 0;">
        Step-by-step with screenshots
      </p>
    </div>

    <!-- Secondary CTA -->
    <div style="text-align:center;margin-bottom:24px;">
      <a href="https://mysleepytale.com/creation" style="display:inline-block;background:rgba(240,165,0,.1);color:#f0a500;font-size:14px;font-weight:700;padding:12px 28px;border-radius:50px;text-decoration:none;border:1px solid rgba(240,165,0,.3);">
        Create Your First Private Series
      </a>
    </div>

    <!-- Credits -->
    <div style="background:#12121c;border-radius:16px;padding:20px 24px;margin-bottom:24px;border:1px solid #1a1a28;text-align:center;">
      <p style="font-size:13px;color:#a8a39a;margin:0;">
        This feature was inspired by <strong style="color:#f5f0e8;">Deepti Ramaul</strong> and <strong style="color:#f5f0e8;">Sravanthi Somalaraju</strong> — thank you for the idea and for testing it with us.
      </p>
    </div>

    <!-- Footer -->
    <p style="color:#4a4a5a;font-size:11px;text-align:center;margin-top:32px;">
      My Sleepy Tale · Toronto, Canada<br>
      <a href="https://mysleepytale.com" style="color:#f0a500;">mysleepytale.com</a> · <a href="https://instagram.com/mysleepytale_official" style="color:#f0a500;">@mysleepytale_official</a>
    </p>
  </div>
</body>
</html>`;
}

function buildText() {
  return `NEW FEATURE: Private Series & Contributor Flow

You can now create private bedtime story series and share them only with the people you choose.

The best part? Anyone you share with can contribute their own episodes.

HOW IT WORKS:
1. Create a Private Series — toggle "Personal", write your episodes. Published instantly.
2. Share with Family & Friends — enter their email.
3. They Contribute Episodes — write a story or quick notes, upload photos, submit.
4. You Review & Publish — edit, add images, generate AI audio, publish.

Read the full guide: https://mysleepytale.com/blog/private-series-contributor-guide

Create your first series: https://mysleepytale.com/creation

This feature was inspired by Deepti Ramaul and Sravanthi Somalaraju.

— My Sleepy Tale · mysleepytale.com`;
}

async function sendEmail(to) {
  const subject = 'New on My Sleepy Tale: Private Series — Create Family Stories Together';
  const cmd = new SendEmailCommand({
    Source: `My Sleepy Tale <${FROM_EMAIL}>`,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: {
        Text: { Data: buildText() },
        Html: { Data: buildHtml() },
      },
    },
  });
  return ses.send(cmd);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { to, sendAll } = req.body || {};

  // Single recipient
  if (to && !sendAll) {
    try {
      await sendEmail(to.trim());
      return res.json({ sent: 1, to: to.trim() });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Send to all users
  if (sendAll) {
    const db = await getFirestore();
    if (!db) return res.status(503).json({ error: 'Firebase not configured' });

    const snap = await db.collection('users').get();
    const emails = new Set();
    snap.forEach(d => {
      const email = d.data().email;
      if (email) emails.add(email.trim().toLowerCase());
    });

    const results = [];
    for (const email of emails) {
      try {
        await sendEmail(email);
        results.push({ email, status: 'sent' });
      } catch (e) {
        results.push({ email, status: 'failed', error: e.message });
      }
    }

    return res.json({
      sent: results.filter(r => r.status === 'sent').length,
      total: results.length,
      results,
    });
  }

  return res.status(400).json({ error: 'Provide "to" email or "sendAll: true"' });
}
