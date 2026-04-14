// ElevenLabs Text-to-Speech with smart voice routing. v2
// Picks the right accent/voice based on the family's country + beliefs.

import { routeVoice } from './voiceRouter.js';

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!ELEVENLABS_KEY) {
    return res.status(503).json({ error: 'ElevenLabs not configured' });
  }

  const {
    text,
    narrator = 'AI Narrator',
    language = 'English',
    country = 'OTHER',
    beliefs = [],
    customVoiceId,
    stability = 0.6,
    similarityBoost = 0.8,
    style = 0.3,
  } = req.body || {};

  if (!text || text.length < 10) {
    return res.status(400).json({ error: 'Text too short' });
  }

  // Cap text length
  const trimmedText = text.slice(0, 30000);

  // Smart voice routing
  const { voiceId, name: voiceName, model } = routeVoice({
    narrator,
    country,
    beliefs,
    language,
    customVoiceId,
  });

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_KEY,
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: trimmedText,
          model_id: model,
          voice_settings: {
            stability,
            similarity_boost: similarityBoost,
            style,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('ElevenLabs error:', response.status, err);
      return res.status(response.status).json({
        error: response.status === 401 ? 'Invalid API key'
             : response.status === 402 ? 'ElevenLabs quota exceeded. Upgrade your ElevenLabs plan or wait for reset.'
             : response.status === 429 ? 'Rate limit — try again in a moment.'
             : `TTS failed (${response.status})`,
        code: response.status,
      });
    }

    // Stream audio back
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('X-Voice-Used', voiceName);

    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
    res.end();
  } catch (err) {
    console.error('TTS error:', err);
    return res.status(500).json({ error: 'TTS generation failed' });
  }
}
