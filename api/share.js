// Dynamic OG tags for shared story links.
// Fetches actual generated images from Firestore when available.
// Falls back to Unsplash for stories without generated images.

import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db = null;
let imageCache = null;
let cacheTime = 0;

try {
  if (getApps().length === 0) {
    initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID || 'qissaa-61a78' });
  }
  db = getFirestore();
} catch {}

// Load wisdom images from Firestore (cached for 5 min)
async function getWisdomImages() {
  const now = Date.now();
  if (imageCache && (now - cacheTime) < 300000) return imageCache;
  if (!db) return {};
  try {
    const snap = await db.collection('config').doc('wisdomImages').get();
    imageCache = snap.exists ? snap.data() : {};
    cacheTime = now;
    return imageCache;
  } catch { return imageCache || {}; }
}

// Fallback Unsplash images (only used if no Firestore image)
const FALLBACK_IMG = {
  krishna_squirrel: '1501706362039-c06b2d715385',
  prophet_camel: '1549989476-69a92fa57c36',
  jesus_birds: '1444464666168-49d633b86797',
  buddha_swan: '1501706362039-c06b2d715385',
  guru_nanak_grain: '1500382017468-9049fed747ef',
  hanuman_mountain: '1464822759023-fed622ff2c3b',
  universal_sharing_blanket: '1478760329108-5c3ed9d495a0',
  universal_bravery_first_step: '1478760329108-5c3ed9d495a0',
};

// Story titles (needed for OG tags)
const TITLES = {
  krishna_squirrel: { title: 'Krishna and the Little Squirrel', tradition: 'Hindu', duration: 10 },
  prophet_camel: { title: 'The Prophet and the Crying Camel', tradition: 'Islam', duration: 10 },
  jesus_birds: { title: 'Jesus and the Birds of the Air', tradition: 'Christian', duration: 10 },
  buddha_swan: { title: 'Buddha and the Wounded Swan', tradition: 'Buddhist', duration: 10 },
  guru_nanak_grain: { title: 'Guru Nanak and the True Meal', tradition: 'Sikh', duration: 10 },
  hanuman_mountain: { title: 'Hanuman and the Mountain', tradition: 'Hindu', duration: 10 },
  mahavir_ant: { title: 'Mahavir and the Ants', tradition: 'Jain', duration: 10 },
  jewish_noah: { title: "Noah's Rainbow", tradition: 'Jewish', duration: 10 },
  universal_sharing_blanket: { title: 'The Blanket That Grew', tradition: 'Universal', duration: 7 },
  universal_bravery_first_step: { title: 'The Girl Who Walked Into the Dark', tradition: 'Universal', duration: 7 },
  draupadi_akshaya_patra: { title: 'Draupadi and the Vessel That Never Emptied', tradition: 'Hindu', duration: 9 },
  universal_humility_mountain: { title: 'The Mountain That Learned to Bow', tradition: 'Universal', duration: 7 },
  panchatantra_monkey_crocodile: { title: 'The Monkey and the Crocodile', tradition: 'Hindu', duration: 7 },
  panchatantra_crow_pitcher: { title: 'The Crow and the Pitcher', tradition: 'Hindu', duration: 7 },
  ram_golden_deer: { title: 'Ram and the Golden Deer', tradition: 'Hindu', duration: 9 },
  akbar_birbal_well: { title: "Akbar and Birbal's Well", tradition: 'Hindu', duration: 8 },
  sikh_water_carrier: { title: 'Bhai Kanhaiya — The Water Carrier', tradition: 'Sikh', duration: 10 },
  prophet_ant_hill: { title: 'The Prophet and the Ant Hill', tradition: 'Islam', duration: 8 },
  prophet_thirsty_dog: { title: 'The Woman and the Thirsty Dog', tradition: 'Islam', duration: 8 },
  good_samaritan: { title: 'The Good Samaritan', tradition: 'Christian', duration: 10 },
  universal_lighthouse_keeper: { title: 'The Lighthouse Keeper', tradition: 'Universal', duration: 7 },
  universal_wisdom_two_wolves: { title: 'The Two Wolves', tradition: 'Universal', duration: 7 },
  ganesha_mouse: { title: 'Ganesha and the Mouse', tradition: 'Hindu', duration: 7 },
  krishna_butter: { title: 'Krishna and the Butter', tradition: 'Hindu', duration: 7 },
  harishchandra_promise: { title: "Harishchandra's Promise", tradition: 'Hindu', duration: 9 },
  sudama_poha: { title: "Sudama's Poha", tradition: 'Hindu', duration: 9 },
  karna_golden_armour: { title: "Karna's Golden Armour", tradition: 'Hindu', duration: 8 },
  ram_shabari_berries: { title: "Shabari's Berries", tradition: 'Hindu', duration: 8 },
  hanuman_chest: { title: "Hanuman's Heart", tradition: 'Hindu', duration: 8 },
  jesus_mustard_seed: { title: 'The Mustard Seed', tradition: 'Christian', duration: 10 },
  buddha_elephant: { title: 'Buddha and the Elephant', tradition: 'Buddhist', duration: 10 },
  buddha_rice_bowl: { title: "Sujata's Rice Bowl", tradition: 'Buddhist', duration: 8 },
  jain_true_wealth: { title: 'True Wealth', tradition: 'Jain', duration: 8 },
  jain_spider_web: { title: "The Spider's Web", tradition: 'Jain', duration: 7 },
  jewish_one_good_deed: { title: 'One Good Deed', tradition: 'Jewish', duration: 8 },
  jewish_two_pockets: { title: 'The Two Pockets', tradition: 'Jewish', duration: 7 },
  sikh_langar: { title: 'The Langar', tradition: 'Sikh', duration: 8 },
  universal_garden_of_mistakes: { title: 'The Garden of Mistakes', tradition: 'Universal', duration: 7 },
  universal_invisible_boy: { title: 'The Invisible Boy', tradition: 'Universal', duration: 7 },
  universal_patience_river: { title: 'The Patient River', tradition: 'Universal', duration: 7 },
  universal_respect_old_tree: { title: 'The Old Tree', tradition: 'Universal', duration: 7 },
  universal_forgiveness_kite: { title: 'The Forgiveness Kite', tradition: 'Universal', duration: 7 },
};

export default async function handler(req, res) {
  let storyId = req.query?.id || '';
  if (!storyId && req.url) {
    try {
      const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
      storyId = url.searchParams.get('id') || '';
    } catch {}
  }

  const lessonId = storyId.startsWith('lesson_') ? storyId.slice(7) : storyId;
  const story = TITLES[lessonId];

  const title = story ? story.title : 'A Bedtime Story';
  const tradition = story ? story.tradition : '';
  const duration = story ? `${story.duration} min` : '';
  const description = story
    ? `Listen to "${title}" — a ${tradition} bedtime story that teaches real values. ${duration}. Free on My Sleepy Tale.`
    : 'A personalized bedtime story that teaches values. Free on My Sleepy Tale.';

  // Get actual generated image from Firestore (admin-generated DALL-E images)
  const wisdomImages = await getWisdomImages();
  let image = wisdomImages[lessonId] || '';

  // Fallback to Unsplash if no Firestore image
  if (!image) {
    const fallbackId = FALLBACK_IMG[lessonId] || '1544776193-352d25ca82cd';
    image = `https://images.unsplash.com/photo-${fallbackId}?w=1200&h=630&fit=crop&q=80`;
  }

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
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(html);
}
