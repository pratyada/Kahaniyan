// Deepti's outreach email — mom & PM-turned-researcher introduction
// POST /api/deepti-outreach { to, firstName } — single send
// POST /api/deepti-outreach { sendBatch: true, limit: 50 } — batch send

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
<body style="margin:0;padding:0;font-family:Georgia,'Times New Roman',serif;color:#333;line-height:1.8;background:#fdf8f0;">
  <div style="max-width:600px;margin:0 auto;padding:32px 20px;">

    <!-- Header with platform screenshot -->
    <div style="text-align:center;margin-bottom:24px;">
      <img src="https://mysleepytale.com/og/cover.jpg" alt="My Sleepy Tale — bedtime stories for every culture" style="width:100%;max-width:560px;border-radius:16px;border:1px solid #e8e0d4;" />
    </div>

    <p style="font-size:16px;margin:0 0 16px;">Hi ${name},</p>

    <p style="font-size:15px;margin:0 0 16px;">I am Deepti — a mom of a 4.5-year-old boy here in downtown Toronto, and the Co-Founder of <strong>My Sleepy Tale</strong>.</p>

    <p style="font-size:15px;margin:0 0 16px;">Before this, I spent over a decade in <strong>Project Management and Product roles</strong> across IT and telecom — managing complex programs, leading cross-functional teams, and shipping products at scale. But when my son was born, something shifted.</p>

    <!-- The shift — visual card -->
    <div style="background:#fff;border-radius:16px;padding:24px;margin:24px 0;border:1px solid #e8e0d4;">
      <h2 style="font-size:17px;color:#6B4FA8;margin:0 0 16px;">From corporate PM to bedtime researcher</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:14px;text-align:center;background:#f7f1e8;border-radius:12px;width:33%;">
            <div style="font-size:28px;margin-bottom:6px;">👩‍💼</div>
            <div style="font-size:13px;font-weight:bold;color:#6B4FA8;">10+ Years</div>
            <div style="font-size:11px;color:#666;">IT & Telecom PM</div>
          </td>
          <td style="width:6px;"></td>
          <td style="padding:14px;text-align:center;background:#f7f1e8;border-radius:12px;width:33%;">
            <div style="font-size:28px;margin-bottom:6px;">🔬</div>
            <div style="font-size:13px;font-weight:bold;color:#6B4FA8;">Research</div>
            <div style="font-size:11px;color:#666;">Child Development</div>
          </td>
          <td style="width:6px;"></td>
          <td style="padding:14px;text-align:center;background:#f7f1e8;border-radius:12px;width:33%;">
            <div style="font-size:28px;margin-bottom:6px;">👶</div>
            <div style="font-size:13px;font-weight:bold;color:#6B4FA8;">Mom</div>
            <div style="font-size:11px;color:#666;">4.5-Year-Old Son</div>
          </td>
        </tr>
      </table>
    </div>

    <p style="font-size:15px;margin:0 0 16px;">I started researching how children actually learn, grow, and wind down. What I found changed everything for our family:</p>

    <!-- Research findings — visual -->
    <div style="background:#fff;border-radius:16px;padding:24px;margin:24px 0;border:1px solid #e8e0d4;">
      <h3 style="font-size:14px;color:#6B4FA8;margin:0 0 16px;text-align:center;">What the research shows</h3>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:10px 14px;vertical-align:top;">
            <div style="font-size:20px;float:left;margin-right:10px;">📵</div>
            <div>
              <strong style="font-size:13px;color:#333;">Screen time before bed</strong>
              <p style="font-size:12px;color:#888;margin:4px 0 0;">delays melatonin by 30+ minutes, disrupting natural sleep cycles in young children</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 14px;vertical-align:top;">
            <div style="font-size:20px;float:left;margin-right:10px;">🧠</div>
            <div>
              <strong style="font-size:13px;color:#333;">Audio stories activate imagination</strong>
              <p style="font-size:12px;color:#888;margin:4px 0 0;">children create their own mental images, building creativity and comprehension far better than video</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 14px;vertical-align:top;">
            <div style="font-size:20px;float:left;margin-right:10px;">💛</div>
            <div>
              <strong style="font-size:13px;color:#333;">Personalized stories calm faster</strong>
              <p style="font-size:12px;color:#888;margin:4px 0 0;">hearing their own name in a story creates a sense of safety and belonging that generic content cannot</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 14px;vertical-align:top;">
            <div style="font-size:20px;float:left;margin-right:10px;">🌍</div>
            <div>
              <strong style="font-size:13px;color:#333;">Cultural stories build identity</strong>
              <p style="font-size:12px;color:#888;margin:4px 0 0;">children who hear stories from their own tradition show stronger self-esteem and empathy for others</p>
            </div>
          </td>
        </tr>
      </table>
    </div>

    <p style="font-size:15px;margin:0 0 16px;">So I built what I wished existed. <strong>My Sleepy Tale</strong> — calming audio bedtime stories that use your child's real name, teach values from their own cultural roots, and help them drift off to sleep without a screen.</p>

    <!-- Stats -->
    <div style="background:#fff;border-radius:16px;padding:24px;margin:24px 0;border:1px solid #e8e0d4;">
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:16px;text-align:center;background:#f7f1e8;border-radius:12px;width:25%;">
            <div style="font-size:24px;margin-bottom:4px;">🎧</div>
            <div style="font-size:20px;font-weight:bold;color:#6B4FA8;">200+</div>
            <div style="font-size:10px;color:#666;">Audio Stories</div>
          </td>
          <td style="width:6px;"></td>
          <td style="padding:16px;text-align:center;background:#f7f1e8;border-radius:12px;width:25%;">
            <div style="font-size:24px;margin-bottom:4px;">🌍</div>
            <div style="font-size:20px;font-weight:bold;color:#6B4FA8;">20+</div>
            <div style="font-size:10px;color:#666;">Cultures</div>
          </td>
          <td style="width:6px;"></td>
          <td style="padding:16px;text-align:center;background:#f7f1e8;border-radius:12px;width:25%;">
            <div style="font-size:24px;margin-bottom:4px;">🗣️</div>
            <div style="font-size:20px;font-weight:bold;color:#6B4FA8;">3</div>
            <div style="font-size:10px;color:#666;">Languages</div>
          </td>
          <td style="width:6px;"></td>
          <td style="padding:16px;text-align:center;background:#f7f1e8;border-radius:12px;width:25%;">
            <div style="font-size:24px;margin-bottom:4px;">💛</div>
            <div style="font-size:20px;font-weight:bold;color:#6B4FA8;">Free</div>
            <div style="font-size:10px;color:#666;">No Catch</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Traditions grid -->
    <div style="background:#fff;border-radius:16px;padding:20px;margin:24px 0;border:1px solid #e8e0d4;">
      <h3 style="font-size:14px;color:#6B4FA8;margin:0 0 12px;text-align:center;">Stories from every tradition</h3>
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

    <!-- Personal story -->
    <div style="background:#6B4FA8;border-radius:16px;padding:24px;margin:24px 0;color:#fff;">
      <h2 style="font-size:16px;margin:0 0 12px;color:#fff;">It worked for my son</h2>
      <p style="font-size:14px;margin:0 0 12px;color:#e8dff5;line-height:1.7;">
        My son used to need 45 minutes of negotiation before sleep. Now he asks for "his story" every night. He picks a tradition — sometimes his own, sometimes a friend's — and falls asleep within minutes. No screen. No struggle. Just a calm voice and a meaningful story.
      </p>
      <p style="font-size:14px;margin:0;color:#e8dff5;line-height:1.7;">
        I want every family in Toronto to have this. That is why it is completely free.
      </p>
    </div>

    <!-- How it works -->
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
            <div style="font-size:11px;color:#999;">Calming voice with your child's name</div>
          </td>
          <td style="padding:12px;text-align:center;width:33%;">
            <div style="font-size:32px;margin-bottom:4px;">3️⃣</div>
            <div style="font-size:12px;font-weight:bold;color:#333;">Sweet dreams</div>
            <div style="font-size:11px;color:#999;">Screen off, story on</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin:28px 0;">
      <a href="https://mysleepytale.com" style="display:inline-block;background:#6B4FA8;color:#fff;font-size:16px;font-weight:bold;padding:14px 40px;border-radius:50px;text-decoration:none;">
        Try It Free — Just Tap Play
      </a>
      <p style="color:#999;font-size:12px;margin:10px 0 0;">
        No sign up required. Works on any phone or tablet.
      </p>
    </div>

    <!-- Coffee meetup -->
    <div style="background:#fff5e8;border-radius:16px;padding:24px;margin:24px 0;border:1px solid #e8d9c4;">
      <h3 style="font-size:15px;color:#b8860b;margin:0 0 10px;">☕ Let us grab a coffee</h3>
      <p style="font-size:14px;margin:0;line-height:1.7;color:#555;">
        I am always happy to meet fellow parents in Toronto. If you try My Sleepy Tale and want to chat — about bedtime routines, screen time, cultural identity, or just parenting life — I would love to meet up for a coffee. No pitch, just a real conversation between parents.
      </p>
    </div>

    <!-- Sign off -->
    <p style="font-size:15px;margin:24px 0 4px;">With warmth,</p>
    <p style="font-size:15px;margin:0 0 4px;"><strong>Deepti Ramaul</strong></p>
    <p style="font-size:13px;color:#888;margin:0 0 2px;">Co-Founder, My Sleepy Tale</p>
    <p style="font-size:12px;color:#999;margin:0 0 2px;">Mom of a 4.5-year-old · Former PM in IT & Telecom · Toronto</p>
    <p style="font-size:13px;margin:0;">
      <a href="https://mysleepytale.com" style="color:#6B4FA8;text-decoration:none;">mysleepytale.com</a> ·
      <a href="https://www.linkedin.com/in/deeptiramaul/" style="color:#6B4FA8;text-decoration:none;">LinkedIn</a> ·
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

