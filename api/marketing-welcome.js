// Marketing welcome email — "Thank you for signing up"
// Sends to a single email or all signed-up users.
// POST /api/marketing-welcome { to: "email" } — single recipient
// POST /api/marketing-welcome { sendAll: true } — all users (requires admin)

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { getFirestore } from './_firebase.js';

const FROM_EMAIL = 'hello@mysleepytale_official.com';
const CC_EMAIL = 'i@yprateek.com';
const ses = new SESClient({ region: 'us-east-1' });

function buildHtml(name) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#c8c3ba;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:48px;">🌙</span>
      <h1 style="color:#f0a500;font-size:24px;margin:12px 0 4px;letter-spacing:-0.5px;">Welcome to My Sleepy Tale</h1>
      <p style="color:#6e6a63;font-size:14px;margin:0;">Where bedtime becomes the best time</p>
    </div>

    <!-- Thank you -->
    <div style="background:#12121c;border-radius:16px;padding:28px 24px;margin-bottom:24px;border:1px solid #1a1a28;">
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
        Hi${name ? ' <strong style="color:#f5f0e8;">' + name + '</strong>' : ''},
      </p>
      <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
        Thank you for joining My Sleepy Tale! We are so glad you are here.
      </p>
      <p style="font-size:15px;line-height:1.7;margin:0;">
        We built this app because we believe bedtime stories should do more than just help kids fall asleep. They should help children <strong style="color:#f5f0e8;">learn about their roots</strong>, <strong style="color:#f5f0e8;">explore other cultures</strong>, and <strong style="color:#f5f0e8;">grow into kind, curious humans</strong>.
      </p>
    </div>

    <!-- What we're building -->
    <div style="background:#12121c;border-radius:16px;padding:28px 24px;margin-bottom:24px;border:1px solid #1a1a28;">
      <h2 style="color:#f0a500;font-size:16px;margin:0 0 16px;">What are we building?</h2>
      <p style="font-size:14px;line-height:1.7;margin:0 0 12px;">
        My Sleepy Tale is a <strong style="color:#f5f0e8;">personalized bedtime story app</strong> that brings cultural wisdom, moral lessons, and beautiful narration to your child's nightly routine.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-top:16px;">
        <tr>
          <td style="padding:12px;text-align:center;background:#f0a50010;border-radius:12px;width:33%;">
            <div style="font-size:24px;margin-bottom:4px;">🎧</div>
            <div style="font-size:20px;font-weight:bold;color:#f0a500;">146+</div>
            <div style="font-size:11px;color:#6e6a63;">Stories</div>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:12px;text-align:center;background:#9f7aea10;border-radius:12px;width:33%;">
            <div style="font-size:24px;margin-bottom:4px;">🌍</div>
            <div style="font-size:20px;font-weight:bold;color:#9f7aea;">11</div>
            <div style="font-size:11px;color:#6e6a63;">Traditions</div>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:12px;text-align:center;background:#48bb7810;border-radius:12px;width:33%;">
            <div style="font-size:24px;margin-bottom:4px;">📚</div>
            <div style="font-size:20px;font-weight:bold;color:#48bb78;">49</div>
            <div style="font-size:11px;color:#6e6a63;">Series</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Why it matters -->
    <div style="background:#12121c;border-radius:16px;padding:28px 24px;margin-bottom:24px;border:1px solid #1a1a28;">
      <h2 style="color:#f0a500;font-size:16px;margin:0 0 16px;">Why does this matter?</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 12px;vertical-align:top;width:32px;font-size:20px;">🪷</td>
          <td style="padding:10px 0;">
            <strong style="color:#f5f0e8;font-size:14px;">Cultural identity</strong>
            <p style="font-size:13px;color:#a8a39a;margin:4px 0 0;line-height:1.5;">Children growing up away from their homeland often lose touch with their roots. Our stories bring traditions alive through tales they will love.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;vertical-align:top;width:32px;font-size:20px;">💛</td>
          <td style="padding:10px 0;">
            <strong style="color:#f5f0e8;font-size:14px;">Values that stick</strong>
            <p style="font-size:13px;color:#a8a39a;margin:4px 0 0;line-height:1.5;">Every story teaches kindness, gratitude, courage, or empathy. No screen time guilt, just meaningful moments before sleep.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;vertical-align:top;width:32px;font-size:20px;">🌈</td>
          <td style="padding:10px 0;">
            <strong style="color:#f5f0e8;font-size:14px;">Representation</strong>
            <p style="font-size:13px;color:#a8a39a;margin:4px 0 0;line-height:1.5;">Hindu, Islamic, Christian, Catholic, Sikh, Buddhist, Jewish, Filipino, Hispanic, and universal wisdom. Every child deserves to see themselves in the stories they hear.</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- What stories we have -->
    <div style="background:#12121c;border-radius:16px;padding:28px 24px;margin-bottom:24px;border:1px solid #1a1a28;">
      <h2 style="color:#f0a500;font-size:16px;margin:0 0 16px;">Stories your family will love</h2>

      <!-- Category pills -->
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:4px;">
            <span style="display:inline-block;padding:8px 14px;background:#4299e120;border:1px solid #4299e130;border-radius:12px;font-size:13px;color:#4299e1;font-weight:bold;">🚀 Space Adventures</span>
          </td>
          <td style="padding:4px;">
            <span style="display:inline-block;padding:8px 14px;background:#48bb7820;border:1px solid #48bb7830;border-radius:12px;font-size:13px;color:#48bb78;font-weight:bold;">🔢 Maths & Numbers</span>
          </td>
        </tr>
        <tr>
          <td style="padding:4px;">
            <span style="display:inline-block;padding:8px 14px;background:#f0a50020;border:1px solid #f0a50030;border-radius:12px;font-size:13px;color:#f0a500;font-weight:bold;">💪 Motivation & Courage</span>
          </td>
          <td style="padding:4px;">
            <span style="display:inline-block;padding:8px 14px;background:#9f7aea20;border:1px solid #9f7aea30;border-radius:12px;font-size:13px;color:#9f7aea;font-weight:bold;">🪷 Faith & Beliefs</span>
          </td>
        </tr>
        <tr>
          <td style="padding:4px;">
            <span style="display:inline-block;padding:8px 14px;background:#f472b620;border:1px solid #f472b630;border-radius:12px;font-size:13px;color:#f472b6;font-weight:bold;">🌿 Nature & Animals</span>
          </td>
          <td style="padding:4px;">
            <span style="display:inline-block;padding:8px 14px;background:#ed893620;border:1px solid #ed893630;border-radius:12px;font-size:13px;color:#ed8936;font-weight:bold;">🏛️ History & Heroes</span>
          </td>
        </tr>
        <tr>
          <td style="padding:4px;">
            <span style="display:inline-block;padding:8px 14px;background:#f3727f20;border:1px solid #f3727f30;border-radius:12px;font-size:13px;color:#f3727f;font-weight:bold;">🔬 Science & Discovery</span>
          </td>
          <td style="padding:4px;">
            <span style="display:inline-block;padding:8px 14px;background:#63b3ed20;border:1px solid #63b3ed30;border-radius:12px;font-size:13px;color:#63b3ed;font-weight:bold;">🗺️ Adventure & Travel</span>
          </td>
        </tr>
        <tr>
          <td style="padding:4px;">
            <span style="display:inline-block;padding:8px 14px;background:#fbd38d20;border:1px solid #fbd38d30;border-radius:12px;font-size:13px;color:#fbd38d;font-weight:bold;">💛 Kindness & Sharing</span>
          </td>
          <td style="padding:4px;">
            <span style="display:inline-block;padding:8px 14px;background:#b794f420;border:1px solid #b794f430;border-radius:12px;font-size:13px;color:#b794f4;font-weight:bold;">📚 Multi-Episode Series</span>
          </td>
        </tr>
      </table>

      <p style="font-size:12px;color:#6e6a63;margin:16px 0 0;text-align:center;">49 series · 146+ stories · New ones added every week</p>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:32px 0;">
      <a href="https://mysleepytale.com" style="display:inline-block;padding:16px 48px;background:#f0a500;color:#0a0a0f;font-size:16px;font-weight:bold;border-radius:999px;text-decoration:none;letter-spacing:0.3px;">
        Explore Stories
      </a>
      <p style="color:#6e6a63;font-size:12px;margin-top:12px;">Free to use. No credit card needed.</p>
    </div>

    <!-- Connect with us -->
    <div style="background:#12121c;border-radius:16px;padding:24px;margin-bottom:24px;border:1px solid #1a1a28;text-align:center;">
      <h2 style="color:#f0a500;font-size:15px;margin:0 0 12px;">Stay connected</h2>
      <p style="font-size:13px;line-height:1.7;margin:0 0 16px;color:#a8a39a;">
        We would love to hear from you. Tell us what stories your family would like to hear next!
      </p>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="text-align:center;padding:8px;">
            <a href="mailto:hello@mysleepytale_official.com" style="color:#f0a500;font-size:13px;text-decoration:none;">
              📧 hello@mysleepytale_official.com
            </a>
          </td>
        </tr>
        <tr>
          <td style="text-align:center;padding:8px;">
            <a href="https://mysleepytale.com" style="color:#f0a500;font-size:13px;text-decoration:none;">
              🌐 mysleepytale.com
            </a>
          </td>
        </tr>
        <tr>
          <td style="text-align:center;padding:8px;">
            <a href="https://www.instagram.com/mysleepytale_official" style="color:#f0a500;font-size:13px;text-decoration:none;">
              📸 @mysleepytale_official
            </a>
          </td>
        </tr>
      </table>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:24px;border-top:1px solid #1a1a28;">
      <p style="font-size:13px;color:#6e6a63;margin:0 0 4px;">Made with love for families everywhere</p>
      <p style="font-size:11px;color:#4a4a5a;margin:0;">
        🌙 My Sleepy Tale · Toronto, Canada
      </p>
    </div>

  </div>
