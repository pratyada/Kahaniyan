# Immersive Audio Plan — "Pocket-FM-style" bedtime stories (start: the Garden story)

## Context / goal
Today stories play as flat AI narration. We want the Pocket FM / Audible-drama feeling:
an expressive narrator over **layered sound** — ambient beds (rain, birds, fire), spot
sound-effects on story beats, and a gentle music underscore — mixed so it's immersive but
**calming and safe for bedtime**. Pure text→AI-voice can't do this alone; the realism is
~90% **layering + level discipline + ducking**, not exotic assets. Start with ONE story —
**"The Garden Where Mistakes Grew Flowers"** (`universal_garden_of_mistakes`) — as a
repeatable pipeline, then roll out story by story.

## The 4 layers (built under the voice, in this order)
1. **Narration** — top of the hierarchy, always clearest. ElevenLabs **v3** with bedtime
   audio tags (`[softly]`, `[whispers]`, `[calm]`, `<break time="1s"/>`).
2. **Ambient bed** — continuous scene atmosphere (garden birds, evening crickets), "felt
   more than heard," loops for the scene, crossfades on scene change.
3. **Spot SFX** — discrete, gentle one-shots on beats (soft mug clink, a magical
   shimmer as the flower blooms). No sharp/startling transients at bedtime.
4. **Music underscore** — soft warm intro + very low bed + a lullaby close that fades to
   silence (descending-energy arc so the child drifts off).

## Tool stack — standardize on ElevenLabs (one API, one clean commercial license)
- **Narration:** ElevenLabs v3 (already in use) + audio tags.
- **Ambience + SFX:** ElevenLabs **Text-to-Sound v2** (`POST /v1/sound-generation`,
  `eleven_text_to_sound_v2`): `loop=true` for beds (garden/crickets), `loop=false` for
  one-shots. ~$0.12/min generated.
