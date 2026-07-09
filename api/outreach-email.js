// B2B/B2C Outreach email — AIDA framework (4-email sequence)
// POST /api/outreach-email { to, contactName, businessName, stage: 1|2|3|4, leadId }
// stage 1 = Awareness, 2 = Interest, 3 = Desire, 4 = Action
// Works for: daycares, schools, parents, STEM programs, kids activities, camps, anyone in childcare

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { escapeHtml, sanitizeEmail } from './_emailSanitize.js';
import { getFirestore } from './_firebase.js';

const FROM_EMAIL = 'hello@mysleepytale.com';
const ses = new SESClient({ region: 'us-east-1' });

const STAGES = {
  1: { label: 'Awareness', subject: () => `Free bedtime stories for kids — introducing My Sleepy Tale` },
  2: { label: 'Interest', subject: (biz) => `How ${biz} can bring free multicultural stories to families` },
  3: { label: 'Desire', subject: () => `Parents and kids are loving My Sleepy Tale — here's why` },
  4: { label: 'Action', subject: (biz) => `Let's work together — free resources for ${biz}` },
};

function header() {
  return `<div style="text-align:center;margin-bottom:32px;">
  <span style="font-size:48px;">🌙</span>
  <h1 style="color:#f0a500;font-size:22px;margin:12px 0 4px;letter-spacing:-0.5px;">My Sleepy Tale</h1>
  <p style="color:#6e6a63;font-size:13px;margin:0;">Bedtime stories that teach roots &amp; values</p>
</div>`;
}

function footer() {
  return `<p style="color:#4a4a5a;font-size:11px;text-align:center;margin-top:32px;">
  My Sleepy Tale · <a href="https://mysleepytale.com" style="color:#6e6a63;text-decoration:none;">mysleepytale.com</a><br>
  <a href="https://mysleepytale.com/unsubscribe" style="color:#6e6a63;">Unsubscribe</a>
</p>`;
}

function card(content) {
  return `<div style="background:#12121c;border-radius:16px;padding:28px 24px;margin-bottom:24px;border:1px solid #1a1a28;">${content}</div>`;
}

function cta(text, url) {
  return `<div style="text-align:center;margin-bottom:32px;">
  <a href="${url}" style="display:inline-block;background:#f0a500;color:#0a0a0f;font-size:16px;font-weight:bold;padding:14px 36px;border-radius:50px;text-decoration:none;">${text}</a>
</div>`;
}

function signature() {
  return card(`<p style="font-size:14px;line-height:1.7;margin:0;">
  Warm regards,<br>
  <strong style="color:#f5f0e8;">Deepti</strong><br>
  <span style="color:#6e6a63;">Co-Founder &amp; Parent, My Sleepy Tale</span><br>
  <a href="https://mysleepytale.com" style="color:#f0a500;text-decoration:none;">mysleepytale.com</a> · <a href="https://instagram.com/mysleepytale_official" style="color:#f0a500;text-decoration:none;">@mysleepytale_official</a>
</p>`);
}

function wrap(body) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#c8c3ba;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    ${header()}
    ${body}
    ${signature()}
    ${footer()}
  </div>
