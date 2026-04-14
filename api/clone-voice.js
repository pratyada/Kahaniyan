// ElevenLabs Voice Cloning — creates a cloned voice from an audio sample.
// Accepts audio as base64 or fetches from Firebase Storage URL.

const ELEVENLABS_KEY = process.env.ELEVENLABS_API_KEY;

export const config = { api: { bodyParser: { sizeLimit: '6mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!ELEVENLABS_KEY) {
    return res.status(503).json({ error: 'ElevenLabs not configured' });
  }

  const { name, audioBase64, audioUrl, language, description } = req.body || {};

  if (!name) {
    return res.status(400).json({ error: 'Voice name is required' });
  }

  try {
    let audioBuffer;

    if (audioBase64) {
      // Audio sent as base64
      audioBuffer = Buffer.from(audioBase64, 'base64');
    } else if (audioUrl) {
      // Fetch audio from Firebase Storage URL
      const audioRes = await fetch(audioUrl);
      if (!audioRes.ok) throw new Error('Failed to fetch audio from storage');
      audioBuffer = Buffer.from(await audioRes.arrayBuffer());
    } else {
      return res.status(400).json({ error: 'Audio data required (audioBase64 or audioUrl)' });
    }

    // Create form data for ElevenLabs API
    const formData = new FormData();
    formData.append('name', `Qissaa - ${name}`);
    formData.append('description', description || `Voice clone for ${name} (${language || 'English'})`);
    formData.append('files', new Blob([audioBuffer], { type: 'audio/webm' }), `${name}.webm`);

    const response = await fetch('https://api.elevenlabs.io/v1/voices/add', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('ElevenLabs clone error:', response.status, err);
      return res.status(response.status).json({
        error: response.status === 401 ? 'Invalid API key'
             : response.status === 429 ? 'Rate limit reached'
             : `Voice cloning failed (${response.status})`,
      });
    }

    const data = await response.json();

    return res.status(200).json({
      voiceId: data.voice_id,
      name: data.name,
    });
  } catch (err) {
    console.error('Clone voice error:', err);
    return res.status(500).json({ error: 'Voice cloning failed' });
  }
}
