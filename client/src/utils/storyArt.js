// Story art — gradient + icon + static fallback image for each wisdom story.
// Firestore images (config/wisdomImages) override these when available.
// Static images use Unsplash source for instant CDN loading.

const U = (id, w = 600) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&fit=crop`;

const STORY_ART = {
  krishna_squirrel: {
    gradient: 'linear-gradient(135deg, #1a472a 0%, #2d5a3f 40%, #f0a500 100%)',
    icon: '🐿️', accent: '#4ade80',
    image: U('1444464666168-49d633b86797'), // squirrel in nature
    prompt: 'A tiny squirrel carrying a single grain of rice near a silver river, a young boy with a flute (Krishna) gently stroking its back, golden sunset, Indian village background',
  },
  prophet_camel: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 40%, #c4a35a 100%)',
    icon: '🐪', accent: '#fbbf24',
    image: U('1549989476-69a92fa57c36'), // camel desert
    prompt: 'A gentle scene of a kind man comforting a crying camel in a garden in ancient Madinah, warm amber light, palm trees, peaceful Arabian atmosphere',
  },
  jesus_birds: {
    gradient: 'linear-gradient(135deg, #4a2545 0%, #6b3a6b 40%, #e8c8ff 100%)',
    icon: '🕊️', accent: '#c084fc',
    image: U('1444464666168-49d633b86797'), // birds in sky
    prompt: 'A gentle figure sitting in a meadow surrounded by small birds perched on his hands and shoulders, soft lavender sky, wildflowers, peaceful and serene',
  },
  buddha_swan: {
    gradient: 'linear-gradient(135deg, #1a1a3e 0%, #2d2d5e 40%, #ffd700 100%)',
    icon: '🦢', accent: '#fcd34d',
    image: U('1501706362039-c06b2d715385'), // swan on water
    prompt: 'A young prince gently holding a wounded swan near a lotus pond, golden light filtering through bamboo trees, peaceful ancient Indian garden',
  },
  guru_nanak_grain: {
    gradient: 'linear-gradient(135deg, #3d2b1f 0%, #5c4033 40%, #f59e0b 100%)',
    icon: '🌾', accent: '#f59e0b',
    image: U('1500382017468-9049fed747ef'), // golden wheat field
    prompt: 'A wise bearded man in a turban sharing grain with villagers in a golden wheat field, warm sunset light, Punjab countryside',
  },
  mahavir_ant: {
    gradient: 'linear-gradient(135deg, #1a3c34 0%, #2d5a4a 40%, #86efac 100%)',
    icon: '🐜', accent: '#34d399',
    image: U('1448375240586-882707db888b'), // forest path
    prompt: 'A gentle prince carefully stepping over a line of tiny ants on a forest path, lush green jungle with dappled sunlight, butterflies',
  },
  jewish_noah: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 40%, #60a5fa 100%)',
    icon: '🌈', accent: '#60a5fa',
    image: U('1507400492013-162706c8c05e'), // rainbow sky
    prompt: 'A large wooden ark on calm waters with pairs of animals boarding, a beautiful rainbow appearing in the sky, doves flying, peaceful after-storm light',
  },
  sikh_water_carrier: {
    gradient: 'linear-gradient(135deg, #422006 0%, #78350f 40%, #f97316 100%)',
    icon: '💧', accent: '#fb923c',
    image: U('1470071459604-3b5ec3a7fe05'), // water droplet
    prompt: 'A brave Sikh warrior carrying water to wounded soldiers on a battlefield, golden light, compassion in his eyes, dusty Indian landscape',
  },
  hanuman_mountain: {
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 40%, #fdba74 100%)',
    icon: '⛰️', accent: '#fb923c',
    image: U('1464822759023-fed622ff2c3b'), // mountain sunset
    prompt: 'A powerful monkey-god flying through clouds carrying an entire mountain with glowing herbs on top, dramatic orange sunset, epic and majestic',
  },
  ram_golden_deer: {
    gradient: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #fbbf24 100%)',
    icon: '🦌', accent: '#fbbf24',
    image: U('1448375240586-882707db888b'), // deer in forest
    prompt: 'A magical golden deer with sparkling antlers running through a lush Indian forest, a prince watching from behind trees, enchanting moonlight',
  },
  akbar_birbal_well: {
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #a78bfa 100%)',
    icon: '🪣', accent: '#a78bfa',
    image: U('1548013146-72479768bada'), // ancient well
    prompt: 'A clever minister standing beside a well in a Mughal palace courtyard, the emperor watching amused, ornate Indian architecture, warm lamplight',
  },
  panchatantra_monkey_crocodile: {
    gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #6ee7b7 100%)',
    icon: '🐒', accent: '#6ee7b7',
    image: U('1540573133985-87b6da6d54a9'), // monkey in tree
    prompt: 'A clever monkey sitting on a tree branch above a river talking to a crocodile below, tropical jungle, fruits hanging from trees, playful scene',
  },
  panchatantra_crow_pitcher: {
    gradient: 'linear-gradient(135deg, #1c1917 0%, #44403c 40%, #a8a29e 100%)',
    icon: '🏺', accent: '#d6d3d1',
    image: U('1494256997604-768d1f608cac'), // crow bird
    prompt: 'A clever black crow dropping small pebbles one by one into a clay pitcher, water rising slowly, warm dusty village setting, afternoon light',
  },
  krishna_govardhan: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 40%, #93c5fd 100%)',
    icon: '🏔️', accent: '#93c5fd',
    image: U('1506905925346-21bda4d32df4'), // dramatic mountain clouds
    prompt: 'A young boy (Krishna) lifting an enormous mountain on his little finger like an umbrella, villagers and cows sheltering underneath from rain, dramatic clouds',
  },
  akbar_birbal_lines: {
    gradient: 'linear-gradient(135deg, #4a1942 0%, #6b2fa0 40%, #e879f9 100%)',
    icon: '✏️', accent: '#e879f9',
    image: U('1513542789411-b6a5d4f31634'), // palace architecture
    prompt: 'A clever minister drawing a line on the ground next to a longer line in a Mughal court, the emperor looking surprised, ornate palace setting',
  },
  // ── Hindu batch 2 ──
  ganesha_mouse: {
    gradient: 'linear-gradient(135deg, #b45309 0%, #d97706 40%, #fcd34d 100%)',
    icon: '🐭', accent: '#fcd34d',
    image: U('1524492412937-b28074a5d7da'), // Indian temple golden
    prompt: 'A gentle elephant-headed god bending down to speak to a tiny brown mouse, golden temple backdrop, warm sunset light, Indian mythology style',
  },
  hindu_cow_sage: {
    gradient: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #86efac 100%)',
    icon: '🦌', accent: '#86efac',
    image: U('1476514525535-07fb3b4ae5f1'), // forest green light
    prompt: 'An old sage in a forest hut bandaging the leg of a wounded deer by firelight, warm golden glow, lush green forest, peaceful Indian hermitage',
  },
  krishna_butter: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 40%, #fde68a 100%)',
    icon: '🧈', accent: '#fde68a',
    image: U('1590080875515-8a3a8dc5735e'), // clay pots
    prompt: 'A mischievous blue-skinned boy with butter on his cheeks being scolded by his loving mother, clay pots of butter, cozy Indian village kitchen',
  },
  harishchandra_promise: {
    gradient: 'linear-gradient(135deg, #44403c 0%, #78716c 40%, #fbbf24 100%)',
    icon: '👑', accent: '#fbbf24',
    image: U('1505533321630-975218a5f66f'), // golden sunset path
    prompt: 'A noble king walking away from his golden palace with nothing but the clothes on his back, dramatic sunset, dignity in sacrifice, Indian epic style',
  },
  yudhishthira_half_truth: {
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 40%, #a5b4fc 100%)',
    icon: '⚖️', accent: '#a5b4fc',
    image: U('1589829545856-d10d557cf95f'), // scales of justice
    prompt: 'A majestic chariot sinking to touch the ground as a warrior looks down in sorrow, battlefield in background, dramatic golden light, Mahabharata scene',
  },
  sudama_poha: {
    gradient: 'linear-gradient(135deg, #422006 0%, #92400e 40%, #fcd34d 100%)',
    icon: '🍚', accent: '#fcd34d',
    image: U('1504674900247-0877df9cc836'), // rice grains
    prompt: 'A poor man with a small bundle of rice meeting a king in a golden palace, the king washing his feet, warm emotional scene, Indian mythology',
  },
  draupadi_akshaya_patra: {
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 40%, #fed7aa 100%)',
    icon: '🫕', accent: '#fed7aa',
    image: U('1504674900247-0877df9cc836'), // serving food warm light
    prompt: 'A woman serving food from a magical golden vessel in a forest clearing, many people being fed, warm light, abundance from simplicity, Indian epic style',
  },
  karna_golden_armour: {
    gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)',
    icon: '🛡️', accent: '#fbbf24',
    image: U('1505533321630-975218a5f66f'), // golden armor light
    prompt: 'A warrior peeling golden armour from his own body to give to a disguised god, blood and gold mixing, dramatic sacrifice, Mahabharata epic scene',
  },
  ram_shabari_berries: {
    gradient: 'linear-gradient(135deg, #14532d 0%, #15803d 40%, #bbf7d0 100%)',
    icon: '🫐', accent: '#bbf7d0',
    image: U('1464965911861-746a04b4bca6'), // berries on branch
    prompt: 'An old woman offering half-eaten berries to a divine prince who eats them with joy, simple forest hut, warm golden light, devotion and humility',
  },
  hanuman_chest: {
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #dc2626 40%, #fca5a5 100%)',
    icon: '❤️', accent: '#fca5a5',
    image: U('1518837695005-2083093ee35b'), // warm glowing heart light
    prompt: 'A powerful monkey warrior tearing open his chest to reveal a divine couple glowing inside his heart, royal court gasping, epic Indian mythology scene',
  },
  shiva_kannappa: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #475569 40%, #e2e8f0 100%)',
    icon: '👁️', accent: '#e2e8f0',
    image: U('1473448912268-2022ce9509d8'), // mystical forest light
    prompt: 'A tribal hunter offering his eye to a sacred stone in a forest, divine light appearing, raw devotion, southern Indian temple forest setting',
  },
  ram_vibhishana: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 40%, #93c5fd 100%)',
    icon: '🤗', accent: '#93c5fd',
    image: U('1506905925346-21bda4d32df4'), // dramatic sky embrace
    prompt: 'A noble prince embracing a trembling man who kneels before him while warriors watch in surprise, warm golden light, Ramayana epic scene',
  },
  sage_scorpion: {
    gradient: 'linear-gradient(135deg, #422006 0%, #78350f 40%, #fdba74 100%)',
    icon: '🦂', accent: '#fdba74',
    image: U('1504701954957-2010ec3bcec1'), // riverside sunset
    prompt: 'An old sage by a river gently lifting a scorpion from the water with his bare hand, sunset reflection on water, peaceful Indian riverside',
  },
  krishna_hundred_chances: {
    gradient: 'linear-gradient(135deg, #312e81 0%, #4338ca 40%, #c4b5fd 100%)',
    icon: '💯', accent: '#c4b5fd',
    image: U('1524492412937-b28074a5d7da'), // royal court purple
    prompt: 'A serene blue-skinned god standing calmly in a royal court as an angry king shouts insults, patience and grace, dramatic Indian court scene',
  },
  // ── New stories ──
  prophet_ant_hill: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a4f 40%, #95d5b2 100%)',
    icon: '🐜', accent: '#95d5b2',
    image: U('1558642452-9d2a7deb7f62'), // desert sand dunes
    prompt: 'A kind man in white robes gently moving a fire away from a tiny ant hill in the desert, ants carrying their babies to safety, warm golden light',
  },
  prophet_thirsty_dog: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #457b9d 40%, #a8dadc 100%)',
    icon: '🐕', accent: '#a8dadc',
    image: U('1587300003388-59208cc962cb'), // dog gentle
    prompt: 'A woman in the desert filling her shoe with water from a well for a thirsty dog, warm sunset, palm trees, compassion scene',
  },
  good_samaritan: {
    gradient: 'linear-gradient(135deg, #4a2545 0%, #6b3a6b 40%, #e8c8ff 100%)',
    icon: '🤝', accent: '#c084fc',
    image: U('1469571486292-0ba58a3f068b'), // helping hands
    prompt: 'A kind traveller kneeling to help an injured man on a dusty road, donkey waiting nearby, warm sunset light, Biblical landscape',
  },
  jesus_mustard_seed: {
    gradient: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 40%, #95d5b2 100%)',
    icon: '🌱', accent: '#95d5b2',
    image: U('1500382017468-9049fed747ef'), // seedling growing
    prompt: 'A tiny golden seed in an open palm growing into an enormous tree with birds resting in its branches, magical transformation, warm light',
  },
  buddha_elephant: {
    gradient: 'linear-gradient(135deg, #1a1a3e 0%, #2d2d5e 40%, #e2a94c 100%)',
    icon: '🐘', accent: '#e2a94c',
    image: U('1564760055775-d63b17a55c44'), // elephant peaceful
    prompt: 'A peaceful monk standing calmly as a large elephant bows its head gently before him, golden light, ancient Indian city background',
  },
  buddha_rice_bowl: {
    gradient: 'linear-gradient(135deg, #2d3436 0%, #636e72 40%, #ffeaa7 100%)',
    icon: '🍚', accent: '#ffeaa7',
    image: U('1509316785289-025f5b846b35'), // misty tree morning
    prompt: 'A village girl offering a golden bowl of rice to a thin man sitting under a big tree, morning mist, lotus flowers, peaceful Indian village',
  },
  jain_true_wealth: {
    gradient: 'linear-gradient(135deg, #4338ca 0%, #6366f1 40%, #a5b4fc 100%)',
    icon: '💎', accent: '#a5b4fc',
    image: U('1506905925346-21bda4d32df4'), // contemplative sky
    prompt: 'A rich merchant removing his silk turban and placing it at the feet of a simple monk under a tree, golden light, transformation of pride to humility',
  },
  jain_spider_web: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #475569 40%, #94a3b8 100%)',
    icon: '🕸️', accent: '#94a3b8',
    image: U('1518709766631-a6a7f45921c3'), // spider web dew
    prompt: 'A tiny spider spinning a delicate web across a dark cave entrance, moonlight catching the silk strands, a king watching in wonder from inside',
  },
  jewish_one_good_deed: {
    gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 40%, #93c5fd 100%)',
    icon: '🗺️', accent: '#93c5fd',
    image: U('1507003211169-0a1dd7228f2d'), // warm lamplight study
    prompt: 'A young boy piecing together a torn map on a wooden table, each piece glowing as it connects, warm lamplight, cozy study room',
  },
  jewish_two_pockets: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 40%, #fbbf24 100%)',
    icon: '🧥', accent: '#fbbf24',
    image: U('1507400492013-162706c8c05e'), // candlelight night
    prompt: 'A wise old rabbi with a kind smile holding two small glowing pieces of paper, one in each hand, starry night sky, candlelight',
  },
  sikh_langar: {
    gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)',
    icon: '🍲', accent: '#fbbf24',
    image: U('1504674900247-0877df9cc836'), // community meal
    prompt: 'A young boy serving food to people sitting together on the floor in a golden temple kitchen, steam rising, warm community meal, Sikh Langar scene',
  },
  // ── Universal stories ──
  universal_lighthouse_keeper: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 40%, #fbbf24 100%)',
    icon: '🏠', accent: '#fbbf24',
    image: U('1507924538820-ede94a04019d'), // lighthouse on rocky coast
    prompt: 'A tiny lighthouse on a rocky island at night, its golden beam cutting through a wild storm, a small boat following the light to safety',
  },
  universal_garden_of_mistakes: {
    gradient: 'linear-gradient(135deg, #064e3b 0%, #10b981 40%, #fcd34d 100%)',
    icon: '🌸', accent: '#10b981',
    image: U('1500382017468-9049fed747ef'), // garden flowers sunset
    prompt: 'A magical garden where bright orange flowers bloom from the ground wherever a girl stands, glowing soil, enchanted garden at sunset',
  },
  universal_invisible_boy: {
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #6366f1 40%, #a78bfa 100%)',
    icon: '🐕', accent: '#a78bfa',
    image: U('1587300003388-59208cc962cb'), // gentle dog rain
    prompt: 'A lonely boy wrapping his jacket around a small shivering stray dog under a bench in the rain, warm lamplight, compassion scene',
  },
  universal_patience_river: {
    gradient: 'linear-gradient(135deg, #164e63 0%, #0891b2 40%, #a5f3fc 100%)',
    icon: '🏞️', accent: '#0891b2',
    image: U('1433086966358-54859d0ed716'), // canyon river light
    prompt: 'A tiny stream of water slowly carving through a massive cliff face over time, creating a beautiful canyon, golden light streaming through',
  },
  universal_sharing_blanket: {
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 40%, #e0e7ff 100%)',
    icon: '🧣', accent: '#818cf8',
    image: U('1478760329108-5c3ed9d495a0'), // snowy mountain night
    prompt: 'An old woman tearing her starry blue blanket in half to share with a shivering traveller by a small fire, snowy mountain village night',
  },
  universal_respect_old_tree: {
    gradient: 'linear-gradient(135deg, #14532d 0%, #15803d 40%, #86efac 100%)',
    icon: '🌳', accent: '#22c55e',
    image: U('1502082553048-f009c37129b9'), // ancient tree sunlight
    prompt: 'A girl hugging an enormous ancient oak tree in a town square, birds nesting in branches, dappled golden sunlight, community gathering',
  },
  universal_forgiveness_kite: {
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 40%, #fed7aa 100%)',
    icon: '🪁', accent: '#ea580c',
    image: U('1507400492013-162706c8c05e'), // sunset sky orange
    prompt: 'A boy opening his hand to release a kite string, the kite soaring free into a golden sunset sky, feeling of release and peace',
  },
  universal_wisdom_two_wolves: {
    gradient: 'linear-gradient(135deg, #1c1917 0%, #57534e 40%, #f59e0b 100%)',
    icon: '🐺', accent: '#f59e0b',
    image: U('1518837695005-2083093ee35b'), // fireplace warm glow
    prompt: 'A grandmother and grandchild sitting by a glowing fireplace, two wolf spirits made of light and shadow facing each other above the flames',
  },
  universal_humility_mountain: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #64748b 40%, #bbf7d0 100%)',
    icon: '⛰️', accent: '#64748b',
    image: U('1464822759023-fed622ff2c3b'), // mountain meadow
    prompt: 'A proud tall mountain with a bare icy peak looking down at a small green hill covered in flowers and children playing, humbling contrast',
  },
  universal_bravery_first_step: {
    gradient: 'linear-gradient(135deg, #1a1a3e 0%, #312e81 40%, #c4b5fd 100%)',
    icon: '🌙', accent: '#8b5cf6',
    image: U('1478760329108-5c3ed9d495a0'), // dark stairway candle
    prompt: 'A small girl taking her first brave step down dark stairs holding onto the bannister, a tiny warm glow from a candle at the bottom',
  },
  mothers_day_toronto: {
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 40%, #fce7f3 100%)',
    icon: '🌷', accent: '#f472b6',
    image: U('1500382017468-9049fed747ef'), // spring flowers
    prompt: 'A child handing a bright yellow tulip to their mother on a sunny Toronto waterfront bench, CN Tower in background, cherry blossoms, spring sunshine, heartwarming',
  },
};

// Tradition-level art (for tradition badges/headers)
const TRADITION_ART = {
  hindu: {
    gradient: 'linear-gradient(135deg, #ff6b00 0%, #ff9500 100%)',
    color: '#f97316',
  },
  muslim: {
    gradient: 'linear-gradient(135deg, #047857 0%, #10b981 100%)',
    color: '#10b981',
  },
  christian: {
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
    color: '#3b82f6',
  },
  sikh: {
    gradient: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
    color: '#f59e0b',
  },
  buddhist: {
    gradient: 'linear-gradient(135deg, #b91c1c 0%, #ef4444 100%)',
    color: '#ef4444',
  },
  jain: {
    gradient: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
    color: '#6366f1',
  },
  jewish: {
    gradient: 'linear-gradient(135deg, #1e40af 0%, #60a5fa 100%)',
    color: '#60a5fa',
  },
};

// Colorful fallback gradients for collection stories
const COLLECTION_GRADIENTS = {
  col_loyal: 'linear-gradient(135deg, #92400e 0%, #f59e0b 50%, #fcd34d 100%)',
  col_lost: 'linear-gradient(135deg, #9a3412 0%, #f97316 50%, #fed7aa 100%)',
  col_brave: 'linear-gradient(135deg, #1e3a5f 0%, #3b82f6 50%, #93c5fd 100%)',
  col_parrot: 'linear-gradient(135deg, #065f46 0%, #10b981 50%, #6ee7b7 100%)',
  col_elephant: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #fbbf24 100%)',
  col_turtle: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #34d399 100%)',
  col_fire: 'linear-gradient(135deg, #991b1b 0%, #ef4444 50%, #fca5a5 100%)',
  col_bicycle: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #bfdbfe 100%)',
  col_train: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #c4b5fd 100%)',
  col_ambulance: 'linear-gradient(135deg, #166534 0%, #22c55e 50%, #86efac 100%)',
  col_rocket: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 50%, #a5b4fc 100%)',
  col_school: 'linear-gradient(135deg, #92400e 0%, #d97706 50%, #fde68a 100%)',
  col_invisible: 'linear-gradient(135deg, #312e81 0%, #6366f1 50%, #c7d2fe 100%)',
  col_kindness: 'linear-gradient(135deg, #78350f 0%, #f0a500 50%, #fcd34d 100%)',
  col_truth: 'linear-gradient(135deg, #1e3a5f 0%, #0ea5e9 50%, #7dd3fc 100%)',
  col_patience: 'linear-gradient(135deg, #4c1d95 0%, #8b5cf6 50%, #ddd6fe 100%)',
  col_empathy: 'linear-gradient(135deg, #831843 0%, #ec4899 50%, #fbcfe8 100%)',
  col_forgiveness: 'linear-gradient(135deg, #064e3b 0%, #14b8a6 50%, #99f6e4 100%)',
  col_lion: 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #fbbf24 100%)',
  col_ant: 'linear-gradient(135deg, #166534 0%, #4ade80 50%, #bbf7d0 100%)',
  col_tortoise: 'linear-gradient(135deg, #1e3a5f 0%, #0891b2 50%, #67e8f9 100%)',
  col_sun: 'linear-gradient(135deg, #92400e 0%, #f59e0b 50%, #fef3c7 100%)',
  col_brain: 'linear-gradient(135deg, #312e81 0%, #7c3aed 50%, #e9d5ff 100%)',
  col_ocean: 'linear-gradient(135deg, #1e3a5f 0%, #0284c7 50%, #7dd3fc 100%)',
  col_cricket: 'linear-gradient(135deg, #166534 0%, #16a34a 50%, #86efac 100%)',
  col_swimmer: 'linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #93c5fd 100%)',
  col_soccer: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #6ee7b7 100%)',
  col_fair: 'linear-gradient(135deg, #92400e 0%, #ea580c 50%, #fed7aa 100%)',
  col_basketball: 'linear-gradient(135deg, #7c2d12 0%, #f97316 50%, #fdba74 100%)',
  col_marathon: 'linear-gradient(135deg, #4c1d95 0%, #9333ea 50%, #d8b4fe 100%)',
  col_grandpa: 'linear-gradient(135deg, #422006 0%, #78350f 50%, #fbbf24 100%)',
  col_new_sibling: 'linear-gradient(135deg, #831843 0%, #db2777 50%, #f9a8d4 100%)',
  col_moms: 'linear-gradient(135deg, #be123c 0%, #f43f5e 50%, #fda4af 100%)',
  col_dads: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #93c5fd 100%)',
  col_grandma: 'linear-gradient(135deg, #78350f 0%, #a16207 50%, #fde68a 100%)',
  col_family: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #ddd6fe 100%)',
  col_moon: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #c4b5fd 100%)',
  col_mars: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #fca5a5 100%)',
  col_saturn: 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #fef3c7 100%)',
  col_pluto: 'linear-gradient(135deg, #1e293b 0%, #475569 50%, #cbd5e1 100%)',
  col_earth: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #6ee7b7 100%)',
  col_shooting: 'linear-gradient(135deg, #1e1b4b 0%, #4f46e5 50%, #fbbf24 100%)',
  col_japan: 'linear-gradient(135deg, #831843 0%, #ec4899 50%, #fce7f3 100%)',
  col_canada: 'linear-gradient(135deg, #991b1b 0%, #ef4444 50%, #fecaca 100%)',
  col_india: 'linear-gradient(135deg, #92400e 0%, #f59e0b 50%, #fef3c7 100%)',
  col_egypt: 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #fcd34d 100%)',
  col_brazil: 'linear-gradient(135deg, #064e3b 0%, #10b981 50%, #6ee7b7 100%)',
  col_toronto: 'linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #fca5a5 100%)',
};

export function getStoryArt(lessonId) {
  if (STORY_ART[lessonId]) return STORY_ART[lessonId];

  // Collection story fallback — match by prefix
  if (lessonId?.startsWith('col_')) {
    const prefix = lessonId.split('_').slice(0, 2).join('_');
    const gradient = COLLECTION_GRADIENTS[prefix] || COLLECTION_GRADIENTS[lessonId] || 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #f0a500 100%)';
    return { gradient, icon: '✨', accent: '#f0a500' };
  }

  return {
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #f0a500 100%)',
    icon: '✨',
    accent: '#f0a500',
  };
}

export function getTraditionArt(traditionKey) {
  return TRADITION_ART[traditionKey] || {
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #f0a500 100%)',
    color: '#f0a500',
  };
}
