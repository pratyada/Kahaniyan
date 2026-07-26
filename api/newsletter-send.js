// Email Newsletter Agent — AI-generated branded newsletters
// POST /api/newsletter-send { mode: 'generate'|'save'|'test'|'sendAll'|'history'|'recipients', ... }

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { escapeHtml, sanitizeEmail } from './_emailSanitize.js';
import { getFirestore, FOUNDER_EMAILS } from './_firebase.js';
import { canSendEmail, logEmail, isUnsubscribed } from './_emailThrottle.js';

const FROM_EMAIL = 'hello@mysleepytale.com';
const ses = new SESClient({ region: 'us-east-1' });
const TEST_EMAILS = [...FOUNDER_EMAILS, 'musee.initialize@gmail.com'];
// Default storybook hero for generated newsletters (see kahaniyan/NEWSLETTER-STYLE.md)
const DEFAULT_HERO = 'https://mysleepytale.com/og/newsletter-hero.jpg';

// ═══════════════════════════════════════
// Email template helpers (MySleepyTale branded)
// ═══════════════════════════════════════

function wrapNewsletter(title, body) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#c8c3ba;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <span style="font-size:48px;">🌙</span>
    <h1 style="color:#f0a500;font-size:22px;margin:12px 0 4px;letter-spacing:-0.5px;">${escapeHtml(title)}</h1>
    <p style="color:#6e6a63;font-size:13px;margin:0;">My Sleepy Tale</p>
  </div>
  ${body}
  <div style="text-align:center;margin-top:32px;">
    <p style="color:#6e6a63;font-size:12px;margin:0 0 8px;">
      <a href="https://mysleepytale.com" style="color:#f0a500;text-decoration:none;">mysleepytale.com</a> · <a href="https://instagram.com/mysleepytale_official" style="color:#f0a500;text-decoration:none;">@mysleepytale_official</a>
    </p>
    <p style="color:#4a4a5a;font-size:10px;margin:0;">
      You're receiving this because you signed up at mysleepytale.com.<br/>
      <a href="https://mysleepytale.com/settings?unsubscribe=true" style="color:#6e6a63;">Unsubscribe</a>
    </p>
  </div>
</div></body></html>`;
}

function card(content) {
  return `<div style="background:#12121c;border-radius:16px;padding:28px 24px;margin-bottom:24px;border:1px solid #1a1a28;">${content}</div>`;
}

function ctaButton(text, url) {
  return `<div style="text-align:center;margin:24px 0;">
  <a href="${url}" style="display:inline-block;background:#f0a500;color:#0a0a0f;font-size:16px;font-weight:bold;padding:14px 36px;border-radius:50px;text-decoration:none;">${escapeHtml(text)}</a>
</div>`;
}

function highlightBox(content) {
  return `<div style="background:#f0a50015;border:1px solid #f0a50030;border-radius:16px;padding:20px 24px;margin-bottom:24px;text-align:center;">${content}</div>`;
}

// ═══════════════════════════════════════
// AI content generation
// ═══════════════════════════════════════

async function generateContent(prompt) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not configured');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: `You write email newsletters for My Sleepy Tale — a free platform with 200+ audio bedtime stories for kids spanning 20+ cultural traditions (Hindu, Islamic, Sikh, Christian, Buddhist, Indigenous, Filipino, and more) in English, French, and Spanish.

Rules:
- Never say "app" — say "platform" or "web space"
- Keep tone warm, genuine, parent-friendly
- Use gentle, positive language suitable for a children's brand
- Be concise — newsletters should be scannable, not walls of text

Return ONLY valid JSON with this exact structure:
{
  "subject": "email subject line (under 60 chars, include 🌙 emoji)",
  "headline": "main headline for the email",
  "intro": "1-2 sentence warm intro paragraph",
  "sections": [
    {
      "emoji": "relevant emoji",
      "title": "section title",
      "body": "section content (1-3 sentences)"
    }
  ],
  "ctaText": "call to action button text",
  "ctaUrl": "https://mysleepytale.com or relevant URL",
  "closing": "1 sentence warm closing"
}

