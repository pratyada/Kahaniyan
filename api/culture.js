// Dynamic OG tags for culture-filtered links.
// e.g. /api/culture?c=hindu → serves HTML with Hindu-specific meta tags
// WhatsApp/social crawlers see the meta tags, users get redirected to /?culture=hindu

const CULTURES = {
  hindu: {
    title: 'Hindu & Panchatantra Bedtime Stories — My Sleepy Tale',
    description: 'Krishna, Hanuman, Ganesh, Panchatantra tales & more — personalized bedtime stories from Hindu tradition. Your child\'s name in every story. Free.',
    image: 'https://mysleepytale.com/og/cover.jpg',
    icon: '🕉️',
  },
  muslim: {
    title: 'Islamic Bedtime Stories for Kids — My Sleepy Tale',
    description: '28 stories + 10 series — Prophets (peace be upon them), Ramadan, Hajj, Names of Allah, Animals in the Quran, Muslim Heroes & more. Personalized with your child\'s name. Free.',
    image: 'https://mysleepytale.com/og/cover.jpg',
    icon: '☪️',
  },
  christian: {
    title: 'Christian Bedtime Stories — Bible Tales for Kids — My Sleepy Tale',
    description: 'Good Samaritan, Loaves & Fishes, Nativity & more — Christian bedtime stories personalized with your child\'s name. Free.',
    image: 'https://mysleepytale.com/og/cover.jpg',
    icon: '✝️',
  },
  catholic: {
    title: 'Catholic Bedtime Stories — Saints & Parables — My Sleepy Tale',
    description: 'Saint Francis, Joan of Arc, the Nativity & 25 more — Catholic bedtime stories personalized with your child\'s name. Free.',
    image: 'https://mysleepytale.com/og/jungle.jpg',
    icon: '⛪',
  },
  hispanic: {
    title: 'Hispanic Bedtime Stories — Latino Folklore — My Sleepy Tale',
    description: 'El Coquí, Quetzalcoatl, Día de los Muertos & more — 25 Latino bedtime stories personalized with your child\'s name. Free.',
    image: 'https://mysleepytale.com/og/car.jpg',
    icon: '🌺',
  },
  sikh: {
    title: 'Sikh Bedtime Stories for Kids — My Sleepy Tale',
    description: 'Guru Nanak, Bhai Kanhaiya & Sikh traditions — personalized bedtime stories with your child\'s name. Free.',
    image: 'https://mysleepytale.com/og/space.jpg',
    icon: '☬',
  },
  buddhist: {
    title: 'Buddhist Bedtime Stories for Kids — My Sleepy Tale',
    description: 'Buddha, Jataka tales & lessons of compassion — personalized bedtime stories with your child\'s name. Free.',
    image: 'https://mysleepytale.com/og/space.jpg',
    icon: '☸️',
  },
  jewish: {
    title: 'Jewish Bedtime Stories for Kids — My Sleepy Tale',
    description: 'Noah, Abraham & Jewish wisdom — personalized bedtime stories with your child\'s name. Free.',
    image: 'https://mysleepytale.com/og/toronto.jpg',
    icon: '✡️',
  },
};

export default async function handler(req, res) {
  let culture = req.query?.c || '';
  if (!culture && req.url) {
    try {
      const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
      culture = url.searchParams.get('c') || '';
    } catch {}
  }

  culture = culture.toLowerCase();
  const data = CULTURES[culture] || {
    title: 'My Sleepy Tale — Bedtime Stories for Every Culture',
    description: 'Personalized bedtime stories from Hindu, Muslim, Christian, Sikh, Buddhist, Catholic, Hispanic & more traditions. Free.',
    image: 'https://mysleepytale.com/og/toronto.jpg',
    icon: '🌙',
  };

  const redirectUrl = `https://mysleepytale.com/?culture=${culture}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title}</title>
  <meta name="description" content="${data.description}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${redirectUrl}">
  <meta property="og:title" content="${data.title}">
  <meta property="og:description" content="${data.description}">
  <meta property="og:image" content="${data.image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="My Sleepy Tale">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${data.title}">
  <meta name="twitter:description" content="${data.description}">
  <meta name="twitter:image" content="${data.image}">
  <link rel="icon" href="/favicon.svg">
  <meta http-equiv="refresh" content="0;url=${redirectUrl}">
</head>
<body style="background:#0a0a0f;color:#f5f0e8;font-family:system-ui;text-align:center;padding:40px">
  <p>Redirecting to My Sleepy Tale...</p>
  <a href="${redirectUrl}" style="color:#f0a500">Click here if not redirected</a>
  <script>window.location.href="${redirectUrl}";</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(200).send(html);
}
