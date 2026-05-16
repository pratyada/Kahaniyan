// Dynamic OG tags for shared story links.
// WhatsApp/iMessage/Twitter crawlers hit this and get proper previews.
// Real users get redirected to the player.

// Wisdom stories data (lightweight subset for OG tags)
const STORIES = {
  krishna_squirrel: { title: 'Krishna and the Little Squirrel', tradition: 'Hindu', duration: 10, img: '1501706362039-c06b2d715385' },
  prophet_camel: { title: 'The Prophet and the Crying Camel', tradition: 'Islam', duration: 10, img: '1549989476-69a92fa57c36' },
  jesus_birds: { title: 'Jesus and the Birds of the Air', tradition: 'Christian', duration: 10, img: '1444464666168-49d633b86797' },
  buddha_swan: { title: 'Buddha and the Wounded Swan', tradition: 'Buddhist', duration: 10, img: '1501706362039-c06b2d715385' },
  guru_nanak_grain: { title: 'Guru Nanak and the True Meal', tradition: 'Sikh', duration: 10, img: '1500382017468-9049fed747ef' },
  hanuman_mountain: { title: 'Hanuman and the Mountain', tradition: 'Hindu', duration: 10, img: '1464822759023-fed622ff2c3b' },
  mahavir_ant: { title: 'Mahavir and the Ants', tradition: 'Jain', duration: 10, img: '1448375240586-882707db888b' },
  jewish_noah: { title: "Noah's Rainbow", tradition: 'Jewish', duration: 10, img: '1507400492013-162706c8c05e' },
  universal_sharing_blanket: { title: 'The Blanket That Grew', tradition: 'Universal', duration: 7, img: '1478760329108-5c3ed9d495a0' },
  universal_bravery_first_step: { title: 'The Girl Who Walked Into the Dark', tradition: 'Universal', duration: 7, img: '1478760329108-5c3ed9d495a0' },
  draupadi_akshaya_patra: { title: 'Draupadi and the Vessel That Never Emptied', tradition: 'Hindu', duration: 9, img: '1504674900247-0877df9cc836' },
  universal_humility_mountain: { title: 'The Mountain That Learned to Bow', tradition: 'Universal', duration: 7, img: '1464822759023-fed622ff2c3b' },
  panchatantra_monkey_crocodile: { title: 'The Monkey and the Crocodile', tradition: 'Hindu', duration: 7, img: '1540573133985-87b6da6d54a9' },
  panchatantra_crow_pitcher: { title: 'The Crow and the Pitcher', tradition: 'Hindu', duration: 7, img: '1494256997604-768d1f608cac' },
  ram_golden_deer: { title: 'Ram and the Golden Deer', tradition: 'Hindu', duration: 9, img: '1448375240586-882707db888b' },
  akbar_birbal_well: { title: "Akbar and Birbal's Well", tradition: 'Hindu', duration: 8, img: '1548013146-72479768bada' },
  sikh_water_carrier: { title: 'Bhai Kanhaiya — The Water Carrier', tradition: 'Sikh', duration: 10, img: '1470071459604-3b5ec3a7fe05' },
  prophet_ant_hill: { title: 'The Prophet and the Ant Hill', tradition: 'Islam', duration: 8, img: '1558642452-9d2a7deb7f62' },
  prophet_thirsty_dog: { title: 'The Woman and the Thirsty Dog', tradition: 'Islam', duration: 8, img: '1587300003388-59208cc962cb' },
  good_samaritan: { title: 'The Good Samaritan', tradition: 'Christian', duration: 10, img: '1469571486292-0ba58a3f068b' },
  universal_lighthouse_keeper: { title: 'The Lighthouse Keeper', tradition: 'Universal', duration: 7, img: '1507924538820-ede94a04019d' },
  universal_wisdom_two_wolves: { title: 'The Two Wolves', tradition: 'Universal', duration: 7, img: '1518837695005-2083093ee35b' },
};

export default function handler(req, res) {
  // Extract storyId from path: /api/share/lesson_krishna_squirrel or /api/share?id=xxx
  const url = new URL(req.url || '', `http://${req.headers?.host || 'localhost'}`);
  let storyId = url.searchParams.get('id') || '';

  // Also try path-based: /api/share/lesson_xxx
  const pathMatch = (req.url || '').match(/\/api\/share\/(.+?)(\?|$)/);
  if (pathMatch) storyId = pathMatch[1];

  const lessonId = storyId.startsWith('lesson_') ? storyId.slice(7) : storyId;
  const story = STORIES[lessonId];

  const title = story ? story.title : 'A Bedtime Story';
  const tradition = story ? story.tradition : '';
  const duration = story ? `${story.duration} min` : '';
  const description = story
    ? `Listen to "${title}" — a ${tradition} bedtime story that teaches real values. ${duration}. Free on My Sleepy Tale.`
    : 'A personalized bedtime story that teaches values. Free on My Sleepy Tale.';
  const image = story
    ? `https://images.unsplash.com/photo-${story.img}?w=1200&h=630&fit=crop&q=80`
    : 'https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=1200&h=630&fit=crop&q=80';

  const playerUrl = `https://mysleepytale.com/player?storyId=${storyId || 'lesson_' + lessonId}`;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title} — My Sleepy Tale</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${title} — My Sleepy Tale">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="https://mysleepytale.com/share/${storyId}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="My Sleepy Tale">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title} — My Sleepy Tale">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <meta http-equiv="refresh" content="0;url=${playerUrl}">
</head>
<body>
  <p>Redirecting to <a href="${playerUrl}">${title}</a>...</p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).send(html);
}
