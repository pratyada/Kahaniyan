# My Sleepy Tale — Newsletter Style Rule (GLOBAL, always apply)

> **THE canonical FORMAT to reuse every time:** `newsletter-templates/storybook-format.html`.
> Every Raksha/Prateek newsletter uses this exact structure — copy it and swap only the hero
> image, intro, the 4 equal-size tip cards, the story card(s), and the sender name.
> Block order: masthead → eyebrow → HERO IMAGE → warm intro → (optional) 2×2 equal-size tip
> diagram (fixed `height:150px`) → story card(s) → sign-off `— {Sender}, My Sleepy Tale` → unsubscribe.


**This is the standing rule for EVERY My Sleepy Tale newsletter.** Any generator (Raksha,
Prateek, or an AI session) applies this automatically. Do NOT ask for it to be re-specified —
the only per-send inputs are (1) this week's content and (2) the sender's name.

## The one-line identity
> It is a newsletter from a **bedtime-story app for small children.** It must feel like opening
> a storybook at night — warm, gentle, wondrous, playful — **never** a plain corporate email.

If it could be mistaken for a SaaS/business newsletter, it's wrong. Redo it.

## Non-negotiable visual system (this is the house style — reuse it)
- **Cozy "night" theme:** near-black background `#0a0a0f`, warm gold accent `#f0a500`, a 🌙 masthead ("🌙 My Sleepy Tale").
- **Storybook type:** a serif display (Fraunces / Georgia) for titles + a friendly sans (DM Sans / Arial) for body.
- **Card-based, image-led:** every item is a rounded card (18px) = **big hero IMAGE → short kicker → title → 1–2 sentence blurb → ONE clear gold button.** Never walls of text.
- **Every item MUST have an image.** Options, in order of preference:
  1. A **generated branded card** (event card, story cover) via `yprateek/scripts/capture-card.mjs` → upload to `s3://mysleepytale-app/og/` → served from `mysleepytale.com/og/…`.
  2. A real story cover already hosted.
  3. Only as a last resort, a relevant Unsplash image. Never a broken/unhosted image.
- **"Intuitive / diagram" explainers:** turn any list of tips/rules/steps into a **visual mini-diagram** — numbered icon steps, illustrated sequences, or an emoji-led row — NOT a plain bullet list. Kids-app newsletters show, they don't tell.
- **Warm emoji, tastefully:** 🌙 ⭐ 🔥 ⚽ 💛 — a few, never spammy.
- Soft, rounded, generous spacing. Max width ~600px. Mobile-first.

## Tone & copy
Gentle, warm, second-person ("your little ones"), a touch of bedtime wonder. Short sentences.
Encouraging and cozy. Every send opens with a warm 1-line greeting and closes with a warm sign-off.

## Structure (default)
1. Masthead — `🌙 My Sleepy Tale`
2. Eyebrow — e.g. `Your Weekly Roundup`
3. One warm intro line
4. **2–4 image cards** (the content of the week)
5. Warm sign-off — **"— {SenderName}, My Sleepy Tale"** ({SenderName} = whoever is publishing: Raksha, Prateek…)
6. Unsubscribe footer

## Sender (per-send, not part of the style)
The **only** thing that changes the signature is the publisher's name. Default format:
`— {Name}` on its own line, then `My Sleepy Tale`. Don't treat "who signs it" as a reason to
re-describe the whole style — the style above is fixed.

## Never
- ❌ Dense paragraphs / text-only emails
- ❌ Corporate / generic / businessy look
- ❌ Stock-corporate imagery
- ❌ Images that don't load (always use guaranteed-hosted assets)
- ❌ A "list of bullet tips" where an illustrated/numbered diagram would be friendlier

## Plumbing (already set — keep using)
- Send via the pipeline: `POST mysleepytale.com/api/newsletter-send` → `save` → `sendAll`
  (auto throttle + unsubscribe + logging; agent never holds creds).
- Deliverability: DKIM + SPF + DMARC live on `mysleepytale.com`. Images are URL-hotlinked, so the
  email stays light (~5 KB) — images do not bloat it.
- **Canonical examples** (copy these): the wildfire email and the weekly digest
  (`weekly-roundup-2026-07-17-raksha`) — dark night theme, gold buttons, story-cover + event-card images.