</body></html>`;
}

// ═══════════════════════════════════════
// STAGE 1: AWARENESS — Who we are
// ═══════════════════════════════════════
function stage1Html(name, biz) {
  return wrap(`
    ${card(`
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Hi <strong style="color:#f5f0e8;">${name}</strong>,</p>
      <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
        My name is Deepti, Co-Founder of <strong style="color:#f0a500;">My Sleepy Tale</strong> — and a parent myself. We created a free platform of audio bedtime stories that help children learn about their cultural roots, moral values, and the world around them, all while drifting off to sleep.
      </p>
      <p style="font-size:15px;line-height:1.7;margin:0;">
        Whether you are a parent looking for meaningful screen-free bedtime content, run a daycare, teach at a school, lead a STEM program, or organize kids' activities — <strong style="color:#f5f0e8;">My Sleepy Tale is built for you and the children you care about</strong>.
      </p>
    `)}

    ${card(`
      <h2 style="color:#f0a500;font-size:16px;margin:0 0 16px;">What is My Sleepy Tale?</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px;text-align:center;background:#f0a50010;border-radius:12px;width:33%;">
            <div style="font-size:24px;margin-bottom:4px;">🎧</div>
            <div style="font-size:20px;font-weight:bold;color:#f0a500;">200+</div>
            <div style="font-size:11px;color:#6e6a63;">Audio Stories</div>
          </td>
          <td style="width:8px;"></td>
          <td style="padding:12px;text-align:center;background:#f0a50010;border-radius:12px;width:33%;">
            <div style="font-size:24px;margin-bottom:4px;">🌍</div>
            <div style="font-size:20px;font-weight:bold;color:#f0a500;">20+</div>
            <div style="font-size:11px;color:#6e6a63;">Cultures &amp; Beliefs</div>
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
        Stories spanning <strong style="color:#f5f0e8;">Hindu, Islamic, Sikh, Christian, Buddhist, Indigenous, Filipino</strong>, and many more traditions — perfect for <strong style="color:#f5f0e8;">bedtime, quiet time, car rides, or classroom wind-down</strong>. Available in <strong style="color:#f5f0e8;">English, French, and Spanish</strong>.
      </p>
    `)}

    ${card(`
      <h2 style="color:#f0a500;font-size:16px;margin:0 0 16px;">Perfect For</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;vertical-align:top;width:50%;">
            <span style="font-size:16px;">👨‍👩‍👧</span> <span style="font-size:13px;color:#f5f0e8;">Parents &amp; Families</span>
          </td>
          <td style="padding:8px 0;vertical-align:top;width:50%;">
            <span style="font-size:16px;">🏫</span> <span style="font-size:13px;color:#f5f0e8;">Schools &amp; Classrooms</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;">
            <span style="font-size:16px;">🧒</span> <span style="font-size:13px;color:#f5f0e8;">Daycares &amp; Preschools</span>
          </td>
          <td style="padding:8px 0;vertical-align:top;">
            <span style="font-size:16px;">⛺</span> <span style="font-size:13px;color:#f5f0e8;">Summer Camps</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;">
            <span style="font-size:16px;">🔬</span> <span style="font-size:13px;color:#f5f0e8;">STEM &amp; Learning Centers</span>
          </td>
          <td style="padding:8px 0;vertical-align:top;">
            <span style="font-size:16px;">🎨</span> <span style="font-size:13px;color:#f5f0e8;">Kids Activities &amp; Clubs</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;vertical-align:top;">
            <span style="font-size:16px;">🏥</span> <span style="font-size:13px;color:#f5f0e8;">Pediatric &amp; Family Wellness</span>
          </td>
          <td style="padding:8px 0;vertical-align:top;">
            <span style="font-size:16px;">📚</span> <span style="font-size:13px;color:#f5f0e8;">Libraries &amp; Bookstores</span>
          </td>
        </tr>
      </table>
    `)}

    ${cta('Explore My Sleepy Tale', 'https://mysleepytale.com')}
  `);
}

function stage1Text(name, biz) {
  return `Hi ${name},

My name is Deepti, Co-Founder of My Sleepy Tale — and a parent myself. We created a free platform of 200+ audio bedtime stories that help children learn about their cultural roots, moral values, and the world around them.

Whether you are a parent, run a daycare, teach at a school, lead a STEM program, or organize kids' activities — My Sleepy Tale is built for you and the children you care about.

WHAT IS MY SLEEPY TALE?
- 200+ audio bedtime stories spanning 20+ cultures & beliefs
- Hindu, Islamic, Sikh, Christian, Buddhist, Indigenous, Filipino and more
- Perfect for bedtime, quiet time, car rides, or classroom wind-down
- Available in English, French, and Spanish
- 100% free — no credit card, no catch

