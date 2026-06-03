// Marketing Creatives — print-ready designs in My Sleepy Tale brand.
// mysleepytale.com/creatives

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';

const CREATIVES = [
  { id: 'flyer', label: 'Flyer / Poster', icon: '📄' },
  { id: 'standee', label: 'Event Standee', icon: '🪧' },
  { id: 'social', label: 'Social Post', icon: '📱' },
  { id: 'sticker', label: 'Car Sticker', icon: '🚗' },
  { id: 'house', label: 'House Sign', icon: '🏠' },
  { id: 'pamphlet', label: 'Tri-Fold Pamphlet', icon: '📰' },
  { id: 'tvad', label: 'TV / Digital Ad', icon: '📺' },
];

// ─── Shared brand elements ───

const NAVY = '#1a1040';
const NAVY_DARK = '#0f0a2a';
const BLACK = '#0a0a0f';
const GOLD = '#f0a500';
const GOLD_LIGHT = '#ffd98a';
const BLUE = '#5ba4d9';
const CREAM = '#f5f0e8';
const MUTED = '#8a8494';
const SERIF = "'Georgia', 'Fraunces', 'Times New Roman', serif";
const SANS = "'Helvetica Neue', 'Arial', sans-serif";

function Moon({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <radialGradient id="moonG" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffd98a" />
          <stop offset="60%" stopColor="#f0a500" />
          <stop offset="100%" stopColor="#b87f00" />
        </radialGradient>
      </defs>
      <circle cx="30" cy="28" r="20" fill="url(#moonG)" />
      <circle cx="40" cy="20" r="18" fill={NAVY} />
    </svg>
  );
}

function Stars({ style = {} }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', ...style }}>
      {[
        { t: '12%', l: '8%', s: 2.5 }, { t: '8%', l: '25%', s: 1.5 }, { t: '18%', l: '72%', s: 2 },
        { t: '6%', l: '85%', s: 3 }, { t: '22%', l: '45%', s: 1.5 }, { t: '15%', l: '60%', s: 2 },
        { t: '28%', l: '15%', s: 1.5 }, { t: '5%', l: '50%', s: 2 }, { t: '25%', l: '90%', s: 1.5 },
        { t: '10%', l: '38%', s: 2.5 }, { t: '20%', l: '78%', s: 1.5 },
      ].map((s, i) => (
        <div key={i} style={{ position: 'absolute', top: s.t, left: s.l, width: s.s, height: s.s, borderRadius: '50%', background: '#fff', opacity: 0.5 + Math.random() * 0.3 }} />
      ))}
    </div>
  );
}

function QRCard({ size = 140, label = 'SCAN TO START' }) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: 20, display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 10, boxShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>
      <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: 3, color: '#666', fontFamily: SANS }}>{label}</p>
      <div style={{ width: size, height: size, background: '#f8f8f8', border: '2px solid #e0e0e0', borderRadius: 8, display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gridTemplateRows: 'repeat(9, 1fr)', gap: 1, padding: 6 }}>
        {Array.from({ length: 81 }).map((_, i) => {
          const r = Math.floor(i / 9), c = i % 9;
          const isCorner = (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
          const fill = isCorner || [4, 13, 22, 31, 40, 49, 58, 67, 76].includes(i) || Math.random() > 0.55;
          return <div key={i} style={{ background: fill ? '#1a1a28' : 'transparent', borderRadius: 0.5 }} />;
        })}
      </div>
      <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#333', fontFamily: SANS }}>mysleepytale.com</p>
    </div>
  );
}

function BrandName({ size = 18 }) {
  return (
    <p style={{ margin: 0, fontFamily: SERIF, fontSize: size, color: CREAM, letterSpacing: 0.5 }}>
      My <span style={{ fontStyle: 'italic', color: GOLD_LIGHT }}>Sleepy</span> Tale
    </p>
  );
}

function GoldButton({ children, small = false }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: GOLD, borderRadius: 999, padding: small ? '8px 20px' : '12px 32px', fontFamily: SANS, fontSize: small ? 12 : 14, fontWeight: 700, color: BLACK }}>
      <span style={{ fontSize: small ? 12 : 14 }}>✨</span> {children}
    </div>
  );
}