Generate 2-4 sections. Make the content specific to what was announced.`,
      messages: [{ role: 'user', content: `Write a newsletter about: ${prompt}` }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error: ${res.status} ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Failed to parse AI response');
  return JSON.parse(match[0]);
}

// Storybook FORMAT (see kahaniyan/NEWSLETTER-STYLE.md): hero image → intro →
// visual 2-col equal-size icon "tip diagram" → CTA → sign-off from {sender}.
function sectionCard(s) {
  return `<td width="50%" valign="top" style="padding:8px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#15151f;border:1px solid #1a1a28;border-radius:14px;"><tr><td valign="top" style="padding:18px 16px;height:150px;text-align:center;">
      <div style="font-size:34px;line-height:1;">${s.emoji || '✨'}</div>
      <div style="font-family:Georgia,serif;font-weight:700;font-size:15px;color:#f5f0e8;margin:8px 0 5px;">${escapeHtml(s.title)}</div>
      <div style="font-size:12.5px;line-height:1.5;color:#b8b3aa;">${escapeHtml(s.body)}</div>
    </td></tr></table></td>`;
}

function buildHtmlFromContent(content, sender) {
  const sections = content.sections || [];
  let rows = '';
  for (let i = 0; i < sections.length; i += 2) {
    const a = sectionCard(sections[i]);
    const b = sections[i + 1] ? sectionCard(sections[i + 1]) : '<td width="50%"></td>';
    rows += `<tr>${a}${b}</tr>`;
  }
  const diagram = sections.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">${rows}</table>`
    : '';
  const who = escapeHtml(sender || 'The My Sleepy Tale Team');

  const body = `
    <img src="${DEFAULT_HERO}" alt="My Sleepy Tale" width="600" style="display:block;width:100%;max-width:600px;border-radius:18px;border:0;margin:0 0 20px;">
    <p style="font-size:16px;line-height:1.7;margin:0 0 20px;color:#c8c3ba;">${escapeHtml(content.intro)}</p>
    ${diagram}
    ${content.closing ? highlightBox(`<p style="font-size:14px;color:#f0a500;font-weight:bold;margin:0;">${escapeHtml(content.closing)}</p>`) : ''}
    ${ctaButton(content.ctaText || 'Explore Stories', content.ctaUrl || 'https://mysleepytale.com')}
    <p style="font-size:15px;line-height:1.65;margin:8px 0 0;color:#c8c3ba;">
      Warm regards,<br><strong style="color:#f5f0e8;">— ${who}</strong><br><span style="color:#8a857d;">My Sleepy Tale</span>
    </p>`;

  return wrapNewsletter(content.headline || 'My Sleepy Tale', body);
}

function buildTextFromContent(content, sender) {
  const sections = (content.sections || []).map(s =>
    `${s.emoji || '•'} ${s.title}\n  ${s.body}`
  ).join('\n\n');
  const who = sender || 'The My Sleepy Tale Team';

  return `${content.headline || 'My Sleepy Tale'}

${content.intro}

${sections}

${content.closing || ''}

${content.ctaText || 'Explore'}: ${content.ctaUrl || 'https://mysleepytale.com'}

Warm regards,
— ${who}
My Sleepy Tale
mysleepytale.com

Unsubscribe: https://mysleepytale.com/settings?unsubscribe=true`;
}

// ═══════════════════════════════════════
// SES send
// ═══════════════════════════════════════

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

