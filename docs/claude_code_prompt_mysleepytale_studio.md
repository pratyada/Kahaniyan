# Claude Code Prompt — "mysleepytale Studio" (content generation pipeline)

> Paste everything below into Claude Code. It tells Claude Code to build a local pipeline that
> turns the 30-day plan spreadsheet into ready-to-post Instagram Reels + creatives, using
> Nano Banana (images) and OpenAI TTS (voice). Posting to socials is a **later** phase — scaffold only.

---

## ROLE & GOAL

You are building a small, reliable Python project called **mysleepytale-studio**. It reads my
30-day content plan (an Excel file) and, for any day or range of days, automatically produces:

1. A **10-second vertical Reel** (1080×1920 MP4): a calming AI-generated visual with slow
   "Ken Burns" motion, a soft AI voiceover, gentle background ambience, and burned-in captions.
2. A **feed cover / creative** (1080×1350 and 1080×1080 versions): the story title + brand mark.
3. A **ready-to-post caption file** (caption + CTA + hashtags) for that day.

All outputs land in `output/dayNN/`. The product is sleep/bedtime stories, so everything must feel
**slow, warm, dark, and soothing** — no fast cuts, no bright colors, no hype.

**Before you write code, check the current official docs** for each API below (model IDs and request
shapes change). I'm giving you the IDs that are correct as of now; verify, then implement.

---

## TECH STACK (verified current IDs — confirm against docs, then use)

- **Images — "Nano Banana" = Google Gemini image models** via the Gemini API (`google-genai` SDK):
  - Default: `gemini-2.5-flash-image` (Nano Banana — cheap, ~$0.039/img, free tier ~500/day in AI Studio)
  - Better: `gemini-3.1-flash-image-preview` (Nano Banana 2)
  - For covers with crisp text: `gemini-3-pro-image-preview` (Nano Banana Pro — best text rendering)
  - Make the model tier configurable. Note: outputs carry a SynthID watermark.
- **Voice — OpenAI TTS**: model `gpt-4o-mini-tts` (steerable). Use the `instructions` field to control
  *how* it speaks. Voices to try: `coral`, `nova`, `shimmer`, `sage`, `ballad` (pick a soft one).
  ~ $0.015/min. NOTE: OpenAI policy requires disclosing the voice is AI-generated — add a small
  "AI narration" note in the caption template.
- **Captions/alignment**: get word timings by transcribing the generated audio with
  `gpt-4o-mini-transcribe` (or local `faster-whisper` / `stable-ts`). Build a styled `.ass` subtitle.
  Fallback: distribute the script's lines evenly across the audio duration.
- **Video assembly**: `ffmpeg` (system binary) — composite image + Ken Burns (`zoompan`), mix audio,
  burn captions, fade in/out, normalize loudness.
- **Other libs**: `openpyxl` or `pandas` (read the plan), `Pillow` (cover text overlay — more reliable
  than asking an image model to render text), `pydub`, `pyyaml`, `python-dotenv`, `tenacity` (retries),
  `rich` (progress/logging).

---

## INPUT FILE

`content/plan.xlsx` (I will drop it in). Read these sheets (match loosely by name, they contain emoji):

- **"📸 Instagram"** — columns: `Day`, `Date`, `Story / Post`, `Reel concept (the 10-sec visual)`,
  `Voiceover / on-screen text`, `Caption`, `CTA`, `Hashtags`, `Status`.
- **"✖️ Platform X"** — columns: `Day`, `Date`, `Pillar`, `Format`, `Post (copy & paste)`, `Status`.

