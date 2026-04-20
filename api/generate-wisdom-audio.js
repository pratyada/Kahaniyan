// Thin proxy: generate TTS audio for a wisdom story via OpenAI.
// Returns the audio blob directly — client handles Firebase Storage upload.

const OPENAI_KEY = process.env.OPENAI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!OPENAI_KEY) return res.status(503).json({ error: 'OpenAI not configured' });

  const { text } = req.body || {};
  if (!text || text.length < 10) return res.status(400).json({ error: 'text required' });

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text.slice(0, 4096),
        voice: 'nova',
        speed: 0.9,
        response_format: 'opus',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: `TTS failed (${response.status})` });
    }

    res.setHeader('Content-Type', 'audio/ogg');
    res.setHeader('Cache-Control', 'no-cache');

    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
