# Server-rendered Open Graph (OG) for social crawlers

Goal: every shareable URL on My Sleepy Tale returns correct, page-specific OG /
Twitter / canonical meta to social crawlers (WhatsApp, Facebook, Slack, X,
LinkedIn, Discord, Telegram, Pinterest, Reddit, Googlebot, bingbot, …), while
humans keep getting the normal SPA.

This uses **dynamic rendering**: a small CloudFront Function looks at the
`User-Agent` on every viewer request. Crawlers are rewritten to the OG Lambda
(`/api/og`), which returns a tiny HTML doc full of meta tags plus a JS redirect
back to the SPA route. Humans pass straight through to the SPA.

Nothing here is deployed yet — the code is in the repo; the CloudFront wiring
below is manual (needs the AWS console / CLI).

---

## What's in the repo

| File | Role |
|------|------|
| `api/_og-data.js` | **Shared** module: story/series/kid-story resolution against `WISDOM_TITLES` + Firestore (`config/wisdomImages`, `creatorSeries`, `productionStories`, `publishedContent`, `kidStories`), HTML escaping, and the `renderOgHtml()` template. Used by both handlers so they never drift. |
| `api/og.js` | Dynamic OG endpoint. `GET /api/og?path=<original-uri>` → returns OG HTML for that route. Covers static routes, culture landing pages, dynamic stories/series, and shared kid stories. |
| `api/share.js` | Existing per-story share endpoint (`/api/share?id=<id>`) — refactored to reuse `_og-data.js`. Behaviour unchanged (`og:url` still `/share/<id>`). |
| `infra/cloudfront-og-router.js` | The CloudFront Function (viewer-request). Detects crawlers, rewrites them to `/api/og?path=…`, passes humans + rich static pages through untouched. |

`api/og.js` and `api/_og-data.js` ship to Lambda automatically — `deploy.sh`
already does `cp -r api /tmp/lambda-pkg/api`. No deploy.sh change is required.
Run `node scripts/generate-share-titles.mjs` (deploy.sh already does) so
`api/wisdom-titles.js` stays current.

---

## Routes covered by `/api/og`

**Static / landing** (route → meta map in `og.js`):
`/`, `/v2`, `/aboutus`, `/creators`, `/creatives`, `/studio`, `/lessons`,
`/library`, `/search`, `/curators`, `/summer`, `/roadmap`, `/privacy`, `/invest`,
`/admin`, `/blog`, and the SEO landing pages (`/hindu-bedtime-stories`,
`/islamic-stories-for-kids`, `/sikh-bedtime-stories`, `/catholic-bedtime-stories`,
`/hispanic-bedtime-stories`, `/bedtime-stories-for-kids`, `/bedtime-story-app`,
`/fifa-world-cup-kids`, `/fifa-world-cup-dallas-kids`).

**Dynamic** (resolved via `resolveStory` / `resolveKidStory`):
- `/player?storyId=<id>` and `/v2/player?storyId=<id>`
- `/story/<id>`
- `/v2/player/<id>` — built-in story first, else a **shared (approved) kid story** from `kidStories/{id}`
- `/series/<id>` and `/v2/series/<id>`
- `/collection/<id>` (generic default)
- `/blog/<slug>` (generic blog meta)

Anything else → sensible DEFAULT. All images are our own generated covers or the
branded fallbacks (`/og-image.jpg`, `/dsp_ep1_development.png`) — **never
Unsplash**. All dynamic text is HTML-escaped.

Kid stories are only exposed if `status === 'published'` or `approved === true`,
so drafts/private recordings never leak into a preview.

---

## How the CloudFront Function routes crawlers

`infra/cloudfront-og-router.js` (viewer-request):

1. Read `User-Agent`. If it doesn't match the crawler list → return the request
   unchanged (human → SPA).
