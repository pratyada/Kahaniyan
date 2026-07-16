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
  // ─── All Series (shareable OG tags) ───
  'fire-truck-academy': { title: 'Fire Truck Academy', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Engine 7 joins the fire academy — 5 nights of courage, teamwork, and finding your bravery.', firstEpId: 'fta_ep1_afraid', seriesUrl: '/series/fire-truck-academy' },
  'panchatantra-tales': { title: 'Panchatantra Tales', tradition: 'Hindu', duration: null, isSeries: true, totalEp: 3, description: 'Ancient Indian stories of clever animals — the monkey, the crow, and the crocodile.', firstEpId: 'pt_ep1_monkey', seriesUrl: '/series/panchatantra-tales' },
  'lightning-wheels': { title: 'Lightning Wheels', tradition: 'Universal', duration: null, isSeries: true, totalEp: 3, description: 'Flash the race car learns that winning isn\'t everything. Speed, friendship, and the road ahead.', firstEpId: 'lw_ep1_fastest', seriesUrl: '/series/lightning-wheels' },
  'rocket-adventures': { title: 'Rocket Adventures', tradition: 'Universal', duration: null, isSeries: true, totalEp: 3, description: 'Rocket 5 overcomes her fear of heights and explores the solar system.', firstEpId: 'ra_ep1_heights', seriesUrl: '/series/rocket-adventures' },
  'kindness-squad': { title: 'The Kindness Squad', tradition: 'Universal', duration: null, isSeries: true, totalEp: 3, description: '3 kids discover their superpowers — and they\'re all about kindness.', firstEpId: 'ks_ep1_cape', seriesUrl: '/series/kindness-squad' },
  'planet-explorers': { title: 'Planet Explorers', tradition: 'Universal', duration: null, isSeries: true, totalEp: 3, description: 'Travel the solar system — Moon, Mars, and Pluto each have a story to tell.', firstEpId: 'pe_ep1_moon', seriesUrl: '/series/planet-explorers' },
  fifa26_ep10_ronaldo: { title: "Ronaldo's Gift of Gratitude in Toronto", tradition: 'Universal', duration: 2, series: 'FIFA World Cup 2026 — USA, Mexico, Canada', ep: 10, totalEp: 11, ogImage: 'https://mysleepytale.com/media/published/fifa_world_cup_2026_ep8_ronaldo_s_gift_of_gratitude_in_img0.jpg' },
  fifa26_ep11_hiro: { title: "Hiro's Big Heart at the World Cup", tradition: 'Universal', duration: 3, series: 'FIFA World Cup 2026 — USA, Mexico, Canada', ep: 11, totalEp: 12, ogImage: 'https://mysleepytale.com/media/published/fifa_world_cup_2026_dallas_ep7_hiro_s_big_heart_at_the_world__cover.jpg' },
  fifa26_ep12_erling: { title: "Erling's Golden Path: A Story of Hard Work and Kindness", tradition: 'Universal', duration: 2, series: 'FIFA World Cup 2026 — USA, Mexico, Canada', ep: 12, totalEp: 17 },
  fifa26_ep13_norway_homecoming: { title: "Norway's Golden Homecoming", tradition: 'Universal', duration: 3, series: 'FIFA World Cup 2026 — USA, Mexico, Canada', ep: 13, totalEp: 17 },
  fifa26_ep14_france_spain: { title: "When France Danced Past Spain", tradition: 'Universal', duration: 3, series: 'FIFA World Cup 2026 — USA, Mexico, Canada', ep: 14, totalEp: 17 },
  fifa26_ep15_england_argentina: { title: "The Night the Game Refused to End", tradition: 'Universal', duration: 4, series: 'FIFA World Cup 2026 — USA, Mexico, Canada', ep: 15, totalEp: 17 },
  fifa26_ep16_egypt_argentina_final: { title: "Egypt's Golden Run — The Final That Moved the World", tradition: 'Universal', duration: 4, series: 'FIFA World Cup 2026 — USA, Mexico, Canada', ep: 16, totalEp: 17 },
  fifa26_ep17_finals_ready: { title: "The Night Before the Final — When Dreams Come True", tradition: 'Universal', duration: 3, series: 'FIFA World Cup 2026 — USA, Mexico, Canada', ep: 17, totalEp: 17 },
  rk_ep7_photo_day: { title: 'Photo Day & The Grateful Garden Party', tradition: 'Universal', duration: 2, series: 'Rainbow Kindergarten Adventures', ep: 7, totalEp: 7, ogImage: 'https://mysleepytale.com/media/published/rainbow_kindergarten_jlps_yr25_26_ep7_rainbow_class_s_grateful_garde_cover.jpg' },
  'rainbow-kindergarten-jlps-yr25-26': { title: 'Rainbow Kindergarten Adventures', tradition: 'Universal', duration: null, isSeries: true, totalEp: 7, description: 'The Rainbow batch from JLPS explores Toronto — shapes at Canoe Landing, a concert, the Brick Works field trip, summer fun, and birthday parties.', firstEpId: 'rk_ep1_canoe', seriesUrl: '/series/rainbow-kindergarten-jlps-yr25-26' },
  rk_ep6_aarhi_birthday: { title: "Aarhi's Birthday at Jump and Joy", tradition: 'Universal', duration: 2, series: 'Rainbow Kindergarten Adventures', ep: 6, totalEp: 6, ogImage: 'https://mysleepytale.com/media/story-gallery/rk_ep6_aarhi_bday_1.jpeg' },
  'dr-spock-parenting': { title: 'Dr. Spock Says', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime conversations with Dr. Spock about raising 3-to-5-year-olds.', firstEpId: 'dsp_ep1_development', seriesUrl: '/series/dr-spock-parenting' },
  'little-astronaut': { title: 'Little Astronaut', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'A child astronaut explores the solar system — each planet teaches a new lesson.', firstEpId: 'la_ep1_launch', seriesUrl: '/series/little-astronaut' },
  'who-would-win-series': { title: 'Who Would Win?', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Professor Puzzle hosts five legendary debates — who would REALLY win?', firstEpId: 'www_ep1_lion_eagle', seriesUrl: '/series/who-would-win-series' },
  'camping-outdoors': { title: 'Camping & Outdoors', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'A family goes camping for 5 nights — each night a different adventure and lesson.', firstEpId: 'co_ep1_setup', seriesUrl: '/series/camping-outdoors' },
  'music-lessons': { title: 'Music Lessons', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five instruments, five lessons — music teaches what words cannot.', firstEpId: 'ml_ep1_drum', seriesUrl: '/series/music-lessons' },
  'water-and-swim': { title: 'Water & Swim', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'A child learns to swim over 5 sessions — each time conquering a new fear in the water.', firstEpId: 'ws_ep1_splash', seriesUrl: '/series/water-and-swim' },
  'maths-adventures': { title: 'Maths Adventures', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Math concepts taught through adventures — counting, shapes, patterns, fractions, and measuring.', firstEpId: 'ma_ep1_garden', seriesUrl: '/series/maths-adventures' },
  'planets-and-stars': { title: 'Planets & Stars', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Why does the Moon glow? Why is Mars red? Each planet has a personality, a story, and a life lesson — bedtime tales from across the solar system.', firstEpId: 'ps_ep1_moon', seriesUrl: '/series/planets-and-stars' },
  'geometry-shapes': { title: 'Geometry & Shapes', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Shapes come alive as characters — each one unique, each one important.', firstEpId: 'gs_ep1_circle', seriesUrl: '/series/geometry-shapes' },
  'rocket-adventures-team': { title: 'Rocket Adventures', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'A team of kid astronauts build and fly a rocket — engineering, teamwork, and the stars.', firstEpId: 'rat_ep1_build', seriesUrl: '/series/rocket-adventures-team' },
  'who-would-win-animals': { title: 'Who Would Win? — Animal Battles', tradition: 'Universal', duration: null, isSeries: true, totalEp: 10, description: 'Two animals enter. One wins. But BOTH teach you something amazing. Real animal facts, epic showdowns, and a surprise ending every time.', firstEpId: 'wwwa_ep1_lion_tiger', seriesUrl: '/series/who-would-win-animals' },
  'discover-india': { title: 'Discover India', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Fly across the land of spices, tigers, and ancient wonders — 5 bedtime adventures through incredible India.', firstEpId: 'india_ep1_geo', seriesUrl: '/series/discover-india' },
  'discover-canada': { title: 'Discover Canada', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Journey through maple forests, frozen tundras, and friendly cities — 5 bedtime adventures across the Great White North.', firstEpId: 'canada_ep1_geo', seriesUrl: '/series/discover-canada' },
  'discover-united-states': { title: 'Discover United States', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Coast to coast across America — 5 bedtime adventures through a land of big dreams and even bigger landscapes.', firstEpId: 'usa_ep1_geo', seriesUrl: '/series/discover-united-states' },
  'discover-united-kingdom': { title: 'Discover United Kingdom', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Castles, kings, and cozy countryside — 5 bedtime adventures through England, Scotland, Wales, and Northern Ireland.', firstEpId: 'uk_ep1_geo', seriesUrl: '/series/discover-united-kingdom' },
  'discover-japan': { title: 'Discover Japan', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Cherry blossoms, bullet trains, and ancient temples — 5 bedtime adventures through the Land of the Rising Sun.', firstEpId: 'japan_ep1_geo', seriesUrl: '/series/discover-japan' },
  'discover-china': { title: 'Discover China', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime journeys across China — mountains, emperors, palaces, dumplings, and records that will blow your mind.', firstEpId: 'dc_cn_ep1_geo', seriesUrl: '/series/discover-china' },
  'discover-australia': { title: 'Discover Australia', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime journeys across Australia — coral reefs, ancient stories, opera houses, meat pies, and the wildest wildlife on Earth.', firstEpId: 'dc_au_ep1_geo', seriesUrl: '/series/discover-australia' },
  'discover-brazil': { title: 'Discover Brazil', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime journeys across Brazil — the Amazon, ancient peoples, towering statues, samba rhythms, and jaw-dropping records.', firstEpId: 'dc_br_ep1_geo', seriesUrl: '/series/discover-brazil' },
  'discover-france': { title: 'Discover France', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime journeys across France — lavender fields, knights, the Eiffel Tower, croissants, and records that sparkle.', firstEpId: 'dc_fr_ep1_geo', seriesUrl: '/series/discover-france' },
  'discover-egypt': { title: 'Discover Egypt', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime journeys across Egypt — the Nile, pharaohs, pyramids, spices, and records carved in stone.', firstEpId: 'dc_eg_ep1_geo', seriesUrl: '/series/discover-egypt' },
  'discover-mexico': { title: 'Discover Mexico', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime journeys through Mexico — volcanoes, pyramids, bright colors, and amazing flavors.', firstEpId: 'dc_mx_ep1_geo', seriesUrl: '/series/discover-mexico' },
  'discover-italy': { title: 'Discover Italy', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime journeys through Italy — rolling hills, Roman roads, art, pasta, and impossible records.', firstEpId: 'dc_it_ep1_geo', seriesUrl: '/series/discover-italy' },
  'discover-germany': { title: 'Discover Germany', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime journeys through Germany — forests, castles, inventions, pretzels, and record-breaking feats.', firstEpId: 'dc_de_ep1_geo', seriesUrl: '/series/discover-germany' },
  'discover-southkorea': { title: 'Discover South Korea', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime journeys through South Korea — misty mountains, ancient palaces, K-pop beats, and mind-blowing tech.', firstEpId: 'dc_kr_ep1_geo', seriesUrl: '/series/discover-southkorea' },
  'discover-russia': { title: 'Discover Russia', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime journeys through Russia — frozen tundra, golden domes, ballet, borscht, and breathtaking records.', firstEpId: 'dc_ru_ep1_geo', seriesUrl: '/series/discover-russia' },
  'discover-southafrica': { title: 'Discover South Africa', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime journeys through the Rainbow Nation — from Table Mountain to the Big Five.', firstEpId: 'dc_za_ep1_geo', seriesUrl: '/series/discover-southafrica' },
  'discover-turkey': { title: 'Discover Turkey', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime journeys through the land where East meets West — bazaars, balloons, and ancient empires.', firstEpId: 'dc_tr_ep1_geo', seriesUrl: '/series/discover-turkey' },
  'discover-uae': { title: 'Discover UAE', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime journeys through the land of sand dunes and skyscrapers — where the desert touches the future.', firstEpId: 'dc_ae_ep1_geo', seriesUrl: '/series/discover-uae' },
  'discover-spain': { title: 'Discover Spain', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime journeys through the land of flamenco, fiestas, and golden sun.', firstEpId: 'dc_es_ep1_geo', seriesUrl: '/series/discover-spain' },
  'discover-newzealand': { title: 'Discover New Zealand', tradition: 'Universal', duration: null, isSeries: true, totalEp: 5, description: 'Five bedtime journeys through the land of the long white cloud — mountains, geysers, and Maori legends.', firstEpId: 'dc_nz_ep1_geo', seriesUrl: '/series/discover-newzealand' },
  'tallest-towers': { title: 'Tallest Towers in the World', tradition: 'Universal', duration: null, isSeries: true, totalEp: 20, description: 'From the Burj Khalifa to the CN Tower — 20 episodes about the tallest structures ever built by humans.', firstEpId: 'tt_ep1_burj_khalifa', seriesUrl: '/series/tallest-towers' },
  // Series — Planets & Stars episodes
  ps_ep1_moon: { title: 'Why the Moon Glows', tradition: 'Universal', duration: 5, series: 'Planets & Stars', ep: 1, totalEp: 5 },
  ps_ep2_mars: { title: 'Mars — The Planet That Lost Everything', tradition: 'Universal', duration: 5, series: 'Planets & Stars', ep: 2, totalEp: 5 },
  ps_ep3_jupiter: { title: 'Jupiter and the Great Red Spot', tradition: 'Universal', duration: 5, series: 'Planets & Stars', ep: 3, totalEp: 5 },
  ps_ep4_saturn: { title: 'Saturn and Her Rings of Lost Things', tradition: 'Universal', duration: 5, series: 'Planets & Stars', ep: 4, totalEp: 5 },
  ps_ep5_pluto: { title: 'Pluto — Too Small, Too Far, Too Loved', tradition: 'Universal', duration: 5, series: 'Planets & Stars', ep: 5, totalEp: 5 },
  // Series — Fire Truck Academy episodes
  fta_ep1_afraid: { title: 'Afraid of Fire', tradition: 'Universal', duration: 5, series: 'Fire Truck Academy', ep: 1, totalEp: 5 },
  fta_ep2_rescue: { title: 'The Rescue', tradition: 'Universal', duration: 5, series: 'Fire Truck Academy', ep: 2, totalEp: 5 },
  fta_ep3_teamwork: { title: 'Teamwork Drill', tradition: 'Universal', duration: 5, series: 'Fire Truck Academy', ep: 3, totalEp: 5 },
  fta_ep4_false_alarm: { title: 'The False Alarm', tradition: 'Universal', duration: 5, series: 'Fire Truck Academy', ep: 4, totalEp: 5 },
  fta_ep5_graduation: { title: 'Graduation Day', tradition: 'Universal', duration: 5, series: 'Fire Truck Academy', ep: 5, totalEp: 5 },
  // Series — Panchatantra Tales episodes
  pt_ep1_monkey: { title: 'The Monkey and the Crocodile', tradition: 'Hindu', duration: 5, series: 'Panchatantra Tales', ep: 1, totalEp: 3 },
  pt_ep2_crow: { title: 'The Crow and the Pitcher', tradition: 'Hindu', duration: 4, series: 'Panchatantra Tales', ep: 2, totalEp: 3 },
  pt_ep3_tortoise: { title: 'The Tortoise and the Geese', tradition: 'Hindu', duration: 4, series: 'Panchatantra Tales', ep: 3, totalEp: 3 },
  // Series — Lightning Wheels episodes
  lw_ep1_fastest: { title: 'The Fastest Car in Town', tradition: 'Universal', duration: 4, series: 'Lightning Wheels', ep: 1, totalEp: 3 },
  lw_ep2_flat_tire: { title: 'The Flat Tire', tradition: 'Universal', duration: 4, series: 'Lightning Wheels', ep: 2, totalEp: 3 },
  lw_ep3_last_race: { title: 'The Last Race', tradition: 'Universal', duration: 5, series: 'Lightning Wheels', ep: 3, totalEp: 3 },
  // Series — Planet Explorers episodes
  pe_ep1_moon: { title: 'Why the Moon Is Never Lonely', tradition: 'Universal', duration: 4, series: 'Planet Explorers', ep: 1, totalEp: 3 },
  pe_ep2_mars: { title: 'Why Mars Is Red', tradition: 'Universal', duration: 4, series: 'Planet Explorers', ep: 2, totalEp: 3 },
  pe_ep3_pluto: { title: "Pluto's Big Heart", tradition: 'Universal', duration: 4, series: 'Planet Explorers', ep: 3, totalEp: 3 },
  // Series — Little Astronaut episodes
  la_ep1_launch: { title: 'Launch Day', tradition: 'Universal', duration: 5, series: 'Little Astronaut', ep: 1, totalEp: 5 },
  la_ep2_moon: { title: 'Walking on the Moon', tradition: 'Universal', duration: 5, series: 'Little Astronaut', ep: 2, totalEp: 5 },
  la_ep3_mars: { title: 'The Mars Garden', tradition: 'Universal', duration: 5, series: 'Little Astronaut', ep: 3, totalEp: 5 },
  la_ep4_saturn: { title: "Saturn's Ring Race", tradition: 'Universal', duration: 5, series: 'Little Astronaut', ep: 4, totalEp: 5 },
  la_ep5_home: { title: 'Coming Home', tradition: 'Universal', duration: 5, series: 'Little Astronaut', ep: 5, totalEp: 5 },
  // Series — Who Would Win episodes
  www_ep1_lion_eagle: { title: 'Lion vs Eagle', tradition: 'Universal', duration: 5, series: 'Who Would Win?', ep: 1, totalEp: 5 },
  www_ep2_ant_elephant: { title: 'Ant vs Elephant', tradition: 'Universal', duration: 5, series: 'Who Would Win?', ep: 2, totalEp: 5 },
  www_ep3_sun_wind: { title: 'Sun vs Wind', tradition: 'Universal', duration: 5, series: 'Who Would Win?', ep: 3, totalEp: 5 },
  www_ep4_brain_muscle: { title: 'Brain vs Muscle', tradition: 'Universal', duration: 5, series: 'Who Would Win?', ep: 4, totalEp: 5 },
  www_ep5_ocean_mountain: { title: 'Ocean vs Mountain', tradition: 'Universal', duration: 5, series: 'Who Would Win?', ep: 5, totalEp: 5 },
  // Series — Camping & Outdoors episodes
  co_ep1_setup: { title: 'Setting Up Camp', tradition: 'Universal', duration: 5, series: 'Camping & Outdoors', ep: 1, totalEp: 5 },
  co_ep2_night_sounds: { title: 'The Night Sounds', tradition: 'Universal', duration: 5, series: 'Camping & Outdoors', ep: 2, totalEp: 5 },
  co_ep3_river: { title: 'The River Crossing', tradition: 'Universal', duration: 5, series: 'Camping & Outdoors', ep: 3, totalEp: 5 },
  co_ep4_campfire: { title: 'Campfire Stories', tradition: 'Universal', duration: 5, series: 'Camping & Outdoors', ep: 4, totalEp: 5 },
  co_ep5_sunrise: { title: 'The Sunrise Hike', tradition: 'Universal', duration: 5, series: 'Camping & Outdoors', ep: 5, totalEp: 5 },
  // Series — Music Lessons episodes
  ml_ep1_drum: { title: 'The Drum That Was Too Loud', tradition: 'Universal', duration: 5, series: 'Music Lessons', ep: 1, totalEp: 5 },
  ml_ep2_violin: { title: 'The Shy Violin', tradition: 'Universal', duration: 5, series: 'Music Lessons', ep: 2, totalEp: 5 },
  ml_ep3_piano: { title: "The Piano's Black and White Keys", tradition: 'Universal', duration: 5, series: 'Music Lessons', ep: 3, totalEp: 5 },
  ml_ep4_singing: { title: 'The Singing Contest', tradition: 'Universal', duration: 5, series: 'Music Lessons', ep: 4, totalEp: 5 },
  ml_ep5_orchestra: { title: 'The Orchestra', tradition: 'Universal', duration: 5, series: 'Music Lessons', ep: 5, totalEp: 5 },
  // Series — Water & Swim episodes
  ws_ep1_splash: { title: 'First Splash', tradition: 'Universal', duration: 5, series: 'Water & Swim', ep: 1, totalEp: 5 },
  ws_ep2_float: { title: 'Learning to Float', tradition: 'Universal', duration: 5, series: 'Water & Swim', ep: 2, totalEp: 5 },
  ws_ep3_deep: { title: 'The Deep End', tradition: 'Universal', duration: 5, series: 'Water & Swim', ep: 3, totalEp: 5 },
  ws_ep4_fish: { title: 'Swimming with Fish', tradition: 'Universal', duration: 5, series: 'Water & Swim', ep: 4, totalEp: 5 },
  ws_ep5_lifeguard: { title: "The Lifeguard's Lesson", tradition: 'Universal', duration: 5, series: 'Water & Swim', ep: 5, totalEp: 5 },
  // Series — Maths Adventures episodes
  ma_ep1_garden: { title: 'The Number Garden', tradition: 'Universal', duration: 5, series: 'Maths Adventures', ep: 1, totalEp: 5 },
  ma_ep2_detective: { title: 'The Shape Detective', tradition: 'Universal', duration: 5, series: 'Maths Adventures', ep: 2, totalEp: 5 },
  ma_ep3_pattern: { title: 'The Pattern Machine', tradition: 'Universal', duration: 5, series: 'Maths Adventures', ep: 3, totalEp: 5 },
  ma_ep4_feast: { title: 'The Fraction Feast', tradition: 'Universal', duration: 5, series: 'Maths Adventures', ep: 4, totalEp: 5 },
  ma_ep5_measure: { title: 'The Measurement Mission', tradition: 'Universal', duration: 5, series: 'Maths Adventures', ep: 5, totalEp: 5 },
  // Series — Geometry & Shapes episodes
  gs_ep1_circle: { title: 'The Circle Who Had No Corners', tradition: 'Universal', duration: 5, series: 'Geometry & Shapes', ep: 1, totalEp: 5 },
  gs_ep2_triangle: { title: "The Triangle's Three Friends", tradition: 'Universal', duration: 5, series: 'Geometry & Shapes', ep: 2, totalEp: 5 },
  gs_ep3_square: { title: 'The Square Who Wanted to Be Different', tradition: 'Universal', duration: 5, series: 'Geometry & Shapes', ep: 3, totalEp: 5 },
  gs_ep4_hexagon: { title: "The Hexagon's Secret", tradition: 'Universal', duration: 5, series: 'Geometry & Shapes', ep: 4, totalEp: 5 },
  gs_ep5_city: { title: 'Shapes Build a City', tradition: 'Universal', duration: 5, series: 'Geometry & Shapes', ep: 5, totalEp: 5 },
  // Series — Rocket Adventures Team episodes
  rat_ep1_build: { title: 'Building the Rocket', tradition: 'Universal', duration: 5, series: 'Rocket Adventures', ep: 1, totalEp: 5 },
  rat_ep2_launch: { title: 'Countdown and Launch', tradition: 'Universal', duration: 5, series: 'Rocket Adventures', ep: 2, totalEp: 5 },
  rat_ep3_asteroid: { title: 'Asteroid Dodge', tradition: 'Universal', duration: 5, series: 'Rocket Adventures', ep: 3, totalEp: 5 },
  rat_ep4_station: { title: 'The Space Station', tradition: 'Universal', duration: 5, series: 'Rocket Adventures', ep: 4, totalEp: 5 },
  rat_ep5_landing: { title: 'Landing on a New World', tradition: 'Universal', duration: 5, series: 'Rocket Adventures', ep: 5, totalEp: 5 },
  // Series — Who Would Win Animals episodes
  wwwa_ep1_lion_tiger: { title: 'Lion vs Tiger', tradition: 'Universal', duration: 3, series: 'Who Would Win? — Animal Battles', ep: 1, totalEp: 10 },
  wwwa_ep2_scorpion_tarantula: { title: 'Scorpion vs Tarantula', tradition: 'Universal', duration: 3, series: 'Who Would Win? — Animal Battles', ep: 2, totalEp: 10 },
  wwwa_ep3_cheetah_leopard: { title: 'Cheetah vs Leopard', tradition: 'Universal', duration: 3, series: 'Who Would Win? — Animal Battles', ep: 3, totalEp: 10 },
  wwwa_ep4_shark_croc: { title: 'Great White Shark vs Saltwater Crocodile', tradition: 'Universal', duration: 3, series: 'Who Would Win? — Animal Battles', ep: 4, totalEp: 10 },
  wwwa_ep5_eagle_owl: { title: 'Golden Eagle vs Great Horned Owl', tradition: 'Universal', duration: 3, series: 'Who Would Win? — Animal Battles', ep: 5, totalEp: 10 },
  wwwa_ep6_gorilla_bear: { title: 'Silverback Gorilla vs Grizzly Bear', tradition: 'Universal', duration: 3, series: 'Who Would Win? — Animal Battles', ep: 6, totalEp: 10 },
  wwwa_ep7_cobra_mongoose: { title: 'King Cobra vs Mongoose', tradition: 'Universal', duration: 3, series: 'Who Would Win? — Animal Battles', ep: 7, totalEp: 10 },
  wwwa_ep8_whale_squid: { title: 'Sperm Whale vs Giant Squid', tradition: 'Universal', duration: 3, series: 'Who Would Win? — Animal Battles', ep: 8, totalEp: 10 },
  wwwa_ep9_rhino_hippo: { title: 'Rhinoceros vs Hippopotamus', tradition: 'Universal', duration: 3, series: 'Who Would Win? — Animal Battles', ep: 9, totalEp: 10 },
  wwwa_ep10_wolf_hyena: { title: 'Grey Wolf vs Spotted Hyena', tradition: 'Universal', duration: 3, series: 'Who Would Win? — Animal Battles', ep: 10, totalEp: 10 },
  // Series — Discover Countries episodes (first ep of each for OG fallback)
  india_ep1_geo: { title: 'The Land of India', tradition: 'Universal', duration: 3, series: 'Discover India', ep: 1, totalEp: 5 },
  canada_ep1_geo: { title: 'The Land of Canada', tradition: 'Universal', duration: 3, series: 'Discover Canada', ep: 1, totalEp: 5 },
  usa_ep1_geo: { title: 'The Land of America', tradition: 'Universal', duration: 3, series: 'Discover United States', ep: 1, totalEp: 5 },
  uk_ep1_geo: { title: 'The Land of the United Kingdom', tradition: 'Universal', duration: 3, series: 'Discover United Kingdom', ep: 1, totalEp: 5 },
  japan_ep1_geo: { title: 'The Land of Japan', tradition: 'Universal', duration: 3, series: 'Discover Japan', ep: 1, totalEp: 5 },
  dc_cn_ep1_geo: { title: 'Mountains, Rivers & Rice', tradition: 'Universal', duration: 5, series: 'Discover China', ep: 1, totalEp: 5 },
  dc_au_ep1_geo: { title: 'Reefs, Rocks & Red Deserts', tradition: 'Universal', duration: 5, series: 'Discover Australia', ep: 1, totalEp: 5 },
  dc_br_ep1_geo: { title: 'The Amazon & Endless Green', tradition: 'Universal', duration: 5, series: 'Discover Brazil', ep: 1, totalEp: 5 },
  dc_fr_ep1_geo: { title: 'Lavender, Alps & Atlantic Waves', tradition: 'Universal', duration: 5, series: 'Discover France', ep: 1, totalEp: 5 },
  dc_eg_ep1_geo: { title: 'The Nile & the Golden Desert', tradition: 'Universal', duration: 5, series: 'Discover Egypt', ep: 1, totalEp: 5 },
  dc_mx_ep1_geo: { title: 'Mountains of Fire & Turquoise Seas', tradition: 'Universal', duration: 5, series: 'Discover Mexico', ep: 1, totalEp: 5 },
  dc_it_ep1_geo: { title: 'The Boot in the Sea', tradition: 'Universal', duration: 5, series: 'Discover Italy', ep: 1, totalEp: 5 },
  dc_de_ep1_geo: { title: 'The Dark Forest & the Fairy-Tale River', tradition: 'Universal', duration: 5, series: 'Discover Germany', ep: 1, totalEp: 5 },
  dc_kr_ep1_geo: { title: 'Mountains, Islands & the Morning Calm', tradition: 'Universal', duration: 5, series: 'Discover South Korea', ep: 1, totalEp: 5 },
  dc_ru_ep1_geo: { title: 'The Biggest Country on Earth', tradition: 'Universal', duration: 5, series: 'Discover Russia', ep: 1, totalEp: 5 },
  dc_za_ep1_geo: { title: 'The Land at the Bottom of Africa', tradition: 'Universal', duration: 5, series: 'Discover South Africa', ep: 1, totalEp: 5 },
  dc_tr_ep1_geo: { title: 'The Bridge Between Two Worlds', tradition: 'Universal', duration: 5, series: 'Discover Turkey', ep: 1, totalEp: 5 },
  dc_ae_ep1_geo: { title: 'Dunes, Oases, and the Sparkling Gulf', tradition: 'Universal', duration: 5, series: 'Discover UAE', ep: 1, totalEp: 5 },
  dc_es_ep1_geo: { title: 'The Sun-Kissed Peninsula', tradition: 'Universal', duration: 5, series: 'Discover Spain', ep: 1, totalEp: 5 },
  dc_nz_ep1_geo: { title: 'The Land of the Long White Cloud', tradition: 'Universal', duration: 5, series: 'Discover New Zealand', ep: 1, totalEp: 5 },
  tt_ep1_burj_khalifa: { title: 'Burj Khalifa', tradition: 'Universal', duration: 3, series: 'Tallest Towers in the World', ep: 1, totalEp: 20 },
  // ─── Islamic Series ───
  'stories-of-the-prophets': { title: 'Stories of the Prophets', tradition: 'Islam', duration: null, isSeries: true, totalEp: 5, description: 'Five beloved prophets, peace be upon them all — their faith, their patience, and the lessons they left for every child.', firstEpId: 'sop_ep1_ibrahim', seriesUrl: '/series/stories-of-the-prophets' },
  'names-of-allah': { title: 'The Beautiful Names of Allah', tradition: 'Islam', duration: null, isSeries: true, totalEp: 5, description: "Five of Allah's most beautiful names — each one a window into His love, mercy, and care for every child.", firstEpId: 'noa_ep1_rahman', seriesUrl: '/series/names-of-allah' },
  'ramadan-adventures': { title: 'Ramadan Adventures', tradition: 'Islam', duration: null, isSeries: true, totalEp: 5, description: 'The magic of Ramadan — fasting, feasting, giving, praying, and celebrating Eid together.', firstEpId: 'ra_ep1_first_fast', seriesUrl: '/series/ramadan-adventures' },
  'companions-of-prophet': { title: 'Companions of the Prophet', tradition: 'Islam', duration: null, isSeries: true, totalEp: 5, description: 'The incredible people who stood beside Prophet Muhammad, peace be upon him — their loyalty, courage, and love.', firstEpId: 'cop_ep1_abubakr', seriesUrl: '/series/companions-of-prophet' },
  'animals-in-quran': { title: 'Animals in the Quran', tradition: 'Islam', duration: null, isSeries: true, totalEp: 5, description: 'Five amazing animals that appear in the Quran — each one with a lesson as big as the sky.', firstEpId: 'aiq_ep1_hoopoe', seriesUrl: '/series/animals-in-quran' },
  'islamic-manners': { title: 'Islamic Manners — The Adab Series', tradition: 'Islam', duration: null, isSeries: true, totalEp: 5, description: 'Beautiful manners taught by Prophet Muhammad, peace be upon him — the small things that make the biggest difference.', firstEpId: 'im_ep1_salam', seriesUrl: '/series/islamic-manners' },
  'hajj-journey': { title: 'The Hajj Journey', tradition: 'Islam', duration: null, isSeries: true, totalEp: 5, description: 'The greatest journey a Muslim can take — five nights walking through the footsteps of Ibrahim, peace be upon him.', firstEpId: 'hj_ep1_what_is_hajj', seriesUrl: '/series/hajj-journey' },
  'mosque-adventures': { title: 'Mosque Adventures Around the World', tradition: 'Islam', duration: null, isSeries: true, totalEp: 5, description: 'Five incredible mosques from around the world — each one a masterpiece of faith, art, and history.', firstEpId: 'ma_ep1_haram', seriesUrl: '/series/mosque-adventures' },
  'bedtime-duas': { title: 'Bedtime Duas — Prayers Before Sleep', tradition: 'Islam', duration: null, isSeries: true, totalEp: 5, description: 'Five gentle bedtime prayers — each one a conversation with Allah before you drift off to sleep.', firstEpId: 'bd_ep1_sleep_dua', seriesUrl: '/series/bedtime-duas' },
  'muslim-heroes': { title: 'Muslim Heroes — Scientists & Explorers', tradition: 'Islam', duration: null, isSeries: true, totalEp: 5, description: 'Five brilliant Muslim minds who changed the world — with curiosity, courage, and faith.', firstEpId: 'mh_ep1_haytham', seriesUrl: '/series/muslim-heroes' },
  // Islamic series episodes
  sop_ep1_ibrahim: { title: 'Ibrahim and the Stars', tradition: 'Islam', duration: 5, series: 'Stories of the Prophets', ep: 1, totalEp: 5 },
  noa_ep1_rahman: { title: 'Ar-Rahman — The Most Merciful', tradition: 'Islam', duration: 5, series: 'The Beautiful Names of Allah', ep: 1, totalEp: 5 },
  ra_ep1_first_fast: { title: 'My Very First Fast', tradition: 'Islam', duration: 5, series: 'Ramadan Adventures', ep: 1, totalEp: 5 },
  cop_ep1_abubakr: { title: "Abu Bakr's Loyalty", tradition: 'Islam', duration: 5, series: 'Companions of the Prophet', ep: 1, totalEp: 5 },
  aiq_ep1_hoopoe: { title: 'The Hoopoe of Sulaiman', tradition: 'Islam', duration: 5, series: 'Animals in the Quran', ep: 1, totalEp: 5 },
  im_ep1_salam: { title: 'The Power of Salam', tradition: 'Islam', duration: 5, series: 'Islamic Manners', ep: 1, totalEp: 5 },
  hj_ep1_what_is_hajj: { title: 'What Is Hajj?', tradition: 'Islam', duration: 5, series: 'The Hajj Journey', ep: 1, totalEp: 5 },
  ma_ep1_haram: { title: 'Masjid al-Haram — The Sacred Mosque', tradition: 'Islam', duration: 5, series: 'Mosque Adventures', ep: 1, totalEp: 5 },
  bd_ep1_sleep_dua: { title: 'The Sleep Dua', tradition: 'Islam', duration: 5, series: 'Bedtime Duas', ep: 1, totalEp: 5 },
  mh_ep1_haytham: { title: 'Ibn al-Haytham — The Father of Optics', tradition: 'Islam', duration: 5, series: 'Muslim Heroes', ep: 1, totalEp: 5 },
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
  let story = TITLES[storyId] || TITLES[lessonId];

  let title, description, image, redirectUrl;

  // Try Firestore creatorSeries if not found in static TITLES
  if (!story) {
    try {
      const fsRes = await fetch(`${FIRESTORE_URL}/creatorSeries/${storyId}`);
      if (fsRes.ok) {
        const data = await fsRes.json();
        const fields = data.fields || {};
        const fsTitle = fields.title?.stringValue || 'A Bedtime Series';
        const fsDesc = fields.description?.stringValue || '';
        const fsIcon = fields.icon?.stringValue || '📚';
        const totalEp = fields.totalEpisodes?.integerValue || '0';
        const authorName = fields.authorName?.stringValue || '';
        const episodes = fields.episodes?.arrayValue?.values || [];
        // Get first episode cover image
        let fsImage = '';
        for (const ep of episodes) {
          const epFields = ep.mapValue?.fields || {};
          const cover = epFields.coverImage?.stringValue;
          if (cover) { fsImage = cover; break; }
          const gallery = epFields.gallery?.arrayValue?.values || [];
          if (gallery.length > 0 && gallery[0].stringValue) { fsImage = gallery[0].stringValue; break; }
        }

        title = `${fsIcon} ${fsTitle}`;
        description = `${fsDesc ? fsDesc + ' ' : ''}${totalEp} bedtime episodes by ${authorName}. Listen free on My Sleepy Tale.`;
        image = fsImage || DEFAULT_OG_IMAGE;
        redirectUrl = `https://mysleepytale.com/series/${storyId}`;
      }
    } catch {}
  }

  // Try Firestore productionStories + publishedContent via Admin SDK
  if (!title) {
    try {
      const { getFirestore: getFs } = await import('./_firebase.js');
      const adminDb = await getFs();
      if (adminDb) {
        // Check productionStories first
        const prodSnap = await adminDb.collection('productionStories').doc(storyId).get();
        if (prodSnap.exists) {
          const pub = prodSnap.data();
          title = pub.title;
          description = pub.subtitle || `Listen to "${pub.title}" — a bedtime story on My Sleepy Tale.`;
          image = pub.coverImage || pub.ogImage || DEFAULT_OG_IMAGE;
          redirectUrl = `https://mysleepytale.com/player?storyId=${storyId}`;
        }
      }
    } catch {}
  }
  if (!title) {
    try {
      const { getFirestore: getFs } = await import('./_firebase.js');
      const adminDb = await getFs();
      if (adminDb) {
        const snap = await adminDb.collection('publishedContent').doc(storyId).get();
        if (snap.exists) {
          const pub = snap.data();
          title = pub.title;
          description = pub.metaDescription || pub.subtitle || `Listen to "${pub.title}" — a bedtime story on My Sleepy Tale.`;
          image = pub.coverImage || pub.ogImage || DEFAULT_OG_IMAGE;
          redirectUrl = `https://mysleepytale.com/player?storyId=${storyId}`;
        }
      }
    } catch {}
  }

  // Fallback: Try Firestore REST API (no auth, for public collections)
  if (!title) {
    try {
      const fsRes = await fetch(`${FIRESTORE_URL}/publishedContent/${storyId}`);
      if (fsRes.ok) {
        const data = await fsRes.json();
        const f = data.fields || {};
        const pubTitle = f.title?.stringValue;
        if (pubTitle) {
          title = pubTitle;
          description = f.metaDescription?.stringValue || f.subtitle?.stringValue || `Listen to "${pubTitle}" — a bedtime story on My Sleepy Tale.`;
          image = f.coverImage?.stringValue || f.ogImage?.stringValue || DEFAULT_OG_IMAGE;
          redirectUrl = `https://mysleepytale.com/player?storyId=${storyId}`;
        }
      }
    } catch {}
  }

  // Static story path
  if (!title) {
    const isSeries = story?.isSeries;
    title = story ? story.title : 'A Bedtime Story';
    const tradition = story ? story.tradition : '';
    const duration = story?.duration ? `${story.duration} min` : '';

    if (isSeries) {
      description = `${story.description || ''} ${story.totalEp} bedtime episodes. Free on My Sleepy Tale.`;
    } else {
      const seriesInfo = story?.series ? `Episode ${story.ep} of ${story.totalEp} in "${story.series}". ` : '';
      description = story
        ? `${seriesInfo}Listen to "${title}" — a ${tradition} bedtime story that teaches real values. ${duration}. Free on My Sleepy Tale.`
        : 'A personalized bedtime story that teaches values. Free on My Sleepy Tale.';
    }

    // Check for hardcoded OG image first (e.g. uploaded party photos)
    if (story?.ogImage) {
      image = story.ogImage;
    } else {
      // Get actual generated image from Firestore
      const { images: wisdomImages, gallery: wisdomGallery } = await getWisdomImages();
      const imageKey = isSeries ? (story.firstEpId || lessonId) : lessonId;
      image = wisdomImages[imageKey] || wisdomImages[storyId] || '';
      if (!image) {
        const galleryPhotos = wisdomGallery[imageKey] || wisdomGallery[storyId] || wisdomGallery[lessonId] || [];
        if (galleryPhotos.length > 0) image = galleryPhotos[0];
      }
      if (!image) image = DEFAULT_OG_IMAGE;
    }

    redirectUrl = isSeries
      ? `https://mysleepytale.com${story.seriesUrl}`
      : `https://mysleepytale.com/player?storyId=${storyId || 'lesson_' + lessonId}`;
  }

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
