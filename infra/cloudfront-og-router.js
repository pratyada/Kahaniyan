// CloudFront Function (viewer-request) — "dynamic rendering" for social crawlers.
//
// Purpose: when a social/link-preview crawler (Facebook, Twitter/X, WhatsApp,
// Slack, LinkedIn, Discord, Telegram, Pinterest, Reddit, Googlebot, bingbot, …)
// requests an SPA route, rewrite the request to  /api/og?path=<original-uri>  so
// the OG Lambda (api/og.js) returns page-specific Open Graph / Twitter meta.
// Real browsers (humans) are passed through untouched and get the normal SPA.
//
// Runtime: CloudFront Functions (ECMAScript 5.1). No network calls, no imports,
// small. Associate on the DEFAULT cache behavior's Viewer Request event.
// See docs/og-server-rendering.md for publish + association + testing steps,
// including the important CloudFront cache-behavior routing note.

function handler(event) {
  var request = event.request;
  var headers = request.headers;

  // ── 1. Detect crawlers by User-Agent ──
  var ua = (headers['user-agent'] && headers['user-agent'].value) || '';
  var uaLower = ua.toLowerCase();

  // Substrings that identify link-preview / search crawlers.
  var BOTS = [
    'facebookexternalhit', 'facebookcatalog', 'facebot',
    'twitterbot',
    'whatsapp',
    'slackbot', 'slack-imgproxy',
    'linkedinbot',
    'discordbot',
    'telegrambot',
    'pinterest',
    'redditbot',
    'googlebot', 'google-inspectiontool', 'storebot-google',
    'bingbot', 'bingpreview',
    'applebot',
    'yandexbot', 'yandex',
    'baiduspider',
    'duckduckbot',
    'embedly', 'quora link preview', 'showyoubot', 'outbrain',
    'vkshare', 'w3c_validator', 'skypeuripreview', 'nuzzel',
    'bitlybot', 'tumblr', 'flipboard',
    'mastodon', 'pleroma', 'nostr',
    'developers.google.com/+/web/snippet'
  ];

  var isBot = false;
  for (var i = 0; i < BOTS.length; i++) {
    if (uaLower.indexOf(BOTS[i]) !== -1) { isBot = true; break; }
  }
  if (!isBot) return request; // human → SPA, unchanged

  var uri = request.uri || '/';

  // ── 2. Skip paths that already serve rich, crawlable HTML from the origin ──
  // These must NOT be rewritten to the thin OG stub or we lose their SEO content.
  //   - /api/*        (API + the OG endpoint itself — avoid a rewrite loop)
  //   - /assets/*, /blog, /blog/*   (hashed assets + prerendered blog HTML)
  //   - any path with a file extension (*.html, *.jpg, *.svg, .xml, .txt, …)
  //   - the extensionless SEO landing pages (standalone HTML in S3)
  if (uri.indexOf('/api/') === 0) return request;
  if (uri.indexOf('/assets/') === 0) return request;
  if (uri === '/blog' || uri.indexOf('/blog/') === 0) return request;

  // File extension check: a dot in the last path segment.
  var lastSlash = uri.lastIndexOf('/');
  var lastSegment = lastSlash >= 0 ? uri.substring(lastSlash + 1) : uri;
  if (lastSegment.indexOf('.') !== -1) return request;

  // Extensionless SEO landing pages already have their own OG in static HTML.
  var LANDING = {
    '/bedtime-stories-for-kids': 1,
    '/bedtime-story-app': 1,
    '/hindu-bedtime-stories': 1,
    '/islamic-stories-for-kids': 1,
    '/sikh-bedtime-stories': 1,
    '/catholic-bedtime-stories': 1,
    '/hispanic-bedtime-stories': 1,
    '/fifa-world-cup-kids': 1,
    '/fifa-world-cup-dallas-kids': 1
  };
  var noTrailing = uri.length > 1 && uri.charAt(uri.length - 1) === '/'
    ? uri.substring(0, uri.length - 1)
    : uri;
  if (LANDING[noTrailing]) return request;

  // ── 3. Redirect crawler → /api/og (Option A) ──
  // A URI rewrite can't cross cache behaviors (CloudFront picks the origin from the
  // ORIGINAL uri, before this function runs), so rewriting /v2/... → /api/og would
  // still hit the S3 default behavior. Instead return a 302 to /api/og?path=…, which
  // re-enters CloudFront and matches the /api/* behavior → OG Lambda. Crawlers follow it.
  var qs = request.querystring || {};
  var originalUri = uri;
  var pairs = [];
  for (var key in qs) {
    if (!Object.prototype.hasOwnProperty.call(qs, key)) continue;
    var v = qs[key];
    if (v && typeof v.value !== 'undefined' && v.value !== '') {
      pairs.push(key + '=' + v.value);
    } else {
      pairs.push(key);
    }
    // multiValue params (rare here) — include each value
    if (v && v.multiValue) {
      for (var m = 0; m < v.multiValue.length; m++) {
        pairs.push(key + '=' + v.multiValue[m].value);
      }
    }
  }
  if (pairs.length) originalUri = uri + '?' + pairs.join('&');

  return {
    statusCode: 302,
    statusDescription: 'Found',
    headers: {
      'location': { value: '/api/og?path=' + encodeURIComponent(originalUri) },
      'cache-control': { value: 'no-store' }
    }
  };
}
