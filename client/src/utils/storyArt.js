// Story art — unique gradient + icon combinations for each wisdom story.
// No external images needed, pure CSS gradients + themed colors.

const STORY_ART = {
  krishna_squirrel: {
    gradient: 'linear-gradient(135deg, #1a472a 0%, #2d5a3f 40%, #f0a500 100%)',
    icon: '🐿️',
    accent: '#4ade80',
  },
  prophet_camel: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 40%, #c4a35a 100%)',
    icon: '🐪',
    accent: '#fbbf24',
  },
  jesus_birds: {
    gradient: 'linear-gradient(135deg, #4a2545 0%, #6b3a6b 40%, #e8c8ff 100%)',
    icon: '🕊️',
    accent: '#c084fc',
  },
  buddha_swan: {
    gradient: 'linear-gradient(135deg, #1a1a3e 0%, #2d2d5e 40%, #ffd700 100%)',
    icon: '🦢',
    accent: '#fcd34d',
  },
  guru_nanak_grain: {
    gradient: 'linear-gradient(135deg, #3d2b1f 0%, #5c4033 40%, #f59e0b 100%)',
    icon: '🌾',
    accent: '#f59e0b',
  },
  mahavir_ant: {
    gradient: 'linear-gradient(135deg, #1a3c34 0%, #2d5a4a 40%, #86efac 100%)',
    icon: '🐜',
    accent: '#34d399',
  },
  jewish_noah: {
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 40%, #60a5fa 100%)',
    icon: '🌈',
    accent: '#60a5fa',
  },
  sikh_water_carrier: {
    gradient: 'linear-gradient(135deg, #422006 0%, #78350f 40%, #f97316 100%)',
    icon: '💧',
    accent: '#fb923c',
  },
  hanuman_mountain: {
    gradient: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 40%, #fdba74 100%)',
    icon: '⛰️',
    accent: '#fb923c',
  },
  ram_golden_deer: {
    gradient: 'linear-gradient(135deg, #14532d 0%, #166534 40%, #fbbf24 100%)',
    icon: '🦌',
    accent: '#fbbf24',
  },
  akbar_birbal_well: {
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #a78bfa 100%)',
    icon: '🪣',
    accent: '#a78bfa',
  },
  panchatantra_monkey_crocodile: {
    gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 40%, #6ee7b7 100%)',
    icon: '🐒',
    accent: '#6ee7b7',
  },
  panchatantra_crow_pitcher: {
    gradient: 'linear-gradient(135deg, #1c1917 0%, #44403c 40%, #a8a29e 100%)',
    icon: '🏺',
    accent: '#d6d3d1',
  },
  krishna_govardhan: {
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 40%, #93c5fd 100%)',
    icon: '🏔️',
    accent: '#93c5fd',
  },
  akbar_birbal_lines: {
    gradient: 'linear-gradient(135deg, #4a1942 0%, #6b2fa0 40%, #e879f9 100%)',
    icon: '✏️',
    accent: '#e879f9',
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
