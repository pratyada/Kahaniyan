import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { APP_NAME } from '../utils/version.js';

// ─── SWIPE CARDS ───
const CARDS = [
  // 🃏 JOKES (5)
  { type: 'joke', emoji: '😂', text: "Why don't scientists trust atoms? Because they make up everything — just like your friend who 'only had one drink'.", tag: 'joke' },
  { type: 'joke', emoji: '🍕', text: "I told my wife she was drawing her eyebrows too high. She looked surprised.", tag: 'joke' },
  { type: 'joke', emoji: '🤣', text: "My therapist says I have a preoccupation with vengeance. We'll see about that.", tag: 'joke' },
  { type: 'joke', emoji: '🍷', text: "Alcohol doesn't solve any problems. But then again, neither does milk.", tag: 'joke' },
  { type: 'joke', emoji: '💀', text: "I'm not saying I'm old, but my birth certificate is written in hieroglyphics.", tag: 'joke' },

  // 🌍 CURRENT AFFAIRS (12)
  { type: 'news', emoji: '🤖', text: "AI is now writing bedtime stories for kids. Parents are simultaneously relieved and terrified.", tag: 'tech', source: 'Tech Trends 2026' },
  { type: 'news', emoji: '🇨🇦', text: "Canada's population just hit 42 million. That's 42 million people who could use a better bedtime routine.", tag: 'canada', source: 'StatsCan' },
  { type: 'news', emoji: '📱', text: "Average screen time for kids under 8 is now 4.5 hours/day. The American Academy of Pediatrics recommends 1 hour. We have a problem.", tag: 'health', source: 'AAP 2026' },
  { type: 'news', emoji: '⚽', text: "FIFA 2026 kicks off this summer in North America. Toronto, Vancouver, and 14 other cities. The world is literally coming to your neighbourhood.", tag: 'sports', source: 'FIFA' },
  { type: 'news', emoji: '🧠', text: "A study found that children who hear bedtime stories score 14% higher on language tests. The last 15 minutes of the day are the most important.", tag: 'science', source: 'Nature 2025' },
  { type: 'news', emoji: '💰', text: "The kids' audio content market is projected to reach $8.3B by 2028. Podcasts, audiobooks, and AI stories are the new frontier.", tag: 'market', source: 'Grand View Research' },
  { type: 'news', emoji: '🌍', text: "Toronto is officially the most multicultural city on earth — 200+ ethnic origins. Every bedtime story should sound like your home.", tag: 'culture', source: 'UN Report' },
  { type: 'news', emoji: '😴', text: "40% of Canadian kids don't get enough sleep. The #1 recommended fix by pediatricians: a consistent bedtime routine with stories.", tag: 'health', source: 'CPS 2025' },
  { type: 'news', emoji: '🎧', text: "Spotify wrapped 2025: kids' sleep playlists grew 340% year over year. Parents are searching for audio solutions.", tag: 'market', source: 'Spotify' },
  { type: 'news', emoji: '🏫', text: "Ontario just added 'digital wellness' to the K-8 curriculum. Schools are teaching kids to replace screens with stories.", tag: 'education', source: 'Ontario Ministry' },
  { type: 'news', emoji: '🌙', text: "Melatonin sales for kids have tripled since 2020. Parents are medicating sleep instead of fixing routines. There's a better way.", tag: 'health', source: 'Health Canada' },
  { type: 'news', emoji: '🔊', text: "OpenAI's TTS voices are now indistinguishable from human narrators. The tech to make personalized bedtime stories is finally here.", tag: 'tech', source: 'OpenAI Blog' },

  // 💪 TIPS (3)
  { type: 'tip', emoji: '🏋️', text: "The 5-minute rule: can't motivate yourself to work out? Just do 5 minutes. Your brain can't say no to 5 minutes. You'll end up doing 30.", tag: 'fitness' },
  { type: 'tip', emoji: '💋', text: "The #1 thing that makes you more attractive: sleep. Not cologne, not abs. Sleep. Well-rested people are rated 25% more attractive in studies.", tag: 'attractive' },
  { type: 'tip', emoji: '❤️', text: "Want a better relationship? Put your kids to bed on time. Couples with a bedtime routine report 40% more quality time together. That's what My Sleepy Tale is really for.", tag: 'love' },
];

