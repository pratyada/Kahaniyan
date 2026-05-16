// ElevenLabs TTS — premium audio generation for pre-loaded stories.
// Uses text-to-speech API with voice selection.

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;

const VOICES = {
  george: { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George - Warm Storyteller' },
  lily: { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily - Velvety Actress' },
  sarah: { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah - Mature, Reassuring' },
  alice: { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice - Clear Educator' },
  brian: { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian - Deep, Comforting' },
  bill: { id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill - Wise, Mature' },
  muskaan: { id: 'xoV6iGVuOGYHLWjXhVC7', name: 'Muskaan - Hindi' },
  river: { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River - Relaxed, Neutral' },
  jessica: { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica - Playful, Warm' },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!ELEVENLABS_KEY) {
    return res.status(503).json({ error: 'ElevenLabs not configured' });
  }

  const { text, voice = 'george', model = 'eleven_multilingual_v2', stability = 0.6, similarity = 0.8 } = req.body || {};

  if (!text || text.length < 10) {
    return res.status(400).json({ error: 'Text too short' });
  }

  const voiceConfig = VOICES[voice] || VOICES.george;

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.id}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_KEY,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text.slice(0, 10000),
        model_id: model,
        voice_settings: {
          stability,
          similarity_boost: similarity,
          style: 0.3,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('ElevenLabs error:', response.status, err);
      return res.status(response.status).json({
        error: response.status === 401 ? 'Invalid API key'
          : response.status === 429 ? 'Rate limit — wait a moment'
          : `ElevenLabs failed (${response.status})`,
      });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('X-Voice-Used', voiceConfig.name);

    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (err) {
    console.error('ElevenLabs error:', err);
    return res.status(500).json({ error: 'Audio generation failed' });
  }
}

// Export voices list for admin panel
export const VOICE_LIST = VOICES;
