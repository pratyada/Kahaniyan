import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { APP_NAME } from '../utils/version.js';

const PHASES = [
  {
    id: 'pre-flight',
    name: 'Pre-Flight',
    emoji: '🌅',
    tagline: 'Smooth talk. Good vibes. The night is young.',
    color: '#f0a500',
    stations: [
      { name: 'Golden Hour', desc: 'Chill beats, soft jazz, lo-fi', stream: 'https://ice1.somafm.com/groovesalad-128-mp3', fallback: 'https://ice2.somafm.com/groovesalad-128-mp3', icon: '🌤️', vibe: 'Conversations flow. Nobody is yelling yet.' },
      { name: 'Smoke Rings', desc: 'Downtempo trip-hop. Massive Attack energy.', stream: 'https://ice1.somafm.com/lush-128-mp3', fallback: 'https://ice2.somafm.com/lush-128-mp3', icon: '💨', vibe: 'The first one hits. The room gets warmer.' },
    ],
  },
  {
    id: 'orbit',
    name: 'In Orbit',
    emoji: '🚀',
    tagline: 'Peak altitude. Move your body. Forget your name.',
    color: '#f3727f',
    stations: [
      { name: 'Supernova', desc: 'Dance, electronic, house — strangers become friends', stream: 'https://ice1.somafm.com/beatblender-128-mp3', fallback: 'https://ice2.somafm.com/beatblender-128-mp3', icon: '🪩', vibe: 'Someone just turned the bass up. Good.' },
      { name: 'Funk Reactor', desc: 'Funky breaks, old-school grooves', stream: 'https://ice1.somafm.com/secretagent-128-mp3', fallback: 'https://ice2.somafm.com/secretagent-128-mp3', icon: '🕺', vibe: 'Your body moves before your brain agrees.' },
    ],
  },
  {
    id: 'landing',
    name: 'Soft Landing',
    emoji: '🌙',
    tagline: 'Float gently. Tomorrow can wait.',
    color: '#9cb3ff',
    stations: [
      { name: 'Velvet Couch', desc: 'Ambient, slow — a cloud with a blanket on it', stream: 'https://ice1.somafm.com/dronezone-128-mp3', fallback: 'https://ice2.somafm.com/dronezone-128-mp3', icon: '🛋️', vibe: "You're horizontal. The ceiling is interesting." },
      { name: 'Sunday 4am', desc: 'Sleepy electronica. The party is over.', stream: 'https://ice1.somafm.com/deepspaceone-128-mp3', fallback: 'https://ice2.somafm.com/deepspaceone-128-mp3', icon: '🌊', vibe: "Someone said 'one more song' three hours ago." },
    ],
  },
];

