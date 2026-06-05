// Series notification emails
// POST /api/series-notify { type: "submitted" | "published", ... }

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { escapeHtml, sanitizeEmail } from './_emailSanitize.js';
import { getFirestore } from './_firebase.js';
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
    My Sleepy Tale · <a href="https://mysleepytale.com" style="color:#f0a500;">mysleepytale.com</a>
  </p>
</div></body></html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { type, seriesId, seriesTitle, episodeTitle, contributorName, contributorEmail, ownerEmail, ownerName, sharedWith } = req.body || {};

  if (!type || !seriesId) return res.status(400).json({ error: 'Missing type or seriesId' });

  const results = [];

  try {
    // ─── Type 1: Contributor submitted for review → notify owner ───
    if (type === 'submitted') {
      const subject = `New episode submitted — "${episodeTitle}" for ${seriesTitle}`;
      const html = wrap('New Contribution for Review', `
        <p style="font-size:15px;line-height:1.7;margin:0 0 12px;">
          <strong style="color:#f5f0e8;">${contributorName}</strong> has submitted a new episode for your series:
        </p>
        <div style="background:#f0a50010;border:1px solid #f0a50030;border-radius:12px;padding:16px;margin-bottom:16px;">
          <p style="font-size:11px;color:#6e6a63;margin:0 0 4px;">SERIES</p>
          <p style="font-size:16px;font-weight:bold;color:#f0a500;margin:0 0 12px;">${seriesTitle}</p>
          <p style="font-size:11px;color:#6e6a63;margin:0 0 4px;">EPISODE</p>
          <p style="font-size:14px;font-weight:bold;color:#f5f0e8;margin:0;">${episodeTitle}</p>
        </div>
        <p style="font-size:14px;color:#a8a39a;margin:0 0 16px;">
          You can review, edit, and publish this episode from the series page.
        </p>
        <div style="text-align:center;">
          <a href="https://mysleepytale.com/series/${seriesId}" style="display:inline-block;background:#f0a500;color:#0a0a0f;font-size:14px;font-weight:bold;padding:12px 28px;border-radius:50px;text-decoration:none;">
            Review Now
          </a>
        </div>
      `);
      const text = `${contributorName} submitted "${episodeTitle}" for your series "${seriesTitle}". Review it at: https://mysleepytale.com/series/${seriesId}`;

      if (ownerEmail) {
        const throttle = await canSendEmail(ownerEmail, 'activity');
        if (!throttle.allowed) {
          results.push({ email: ownerEmail, status: 'throttled', reason: throttle.reason });
        } else {
          try {
            await sendEmail(ownerEmail, subject, html, text);
            await logEmail(ownerEmail, 'contribution-submitted', 'activity', subject);
            results.push({ email: ownerEmail, status: 'sent', type: 'owner-notify' });
          } catch (e) { results.push({ email: ownerEmail, status: 'failed', error: e.message }); }
        }
      }
    }

    // ─── Type 2: Owner published episode → notify all shared users ───
    if (type === 'published') {
      const emails = new Set(sharedWith || []);
      if (contributorEmail) emails.add(contributorEmail);
      // Remove owner from notification list (they already know)
      if (ownerEmail) emails.delete(ownerEmail);

      const subject = `New episode published — "${episodeTitle}" in ${seriesTitle}`;
      const html = wrap('New Episode Published!', `
        <p style="font-size:15px;line-height:1.7;margin:0 0 12px;">
          A new episode has been published in a series shared with you!
        </p>
        <div style="background:#48bb7810;border:1px solid #48bb7830;border-radius:12px;padding:16px;margin-bottom:16px;">
          <p style="font-size:11px;color:#6e6a63;margin:0 0 4px;">SERIES</p>
          <p style="font-size:16px;font-weight:bold;color:#f0a500;margin:0 0 12px;">${seriesTitle}</p>
          <p style="font-size:11px;color:#6e6a63;margin:0 0 4px;">NEW EPISODE</p>
          <p style="font-size:14px;font-weight:bold;color:#f5f0e8;margin:0;">${episodeTitle}</p>
        </div>
        <p style="font-size:14px;color:#a8a39a;margin:0 0 4px;">
          ${contributorName ? `<strong style="color:#f5f0e8;">${contributorName}</strong> contributed this episode.` : ''}
          ${ownerName ? `<strong style="color:#f5f0e8;">${ownerName}</strong> published it.` : ''}
        </p>
        <p style="font-size:13px;color:#a8a39a;margin:0 0 16px;">
          Listen to it tonight at bedtime!
        </p>
        <div style="text-align:center;">
          <a href="https://mysleepytale.com/series/${seriesId}" style="display:inline-block;background:#f0a500;color:#0a0a0f;font-size:14px;font-weight:bold;padding:12px 28px;border-radius:50px;text-decoration:none;">
            Listen Now
          </a>
        </div>
      `);
      const text = `New episode "${episodeTitle}" published in "${seriesTitle}". ${contributorName ? contributorName + ' contributed.' : ''} ${ownerName ? ownerName + ' published.' : ''} Listen: https://mysleepytale.com/series/${seriesId}`;

      for (const email of emails) {
        const throttle = await canSendEmail(email, 'activity');
        if (!throttle.allowed) {
          results.push({ email, status: 'throttled', reason: throttle.reason });
          continue;
        }
        try {
          await sendEmail(email, subject, html, text);
          await logEmail(email, 'episode-published', 'activity', subject);
          results.push({ email, status: 'sent', type: 'published-notify' });
        } catch (e) { results.push({ email, status: 'failed', error: e.message }); }
      }
    }

    return res.json({ sent: results.filter(r => r.status === 'sent').length, total: results.length, results });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
