// Series shared + contributor invite — combined notification
// Sent when owner shares a personal series with someone
// POST /api/series-shared-notify { seriesTitle, seriesId, ownerName, sharedWithEmail, ownerEmail }

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const FROM_EMAIL = 'hello@mysleepytale.com';
const ses = new SESClient({ region: 'us-east-1' });

async function sendEmail(to, subject, html, text, cc) {
  const cmd = new SendEmailCommand({
    Source: `My Sleepy Tale <${FROM_EMAIL}>`,
    Destination: { ToAddresses: [to], ...(cc ? { CcAddresses: [cc] } : {}) },
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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { seriesTitle, seriesId, ownerName, sharedWithEmail, ownerEmail } = req.body || {};

  if (!seriesTitle || !seriesId || !sharedWithEmail) {
    return res.status(400).json({ error: 'Missing seriesTitle, seriesId, or sharedWithEmail' });
  }

  const subject = `${ownerName || 'Someone'} shared a bedtime story series with you — listen & contribute`;
  const html = wrap('A Story Series Awaits You!', `
    <p style="font-size:15px;line-height:1.7;margin:0 0 12px;">
      <strong style="color:#f5f0e8;">${ownerName || 'A friend'}</strong> has shared a private bedtime story series with you!
    </p>
    <div style="background:#f0a50010;border:1px solid #f0a50030;border-radius:12px;padding:16px;margin-bottom:16px;">
      <p style="font-size:11px;color:#6e6a63;margin:0 0 4px;">SERIES</p>
      <p style="font-size:18px;font-weight:bold;color:#f0a500;margin:0;">${seriesTitle}</p>
    </div>

    <div style="background:#12121c;border-radius:12px;padding:16px;margin-bottom:16px;border:1px solid #1a1a28;">
      <h3 style="color:#f5f0e8;font-size:14px;margin:0 0 12px;">What you can do:</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;vertical-align:top;width:28px;font-size:18px;">🎧</td>
          <td style="padding:8px 0;">
            <strong style="color:#f5f0e8;font-size:13px;">Listen to all episodes</strong>
            <p style="font-size:12px;color:#a8a39a;margin:4px 0 0;">Every episode in the series is available for you to enjoy at bedtime.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;width:28px;font-size:18px;">✍️</td>
          <td style="padding:8px 0;">
            <strong style="color:#f5f0e8;font-size:13px;">Contribute your own episode</strong>
            <p style="font-size:12px;color:#a8a39a;margin:4px 0 0;">Add your own story, memories, or experiences as a new episode. Upload photos too! ${ownerName || 'The series owner'} will review and publish it.</p>
          </td>
        </tr>
      </table>
    </div>

    <p style="font-size:13px;color:#a8a39a;margin:0 0 16px;">
      Sign in with <strong style="color:#f5f0e8;">${sharedWithEmail}</strong> to access the series.
    </p>

    <div style="text-align:center;margin-bottom:12px;">
      <a href="https://mysleepytale.com/series/${seriesId}" style="display:inline-block;background:#f0a500;color:#0a0a0f;font-size:14px;font-weight:bold;padding:12px 28px;border-radius:50px;text-decoration:none;">
        Listen & Contribute
      </a>
    </div>
    <p style="text-align:center;font-size:11px;color:#6e6a63;">Free to use. No credit card needed.</p>
  `);
  const text = `${ownerName || 'Someone'} shared the bedtime story series "${seriesTitle}" with you!

You can:
1. Listen to all episodes at bedtime
2. Contribute your own episode — write a story, upload photos, and submit for review

Sign in with ${sharedWithEmail} to access: https://mysleepytale.com/series/${seriesId}

Free to use. No credit card needed.

— My Sleepy Tale · mysleepytale.com`;

  try {
    await sendEmail(sharedWithEmail, subject, html, text, ownerEmail || null);
    return res.json({ sent: 1, email: sharedWithEmail });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
