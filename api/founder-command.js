// POST /api/founder-command — AI-powered founder assistant
// Interprets natural language commands and executes actions
// Actions: edit/delete/list/info episodes, send newsletter, manage outreach, create stories, user stats

import { getFirestore } from './_firebase.js';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const FOUNDER_EMAILS = ['prateekyadav2010@gmail.com', 'rakshajoshi476@gmail.com'];
const ses = new SESClient({ region: 'us-east-1' });

async function interpretCommand(command, context) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not set');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
      system: `You are the AI assistant for MySleepyTale's Founder Hub. You interpret natural language commands from founders and return structured actions.

Available actions:

CONTENT MANAGEMENT:
1. "edit" — Update a published episode (title, subtitle, body, theme, tradition, coverImage, durationMinutes, source)
2. "list" — List published episodes (filter by series, search term, or all)
3. "delete" — Delete a published episode
4. "info" — Get details about a specific episode
5. "write" — Generate a new story from a description (returns AI-written story)

NEWSLETTER:
6. "newsletter_generate" — Generate a newsletter from a prompt/description
7. "newsletter_send" — Send a newsletter to all users (needs newsletterId)
8. "newsletter_list" — List past newsletters

OUTREACH:
9. "outreach_add" — Add a new business lead (email, businessName, city, businessType, contactName)
10. "outreach_send" — Send AIDA email to a lead (stage 1-4)
11. "outreach_list" — List recent outreach leads

USERS & STATS:
12. "user_count" — Get total user count
13. "user_list" — List recent users
14. "stats" — Get platform stats (users, stories, episodes)

EMAIL:
15. "send_email" — Send a custom email to a specific address

OTHER:
16. "unknown" — You don't understand the command — ask for clarification

${context}

Return ONLY valid JSON:
{
  "action": "one of the actions above",
  "episodeId": "episode ID if applicable",
  "updates": {},
  "params": {},
  "message": "human-friendly response",
  "confirm": true/false
}

Field guide:
- For "edit": updates = { field: value }. Valid fields: title, subtitle, body, theme, tradition, durationMinutes, coverImage, source
- For "write": params = { topic, tradition, theme, duration, character: { name, description, catchphrase } }
- For "newsletter_generate": params = { prompt }
- For "newsletter_send": params = { newsletterId }
- For "outreach_add": params = { email, businessName, city, businessType, contactName }
- For "outreach_send": params = { email, stage (1-4), contactName, businessName }
- For "send_email": params = { to, subject, body }
- For "outreach_list"/"user_list": params = { limit }
- For "list": searchTerm = "query"

If the user mentions an episode by title, fuzzy-match to the context list. If ambiguous, ask.
For destructive actions (delete, send to all), always set confirm: true.
For edits, set confirm: true.
For listing/info, set confirm: false.`,
      messages: [{ role: 'user', content: command }],
    }),
  });

  if (!res.ok) throw new Error(`AI error: ${res.status}`);
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Failed to parse AI response');
  return JSON.parse(match[0]);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, command, executeAction } = req.body || {};
  if (!uid) return res.status(400).json({ error: 'uid required' });

  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Firestore not available' });

  // Auth check
  const userSnap = await db.collection('users').doc(uid).get();
  const email = userSnap.exists ? userSnap.data().email : '';
  if (!FOUNDER_EMAILS.includes(email.toLowerCase())) {
    return res.status(403).json({ error: 'Founder access only' });
  }

  // ══════════════════════════════════════
  // EXECUTE a confirmed action
  // ══════════════════════════════════════
  if (executeAction) {
    const { action, episodeId, updates, params } = executeAction;

    // ── Edit episode ──
    if (action === 'edit' && episodeId && updates) {
      const cleanUpdates = { ...updates, updatedAt: new Date().toISOString() };
      try { await db.collection('publishedContent').doc(episodeId).update(cleanUpdates); } catch {}
      try { await db.collection('productionStories').doc(episodeId).update(cleanUpdates); } catch {}
      if (updates.coverImage) {
        await db.collection('config').doc('wisdomImages').set({ [episodeId]: updates.coverImage }, { merge: true });
      }
      return res.json({ success: true, action: 'edit', episodeId, message: `Updated "${episodeId}" successfully.` });
    }

    // ── Delete episode ──
    if (action === 'delete' && episodeId) {
      try { await db.collection('publishedContent').doc(episodeId).delete(); } catch {}
      try { await db.collection('productionStories').doc(episodeId).delete(); } catch {}
      return res.json({ success: true, action: 'delete', episodeId, message: `Deleted "${episodeId}".` });
    }

    // ── Send newsletter to all ──
    if (action === 'newsletter_send' && params?.newsletterId) {
      try {
        const nlDoc = await db.collection('newsletters').doc(params.newsletterId).get();
        if (!nlDoc.exists) return res.json({ success: false, message: 'Newsletter not found' });
        const nl = nlDoc.data();
        if (nl.status === 'sent') return res.json({ success: false, message: 'Already sent' });

        // Delegate to newsletter-send API logic
        const { default: nlHandler } = await import('./newsletter-send.js');
        const fakeReq = { method: 'POST', body: { mode: 'sendAll', newsletterId: params.newsletterId } };
        let result = {};
        const fakeRes = { status: () => fakeRes, json: (d) => { result = d; } };
        await nlHandler(fakeReq, fakeRes);
        return res.json({ success: true, action: 'newsletter_send', message: `Newsletter sent! ${result.sentCount || 0} delivered.`, ...result });
      } catch (e) {
        return res.json({ success: false, message: e.message });
      }
    }

    // ── Send outreach email ──
    if (action === 'outreach_send' && params?.email) {
      try {
        const { default: outreachHandler } = await import('./outreach-email.js');
        const fakeReq = { method: 'POST', body: { to: params.email, contactName: params.contactName || '', businessName: params.businessName || '', stage: params.stage || 1, force: true } };
        let result = {};
        const fakeRes = { status: () => fakeRes, json: (d) => { result = d; } };
        await outreachHandler(fakeReq, fakeRes);
        return res.json({ success: true, action: 'outreach_send', message: `Outreach email (stage ${params.stage || 1}) sent to ${params.email}.`, ...result });
      } catch (e) {
        return res.json({ success: false, message: e.message });
      }
    }

    // ── Add outreach lead ──
    if (action === 'outreach_add' && params?.email) {
      const id = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      await db.collection('outreachLeads').doc(id).set({
        id,
        email: params.email.toLowerCase(),
        firstName: params.contactName || '',
        lastName: '',
        businessName: params.businessName || '',
        city: params.city || '',
        businessType: params.businessType || '',
        source: 'founder-command',
        status: 'new',
        outreachStage: 0,
        createdAt: new Date().toISOString(),
      });
      return res.json({ success: true, action: 'outreach_add', message: `Added ${params.businessName || params.email} to outreach.` });
    }

    // ── Send custom email ──
    if (action === 'send_email' && params?.to && params?.subject) {
      try {
        await ses.send(new SendEmailCommand({
          Source: 'My Sleepy Tale <hello@mysleepytale.com>',
          Destination: { ToAddresses: [params.to] },
          Message: {
            Subject: { Data: params.subject },
            Body: { Text: { Data: params.body || '' } },
          },
        }));
        return res.json({ success: true, action: 'send_email', message: `Email sent to ${params.to}.` });
      } catch (e) {
        return res.json({ success: false, message: e.message });
      }
    }

    return res.status(400).json({ error: 'Invalid executeAction' });
  }

  // ══════════════════════════════════════
  // INTERPRET a command
  // ══════════════════════════════════════
  if (!command) return res.status(400).json({ error: 'command required' });

  // Gather context
  let context = 'PUBLISHED EPISODES:\n';
  try {
    const snap = await db.collection('productionStories').orderBy('publishedAt', 'desc').limit(20).get();
    snap.docs.forEach(d => {
      const data = d.data();
      context += `- ID: "${d.id}" | Title: "${data.title}" | Series: ${data.seriesId || 'none'} | Theme: ${data.theme || '?'}\n`;
    });
  } catch {}

  // Newsletter context
  try {
    const snap = await db.collection('newsletters').orderBy('createdAt', 'desc').limit(5).get();
    if (!snap.empty) {
      context += '\nRECENT NEWSLETTERS:\n';
      snap.docs.forEach(d => {
        const data = d.data();
        context += `- ID: "${d.id}" | Name: "${data.name}" | Subject: "${data.subject}" | Status: ${data.status} | Sent: ${data.sentCount || 0}\n`;
      });
    }
  } catch {}

  // User count
  try {
    const usersSnap = await db.collection('users').count().get();
    context += `\nPLATFORM STATS:\n- Total users: ${usersSnap.data().count}\n`;
  } catch {}

  // Outreach count
  try {
    const outreachSnap = await db.collection('outreachLeads').count().get();
    context += `- Outreach leads: ${outreachSnap.data().count}\n`;
  } catch {}

  try {
    const result = await interpretCommand(command, context);

    // ── Fetch data for read-only actions ──

    if (result.action === 'info' && result.episodeId) {
      const snap = await db.collection('productionStories').doc(result.episodeId).get();
      if (snap.exists) {
        const data = snap.data();
        result.episodeData = { id: snap.id, ...data, body: data.body?.slice(0, 500) + '...' };
      }
    }

    if (result.action === 'list') {
      const snap = await db.collection('productionStories').orderBy('publishedAt', 'desc').limit(30).get();
      let episodes = snap.docs.map(d => ({ id: d.id, title: d.data().title, series: d.data().seriesId, theme: d.data().theme, publishedAt: d.data().publishedAt }));
      if (result.searchTerm) {
        const q = result.searchTerm.toLowerCase();
        episodes = episodes.filter(e => e.title?.toLowerCase().includes(q) || e.id?.includes(q) || e.series?.includes(q));
      }
      result.episodes = episodes;
    }

    if (result.action === 'newsletter_list') {
      const snap = await db.collection('newsletters').orderBy('createdAt', 'desc').limit(10).get();
      result.newsletters = snap.docs.map(d => ({ id: d.id, name: d.data().name, subject: d.data().subject, status: d.data().status, sentCount: d.data().sentCount || 0, sentAt: d.data().sentAt }));
    }

    if (result.action === 'newsletter_generate' && result.params?.prompt) {
      try {
        const { default: nlHandler } = await import('./newsletter-send.js');
        const fakeReq = { method: 'POST', body: { mode: 'generate', prompt: result.params.prompt } };
        let nlResult = {};
        const fakeRes = { status: () => fakeRes, json: (d) => { nlResult = d; } };
        await nlHandler(fakeReq, fakeRes);
        result.newsletter = { subject: nlResult.subject, preview: nlResult.textContent?.slice(0, 300) };
        result.message += ` Subject: "${nlResult.subject}"`;
        // Auto-save as draft
        const fakeReq2 = { method: 'POST', body: { mode: 'save', prompt: result.params.prompt, newsletterName: result.params.prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40), subject: nlResult.subject, htmlContent: nlResult.htmlContent, textContent: nlResult.textContent } };
        let saveResult = {};
        const fakeRes2 = { status: () => fakeRes2, json: (d) => { saveResult = d; } };
        await nlHandler(fakeReq2, fakeRes2);
        if (saveResult.newsletterId) {
          result.newsletterId = saveResult.newsletterId;
          result.message += ` Saved as draft. Say "send newsletter" to send it to all users.`;
        }
      } catch (e) {
        result.message += ` (Generation failed: ${e.message})`;
      }
    }

    if (result.action === 'write' && result.params?.topic) {
      try {
        const { default: writerHandler } = await import('./ai-story-writer.js');
        const fakeReq = { method: 'POST', body: { uid, topic: result.params.topic, tradition: result.params.tradition || 'universal', theme: result.params.theme || 'kindness', targetAge: '4-7', duration: result.params.duration || 2, character: result.params.character || null } };
        let storyResult = {};
        const fakeRes = { status: () => fakeRes, json: (d) => { storyResult = d; } };
        await writerHandler(fakeReq, fakeRes);
        result.story = { title: storyResult.title, subtitle: storyResult.subtitle, preview: storyResult.body?.slice(0, 300) + '...' };
        result.message += ` Title: "${storyResult.title}"`;
      } catch (e) {
        result.message += ` (Story generation failed: ${e.message})`;
      }
    }

    if (result.action === 'user_count' || result.action === 'stats') {
      try {
        const usersSnap = await db.collection('users').count().get();
        const storiesSnap = await db.collection('productionStories').count().get();
        const outreachSnap = await db.collection('outreachLeads').count().get();
        const nlSnap = await db.collection('newsletters').count().get();
        result.stats = {
          users: usersSnap.data().count,
          publishedStories: storiesSnap.data().count,
          outreachLeads: outreachSnap.data().count,
          newsletters: nlSnap.data().count,
        };
      } catch {}
    }

    if (result.action === 'user_list') {
      const lim = result.params?.limit || 10;
      const snap = await db.collection('users').orderBy('lastActiveAt', 'desc').limit(lim).get();
      result.users = snap.docs.map(d => {
        const data = d.data();
        return { email: data.email, name: data.displayName, lastActive: data.lastActiveAt };
      });
    }

    if (result.action === 'outreach_list') {
      const lim = result.params?.limit || 10;
      const snap = await db.collection('outreachLeads').orderBy('createdAt', 'desc').limit(lim).get();
      result.leads = snap.docs.map(d => {
        const data = d.data();
        return { email: data.email, business: data.businessName, city: data.city, status: data.status, stage: data.outreachStage || 0 };
      });
    }

    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