I am Deepti — a mom of a 4.5-year-old boy here in downtown Toronto, and the Co-Founder of My Sleepy Tale.

Before this, I spent over a decade in Project Management and Product roles across IT and telecom. But when my son was born, something shifted. I started researching how children actually learn, grow, and wind down.

What I found changed everything:
- Screen time before bed delays melatonin by 30+ minutes
- Audio stories activate imagination far better than video
- Personalized stories (with the child's name) calm them faster
- Cultural stories build stronger self-esteem and empathy

So I built what I wished existed. My Sleepy Tale — calming audio bedtime stories that use your child's real name, teach values from their cultural roots, and help them drift off without a screen.

200+ stories | 20+ cultures | 3 languages | 100% free

Hindu, Islamic, Sikh, Christian, Buddhist, Filipino, Indigenous and more.

IT WORKED FOR MY SON
My son used to need 45 minutes of negotiation before sleep. Now he asks for "his story" every night. He falls asleep within minutes. No screen. No struggle. I want every family in Toronto to have this.

Try it: https://mysleepytale.com
No sign up required. Just tap play.

LET US GRAB A COFFEE
I am always happy to meet fellow parents in Toronto. If you try My Sleepy Tale and want to chat — about bedtime routines, screen time, or just parenting life — I would love to meet for a coffee.

With warmth,
Deepti Ramaul
Co-Founder, My Sleepy Tale
Mom of a 4.5-year-old · Former PM in IT & Telecom · Toronto
mysleepytale.com | LinkedIn: linkedin.com/in/deeptiramaul/

Unsubscribe: https://mysleepytale.com/settings?unsubscribe=true`;
}

async function sendOne(to, firstName) {
  const subject = `${firstName || 'Hi'}, a Toronto mom's research on screen-free bedtime`;
  const cmd = new SendEmailCommand({
    Source: `Deepti from My Sleepy Tale <${FROM_EMAIL}>`,
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

  if (to && !sendBatch) {
    const toEmail = sanitizeEmail(to);
    const throttle = await canSendEmail(toEmail, 'marketing');
    if (!throttle.allowed) return res.json({ sent: 0, throttled: true, reason: throttle.reason });

    try {
      await sendOne(toEmail, firstName);
      await logEmail(toEmail, 'deepti-outreach', 'marketing', 'Deepti mom outreach');
      return res.json({ sent: 1, to: toEmail });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

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
        await logEmail(email, 'deepti-outreach', 'marketing', 'Deepti mom outreach');
        const { FieldValue } = await import('firebase-admin/firestore');
        await db.collection('outreachLeads').doc(doc.id).update({
          status: 'contacted',
          outreachSent: true,
          outreachSentAt: new Date().toISOString(),
          outreachType: 'deepti-mom-2026',
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
