// POST /api/founder-command — AI-powered founder assistant
// Interprets natural language commands and executes actions on published content
// Actions: edit episode, list episodes, delete episode, update images, send newsletter

import { getFirestore } from './_firebase.js';

const FOUNDER_EMAILS = ['prateekyadav2010@gmail.com', 'rakshajoshi476@gmail.com'];

async function interpretCommand(command, context) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not set');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      system: `You are the AI assistant for MySleepyTale's Founder Hub. You interpret natural language commands from founders and return structured actions.

Available actions:
1. "edit" — Update a published episode's fields (title, subtitle, body, theme, tradition, coverImage)
2. "list" — List published episodes (optionally filtered by series or search term)
3. "delete" — Delete a published episode
4. "info" — Get details about a specific episode
5. "unknown" — You don't understand the command

Published episodes are stored in Firestore collections: publishedContent and productionStories.

${context ? `Context — recently published episodes:\n${context}` : ''}

Return ONLY valid JSON:
{
  "action": "edit|list|delete|info|unknown",
  "episodeId": "the episode ID if identifiable from the command (match by title or ID)",
  "updates": { "field": "new value" },  // for edit action — only include fields being changed
  "searchTerm": "search query",  // for list action
  "message": "human-friendly response explaining what you're doing",
  "confirm": true/false  // true if action needs confirmation (delete, major edits)
}

For edit: only include fields the user wants to change. Valid fields: title, subtitle, body, theme, tradition, durationMinutes, coverImage, source.
For body edits: include the FULL updated story text, not just the changes.
If the user mentions an episode by title, fuzzy-match it to the context list and return its ID.
If you can't identify which episode, set episodeId to null and ask in message.`,
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

  // ── EXECUTE a confirmed action ──
  if (executeAction) {
    const { action, episodeId, updates } = executeAction;

    if (action === 'edit' && episodeId && updates) {
      const cleanUpdates = { ...updates, updatedAt: new Date().toISOString() };
      // Update both collections
      try { await db.collection('publishedContent').doc(episodeId).update(cleanUpdates); } catch {}
      try { await db.collection('productionStories').doc(episodeId).update(cleanUpdates); } catch {}
      // If coverImage changed, also update wisdomImages
      if (updates.coverImage) {
        await db.collection('config').doc('wisdomImages').set({ [episodeId]: updates.coverImage }, { merge: true });
      }
      return res.json({ success: true, action: 'edit', episodeId, message: `Updated "${episodeId}" successfully.` });
    }

    if (action === 'delete' && episodeId) {
      try { await db.collection('publishedContent').doc(episodeId).delete(); } catch {}
      try { await db.collection('productionStories').doc(episodeId).delete(); } catch {}
      return res.json({ success: true, action: 'delete', episodeId, message: `Deleted "${episodeId}".` });
    }

    return res.status(400).json({ error: 'Invalid executeAction' });
  }

  // ── INTERPRET a command ──
  if (!command) return res.status(400).json({ error: 'command required' });

  // Get recent published content for context
  let context = '';
  try {
    const snap = await db.collection('publishedContent').orderBy('createdAt', 'desc').limit(20).get();
    const items = snap.docs.map(d => {
      const data = d.data();
      return `- ID: "${d.id}" | Title: "${data.title}" | Series: ${data.seriesId || 'none'} | Theme: ${data.theme || '?'}`;
    });
    context = items.join('\n');
  } catch {}

  // Also check productionStories
  try {
    const snap = await db.collection('productionStories').orderBy('publishedAt', 'desc').limit(20).get();
    snap.docs.forEach(d => {
      const data = d.data();
      if (!context.includes(d.id)) {
        context += `\n- ID: "${d.id}" | Title: "${data.title}" | Series: ${data.seriesId || 'none'} | Theme: ${data.theme || '?'}`;
      }
    });
  } catch {}

  try {
    const result = await interpretCommand(command, context);

    // For info/list, fetch data
    if (result.action === 'info' && result.episodeId) {
      let epData = null;
      const snap = await db.collection('productionStories').doc(result.episodeId).get();
      if (snap.exists) epData = { id: snap.id, ...snap.data(), body: snap.data().body?.slice(0, 500) + '...' };
      result.episodeData = epData;
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

    return res.json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
