// Contributor invitation — series owner invites someone to submit episodes
// POST /api/contributor-invite { seriesId, seriesTitle, contributorEmail, ownerUid, ownerEmail, ownerName }

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { getFirestore } from './_firebase.js';
import crypto from 'crypto';

const FROM_EMAIL = 'hello@mysleepytale.com';
const ses = new SESClient({ region: 'us-east-1' });

function buildHtml(ownerName, seriesTitle, token) {
  const link = `https://mysleepytale.com/contribute/${token}`;
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#c8c3ba;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:48px;">🌙</span>
      <h1 style="color:#f0a500;font-size:22px;margin:12px 0 4px;">You are invited to contribute!</h1>
      <p style="color:#6e6a63;font-size:13px;margin:0;">My Sleepy Tale</p>
    </div>

    <div style="background:#12121c;border-radius:16px;padding:28px 24px;margin-bottom:24px;border:1px solid #1a1a28;">
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
        <strong style="color:#f5f0e8;">${ownerName}</strong> has invited you to contribute an episode to the series:
      </p>
      <div style="background:#f0a50010;border:1px solid #f0a50030;border-radius:12px;padding:20px;text-align:center;margin-bottom:16px;">
        <div style="font-size:28px;font-weight:bold;color:#f0a500;">${seriesTitle}</div>
      </div>
      <p style="font-size:14px;line-height:1.7;margin:0;">
        You can write a bedtime story episode, upload a cover image, and submit it for review. Once approved, your episode will be published on My Sleepy Tale for families everywhere.
      </p>
    </div>

    <div style="text-align:center;margin-bottom:32px;">
      <a href="${link}" style="display:inline-block;background:#f0a500;color:#0a0a0f;font-size:16px;font-weight:bold;padding:14px 36px;border-radius:50px;text-decoration:none;">
        Submit Your Episode
      </a>
      <p style="color:#6e6a63;font-size:12px;margin:12px 0 0;">
        You will be asked to sign in with Google to submit
      </p>
    </div>

    <p style="color:#4a4a5a;font-size:11px;text-align:center;margin-top:32px;">
      My Sleepy Tale · <a href="https://mysleepytale.com" style="color:#f0a500;">mysleepytale.com</a>
    </p>
  </div>
</body>
</html>`;
}

function buildText(ownerName, seriesTitle, token) {
  const link = `https://mysleepytale.com/contribute/${token}`;
  return `${ownerName} has invited you to contribute an episode to "${seriesTitle}" on My Sleepy Tale!

You can write a bedtime story episode, upload a cover image, and submit it for review.

Submit your episode: ${link}

You will be asked to sign in with Google to submit.

— My Sleepy Tale · mysleepytale.com`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { seriesId, seriesTitle, contributorEmail, ownerUid, ownerEmail, ownerName } = req.body || {};
  if (!seriesId || !contributorEmail || !ownerUid) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const email = contributorEmail.trim().toLowerCase();
  const token = crypto.randomUUID();

  try {
    const db = await getFirestore();

    // Save invitation to Firestore
    if (db) {
      await db.collection('seriesInvitations').add({
        seriesId,
        seriesTitle: seriesTitle || '',
        ownerUid,
        ownerEmail: ownerEmail || '',
        ownerName: ownerName || '',
        contributorEmail: email,
        token,
        status: 'pending',
        createdAt: new Date().toISOString(),
        acceptedAt: null,
        contributorUid: null,
      });
    }

    // Send invitation email
    const subject = `${ownerName || 'Someone'} invited you to contribute to "${seriesTitle}" — My Sleepy Tale`;
    const cmd = new SendEmailCommand({
      Source: `My Sleepy Tale <${FROM_EMAIL}>`,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: subject },
        Body: {
          Text: { Data: buildText(ownerName, seriesTitle, token) },
          Html: { Data: buildHtml(ownerName, seriesTitle, token) },
        },
      },
    });
    await ses.send(cmd);

    return res.json({ sent: true, to: email, token });
  } catch (e) {
    console.error('[contributor-invite] Error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
