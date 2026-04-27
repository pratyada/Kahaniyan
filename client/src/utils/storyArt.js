// Story art — unique gradient + icon combinations for each wisdom story.
// No external images needed, pure CSS gradients + themed colors.

const STORY_ART = {
  krishna_squirrel: {
    gradient: 'linear-gradient(135deg, #1a472a 0%, #2d5a3f 40%, #f0a500 100%)',
    icon: '🐿️', accent: '#4ade80',
    prompt: 'A tiny squirrel carrying a single grain of rice near a silver river, a young boy with a flute (Krishna) gently stroking its back, golden sunset, Indian village background',
  },
  prophet_camel: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 40%, #c4a35a 100%)',
    icon: '🐪', accent: '#fbbf24',
    prompt: 'A gentle scene of a kind man comforting a crying camel in a garden in ancient Madinah, warm amber light, palm trees, peaceful Arabian atmosphere',
  },
  jesus_birds: {
    gradient: 'linear-gradient(135deg, #4a2545 0%, #6b3a6b 40%, #e8c8ff 100%)',
    icon: '🕊️', accent: '#c084fc',
    prompt: 'A gentle figure sitting in a meadow surrounded by small birds perched on his hands and shoulders, soft lavender sky, wildflowers, peaceful and serene',
  },
  buddha_swan: {
    gradient: 'linear-gradient(135deg, #1a1a3e 0%, #2d2d5e 40%, #ffd700 100%)',
    icon: '🦢', accent: '#fcd34d',
    prompt: 'A young prince gently holding a wounded swan near a lotus pond, golden light filtering through bamboo trees, peaceful ancient Indian garden',
  },
  guru_nanak_grain: {
    gradient: 'linear-gradient(135deg, #3d2b1f 0%, #5c4033 40%, #f59e0b 100%)',
    icon: '🌾', accent: '#f59e0b',
    prompt: 'A wise bearded man in a turban sharing grain with villagers in a golden wheat field, warm sunset light, Punjab countryside',
  },
  mahavir_ant: {
    gradient: 'linear-gradient(135deg, #1a3c34 0%, #2d5a4a 40%, #86efac 100%)',
    icon: '🐜', accent: '#34d399',
    prompt: 'A gentle prince carefully stepping over a line of tiny ants on a forest path, lush green jungle with dappled sunlight, butterflies',
  },
  jewish_noah: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 40%, #60a5fa 100%)',
    icon: '🌈', accent: '#60a5fa',
    prompt: 'A large wooden ark on calm waters with pairs of animals boarding, a beautiful rainbow appearing in the sky, doves flying, peaceful after-storm light',
  },
  sikh_water_carrier: {
    gradient: 'linear-gradient(135deg, #422006 0%, #78350f 40%, #f97316 100%)',
    icon: '💧', accent: '#fb923c',
    prompt: 'A brave Sikh warrior carrying water to wounded soldiers on a battlefield, golden light, compassion in his eyes, dusty Indian landscape',
  },
  hanuman_mountain: {
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 40%, #fdba74 100%)',
    icon: '⛰️', accent: '#fb923c',
    prompt: 'A powerful monkey-god flying through clouds carrying an entire mountain with glowing herbs on top, dramatic orange sunset, epic and majestic',
  },
  ram_golden_deer: {
    gradient: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #fbbf24 100%)',
    icon: '🦌', accent: '#fbbf24',
    prompt: 'A magical golden deer with sparkling antlers running through a lush Indian forest, a prince watching from behind trees, enchanting moonlight',
  },
  akbar_birbal_well: {
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #a78bfa 100%)',
    icon: '🪣', accent: '#a78bfa',
    prompt: 'A clever minister standing beside a well in a Mughal palace courtyard, the emperor watching amused, ornate Indian architecture, warm lamplight',
  },
  panchatantra_monkey_crocodile: {
    gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #6ee7b7 100%)',
    icon: '🐒', accent: '#6ee7b7',
    prompt: 'A clever monkey sitting on a tree branch above a river talking to a crocodile below, tropical jungle, fruits hanging from trees, playful scene',
  },
  panchatantra_crow_pitcher: {
    gradient: 'linear-gradient(135deg, #1c1917 0%, #44403c 40%, #a8a29e 100%)',
    icon: '🏺', accent: '#d6d3d1',
    prompt: 'A clever black crow dropping small pebbles one by one into a clay pitcher, water rising slowly, warm dusty village setting, afternoon light',
  },
  krishna_govardhan: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 40%, #93c5fd 100%)',
    icon: '🏔️', accent: '#93c5fd',
    prompt: 'A young boy (Krishna) lifting an enormous mountain on his little finger like an umbrella, villagers and cows sheltering underneath from rain, dramatic clouds',
  },
  akbar_birbal_lines: {
    gradient: 'linear-gradient(135deg, #4a1942 0%, #6b2fa0 40%, #e879f9 100%)',
    icon: '✏️', accent: '#e879f9',
    prompt: 'A clever minister drawing a line on the ground next to a longer line in a Mughal court, the emperor looking surprised, ornate palace setting',
  },
  // ── Hindu batch 2 ──
  ganesha_mouse: {
    gradient: 'linear-gradient(135deg, #b45309 0%, #d97706 40%, #fcd34d 100%)',
    icon: '🐭', accent: '#fcd34d',
    prompt: 'A gentle elephant-headed god bending down to speak to a tiny brown mouse, golden temple backdrop, warm sunset light, Indian mythology style',
  },
  hindu_cow_sage: {
    gradient: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #86efac 100%)',
    icon: '🦌', accent: '#86efac',
    prompt: 'An old sage in a forest hut bandaging the leg of a wounded deer by firelight, warm golden glow, lush green forest, peaceful Indian hermitage',
  },
  krishna_butter: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 40%, #fde68a 100%)',
    icon: '🧈', accent: '#fde68a',
    prompt: 'A mischievous blue-skinned boy with butter on his cheeks being scolded by his loving mother, clay pots of butter, cozy Indian village kitchen',
  },
  harishchandra_promise: {
    gradient: 'linear-gradient(135deg, #44403c 0%, #78716c 40%, #fbbf24 100%)',
    icon: '👑', accent: '#fbbf24',
    prompt: 'A noble king walking away from his golden palace with nothing but the clothes on his back, dramatic sunset, dignity in sacrifice, Indian epic style',
  },
  yudhishthira_half_truth: {
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 40%, #a5b4fc 100%)',
    icon: '⚖️', accent: '#a5b4fc',
    prompt: 'A majestic chariot sinking to touch the ground as a warrior looks down in sorrow, battlefield in background, dramatic golden light, Mahabharata scene',
  },
  sudama_poha: {
    gradient: 'linear-gradient(135deg, #422006 0%, #92400e 40%, #fcd34d 100%)',
    icon: '🍚', accent: '#fcd34d',
    prompt: 'A poor man with a small bundle of rice meeting a king in a golden palace, the king washing his feet, warm emotional scene, Indian mythology',
  },
  draupadi_akshaya_patra: {
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #c2410c 40%, #fed7aa 100%)',
    icon: '🫕', accent: '#fed7aa',
    prompt: 'A woman serving food from a magical golden vessel in a forest clearing, many people being fed, warm light, abundance from simplicity, Indian epic style',
  },
  karna_golden_armour: {
    gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)',
    icon: '🛡️', accent: '#fbbf24',
    prompt: 'A warrior peeling golden armour from his own body to give to a disguised god, blood and gold mixing, dramatic sacrifice, Mahabharata epic scene',
  },
  ram_shabari_berries: {
    gradient: 'linear-gradient(135deg, #14532d 0%, #15803d 40%, #bbf7d0 100%)',
    icon: '🫐', accent: '#bbf7d0',
    prompt: 'An old woman offering half-eaten berries to a divine prince who eats them with joy, simple forest hut, warm golden light, devotion and humility',
  },
  hanuman_chest: {
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #dc2626 40%, #fca5a5 100%)',
    icon: '❤️', accent: '#fca5a5',
    prompt: 'A powerful monkey warrior tearing open his chest to reveal a divine couple glowing inside his heart, royal court gasping, epic Indian mythology scene',
  },
  shiva_kannappa: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #475569 40%, #e2e8f0 100%)',
    icon: '👁️', accent: '#e2e8f0',
    prompt: 'A tribal hunter offering his eye to a sacred stone in a forest, divine light appearing, raw devotion, southern Indian temple forest setting',
  },
  ram_vibhishana: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 40%, #93c5fd 100%)',
    icon: '🤗', accent: '#93c5fd',
    prompt: 'A noble prince embracing a trembling man who kneels before him while warriors watch in surprise, warm golden light, Ramayana epic scene',
  },
  sage_scorpion: {
    gradient: 'linear-gradient(135deg, #422006 0%, #78350f 40%, #fdba74 100%)',
    icon: '🦂', accent: '#fdba74',
    prompt: 'An old sage by a river gently lifting a scorpion from the water with his bare hand, sunset reflection on water, peaceful Indian riverside',
  },
  krishna_hundred_chances: {
    gradient: 'linear-gradient(135deg, #312e81 0%, #4338ca 40%, #c4b5fd 100%)',
    icon: '💯', accent: '#c4b5fd',
    prompt: 'A serene blue-skinned god standing calmly in a royal court as an angry king shouts insults, patience and grace, dramatic Indian court scene',
  },
  // ── New stories ──
  prophet_ant_hill: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a4f 40%, #95d5b2 100%)',
    icon: '🐜', accent: '#95d5b2',
    prompt: 'A kind man in white robes gently moving a fire away from a tiny ant hill in the desert, ants carrying their babies to safety, warm golden light',
  },
  prophet_thirsty_dog: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #457b9d 40%, #a8dadc 100%)',
    icon: '🐕', accent: '#a8dadc',
    prompt: 'A woman in the desert filling her shoe with water from a well for a thirsty dog, warm sunset, palm trees, compassion scene',
  },
  good_samaritan: {
    gradient: 'linear-gradient(135deg, #4a2545 0%, #6b3a6b 40%, #e8c8ff 100%)',
    icon: '🤝', accent: '#c084fc',
    prompt: 'A kind traveller kneeling to help an injured man on a dusty road, donkey waiting nearby, warm sunset light, Biblical landscape',
  },
  jesus_mustard_seed: {
    gradient: 'linear-gradient(135deg, #2d6a4f 0%, #40916c 40%, #95d5b2 100%)',
    icon: '🌱', accent: '#95d5b2',
    prompt: 'A tiny golden seed in an open palm growing into an enormous tree with birds resting in its branches, magical transformation, warm light',
  },
  buddha_elephant: {
    gradient: 'linear-gradient(135deg, #1a1a3e 0%, #2d2d5e 40%, #e2a94c 100%)',
    icon: '🐘', accent: '#e2a94c',
    prompt: 'A peaceful monk standing calmly as a large elephant bows its head gently before him, golden light, ancient Indian city background',
  },
  buddha_rice_bowl: {
    gradient: 'linear-gradient(135deg, #2d3436 0%, #636e72 40%, #ffeaa7 100%)',
    icon: '🍚', accent: '#ffeaa7',
    prompt: 'A village girl offering a golden bowl of rice to a thin man sitting under a big tree, morning mist, lotus flowers, peaceful Indian village',
  },
  jain_true_wealth: {
    gradient: 'linear-gradient(135deg, #4338ca 0%, #6366f1 40%, #a5b4fc 100%)',
    icon: '💎', accent: '#a5b4fc',
    prompt: 'A rich merchant removing his silk turban and placing it at the feet of a simple monk under a tree, golden light, transformation of pride to humility',
  },
  jain_spider_web: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #475569 40%, #94a3b8 100%)',
    icon: '🕸️', accent: '#94a3b8',
    prompt: 'A tiny spider spinning a delicate web across a dark cave entrance, moonlight catching the silk strands, a king watching in wonder from inside',
  },
  jewish_one_good_deed: {
    gradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 40%, #93c5fd 100%)',
    icon: '🗺️', accent: '#93c5fd',
    prompt: 'A young boy piecing together a torn map on a wooden table, each piece glowing as it connects, warm lamplight, cozy study room',
  },
  jewish_two_pockets: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 40%, #fbbf24 100%)',
    icon: '🧥', accent: '#fbbf24',
    prompt: 'A wise old rabbi with a kind smile holding two small glowing pieces of paper, one in each hand, starry night sky, candlelight',
  },
  sikh_langar: {
    gradient: 'linear-gradient(135deg, #78350f 0%, #b45309 40%, #fbbf24 100%)',
    icon: '🍲', accent: '#fbbf24',
    prompt: 'A young boy serving food to people sitting together on the floor in a golden temple kitchen, steam rising, warm community meal, Sikh Langar scene',
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

export function getStoryArt(lessonId) {
  return STORY_ART[lessonId] || {
    gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #f0a500 100%)',
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
