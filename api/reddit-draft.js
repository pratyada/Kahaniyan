// POST /api/reddit-draft — AI drafts 3 comment styles for a Reddit lead.
// Body: { uid, leadId }
// Uses Claude to generate: Educational, Personal Story, Expert Answer

import { getFirestore } from './_firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, leadId } = req.body || {};
  if (!uid || !leadId) return res.status(400).json({ error: 'uid and leadId required' });

  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  // Get the lead
  const leadRef = db.collection('redditLeads').doc(leadId);
  const leadSnap = await leadRef.get();
  if (!leadSnap.exists) return res.status(404).json({ error: 'Lead not found' });
  const lead = leadSnap.data();

  // Update status to drafting
  await leadRef.update({ status: 'drafting' });

  // Call Claude to generate 3 comment styles
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  const system = `You are a helpful Reddit commenter for My Sleepy Tale, a free audio bedtime story platform for kids (mysleepytale.com).

RULES:
- Be genuinely helpful FIRST. The comment must add value even without the product mention.
- Never sound like an ad or spam. Be a real person sharing a genuine recommendation.
- Match the tone of the subreddit (r/${lead.subreddit}).
- Keep comments 80-150 words.
- Mention mysleepytale.com naturally, not as the main point.
- Don't use marketing language ("revolutionary", "game-changing", "amazing platform").
- Sound like a parent who found something that works, not a marketer.
- Never say "I'm the founder" or "I built this" — position as a user/parent.
- Include specific details that only a real user would know (e.g., "they have stories in Hindi and French", "my kid loves the FIFA World Cup series").

PRODUCT FACTS (use sparingly, 1-2 per comment):
- Free to use, no app download needed (it's a web platform)
- 200+ bedtime audio stories
- 11 cultural traditions (Hindu, Islamic, Catholic, Sikh, Filipino, Hispanic, etc.)
- 9 languages
- Kids can create their own stories
- Stories personalized with child's name
- Screen-free — audio only
- Built in Toronto

Generate exactly 3 comments in JSON format:
{
  "educational": "comment that shares useful information + natural mention",
  "personal": "comment that tells a personal parent story + natural mention",
  "expert": "comment that gives expert-style advice + natural mention"
}`;

  const userPrompt = `Reddit post in r/${lead.subreddit}:
Title: ${lead.title}
Body: ${lead.selfText?.slice(0, 1000) || '(no body text)'}
Score: ${lead.score} | Comments: ${lead.numComments}

Generate 3 comment styles that would fit naturally as a reply to this post.`;

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
        max_tokens: 1500,
        system,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!apiRes.ok) throw new Error(`Claude API error: ${apiRes.status}`);
    const data = await apiRes.json();
    const text = data.content?.[0]?.text || '';

    let drafts;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch[0]);
      drafts = [parsed.educational, parsed.personal, parsed.expert];
    } catch {
      drafts = [text, text, text]; // fallback
    }

    // Save drafts to the lead
    await leadRef.update({
      status: 'drafted',
      drafts,
      draftedAt: new Date().toISOString(),
      draftTokens: { input: data.usage?.input_tokens || 0, output: data.usage?.output_tokens || 0 },
    });

    // Send to Slack if configured
    const slackWebhook = process.env.SLACK_WEBHOOK_URL;
    if (slackWebhook) {
      try {
        await fetch(slackWebhook, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            text: `🤖 *Reddit Lead Ready for Review*\n\n*Subreddit:* r/${lead.subreddit}\n*Post:* ${lead.title}\n*Matched:* "${lead.matchedKeyword}"\n*Score:* ${lead.score} | ${lead.numComments} comments\n\n*3 draft comments ready* — review at mysleepytale.com/founder-hub\n\n<${lead.url}|Open on Reddit>`,
          }),
        });
      } catch {}
    }

    return res.status(200).json({ drafts, leadId });

  } catch (e) {
    await leadRef.update({ status: 'new' }); // revert on failure
    return res.status(500).json({ error: e.message });
  }
}
