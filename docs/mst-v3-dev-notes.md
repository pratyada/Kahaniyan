# MST — Dev Notes for the Next Version (post-V2-flip)

Captured Sept 17, 2026, right after flipping V2 to the production default.
These are the known, prioritized improvements to pick up next.

## 1. Speed win — code-split the bundle (HIGH priority)
The initial JS bundle is **~851 KB gzip** because `client/src/App.jsx` statically
imports the **entire old app** — Admin, FounderHub, ContentPipeline, Studio,
Creatives, TeamObjectives, SummerAdventures, Invest, Roadmap, MyTasks, Characters,
VoiceStudio, Guides, etc. — none of which V2 (the default experience) needs.

**Do:** convert those non-V2 / legacy pages to `React.lazy(() => import(...))` with
a `<Suspense>` boundary in the Shell. Keep V2 screens + shared data (culturalLessons,
series) eager since the home needs them, but everything admin/founder/tools should be
a separate chunk loaded on demand.

**Expected:** meaningfully smaller first-load for `/` (V2). Measure before/after with
`performance.getEntriesByType('navigation')` — baseline today: DCL ~0.4s, load ~2.1s
on prod, main chunk 851 KB gzip.

**Also consider:** on-demand load of the big data modules (`culturalLessons.js` 6.5k
lines, `series.js` 8.2k lines) if they can be fetched rather than bundled; and a
`manualChunks` split so vendor/firebase/data are cacheable across deploys.

## 2. Clean root URLs (if we move V2 off the /v2 path)
Today `mysleepytale.com/` redirects to `/v2` (client-side) so the app is live on the
main domain but the address bar shows `/v2`. To serve V2 at clean root URLs:
- Re-point V2App routes from `/v2/*` → root (`/`, `/build`, `/world`, `/player/:id`,
  `/series/:id`, `/voices`, `/profile`, `/settings`).
- Shell guard becomes "render V2App unless the path is a reserved legacy route"
  (admin, blog, aboutus, privacy, terms.html, refund-policy.html, creatives, studio,
  login, record, contribute, summer, SEO landing pages) or `?classic`.
- Update every internal `navigate('/v2/...')` and share URL builder.
- Update the CloudFront OG function crawler-redirect paths (`/v2/player` → new path).
- Add 301s from old `/v2/player/:id` links already shared in the wild.
Higher risk (touches share links + SEO + OG) — plan carefully, add redirects.

## 3. Episode audio — pre-store TTS (MEDIUM)
Series episodes on the Universal home have no pre-stored audio, so they generate via
OpenAI TTS on play: **2–10s first-play** and the occasional transient **503** on cold
start. Wisdom lessons (stored audio) play instantly.
**Do:** batch-generate TTS for all universal series episodes → S3 (same scheme as
wisdom audio), register in the audio-URL map so `buildStory` picks them up → instant play.

## 4. Kids-Build animation — switch provider (MEDIUM, deferred)
`api/kid-story-animate.js` is correct but Higgsfield's **platform API credits** are
separate from web credits and the key's account is at zero (403). `open-higgsfield`
does NOT help (same platform API, no license). **Do:** move image-to-video to
**fal.ai or Replicate** (Kling/Wan/LTX/SVD, pay-as-you-go, own key) — a small swap
(host + auth + request/response + polling). See [[project_mst_v2]] memory.

## 5. Ops / one-offs
- `firebase deploy --only firestore:rules` — needed for shared kid-story links.
- Legal pages `/terms.html` + `/refund-policy.html` are drafts — **have counsel review
  before enabling payments.**
