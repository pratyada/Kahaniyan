// Weekend "Happy Friday" newsletter — this weekend's bedtime routine.
// Three updates: (1) new illustrated page-turning Garden storybook, (2) voice
// cloning free to try for the next week, (3) advanced Kids Create teaser.
// POST /api/weekend-newsletter { to: "email" }   → single recipient (test)
// POST /api/weekend-newsletter { sendAll: true }  → every signed-up user (once)
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { logEmail } from './_emailThrottle.js';

const FROM_EMAIL = 'hello@mysleepytale.com';
const ses = new SESClient({ region: 'us-east-1' });
const SUBJECT = 'Happy Friday 🌙 Your weekend bedtime routine (a brand-new illustrated story)';
const STORY_URL = 'https://mysleepytale.com/player/universal_garden_of_mistakes';
const VOICES_URL = 'https://mysleepytale.com/voices';
const COVER = 'https://mysleepytale.com/media/stories/garden/cover.jpg';

function greetingName(name) {
  const first = (name || '').trim().split(' ')[0];
  return first ? `Hi ${first},` : 'Hi there,';
}

function buildHtml(name) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${SUBJECT}</title></head>
<body style="margin:0;padding:0;background:#070A19;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">This weekend: a new illustrated, page-turning bedtime story, voice cloning free to try, and a peek at what's next.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#070A19;">
    <tr><td align="center" style="padding:28px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:radial-gradient(120% 80% at 50% -10%,#1A1040 0%,#0D1B2A 55%,#070A19 100%);border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">

        <tr><td align="center" style="padding:38px 32px 6px;">
          <div style="font-size:44px;line-height:1;">🌙</div>
          <div style="font-family:Georgia,'Times New Roman',serif;color:#F6C453;font-size:22px;margin-top:10px;letter-spacing:0.3px;">My Sleepy Tale</div>
        </td></tr>

        <tr><td style="padding:12px 32px 6px;">
          <p style="font-family:Arial,Helvetica,sans-serif;color:#B8AAC8;font-size:15px;margin:0 0 12px;">${greetingName(name)}</p>
          <h1 style="font-family:Georgia,'Times New Roman',serif;color:#F7F1E8;font-size:26px;line-height:1.3;margin:0 0 8px;">
            Happy Friday — here's your <span style="color:#F6C453;">weekend bedtime routine</span> 💛
          </h1>
          <p style="font-family:Arial,Helvetica,sans-serif;color:#CDBFE0;font-size:15.5px;line-height:1.7;margin:12px 0 0;">
            Three little things to make bedtime cozy this weekend — a brand-new kind of story, a feature we're excited about, and a peek at what's next.
          </p>
        </td></tr>

        <!-- 1. New illustrated storybook -->
        <tr><td style="padding:24px 32px 4px;">
          <p style="font-family:Arial,Helvetica,sans-serif;color:#7A6B8A;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin:0 0 10px;">1 · A new kind of story</p>
          <a href="${STORY_URL}" style="text-decoration:none;">
            <img src="${COVER}" alt="The Garden Where Mistakes Grew Flowers" width="536" style="width:100%;max-width:536px;border-radius:14px;display:block;border:1px solid rgba(255,255,255,0.08);" />
          </a>
          <h2 style="font-family:Georgia,serif;color:#F7F1E8;font-size:20px;line-height:1.35;margin:16px 0 6px;">"The Garden Where Mistakes Grew Flowers"</h2>
          <p style="font-family:Arial,Helvetica,sans-serif;color:#CDBFE0;font-size:15px;line-height:1.7;margin:0 0 14px;">
            We upgraded this one into an <strong style="color:#F7F1E8;">illustrated, page-turning storybook</strong> — each part of the story has its own picture and the pages turn as it's read aloud, in a warm, human voice. A gentle tale about honesty. Snuggle up and let your little one watch it unfold.
          </p>
          <a href="${STORY_URL}" style="display:inline-block;background:#F6C453;color:#0D1B2A;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;text-decoration:none;padding:13px 28px;border-radius:999px;">Listen to the story →</a>
        </td></tr>

        <!-- 2. Voice cloning free -->
        <tr><td style="padding:26px 32px 4px;">
          <p style="font-family:Arial,Helvetica,sans-serif;color:#7A6B8A;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin:0 0 10px;">2 · Try it in your own voice</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:rgba(246,196,83,0.08);border:1px solid rgba(246,196,83,0.22);border-radius:14px;">
            <tr><td style="padding:18px 20px;">
              <p style="font-family:Georgia,serif;color:#F6C453;font-size:17px;margin:0 0 6px;">Hear every story in <em>your</em> voice — or Grandma's. 🎙️</p>
              <p style="font-family:Arial,Helvetica,sans-serif;color:#CDBFE0;font-size:14.5px;line-height:1.7;margin:0 0 12px;">Voice cloning is now built in — record a short sample, name it, and any story plays in that voice. <strong style="color:#F7F1E8;">Free to try for the next week.</strong></p>
              <a href="${VOICES_URL}" style="display:inline-block;background:transparent;color:#F6C453;border:1px solid #F6C453;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:11px 24px;border-radius:999px;">Set up a voice — free →</a>
            </td></tr>
          </table>
        </td></tr>

        <!-- 3. Kids Create teaser -->
        <tr><td style="padding:26px 32px 4px;">
          <p style="font-family:Arial,Helvetica,sans-serif;color:#7A6B8A;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin:0 0 10px;">3 · Coming soon</p>
          <p style="font-family:Arial,Helvetica,sans-serif;color:#E7DEF2;font-size:15px;line-height:1.7;margin:0;">
            We're building a more advanced version of <strong style="color:#F7F1E8;">Kids Create</strong> — where your child dreams up and builds their own stories. It's going to be magical. <span style="color:#B8AAC8;">Stay tuned. 🌟</span>
          </p>
        </td></tr>

        <!-- Bedtime routine -->
        <tr><td style="padding:26px 32px 6px;">
          <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:18px;">
            <p style="font-family:Arial,Helvetica,sans-serif;color:#7A6B8A;font-size:12px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;margin:0 0 10px;">Your weekend wind-down</p>
            <p style="font-family:Arial,Helvetica,sans-serif;color:#E7DEF2;font-size:15px;line-height:1.9;margin:0;">
              <span style="color:#F6C453;font-weight:bold;">1.</span>&nbsp; Dim the lights, tuck in.<br>
              <span style="color:#F6C453;font-weight:bold;">2.</span>&nbsp; Play the new Garden storybook.<br>
              <span style="color:#F6C453;font-weight:bold;">3.</span>&nbsp; Sweet dreams. 🌙
            </p>
          </div>
        </td></tr>

        <tr><td style="padding:24px 32px 34px;">
          <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:18px;">
            <p style="font-family:Arial,Helvetica,sans-serif;color:#7A6B8A;font-size:12px;line-height:1.7;margin:0;text-align:center;">
              Have a cozy weekend,<br>The My Sleepy Tale family · Toronto, Canada<br>
              Questions? Just reply, or write <a href="mailto:hello@mysleepytale.com" style="color:#F6C453;text-decoration:none;">hello@mysleepytale.com</a>.
            </p>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildText(name) {
  const first = (name || '').trim().split(' ')[0];
  return `${first ? `Hi ${first},` : 'Hi there,'}

Happy Friday — here's your weekend bedtime routine. Three little things:

1) A NEW KIND OF STORY
"The Garden Where Mistakes Grew Flowers" is now an illustrated, page-turning storybook — each part has its own picture and the pages turn as it's read aloud in a warm, human voice. A gentle tale about honesty.
Listen: ${STORY_URL}

2) TRY IT IN YOUR OWN VOICE
Voice cloning is now built in — record a short sample, name it, and any story plays in that voice. Free to try for the next week.
Set up a voice: ${VOICES_URL}

3) COMING SOON
A more advanced version of Kids Create — where your child dreams up and builds their own stories. Stay tuned!

YOUR WEEKEND WIND-DOWN
1. Dim the lights, tuck in.
2. Play the new Garden storybook.
3. Sweet dreams.

Have a cozy weekend,
The My Sleepy Tale family · Toronto, Canada
Questions? Reply or write hello@mysleepytale.com`;
}

