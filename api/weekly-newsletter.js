// Weekly newsletter
// POST /api/weekly-newsletter { sendAll: true } — sends to all non-unsubscribed users
// POST /api/weekly-newsletter { to: "email" } — single test send

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { getFirestore } from './_firebase.js';

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
  <p style="color:#4a4a5a;font-size:10px;text-align:center;margin-top:8px;">
    You're receiving this because you signed up at mysleepytale.com.<br/>
    <a href="https://mysleepytale.com/settings?unsubscribe=true" style="color:#f0a500;">Unsubscribe</a>
  </p>
</div></body></html>`;
}

async function getNewsletterContent() {
  const db = await getFirestore();
  let newStories = [];
  let featuredStory = null;

  if (db) {
    try {
      // Get stories published in the last 7 days
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const storiesSnap = await db.collection('creatorStories')
        .where('status', '==', 'published')
        .where('submittedAt', '>=', sevenDaysAgo)
        .orderBy('submittedAt', 'desc')
        .limit(10)
        .get();
      storiesSnap.forEach(d => newStories.push({ id: d.id, ...d.data() }));

      // Also check series
      const seriesSnap = await db.collection('creatorSeries')
        .where('status', '==', 'approved')
        .where('submittedAt', '>=', sevenDaysAgo)
        .orderBy('submittedAt', 'desc')
        .limit(5)
        .get();
      seriesSnap.forEach(d => newStories.push({ id: d.id, ...d.data(), isSeries: true }));

      // Featured story — most viewed from recent
      if (newStories.length > 0) {
        featuredStory = newStories.sort((a, b) => (b.views || 0) - (a.views || 0))[0];
      }
    } catch {}
  }

  return { newStories, featuredStory };
}

function buildNewsletterHtml(newStories, featuredStory) {
  const storyListHtml = newStories.length > 0
    ? newStories.slice(0, 6).map(s => {
        const link = s.isSeries
          ? `https://mysleepytale.com/series/${s.id}`
          : `https://mysleepytale.com`;
        return `<div style="padding:8px 0;border-bottom:1px solid #1a1a28;">
          <a href="${link}" style="color:#f0a500;font-size:14px;font-weight:bold;text-decoration:none;">${s.title}</a>
          <p style="font-size:12px;color:#6e6a63;margin:4px 0 0;">by ${s.authorName || 'Anonymous'}${s.isSeries ? ' · Series' : ''}</p>
        </div>`;
      }).join('')
    : '<p style="font-size:13px;color:#a8a39a;">Check back next week for fresh stories!</p>';

  const featuredHtml = featuredStory
    ? `<div style="background:#f0a50010;border:1px solid #f0a50030;border-radius:12px;padding:16px;margin-bottom:16px;">
        <p style="font-size:11px;color:#6e6a63;margin:0 0 4px;">FEATURED STORY OF THE WEEK</p>
        <p style="font-size:16px;font-weight:bold;color:#f0a500;margin:0 0 4px;">${featuredStory.title}</p>
        <p style="font-size:12px;color:#a8a39a;margin:0;">by ${featuredStory.authorName || 'Anonymous'}</p>
      </div>`
    : '';

  const tips = [
    'Try a calming voice when reading bedtime stories — it helps little ones wind down faster.',
    'Create a bedtime routine: story time, then lights out. Consistency is the secret ingredient.',
    'Let your child pick the story tonight — giving them a choice makes bedtime feel special.',
    'Dim the lights during story time. It signals the body that sleep is coming.',
    'Ask your child what they liked best about the story. It builds comprehension and connection.',
    'Play soft background music while listening to a bedtime story for an extra-cozy atmosphere.',
    'Revisiting a favourite story is great! Repetition helps children feel safe and secure.',
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];

  return wrap('This Week on My Sleepy Tale', `
    <p style="font-size:15px;line-height:1.7;margin:0 0 16px;">
      Here's what's new this week on My Sleepy Tale!
    </p>
    ${featuredHtml}
    <div style="margin-bottom:16px;">
      <p style="font-size:11px;color:#6e6a63;margin:0 0 8px;">NEW STORIES THIS WEEK</p>
      ${storyListHtml}
    </div>
    <div style="background:#12121c;border:1px solid #1a1a28;border-radius:12px;padding:16px;margin-bottom:16px;">
      <p style="font-size:11px;color:#6e6a63;margin:0 0 4px;">BEDTIME TIP OF THE WEEK</p>
      <p style="font-size:13px;color:#a8a39a;margin:0;line-height:1.6;">${tip}</p>
    </div>
    <div style="text-align:center;">
      <a href="https://mysleepytale.com" style="display:inline-block;background:#f0a500;color:#0a0a0f;font-size:14px;font-weight:bold;padding:12px 28px;border-radius:50px;text-decoration:none;">
        Explore Stories
      </a>
    </div>
  `);
}

function buildNewsletterText(newStories, featuredStory) {
  const storyList = newStories.length > 0
    ? newStories.slice(0, 6).map(s => `- ${s.title} by ${s.authorName || 'Anonymous'}`).join('\n')
    : 'Check back next week for fresh stories!';
  const featured = featuredStory ? `Featured: "${featuredStory.title}" by ${featuredStory.authorName || 'Anonymous'}` : '';
  return `This Week on My Sleepy Tale\n\n${featured}\n\nNew stories:\n${storyList}\n\nExplore: https://mysleepytale.com\n\nUnsubscribe: https://mysleepytale.com/settings?unsubscribe=true`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { sendAll, to } = req.body || {};

  if (!sendAll && !to) {
    return res.status(400).json({ error: 'Provide sendAll: true or to: "email"' });
  }

  const { newStories, featuredStory } = await getNewsletterContent();
  const subject = 'This Week on My Sleepy Tale 🌙';
  const html = buildNewsletterHtml(newStories, featuredStory);
  const text = buildNewsletterText(newStories, featuredStory);

  // Single test send
  if (to && !sendAll) {
    try {
      await sendEmail(to, subject, html, text);
      return res.json({ sent: 1, email: to });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // Send to all users (excluding unsubscribed)
  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Firestore not available' });

  // Get unsubscribed list
  const unsubscribed = new Set();
  try {
    const unsubDoc = await db.collection('config').doc('newsletterUnsubscribed').get();
    if (unsubDoc.exists) {
      const data = unsubDoc.data();
      (data.emails || []).forEach(e => unsubscribed.add(e.toLowerCase()));
    }
  } catch {}

  // Get all users
  const allEmails = [];
  try {
    const usersSnap = await db.collection('users').get();
    usersSnap.forEach(d => {
      const data = d.data();
      const email = data.email?.toLowerCase();
      if (email && !unsubscribed.has(email)) {
        allEmails.push(email);
      }
    });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to fetch users: ' + e.message });
  }

  const results = [];
  for (const email of allEmails) {
    try {
      await sendEmail(email, subject, html, text);
      results.push({ email, status: 'sent' });
    } catch (e) {
      results.push({ email, status: 'failed', error: e.message });
    }
  }

  return res.json({
    sent: results.filter(r => r.status === 'sent').length,
    failed: results.filter(r => r.status === 'failed').length,
    total: allEmails.length,
    results,
  });
}
