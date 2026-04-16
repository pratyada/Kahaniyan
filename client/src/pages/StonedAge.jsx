import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { APP_NAME } from '../utils/version.js';
import { usePageMeta } from '../hooks/usePageMeta.js';

const PHASES = [
  { id: 'pre', name: 'Pre-Flight', emoji: '🌅', color: '#f0a500', tagline: 'Smooth talk. Good vibes.' },
  { id: 'orbit', name: 'In Orbit', emoji: '🚀', color: '#f3727f', tagline: 'Peak altitude. Forget your name.' },
  { id: 'land', name: 'Soft Landing', emoji: '🌙', color: '#9cb3ff', tagline: 'Float gently. Tomorrow can wait.' },
];

const STATIONS = {
  pre: [
    { name: 'Golden Hour', desc: 'Chill beats, lo-fi, soft jazz', stream: 'https://ice1.somafm.com/groovesalad-128-mp3', fallback: 'https://ice2.somafm.com/groovesalad-128-mp3', icon: '🌤️', vibe: 'Conversations flow.' },
    { name: 'Smoke Rings', desc: 'Downtempo trip-hop', stream: 'https://ice1.somafm.com/lush-128-mp3', fallback: 'https://ice2.somafm.com/lush-128-mp3', icon: '💨', vibe: 'Room gets warmer.' },
  ],
  orbit: [
    { name: 'Supernova', desc: 'Dance, electronic, house', stream: 'https://ice1.somafm.com/beatblender-128-mp3', fallback: 'https://ice2.somafm.com/beatblender-128-mp3', icon: '🪩', vibe: 'Bass up. Good.' },
    { name: 'Funk Reactor', desc: 'Funky breaks, old-school', stream: 'https://ice1.somafm.com/secretagent-128-mp3', fallback: 'https://ice2.somafm.com/secretagent-128-mp3', icon: '🕺', vibe: 'Body before brain.' },
  ],
  land: [
    { name: 'Velvet Couch', desc: 'Ambient, slow, warm', stream: 'https://ice1.somafm.com/dronezone-128-mp3', fallback: 'https://ice2.somafm.com/dronezone-128-mp3', icon: '🛋️', vibe: 'Horizontal mode.' },
    { name: 'Sunday 4am', desc: 'Sleepy electronica', stream: 'https://ice1.somafm.com/deepspaceone-128-mp3', fallback: 'https://ice2.somafm.com/deepspaceone-128-mp3', icon: '🌊', vibe: 'One more song — 3h ago.' },
  ],
};

const CARDS = [
  { type: 'joke', emoji: '😂', text: "Why don't scientists trust atoms? They make up everything — like your friend who 'only had one drink'.", color: '#f0a500' },
  { type: 'joke', emoji: '🍕', text: "Told my wife she was drawing her eyebrows too high. She looked surprised.", color: '#f0a500' },
  { type: 'joke', emoji: '🤣', text: "My therapist says I have a preoccupation with vengeance. We'll see about that.", color: '#f0a500' },
  { type: 'joke', emoji: '🍷', text: "Alcohol doesn't solve any problems. But then again, neither does milk.", color: '#f0a500' },
  { type: 'joke', emoji: '💀', text: "Not saying I'm old, but my birth certificate is in hieroglyphics.", color: '#f0a500' },
  { type: 'news', emoji: '🤖', text: "AI is writing bedtime stories for kids. Parents: relieved and terrified.", color: '#9cb3ff' },
  { type: 'news', emoji: '📱', text: "Kids under 8: 4.5h screen time/day. Recommended: 1h. Houston, problem.", color: '#9cb3ff' },
  { type: 'news', emoji: '🧠', text: "Bedtime story kids score 14% higher on language tests. Last 15 min = most important.", color: '#9cb3ff' },
  { type: 'news', emoji: '💰', text: "Kids audio market: $8.3B by 2028. AI stories are the new frontier.", color: '#9cb3ff' },
  { type: 'news', emoji: '🌍', text: "Toronto: most multicultural city. 200+ origins. Every story should sound like home.", color: '#9cb3ff' },
  { type: 'news', emoji: '😴', text: "40% Canadian kids don't sleep enough. #1 fix: bedtime stories.", color: '#9cb3ff' },
  { type: 'news', emoji: '🎧', text: "Spotify: kids sleep playlists +340% YoY. Parents want audio.", color: '#9cb3ff' },
  { type: 'news', emoji: '🏫', text: "Ontario: digital wellness now in K-8 curriculum. Screens → stories.", color: '#9cb3ff' },
  { type: 'news', emoji: '🌙', text: "Kids melatonin sales 3x since 2020. Fix routines, not chemistry.", color: '#9cb3ff' },
  { type: 'news', emoji: '🔊', text: "OpenAI TTS: indistinguishable from humans. Personalized stories are here.", color: '#9cb3ff' },
  { type: 'news', emoji: '🇨🇦', text: "Canada: 42M people. 42M who need better bedtime routines.", color: '#9cb3ff' },
  { type: 'news', emoji: '⚽', text: "FIFA 2026 in North America. The world is visiting your neighbourhood.", color: '#9cb3ff' },
  { type: 'tip', emoji: '🏋️', text: "5-min rule: can't work out? Just 5 min. Brain can't say no. You'll do 30.", color: '#7ad9a1' },
  { type: 'tip', emoji: '💋', text: "#1 attractiveness hack: sleep. Not cologne. Not abs. Well-rested = 25% hotter.", color: '#7ad9a1' },
  { type: 'tip', emoji: '❤️', text: "Kids in bed on time = 40% more couple time. That's what bedtime stories are really for.", color: '#7ad9a1' },
];

