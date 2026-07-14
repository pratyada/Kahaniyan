// POST /api/ai-story-writer — AI generates a bedtime story from a topic.
// Body: { uid, topic, tradition, theme, targetAge, seriesContext?, duration? }
// Returns: { title, subtitle, body, metaDescription, wordCount }

import { getFirestore } from './_firebase.js';

const FOUNDER_EMAIL = 'prateekyadav2010@gmail.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, topic, tradition, theme, targetAge, seriesContext, duration, character } = req.body || {};
  if (!uid || !topic) return res.status(400).json({ error: 'uid and topic required' });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  // Load Story Lab for richer prompts
  let storyLabContext = '';
  try {
    const db = await getFirestore();
    if (db) {
      const labSnap = await db.collection('config').doc('storyLab').get();
      if (labSnap.exists) {
        const lab = labSnap.data();
        if (lab.globalRules?.length) storyLabContext += `\nGlobal rules: ${lab.globalRules.join('; ')}`;
        if (lab.culturalRefs?.[tradition]) {
          storyLabContext += `\nCultural context: ${JSON.stringify(lab.culturalRefs[tradition]).slice(0, 500)}`;
        }
      }
    }
  } catch {}

  const targetWords = Math.round((duration || 2) * 150);

  const system = `You are a master bedtime story writer for My Sleepy Tale. Write warm, gentle, educational stories.

Rules:
- Use soft, positive language only (no "grabbed", "exploded", "scary", "dark", "monster")
- Age-appropriate for ${targetAge || '4-7'} year olds
- Include a clear moral/value lesson related to: ${theme || 'kindness'}
- Target ${targetWords} words (~${duration || 2} minutes at 150 wpm)
- End with a calming wind-down paragraph
- Use "little one" as the listener address (not a child's name)
- End with "Goodnight, little one." or similar gentle closing
${tradition && tradition !== 'universal' ? `- Respectfully incorporate ${tradition} cultural elements` : ''}
${seriesContext ? `- This is part of a series: ${seriesContext}. Match the tone and style.` : ''}
${character?.name ? `- RECURRING CHARACTER: "${character.name}" — ${character.description || ''}. ${character.catchphrase ? `Catchphrase: "${character.catchphrase}". ` : ''}${character.visualTraits ? `Visual: ${character.visualTraits}. ` : ''}This character MUST appear prominently in the story.` : ''}
${storyLabContext}

Return ONLY valid JSON:
{
  "title": "Story Title",
  "subtitle": "One-line subtitle (max 100 chars)",
  "body": "Full story text...",
  "metaDescription": "SEO description (max 155 chars)",
  "value": "the core value/theme taught"
}`;

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
        max_tokens: 3000,
        system,
        messages: [{ role: 'user', content: `Write a bedtime story about: ${topic}` }],
      }),
    });

    if (!apiRes.ok) throw new Error(`Claude API: ${apiRes.status}`);
    const data = await apiRes.json();
    const text = data.content?.[0]?.text || '';

    let result;
    try {
      const match = text.match(/\{[\s\S]*\}/);
      result = JSON.parse(match[0]);
    } catch {
      result = { title: topic, subtitle: '', body: text, metaDescription: '', value: theme || 'kindness' };
    }

    result.wordCount = (result.body || '').split(/\s+/).length;
    result.estimatedMinutes = Math.round(result.wordCount / 150);
    result.tokens = { input: data.usage?.input_tokens || 0, output: data.usage?.output_tokens || 0 };

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
