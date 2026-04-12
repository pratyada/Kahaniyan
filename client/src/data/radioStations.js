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
];
