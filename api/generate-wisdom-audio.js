// Generate TTS audio for a wisdom story via OpenAI.
// Accepts voice + model selection from admin panel.
// Returns the audio blob — client handles Firebase Storage upload.

const OPENAI_KEY = process.env.OPENAI_API_KEY;

const VALID_VOICES = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'marin', 'cedar', 'nova', 'onyx', 'sage', 'shimmer', 'verse'];
const VALID_MODELS = ['tts-1', 'tts-1-hd', 'gpt-4o-mini-tts'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!OPENAI_KEY) return res.status(503).json({ error: 'OpenAI not configured' });

  const { text, voice = 'sage', model = 'tts-1', speed = 0.9 } = req.body || {};
  if (!text || text.length < 10) return res.status(400).json({ error: 'text required' });

  const safeVoice = VALID_VOICES.includes(voice) ? voice : 'sage';
  const safeModel = VALID_MODELS.includes(model) ? model : 'tts-1';

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: safeModel,
        input: text.slice(0, 4096),
        voice: safeVoice,
        speed: Math.max(0.25, Math.min(4.0, speed)),
        response_format: 'opus',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(response.status).json({ error: `TTS failed (${response.status})` });
    }

    res.setHeader('Content-Type', 'audio/ogg');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('X-Voice-Used', safeVoice);
    res.setHeader('X-Model-Used', safeModel);

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
