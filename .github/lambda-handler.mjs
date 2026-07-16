// Lambda handler — routes API requests to individual function handlers
// Adapts Vercel's (req, res) interface to Lambda's event/context interface

const ROUTES = {};

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

// Dynamic import of route handlers
async function loadHandler(name) {
  if (!ROUTES[name]) {
    ROUTES[name] = (await import(`./api/${name}.js`)).default;
  }
  return ROUTES[name];
}

export async function handler(event) {
  const path = event.rawPath || event.requestContext?.http?.path || '/';
  const method = event.requestContext?.http?.method || event.httpMethod || 'GET';

  // Handle OPTIONS preflight
  if (method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  // Handle /story/{storyId} — serve OG tags then redirect to player
  const storyMatch = path.match(/^\/story\/(.+?)(\?.*)?$/);
  if (storyMatch) {
    const storyId = storyMatch[1];
    // Reuse share handler with the story ID
    const fakeReq = { method: 'GET', headers: event.headers || {}, query: { id: storyId }, url: `/api/share?id=${storyId}` };
    let html = '';
    const fakeRes = {
      status: () => fakeRes,
      setHeader: () => {},
      send: (data) => { html = data; },
      json: (data) => { html = JSON.stringify(data); },
    };
    try {
      const shareHandler = await loadHandler('share');
      await shareHandler(fakeReq, fakeRes);
      // Replace the redirect URL to use /story/ instead of /player?storyId=
      html = html.replace(/url=https:\/\/mysleepytale\.com\/player\?storyId=[^"]+/, `url=https://mysleepytale.com/story/${storyId}`);
      // Remove the meta refresh redirect — let the SPA handle it
      html = html.replace(/<meta http-equiv="refresh"[^>]*>/, '');
      // Add script to load the SPA
      html = html.replace('</head>', `<script>window.location.replace('/player?storyId=${storyId}');</script></head>`);
    } catch (e) {
      html = `<html><head><meta http-equiv="refresh" content="0;url=/player?storyId=${storyId}"></head><body>Loading...</body></html>`;
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html', 'Cache-Control': 'public, max-age=3600', ...CORS },
      body: html,
    };
  }

  // Extract route name from /api/{routeName}
  const match = path.match(/^\/api\/(.+?)(\?.*)?$/);
  if (!match) {
    return { statusCode: 404, headers: CORS, body: JSON.stringify({ error: 'Not found' }) };
  }
  const routeName = match[1];

  // Build req/res adapter
  const body = event.body ? (event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body) : null;
  const headers = event.headers || {};

  let parsedBody = {};
  if (body) {
    try { parsedBody = JSON.parse(body); } catch { parsedBody = {}; }
  }

  const req = {
    method,
    headers,
    body: parsedBody,
    query: event.queryStringParameters || {},
    url: path + (event.rawQueryString ? '?' + event.rawQueryString : ''),
  };

  let statusCode = 200;
  let responseHeaders = { 'Content-Type': 'application/json', ...CORS };
  let responseBody = '';
  let responseChunks = [];

  const res = {
    status(code) { statusCode = code; return res; },
    setHeader(key, val) { responseHeaders[key] = val; },
    json(data) { responseBody = JSON.stringify(data); },
    write(chunk) { responseChunks.push(chunk); },
    end() {},
    send(data) { responseBody = typeof data === 'string' ? data : JSON.stringify(data); },
  };

  try {
    const handlerFn = await loadHandler(routeName);
    await handlerFn(req, res);

    // If binary response (audio/image), return base64
    if (responseChunks.length > 0) {
      const buffer = Buffer.concat(responseChunks.map(c => Buffer.isBuffer(c) ? c : Buffer.from(c)));
      return {
        statusCode,
        headers: responseHeaders,
        body: buffer.toString('base64'),
        isBase64Encoded: true,
      };
    }

    return { statusCode, headers: responseHeaders, body: responseBody };
  } catch (e) {
    console.error('Lambda error:', e);
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: e.message }) };
  }
}
