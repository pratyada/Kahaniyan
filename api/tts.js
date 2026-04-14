// ElevenLabs Text-to-Speech — Vercel Serverless Function.
// Takes story text + voice preference → returns MP3 audio stream.
// API key stays server-side, never exposed to client.

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;

// Default voice mapping — bedtime-optimized picks from available voices
const VOICE_MAP = {
  // Narrators
  'AI Narrator': 'JBFqnCBsd6RMkjVDRZzb',   // George — Warm Captivating Storyteller
  'Mummy':       'cgSgspJ2msm6clMCkdW9',   // Jessica — Playful, Bright, Warm
  'Daddy':       'nPczCjzI2devNBz1zQrb',   // Brian — Deep, Resonant, Comforting
  'Dada ji':     'pqHfZKP75CvOlQylNhV4',   // Bill — Wise, Mature, Balanced
  'Nani ma':     'pFZP5JQG7iQjIQuC4Bku',   // Lily — Velvety Actress
  // Language-specific
  'Hindi':       'xoV6iGVuOGYHLWjXhVC7',   // Muskaan — Casual Hindi Voice
  // Fallback
  'default':     'JBFqnCBsd6RMkjVDRZzb',   // George
};

// Model selection — multilingual v2 for non-English, turbo for English
function pickModel(language) {
  if (!language || language === 'English') return 'eleven_turbo_v2_5';
  return 'eleven_multilingual_v2';
}

function pickVoice(narrator, language, customVoiceId) {
  // If user has a custom cloned voice ID, use it (Pro/Enterprise)
  if (customVoiceId) return customVoiceId;
  // Language-specific voice
  if (language === 'Hindi') return VOICE_MAP['Hindi'];
  // Narrator persona
  return VOICE_MAP[narrator] || VOICE_MAP['default'];
}

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
    customVoiceId,
    stability = 0.6,
    similarityBoost = 0.8,
    style = 0.3,
  } = req.body || {};

  if (!text || text.length < 10) {
    return res.status(400).json({ error: 'Text too short' });
  }

  // Cap text length to prevent abuse (roughly 30 min of audio at ~150 wpm)
  const maxChars = 30000;
  const trimmedText = text.slice(0, maxChars);

  const voiceId = pickVoice(narrator, language, customVoiceId);
  const model = pickModel(language);

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
             : response.status === 429 ? 'Rate limit — too many requests. Try again in a moment.'
             : `TTS failed (${response.status})`,
      });
    }

    // Stream the audio back to client
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // cache 24h

    // Pipe the response body
    const reader = response.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    };
    await pump();
  } catch (err) {
    console.error('TTS error:', err);
    return res.status(500).json({ error: 'TTS generation failed' });
  }
}