export default function StonedAge() {
  const [activeStation, setActiveStation] = useState(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleStation = (station) => {
    if (activeStation?.name === station.name && playing) {
      audioRef.current?.pause();
      setPlaying(false);
      return;
    }
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
    const audio = new Audio(station.stream);
    audio.onplay = () => { setPlaying(true); setActiveStation(station); };
    audio.onpause = () => setPlaying(false);
    audio.onerror = () => {
      if (station.fallback) { audio.src = station.fallback; audio.play().catch(() => {}); }
    };
    audioRef.current = audio;
    audio.play().catch(() => {});
  };

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f5f0e8', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <style>{`html,body,#root{height:auto!important;overflow:auto!important;overscroll-behavior:auto!important}`}</style>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '48px 24px 32px' }}>
        <a href="/" style={{ display: 'inline-block', marginBottom: 24, padding: '8px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', color: '#a8a39a', fontSize: 12, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
          ← Back to {APP_NAME}
        </a>
        <div style={{ fontSize: 56 }}>🪨</div>
        <h1 style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: 40, fontWeight: 700, marginTop: 8 }}>
          <span style={{ color: '#f0a500' }}>Stoned</span> Age
        </h1>
        <p style={{ marginTop: 8, color: '#a8a39a', fontSize: 16 }}>Pick your phase. Press play. That's it.</p>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ padding: '4px 12px', borderRadius: 999, background: '#f0a50022', color: '#f0a500', fontSize: 12, fontWeight: 700 }}>🌅 Pre-Flight</span>
          <span style={{ color: '#6e6a63' }}>→</span>
          <span style={{ padding: '4px 12px', borderRadius: 999, background: '#f3727f22', color: '#f3727f', fontSize: 12, fontWeight: 700 }}>🚀 In Orbit</span>
          <span style={{ color: '#6e6a63' }}>→</span>
          <span style={{ padding: '4px 12px', borderRadius: 999, background: '#9cb3ff22', color: '#9cb3ff', fontSize: 12, fontWeight: 700 }}>🌙 Landing</span>
        </div>
      </div>

      {/* All phases — no tabs, everything visible */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 20px 40px' }}>
        {PHASES.map((phase) => (
          <div key={phase.id} style={{ marginBottom: 40 }}>
            {/* Phase header */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 40 }}>{phase.emoji}</div>
              <h2 style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: 24, fontWeight: 700, color: phase.color, marginTop: 4 }}>{phase.name}</h2>
              <p style={{ fontSize: 13, color: '#a8a39a', marginTop: 4 }}>{phase.tagline}</p>
            </div>

            {/* Stations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {phase.stations.map((station) => {
                const isActive = activeStation?.name === station.name;
                const isPlaying = isActive && playing;
                return (
                  <div
                    key={station.name}
                    style={{
                      background: isActive ? '#1e1e2e' : '#141420',
                      borderRadius: 16,
                      padding: 16,
                      border: isActive ? `1px solid ${phase.color}44` : '1px solid rgba(255,255,255,0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      {/* Play button */}
                      <button
                        onClick={() => toggleStation(station)}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 16,
                          border: 'none',
                          cursor: 'pointer',
                          display: 'grid',
                          placeItems: 'center',
                          fontSize: 28,
                          flexShrink: 0,
                          background: isPlaying ? phase.color : `${phase.color}22`,
                          color: isPlaying ? '#0a0a0f' : '#f5f0e8',
                          transition: 'transform 0.1s',
                        }}
                      >
                        {isPlaying ? '⏸' : '▶'}
                      </button>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 20 }}>{station.icon}</span>
                          <span style={{ fontWeight: 700, fontSize: 16, color: '#f5f0e8' }}>{station.name}</span>
                          {isPlaying && (
                            <span style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 2, marginLeft: 4 }}>
                              <span style={{ display: 'block', width: 2, height: 8, borderRadius: 2, background: phase.color, animation: 'pulse 0.8s ease-in-out infinite' }} />
                              <span style={{ display: 'block', width: 2, height: 12, borderRadius: 2, background: phase.color, animation: 'pulse 0.6s ease-in-out infinite', animationDelay: '0.15s' }} />
                              <span style={{ display: 'block', width: 2, height: 6, borderRadius: 2, background: phase.color, animation: 'pulse 1s ease-in-out infinite', animationDelay: '0.3s' }} />
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 12, color: '#a8a39a', marginTop: 4 }}>{station.desc}</p>
                        <p style={{ fontSize: 10, color: '#6e6a63', marginTop: 4, fontStyle: 'italic' }}>"{station.vibe}"</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* After kids sleep */}
        <div style={{ background: 'linear-gradient(135deg, rgba(240,165,0,0.08), rgba(156,179,255,0.08))', borderRadius: 16, padding: 24, textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', marginTop: 20 }}>
          <div style={{ fontSize: 24 }}>🌙 → 🪨</div>
          <h3 style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: 18, fontWeight: 700, color: '#f0a500', marginTop: 8 }}>After kids sleep, parents play.</h3>
          <p style={{ fontSize: 13, color: '#a8a39a', marginTop: 8 }}>
            {APP_NAME} puts your kids to sleep with personalized AI bedtime stories. Then Stoned Age takes over.
          </p>
          <a href="/" style={{ display: 'inline-block', marginTop: 16, padding: '12px 24px', borderRadius: 999, background: '#f0a500', color: '#0a0a0f', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            Try {APP_NAME} for your kids
          </a>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ fontSize: 11, color: '#6e6a63' }}>Stoned Age · a {APP_NAME} side project · Idea by Rahul 🙏</p>
          <p style={{ fontSize: 10, color: '#6e6a6340', marginTop: 4 }}>Streams by SomaFM. Please consume responsibly.</p>
        </div>
      </div>
    </div>
  );
}
