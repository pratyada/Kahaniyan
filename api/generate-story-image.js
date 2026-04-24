// Generate a story cover image via DALL-E 3.
// POST /api/generate-story-image { lessonId, prompt }
// Returns image URL. Client handles Firebase Storage upload.

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
        model: 'dall-e-3',
        prompt: `Children's bedtime storybook illustration, soft watercolor style, warm dreamy colors, no text or words anywhere in the image: ${prompt}`,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('DALL-E error:', response.status, err);
      return res.status(response.status).json({ error: `Image generation failed (${response.status})` });
    }

    const data = await response.json();
    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) return res.status(500).json({ error: 'No image URL returned' });

    return res.json({ imageUrl });
  } catch (err) {
    console.error('Generate image error:', err);
    return res.status(500).json({ error: err.message });
  }
}
