# My Sleepy Tale — Issue Log

> Living document. Every bug, UX issue, and production incident gets logged here.
> Run through this before every production release.
> Claude auto-adds issues as they're discovered during development.

---

## Status Legend
- **OPEN** — not fixed yet
- **FIXED** — fix deployed to production
- **WONTFIX** — intentional or not worth fixing
- **MONITORING** — fix deployed but needs validation

---

## Critical (App-breaking)

### ISS-001: Vite bundler crash — "Cannot access before initialization"
- **Status**: FIXED (2026-05-14)
- **Severity**: Critical — blank white screen, app unusable
- **Cause**: Inline helper functions in Home.jsx caused minification hoisting issues.
- **Fix**: Extract components to separate files.
- **Prevention**: Never define large components inline in files >500 lines.

### ISS-002: Firebase security rules expiry — all reads blocked
- **Status**: FIXED (2026-05-14)
- **Severity**: Critical — app loads but no data
- **Fix**: Published permanent security rules. Never use test-mode rules.

---

## High (Feature broken)

### ISS-003: Next episode "Play Next" crashes
- **Status**: FIXED (2026-05-18)
- **Severity**: High — clicking Play Next Episode shows loading forever
- **Cause**: `fillTokens` not imported in Player.jsx. Build succeeded but runtime crash.
- **Fix**: Added `import { fillTokens } from '../utils/storyHelpers.js'` to Player.jsx.
- **Prevention**: Runtime errors in onClick handlers don't surface until user clicks.

