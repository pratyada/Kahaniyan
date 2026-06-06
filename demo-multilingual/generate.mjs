import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUDIO_DIR = path.join(__dirname, 'audio');
const STORY_PATH = path.join(__dirname, 'story.json');
const CONFIG_PATH = path.join(__dirname, 'config.json');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY environment variable');
  process.exit(1);
}
if (!ELEVENLABS_API_KEY) {
  console.error('Missing ELEVENLABS_API_KEY environment variable');
  process.exit(1);
}

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Read story config
const story = JSON.parse(fs.readFileSync(STORY_PATH, 'utf-8'));
const { title, storyId, baseLanguage, baseText, languages } = story;

/**
 * Translate text to target language using Claude API
 */
async function translateText(text, targetLanguage) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: `You are a professional translator. Translate the following children's bedtime story into ${targetLanguage}. Keep the gentle, calming bedtime tone. Keep paragraph breaks. Keep the {childName} placeholder exactly as-is — do not translate it. Output ONLY the translated text, nothing else.`,
      messages: [{ role: 'user', content: text }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data.content[0].text;
}

/**
 * Generate TTS audio via ElevenLabs
 */
async function generateAudio(text, voiceId) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.6,
        similarity_boost: 0.75,
        style: 0.3,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs API error (${res.status}): ${err}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Process a single language
 */
async function processLanguage(lang) {
  const audioFilename = `${storyId}_${lang.code}.mp3`;
  const audioPath = path.join(AUDIO_DIR, audioFilename);

  // Skip if MP3 already exists
  if (fs.existsSync(audioPath)) {
    console.log(`  [${lang.code}] ${lang.displayName} — MP3 exists, skipping`);
    // Read existing config to get cached translation if available
    if (fs.existsSync(CONFIG_PATH)) {
      const existing = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
      const cached = existing.languages?.find(l => l.code === lang.code);
      if (cached?.text) {
        return { ...lang, text: cached.text, audioFile: `audio/${audioFilename}` };
      }
    }
    // If English or no cached translation, use base text
    const text = lang.code === baseLanguage ? baseText : '[translation cached — re-delete MP3 to regenerate]';
    return { ...lang, text, audioFile: `audio/${audioFilename}` };
  }

  let storyText;

  if (lang.code === baseLanguage) {
    console.log(`  [${lang.code}] ${lang.displayName} — generating audio (base language)`);
    storyText = baseText;
  } else {
    console.log(`  [${lang.code}] ${lang.displayName} — translating...`);
    storyText = await translateText(baseText, lang.displayName);
    console.log(`  [${lang.code}] ${lang.displayName} — translation done (${storyText.length} chars)`);
  }

  console.log(`  [${lang.code}] ${lang.displayName} — generating audio...`);
  const audioBuffer = await generateAudio(storyText, lang.voiceId);
  fs.writeFileSync(audioPath, audioBuffer);
  console.log(`  [${lang.code}] ${lang.displayName} — saved ${audioFilename} (${(audioBuffer.length / 1024).toFixed(0)} KB)`);

  return { ...lang, text: storyText, audioFile: `audio/${audioFilename}` };
}

// Main
console.log(`\nGenerating multilingual story: "${title}"`);
console.log(`Languages: ${languages.map(l => l.displayName).join(', ')}\n`);

const results = [];

for (const lang of languages) {
  try {
    const result = await processLanguage(lang);
    results.push(result);
  } catch (err) {
    console.error(`  [${lang.code}] ${lang.displayName} — FAILED: ${err.message}`);
    results.push({ ...lang, text: null, audioFile: null, error: err.message });
  }
}

// Write config.json
const config = {
  title,
  storyId,
  generatedAt: new Date().toISOString(),
  languages: results,
};

fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
console.log(`\nWrote config.json`);

const successful = results.filter(r => !r.error).length;
const failed = results.filter(r => r.error).length;
console.log(`Done: ${successful} succeeded, ${failed} failed\n`);