</body>
</html>`;
}

function buildText(name) {
  return `Welcome to My Sleepy Tale!

Hi${name ? ' ' + name : ''},

Thank you for joining My Sleepy Tale! We are so glad you are here.

We built this app because we believe bedtime stories should do more than just help kids fall asleep. They should help children learn about their roots, explore other cultures, and grow into kind, curious humans.

WHAT ARE WE BUILDING?
My Sleepy Tale is a personalized bedtime story app that brings cultural wisdom, moral lessons, and beautiful narration to your child's nightly routine.
- 146+ stories across 11 traditions
- 49 story series with multi-episode adventures
- Available in English, French, and Spanish

WHY DOES THIS MATTER?
- Cultural identity: Children growing up away from their homeland often lose touch with their roots. Our stories bring traditions alive.
- Values that stick: Every story teaches kindness, gratitude, courage, or empathy.
- Representation: Hindu, Islamic, Christian, Catholic, Sikh, Buddhist, Jewish, Filipino, Hispanic — every child deserves to see themselves in stories.

STORIES YOUR FAMILY WILL LOVE
- Space Adventures
- Maths & Numbers
- Motivation & Courage
- Faith & Beliefs
- Nature & Animals
- History & Heroes
- Science & Discovery
- Adventure & Travel
- Kindness & Sharing
- Multi-Episode Series