PERFECT FOR: Parents, Schools, Daycares, Summer Camps, STEM Centers, Kids Activities, Pediatric Offices, Libraries

Explore: https://mysleepytale.com

Warm regards,
Deepti
Co-Founder & Parent, My Sleepy Tale
mysleepytale.com | @mysleepytale_official`;
}

// ═══════════════════════════════════════
// STAGE 2: INTEREST — What we offer
// ═══════════════════════════════════════
function stage2Html(name, biz) {
  return wrap(`
    ${card(`
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Hi <strong style="color:#f5f0e8;">${name}</strong>,</p>
      <p style="font-size:15px;line-height:1.7;margin:0;">
        I recently shared about <strong style="color:#f0a500;">My Sleepy Tale</strong> — our free multicultural bedtime stories. I wanted to share a few ways <strong style="color:#f5f0e8;">${biz}</strong> could use it to bring something special to the children and families around you.
      </p>
    `)}

    ${card(`
      <h2 style="color:#f0a500;font-size:16px;margin:0 0 20px;">What You Can Do With My Sleepy Tale</h2>

      <div style="margin-bottom:18px;display:flex;align-items:flex-start;gap:12px;">
        <span style="font-size:24px;">📋</span>
        <div>
          <strong style="color:#f5f0e8;font-size:14px;">Share with Families</strong>
          <p style="font-size:13px;margin:4px 0 0;color:#9a958d;">Free QR code flyers that families can scan to instantly access stories — no sign-up, no download. Great for waiting areas, classrooms, newsletters, or take-home bags.</p>
        </div>
      </div>

      <div style="margin-bottom:18px;display:flex;align-items:flex-start;gap:12px;">
        <span style="font-size:24px;">🎓</span>
        <div>
          <strong style="color:#f5f0e8;font-size:14px;">Use in Programs</strong>
          <p style="font-size:13px;margin:4px 0 0;color:#9a958d;">Perfect for wind-down time at camps, rest period at daycares, story time at libraries, or cultural awareness activities in schools and STEM programs.</p>
        </div>
      </div>

      <div style="margin-bottom:18px;display:flex;align-items:flex-start;gap:12px;">
        <span style="font-size:24px;">🤝</span>
        <div>
          <strong style="color:#f5f0e8;font-size:14px;">Community Partner Feature</strong>
          <p style="font-size:13px;margin:4px 0 0;color:#9a958d;">We'd love to feature your organization on our platform as a community partner supporting multicultural education and child development.</p>
        </div>
      </div>

      <div style="display:flex;align-items:flex-start;gap:12px;">
        <span style="font-size:24px;">🎤</span>
        <div>
          <strong style="color:#f5f0e8;font-size:14px;">Custom Story Collaboration</strong>
          <p style="font-size:13px;margin:4px 0 0;color:#9a958d;">We can create stories that reflect your community — co-created or inspired by the children and families you serve.</p>
        </div>
      </div>
    `)}

    <div style="background:#f0a50015;border:1px solid #f0a50030;border-radius:16px;padding:20px 24px;margin-bottom:24px;text-align:center;">
      <p style="font-size:14px;color:#f0a500;font-weight:bold;margin:0 0 8px;">Everything is completely free</p>
      <p style="font-size:13px;color:#9a958d;margin:0;">No cost to you, no cost to families. We're a mission-driven platform.</p>
    </div>

    ${cta('See Our Stories', 'https://mysleepytale.com')}
  `);
}

function stage2Text(name, biz) {
  return `Hi ${name},

I recently shared about My Sleepy Tale — our free multicultural bedtime stories. Here's how ${biz} could use it:

1. Share with Families — Free QR flyers families can scan to access stories instantly. Great for waiting areas, classrooms, newsletters, or take-home bags.

2. Use in Programs — Perfect for wind-down time at camps, rest period at daycares, story time at libraries, or cultural awareness in STEM programs.

3. Community Partner Feature — We'd feature your organization on our platform.