function SwipeCards() {
  const [cards, setCards] = useState(() => [...CARDS].sort(() => Math.random() - 0.5));
  const [gone, setGone] = useState(new Set());

  const removeCard = useCallback((idx) => {
    setGone((prev) => new Set(prev).add(idx));
    if (gone.size + 1 >= cards.length) {
      setTimeout(() => {
        setCards([...CARDS].sort(() => Math.random() - 0.5));
        setGone(new Set());
      }, 500);
    }
  }, [gone, cards.length]);

  const visible = cards.filter((_, i) => !gone.has(i));
  const topIdx = cards.findIndex((_, i) => !gone.has(i));

  const typeColors = { joke: '#f0a500', news: '#9cb3ff', tip: '#7ad9a1' };
  const typeLabels = { joke: '😂 JOKE', news: '🌍 DID YOU KNOW', tip: '💡 PRO TIP' };

  return (
    <div style={{ position: 'relative', width: '100%', height: 320, marginBottom: 20 }}>
      <AnimatePresence>
        {cards.map((card, i) => {
          if (gone.has(i)) return null;
          const isTop = i === topIdx;
          return (
            <SwipeCard
              key={i}
              card={card}
              isTop={isTop}
              color={typeColors[card.type]}
              label={typeLabels[card.type]}
              onSwipe={() => removeCard(i)}
              style={{ zIndex: cards.length - i }}
            />
          );
        })}
      </AnimatePresence>
      <div style={{ position: 'absolute', bottom: -4, left: 0, right: 0, textAlign: 'center', fontSize: 11, color: '#6e6a63' }}>
        ← swipe to dismiss · {visible.length} cards left →
      </div>
    </div>
  );
}

function SwipeCard({ card, isTop, color, label, onSwipe, style }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate, opacity, position: 'absolute', top: 0, left: 0, right: 0, cursor: isTop ? 'grab' : 'default', ...style }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 100) onSwipe();
        else x.set(0);
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7, y: isTop ? 0 : 8 }}
      exit={{ x: 300, opacity: 0, transition: { duration: 0.3 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div style={{
        background: '#1a1a28',
        borderRadius: 20,
        padding: 24,
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        border: `1px solid ${color}33`,
        boxShadow: isTop ? `0 8px 30px ${color}15` : 'none',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color, padding: '4px 10px', borderRadius: 999, background: `${color}15` }}>
              {label}
            </span>
            {card.tag && (
              <span style={{ fontSize: 9, color: '#6e6a63', textTransform: 'uppercase', letterSpacing: '0.1em' }}>#{card.tag}</span>
            )}
          </div>
          <div style={{ fontSize: 44, marginBottom: 12 }}>{card.emoji}</div>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#f5f0e8', fontFamily: 'Lora, Georgia, serif' }}>{card.text}</p>
        </div>
        {card.source && (
          <p style={{ fontSize: 10, color: '#6e6a63', marginTop: 12 }}>Source: {card.source}</p>
        )}
      </div>
    </motion.div>
  );
}

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
    // Same station — toggle play/pause
    if (activeStation?.name === station.name) {
      if (playing) {
        audioRef.current?.pause();
        setPlaying(false);
      } else {
        audioRef.current?.play().catch(() => {});
      }
      return;
    }
    // Different station — stop current, start new
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    const audio = new Audio(station.stream);
    audio.onplay = () => setPlaying(true);
    audio.onpause = () => setPlaying(false);
    audio.onerror = () => {
      if (station.fallback) { audio.src = station.fallback; audio.play().catch(() => {}); }
    };
    audioRef.current = audio;
    setActiveStation(station);
    audio.play().catch(() => {});
  };

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f5f0e8', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <style>{`html,body,#root{height:auto!important;overflow:auto!important;overscroll-behavior:auto!important}`}</style>

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '48px 24px 32px' }}>
        <a href="https://mysleepytale.com" style={{ display: 'inline-block', marginBottom: 24, padding: '8px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', color: '#a8a39a', fontSize: 12, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
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

        {/* Swipe cards */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 32 }}>🃏</div>
            <h2 style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: 20, fontWeight: 700, color: '#f5f0e8', marginTop: 4 }}>While you listen...</h2>
            <p style={{ fontSize: 12, color: '#a8a39a', marginTop: 4 }}>Swipe through jokes, news & tips. The stuff you miss when you're parenting.</p>
          </div>
          <SwipeCards />
        </div>

        {/* After kids sleep */}
        <div style={{ background: 'linear-gradient(135deg, rgba(240,165,0,0.08), rgba(156,179,255,0.08))', borderRadius: 16, padding: 24, textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', marginTop: 20 }}>
          <div style={{ fontSize: 24 }}>🌙 → 🪨</div>
          <h3 style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: 18, fontWeight: 700, color: '#f0a500', marginTop: 8 }}>After kids sleep, parents play.</h3>
          <p style={{ fontSize: 13, color: '#a8a39a', marginTop: 8 }}>
            {APP_NAME} puts your kids to sleep with personalized AI bedtime stories. Then Stoned Age takes over.
          </p>
          <a href="https://mysleepytale.com" style={{ display: 'inline-block', marginTop: 16, padding: '12px 24px', borderRadius: 999, background: '#f0a500', color: '#0a0a0f', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
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
