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

  // Split long text into chunks and generate in parallel to stay under 30s
  const MAX_CHUNK = 3000; // chars per chunk — ElevenLabs handles ~3000 chars in ~12s
  const fullText = text.slice(0, 10000);

  const generateChunk = async (chunk) => {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.id}`, {
      method: 'POST',
      headers: { 'xi-api-key': ELEVENLABS_KEY, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg' },
      body: JSON.stringify({ text: chunk, model_id: model, voice_settings: { stability, similarity_boost: similarity, style: 0.3, use_speaker_boost: true } }),
    });
    if (!r.ok) throw new Error(`ElevenLabs ${r.status}: ${await r.text()}`);
    return Buffer.from(await r.arrayBuffer());
  };

  try {
    let audioBuffer;
    if (fullText.length <= MAX_CHUNK) {
      // Short text — single request
      audioBuffer = await generateChunk(fullText);
    } else {
      // Long text — split at paragraph boundaries, generate in parallel
      const midpoint = Math.floor(fullText.length / 2);
      let splitAt = fullText.lastIndexOf('\n\n', midpoint);
      if (splitAt < fullText.length * 0.3) splitAt = fullText.lastIndexOf('. ', midpoint) + 1;
      if (splitAt < fullText.length * 0.3) splitAt = midpoint;

      const chunk1 = fullText.slice(0, splitAt).trim();
      const chunk2 = fullText.slice(splitAt).trim();

      const [buf1, buf2] = await Promise.all([generateChunk(chunk1), generateChunk(chunk2)]);
      audioBuffer = Buffer.concat([buf1, buf2]);
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.setHeader('X-Voice-Used', voiceConfig.name);
    res.end(audioBuffer);
  } catch (err) {
    console.error('ElevenLabs error:', err);
    return res.status(500).json({ error: 'Audio generation failed' });
  }
}

// Export voices list for admin panel
export const VOICE_LIST = VOICES;
