import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { APP_NAME } from '../utils/version.js';

const PHASES = [
  {
    id: 'pre-flight',
    name: 'Pre-Flight',
    emoji: '🌅',
    tagline: 'The warm-up. Smooth talk. Good vibes.',
    color: '#f0a500',
    bg: 'from-[#f0a500]/10 to-transparent',
    stations: [
      {
        name: 'Golden Hour',
        desc: 'Chill beats, soft jazz, lo-fi — the soundtrack for "we just got here"',
        stream: 'https://ice1.somafm.com/groovesalad-128-mp3',
        fallback: 'https://ice2.somafm.com/groovesalad-128-mp3',
        icon: '🌤️',
        vibe: 'Conversations flow. Nobody is yelling yet.',
      },
      {
        name: 'Smoke Rings',
        desc: 'Downtempo trip-hop. Massive Attack energy. Clouds in your ears.',
        stream: 'https://ice1.somafm.com/lush-128-mp3',
        fallback: 'https://ice2.somafm.com/lush-128-mp3',
        icon: '💨',
        vibe: 'The first one hits. The room gets warmer.',
      },
    ],
  },
  {
    id: 'orbit',
    name: 'In Orbit',
    emoji: '🚀',
    tagline: 'Peak altitude. Move your body. Forget your name.',
    color: '#f3727f',
    bg: 'from-[#f3727f]/10 to-transparent',
    stations: [
      {
        name: 'Supernova',
        desc: 'Dance, electronic, house — the kind that makes strangers become friends',
        stream: 'https://ice1.somafm.com/beatblender-128-mp3',
        fallback: 'https://ice2.somafm.com/beatblender-128-mp3',
        icon: '🪩',
        vibe: 'Someone just turned the bass up. Good.',
      },
      {
        name: 'Funk Reactor',
        desc: 'Funky breaks, old-school grooves, head-nodding guaranteed',
        stream: 'https://ice1.somafm.com/secretagent-128-mp3',
        fallback: 'https://ice2.somafm.com/secretagent-128-mp3',
        icon: '🕺',
        vibe: 'Your body moves before your brain agrees.',
      },
    ],
  },
  {
    id: 'landing',
    name: 'Soft Landing',
    emoji: '🌙',
    tagline: 'The comedown. Float gently. Tomorrow can wait.',
    color: '#9cb3ff',
    bg: 'from-[#9cb3ff]/10 to-transparent',
    stations: [
      {
        name: 'Velvet Couch',
        desc: 'Ambient, slow, warm — like lying on a cloud that someone put a blanket on',
        stream: 'https://ice1.somafm.com/dronezone-128-mp3',
        fallback: 'https://ice2.somafm.com/dronezone-128-mp3',
        icon: '🛋️',
        vibe: 'You\'re horizontal. The ceiling is interesting.',
      },
      {
        name: 'Sunday 4am',
        desc: 'Sleepy electronica. The party is over. The silence is beautiful.',
        stream: 'https://ice1.somafm.com/deepspaceone-128-mp3',
        fallback: 'https://ice2.somafm.com/deepspaceone-128-mp3',
        icon: '🌊',
        vibe: 'Someone said "one more song" three hours ago.',
      },
    ],
  },
];

