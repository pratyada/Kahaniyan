// Dynamic OG meta for social link previews.
// Crawlers (WhatsApp, Slack, Twitter, Facebook) hit this to get
// page-specific titles and descriptions for shared links.

const PAGES = {
  '/invest': {
    title: 'Invest in My Sleepy Tale — SAFE at $1M Cap · Friends & Family',
    description: 'Back My Sleepy Tale, the AI-powered personalized bedtime story app. SAFE note at $1M valuation cap. Transparent cap table, real-time backer board. Min CA$50.',
    image: 'https://mysleepytale.com/og-cover.svg',
  },
  '/admin': {
    title: 'My Sleepy Tale — Admin Dashboard',
    description: 'Admin panel for My Sleepy Tale. User management, analytics, investors, team.',
    image: 'https://mysleepytale.com/og-cover.svg',
  },
};

const DEFAULT = {
  title: 'My Sleepy Tale — Personalized AI bedtime stories for your child',
  description: 'Every night, a fresh story with your child\'s name, their family, their pet, and the lesson you choose. AI-narrated in a voice that sounds like home.',
  image: 'https://mysleepytale.com/og-cover.svg',
};

export default function handler(req, res) {
  const path = req.query.path || '/';
  const meta = PAGES[path] || DEFAULT;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`<!DOCTYPE html>
<html>
<head>
  <title>${meta.title}</title>
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:image" content="${meta.image}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://mysleepytale.com${path}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${meta.title}" />
  <meta name="twitter:description" content="${meta.description}" />
  <meta name="twitter:image" content="${meta.image}" />
  <meta http-equiv="refresh" content="0;url=https://mysleepytale.com${path}" />
</head>
<body>Redirecting...</body>
</html>`);
}
