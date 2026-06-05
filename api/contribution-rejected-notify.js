// Contribution rejected notification — sent when owner rejects a contribution
// POST /api/contribution-rejected-notify { episodeTitle, seriesTitle, contributorEmail, contributorName, ownerName, feedback }

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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { episodeTitle, seriesTitle, contributorEmail, contributorName, ownerName, feedback } = req.body || {};

  if (!contributorEmail || !seriesTitle) {
    return res.status(400).json({ error: 'Missing contributorEmail or seriesTitle' });
  }

  const subject = `Update on your episode submission`;

  const feedbackSection = feedback
    ? `<div style="background:#f0a50010;border:1px solid #f0a50030;border-radius:12px;padding:16px;margin-bottom:16px;">
        <p style="font-size:11px;color:#6e6a63;margin:0 0 4px;">FEEDBACK FROM ${(ownerName || 'THE SERIES OWNER').toUpperCase()}</p>
        <p style="font-size:14px;color:#f5f0e8;margin:0;line-height:1.6;font-style:italic;">"${feedback}"</p>
      </div>`
    : '';

  const html = wrap('Update on Your Episode', `
    <p style="font-size:15px;line-height:1.7;margin:0 0 12px;">
      Hi <strong style="color:#f5f0e8;">${contributorName || 'there'}</strong>,
    </p>
    <p style="font-size:14px;line-height:1.7;color:#a8a39a;margin:0 0 16px;">
      Thank you for submitting your episode for the series <strong style="color:#f5f0e8;">${seriesTitle}</strong>. After review, <strong style="color:#f5f0e8;">${ownerName || 'the series owner'}</strong> has decided not to include this version at this time.
    </p>
    <div style="background:#12121c;border:1px solid #1a1a28;border-radius:12px;padding:16px;margin-bottom:16px;">
      <p style="font-size:11px;color:#6e6a63;margin:0 0 4px;">EPISODE</p>
      <p style="font-size:14px;font-weight:bold;color:#f0a500;margin:0;">${episodeTitle || 'Your submitted episode'}</p>
    </div>
    ${feedbackSection}
    <p style="font-size:14px;line-height:1.7;color:#a8a39a;margin:0 0 16px;">
      Don't be discouraged! Every great storyteller revises their work. You're welcome to submit a revised version anytime. Your creativity and effort are truly appreciated.
    </p>
    <p style="font-size:13px;color:#6e6a63;margin:0;">
      Keep telling stories — the world needs more of them.
    </p>
  `);
  const text = `Hi ${contributorName || 'there'}, thank you for submitting your episode "${episodeTitle || ''}" for "${seriesTitle}". After review, ${ownerName || 'the series owner'} has decided not to include this version.${feedback ? ` Feedback: "${feedback}"` : ''} You can submit a revised version anytime!`;

  try {
    await sendEmail(contributorEmail, subject, html, text);
    return res.json({ sent: 1, email: contributorEmail });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