2. If it's a crawler, **skip** paths that already serve rich crawlable HTML from
   the origin (so we don't strip their SEO content):
   - `/api/*` (incl. `/api/og` — avoids a loop), `/assets/*`, `/blog` + `/blog/*`
   - any path with a file extension (`*.html`, images, `.svg`, `.xml`, `.txt`, …)
   - the extensionless SEO landing pages (they ship standalone HTML in S3)
3. Otherwise rewrite: `request.uri = '/api/og'` and
   `request.querystring = { path: <encoded original uri+query> }`.

---

## ⚠️ IMPORTANT — CloudFront cache-behavior routing

CloudFront picks the **cache behavior (and therefore the origin)** from the
**original** request URI, *before* the viewer-request function runs. A
viewer-request function can change `request.uri`, but that does **not** move the
request to a different cache behavior/origin.

Consequence: a rewritten `/api/og` request only reaches the **API Lambda** if the
*original* URI already matched a cache behavior whose origin is that Lambda.

This distribution (E2SUVVWBBFCBPE) has:
- `/api/*` → API Lambda (`mysleepytale-api`)
- `/story/*` → API Lambda (already serves OG today)
- default `*` → S3 (`mysleepytale-app`, the SPA)

So the rewrite works out-of-the-box for original URIs under `/story/*` and
`/api/*`. For the SPA routes on the **default (S3) behavior** (`/`, `/v2/*`,
`/series/*`, `/player`, `/aboutus`, `/creators`, `/v2/player/*`, …) a bare rewrite
would hit S3 and 404. Pick one of the two options below to cover those.

### Option A (recommended, pure CloudFront Function): redirect instead of rewrite
Change the last block of `infra/cloudfront-og-router.js` to return a 302 to
`/api/og?path=…` instead of rewriting the URI. The crawler then re-requests
`/api/og?…`, which matches the `/api/*` behavior → Lambda. All major crawlers
(Facebook, WhatsApp, X, Slack, LinkedIn, Googlebot, …) follow redirects when
scraping. Replace:

```js
  request.uri = '/api/og';
  request.querystring = { path: { value: encodeURIComponent(originalUri) } };
  return request;
```

with:

```js
  return {
    statusCode: 302,
    statusDescription: 'Found',
    headers: { location: { value: '/api/og?path=' + encodeURIComponent(originalUri) } }
  };
```

Associate this function on the **default (`*`)** cache behavior, Viewer Request.
(Keep the skip-list so static landing pages / blog / assets are untouched.)

### Option B (keep the rewrite): add an origin-request Lambda@Edge
If you prefer a true rewrite (no redirect), a viewer-request rewrite still can't
cross behaviors — you'd move origin selection into a **Lambda@Edge
origin-request** function on the default behavior that points crawler requests at
the API Lambda origin. Heavier (versioned, us-east-1). Only do this if you
specifically don't want redirects.

> The committed function uses the **rewrite** form (per the original spec). If you
> associate it on `/story/*` it works as-is; for full coverage on the default
> behavior use Option A.

---

## Manual deploy / wiring steps

1. **Deploy the API** (ships `api/og.js` + `api/_og-data.js` to Lambda):
   ```bash
   bash deploy.sh
   ```
   Confirm the endpoint is reachable:
   ```bash
   curl -s "https://mysleepytale.com/api/og?path=/hindu-bedtime-stories" | grep og:title
   curl -s "https://mysleepytale.com/api/og?path=/story/krishna_squirrel" | grep og:image
   ```

2. **Create the CloudFront Function**
   - CloudFront console → Functions → Create function → name `og-router`
     (runtime `cloudfront-js-2.0`).
   - Paste the contents of `infra/cloudfront-og-router.js` (apply the Option A
     edit first if you're covering default-behavior routes).
   - **Test** tab: set `User-Agent: facebookexternalhit/1.1`, URI `/story/x` →
     confirm the rewrite/redirect; set a normal browser UA → confirm pass-through.
   - **Publish**.

   CLI equivalent:
   ```bash
   aws cloudfront create-function \
     --name og-router \
     --function-config '{"Comment":"OG dynamic rendering for social crawlers","Runtime":"cloudfront-js-2.0"}' \
     --function-code fileb://infra/cloudfront-og-router.js
   # then, using the returned ETag:
   aws cloudfront publish-function --name og-router --if-match <ETAG>
   ```

3. **Associate on the distribution** (`E2SUVVWBBFCBPE`)
   - Console → Distributions → E2SUVVWBBFCBPE → Behaviors.
   - Edit the **Default (`*`)** behavior → *Function associations* →
     Viewer request → CloudFront Functions → `og-router` → Save.
   - (Rewrite variant only: also add it to the `/story/*` behavior if you want
     the function to own that path too — optional, `/story/*` already emits OG.)
   - No new cache behavior is needed for Option A: `/api/*` already routes to the
     Lambda.

4. **Invalidate** so crawlers re-fetch:
   ```bash
   aws cloudfront create-invalidation --distribution-id E2SUVVWBBFCBPE --paths "/*"
   ```

---

## Testing

Simulate crawlers with curl (must return page-specific `og:title` / `og:image`,
not the generic SPA shell):

```bash
UA="facebookexternalhit/1.1"
for u in / /v2 /aboutus /creators \
         /story/krishna_squirrel \
         "/player?storyId=fifa26_ep11_hiro" \
         /v2/player/fifa26_ep10_ronaldo \
         /series/fire-truck-academy \
         /hindu-bedtime-stories ; do
  echo "== $u =="
  curl -sL -A "$UA" "https://mysleepytale.com$u" | grep -E 'og:title|og:image' | head -2
done

# A human UA must still get the SPA (generic shell / app):
curl -s -A "Mozilla/5.0 (iPhone) Safari" "https://mysleepytale.com/story/krishna_squirrel" | grep -i "<title>"
```

Then validate the real previews:
- **Facebook Sharing Debugger** — https://developers.facebook.com/tools/debug/ →
  paste a URL → *Scrape Again*.
- **X Card Validator**, **LinkedIn Post Inspector**, or just paste a link into a
  WhatsApp/Slack chat and confirm the card shows the right title/image.

If a preview is stale, use *Scrape Again* (Facebook) — crawlers cache
aggressively; the invalidation in step 4 only clears CloudFront, not their cache.

---

## Adding new routes later

- New static page → add an entry to `STATIC_META` in `api/og.js`. If it's an
  extensionless standalone HTML landing page, also add it to the skip-list
  `LANDING` in `infra/cloudfront-og-router.js` and republish the function.
- New stories/series → nothing to do; they resolve automatically once they're in
  `culturalLessons.js` (regenerated into `wisdom-titles.js` by deploy.sh) or in
  the Firestore collections `og.js` already reads.