4. Custom Story Collaboration — We can create stories reflecting your community.

Everything is completely free. No cost to you, no cost to families.

Explore: https://mysleepytale.com

Warm regards,
Deepti
Co-Founder & Parent, My Sleepy Tale`;
}

// ═══════════════════════════════════════
// STAGE 3: DESIRE — Social proof & impact
// ═══════════════════════════════════════
function stage3Html(name, biz) {
  return wrap(`
    ${card(`
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Hi <strong style="color:#f5f0e8;">${name}</strong>,</p>
      <p style="font-size:15px;line-height:1.7;margin:0;">
        I wanted to share what families and educators are saying about <strong style="color:#f0a500;">My Sleepy Tale</strong> — the response has been truly heartwarming.
      </p>
    `)}

    ${card(`
      <h2 style="color:#f0a500;font-size:16px;margin:0 0 20px;">What People Are Saying</h2>

      <div style="border-left:3px solid #f0a500;padding:12px 16px;margin-bottom:16px;background:#f0a50008;border-radius:0 12px 12px 0;">
        <p style="font-size:14px;line-height:1.7;margin:0 0 8px;font-style:italic;color:#f5f0e8;">
          "My daughter asks for a Sleepy Tale every night now. She loves learning about Diwali and Eid — and she talks about her friends' cultures the next day."
        </p>
        <p style="font-size:12px;color:#6e6a63;margin:0;">— Parent</p>
      </div>

      <div style="border-left:3px solid #f0a500;padding:12px 16px;margin-bottom:16px;background:#f0a50008;border-radius:0 12px 12px 0;">
        <p style="font-size:14px;line-height:1.7;margin:0 0 8px;font-style:italic;color:#f5f0e8;">
          "Finally — bedtime stories that are screen-free, calming, and actually teach good values. This is exactly what families need."
        </p>
        <p style="font-size:12px;color:#6e6a63;margin:0;">— Educator</p>
      </div>

      <div style="border-left:3px solid #f0a500;padding:12px 16px;background:#f0a50008;border-radius:0 12px 12px 0;">
        <p style="font-size:14px;line-height:1.7;margin:0 0 8px;font-style:italic;color:#f5f0e8;">
          "We play the stories during rest time at our center. The kids are calmer, and parents love that they're learning about different cultures."
        </p>
        <p style="font-size:12px;color:#6e6a63;margin:0;">— Childcare Provider</p>
      </div>
    `)}

    ${card(`
      <h2 style="color:#f0a500;font-size:16px;margin:0 0 16px;">Our Growing Impact</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:16px;text-align:center;background:#f0a50010;border-radius:12px;width:25%;">
            <div style="font-size:22px;font-weight:bold;color:#f0a500;">200+</div>
            <div style="font-size:10px;color:#6e6a63;margin-top:4px;">Stories</div>
          </td>
          <td style="width:6px;"></td>
          <td style="padding:16px;text-align:center;background:#f0a50010;border-radius:12px;width:25%;">
            <div style="font-size:22px;font-weight:bold;color:#f0a500;">20+</div>
            <div style="font-size:10px;color:#6e6a63;margin-top:4px;">Cultures</div>
          </td>
          <td style="width:6px;"></td>
          <td style="padding:16px;text-align:center;background:#f0a50010;border-radius:12px;width:25%;">
            <div style="font-size:22px;font-weight:bold;color:#f0a500;">3</div>
            <div style="font-size:10px;color:#6e6a63;margin-top:4px;">Languages</div>
          </td>
          <td style="width:6px;"></td>
          <td style="padding:16px;text-align:center;background:#48bb7810;border-radius:12px;width:25%;">
            <div style="font-size:22px;font-weight:bold;color:#48bb78;">Free</div>
            <div style="font-size:10px;color:#6e6a63;margin-top:4px;">Forever</div>
          </td>
        </tr>
      </table>
    `)}

    <div style="background:#f0a50015;border:1px solid #f0a50030;border-radius:16px;padding:20px 24px;margin-bottom:24px;text-align:center;">
      <p style="font-size:14px;color:#f0a500;font-weight:bold;margin:0 0 4px;">Used by families, daycares, schools &amp; camps</p>
      <p style="font-size:13px;color:#9a958d;margin:0;">across the US and Canada</p>
    </div>

    ${cta('Listen to a Story', 'https://mysleepytale.com')}
  `);
}

function stage3Text(name, biz) {
  return `Hi ${name},