// ═══════════════════════════════════════
// Handler
// ═══════════════════════════════════════

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { mode } = req.body || {};

  // ── GENERATE ──
  if (mode === 'generate') {
    const { prompt, sender } = req.body; // sender = who's publishing (e.g. "Raksha", "Prateek")
    if (!prompt) return res.status(400).json({ error: 'prompt required' });

    try {
      const content = await generateContent(prompt);
      const htmlContent = buildHtmlFromContent(content, sender);
      const textContent = buildTextFromContent(content, sender);
      return res.json({
        subject: content.subject,
        htmlContent,
        textContent,
        content, // raw structured content for reference
      });
    } catch (e) {
      console.error('[newsletter-send] Generate error:', e.message);
      return res.status(500).json({ error: e.message });
    }
  }

  // ── SAVE ──
  if (mode === 'save') {
    const { prompt, newsletterName, subject, htmlContent, textContent } = req.body;
    if (!newsletterName || !subject || !htmlContent) {
      return res.status(400).json({ error: 'newsletterName, subject, htmlContent required' });
    }

    const db = await getFirestore();
    if (!db) return res.status(500).json({ error: 'Firestore not available' });

    // Check unique name
    const existing = await db.collection('newsletters').where('name', '==', newsletterName).get();
    if (!existing.empty) {
      return res.status(409).json({ error: `Newsletter "${newsletterName}" already exists` });
    }

    const docRef = db.collection('newsletters').doc();
    const newsletter = {
      id: docRef.id,
      name: newsletterName,
      subject,
      prompt: prompt || '',
      htmlContent,
      textContent: textContent || '',
      status: 'draft',
      createdAt: new Date().toISOString(),
      sentAt: null,
      recipientCount: 0,
      sentCount: 0,
      failedCount: 0,
      throttledCount: 0,
    };
    await docRef.set(newsletter);
    return res.json({ newsletterId: docRef.id, newsletter });
  }

  // ── TEST ──
  if (mode === 'test') {
    const { newsletterId } = req.body;
    if (!newsletterId) return res.status(400).json({ error: 'newsletterId required' });

    const db = await getFirestore();
    if (!db) return res.status(500).json({ error: 'Firestore not available' });

    const nlDoc = await db.collection('newsletters').doc(newsletterId).get();
    if (!nlDoc.exists) return res.status(404).json({ error: 'Newsletter not found' });

    const nl = nlDoc.data();
    const results = [];

    for (const testEmail of TEST_EMAILS) {
      try {
        await sendEmail(testEmail, `[TEST] ${nl.subject}`, nl.htmlContent, nl.textContent);
        results.push({ email: testEmail, status: 'sent' });
      } catch (e) {
        results.push({ email: testEmail, status: 'failed', error: e.message });
      }
    }

    await db.collection('newsletters').doc(newsletterId).update({ status: 'test-sent' });
    return res.json({ results });
  }

  // ── SEND ALL ──
  if (mode === 'sendAll') {
    const { newsletterId } = req.body;
    if (!newsletterId) return res.status(400).json({ error: 'newsletterId required' });

    const db = await getFirestore();
    if (!db) return res.status(500).json({ error: 'Firestore not available' });

    const nlDoc = await db.collection('newsletters').doc(newsletterId).get();
    if (!nlDoc.exists) return res.status(404).json({ error: 'Newsletter not found' });

    const nl = nlDoc.data();

    // Prevent double-send
    if (nl.status === 'sent' || nl.status === 'sending') {
      return res.status(409).json({ error: `Newsletter already ${nl.status}` });
    }

    await db.collection('newsletters').doc(newsletterId).update({ status: 'sending' });

    try {
      // Get unsubscribed
      const unsubscribed = new Set();
      try {
        const unsubDoc = await db.collection('config').doc('newsletterUnsubscribed').get();
        if (unsubDoc.exists) {
          (unsubDoc.data().emails || []).forEach(e => unsubscribed.add(e.toLowerCase()));
        }
      } catch {}

      // Get all users
      const allEmails = [];
      try {
        const usersSnap = await db.collection('users').get();
        usersSnap.forEach(d => {
          const email = d.data().email?.toLowerCase();
          if (email && !unsubscribed.has(email)) allEmails.push(email);
        });
      } catch (e) {
        await db.collection('newsletters').doc(newsletterId).update({ status: 'test-sent' });
        return res.status(500).json({ error: 'Failed to fetch users: ' + e.message });
      }

      let sentCount = 0, failedCount = 0, throttledCount = 0;
      const batch = db.batch();
      const batchRecipients = [];

      for (const email of allEmails) {
        const throttle = await canSendEmail(email, 'marketing');
        if (!throttle.allowed) {
          throttledCount++;
          batchRecipients.push({
            newsletterId,
            newsletterName: nl.name,
            email,
            status: 'throttled',
            reason: throttle.reason,
            sentAt: new Date().toISOString(),
          });
          continue;
        }

        try {
          await sendEmail(email, nl.subject, nl.htmlContent, nl.textContent);
          await logEmail(email, 'newsletter-custom', 'marketing', nl.subject);
          sentCount++;
          batchRecipients.push({
            newsletterId,
            newsletterName: nl.name,
            email,
            status: 'sent',
            sentAt: new Date().toISOString(),
          });
        } catch (e) {
          failedCount++;
          batchRecipients.push({
            newsletterId,
            newsletterName: nl.name,
            email,
            status: 'failed',
            error: e.message,
            sentAt: new Date().toISOString(),
          });
        }
      }

      // Write recipient records
      for (const r of batchRecipients) {
        const ref = db.collection('newsletterRecipients').doc();
        batch.set(ref, r);
      }
      await batch.commit();

      // Update newsletter doc
      await db.collection('newsletters').doc(newsletterId).update({
        status: 'sent',
        sentAt: new Date().toISOString(),
        recipientCount: allEmails.length,
        sentCount,
        failedCount,
        throttledCount,
      });

      return res.json({ sentCount, failedCount, throttledCount, total: allEmails.length });
    } catch (e) {
      // Reset to test-sent so it can be retried
      await db.collection('newsletters').doc(newsletterId).update({ status: 'test-sent' }).catch(() => {});
      return res.status(500).json({ error: 'Send failed: ' + e.message });
    }
  }

  // ── DELETE ──
  if (mode === 'delete') {
    const { newsletterId } = req.body;
    if (!newsletterId) return res.status(400).json({ error: 'newsletterId required' });
    const db = await getFirestore();
    if (!db) return res.status(500).json({ error: 'Firestore not available' });
    await db.collection('newsletters').doc(newsletterId).delete();
    return res.json({ deleted: true, newsletterId });
  }

  // ── SEND ONE (custom recipient) ──
  if (mode === 'sendOne') {
    const { newsletterId, to } = req.body;
    if (!newsletterId || !to) return res.status(400).json({ error: 'newsletterId and to required' });

    const db = await getFirestore();
    if (!db) return res.status(500).json({ error: 'Firestore not available' });

    const nlDoc = await db.collection('newsletters').doc(newsletterId).get();
    if (!nlDoc.exists) return res.status(404).json({ error: 'Newsletter not found' });

    const nl = nlDoc.data();
    const toEmail = sanitizeEmail(to);

    try {
      await sendEmail(toEmail, nl.subject, nl.htmlContent, nl.textContent);
      return res.json({ sent: true, to: toEmail });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── HISTORY ──
  if (mode === 'history') {
    const db = await getFirestore();
    if (!db) return res.status(500).json({ error: 'Firestore not available' });

    const snap = await db.collection('newsletters').orderBy('createdAt', 'desc').limit(50).get();
    const newsletters = snap.docs.map(d => ({ id: d.id, ...d.data(), htmlContent: undefined })); // strip HTML for lighter response
    return res.json({ newsletters });
  }

  // ── RECIPIENTS ──
  if (mode === 'recipients') {
    const { newsletterId } = req.body;
    if (!newsletterId) return res.status(400).json({ error: 'newsletterId required' });

    const db = await getFirestore();
    if (!db) return res.status(500).json({ error: 'Firestore not available' });

    const snap = await db.collection('newsletterRecipients')
      .where('newsletterId', '==', newsletterId)
      .limit(500)
      .get();
    const recipients = snap.docs.map(d => d.data())
      .sort((a, b) => (b.sentAt || '').localeCompare(a.sentAt || ''));
    return res.json({ recipients });
  }

  return res.status(400).json({ error: 'Invalid mode. Use: generate, save, test, sendAll, history, recipients' });
}
