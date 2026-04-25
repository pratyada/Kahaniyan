// OpenAI Text-to-Speech with smart voice routing by country + belief.
// 13 voices across tts-1 and gpt-4o-mini-tts models.

const OPENAI_KEY = process.env.OPENAI_API_KEY;

// Voice mapping by region + narrator role
// tts-1 voices: alloy, ash, coral, echo, fable, nova, onyx, sage, shimmer
// gpt-4o-mini-tts adds: ballad, verse, marin, cedar (+ style instructions)
const VOICES = {
  indian: {
    narrator: { voice: 'sage', model: 'tts-1' },          // calm, perfect for bedtime
    mummy: { voice: 'coral', model: 'tts-1' },            // warm female
    daddy: { voice: 'ash', model: 'tts-1' },              // warm male
    grandfather: { voice: 'echo', model: 'tts-1' },       // mature male
    grandmother: { voice: 'shimmer', model: 'tts-1' },    // soft female
  },
  british: {
    narrator: { voice: 'fable', model: 'tts-1' },         // british accent
    mummy: { voice: 'shimmer', model: 'tts-1' },
    daddy: { voice: 'fable', model: 'tts-1' },
    grandfather: { voice: 'echo', model: 'tts-1' },
    grandmother: { voice: 'shimmer', model: 'tts-1' },
  },
  western: {
    narrator: { voice: 'sage', model: 'tts-1' },          // calm storyteller
    mummy: { voice: 'coral', model: 'tts-1' },            // warm female
    daddy: { voice: 'ash', model: 'tts-1' },              // warm male
    grandfather: { voice: 'echo', model: 'tts-1' },
    grandmother: { voice: 'shimmer', model: 'tts-1' },
  },
  arabic: {
    narrator: { voice: 'onyx', model: 'tts-1' },          // deep, resonant
    mummy: { voice: 'coral', model: 'tts-1' },
    daddy: { voice: 'onyx', model: 'tts-1' },
    grandfather: { voice: 'echo', model: 'tts-1' },
    grandmother: { voice: 'shimmer', model: 'tts-1' },
  },
  australian: {
    narrator: { voice: 'fable', model: 'tts-1' },
    mummy: { voice: 'coral', model: 'tts-1' },
    daddy: { voice: 'fable', model: 'tts-1' },
    grandfather: { voice: 'echo', model: 'tts-1' },
    grandmother: { voice: 'shimmer', model: 'tts-1' },
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
  const entry = (VOICES[region] || VOICES.western)[role] || VOICES.western.narrator;
  return entry;
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
    speed = 0.9,
  } = req.body || {};

  if (!text || text.length < 10) {
    return res.status(400).json({ error: 'Text too short' });
  }

  const maxChars = 4096;
  const trimmedText = text.slice(0, maxChars);

  const { voice, model } = pickVoice(narrator, country, beliefs);

  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`,
      },
      body: JSON.stringify({
        model,
        input: trimmedText,
        voice,
        speed: Math.max(0.25, Math.min(4.0, speed)),
        response_format: 'opus',
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

    res.setHeader('Content-Type', 'audio/ogg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('X-Voice-Used', voice);
    res.setHeader('X-Model-Used', model);

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
