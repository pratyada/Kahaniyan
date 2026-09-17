// Dynamic OG tags for shared story links: /api/share?id=<storyId>
// Story resolution + HTML escaping now live in api/_og-data.js so this handler
// and api/og.js (crawler dynamic-rendering) never drift apart.

import { resolveStory, escapeHtml, DEFAULT_OG_IMAGE, SITE } from './_og-data.js';

export default async function handler(req, res) {
  let storyId = req.query?.id || '';
  if (!storyId && req.url) {
    try {
      const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
      storyId = url.searchParams.get('id') || '';
    } catch {}
  }

  const { title, description, image, redirectUrl } = await resolveStory(storyId);

  const t = escapeHtml(`${title} — My Sleepy Tale`);
  const d = escapeHtml(description);
  const img = escapeHtml(image || DEFAULT_OG_IMAGE);
  const shareUrl = escapeHtml(`${SITE}/share/${storyId}`);
  const redir = escapeHtml(redirectUrl);

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${t}</title>
  <meta name="description" content="${d}">
  <meta property="og:title" content="${t}">
  <meta property="og:description" content="${d}">
  <meta property="og:image" content="${img}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${shareUrl}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="My Sleepy Tale">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${t}">
  <meta name="twitter:description" content="${d}">
  <meta name="twitter:image" content="${img}">
  <meta http-equiv="refresh" content="0;url=${redir}">
</head>
<body>
  <p>Redirecting to <a href="${redir}">${escapeHtml(title)}</a>...</p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(html);
}
