// Dynamic OG tags for shared story links.
// Fetches actual generated images from Firestore when available.
// Falls back to Unsplash for stories without generated images.

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'qissaa-61a78';
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

let imageCache = null;
let galleryCache = null;
let cacheTime = 0;

// Parse Firestore REST API document fields into a plain object
function parseFields(fields) {
  const result = {};
  for (const [key, val] of Object.entries(fields || {})) {
    if (val.stringValue !== undefined) result[key] = val.stringValue;
    else if (val.arrayValue) result[key] = (val.arrayValue.values || []).map(v => v.stringValue || '');
  }
  return result;
}

// Load wisdom images + gallery from Firestore REST API (no auth needed for public reads)
async function getWisdomImages() {
  const now = Date.now();
  if (imageCache && (now - cacheTime) < 300000) return { images: imageCache, gallery: galleryCache || {} };
  try {
    const [imgRes, galRes] = await Promise.all([
      fetch(`${FIRESTORE_URL}/config/wisdomImages`),
      fetch(`${FIRESTORE_URL}/config/wisdomGallery`),
    ]);
    if (imgRes.ok) {
      const data = await imgRes.json();
      imageCache = parseFields(data.fields);
    } else { imageCache = imageCache || {}; }
    if (galRes.ok) {
      const data = await galRes.json();
      galleryCache = parseFields(data.fields);
    } else { galleryCache = galleryCache || {}; }
    cacheTime = now;
    console.log('[share] Firestore loaded: images=', Object.keys(imageCache).length, 'keys | gallery=', Object.keys(galleryCache).length, 'keys');
    return { images: imageCache, gallery: galleryCache };
  } catch (e) { console.error('[share] Firestore error:', e.message); return { images: imageCache || {}, gallery: galleryCache || {} }; }
}

