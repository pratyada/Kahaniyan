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