49 series · 146+ stories · New ones added every week!

Explore now: https://mysleepytale.com

STAY CONNECTED
Email: hello@mysleepytale_official.com
Web: https://mysleepytale.com
Instagram: @mysleepytale_official

Made with love for families everywhere.
My Sleepy Tale · Toronto, Canada`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { to, sendAll } = req.body || {};

  if (sendAll) {
    // Send to all users from Firestore
    const db = await getFirestore();
    if (!db) return res.status(503).json({ error: 'Firebase not configured' });

    const snap = await db.collection('users').get();
    const users = [];
    snap.forEach(d => {
      const data = d.data();
      if (data.email) users.push({ email: data.email, name: data.displayName || data.name || '' });
    });

    const results = [];
    for (const user of users) {
      try {
        await ses.send(new SendEmailCommand({
          Source: `My Sleepy Tale <${FROM_EMAIL}>`,
          Destination: { ToAddresses: [user.email], CcAddresses: [CC_EMAIL] },
          Message: {
            Subject: { Data: 'Welcome to My Sleepy Tale — Where Bedtime Becomes the Best Time 🌙' },
            Body: {
              Text: { Data: buildText(user.name) },
              Html: { Data: buildHtml(user.name) },
            },
          },
        }));
        results.push({ email: user.email, status: 'sent' });
      } catch (e) {
        results.push({ email: user.email, status: 'failed', error: e.message });
      }
    }

    return res.json({ sent: results.filter(r => r.status === 'sent').length, total: results.length, results });
  }

  // Single recipient
  if (!to || !to.includes('@')) return res.status(400).json({ error: 'Provide "to" email or { sendAll: true }' });
  const toEmail = to.trim().toLowerCase();

  try {
    await ses.send(new SendEmailCommand({
      Source: `My Sleepy Tale <${FROM_EMAIL}>`,
      Destination: { ToAddresses: [toEmail], CcAddresses: [CC_EMAIL] },
      Message: {
        Subject: { Data: 'Welcome to My Sleepy Tale — Where Bedtime Becomes the Best Time 🌙' },
        Body: {
          Text: { Data: buildText('') },
          Html: { Data: buildHtml('') },
        },
      },
    }));
    return res.json({ sent: 1, to: toEmail });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
