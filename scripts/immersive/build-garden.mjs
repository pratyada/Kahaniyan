// Build an immersive, pre-mixed audio track for the Garden story.
// Generates (ElevenLabs): v3 narration with word timestamps + gentle ambience bed +
// soft music bed + 2 spot SFX; then mixes them with ffmpeg (looped/ducked/normalized)
// into ONE bedtime-safe file. Local Phase-1 pipeline; assets go to a scratch dir.
//
// Usage: node scripts/immersive/build-garden.mjs
// Env:   ELEVENLABS_API_KEY (read from .env.prod if not in env)
import fs from 'fs';
import { execFileSync } from 'child_process';

const OUT_DIR = '/private/tmp/claude-501/-Users-prat-Documents-sudo-kahaniyan/6df67bbe-b272-47a6-a1eb-c7d94d917ea0/scratchpad/immersive';
const VOICE = 'JBFqnCBsd6RMkjVDRZzb'; // George — warm storyteller
const API = 'https://api.elevenlabs.io';

function key() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  const env = fs.readFileSync('/Users/prat/Documents/sudo/kahaniyan/.env.prod', 'utf8');
  const line = env.split('\n').find((l) => l.startsWith('ELEVENLABS_API_KEY='));
  return line ? line.slice('ELEVENLABS_API_KEY='.length).replace(/^["']|["']$/g, '').trim() : '';
}
const KEY = key();
if (!KEY) { console.error('No ELEVENLABS_API_KEY'); process.exit(1); }

// Bedtime narration — gentle, calm. {childName} → little one.
const TEXT = `In a village between two hills, there was a garden unlike any other. It was called the Honest Garden, and it had one magical rule: every time someone told the truth about a mistake they had made, a flower grew.

But if someone told a lie to cover up a mistake, a weed appeared instead.

A girl named Zara walked past the garden every day on her way to school. One morning, she accidentally knocked over her teacher's favourite mug. It shattered into a dozen pieces.

No one saw it happen.

Zara's heart was pounding. She could walk away. She could blame the wind. She could say she never touched it.

But that evening, she walked into the Honest Garden and whispered to the soil: "I broke Mrs. Rao's mug. I was scared to tell her. But I did it."

The ground trembled. And right where Zara stood, a flower bloomed — bright orange, with petals that glowed like little flames. It was the most beautiful flower in the entire garden.

The next day, Zara told her teacher the truth. Mrs. Rao was quiet for a moment. Then she said, "Thank you for telling me, Zara. The mug can be replaced. Your honesty cannot."

Over the years, Zara visited the garden many times. She admitted when she forgot her homework. She admitted when she said something unkind. She admitted when she was wrong.

And her corner of the garden became the most beautiful of all — not because she never made mistakes, but because she never hid from them.

That night, little one, remember Zara's garden. Mistakes are seeds. Lies turn them into weeds. But the truth — even when it's hard — turns them into flowers.`;

async function post(path, body) {
  const r = await fetch(`${API}${path}`, { method: 'POST', headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`${path} → ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r;
}

async function narrate() {
  console.log('· narration (v3, with timestamps)…');
  const r = await post(`/v1/text-to-speech/${VOICE}/with-timestamps`, {
    text: TEXT, model_id: 'eleven_v3',
    voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.15, use_speaker_boost: true },
  });
  const d = await r.json();
  fs.writeFileSync(`${OUT_DIR}/narration.mp3`, Buffer.from(d.audio_base64, 'base64'));
  const a = d.alignment || d.normalized_alignment;
  const chars = a.characters;
  const starts = a.character_start_times_seconds;
  const ends = a.character_end_times_seconds;
  const full = chars.join('');
  const total = ends[ends.length - 1];
  const timeAt = (needle, which = 'start') => {
    const i = full.indexOf(needle);
    if (i < 0) return null;
    return (which === 'end' ? ends[Math.min(i + needle.length - 1, ends.length - 1)] : starts[i]);
  };
  return { total, timeAt };
}

async function sfx(name, prompt, duration, loop) {
  console.log(`· sfx/bed: ${name}…`);
  const r = await post('/v1/sound-generation', { text: prompt, duration_seconds: duration, prompt_influence: 0.4, loop, model_id: 'eleven_text_to_sound_v2' });
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(`${OUT_DIR}/${name}.mp3`, buf);
}

(async () => {
  const { total, timeAt } = await narrate();
  // Anchor the two spot SFX to their story beats (fallbacks if not found).
  const tShatter = timeAt('shattered', 'end') ?? total * 0.22;
  const tBloom = timeAt('a flower bloomed', 'start') ?? timeAt('bloomed', 'start') ?? total * 0.6;
  console.log(`  narration total=${total.toFixed(1)}s  mug@${tShatter.toFixed(1)}s  bloom@${tBloom.toFixed(1)}s`);

  await sfx('bed', 'gentle continuous garden ambience at dusk, soft warm breeze, distant birds, faint crickets, calm and soothing, no music', 22, true);
  await sfx('music', 'soft slow warm lullaby, gentle music box and mellow pads, calm, sleepy, low and quiet', 22, true);
  await sfx('sfx_mug', 'a soft muffled ceramic mug gently breaking on a floor, low and gentle, not loud', 2, false);
  await sfx('sfx_bloom', 'a warm magical sparkle shimmer, gentle chime blooming, soft and dreamy', 3, false);

  // ── Mix with ffmpeg — bedtime profile: bed ~-20dB, music ~-14dB, SFX ~-9dB, ducked
  // under the voice, looped to length, normalized to -16 LUFS, gentle outro fade. ──
  const dur = Math.ceil(total) + 2;
  const fadeBed = Math.max(0, total - 3).toFixed(2);
  const fadeMus = Math.max(0, total - 6).toFixed(2);
  const fc = [
    '[0:a]asplit=3[nmix][nk1][nk2]',
    `[1:a]volume=0.14,afade=t=in:st=0:d=1,afade=t=out:st=${fadeBed}:d=3[bed0]`,
    '[bed0][nk1]sidechaincompress=threshold=0.05:ratio=6:attack=40:release=400[bedd]',
    `[2:a]volume=0.22,afade=t=in:st=0:d=2,afade=t=out:st=${fadeMus}:d=6[mus0]`,
    '[mus0][nk2]sidechaincompress=threshold=0.05:ratio=8:attack=40:release=400[musd]',
    `[3:a]adelay=${Math.round(tShatter * 1000)}|${Math.round(tShatter * 1000)},volume=0.45[s1]`,
    `[4:a]adelay=${Math.round(tBloom * 1000)}|${Math.round(tBloom * 1000)},volume=0.5[s2]`,
    '[nmix][bedd][musd][s1][s2]amix=inputs=5:normalize=0:dropout_transition=0[mx]',
    '[mx]loudnorm=I=-16:TP=-1.5:LRA=11[out]',
  ].join(';');

  const args = [
    '-y',
    '-i', `${OUT_DIR}/narration.mp3`,
    '-stream_loop', '-1', '-i', `${OUT_DIR}/bed.mp3`,
    '-stream_loop', '-1', '-i', `${OUT_DIR}/music.mp3`,
    '-i', `${OUT_DIR}/sfx_mug.mp3`,
    '-i', `${OUT_DIR}/sfx_bloom.mp3`,
    '-filter_complex', fc,
    '-map', '[out]', '-t', String(dur), '-c:a', 'aac', '-b:a', '128k',
    `${OUT_DIR}/garden_immersive.m4a`,
  ];
  console.log('· mixing with ffmpeg…');
  execFileSync('ffmpeg', args, { stdio: ['ignore', 'ignore', 'inherit'] });
  console.log(`\n✅ done → ${OUT_DIR}/garden_immersive.m4a`);
})();