// Default fallback image — our own generated image, no Unsplash
const DEFAULT_OG_IMAGE = 'https://mysleepytale.com/dsp_ep1_development.png';

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
  // Series — Fire Truck Academy
  fta_ep1_afraid: { title: 'Afraid of Fire', tradition: 'Universal', duration: 4, series: 'Fire Truck Academy', ep: 1, totalEp: 3 },
  fta_ep2_big_test: { title: 'The Big Test', tradition: 'Universal', duration: 4, series: 'Fire Truck Academy', ep: 2, totalEp: 3 },
  fta_ep3_saving_day: { title: 'Saving the Day', tradition: 'Universal', duration: 4, series: 'Fire Truck Academy', ep: 3, totalEp: 3 },
  // Series — Rocket Adventures
  ra_ep1_liftoff: { title: 'Liftoff!', tradition: 'Universal', duration: 4, series: 'Rocket Adventures', ep: 1, totalEp: 3 },
  ra_ep2_space_walk: { title: 'The Space Walk', tradition: 'Universal', duration: 4, series: 'Rocket Adventures', ep: 2, totalEp: 3 },
  ra_ep3_home: { title: 'Coming Home', tradition: 'Universal', duration: 4, series: 'Rocket Adventures', ep: 3, totalEp: 3 },
  // Series — Kindness Squad
  ks_ep1_invisible: { title: 'The Invisible Power', tradition: 'Universal', duration: 4, series: 'The Kindness Squad', ep: 1, totalEp: 3 },
  ks_ep2_shield: { title: 'The Patience Shield', tradition: 'Universal', duration: 4, series: 'The Kindness Squad', ep: 2, totalEp: 3 },
  ks_ep3_forgiveness: { title: 'The Forgiveness Force', tradition: 'Universal', duration: 4, series: 'The Kindness Squad', ep: 3, totalEp: 3 },
  // Series — Around the World
  aw_ep1_japan: { title: 'Cherry Blossoms in Tokyo', tradition: 'Universal', duration: 4, series: 'Around the World in 3 Nights', ep: 1, totalEp: 3 },
  aw_ep2_egypt: { title: 'Stars Over the Pyramids', tradition: 'Universal', duration: 4, series: 'Around the World in 3 Nights', ep: 2, totalEp: 3 },
  aw_ep3_brazil: { title: 'Dancing in Rio', tradition: 'Universal', duration: 4, series: 'Around the World in 3 Nights', ep: 3, totalEp: 3 },
  // Series — Pluto's Journey
  pj_ep1_small: { title: 'Too Small', tradition: 'Universal', duration: 4, series: "Pluto's Journey", ep: 1, totalEp: 3 },
  pj_ep2_far: { title: 'So Far Away', tradition: 'Universal', duration: 4, series: "Pluto's Journey", ep: 2, totalEp: 3 },
  pj_ep3_special: { title: 'Something Special', tradition: 'Universal', duration: 4, series: "Pluto's Journey", ep: 3, totalEp: 3 },
  // Series — Cricket Champions
  cc_ep1_dream: { title: 'The Dream', tradition: 'Universal', duration: 4, series: 'Cricket Champions', ep: 1, totalEp: 3 },
  cc_ep2_practice: { title: 'Practice Day', tradition: 'Universal', duration: 4, series: 'Cricket Champions', ep: 2, totalEp: 3 },
  cc_ep3_match: { title: 'The Big Match', tradition: 'Universal', duration: 4, series: 'Cricket Champions', ep: 3, totalEp: 3 },
  // Series — Rainbow Kindergarten
  rk_ep1_canoe: { title: 'Shapes at Canoe Landing', tradition: 'Universal', duration: 4, series: 'Rainbow Kindergarten Adventures', ep: 1, totalEp: 3 },
  rk_ep2_concert: { title: 'What a Wonderful World', tradition: 'Universal', duration: 4, series: 'Rainbow Kindergarten Adventures', ep: 2, totalEp: 3 },
  rk_ep3_brickworks: { title: 'The Field Trip to Brick Works', tradition: 'Universal', duration: 4, series: 'Rainbow Kindergarten Adventures', ep: 3, totalEp: 3 },
  // Series — Dr. Spock Says
  dsp_ep1_development: { title: 'Growing So Fast', tradition: 'Universal', duration: 2, series: 'Dr. Spock Says', ep: 1, totalEp: 5 },
  dsp_ep2_ailments: { title: 'Sniffles and Tummy Aches', tradition: 'Universal', duration: 2, series: 'Dr. Spock Says', ep: 2, totalEp: 5 },
  dsp_ep3_firstaid: { title: 'Bumps, Burns, and Boo-Boos', tradition: 'Universal', duration: 2, series: 'Dr. Spock Says', ep: 3, totalEp: 5 },
  dsp_ep4_behavior: { title: 'Big Feelings, Little Body', tradition: 'Universal', duration: 2, series: 'Dr. Spock Says', ep: 4, totalEp: 5 },
  dsp_ep5_special: { title: 'Every Child Shines', tradition: 'Universal', duration: 2, series: 'Dr. Spock Says', ep: 5, totalEp: 5 },
  // Series (whole series, not individual episodes)
  'rainbow-kindergarten-jlps-yr25-26': { title: 'Rainbow Kindergarten Adventures', tradition: 'Universal', duration: null, isSeries: true, totalEp: 3, description: 'The Rainbow batch from JLPS explores Toronto — shapes at Canoe Landing, a concert, and the Brick Works field trip.', firstEpId: 'rk_ep1_canoe', seriesUrl: '/series/rainbow-kindergarten-jlps-yr25-26' },
  'dr-spock-parenting': { title: 'Dr. Spock Says', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime conversations with Dr. Spock about raising 3-to-5-year-olds.', firstEpId: 'dsp_ep1_development', seriesUrl: '/series/dr-spock-parenting' },
  // Collections
  col_fire_truck: { title: 'The Bravest Fire Truck', tradition: 'Universal', duration: 4 },
  col_dog: { title: 'The Loyal Dog', tradition: 'Universal', duration: 4 },
  col_kitten: { title: 'The Curious Kitten', tradition: 'Universal', duration: 4 },
  col_rabbit: { title: 'The Gentle Rabbit', tradition: 'Universal', duration: 4 },
  col_invisible_hero: { title: 'The Invisible Hero', tradition: 'Universal', duration: 4 },
  col_cape_of_courage: { title: 'Cape of Courage', tradition: 'Universal', duration: 4 },
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
  // Check both the raw storyId and lessonId (series IDs have hyphens, not lesson_ prefix)
  const story = TITLES[storyId] || TITLES[lessonId];

  const isSeries = story?.isSeries;
  const title = story ? story.title : 'A Bedtime Story';
  const tradition = story ? story.tradition : '';
  const duration = story?.duration ? `${story.duration} min` : '';

  let description;
  if (isSeries) {
    description = `${story.description || ''} ${story.totalEp} bedtime episodes. Free on My Sleepy Tale.`;
  } else {
    const seriesInfo = story?.series ? `Episode ${story.ep} of ${story.totalEp} in "${story.series}". ` : '';
    description = story
      ? `${seriesInfo}Listen to "${title}" — a ${tradition} bedtime story that teaches real values. ${duration}. Free on My Sleepy Tale.`
      : 'A personalized bedtime story that teaches values. Free on My Sleepy Tale.';
  }

  // Get actual generated image from Firestore
  const { images: wisdomImages, gallery: wisdomGallery } = await getWisdomImages();
  // For series, look up first episode's image
  const imageKey = isSeries ? (story.firstEpId || lessonId) : lessonId;
  let image = wisdomImages[imageKey] || wisdomImages[storyId] || '';
  if (!image) {
    const galleryPhotos = wisdomGallery[imageKey] || wisdomGallery[storyId] || wisdomGallery[lessonId] || [];
    if (galleryPhotos.length > 0) image = galleryPhotos[0];
  }

  // Fallback to our own generated default image
  if (!image) {
    image = DEFAULT_OG_IMAGE;
  }

  // Series → redirect to series page, episodes/stories → redirect to player
  const redirectUrl = isSeries
    ? `https://mysleepytale.com${story.seriesUrl}`
    : `https://mysleepytale.com/player?storyId=${storyId || 'lesson_' + lessonId}`;

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
  <meta http-equiv="refresh" content="0;url=${redirectUrl}">
</head>
<body>
  <p>Redirecting to <a href="${redirectUrl}">${title}</a>...</p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.status(200).send(html);
}