### ISS-004: Double audio on next episode
- **Status**: FIXED (2026-05-18)
- **Severity**: High — two voices playing simultaneously
- **Cause**: `load()` changed `current` triggering auto-play effect (audio #1), then `navigate()` created new PlayerInner (audio #2).
- **Fix**: Removed navigate approach. In-place state reset + `document.querySelectorAll('audio').forEach(a => { a.pause(); a.src = ''; })` before loading new episode.
- **Prevention**: Never navigate away and back to reload a component. Reset state in-place.

### ISS-005: Top bar disappearing during playback
- **Status**: FIXED (2026-05-18)
- **Severity**: High — back/share/close buttons scroll out of view
- **Cause**: `scrollIntoView({ block: 'center' })` in HighlightedText scrolled parent containers, not just the text box.
- **Fix**: Replaced with `container.scrollTo()` which only scrolls within the text container. Added `overflow-hidden` on player layout.

### ISS-006: WhatsApp share showing generic Unsplash image
- **Status**: FIXED (2026-05-19)
- **Severity**: High — shared links show wrong preview card
- **Root Causes** (3 layered issues):
  1. CloudFront `/api/*` behavior forwarded all headers including `Host` — API Gateway rejected requests. Fix: forward only `Content-Type`, `Accept`, `Origin`.
  2. Firebase Admin SDK in Lambda had no credentials. Fix: switched to Firestore REST API.
  3. `share.js` only checked `wisdomImages`, not `wisdomGallery`. Fix: check both.
- **Prevention**: Always test share links end-to-end after changes.

### ISS-007: Series episodes using OpenAI TTS instead of ElevenLabs
- **Status**: FIXED (2026-05-19)
- **Severity**: High — pre-generated ElevenLabs audio not used
- **Cause**: `SeriesDetail.jsx` didn't fetch `wisdomAudio` from Firestore or pass `audioUrl` in `load()`.
- **Fix**: Added Firestore audio fetch + pass `audioUrl: audioUrls[episode.id]` in `playEpisode()`.

### ISS-008: Share link redirects to Home — story not found
- **Status**: FIXED (2026-05-19)
- **Severity**: High — shared story links don't play
- **Cause**: `loadSharedStory()` checked Firestore `sharedStories` first (partial data), then `CULTURAL_LESSONS`. Series episodes not checked at all.
- **Fix**: Reordered: check series first → wisdom stories → Firestore sharedStories last.

### ISS-009: Series images not loading on navigation (only on refresh)
- **Status**: FIXED (2026-05-19)
- **Severity**: High — SeriesDetail shows gradient instead of photos on client-side navigation
- **Cause**: Firestore fetch slow, page renders with empty state.
- **Fix**: Initialize `coverImages` and `audioUrls` from localStorage cache (`mst:cache:wisdomImages`).

### ISS-021: Trailing double comma in series.js crashes app
- **Status**: FIXED (2026-05-26)
- **Severity**: High — app crashes on load
- **Cause**: Merge script left `},,` at end of SERIES array, creating undefined entry. SeriesShelf crashed on `.episodes` of undefined.
- **Fix**: Removed double comma. Added pre-deploy check for undefined array entries.
- **Prevention**: pre-deploy-check.sh now validates all data arrays.

### ISS-022: Story generation 503 timeout
- **Status**: FIXED (2026-05-27)
- **Severity**: High — story generation fails for all users
- **Cause**: Claude Sonnet took 31-50s, exceeding API Gateway 30s hard limit.
- **Fix**: Switched to Claude Haiku (19-23s). Added Lambda warmup (every 5min). Increased Lambda memory to 2GB.

### ISS-023: ElevenLabs quota exceeded — bulk audio fails silently
- **Status**: FIXED (2026-05-26)
- **Severity**: High — bulk audio generation silently fails
- **Cause**: Free plan ran out of credits. Admin bulk buttons showed 401 with no useful message.
- **Fix**: Script auto-stops on quota_exceeded. Added per-episode voice selection in bulk.

### ISS-024: OG image not showing on WhatsApp
- **Status**: FIXED (2026-05-22)
- **Severity**: High — shared links have no preview image on WhatsApp
- **Cause**: OG image was 1.3MB PNG at 1024x1024. WhatsApp crawler times out on large images.
- **Fix**: Created 92KB JPEG at 1200x630. Updated all meta tags.

---

## Medium (UX issue)

### ISS-010: Progress bar not seekable on mobile
- **Status**: FIXED (2026-05-19)
- **Severity**: Medium — touch drag doesn't seek on phones
- **Cause**: Missing `onTouchStart` handler. Only `onTouchMove` existed.
- **Fix**: Added `onTouchStart` handler. Increased touch target from `h-6` to `h-10`.

### ISS-011: Post-story share popup annoying
- **Status**: FIXED (2026-05-19)
- **Severity**: Medium — "Share with friends" + "How was the voice?" after every story
- **Fix**: Removed auto-show share card and voice feedback. Share available via manual button. Signup nudge shown for guests instead.

### ISS-012: Onboarding country list only 8 countries
- **Status**: FIXED (2026-05-19)
- **Severity**: Medium — limited country selection
- **Fix**: Created `data/regions.js` with 40+ countries and their states/provinces. Dropdown + province selector in Settings and Onboarding.

### ISS-013: Onboarding not centered on screen
- **Status**: FIXED (2026-05-19)
- **Severity**: Low — content aligned top-left instead of center
- **Fix**: Added `items-center justify-center` to the flex container.

### ISS-014: Language selector shows all languages as available
- **Status**: FIXED (2026-05-19)
- **Severity**: Low — only English works, others misleading
- **Fix**: Non-English languages greyed out with "Coming soon" label, not clickable.

### ISS-025: UI shifts when typing in Write Story textarea
- **Status**: FIXED (2026-05-26)
- **Severity**: Medium — layout jump when typing
- **Cause**: Quick Ideas + Recent sections disappeared instantly when typing, causing layout jump.
- **Fix**: Wrapped in AnimatePresence for smooth height collapse.

### ISS-026: Family cast / characters disappearing
- **Status**: FIXED (2026-05-27)
- **Severity**: Medium — characters vanish from family list
- **Cause**: friend-boy/friend-girl relations normalized to 'friend' which no longer exists in FAMILY_RELATIONS.
- **Fix**: Stopped normalizing relation field.

### ISS-027: Back button from Characters goes to Settings instead of previous page
- **Status**: FIXED (2026-05-27)
- **Severity**: Medium
- **Fix**: Changed navigate('/settings') to navigate(-1).

### ISS-028: Unescaped apostrophes in JS strings crash Vite build
- **Status**: FIXED (2026-05-26)
- **Severity**: Medium — build fails
- **Cause**: "Emperor's palace" in single-quoted imagePrompts string.
- **Fix**: Changed to double quotes. Prevention: pre-deploy build check catches these.

### ISS-029: Player shows blank screen during story generation
- **Status**: FIXED (2026-05-27)
- **Severity**: Medium — player unusable while generating
- **Cause**: `if (!current) return` blocked entire player UI.
- **Fix**: Generating message shows inside player layout, controls remain visible.

### ISS-030: CloudFront serving stale index.html after deploy
- **Status**: MONITORING (2026-05-27)
- **Severity**: Medium — users see old version after deploy
- **Cause**: index.html cached by CloudFront despite invalidation. Old JS bundle hash persists.
- **Fix**: Set cache-control to no-cache,no-store,must-revalidate on index.html. Full `/*` invalidation after deploy.

### ISS-031: Story generation 503 — Lambda Firestore calls hang without credentials
- **Status**: FIXED (2026-05-27)
- **Severity**: Critical — story generation completely broken for all users
- **Duration**: ~6 hours to diagnose and fix
- **Symptoms**: API returns 503 (Service Unavailable). Lambda logs show 38-44 second durations exceeding API Gateway's 30s hard limit.
- **Root cause chain** (3 layered issues):
  1. **Lambda had no `FIREBASE_SERVICE_ACCOUNT` env var** — the value was empty `""` in `.env.prod`. It was never configured because the app uses client-side Firebase SDK, not Firebase Admin.
  2. **Firebase Admin initialized anyway** — `generate-story.js` called `initializeApp()` without credentials and then `getFirestore()`. This created a Firestore client that tried to auto-detect Google Cloud credentials (which don't exist in Lambda).
  3. **Two Firestore calls hung for 10-15 seconds each** — `getRole(uid)` and `enforceUsage()` both called Firestore. Each one waited 10-15 seconds trying to load non-existent Google Cloud default credentials, then threw "Could not load the default credentials" error. Combined: 25-30 seconds wasted.
  4. **Haiku model (12s) + wasted Firestore time (25-30s) = 37-44 seconds** — exceeded API Gateway's 30s hard limit → 503.
- **Why it was hard to diagnose**:
  - The API worked from CLI (`curl`) when Lambda was warm and fast, but failed from browser when Lambda was cold or had stale instances.
  - The model change from Sonnet to Haiku worked locally but Lambda kept running old code in cached execution environments.
  - `update-function-code` uploads new code but doesn't kill existing Lambda containers — old containers keep serving old code until they naturally expire.
  - The Firestore errors were non-fatal (`catch` blocks swallowed them), so the story still generated — just too slowly.
- **Fix** (3 parts):
  1. **Skip Firestore if no credentials** — `generate-story.js` now checks `FIREBASE_SERVICE_ACCOUNT` before initializing Firebase Admin. Empty = skip entirely (saves 25-30 seconds).
  2. **Switch model to Haiku** — `claude-haiku-4-5-20251001` generates in 12s vs Sonnet's 26s.
  3. **Force Lambda restart** — `aws lambda update-function-configuration --description "..."` forces all containers to restart with new code.
- **Prevention**:
  - Pre-deploy check now verifies Lambda env vars include required API keys.
  - Pre-deploy check tests `/api/health` endpoint.
  - ISSUES.md documents that `FIREBASE_SERVICE_ACCOUNT` is empty and Firestore calls must be guarded.
- **Lesson**: Never call a service without first checking if its credentials exist. A `try/catch` that swallows a 15-second timeout is worse than a crash — it silently makes everything slow.

---

## Open Issues

### ISS-015: Credit system not automated
- **Status**: OPEN
- **Severity**: High
- **Detail**: Credits are seeded/manual, not calculated from real play counts in `storyPlays` collection.
- **Fix needed**: Cloud function or client-side logic to aggregate plays → update `creatorCredits`.

### ISS-016: Creator-submitted series not playable on Home
- **Status**: OPEN (Coming Soon placeholder)
- **Severity**: Medium
- **Detail**: "Our Creators" shelf shows locked Coming Soon cards. Published Firestore series can't be played from Home yet.
- **Fix needed**: CreatorShelf fetches published `creatorSeries` and makes them playable.

### ISS-017: No email/password auth
- **Status**: OPEN
- **Severity**: Medium
- **Detail**: Only Google sign-in. Users without Google accounts can't register.
- **Fix needed**: Firebase email link (passwordless) authentication flow.

### ISS-018: No profile photo upload for non-Google users
- **Status**: OPEN
- **Severity**: Low
- **Detail**: Profile photo comes from Google account. Non-Google users have no way to set one.
- **Fix needed**: Image upload in Settings → save to Firebase Storage → update Firestore.

### ISS-019: Play counts partially fake
- **Status**: OPEN (partial fix deployed)
- **Severity**: Low
- **Detail**: Seeded base numbers in `socialProof.js`. Real Firestore tracking (`storyPlays`) added but UI still shows seeded + real combined.
- **Plan**: Once real plays exceed seed threshold, switch to 100% real counts.

### ISS-020: Large bundle size
- **Status**: OPEN
- **Severity**: Low
- **Detail**: `index.js` ~674KB, `firebase.js` ~667KB. Should code-split.
- **Fix needed**: Dynamic imports for Admin, Creator, Radio pages.

---

## Hardcoded Items (Technical Debt)

| What | File | Should move to Firestore? |
|---|---|---|
| 8 series + 26 episodes | `data/series.js` | Yes — admin should manage |
| 50+ wisdom stories | `data/culturalLessons.js` | Partially done (custom in Firestore) |
| 8 collections + stories | `data/collections.js` | Yes eventually |
| Play count seeds | `utils/socialProof.js` | Replace with real counts |
| 130+ image prompts | `utils/imagePrompts.js` | Keep (dev tool) |
| Admin email list | `hooks/useAdmin.jsx` | Move to Firestore config |
| 40+ countries + states | `data/regions.js` | Keep (reference data) |
| 15 blog posts | `dist/blog/*.html` | Keep static (SEO) |
| Creator-to-series mapping | `series.js` `createdBy` field | Move to Firestore |

---

## Architecture Notes

### Hosting
- **S3** (`mysleepytale-app`) — static assets + blog HTML
- **CloudFront** (`E2SUVVWBBFCBPE`) — CDN + URL rewriting
  - Default behavior → S3 (SPA)
  - `/api/*` behavior → API Gateway (Lambda)
  - CloudFront Function `mysleepytale-url-rewrite` — handles `/blog/` paths
  - Custom error: 403 → `/index.html` (SPA fallback)
- **Lambda** (`mysleepytale-api`, 2048MB, 120s) — all API handlers
- **CloudWatch warmup rule**: every 5 minutes (keeps Lambda warm)
- **API Gateway** (`637dbvalfk`) — REST API, 30s timeout
- **Story generation model**: claude-haiku-4-5 (was claude-sonnet-4, switched for latency)

### Firebase
- **Auth**: Google sign-in
- **Firestore**: users, config (wisdomAudio/wisdomImages/wisdomGallery), creatorStories, creatorSeries, creatorCredits, storyPlays, playEvents, sharedStories
- **Storage**: audio files, story images, creator uploads

### Key CloudFront gotcha
- `/api/*` behavior must NOT forward `Host` header (causes API Gateway to reject)
- Only forward: `Content-Type`, `Accept`, `Origin`

---

### ISS-032: Whisper prompt ignored — story about kindness instead of Eid
- **Status**: FIXED (2026-05-27)
- **Severity**: High — parent's prompt was secondary to the auto-picked value
- **Cause**: Claude prompt said "make a kindness story that gently addresses the whisper". Claude prioritized kindness over the whisper topic.
- **Fix**: Whisper is now #1 priority in the prompt: "THIS IS THE MOST IMPORTANT PART — the parent told you exactly what tonight's story should be about."
- **Prevention**: Tested with "Eid" whisper → story is now about Eid with kindness as secondary theme.

### ISS-033: Pet type not passed to story generator — Mowgli the dog gets "meow"
- **Status**: FIXED (2026-05-27)
- **Severity**: Medium — pets described with wrong animal behavior
- **Cause**: `petType` field not included in character description sent to Claude. Claude guessed the animal type from the name "Mowgli".
- **Fix**: Added `if (c.petType) desc += ', animal type: ${c.petType}'` to cast description builder.

### ISS-034: Friend gender not saved on character edit — Charlie/Aryan showing as "she"
- **Status**: FIXED (2026-05-27)
- **Severity**: High — edited characters had wrong pronouns in stories
- **Cause**: Edit path still had `relation.replace('-boy', '').replace('-girl', '')` from old code. Stripped friend-boy → friend (no gender). Also no auto-gender detection on edit (only on new).
- **Fix**: Removed normalization on edit path. Added same auto-gender detection as new character path.
- **Note**: Same bug fixed TWICE — first in new character path (ISS-026), then in edit path.

### ISS-035: Volume slider stuck at 70% during story generation
- **Status**: FIXED (2026-05-27)
- **Severity**: Low — cosmetic, non-functional slider shown during loading
- **Cause**: `VolumeControl` component initialized `useState(0.7)`. No audio element existed during generation so it stayed at initial value.
- **Fix**: Volume control hidden when no audio is playing. Only appears when radio background music is active.

### ISS-036: "Preparing voice" overlay blocks story text
- **Status**: FIXED (2026-05-27)
- **Severity**: Medium — user can't read story while audio loads
- **Cause**: Phase 2 overlay had `blur(4px)` + semi-transparent background covering the entire screen including story text.
- **Fix**: Removed Phase 2 overlay entirely. Story text visible immediately when it arrives. Small "Preparing voice… read the story while you wait" gold bar shown above progress bar instead.

### ISS-037: Generated stories not visible in Admin — only shows after Share
- **Status**: FIXED (2026-05-27)
- **Severity**: High — admin blind to user activity
- **Cause**: Stories only saved to Firestore `sharedStories` when user tapped Share button. Auto-generated stories stayed in localStorage only.
- **Fix**: `useStoryGenerator.js` now auto-saves every generated story to `sharedStories` collection with user email, child name, and whisper prompt.

### ISS-038: Firestore security rules block new collection writes
- **Status**: FIXED (2026-05-27)
- **Severity**: High — `generatedStories` collection had no write rules
- **Cause**: Created new `generatedStories` collection but Firestore rules don't allow writes to unknown collections.
- **Fix**: Switched to existing `sharedStories` collection which already has write permissions.
- **Lesson**: Always use existing collections with known permissions, or update Firestore rules FIRST.

### ISS-039: React hooks error #310 on shared story links
- **Status**: FIXED (2026-05-27)
- **Severity**: Critical — shared links crash with white screen
- **Cause**: `useState` for `voiceStep` was placed AFTER early returns for loading/failed states in `SharedStoryGate`. When status changed from 'loading' → 'ready', React saw more hooks on second render.
- **Fix**: Moved all `useState` calls BEFORE any conditional returns.
- **Rule**: React hooks must ALWAYS run in the same order, every render. No hooks after early returns.
- **Prevention**: Added to deployment checklist — test shared links in incognito.

### ISS-040: Admin User Stories tab shows blank black screen
- **Status**: FIXED (2026-05-27)
- **Severity**: High — entire admin tab unusable
- **Cause**: `useMemo` used in `UserStoriesAdmin` component but not imported.
- **Fix**: Added `useMemo` to React import.
- **Prevention**: Pre-deploy build check catches these (Vite fails on undefined variables in production builds... but useMemo was tree-shaken differently).

### ISS-041: Old stories show as "Claude" instead of user email
- **Status**: FIXED (2026-05-27)
- **Severity**: Low — cosmetic, only affects pre-fix stories
- **Cause**: Stories generated before auto-save code had `generatedBy: 'claude'` (the AI model name) instead of user info.
- **Fix**: Admin enriches stories by looking up uid in users collection. Added one-click "Fix orphaned stories" button in admin. New stories auto-save with full user info.

---

## Deployment Checklist

- [ ] `bash deploy.sh` passes (build + S3 + Lambda + CloudFront invalidation)
- [ ] Hard refresh browser after deploy (check new JS hash in Network tab)
- [ ] Test on mobile (iOS Safari + Android Chrome)
- [ ] Test as guest (not logged in)
- [ ] Test series playback (play episode → next episode)
- [ ] Test share link in incognito (`/api/share?id=...`)
- [ ] Check Lambda logs: `aws logs tail /aws/lambda/mysleepytale-api --since 5m`
- [ ] Admin panel loads at `/admin`
- [ ] No console errors on Home page
- [ ] Verify `curl -s mysleepytale.com | grep 'index-'` shows NEW bundle hash
- [ ] Test story generation: `curl -X POST .../api/generate-story` returns 200
- [ ] Check Lambda logs for recent errors

---

- [ ] Test shared story link in incognito: `/player?storyId=...` (ISS-039)
- [ ] Test story generation with whisper prompt (ISS-032)
- [ ] Admin User Stories tab loads and shows users (ISS-040)

---

*Last updated: 2026-05-27 (41 issues tracked)*
*Auto-maintained by Claude during development sessions*