export default function StonedAge() {
  const [activeStation, setActiveStation] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [activePhase, setActivePhase] = useState('pre-flight');
  const audioRef = useRef(null);

  const toggleStation = (station) => {
    if (activeStation?.name === station.name && playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
    const audio = new Audio(station.stream);
    audio.crossOrigin = 'anonymous';
    audio.onplay = () => setPlaying(true);
    audio.onpause = () => setPlaying(false);
    audio.onerror = () => {
      // Try fallback
      if (station.fallback) { audio.src = station.fallback; audio.play().catch(() => {}); }
    };
    audioRef.current = audio;
    audio.play().catch(() => {});
    setActiveStation(station);
  };

  useEffect(() => { return () => { audioRef.current?.pause(); }; }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#f5f0e8]" style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <style>{`html, body, #root { height: auto !important; overflow: auto !important; }`}</style>

      {/* Header */}
      <header className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f3727f]/8 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-3xl px-6 py-12 text-center">
          <a href="/" className="mb-6 inline-flex items-center gap-1 rounded-full bg-white/5 px-4 py-2 text-xs text-[#a8a39a] ring-1 ring-white/10">
            ← Back to {APP_NAME}
          </a>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-3 text-6xl">🪨</div>
            <h1 className="font-display text-4xl font-bold md:text-5xl">
              <span className="text-[#f0a500]">Stoned</span> Age
            </h1>
            <p className="mt-2 text-lg text-[#a8a39a]">
              Curated radio for every phase of the night
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-[#6e6a63]">
              <span className="rounded-full bg-white/5 px-3 py-1">🌅 warm up</span>
              <span className="rounded-full bg-white/5 px-3 py-1">→</span>
              <span className="rounded-full bg-white/5 px-3 py-1">🚀 peak</span>
              <span className="rounded-full bg-white/5 px-3 py-1">→</span>
              <span className="rounded-full bg-white/5 px-3 py-1">🌙 landing</span>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Phase tabs */}
      <div className="sticky top-0 z-20 border-b border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl gap-1 px-6 py-2">
          {PHASES.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePhase(p.id)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${
                activePhase === p.id ? `text-[#0a0a0f]` : 'text-[#6e6a63]'
              }`}
              style={activePhase === p.id ? { background: p.color } : {}}
            >
              <span>{p.emoji}</span>
              <span className="hidden sm:inline">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stations */}
      <div className="mx-auto max-w-3xl px-6 py-8">
        {PHASES.filter((p) => p.id === activePhase).map((phase) => (
          <div key={phase.id}>
            <div className="mb-6 text-center">
              <div className="text-4xl">{phase.emoji}</div>
              <h2 className="mt-2 font-display text-2xl font-bold text-[#f5f0e8]">{phase.name}</h2>
              <p className="mt-1 text-sm text-[#a8a39a]">{phase.tagline}</p>
            </div>

            <div className="space-y-4">
              {phase.stations.map((station) => {
                const isActive = activeStation?.name === station.name;
                const isPlaying = isActive && playing;
                return (
                  <motion.div
                    key={station.name}
                    layout
                    className={`overflow-hidden rounded-2xl transition ${
                      isActive ? 'bg-[#1a1a28] shadow-[0_0_40px_rgba(240,165,0,0.1)] ring-1' : 'bg-[#1a1a28]'
                    }`}
                    style={isActive ? { borderColor: `${phase.color}44` } : {}}
                  >
                    <div className="p-5">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleStation(station)}
                          className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-3xl transition active:scale-95"
                          style={{ background: isPlaying ? phase.color : `${phase.color}22` }}
                        >
                          {isPlaying ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill={isPlaying ? '#0a0a0f' : '#f5f0e8'}>
                              <rect x="6" y="4" width="4" height="16" rx="1.5" />
                              <rect x="14" y="4" width="4" height="16" rx="1.5" />
                            </svg>
                          ) : (
                            <span>{station.icon}</span>
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-display text-lg font-bold text-[#f5f0e8]">{station.name}</h3>
                            {isPlaying && (
                              <span className="inline-flex items-end gap-[2px]">
                                <span className="block h-2 w-[2px] animate-[pulse_0.8s_ease-in-out_infinite] rounded-full" style={{ background: phase.color }} />
                                <span className="block h-3 w-[2px] animate-[pulse_0.6s_ease-in-out_infinite] rounded-full" style={{ background: phase.color, animationDelay: '0.15s' }} />
                                <span className="block h-1.5 w-[2px] animate-[pulse_1s_ease-in-out_infinite] rounded-full" style={{ background: phase.color, animationDelay: '0.3s' }} />
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-[#a8a39a]">{station.desc}</p>
                          <p className="mt-1 text-[10px] italic text-[#6e6a63]">"{station.vibe}"</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* After kids sleep note */}
      <div className="mx-auto max-w-3xl px-6 pb-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#f0a500]/5 to-[#9cb3ff]/5 p-6 text-center ring-1 ring-white/5">
          <div className="mb-2 text-2xl">🌙 → 🪨</div>
          <h3 className="font-display text-lg font-bold text-[#f0a500]">After kids sleep, parents play.</h3>
          <p className="mt-2 text-sm text-[#a8a39a]">
            {APP_NAME} puts your kids to sleep with AI bedtime stories.
            Then Stoned Age takes over for the rest of your night.
          </p>
          <a
            href="/"
            className="mt-4 inline-block rounded-full bg-[#f0a500] px-6 py-3 text-sm font-bold text-[#0a0a0f]"
          >
            Try {APP_NAME} for your kids
          </a>
        </div>
      </div>

      {/* Credits */}
      <footer className="border-t border-white/5 py-6 text-center">
        <p className="text-xs text-[#6e6a63]">
          Stoned Age · a {APP_NAME} side project · Idea by Rahul 🙏
        </p>
        <p className="mt-1 text-[10px] text-[#6e6a63]/50">
          Streams powered by SomaFM. Please consume responsibly.
        </p>
      </footer>
    </div>
  );
}