function CurvedDivider() {
  return (
    <svg viewBox="0 0 800 80" style={{ width: '100%', display: 'block', marginTop: -1 }} preserveAspectRatio="none">
      <path d="M0,0 C200,80 600,80 800,0 L800,80 L0,80 Z" fill={BLACK} />
    </svg>
  );
}

// ━━━ 1. FLYER / POSTER ━━━
function Flyer() {
  return (
    <div style={{ width: 480, height: 680, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 4 }}>
      {/* Navy top */}
      <div style={{ background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`, padding: '48px 40px 0', textAlign: 'center', position: 'relative', flex: '0 0 auto' }}>
        <Stars />
        <Moon size={56} />
        <div style={{ marginTop: 12 }}><BrandName size={20} /></div>
        <h1 style={{ fontFamily: SERIF, fontSize: 34, color: '#fff', fontWeight: 800, lineHeight: 1.2, margin: '20px 0 0' }}>
          Tuck them in with<br />
          <span style={{ color: GOLD }}>stories</span> from <span style={{ color: BLUE }}>home</span>
        </h1>
        <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 14, color: GOLD_LIGHT, margin: '16px 0 24px', opacity: 0.9 }}>
          Bedtime tales from your culture,<br />personalized for your little one.
        </p>
        <CurvedDivider />
      </div>
      {/* Black bottom */}
      <div style={{ background: BLACK, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px 36px', gap: 16 }}>
        <QRCard size={120} />
        <p style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: GOLD, margin: 0, fontStyle: 'italic' }}>Scan. Tap. Bedtime magic.</p>
        <GoldButton>Free to start</GoldButton>
        <div style={{ display: 'flex', gap: 24, fontSize: 12, color: MUTED, fontFamily: SANS }}>
          <span>Ages 0-5</span>
          <span>A new story every night</span>
        </div>
      </div>
    </div>
  );
}

// ━━━ 2. EVENT STANDEE ━━━
function EventStandee() {
  return (
    <div style={{ width: 340, height: 850, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 4 }}>
      {/* Navy top */}
      <div style={{ background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`, padding: '48px 28px 0', textAlign: 'center', position: 'relative' }}>
        <Stars />
        <Moon size={64} />
        <div style={{ marginTop: 12 }}><BrandName size={22} /></div>
        <h1 style={{ fontFamily: SERIF, fontSize: 28, color: '#fff', fontWeight: 800, lineHeight: 1.25, margin: '24px 0 0' }}>
          A bedtime story<br />
          <span style={{ color: GOLD }}>from their roots</span>
        </h1>
        <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 13, color: GOLD_LIGHT, margin: '12px 0 0', opacity: 0.9 }}>
          Hindu · Islamic · Catholic · Filipino · Hispanic<br />Sikh · Buddhist · Jewish · Christian & more
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, margin: '20px 0 6px' }}>
          {[{ n: '146+', l: 'Stories' }, { n: '49', l: 'Series' }, { n: '3', l: 'Languages' }].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: GOLD, fontFamily: SERIF }}>{s.n}</div>
              <div style={{ fontSize: 9, color: MUTED, fontFamily: SANS, textTransform: 'uppercase', letterSpacing: 1.5 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <CurvedDivider />
      </div>
      {/* Black bottom */}
      <div style={{ background: BLACK, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px 40px', gap: 14 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, marginBottom: 8 }}>
          {['🚀 Space', '🔢 Maths', '💪 Courage', '🪷 Beliefs', '🌿 Nature', '🏛️ History', '🔬 Science', '📚 Series'].map(c => (
            <span key={c} style={{ fontSize: 10, padding: '4px 10px', borderRadius: 20, background: '#ffffff0d', color: CREAM, fontFamily: SANS, fontWeight: 600 }}>{c}</span>
          ))}
        </div>
        <QRCard size={140} label="SCAN TO EXPLORE" />
        <p style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: GOLD, margin: 0, fontStyle: 'italic' }}>Scan. Tap. Bedtime magic.</p>
        <GoldButton>Free to start</GoldButton>
        <p style={{ fontSize: 10, color: MUTED, fontFamily: SANS, margin: 0 }}>No downloads · No signup · Ages 0-10</p>
      </div>
    </div>
  );
}