I wanted to share what families and educators are saying about My Sleepy Tale:

"My daughter asks for a Sleepy Tale every night. She loves learning about Diwali and Eid." — Parent

"Finally — bedtime stories that are screen-free, calming, and teach good values." — Educator

"We play stories during rest time. Kids are calmer, parents love the cultural learning." — Childcare Provider

OUR IMPACT: 200+ stories, 20+ cultures, 3 languages, free forever.
Used by families, daycares, schools & camps across the US and Canada.

Listen: https://mysleepytale.com

I truly believe the families at ${biz} would love this. Happy to chat anytime.

Deepti
Co-Founder & Parent, My Sleepy Tale`;
}

// ═══════════════════════════════════════
// STAGE 4: ACTION — Partnership CTA
// ═══════════════════════════════════════
function stage4Html(name, biz) {
  return wrap(`
    ${card(`
      <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">Hi <strong style="color:#f5f0e8;">${name}</strong>,</p>
      <p style="font-size:15px;line-height:1.7;margin:0;">
        This is my last note — I don't want to fill your inbox! I just wanted to make one final offer to <strong style="color:#f5f0e8;">${biz}</strong>.
      </p>
    `)}

    <div style="background:#f0a50015;border:2px solid #f0a50040;border-radius:16px;padding:28px 24px;margin-bottom:24px;">
      <h2 style="color:#f0a500;font-size:18px;margin:0 0 20px;text-align:center;">What We'll Provide — All Free</h2>

      <div style="margin-bottom:14px;display:flex;align-items:flex-start;gap:10px;">
        <span style="color:#48bb78;font-size:18px;">✓</span>
        <p style="font-size:14px;margin:0;line-height:1.6;"><strong style="color:#f5f0e8;">Free QR flyers</strong> — printed and shipped to your location, ready to share with families</p>
      </div>
      <div style="margin-bottom:14px;display:flex;align-items:flex-start;gap:10px;">
        <span style="color:#48bb78;font-size:18px;">✓</span>
        <p style="font-size:14px;margin:0;line-height:1.6;"><strong style="color:#f5f0e8;">Featured partner listing</strong> — on mysleepytale.com for your community to see</p>
      </div>
      <div style="margin-bottom:14px;display:flex;align-items:flex-start;gap:10px;">
        <span style="color:#48bb78;font-size:18px;">✓</span>
        <p style="font-size:14px;margin:0;line-height:1.6;"><strong style="color:#f5f0e8;">Custom stories</strong> — reflecting your community, culture, or program theme</p>
      </div>
      <div style="display:flex;align-items:flex-start;gap:10px;">
        <span style="color:#48bb78;font-size:18px;">✓</span>
        <p style="font-size:14px;margin:0;line-height:1.6;"><strong style="color:#f5f0e8;">Social media feature</strong> — showcasing your work to our growing parent community</p>
      </div>
    </div>

    ${card(`
      <p style="font-size:15px;font-weight:bold;color:#f5f0e8;margin:0 0 8px;text-align:center;">100% free. No cost, no strings, no catch.</p>
      <p style="font-size:13px;color:#9a958d;margin:0;text-align:center;">We're a mission-driven platform built by parents who believe every child deserves stories that reflect who they are.</p>
    `)}

    ${cta("Let's Work Together", `mailto:hello@mysleepytale.com?subject=Partnership%20with%20${encodeURIComponent(biz)}`)}

    ${card(`
      <p style="font-size:14px;line-height:1.7;margin:0;">
        Even if the timing isn't right, I hope you'll check out <a href="https://mysleepytale.com" style="color:#f0a500;">mysleepytale.com</a> — it could be a wonderful resource for the children and families in your life.
      </p>
    `)}
  `);
}

function stage4Text(name, biz) {
  return `Hi ${name},

