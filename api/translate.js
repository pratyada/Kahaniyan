// Translate story text to target language via OpenAI
// POST /api/translate { text, language }

const OPENAI_KEY = process.env.OPENAI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!OPENAI_KEY) return res.status(503).json({ error: 'OpenAI not configured' });

  const { text, language } = req.body || {};
  if (!text || !language || language === 'English') {
    return res.status(400).json({ error: 'Missing text or language' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `You are a translator for children's bedtime stories. Translate the following story into ${language}. Keep it gentle, warm, and age-appropriate. Keep {childName} and {sibling} and {pet} placeholders exactly as-is. Return ONLY the translated text, no explanations or notes.` },
          { role: 'user', content: text.slice(0, 4000) },
        ],
        temperature: 0.3,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('[translate] OpenAI error:', response.status, err);
      return res.status(500).json({ error: 'Translation failed' });
    }

    const data = await response.json();
    const translated = data.choices?.[0]?.message?.content;

    if (!translated || translated.length < 20) {
      return res.status(500).json({ error: 'Empty translation' });
    }

    return res.json({ translated, language });
  } catch (e) {
    console.error('[translate] Error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