const LABELS = { joke: '😂 JOKE', news: '🌍 DID YOU KNOW', tip: '💡 PRO TIP' };

function CardStack() {
  const [deck, setDeck] = useState(() => [...CARDS].sort(() => Math.random() - 0.5));
  const [idx, setIdx] = useState(0);

  const swipe = () => {
    if (idx + 1 >= deck.length) {
      setDeck([...CARDS].sort(() => Math.random() - 0.5));
      setIdx(0);
    } else {
      setIdx((i) => i + 1);
    }
  };

  const visible = deck.slice(idx, idx + 3);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 340, height: 360, margin: '0 auto', touchAction: 'pan-y' }}
      onTouchStart={(e) => { if (e.touches.length === 1) e.currentTarget.style.touchAction = 'none'; }}
      onTouchEnd={(e) => { e.currentTarget.style.touchAction = 'pan-y'; }}
    >
      {visible.map((card, i) => {
        const isTop = i === 0;
        return (
          <motion.div
            key={idx + i + card.text.slice(0, 15)}
            drag={isTop ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 80) swipe(); }}
            style={{
              position: 'absolute', top: 0, left: 0, right: 0,
              zIndex: 10 - i,
              cursor: isTop ? 'grab' : 'default',
              touchAction: 'pan-y',
            }}
            animate={{ y: i * 10, scale: 1 - i * 0.04, opacity: 1 - i * 0.2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div style={{
              background: '#1a1a28', borderRadius: 20, padding: 22, minHeight: 320,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              border: `1px solid ${card.color}33`,
              boxShadow: isTop ? `0 10px 30px ${card.color}12` : 'none',
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: card.color, padding: '3px 8px', borderRadius: 999, background: `${card.color}15` }}>
                    {LABELS[card.type]}
                  </span>
                  <span style={{ fontSize: 10, color: '#6e6a63' }}>{idx + 1}/{deck.length}</span>
                </div>
                <div style={{ fontSize: 42, marginBottom: 14 }}>{card.emoji}</div>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: '#f5f0e8', fontFamily: 'Lora,Georgia,serif' }}>{card.text}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
      <div style={{ position: 'absolute', bottom: -20, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: '#6e6a63' }}>← swipe →</div>
    </div>
  );
}

