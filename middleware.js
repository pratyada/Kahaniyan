// Vercel Edge Middleware — injects page-specific OG meta for social crawlers.
// Runs BEFORE the SPA loads, so WhatsApp/Slack/Twitter see the right preview.

const PAGES = {
  '/invest': {
    title: 'Invest in My Sleepy Tale — SAFE at $1M Cap · Friends & Family',
    description: 'Back My Sleepy Tale, the personalized bedtime story app for families. SAFE note at $1M valuation cap. Transparent cap table, real-time backer board. Min CA$50.',
  },
  '/stonedage': {
    title: 'Stoned Age — After kids sleep, parents play 🪨',
    description: 'Curated radio for every phase of your night. Pre-flight chill → peak orbit dance → soft landing ambient. Plus 20 swipeable cards with jokes, news & pro tips. A My Sleepy Tale side project.',
  },
};

const BOT_UA = /facebookexternalhit|Twitterbot|Slackbot|WhatsApp|LinkedInBot|TelegramBot|Discordbot/i;

export default function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  const url = new URL(request.url);
  const host = request.headers.get('host') || '';

  // Check subdomain OR path
  let pageMeta = PAGES[url.pathname];
  if (host.startsWith('stonedage.')) pageMeta = PAGES['/stonedage'];

  // Only intercept for social crawlers on pages with custom meta
  if (!pageMeta || !BOT_UA.test(ua)) return;

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>${pageMeta.title}</title>
  <meta property="og:title" content="${pageMeta.title}" />
  <meta property="og:description" content="${pageMeta.description}" />
  <meta property="og:image" content="https://mysleepytale.com/og-cover.svg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://mysleepytale.com${url.pathname}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${pageMeta.title}" />
  <meta name="twitter:description" content="${pageMeta.description}" />
  <meta name="twitter:image" content="https://mysleepytale.com/og-cover.svg" />
</head>
<body></body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}

export const config = {
  matcher: ['/', '/invest', '/stonedage'],
};
