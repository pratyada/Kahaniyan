// Story/series approved notification — sent when admin approves a story or series
// POST /api/story-approved-notify { title, authorEmail, authorName, storyId, type: "story"|"series" }

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { canSendEmail, logEmail } from './_emailThrottle.js';

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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { title, authorEmail, authorName, storyId, type } = req.body || {};

  if (!title || !authorEmail) {
    return res.status(400).json({ error: 'Missing title or authorEmail' });
  }

  const throttle = await canSendEmail(authorEmail, 'activity');
  if (!throttle.allowed) return res.json({ sent: 0, throttled: true, reason: throttle.reason });

  const isSeries = type === 'series';
  const label = isSeries ? 'series' : 'story';
  const link = isSeries
    ? `https://mysleepytale.com/series/${storyId}`
    : `https://mysleepytale.com/series/${storyId}`;
  const subject = `Your ${label} "${title}" is now live!`;

  const html = wrap('Your Story Is Live!', `
    <div style="text-align:center;margin-bottom:16px;">
      <span style="font-size:48px;">🎉</span>
    </div>
    <p style="font-size:15px;line-height:1.7;margin:0 0 12px;text-align:center;">
      Congratulations, <strong style="color:#f5f0e8;">${authorName || 'Storyteller'}</strong>!
    </p>
    <div style="background:#48bb7810;border:1px solid #48bb7830;border-radius:12px;padding:16px;margin-bottom:16px;">
      <p style="font-size:11px;color:#6e6a63;margin:0 0 4px;">${label.toUpperCase()}</p>
      <p style="font-size:16px;font-weight:bold;color:#f0a500;margin:0 0 8px;">${title}</p>
      <p style="font-size:13px;color:#48bb78;margin:0;font-weight:bold;">Now live on My Sleepy Tale!</p>
    </div>
    <p style="font-size:14px;color:#a8a39a;margin:0 0 16px;">
      Families around the world can now enjoy your ${label} at bedtime. Share it with friends and family so even more little ones can hear it!
    </p>
    <div style="text-align:center;margin-bottom:12px;">
      <a href="${link}" style="display:inline-block;background:#f0a500;color:#0a0a0f;font-size:14px;font-weight:bold;padding:12px 28px;border-radius:50px;text-decoration:none;">
        Share It With Friends
      </a>
    </div>
  `);
  const text = `Congratulations! Your ${label} "${title}" is now live on My Sleepy Tale! Share it with friends: ${link}`;

  try {
    await sendEmail(authorEmail, subject, html, text);
    await logEmail(authorEmail, 'story-approved', 'activity', subject);
    return res.json({ sent: 1, email: authorEmail });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