async function sendOne(toEmail, name) {
  await ses.send(new SendEmailCommand({
    Source: `My Sleepy Tale <${FROM_EMAIL}>`,
    Destination: { ToAddresses: [toEmail] },
    Message: {
      Subject: { Data: SUBJECT },
      Body: { Text: { Data: buildText(name) }, Html: { Data: buildHtml(name) } },
    },
  }));
  try { await logEmail(toEmail, 'weekend-newsletter', 'marketing', SUBJECT); } catch {}
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { to, sendAll } = req.body || {};

  if (sendAll) {
    const { getFirestore } = await import('./_firebase.js');
    const db = await getFirestore();
    if (!db) return res.status(503).json({ error: 'Firebase not configured' });

    // Dedicated tracker doc so this send is idempotent and independent of other blasts.
    const sentDoc = await db.collection('config').doc('weekendNewsletter_2026_09_26').get();
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

    if (users.length === 0) return res.json({ sent: 0, total: 0, message: 'All users already received this newsletter', alreadySentCount: alreadySent.size });

    const results = [];
    const newlySent = [];
    for (const u of users) {
      try { await sendOne(u.email, u.name); results.push({ email: u.email, status: 'sent' }); newlySent.push(u.email); }
      catch (e) { results.push({ email: u.email, status: 'failed', error: e.message }); }
    }
    if (newlySent.length > 0) {
      await db.collection('config').doc('weekendNewsletter_2026_09_26').set({
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
