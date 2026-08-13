// POST /api/content-validate — AI safety check for kid-created content
// Step 1: Whisper transcription (audio → text)
// Step 2: Claude safety filter (check for inappropriate content)
// Returns: { safe, transcript, reason }

import { getFirestore } from './_firebase.js';

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

// Transcribe audio with Whisper
async function transcribeAudio(audioBase64, contentType = 'audio/webm') {
  if (!OPENAI_KEY) throw new Error('OpenAI not configured');

  const ext = contentType.includes('mp4') ? 'mp4' : contentType.includes('webm') ? 'webm' : 'wav';
  const blob = Buffer.from(audioBase64, 'base64');

  // Create form data for Whisper API
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const formParts = [
    `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="recording.${ext}"\r\nContent-Type: ${contentType}\r\n\r\n`,
    blob,
    `\r\n--${boundary}\r\nContent-Disposition: form-data; name="model"\r\n\r\nwhisper-1\r\n--${boundary}--\r\n`,
  ];

  const body = Buffer.concat([
    Buffer.from(formParts[0]),
    formParts[1],
    Buffer.from(formParts[2]),
  ]);

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_KEY}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Whisper error: ${res.status} ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.text || '';
}

// Safety check with Claude
async function checkSafety(transcript, kidAge = 7) {
  if (!ANTHROPIC_KEY) return { safe: true, reason: 'No AI key — skipping safety check' };

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 300,
      system: `You are a content safety filter for a children's storytelling platform (ages 3-10).
Analyze the transcript of a story recorded by a ${kidAge}-year-old child.

Check for:
1. Profanity, slang, or foul language
2. Violence, weapons, or harmful actions
3. Nudity or sexual references
4. Bullying, mean language, or name-calling
5. Personal information (addresses, phone numbers, last names, school names)
6. Scary content inappropriate for young children (graphic descriptions of death, horror)

Return ONLY valid JSON:
{
  "safe": true/false,
  "reason": "Brief explanation if unsafe, or 'Content is appropriate for children' if safe",
  "flags": ["list of specific issues found, empty if safe"]
}

Be age-appropriate in your judgment — a child saying "the monster was scary" is fine. A child describing graphic violence is not. Kids being silly or making sound effects is fine.`,
      messages: [{ role: 'user', content: `Transcript of a story by a ${kidAge}-year-old:\n\n"${transcript}"` }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('[content-validate] Claude error:', err.slice(0, 200));
    return { safe: true, reason: 'Safety check unavailable — allowing with parent review' };
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch {}

  return { safe: true, reason: 'Could not parse safety response — allowing with parent review' };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { audioBase64, contentType, kidAge, text } = req.body || {};

  // If text is provided directly (already transcribed), just run safety check
  if (text) {
    const safety = await checkSafety(text, kidAge || 7);
    return res.json({ transcript: text, ...safety });
  }

  // Full flow: transcribe + validate
  if (!audioBase64) return res.status(400).json({ error: 'audioBase64 or text required' });

  try {
    const transcript = await transcribeAudio(audioBase64, contentType || 'audio/webm');
    if (!transcript || transcript.trim().length < 5) {
      return res.json({ safe: false, transcript: '', reason: 'Could not hear any words. Try recording again!' });
    }

    const safety = await checkSafety(transcript, kidAge || 7);
    return res.json({ transcript, ...safety });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