- **Music:** ElevenLabs **Music v2** (cleanest AI-music licensing for a kids' brand),
  ~$0.15/min. Reuse one gentle bed across many stories.
- **Supplement:** a few hero sounds from **Freesound CC0 / Pixabay** (permanent license)
  where a real recording beats generation. Avoid AudioCraft (non-commercial weights) and
  third-party Suno APIs (licensing risk).

## Mixing — the "bedtime profile" (levels tuned gentler than drama standard)
- **Levels (relative to narration = 0 dB):** spot SFX **−8 to −12 dB** · music **−14 dB**
  · ambient bed **−20 dB** (beds sit 15–25 dB under the voice).
- **Ducking:** sidechain the beds/music down **−4 to −6 dB** whenever the narrator speaks;
  restore in the pauses so the world "breathes."
- **Fades:** bed fade-in 0.5–1 s (kill clicks) + 2–3 s under-voice fades · scene
  crossfades 1–2 s · final outro fade **4–6 s into silence**.
- **Loudness:** normalize to **−16 LUFS integrated**, true-peak ceiling **−3 dBTP**, noise
  floor < −60 dB.
- **Dynamic range (the key safety setting):** compressed/narrow — no moment more than
  ~6–8 dB above the narration bed, so a half-asleep child is never jolted. **Ban impact /
  percussive SFX** from bedtime stories. (WHO: children's safe-listening ceiling is 75 dB;
  since we can't control device volume, we control OUR dynamic range.)

## Delivery — pre-mixed single track (server-side ffmpeg). NOT client-side Web Audio.
Bake narration + looped bed + timed SFX + music into ONE stereo file per story → S3 →
CloudFront. Plays through the **existing player** with zero client changes; sidesteps all
iOS Web-Audio/autoplay pitfalls; and a human can approve the final mix before publish.
(Web Audio's runtime layering is only worth it later if we want user-swappable
soundscapes.) A 7-min AAC 128k stereo mix ≈ ~6–7 MB — same order as today's narration.

**ffmpeg building blocks:** `-stream_loop -1` (loop a bed) · `adelay=ms|ms` (place an SFX
at a timestamp) · `afade`/`acrossfade` (fades) · `sidechaincompress` (duck beds under
speech, keyed by a split of the narration) · `amix=normalize=0` (sum layers) · `loudnorm=
I=-16:TP=-1.5:LRA=11` (normalize). One command renders a 7-min mix in seconds.

**Cue timing:** generate narration **with word timestamps** (ElevenLabs
`/v1/text-to-speech/{voice}/with-timestamps` → character-level `alignment`; group to
words). Auto-seed a cue sheet with word anchors → a human curates (picks the ambience,
snaps 5–8 SFX to beats, sets the music). **Automation places ~80%; a human does a ~20%
mix/pacing/startle-safety pass.**

## The Garden story — draft cue sheet (anchored to beats; seconds resolved from timestamps)
11 paragraphs → 4 scenes. Palette: gentle garden birds, evening crickets, soft breeze,
warm shimmer, low lullaby. Nothing sharp.

- **Scene 1 — The Honest Garden (paras 1–2):** BED = daytime garden (soft breeze, gentle
  bees, distant birds) @ −20 dB, fade in 1 s. MUSIC = warm intro @ −14 dB, crossfade into
  the bed after ~10 s.
- **Scene 2 — Zara & the mug (paras 3–5):** crossfade BED → cozy classroom room-tone.
  SFX: a **soft, muffled ceramic clink** on the word "shattered" (−12 dB, gentle — not a
  crash). Optional soft heartbeat felt-low under "heart was pounding" (very subtle).
- **Scene 3 — Confession & the flower (paras 6–8):** crossfade BED → twilight garden
  (crickets, soft wind). SFX: a low **earth "tremble"** + a warm **magical shimmer/chime**
  as the flower blooms ("a flower bloomed — bright orange…"), −8 to −10 dB, soft attack.
- **Scene 4 — Her flourishing corner + bedtime (paras 9–11):** night-garden bed (soft
  crickets/wind); MUSIC swells gently to a **lullaby** under the final paragraph and
  **fades to silence over 5 s** on "…turns them into flowers."

Cue-sheet JSON shape (drives ffmpeg now, could drive Web Audio later): per the schema in
research — `narration`, `beds[]` (asset, gain, start/end, loop, fades, duck), `music[]`,
`sfx[]` (asset, atSec, gain, word `anchor`), `loudnessTargetLUFS: -16`.

## Pipeline / architecture (Phase 1 = this one story, re-runnable)
1. Generate v3 narration **with timestamps** → save WAV + `alignment` JSON.
2. Generate/collect the beds, SFX, music (ElevenLabs SFX/Music; a couple of CC0 heroes) →
   store in an S3 audio-library (`media/audio-library/…`) — generate-once, reuse forever.
3. Author `garden.cues.json` (auto-seeded from timestamps, human-curated).
4. **Renderer:** a Node script that reads the cue sheet, emits the ffmpeg `-filter_complex`
   graph, and outputs `story_garden_immersive.m4a` (AAC 128k) → S3 (content-hashed key,
   `Cache-Control: immutable`). Run in a script/GitHub Action (simplest) or a Lambda with a
   static-ffmpeg layer.
5. **Human review gate** — listen once (mix balance, pacing, startle-safety) before publish.
6. **Playback:** point the garden story's audio at the immersive file, or add an
   "Immersive ✨" toggle in the player that swaps `src` (like the Classic⇄Enhanced toggle),
   plus a user **"background level"** control (preferred dialogue-to-background differs a
   lot between people).

## Cost (ElevenLabs, ~5–7 min story)
Narration ~$0.40 · music bed ~$0.15–0.30 (reused) · ambience ~$0.12–0.24 (reused) · 5–8
SFX ~$0.10–0.20 → **~$0.80–1.10 for story #1; ~$0.40 each after** (beds/music/common SFX
are cache-and-reuse). Far cheaper than a stock subscription + manual sound-designer time.

## Rollout (story by story)
The cue sheet + renderer IS the pipeline. Each new story = author a cue sheet → render →
review → publish. Keep cue sheets + stems as source of truth so we can batch re-render the
whole catalog when we improve the mix formula. Later, Founder-AI can draft cue sheets from
the narration text.

## Kids-safety checklist (every immersive story)
Gentle continuous beds only · no percussive/impact SFX · compressed dynamic range · slow
pacing + generous pauses (beds run under the silence) · descending energy + lullaby fade ·
−16 LUFS / −3 dBTP · run narration + SFX through our soft-language & cultural-image rules.

## Verification
Render the garden mix → listen end-to-end on phone + laptop at a normal volume: narration
always clear over the beds; SFX land on the right words and never startle; scene
crossfades are smooth; the ending fades gently to silence; measured loudness ≈ −16 LUFS,
peaks ≤ −3 dBTP. Confirm the existing player streams the single file with instant seek.

## Open decisions for Prat
- Approve spending ElevenLabs credits to generate the garden assets (~$1).
- Immersive as the garden's default audio, or a toggle (recommend a toggle first for A/B).
- Where to render: GitHub Action/script (simplest) vs Lambda ffmpeg layer (in publish flow).
