// B2B Outreach email — introducing My Sleepy Tale to local Toronto businesses
// POST /api/outreach-email { to: "email", businessName: "ABC Daycare", contactName: "Jane" }
// Sends a personalized outreach email introducing My Sleepy Tale as a partnership opportunity

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { escapeHtml, sanitizeEmail } from './_emailSanitize.js';

const FROM_EMAIL = 'hello@mysleepytale.com';
const ses = new SESClient({ region: 'us-east-1' });

function buildHtml(contactName, businessName) {
  const name = escapeHtml(contactName || 'there');
  const biz = escapeHtml(businessName || 'your organization');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#c8c3ba;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:48px;">🌙</span>
      <h1 style="color:#f0a500;font-size:22px;margin:12px 0 4px;letter-spacing:-0.5px;">My Sleepy Tale</h1>
      <p style="color:#6e6a63;font-size:13px;margin:0;">Bedtime stories that teach roots &amp; values</p>
    </div>

    <!-- Intro -->
    <div style="background:#12121c;border-radius:16px;padding:28px 24px;margin-bottom:24px;border:1px solid #1a1a28;">
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
        Hi <strong style="color:#f5f0e8;">${name}</strong>,
      </p>
      <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
        My name is Deepti, and I am the Co-Founder of <strong style="color:#f0a500;">My Sleepy Tale</strong> — and a parent of a 5-year-old here in downtown Toronto. We built a free platform of audio bedtime stories designed to help children learn about their cultural roots, moral values, and the world around them, all while drifting off to sleep.
      </p>
      <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
        As a parent myself, I know how hard it is to find bedtime content that is both calming and meaningful. That is exactly why we created My Sleepy Tale.
      </p>
      <p style="font-size:15px;line-height:1.7;margin:0;">
        I am reaching out to <strong style="color:#f5f0e8;">${biz}</strong> because I believe our mission aligns with the incredible work you do for families and children in our Toronto community.
      </p>
    </div>

    <!-- What is My Sleepy Tale -->
    <div style="background:#12121c;border-radius:16px;padding:28px 24px;margin-bottom:24px;border:1px solid #1a1a28;">
      <h2 style="color:#f0a500;font-size:16px;margin:0 0 16px;">What is My Sleepy Tale?</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px;text-align:center;background:#f0a50010;border-radius:12px;width:33%;">
            <div style="font-size:24px;margin-bottom:4px;">🎧</div>
            <div style="font-size:20px;font-weight:bold;color:#f0a500;">150+</div>
            <div style="font-size:11px;color:#6e6a63;">Audio Stories</div>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:12px;text-align:center;background:#f0a50010;border-radius:12px;width:33%;">
            <div style="font-size:24px;margin-bottom:4px;">🌍</div>
            <div style="font-size:20px;font-weight:bold;color:#f0a500;">20+</div>
            <div style="font-size:11px;color:#6e6a63;">Cultures</div>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:12px;text-align:center;background:#f0a50010;border-radius:12px;width:33%;">
            <div style="font-size:24px;margin-bottom:4px;">💛</div>
            <div style="font-size:20px;font-weight:bold;color:#f0a500;">100%</div>
            <div style="font-size:11px;color:#6e6a63;">Free</div>
          </td>
        </tr>
      </table>
      <p style="font-size:14px;line-height:1.7;margin:16px 0 0;">
        Our stories span <strong style="color:#f5f0e8;">Hindu, Islamic, Sikh, Christian, Buddhist, Indigenous</strong>, and many more traditions — helping children from all backgrounds feel seen and learn about each other. Available in <strong style="color:#f5f0e8;">English, French, and Spanish</strong>.
      </p>
    </div>

    <!-- Why partner -->
    <div style="background:#12121c;border-radius:16px;padding:28px 24px;margin-bottom:24px;border:1px solid #1a1a28;">
      <h2 style="color:#f0a500;font-size:16px;margin:0 0 16px;">How can we work together?</h2>
      <div style="margin-bottom:14px;">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <span style="font-size:18px;">📋</span>
          <div>
            <strong style="color:#f5f0e8;font-size:14px;">Share with families</strong>
            <p style="font-size:13px;margin:4px 0 0;color:#9a958d;">A free QR code flyer your families can scan to access stories instantly — no sign-up needed.</p>
          </div>
        </div>
      </div>
      <div style="margin-bottom:14px;">
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <span style="font-size:18px;">🤝</span>
          <div>
            <strong style="color:#f5f0e8;font-size:14px;">Community partnership</strong>
            <p style="font-size:13px;margin:4px 0 0;color:#9a958d;">Feature your organization on our platform as a community partner supporting multicultural education.</p>
          </div>
        </div>
      </div>
      <div>
        <div style="display:flex;align-items:flex-start;gap:12px;">
          <span style="font-size:18px;">🎤</span>
          <div>
            <strong style="color:#f5f0e8;font-size:14px;">Story collaboration</strong>
            <p style="font-size:13px;margin:4px 0 0;color:#9a958d;">We would love to feature stories that reflect your community — co-created or recommended by you.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:32px;">
      <a href="https://mysleepytale.com" style="display:inline-block;background:#f0a500;color:#0a0a0f;font-size:16px;font-weight:bold;padding:14px 36px;border-radius:50px;text-decoration:none;">
        Explore My Sleepy Tale
      </a>
      <p style="color:#6e6a63;font-size:12px;margin:12px 0 0;">
        100% free — no credit card, no catch
      </p>
    </div>

    <!-- Personal note -->
    <div style="background:#12121c;border-radius:16px;padding:28px 24px;margin-bottom:24px;border:1px solid #1a1a28;">
      <p style="font-size:14px;line-height:1.7;margin:0 0 12px;">
        I would love to connect over a quick call or coffee to explore how My Sleepy Tale can benefit the families you serve. I am based in downtown Toronto and happy to meet in person.
      </p>
      <p style="font-size:14px;line-height:1.7;margin:0;">
        Warm regards,<br>
        <strong style="color:#f5f0e8;">Deepti</strong><br>
        <span style="color:#6e6a63;">Co-Founder &amp; Parent, My Sleepy Tale</span><br>
        <a href="https://mysleepytale.com" style="color:#f0a500;text-decoration:none;">mysleepytale.com</a> · <a href="https://instagram.com/mysleepytale_official" style="color:#f0a500;text-decoration:none;">@mysleepytale_official</a>
      </p>
    </div>

    <!-- Footer -->
    <p style="color:#4a4a5a;font-size:11px;text-align:center;margin-top:32px;">
      My Sleepy Tale · Toronto, Canada<br>
      <span style="color:#6e6a63;">Bedtime stories that teach roots &amp; values</span>
    </p>
  </div>
</body>
</html>`;
}

function buildText(contactName, businessName) {
  const name = contactName || 'there';
  const biz = businessName || 'your organization';

  return `Hi ${name},

My name is Deepti, and I am the Co-Founder of My Sleepy Tale — and a parent of a 5-year-old here in downtown Toronto. We built a free platform of audio bedtime stories designed to help children learn about their cultural roots, moral values, and the world around them, all while drifting off to sleep.

As a parent myself, I know how hard it is to find bedtime content that is both calming and meaningful. That is exactly why we created My Sleepy Tale.

I am reaching out to ${biz} because I believe our mission aligns with the incredible work you do for families and children in our Toronto community.

WHAT IS MY SLEEPY TALE?
- 150+ audio bedtime stories spanning 20+ cultures
- Hindu, Islamic, Sikh, Christian, Buddhist, Indigenous and more
- Available in English, French, and Spanish
- 100% free — no credit card, no catch

HOW CAN WE WORK TOGETHER?

1. Share with families — A free QR code flyer your families can scan to access stories instantly.
2. Community partnership — Feature your organization on our platform as a community partner.
3. Story collaboration — We would love to feature stories that reflect your community.

Explore: https://mysleepytale.com

I would love to connect over a quick call or coffee to explore how My Sleepy Tale can benefit the families you serve. I am based in downtown Toronto and happy to meet in person.

Warm regards,
Deepti
Co-Founder & Parent, My Sleepy Tale
mysleepytale.com | @mysleepytale_official`;
}

async function sendEmail(to, contactName, businessName) {
  const subject = `My Sleepy Tale — Free bedtime stories for the families you serve`;
  const cmd = new SendEmailCommand({
    Source: `Deepti from My Sleepy Tale <${FROM_EMAIL}>`,
    Destination: { ToAddresses: [to], CcAddresses: ['i@yprateek.com'] },
    Message: {
      Subject: { Data: subject },
      Body: {
        Text: { Data: buildText(contactName, businessName) },
        Html: { Data: buildHtml(contactName, businessName) },
      },
    },
  });
  return ses.send(cmd);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { to, contactName, businessName, force } = req.body || {};
  if (!to) return res.status(400).json({ error: 'Missing "to" email' });

  const toEmail = sanitizeEmail(to);

  try {
    const db = await getFirestore();

    // Check if already sent (skip with force: true)
    if (db && !force) {
      const sentDoc = await db.collection('config').doc('outreachEmailsSent').get();
      const alreadySent = sentDoc.exists ? (sentDoc.data().emails || []) : [];
      if (alreadySent.includes(toEmail)) {
        return res.json({ sent: false, to: toEmail, message: 'Already sent outreach to this email' });
      }
    }

    await sendEmail(toEmail, contactName, businessName);

    // Track sent email
    if (db) {
      const { FieldValue } = await import('firebase-admin/firestore');
      await db.collection('config').doc('outreachEmailsSent').set({
        emails: FieldValue.arrayUnion(toEmail),
        lastSent: new Date().toISOString(),
        [`log_${Date.now()}`]: { email: toEmail, businessName: businessName || '', contactName: contactName || '', sentAt: new Date().toISOString() },
      }, { merge: true });
    }

    return res.json({ sent: true, to: toEmail });
  } catch (e) {
    console.error('[outreach-email] Error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
