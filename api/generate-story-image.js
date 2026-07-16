// Generate a story cover image via OpenAI gpt-image-1.
// POST /api/generate-story-image { prompt }
// Returns base64 image data. Client handles Firebase Storage upload.

const OPENAI_KEY = process.env.OPENAI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!OPENAI_KEY) return res.status(503).json({ error: 'OpenAI not configured' });

  const { prompt } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'prompt required' });

  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: `Children's bedtime storybook illustration, soft watercolor style, warm dreamy colors, no text or words anywhere in the image. No real people or celebrities, only fictional cartoon characters: ${prompt}`,
        n: 1,
        size: '1024x1024',
        quality: 'low',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Image gen error:', response.status, err);
      return res.status(response.status).json({ error: `Image generation failed (${response.status})` });
    }

    const data = await response.json();
    // gpt-image-1 returns base64, dall-e-3 returned url — handle both
    const imageUrl = data.data?.[0]?.url || null;
    const b64 = data.data?.[0]?.b64_json || null;

    if (b64) {
      return res.json({ imageBase64: b64 });
    } else if (imageUrl) {
      return res.json({ imageUrl });
    } else {
      return res.status(500).json({ error: 'No image data returned' });
    }
  } catch (err) {
    console.error('Generate image error:', err);
    return res.status(500).json({ error: err.message });
  }
}
