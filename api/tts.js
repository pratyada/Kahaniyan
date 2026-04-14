// OpenAI Text-to-Speech with smart voice routing by country + belief.
// 6 voices: alloy, echo, fable, nova, onyx, shimmer
// ~12x cheaper than ElevenLabs. No voice cloning (added later).

const OPENAI_KEY = process.env.OPENAI_API_KEY;

// Voice mapping by region + narrator role
// OpenAI voices: alloy (neutral), echo (male), fable (british),
// nova (warm female), onyx (deep male), shimmer (soft female)
const VOICES = {
  indian: {
    narrator: 'nova',       // warm female — best for storytelling
    mummy: 'nova',
    daddy: 'onyx',          // deep, comforting male
    grandfather: 'echo',    // mature male
    grandmother: 'shimmer', // soft, gentle female
  },
  british: {
    narrator: 'fable',      // british-accented
    mummy: 'shimmer',
    daddy: 'fable',
    grandfather: 'echo',
    grandmother: 'shimmer',
  },
  western: {
    narrator: 'nova',
    mummy: 'nova',
    daddy: 'onyx',
    grandfather: 'echo',
    grandmother: 'shimmer',
  },
  arabic: {
    narrator: 'onyx',
    mummy: 'nova',
    daddy: 'onyx',
    grandfather: 'echo',
    grandmother: 'shimmer',
  },
  australian: {
    narrator: 'fable',
    mummy: 'shimmer',
    daddy: 'fable',
    grandfather: 'echo',
    grandmother: 'shimmer',
  },
};

const COUNTRY_TO_REGION = {
  IN: 'indian', GB: 'british', US: 'western', CA: 'western',
  AU: 'australian', AE: 'arabic', SG: 'indian', OTHER: 'western',
};

const BELIEF_OVERRIDE = {
  hindu: 'indian', sikh: 'indian', jain: 'indian', buddhist: 'indian',
};

const NARRATOR_TO_ROLE = {
  'AI Narrator': 'narrator', 'Mummy': 'mummy', 'Daddy': 'daddy',
  'Dada ji': 'grandfather', 'Nani ma': 'grandmother',
};

function pickVoice(narrator, country, beliefs) {
  let region = 'western';
  if (beliefs?.length > 0) {
    for (const b of beliefs) {
      if (BELIEF_OVERRIDE[b]) { region = BELIEF_OVERRIDE[b]; break; }
    }
    if (!BELIEF_OVERRIDE[beliefs[0]]) {
      region = COUNTRY_TO_REGION[country] || 'western';
    }
  } else {
    region = COUNTRY_TO_REGION[country] || 'western';
  }
  const role = NARRATOR_TO_ROLE[narrator] || 'narrator';
  return (VOICES[region] || VOICES.western)[role] || 'nova';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!OPENAI_KEY) {
    return res.status(503).json({ error: 'OpenAI TTS not configured' });
  }

  const {
    text,
    narrator = 'AI Narrator',
    language = 'English',
    country = 'OTHER',
    beliefs = [],
    speed = 1.0,
  } = req.body || {};

  if (!text || text.length < 10) {
    return res.status(400).json({ error: 'Text too short' });
  }

  // Cap text — OpenAI TTS max is 4096 chars per request.
  // For longer stories, split into chunks.
  const maxChars = 4096;
  const trimmedText = text.slice(0, maxChars);

  const voice = pickVoice(narrator, country, beliefs);

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model: 'tts-1',      // tts-1 for speed, tts-1-hd for quality
        input: trimmedText,
        voice,
        speed: Math.max(0.25, Math.min(4.0, speed)),
        response_format: 'mp3',
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('OpenAI TTS error:', response.status, err);
      return res.status(response.status).json({
        error: response.status === 401 ? 'Invalid API key'
             : response.status === 429 ? 'Rate limit — try again in a moment.'
             : response.status === 402 ? 'OpenAI billing issue — add payment method.'
             : `TTS failed (${response.status})`,
      });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('X-Voice-Used', voice);

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