export default function StonedAge() {
  usePageMeta({
    title: 'Stoned Age — After kids sleep, parents play 🪨',
    description: 'Curated radio for every phase of your night. Pre-flight chill, peak orbit dance, soft landing ambient. Plus 20 swipeable joke, news & tip cards. A My Sleepy Tale side project.',
  });

  const [phase, setPhase] = useState('pre');
  const [activeStation, setActiveStation] = useState(null);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);
  const cur = PHASES.find((p) => p.id === phase);

  const toggleStation = (station) => {
    // Same station — toggle
    if (activeStation?.name === station.name) {
      if (playing) { audioRef.current?.pause(); setPlaying(false); }
      else { audioRef.current?.play().catch(() => {}); }
      return;
    }
    // Different station — KILL the old one completely
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load(); // force release
      audioRef.current = null;
    }
    setPlaying(false);
    setActiveStation(null);
    // Start new
    const a = new Audio(station.stream);
    a.onplay = () => setPlaying(true);
    a.onpause = () => setPlaying(false);
    a.onerror = () => { if (station.fallback) { a.src = station.fallback; a.play().catch(() => {}); } };
    audioRef.current = a;
    setActiveStation(station);
    a.play().catch(() => {});
  };

  useEffect(() => () => { if (audioRef.current) { audioRef.current.pause(); audioRef.current.removeAttribute('src'); audioRef.current.load(); } }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f5f0e8', overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <style>{`html,body,#root{height:auto!important;overflow:auto!important;overscroll-behavior:auto!important}`}</style>

      <div style={{ padding: '36px 20px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <a href="https://mysleepytale.com" style={{ padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', color: '#a8a39a', fontSize: 11, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)', fontWeight: 600 }}>🌙 {APP_NAME}</a>
          <motion.div
          style={{ fontSize: 52, display: 'inline-block' }}
          animate={{
            rotate: [0, 10, -10, 5, -5, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
            filter: [
              'hue-rotate(0deg)',
              'hue-rotate(30deg)',
              'hue-rotate(-20deg)',
              'hue-rotate(15deg)',
              'hue-rotate(0deg)',
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            🪨
          </motion.div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: 32, fontWeight: 700 }}><span style={{ color: '#f0a500' }}>Stoned</span> Age</h1>
          <p style={{ color: '#a8a39a', fontSize: 13, marginTop: 4 }}>Pick your phase. Press play. Swipe cards.</p>
        </div>
      </div>

      {/* Phase picker */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, padding: '0 16px', marginBottom: 20 }}>
        {PHASES.map((p) => (
          <button key={p.id} onClick={() => setPhase(p.id)} style={{
            flex: 1, maxWidth: 130, padding: '12px 6px', borderRadius: 14, border: 'none', cursor: 'pointer',
            background: phase === p.id ? p.color : '#141420',
            color: phase === p.id ? '#0a0a0f' : '#6e6a63',
            fontWeight: 700, fontSize: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, transition: 'all 0.2s',
          }}>
            <span style={{ fontSize: 22 }}>{p.emoji}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 460, margin: '0 auto', padding: '0 20px' }}>
        <AnimatePresence mode="wait">
          <motion.div key={phase} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <h2 style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: 20, fontWeight: 700, color: cur.color }}>{cur.name}</h2>
              <p style={{ fontSize: 11, color: '#a8a39a' }}>{cur.tagline}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
              {STATIONS[phase].map((s) => {
                const isActive = activeStation?.name === s.name;
                const isPlaying = isActive && playing;
                return (
                  <div key={s.name} style={{ background: isActive ? '#1e1e2e' : '#141420', borderRadius: 14, padding: 12, border: isActive ? `1px solid ${cur.color}44` : '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => toggleStation(s)} style={{ width: 48, height: 48, borderRadius: 12, border: 'none', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0, background: isPlaying ? cur.color : `${cur.color}22`, color: isPlaying ? '#0a0a0f' : '#f5f0e8' }}>
                      {isPlaying ? '⏸' : '▶'}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ fontSize: 16 }}>{s.icon}</span>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</span>
                        {isPlaying && <span style={{ display: 'inline-flex', gap: 2, marginLeft: 3 }}>{[7,11,5].map((h,i) => <span key={i} style={{ display:'block',width:2,height:h,borderRadius:2,background:cur.color,animation:`pulse ${0.6+i*0.2}s ease-in-out infinite`,animationDelay:`${i*0.15}s` }} />)}</span>}
                      </div>
                      <p style={{ fontSize: 10, color: '#a8a39a', marginTop: 2 }}>{s.desc} · <em style={{ color: '#6e6a63' }}>"{s.vibe}"</em></p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div style={{ marginBottom: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: 18, fontWeight: 700 }}>🃏 While you listen...</h2>
            <p style={{ fontSize: 10, color: '#a8a39a', marginTop: 2 }}>Jokes, news & tips. Swipe to dismiss.</p>
          </div>
          <CardStack />
        </div>

        <div style={{ background: 'linear-gradient(135deg, rgba(240,165,0,0.06), rgba(156,179,255,0.06))', borderRadius: 16, padding: 20, textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', marginBottom: 20 }}>
          <div style={{ fontSize: 20 }}>🌙 → 🪨</div>
          <h3 style={{ fontFamily: 'Playfair Display,Georgia,serif', fontSize: 16, fontWeight: 700, color: '#f0a500', marginTop: 6 }}>After kids sleep, parents play.</h3>
          <p style={{ fontSize: 11, color: '#a8a39a', marginTop: 6 }}>{APP_NAME} puts your kids to sleep. Then Stoned Age takes over.</p>
          <a href="https://mysleepytale.com" style={{ display: 'inline-block', marginTop: 12, padding: '10px 20px', borderRadius: 999, background: '#f0a500', color: '#0a0a0f', fontWeight: 700, fontSize: 12, textDecoration: 'none' }}>Try {APP_NAME}</a>
        </div>

        <div style={{ textAlign: 'center', paddingTop: 14, paddingBottom: 28, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p style={{ fontSize: 9, color: '#6e6a63' }}>Stoned Age · {APP_NAME} side project · Idea by Rahul 🙏</p>
          <p style={{ fontSize: 8, color: '#6e6a6330', marginTop: 3 }}>SomaFM streams. Consume responsibly.</p>
        </div>
      </div>
    </div>
  );
}
