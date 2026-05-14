// ─────────────────────────────────────────────────────────────
// Bedtime radio stations — 10 global stations with coordinates.
//
// Each station has a lat/lng for the globe marker, a country,
// and a flag emoji. Streams are direct HTTP audio (icecast /
// shoutcast / zeno) so an HTML5 <audio> element plays them.
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
    country: 'USA',
    flag: '🇺🇸',
    location: [37.77, -122.42], // San Francisco
  },
  {
    id: 'raag-nidra',
    name: 'Raag Nidra',
    tagline: 'Indian Ambient · Goa',
    description:
      'Suburbs of Goa — Indian classical meets ambient electronica. Sitar, tabla, and dreamy pads for a hypnotic bedtime drift.',
    stream: 'https://ice1.somafm.com/suburbsofgoa-128-mp3',
    fallback: 'https://ice2.somafm.com/suburbsofgoa-128-mp3',
    accent: '#f0a500',
    icon: '🪕',
    bestFor: 'deep sleep',
    country: 'India',
    flag: '🇮🇳',
    location: [28.61, 77.21], // Delhi
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
    country: 'USA',
    flag: '🇺🇸',
    location: [34.05, -118.24], // Los Angeles
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
    country: 'UK',
    flag: '🇬🇧',
    location: [51.51, -0.13], // London
  },
  {
    id: 'workout',
    name: 'Morning Pump',
    tagline: 'Workout · Energy',
    description:
      'High-energy beats and motivating rhythms. After the kids are asleep, get your morning workout playlist ready.',
    stream: 'https://ice1.somafm.com/gsclassic-128-mp3',
    fallback: 'https://ice2.somafm.com/gsclassic-128-mp3',
    accent: '#ff7a59',
    icon: '💪',
    bestFor: 'morning energy',
    country: 'Australia',
    flag: '🇦🇺',
    location: [-33.87, 151.21], // Sydney
  },
  {
    id: 'meditation-528',
    name: '528 Hz Meditation',
    tagline: 'Meditation · 24/7',
    description:
      'Pure 528 Hz — the love frequency. Deep healing tones, Tibetan bowls, and ambient pads for transformation and inner peace.',
    stream: 'https://ice1.somafm.com/darkzone-128-mp3',
    fallback: 'https://ice2.somafm.com/darkzone-128-mp3',
    accent: '#9ad7c4',
    icon: '🧘',
    bestFor: 'meditation & healing',
    country: 'Japan',
    flag: '🇯🇵',
    location: [35.68, 139.65], // Tokyo
  },
  {
    id: 'jazz-lounge',
    name: 'Midnight Jazz',
    tagline: 'Jazz · Lounge',
    description:
      'Cool jazz and smoky lounge vibes — Miles Davis, Chet Baker, and late-night piano trios for the sophisticated wind-down.',
    stream: 'https://ice1.somafm.com/secretagent-128-mp3',
    fallback: 'https://ice2.somafm.com/secretagent-128-mp3',
    accent: '#c084fc',
    icon: '🎷',
    bestFor: 'late night chill',
    country: 'France',
    flag: '🇫🇷',
    location: [48.86, 2.35], // Paris
  },
  {
    id: 'nature-sounds',
    name: 'Rainforest',
    tagline: 'Nature · White Noise',
    description:
      'Tropical rain, distant thunder, and birdsong from the Amazon — nature\'s own lullaby running 24/7.',
    stream: 'https://ice1.somafm.com/fluid-128-mp3',
    fallback: 'https://ice2.somafm.com/fluid-128-mp3',
    accent: '#4ade80',
    icon: '🌿',
    bestFor: 'calming background',
    country: 'Brazil',
    flag: '🇧🇷',
    location: [-15.79, -47.88], // Brasilia
  },
  {
    id: 'arabic-oud',
    name: 'Oud Dreams',
    tagline: 'World · Celtic Ambient',
    description:
      'Celtic harps, Middle Eastern strings, and gentle world fusion — a dreamy blanket of sound from ancient traditions.',
    stream: 'https://ice1.somafm.com/thistle-128-mp3',
    fallback: 'https://ice2.somafm.com/thistle-128-mp3',
    accent: '#fbbf24',
    icon: '🎵',
    bestFor: 'bedtime calm',
    country: 'UAE',
    flag: '🇦🇪',
    location: [25.20, 55.27], // Dubai
  },
  {
    id: 'piano-dreams',
    name: 'Piano Dreams',
    tagline: 'Vocals · Ambient',
    description:
      'Gentle female vocals floating over lush ambient pads — Elizabeth Fraser, Julee Cruise, and ethereal dream pop for the softest landing into sleep.',
    stream: 'https://ice1.somafm.com/lush-128-mp3',
    fallback: 'https://ice2.somafm.com/lush-128-mp3',
    accent: '#e8b4ff',
    icon: '🎹',
    bestFor: 'gentle sleep',
    country: 'Canada',
    flag: '🇨🇦',
    location: [43.65, -79.38], // Toronto
  },
];
