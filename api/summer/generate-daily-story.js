// POST /api/summer/generate-daily-story — Generate today's story + mission for a summer adventure day.
// Body: { uid, adventureId, dayNumber }
// Returns: { story: { title, body }, mission, reflection }

import { getFirestore } from '../_firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, adventureId, dayNumber } = req.body || {};
  if (!uid || !adventureId || !dayNumber) return res.status(400).json({ error: 'uid, adventureId, dayNumber required' });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  // Get adventure + day data
  const advSnap = await db.collection('summerAdventures').doc(adventureId).get();
  if (!advSnap.exists) return res.status(404).json({ error: 'Adventure not found' });
  const adventure = advSnap.data();

  const dayRef = db.collection('summerAdventures').doc(adventureId).collection('days').doc(String(dayNumber));
  const daySnap = await dayRef.get();
  if (!daySnap.exists) return res.status(404).json({ error: 'Day not found' });
  const day = daySnap.data();

  // If story already generated, return it
  if (day.story?.title && day.story?.body) {
    return res.status(200).json({ story: day.story, mission: day.mission, reflection: day.reflectionQuestion, cached: true });
  }

  // Load Story Lab config for richer prompts
  let storyLabContext = '';
  try {
    const labSnap = await db.collection('config').doc('storyLab').get();
    if (labSnap.exists) {
      const lab = labSnap.data();
      if (lab.globalRules?.length) storyLabContext += `\nGlobal rules: ${lab.globalRules.join('; ')}`;
    }
  } catch {}

  const childName = adventure.childName || 'little one';
  const childAge = adventure.childAge || 5;
  const targetSkill = day.targetSkill || 'kindness';
  const weekTheme = day.weekTheme || 'Adventure';
  const storyPrompt = day.storyPrompt || `A story about ${targetSkill}`;

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system: `You are a master bedtime story writer for My Sleepy Tale's Summer Adventures program.

You are writing a story for ${childName} (age ${childAge}). This is Day ${dayNumber} of their 8-week summer adventure.

This week's theme: "${weekTheme}"
Today's learning focus: ${targetSkill} (but NEVER mention this to the child — weave it naturally into the adventure)

Rules:
- Use soft, positive language only (no "grabbed", "exploded", "scary")
- Age-appropriate for ${childAge} year olds
- 300-400 words (~2-3 minutes at 150 wpm)
- The story should feel like a fun adventure, NEVER like homework or a lesson
- End with a gentle, calming wind-down paragraph
- Address the listener as "little one" (not by name — personalization happens in TTS)
- The learning objective (${targetSkill}) should be invisible — embedded in the plot, not stated
${storyLabContext}

Return ONLY valid JSON:
{
  "title": "Story Title",
  "body": "Full story text..."
}`,
        messages: [{
          role: 'user',
          content: `Write today's Summer Adventure story based on this prompt: ${storyPrompt}`
        }],
      }),
    });

    if (!apiRes.ok) throw new Error(`Claude API: ${apiRes.status}`);
    const data = await apiRes.json();
    const text = data.content?.[0]?.text || '';

    let story;
    try {
      const match = text.match(/\{[\s\S]*\}/);
      story = JSON.parse(match[0]);
    } catch {
      story = { title: `Day ${dayNumber} Adventure`, body: text };
    }

    // Save story to day document
    await dayRef.update({
      'story.title': story.title,
      'story.body': story.body,
      'story.generatedAt': new Date().toISOString(),
      status: 'in_progress',
    });

    // Add 10 XP for starting the story
    const { FieldValue } = await import('firebase-admin/firestore');
    await db.collection('summerAdventures').doc(adventureId).update({
      'stats.totalXP': FieldValue.increment(10),
    });
    await dayRef.update({ xpEarned: FieldValue.increment(10) });

    return res.status(200).json({
      story,
      mission: {
        title: day.missionTitle || day.mission?.title || 'Today\'s Mission',
        description: day.missionDescription || day.mission?.description || 'Explore something new today!',
        type: day.missionType || day.mission?.type || 'observe',
      },
      reflection: day.reflectionQuestion || 'What made you smile today?',
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