// ━━━ 3. SOCIAL POST (Square) ━━━
function SocialPost() {
  return (
    <div style={{ width: 480, height: 480, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 4 }}>
      {/* Navy top */}
      <div style={{ background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`, padding: '36px 36px 0', textAlign: 'center', position: 'relative' }}>
        <Stars />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Moon size={36} />
          <BrandName size={16} />
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 30, color: '#fff', fontWeight: 800, lineHeight: 1.2, margin: '16px 0 0' }}>
          The story they<br />
          <span style={{ color: GOLD }}>ask for</span> every<br />
          <span style={{ color: BLUE }}>night</span>
        </h1>
        <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 12, color: GOLD_LIGHT, margin: '10px 0 16px', opacity: 0.9 }}>
          146+ bedtime tales from 11 traditions
        </p>
        <CurvedDivider />
      </div>
      {/* Black bottom */}
      <div style={{ background: BLACK, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 36px 28px', gap: 24 }}>
        <div style={{ textAlign: 'center' }}>
          <QRCard size={90} label="SCAN" />
        </div>
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 700, color: GOLD, margin: '0 0 6px', fontStyle: 'italic' }}>Scan. Tap.<br />Bedtime magic.</p>
          <GoldButton small>Free to start</GoldButton>
          <p style={{ fontSize: 9, color: MUTED, fontFamily: SANS, margin: '8px 0 0' }}>Ages 0-5 · No downloads</p>
        </div>
      </div>
    </div>
  );
}

// ━━━ 4. CAR STICKER ━━━
function CarSticker() {
  return (
    <div style={{ width: 540, height: 160, display: 'flex', overflow: 'hidden', borderRadius: 4 }}>
      {/* Navy left */}
      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`, flex: 1, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
        <Stars />
        <Moon size={44} />
        <div style={{ position: 'relative' }}>
          <BrandName size={20} />
          <p style={{ fontFamily: SERIF, fontSize: 13, color: '#fff', fontWeight: 700, margin: '4px 0 0' }}>
            Bedtime stories <span style={{ color: GOLD }}>from their roots</span>
          </p>
          <p style={{ fontFamily: SANS, fontSize: 9, color: MUTED, margin: '4px 0 0' }}>146+ stories · 11 traditions · Free</p>
        </div>
      </div>
      {/* Black right with QR */}
      <div style={{ background: BLACK, width: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 12, borderLeft: `2px solid ${GOLD}30` }}>
        <QRCard size={70} label="" />
        <p style={{ fontSize: 8, color: MUTED, fontFamily: SANS, margin: '4px 0 0' }}>mysleepytale.com</p>
      </div>
    </div>
  );
}

// ━━━ 5. HOUSE SIGN ━━━
function HouseSign() {
  return (
    <div style={{ width: 560, height: 360, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: 4 }}>
      {/* Navy top */}
      <div style={{ background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DARK} 100%)`, padding: '28px 40px 0', display: 'flex', alignItems: 'center', gap: 24, position: 'relative' }}>
        <Stars />
        <div style={{ position: 'relative', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Moon size={40} />
            <BrandName size={18} />
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 28, color: '#fff', fontWeight: 800, lineHeight: 1.2, margin: 0 }}>
            Every child deserves<br />a story <span style={{ color: GOLD }}>from home</span>
          </h1>
          <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 12, color: GOLD_LIGHT, margin: '8px 0 0', opacity: 0.9 }}>
            Free · Personalized · Narrated · 11 traditions
          </p>
        </div>
        <div style={{ position: 'relative', transform: 'translateY(10px)' }}>
          <QRCard size={100} label="SCAN" />
        </div>
      </div>
      <CurvedDivider />
      {/* Black bottom */}
      <div style={{ background: BLACK, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px', gap: 24 }}>
        <p style={{ fontFamily: SERIF, fontSize: 18, fontWeight: 700, color: GOLD, margin: 0, fontStyle: 'italic' }}>Scan & listen tonight.</p>
        <GoldButton small>Free to start</GoldButton>
        <p style={{ fontSize: 10, color: MUTED, fontFamily: SANS, margin: 0 }}>Ages 0-10</p>
      </div>
    </div>
  );
}

// ━━━ 6. TRI-FOLD PAMPHLET ━━━
function Pamphlet() {
  return (
    <div style={{ width: 900, display: 'flex', borderRadius: 4, overflow: 'hidden' }}>
      {/* Panel 1: Cover */}
      <div style={{ width: 300, minHeight: 440, background: `linear-gradient(180deg, ${NAVY} 0%, ${NAVY_DARK} 60%, ${BLACK} 100%)`, padding: '48px 28px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <Stars />
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <Moon size={60} />
          <div style={{ marginTop: 12 }}><BrandName size={20} /></div>
          <h2 style={{ fontFamily: SERIF, fontSize: 22, color: '#fff', fontWeight: 800, lineHeight: 1.25, margin: '20px 0 0' }}>
            Tuck them in with<br />
            <span style={{ color: GOLD }}>stories</span> from <span style={{ color: BLUE }}>home</span>
          </h2>
          <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 11, color: GOLD_LIGHT, margin: '12px 0 0', opacity: 0.9 }}>
            Bedtime tales from your culture,<br />personalized for your child.
          </p>
        </div>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <QRCard size={80} label="SCAN" />
        </div>
      </div>

      {/* Panel 2: Why parents love it */}
      <div style={{ width: 300, minHeight: 440, background: BLACK, padding: '36px 24px', display: 'flex', flexDirection: 'column', gap: 16, borderLeft: `1px solid ${NAVY}40`, borderRight: `1px solid ${NAVY}40` }}>
        <p style={{ fontSize: 10, color: GOLD, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', margin: 0, fontFamily: SANS }}>WHY PARENTS LOVE IT</p>
        {[
          { icon: '🪷', title: 'Cultural Roots', desc: 'Stories from Hindu, Islamic, Catholic, Sikh, Filipino, Hispanic & more traditions' },
          { icon: '💛', title: 'Values That Stick', desc: 'Kindness, courage, gratitude & empathy woven into every tale' },
          { icon: '🎧', title: 'Audio Narration', desc: 'Warm voices read every story. Press play, dim the lights, sleep.' },
          { icon: '✨', title: 'Personalized', desc: "Your child's name appears inside the story" },
          { icon: '🧒', title: 'Learning In Sleep', desc: 'Space, maths, science, history — disguised as bedtime adventures' },
        ].map(b => (
          <div key={b.title} style={{ display: 'flex', gap: 10 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>{b.icon}</span>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: CREAM, margin: 0, fontFamily: SANS }}>{b.title}</p>
              <p style={{ fontSize: 9.5, color: MUTED, margin: '2px 0 0', lineHeight: 1.45, fontFamily: SANS }}>{b.desc}</p>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', gap: 20 }}>
          {[{ n: '146+', l: 'Stories' }, { n: '49', l: 'Series' }, { n: '11', l: 'Traditions' }].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: GOLD, fontFamily: SERIF }}>{s.n}</div>
              <div style={{ fontSize: 8, color: MUTED, fontFamily: SANS, textTransform: 'uppercase', letterSpacing: 1.5 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel 3: Categories + contact */}
      <div style={{ width: 300, minHeight: 440, background: `linear-gradient(180deg, ${BLACK} 0%, ${NAVY_DARK} 100%)`, padding: '36px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 10, color: GOLD, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', margin: '0 0 14px', fontFamily: SANS }}>STORY CATEGORIES</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {['🚀 Space', '🔢 Maths', '💪 Motivation', '🪷 Beliefs', '🌿 Nature', '🏛️ History', '🔬 Science', '🗺️ Adventure', '💛 Kindness', '📚 Series'].map(c => (
              <span key={c} style={{ fontSize: 10, padding: '5px 11px', borderRadius: 20, background: '#ffffff0a', color: CREAM, fontFamily: SANS, fontWeight: 600, border: '1px solid #ffffff10' }}>{c}</span>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: 10, color: GOLD, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', margin: '0 0 10px', fontFamily: SANS }}>HOW IT WORKS</p>
          {['Tell us about your child', 'Pick a story or series', 'Press play & sleep'].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: `${GOLD}20`, color: GOLD, fontSize: 11, fontWeight: 800, display: 'grid', placeItems: 'center', flexShrink: 0, fontFamily: SANS }}>{i + 1}</span>
              <span style={{ fontSize: 11, color: CREAM, fontFamily: SANS }}>{s}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', padding: '16px 0 0', borderTop: '1px solid #ffffff0a' }}>
          <BrandName size={14} />
          <p style={{ fontSize: 10, color: CREAM, margin: '8px 0 2px', fontFamily: SANS }}>📸 @mysleepytale_official</p>
          <p style={{ fontSize: 10, color: MUTED, margin: '0 0 2px', fontFamily: SANS }}>📧 hello@mysleepytale.com</p>
          <p style={{ fontSize: 10, color: MUTED, margin: 0, fontFamily: SANS }}>🌐 mysleepytale.com</p>
          <p style={{ fontSize: 8, color: '#555', marginTop: 8, fontFamily: SANS }}>Made with love in Toronto, Canada 🇨🇦</p>
        </div>
      </div>
    </div>
  );
}

// ━━━ 7. TV / DIGITAL AD ━━━
function TVAd() {
  return (
    <div style={{ width: 640, height: 360, display: 'flex', overflow: 'hidden', borderRadius: 4, position: 'relative' }}>
      {/* Full navy bg */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_DARK} 60%, ${BLACK} 100%)` }} />
      <Stars />
      {/* Bottom curve */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <svg viewBox="0 0 640 60" style={{ width: '100%', display: 'block' }} preserveAspectRatio="none">
          <path d="M0,30 C160,60 480,60 640,30 L640,60 L0,60 Z" fill={BLACK} opacity="0.6" />
        </svg>
      </div>

      {/* Left content */}
      <div style={{ position: 'relative', flex: 1, padding: '40px 20px 40px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Moon size={36} />
          <BrandName size={16} />
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 32, color: '#fff', fontWeight: 800, lineHeight: 1.15, margin: 0 }}>
          Where <span style={{ color: GOLD }}>bedtime</span><br />
          becomes the <span style={{ color: BLUE }}>best time</span>
        </h1>
        <p style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 13, color: GOLD_LIGHT, margin: '12px 0 0', opacity: 0.9 }}>
          146+ bedtime tales from<br />11 cultural traditions
        </p>
        <div style={{ marginTop: 16 }}>
          <GoldButton small>Free to start</GoldButton>
        </div>
      </div>

      {/* Right QR */}
      <div style={{ position: 'relative', width: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <QRCard size={100} label="SCAN" />
        <p style={{ fontFamily: SERIF, fontSize: 12, fontWeight: 700, color: GOLD, margin: '10px 0 0', fontStyle: 'italic', textAlign: 'center' }}>Scan. Tap.<br />Bedtime magic.</p>
      </div>
    </div>
  );
}

const COMPONENTS = {
  flyer: Flyer,
  standee: EventStandee,
  social: SocialPost,
  sticker: CarSticker,
  house: HouseSign,
  pamphlet: Pamphlet,
  tvad: TVAd,
};

export default function Creatives() {
  const [active, setActive] = useState('flyer');
  const ActiveComponent = COMPONENTS[active];

  return (
    <PageTransition className="page-scroll safe-top">
      <div className="px-5 pt-10 pb-40 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <a href="/" className="grid h-8 w-8 place-items-center rounded-full bg-gold text-bg-base shadow-glow transition active:scale-95">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
          </a>
          <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>Marketing Creatives</h1>
        </div>
        <p className="text-xs text-ink-muted mb-6 ml-11">Print-ready designs — screenshot to export</p>

        {/* Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CREATIVES.map(c => (
            <button key={c.id} onClick={() => setActive(c.id)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold ring-1 transition ${
                active === c.id ? 'bg-gold/20 text-gold ring-gold/30' : 'bg-white/5 text-ink-muted ring-white/5 hover:text-ink'
              }`}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Preview */}
        <div className="flex justify-center overflow-x-auto">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.2 }}
              style={{ boxShadow: '0 8px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)' }}>
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Export instructions */}
        <div className="mt-8 rounded-2xl bg-white/5 ring-1 ring-white/5 p-5 max-w-lg mx-auto">
          <p className="text-xs font-bold text-ink mb-2">How to export</p>
          <ol className="text-[11px] text-ink-muted space-y-1 list-decimal list-inside">
            <li>Select a creative above</li>
            <li>Screenshot it (Cmd+Shift+4 on Mac, or use browser DevTools)</li>
            <li>Replace QR placeholder with a real QR from any QR generator</li>
            <li>Print or post on social media</li>
          </ol>
        </div>
      </div>
    </PageTransition>
  );
}
