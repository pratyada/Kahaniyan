# Multilingual Story Demo — My Sleepy Tale

One story. Nine languages. A demo of My Sleepy Tale's multilingual bedtime story engine.

## Languages
English, French, Hindi, Arabic, Spanish, Chinese (Mandarin), Polish, Hungarian, Tamil

## Setup

### 1. Environment Variables
```bash
export ANTHROPIC_API_KEY=your_key_here
export ELEVENLABS_API_KEY=your_key_here
```

### 2. Configure Voice IDs
Edit `story.json` — replace each language's `voiceId` with your actual ElevenLabs voice ID.

### 3. Generate Translations + Audio
```bash
node generate.mjs
```
This translates the story into 8 languages and generates 9 MP3 files.
Re-running skips languages whose MP3 already exists.

### 4. Run the Demo
```bash
# Any static server works
npx serve .
# Then open http://localhost:3000/player/
```

## Adding a Language
1. Add an entry to `story.json` → `languages` array
2. Re-run `node generate.mjs`
3. The player auto-discovers it from `config.json`

## Architecture
- `story.json` — source of truth (story + language config)
- `generate.mjs` — one-time script (translate via Claude + TTS via ElevenLabs)
- `config.json` — generated output (translations + audio paths)
- `player/` — static player UI (no API calls at runtime)
