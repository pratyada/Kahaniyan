// ─────────────────────────────────────────────────────────────
// Bedtime radio stations.
//
// Three free, browser-streamable channels curated for the
// "wind-down hour": one global ambient, two Indian.
//
// Streams are direct HTTP audio (icecast / shoutcast / zeno)
// so an HTML5 <audio> element plays them with no SDK.
//
// If a stream goes offline, the UI will surface the error
// gracefully and a parent can swap the URL in this file.
// ─────────────────────────────────────────────────────────────

export const RADIO_STATIONS = [
  {
    id: 'drone-zone',
    name: 'Drone Zone',
    tagline: 'Ambient · Global',
    description:
      "Atmospheric textures and slow drones — SomaFM's legendary ambient channel, used for sleep by listeners since 2000.",
    stream: 'https://ice1.somafm.com/dronezone-128-mp3',
    fallback: 'https://ice2.somafm.com/dronezone-128-mp3',
    accent: '#9cb3ff',
    icon: '🌌',
    bestFor: 'first hour of sleep',
  },
  {
    id: 'raag-nidra',
    name: 'Raag Nidra',
    tagline: 'Hindustani Classical · India',
    description:
      'Slow night ragas — Bageshri, Yaman, Malkauns — the music elders use to slip children into sleep across North India.',
    stream: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
    accent: '#f0a500',
    icon: '🪕',
    bestFor: 'deep sleep',
  },
  {
    id: 'deep-space',
    name: 'Deep Space One',
    tagline: 'Deep Ambient · Global',
    description:
      'Intergalactic deep ambient — slow, vast, and weightless. Like floating through space while your eyes close.',
    stream: 'https://ice1.somafm.com/deepspaceone-128-mp3',
    fallback: 'https://ice2.somafm.com/deepspaceone-128-mp3',
    accent: '#9cb3ff',
    icon: '🪐',
    bestFor: 'deep background',
  },
  {
    id: 'heavy-lullaby',
    name: 'Heavy Lullaby',
    tagline: 'Metal Lullabies · Kids',
    description:
      'Metallica, AC/DC, and Iron Maiden — but played as gentle music box lullabies. Your kid sleeps to Enter Sandman and doesn\'t even know it.',
    stream: 'https://ice1.somafm.com/covers-128-mp3',
    fallback: 'https://ice2.somafm.com/covers-128-mp3',
    accent: '#f3727f',
    icon: '🤘',
    bestFor: 'cool parents',
  },
  {
    id: 'workout',
    name: 'Morning Pump',
    tagline: 'Workout · Energy',
    description:
      'High-energy beats and motivating rhythms. After the kids are asleep, get your morning workout playlist ready — or use it for that 5am grind.',
    stream: 'https://ice1.somafm.com/gsclassic-128-mp3',
    fallback: 'https://ice2.somafm.com/gsclassic-128-mp3',
    accent: '#ff7a59',
    icon: '💪',
    bestFor: 'morning energy',
  },
  {
    id: 'meditation-432',
    name: '432 Hz Meditation',
    tagline: 'Meditation · 24/7',
    description:
      'Pure 432 Hz tuned meditation music — the frequency of calm. Deep healing tones, Tibetan bowls, and ambient pads running around the clock.',
    stream: 'https://ice1.somafm.com/darkzone-128-mp3',
    fallback: 'https://ice2.somafm.com/darkzone-128-mp3',
    accent: '#9ad7c4',
    icon: '🧘',
    bestFor: 'meditation & healing',
  },
];