This is my last note — I don't want to fill your inbox! One final offer for ${biz}:

WHAT WE'LL PROVIDE (ALL FREE):
✓ Free QR flyers — printed and shipped to your location
✓ Featured partner listing — on mysleepytale.com
✓ Custom stories — reflecting your community or program
✓ Social media feature — showcasing your work to parents

100% free. No cost, no strings, no catch.

Just reply to this email to get started, or visit: https://mysleepytale.com

Even if the timing isn't right, it could be a wonderful resource for the children and families in your life.

Warmly,
Deepti
Co-Founder & Parent, My Sleepy Tale
mysleepytale.com | @mysleepytale_official`;
}

// ═══════════════════════════════════════
// Template router
// ═══════════════════════════════════════
const TEMPLATES = {
  1: { html: stage1Html, text: stage1Text },
  2: { html: stage2Html, text: stage2Text },
  3: { html: stage3Html, text: stage3Text },
  4: { html: stage4Html, text: stage4Text },
};

async function sendEmail(to, contactName, businessName, stage) {
  const s = Number(stage) || 1;
  const name = escapeHtml(contactName || 'there');
  const biz = escapeHtml(businessName || 'your organization');
  const template = TEMPLATES[s] || TEMPLATES[1];
  const stageInfo = STAGES[s] || STAGES[1];

  const cmd = new SendEmailCommand({
    Source: `Deepti from My Sleepy Tale <${FROM_EMAIL}>`,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: stageInfo.subject(businessName || 'your organization') },
      Body: {
        Text: { Data: template.text(name, biz) },
        Html: { Data: template.html(name, biz) },
      },
    },
  });
  return ses.send(cmd);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { to, contactName, businessName, stage, leadId, force } = req.body || {};
  if (!to) return res.status(400).json({ error: 'Missing "to" email' });

  const s = Number(stage) || 1;
  if (s < 1 || s > 4) return res.status(400).json({ error: 'stage must be 1-4' });

  const toEmail = sanitizeEmail(to);
  const stageLabel = STAGES[s].label;

  try {
    const db = await getFirestore();

    // Check duplicate: same email + same stage
    if (db && !force) {
      const sentDoc = await db.collection('config').doc('outreachEmailsSent').get();
      const sentLog = sentDoc.exists ? (sentDoc.data() || {}) : {};
      for (const [key, val] of Object.entries(sentLog)) {
        if (key.startsWith('log_') && val.email === toEmail && val.stage === s) {
          return res.json({ sent: false, to: toEmail, stage: s, message: `Already sent ${stageLabel} email to this contact` });
        }
      }
    }

    await sendEmail(toEmail, contactName, businessName, s);

    // Track in Firestore
    if (db) {
      const { FieldValue } = await import('firebase-admin/firestore');

      await db.collection('config').doc('outreachEmailsSent').set({
        emails: FieldValue.arrayUnion(toEmail),
        lastSent: new Date().toISOString(),
        [`log_${Date.now()}`]: {
          email: toEmail,
          businessName: businessName || '',
          contactName: contactName || '',
          stage: s,
          stageLabel,
          sentAt: new Date().toISOString(),
        },
      }, { merge: true });

      // Update lead document with stage tracking
      if (leadId) {
        const updates = {
          outreachStage: s,
          [`stage${s}SentAt`]: new Date().toISOString(),
          outreachSent: true,
          outreachSentAt: new Date().toISOString(),
          status: 'contacted',
        };
        await db.collection('outreachLeads').doc(leadId).update(updates);
      }
    }

    return res.json({ sent: true, to: toEmail, stage: s, stageLabel });
  } catch (e) {
    console.error('[outreach-email] Error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
