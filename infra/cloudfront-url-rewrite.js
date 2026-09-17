// CloudFront Function (viewer-request) associated on the DEFAULT cache behavior of
// distribution E2SUVVWBBFCBPE, function name: mysleepytale-url-rewrite.
//
// This is the SINGLE viewer-request function (CloudFront allows only one per event),
// so it does BOTH jobs:
//   1. Existing URL rewrites: www→apex canonical, /blogs→/blog/, directory→index.html,
//      /blog/x→/blog/x.html.
//   2. Dynamic rendering for social crawlers: 302 a bot to /api/og?path=<uri> so the
//      OG Lambda returns per-page Open Graph meta. (A rewrite can't cross cache
//      behaviors, so we 302 → it re-enters CloudFront and matches /api/* → Lambda.)
// Humans are never redirected — they get the normal SPA / static pages.
function handler(event) {
  var request = event.request;
  var headers = request.headers;

  // ── 1. Canonical host: 301 www → apex (preserve path + query) ──
  var host = headers.host && headers.host.value;
  if (host === 'www.mysleepytale.com') {
    var wqs = request.querystring;
    var wq = '';
    for (var wk in wqs) {
      if (wqs.hasOwnProperty(wk)) {
        wq += (wq ? '&' : '') + wk + (wqs[wk].value !== '' ? '=' + wqs[wk].value : '');
      }
    }
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: 'https://mysleepytale.com' + request.uri + (wq ? '?' + wq : '') } }
    };
  }

  var uri = request.uri;

  // ── 2. Social crawler → 302 to /api/og (dynamic rendering) ──
  var ua = (headers['user-agent'] && headers['user-agent'].value) || '';
  var uaLower = ua.toLowerCase();
  var BOTS = [
    'facebookexternalhit', 'facebookcatalog', 'facebot', 'twitterbot', 'whatsapp',
    'slackbot', 'slack-imgproxy', 'linkedinbot', 'discordbot', 'telegrambot',
    'pinterest', 'redditbot', 'googlebot', 'google-inspectiontool', 'storebot-google',
    'bingbot', 'bingpreview', 'applebot', 'yandexbot', 'yandex', 'baiduspider',
    'duckduckbot', 'embedly', 'quora link preview', 'showyoubot', 'outbrain',
    'vkshare', 'w3c_validator', 'skypeuripreview', 'nuzzel', 'bitlybot', 'tumblr',
    'flipboard', 'mastodon', 'pleroma'
  ];
  var isBot = false;
  for (var i = 0; i < BOTS.length; i++) {
    if (uaLower.indexOf(BOTS[i]) !== -1) { isBot = true; break; }
  }
  if (isBot) {
    // '/' keeps its rich static OG + SEO fallback in index.html (esp. after the V2 flip,
    // where '/' is the front door) — don't send the home crawl to the thin OG stub.
    var skip = (uri === '/') ||
               (uri.indexOf('/api/') === 0) || (uri.indexOf('/assets/') === 0) ||
               (uri === '/blog') || (uri.indexOf('/blog/') === 0);
    var lastSlash = uri.lastIndexOf('/');
    var lastSeg = lastSlash >= 0 ? uri.substring(lastSlash + 1) : uri;
    if (lastSeg.indexOf('.') !== -1) skip = true; // has a file extension
    var LANDING = {
      '/bedtime-stories-for-kids': 1, '/bedtime-story-app': 1, '/hindu-bedtime-stories': 1,
      '/islamic-stories-for-kids': 1, '/sikh-bedtime-stories': 1, '/catholic-bedtime-stories': 1,
      '/hispanic-bedtime-stories': 1, '/fifa-world-cup-kids': 1, '/fifa-world-cup-dallas-kids': 1
    };
    var noTrailing = (uri.length > 1 && uri.charAt(uri.length - 1) === '/') ? uri.substring(0, uri.length - 1) : uri;
    if (LANDING[noTrailing]) skip = true;
    if (!skip) {
      var qs = request.querystring || {};
      var originalUri = uri;
      var pairs = [];
      for (var key in qs) {
        if (qs.hasOwnProperty(key)) {
          var v = qs[key];
          pairs.push(v && v.value !== '' ? key + '=' + v.value : key);
        }
      }
      if (pairs.length) originalUri = uri + '?' + pairs.join('&');
      return {
        statusCode: 302,
        statusDescription: 'Found',
        headers: {
          location: { value: '/api/og?path=' + encodeURIComponent(originalUri) },
          'cache-control': { value: 'no-store' }
        }
      };
    }
  }

  // ── 3. Existing URL rewrites ──
  if (uri === '/blogs' || uri === '/blogs/') {
    return { statusCode: 301, statusDescription: 'Moved Permanently', headers: { location: { value: '/blog/' } } };
  }
  if (uri.endsWith('/')) { request.uri += 'index.html'; return request; }
  if (uri.startsWith('/blog/') && !uri.includes('.')) { request.uri += '.html'; return request; }

  return request;
}