For the Reels pipeline you only need the Instagram sheet. The voiceover text is in the
`Voiceover / on-screen text` column (it's wrapped in “smart quotes” — strip them). The visual brief is
in `Reel concept`. Some rows are marked `[VARIETY]` (polls/tips/testimonials) — for those, still make a
visual + caption, but skip the voiceover/Ken-Burns story treatment and instead render the on-screen
text as bold centered captions over a calm background.

---

## PROJECT STRUCTURE

```
mysleepytale-studio/
  .env.example            # GEMINI_API_KEY=, OPENAI_API_KEY=
  config.yaml             # model tiers, voice, brand colors/fonts, resolution, duration, music dir
  requirements.txt
  README.md               # setup + usage, written for a non-developer
  content/plan.xlsx       # I provide this
  assets/
    music/                # I will add royalty-free ambient loops (.mp3) — pick one at random or per-mood
    fonts/                # brand font(s)
    logo.png              # optional brand mark
  src/
    config.py             # load config.yaml + .env
    plan.py               # read the spreadsheet -> list of Day objects
    images.py             # Nano Banana: scene image(s) at 9:16
    voice.py              # OpenAI TTS: script -> narration.wav (+ instructions for slow warm tone)
    captions.py           # align audio -> styled .ass
    cover.py              # Pillow: title + brand on generated art -> 4:5 and 1:1
    reel.py               # ffmpeg: assemble final 1080x1920 mp4
    pipeline.py           # orchestrate one day; handle --range/--all/--only-todo
    cli.py                # argparse entry point
  output/
    day01/  image.png  narration.wav  captions.ass  reel.mp4  cover_4x5.png  cover_1x1.png  caption.txt  manifest.json
```

---

## PIPELINE (per day)

1. **Read** the day's row from the Instagram sheet.
2. **Image** (`images.py`): build a Nano Banana prompt from the `Reel concept`, prefixed with a fixed
   style preamble — e.g. *"Cinematic, calm, nighttime, soft warm low light, muted desaturated palette,
   dreamy, gentle, no people's faces, no text, vertical 9:16 composition."* Request a 9:16 image; if the
   model returns another ratio, crop/pad to 1080×1920. Save `image.png`. (Optional: generate 2 frames for
   a subtle dissolve.)
3. **Voice** (`voice.py`): call `gpt-4o-mini-tts` with the voiceover text and
   `instructions="Speak very slowly and softly, in a warm, hushed, near-whisper bedtime tone. Long, calm
   pauses between sentences. Soothing and unhurried, like reading someone to sleep."` Use `speed≈0.9`.
   Output `narration.wav`. Skip for `[VARIETY]` rows.
4. **Captions** (`captions.py`): transcribe `narration.wav` for word timings → build a styled `.ass`
   (large, soft white text, centered, gentle fade per line, lower third). Fallback to even line timing.
5. **Reel** (`reel.py`) with ffmpeg:
   - Base = `image.png` scaled to 1080×1920, slow `zoompan` (very gentle zoom-in or pan).
   - Duration = length of narration, clamped to **7–15s** (target ~10s). If shorter, hold + fade.
   - Audio = narration mixed with a randomly chosen ambient loop from `assets/music/`, music ducked
     low (sidechain or static -18 to -22 LUFS under voice), both fading in/out.
   - Burn in the `.ass` captions. Add 0.5s video fade in/out. Normalize loudness (`loudnorm`).
   - **Config toggle `music_mode`**: `full` (mixed music) OR `voice_only` (so I can add trending audio
     inside the Instagram app for better reach). Default `voice_only` + a separate ambient bed file.
6. **Cover** (`cover.py`): take `image.png` (or a fresh Nano Banana Pro render), darken with a gradient,
   overlay the **story title** in the brand font + small "mysleepytale 🌙" mark using **Pillow** (don't
   rely on the image model for text). Export 1080×1350 and 1080×1080.
7. **Caption file**: write `caption.txt` = `Caption` + blank line + `CTA` + blank line + `Hashtags`
   + a one-line "🎧 AI narration" disclosure. 
8. **manifest.json**: record inputs, model IDs used, costs estimate, file paths, timestamp.

---

## CLI / UX REQUIREMENTS

- `python -m src.cli --day 1` → build day 1.
- `--range 1-7`, `--all`, `--only-todo` (skip days whose `output/dayNN/reel.mp4` already exists).
- `--dry-run` → print an itemized **cost + API-call estimate** and the prompts, generate nothing.
- `--force` → regenerate even if outputs exist. Otherwise each step is **idempotent** (skip if output
  present) so reruns are cheap.
- Retries with backoff (`tenacity`) on API/network errors; clear `rich` progress + a final summary table.
- Never hardcode keys; load from `.env`. Fail with a friendly message if a key is missing.
- Keep total cost low by default (Nano Banana flash tier + mini TTS). Print running cost.

---

## ACCEPTANCE CRITERIA

- `pip install -r requirements.txt` + `ffmpeg` installed → `python -m src.cli --day 1` produces a
  playable ~10s 1080×1920 `reel.mp4` with audible soft narration, readable captions, and gentle motion;
  plus `cover_4x5.png`, `cover_1x1.png`, and `caption.txt`.
- `--all` builds all 30 days into `output/dayNN/` without manual steps.
- `--dry-run` prints a believable cost estimate and exits without calling paid APIs.
- README explains, for a non-developer: how to get a **Gemini API key** and an **OpenAI API key**,
  where to put ambient music, and the exact commands to run. Include a troubleshooting section
  (ffmpeg missing, font missing, rate limits, aspect-ratio fixes).

Build it step by step, test on **day 1 first**, show me the output, then generalize to all 30 days.
Ask me before installing anything heavy (e.g. local whisper) — offer the lighter API-transcription path.

---

## PHASE 2 — POSTING (SCAFFOLD ONLY, DO NOT IMPLEMENT YET)

I will ask you to build auto-posting later. For now, just create `src/post.py` as a **stub with TODOs**
and document the real-world plan in the README so outputs are already post-ready:

- **Instagram (Reels)**: requires the **Instagram Graph API** — an Instagram **Business/Creator** account
  linked to a Facebook Page, a Meta developer app, and a long-lived access token. Publishing is two steps
  (create a media container pointing at a **publicly hosted** MP4 URL → publish), so the pipeline will need
  to upload the MP4 to a public URL/bucket first. Mind the ~25-posts/24h limit.
- **Platform X**: requires the **X API v2** with a **paid tier** that allows media upload + posting
  (upload media → create post). Threads = chained replies.
- **Easier alternative**: push the finished files + captions into a scheduler (Later/Buffer/Metricool)
  — some offer APIs (often gated), or import via their UI. Note which is realistic.
- Structure `manifest.json` and `caption.txt` now so a future poster can consume them directly.

Just leave clear TODOs and the notes above — don't build the posting integrations in this pass.
