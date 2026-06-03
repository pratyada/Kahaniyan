// Marketing Creatives — preview & screenshot print-ready designs.
// mysleepytale.com/creatives

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';

const CREATIVES = [
  { id: 'pamphlet', label: 'Pamphlet', icon: '📄' },
  { id: 'standee', label: 'Event Standee', icon: '🪧' },
  { id: 'social', label: 'Social Post', icon: '📱' },
  { id: 'sticker', label: 'Car Sticker', icon: '🚗' },
  { id: 'house', label: 'House Standee', icon: '🏠' },
];

function QRPlaceholder({ size = 120, dark = false }) {
  return (
    <div style={{ width: size, height: size, background: dark ? '#f5f0e8' : '#fff', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* QR grid pattern */}
      <div style={{ position: 'absolute', inset: 8, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(7, 1fr)', gap: 2 }}>
        {Array.from({ length: 49 }).map((_, i) => {
          const row = Math.floor(i / 7);
          const col = i % 7;
          const isCorner = (row < 3 && col < 3) || (row < 3 && col > 3) || (row > 3 && col < 3);
          const fill = isCorner || Math.random() > 0.5;
          return <div key={i} style={{ background: fill ? (dark ? '#0a0a0f' : '#1a1a28') : 'transparent', borderRadius: 1 }} />;
        })}
      </div>
      <span style={{ position: 'relative', zIndex: 1, fontSize: 9, fontWeight: 800, color: dark ? '#0a0a0f' : '#1a1a28', letterSpacing: 2, textTransform: 'uppercase', background: dark ? '#f5f0e8' : '#fff', padding: '2px 6px' }}>QR CODE</span>
    </div>
  );
}

function Stars({ count = 5 }) {
  return <span style={{ color: '#f0a500', fontSize: 11, letterSpacing: 1 }}>{'★'.repeat(count)}</span>;
}

// ━━━ 1. PAMPHLET ━━━
function Pamphlet() {
  return (
    <div style={{ width: 900, display: 'flex', fontFamily: "'Fraunces', Georgia, serif" }}>
      {/* Front Panel */}
      <div style={{ width: 300, minHeight: 420, background: 'linear-gradient(160deg, #0a0a0f 0%, #1a1a28 50%, #0f0f1a 100%)', padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', borderRadius: '16px 0 0 16px' }}>
        <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, #f0a50020 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -40, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, #9f7aea10 0%, transparent 70%)' }} />
        <div>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🌙</div>
          <h1 style={{ fontSize: 28, color: '#f0a500', lineHeight: 1.2, margin: 0, fontWeight: 800 }}>My Sleepy Tale</h1>
          <div style={{ width: 40, height: 3, background: '#f0a500', borderRadius: 2, margin: '16px 0' }} />
          <p style={{ fontSize: 15, color: '#f5f0e8', lineHeight: 1.5, margin: 0, fontFamily: 'system-ui, sans-serif' }}>Bedtime Stories That Teach Roots & Values</p>
          <p style={{ fontSize: 11, color: '#6e6a63', marginTop: 12, fontFamily: 'system-ui, sans-serif' }}>A bedtime story web space for families who want their children to learn about their culture.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <QRPlaceholder size={70} />
          <div>
            <p style={{ fontSize: 10, color: '#f0a500', margin: 0, fontFamily: 'system-ui, sans-serif', fontWeight: 700 }}>SCAN TO EXPLORE</p>
            <p style={{ fontSize: 9, color: '#6e6a63', margin: 0, fontFamily: 'system-ui, sans-serif' }}>mysleepytale.com</p>
          </div>
        </div>
      </div>

      {/* Inside Panel 1 */}
      <div style={{ width: 300, minHeight: 420, background: '#12121c', padding: 32, display: 'flex', flexDirection: 'column', gap: 20, borderLeft: '1px solid #1a1a2840' }}>
        <div style={{ textAlign: 'center', paddingBottom: 16, borderBottom: '1px solid #ffffff08' }}>
          <p style={{ fontSize: 11, color: '#f0a500', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: 0, fontFamily: 'system-ui, sans-serif' }}>BY THE NUMBERS</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16 }}>
            {[{ n: '146+', l: 'Stories' }, { n: '49', l: 'Series' }, { n: '11', l: 'Traditions' }].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#f0a500' }}>{s.n}</div>
                <div style={{ fontSize: 9, color: '#6e6a63', fontFamily: 'system-ui, sans-serif' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p style={{ fontSize: 11, color: '#f0a500', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 12px', fontFamily: 'system-ui, sans-serif' }}>WHY PARENTS LOVE IT</p>
          {[
            { icon: '🪷', title: 'Cultural Roots', desc: 'Stories from Hindu, Islamic, Catholic, Sikh, Filipino, Hispanic traditions & more' },
            { icon: '💛', title: 'Values That Stick', desc: 'Every story teaches kindness, courage, gratitude, or empathy' },
            { icon: '🎧', title: 'Audio Narration', desc: 'Professional voices. Press play, dim the lights, sleep.' },
            { icon: '✨', title: 'Personalized', desc: "Your child's name appears inside every story" },
          ].map(b => (
            <div key={b.title} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{b.icon}</span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#f5f0e8', margin: 0, fontFamily: 'system-ui, sans-serif' }}>{b.title}</p>
                <p style={{ fontSize: 9, color: '#6e6a63', margin: '2px 0 0', lineHeight: 1.4, fontFamily: 'system-ui, sans-serif' }}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Inside Panel 2 / Back */}
      <div style={{ width: 300, minHeight: 420, background: 'linear-gradient(160deg, #12121c 0%, #0a0a0f 100%)', padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '0 16px 16px 0', borderLeft: '1px solid #1a1a2840' }}>
        <div>
          <p style={{ fontSize: 11, color: '#f0a500', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', margin: '0 0 14px', fontFamily: 'system-ui, sans-serif' }}>STORY CATEGORIES</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[
              { icon: '🚀', label: 'Space', color: '#4299e1' },
              { icon: '🔢', label: 'Maths', color: '#48bb78' },
              { icon: '💪', label: 'Motivation', color: '#f0a500' },
              { icon: '🪷', label: 'Beliefs', color: '#9f7aea' },
              { icon: '🌿', label: 'Nature', color: '#f472b6' },
              { icon: '🏛️', label: 'History', color: '#ed8936' },
              { icon: '🔬', label: 'Science', color: '#f3727f' },
              { icon: '🗺️', label: 'Adventure', color: '#63b3ed' },
              { icon: '💛', label: 'Kindness', color: '#fbd38d' },
              { icon: '📚', label: 'Series', color: '#b794f4' },
            ].map(c => (
              <span key={c.label} style={{ fontSize: 9, padding: '4px 10px', borderRadius: 20, fontWeight: 700, background: c.color + '18', color: c.color, fontFamily: 'system-ui, sans-serif' }}>
                {c.icon} {c.label}
              </span>
            ))}
          </div>
        </div>

        <div style={{ padding: '16px 0', borderTop: '1px solid #ffffff08', borderBottom: '1px solid #ffffff08' }}>
          <p style={{ fontSize: 11, color: '#f5f0e8', fontWeight: 700, margin: '0 0 4px', fontFamily: 'system-ui, sans-serif' }}>How It Works</p>
          {['Tell us about your child', 'Pick a story', 'Press play & sleep'].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#f0a50020', color: '#f0a500', fontSize: 10, fontWeight: 800, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: 10, color: '#a8a39a', fontFamily: 'system-ui, sans-serif' }}>{s}</span>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 10, color: '#f5f0e8', margin: '0 0 4px', fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>📸 @mysleepytale_official</p>
          <p style={{ fontSize: 10, color: '#6e6a63', margin: '0 0 2px', fontFamily: 'system-ui, sans-serif' }}>📧 hello@mysleepytale.com</p>
          <p style={{ fontSize: 10, color: '#6e6a63', margin: 0, fontFamily: 'system-ui, sans-serif' }}>🌐 mysleepytale.com</p>
          <p style={{ fontSize: 8, color: '#4a4a5a', marginTop: 8, fontFamily: 'system-ui, sans-serif' }}>Made with love in Toronto, Canada 🇨🇦</p>
        </div>
      </div>
    </div>
  );
}

// ━━━ 2. EVENT STANDEE ━━━
function EventStandee() {
  return (
    <div style={{ width: 320, height: 800, background: 'linear-gradient(180deg, #0a0a0f 0%, #12121c 40%, #0f0f1a 70%, #0a0a0f 100%)', borderRadius: 20, padding: '48px 32px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', fontFamily: "'Fraunces', Georgia, serif" }}>
      {/* Decorative circles */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, #f0a50012 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', bottom: 200, left: -100, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, #9f7aea08 0%, transparent 70%)' }} />

      {/* Top */}
      <div style={{ textAlign: 'center', position: 'relative' }}>
        <div style={{ fontSize: 56, marginBottom: 8 }}>🌙</div>
        <h1 style={{ fontSize: 32, color: '#f0a500', margin: 0, fontWeight: 800, lineHeight: 1.1 }}>My Sleepy<br />Tale</h1>
        <div style={{ width: 50, height: 3, background: '#f0a500', borderRadius: 2, margin: '16px auto' }} />
      </div>

      {/* Middle */}
      <div style={{ textAlign: 'center', position: 'relative' }}>
        <p style={{ fontSize: 17, color: '#f5f0e8', fontWeight: 600, lineHeight: 1.4, margin: 0, fontFamily: 'system-ui, sans-serif' }}>
          Bedtime Stories from<br />
          <span style={{ color: '#f0a500', fontSize: 20, fontWeight: 800 }}>11 Cultural Traditions</span>
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          {['🕉️ Hindu', '☪️ Islamic', '✝️ Catholic', '🇵🇭 Filipino', '💃 Hispanic', '☸️ Sikh', '☸️ Buddhist', '✡️ Jewish', '🌍 Universal'].map(t => (
            <span key={t} style={{ fontSize: 10, padding: '5px 10px', borderRadius: 20, background: '#ffffff08', color: '#a8a39a', fontFamily: 'system-ui, sans-serif', fontWeight: 600 }}>{t}</span>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24, padding: '16px 0', borderTop: '1px solid #ffffff08', borderBottom: '1px solid #ffffff08' }}>
          {[{ n: '146+', l: 'Stories' }, { n: '49', l: 'Series' }, { n: '3', l: 'Languages' }].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#f0a500' }}>{s.n}</div>
              <div style={{ fontSize: 8, color: '#6e6a63', fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', letterSpacing: 1 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ textAlign: 'center', position: 'relative' }}>
        <QRPlaceholder size={130} />
        <p style={{ fontSize: 14, color: '#f0a500', fontWeight: 700, marginTop: 12, fontFamily: 'system-ui, sans-serif' }}>Scan to explore free stories</p>
        <p style={{ fontSize: 12, color: '#6e6a63', margin: '4px 0 0', fontFamily: 'system-ui, sans-serif' }}>mysleepytale.com</p>
        <p style={{ fontSize: 9, color: '#4a4a5a', margin: '8px 0 0', fontFamily: 'system-ui, sans-serif' }}>Free to use · No downloads · No signup</p>
      </div>
    </div>
  );
}

// ━━━ 3. SOCIAL POST ━━━
function SocialPost() {
  return (
    <div style={{ width: 480, height: 480, background: 'linear-gradient(145deg, #0a0a0f 0%, #12121c 50%, #1a1028 100%)', borderRadius: 24, padding: 40, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', fontFamily: "'Fraunces', Georgia, serif" }}>
      {/* Glow effects */}
      <div style={{ position: 'absolute', top: -60, right: -60, width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, #f0a50018 0%, transparent 60%)' }} />
      <div style={{ position: 'absolute', bottom: -40, left: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, #9f7aea10 0%, transparent 60%)' }} />
      {/* Stars */}
      {[{ t: 30, l: 60, s: 3 }, { t: 50, l: 380, s: 4 }, { t: 120, l: 420, s: 2.5 }, { t: 200, l: 30, s: 2 }, { t: 80, l: 200, s: 3 }].map((star, i) => (
        <div key={i} style={{ position: 'absolute', top: star.t, left: star.l, width: star.s, height: star.s, borderRadius: '50%', background: '#f5f0e8', opacity: 0.4 }} />
      ))}

      {/* Top */}
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 32 }}>🌙</span>
          <span style={{ fontSize: 13, color: '#f0a500', fontWeight: 700, fontFamily: 'system-ui, sans-serif' }}>MY SLEEPY TALE</span>
        </div>
        <h1 style={{ fontSize: 30, color: '#f5f0e8', margin: 0, lineHeight: 1.25, fontWeight: 800 }}>
          Make Your Baby<br />
          <span style={{ color: '#f0a500' }}>Sleep</span> with<br />
          Beautiful Stories
        </h1>
      </div>

      {/* Middle */}
      <div style={{ position: 'relative' }}>
        <p style={{ fontSize: 14, color: '#a8a39a', margin: '0 0 16px', fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>
          Learning through creative cultural stories.<br />
          146+ stories from 11 traditions.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {[
            { icon: '🚀', label: 'Space', color: '#4299e1' },
            { icon: '🔢', label: 'Maths', color: '#48bb78' },
            { icon: '💪', label: 'Courage', color: '#f0a500' },
            { icon: '🪷', label: 'Beliefs', color: '#9f7aea' },
            { icon: '🌿', label: 'Nature', color: '#f472b6' },
            { icon: '🏛️', label: 'History', color: '#ed8936' },
          ].map(c => (
            <span key={c.label} style={{ fontSize: 10, padding: '4px 10px', borderRadius: 16, fontWeight: 700, background: c.color + '18', color: c.color, fontFamily: 'system-ui, sans-serif' }}>
              {c.icon} {c.label}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div>
          <p style={{ fontSize: 16, color: '#f0a500', fontWeight: 800, margin: 0, fontFamily: 'system-ui, sans-serif' }}>Free to explore</p>
          <p style={{ fontSize: 11, color: '#6e6a63', margin: '2px 0 0', fontFamily: 'system-ui, sans-serif' }}>mysleepytale.com</p>
        </div>
        <QRPlaceholder size={80} />
      </div>
    </div>
  );
}

// ━━━ 4. CAR STICKER ━━━
function CarSticker() {
  return (
    <div style={{ width: 520, height: 140, background: 'linear-gradient(135deg, #0a0a0f 0%, #12121c 60%, #1a1028 100%)', borderRadius: 16, padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', fontFamily: "'Fraunces', Georgia, serif", border: '2px solid #f0a50030' }}>
      {/* Glow */}
      <div style={{ position: 'absolute', top: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'radial-gradient(circle, #f0a50010 0%, transparent 70%)' }} />

      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
        <span style={{ fontSize: 40 }}>🌙</span>
        <div>
          <h1 style={{ fontSize: 22, color: '#f0a500', margin: 0, fontWeight: 800 }}>My Sleepy Tale</h1>
          <p style={{ fontSize: 12, color: '#a8a39a', margin: '2px 0 0', fontFamily: 'system-ui, sans-serif' }}>Bedtime Stories for Kids</p>
          <p style={{ fontSize: 9, color: '#6e6a63', margin: '4px 0 0', fontFamily: 'system-ui, sans-serif' }}>146+ stories · 11 traditions · Free</p>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
        <div style={{ width: 1, height: 60, background: '#ffffff10' }} />
        <div style={{ textAlign: 'center' }}>
          <QRPlaceholder size={72} />
          <p style={{ fontSize: 7, color: '#6e6a63', margin: '4px 0 0', fontFamily: 'system-ui, sans-serif' }}>mysleepytale.com</p>
        </div>
      </div>
    </div>
  );
}

// ━━━ 5. HOUSE STANDEE ━━━
function HouseStandee() {
  return (
    <div style={{ width: 560, height: 340, background: 'linear-gradient(160deg, #0a0a0f 0%, #12121c 50%, #0f0f1a 100%)', borderRadius: 24, padding: '40px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', overflow: 'hidden', fontFamily: "'Fraunces', Georgia, serif", border: '3px solid #f0a50020' }}>
      {/* Decorative */}
      <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, #f0a50010 0%, transparent 60%)' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, #9f7aea08 0%, transparent 60%)' }} />
      {/* Stars */}
      {[{ t: 20, l: 40, s: 3 }, { t: 30, l: 300, s: 4 }, { t: 60, l: 480, s: 2.5 }, { t: 280, l: 500, s: 3 }].map((star, i) => (
        <div key={i} style={{ position: 'absolute', top: star.t, left: star.l, width: star.s, height: star.s, borderRadius: '50%', background: '#f5f0e8', opacity: 0.3 }} />
      ))}

      {/* Left content */}
      <div style={{ position: 'relative', maxWidth: 320 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 36 }}>🌙</span>
          <span style={{ fontSize: 12, color: '#f0a500', fontWeight: 700, letterSpacing: 2, fontFamily: 'system-ui, sans-serif' }}>MY SLEEPY TALE</span>
        </div>
        <h1 style={{ fontSize: 28, color: '#f5f0e8', margin: 0, lineHeight: 1.2, fontWeight: 800 }}>
          Free Bedtime<br />
          Stories for<br />
          <span style={{ color: '#f0a500' }}>Your Kids</span>
        </h1>
        <p style={{ fontSize: 12, color: '#a8a39a', margin: '12px 0 0', fontFamily: 'system-ui, sans-serif', lineHeight: 1.5 }}>
          146+ stories from 11 cultural traditions.<br />
          Personalized. Narrated. Completely free.
        </p>
      </div>

      {/* Right QR */}
      <div style={{ textAlign: 'center', position: 'relative' }}>
        <QRPlaceholder size={140} />
        <p style={{ fontSize: 14, color: '#f0a500', fontWeight: 700, marginTop: 10, fontFamily: 'system-ui, sans-serif' }}>Scan & Listen<br />Tonight</p>
        <p style={{ fontSize: 10, color: '#6e6a63', margin: '4px 0 0', fontFamily: 'system-ui, sans-serif' }}>mysleepytale.com</p>
      </div>
    </div>
  );
}

const COMPONENTS = {
  pamphlet: Pamphlet,
  standee: EventStandee,
  social: SocialPost,
  sticker: CarSticker,
  house: HouseStandee,
};

export default function Creatives() {
  const [active, setActive] = useState('pamphlet');
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
        <p className="text-xs text-ink-muted mb-6 ml-11">Preview & screenshot print-ready designs</p>

        {/* Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {CREATIVES.map(c => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`shrink-0 rounded-xl px-4 py-2.5 text-xs font-bold ring-1 transition ${
                active === c.id
                  ? 'bg-gold/20 text-gold ring-gold/30'
                  : 'bg-white/5 text-ink-muted ring-white/5 hover:text-ink'
              }`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Creative preview */}
        <div className="flex justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25 }}
              style={{ boxShadow: '0 8px 60px rgba(240, 165, 0, 0.08), 0 0 0 1px rgba(255,255,255,0.05)' }}
              className="rounded-2xl overflow-hidden"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Instructions */}
        <div className="mt-8 rounded-2xl bg-white/5 ring-1 ring-white/5 p-5 max-w-lg mx-auto">
          <p className="text-xs font-bold text-ink mb-2">How to export</p>
          <ol className="text-[11px] text-ink-muted space-y-1 list-decimal list-inside">
            <li>Select a creative above</li>
            <li>Take a screenshot (Cmd+Shift+4 on Mac)</li>
            <li>Replace "QR CODE" placeholder with real QR from any QR generator</li>
            <li>Send to print or post on social media</li>
          </ol>
        </div>
      </div>
    </PageTransition>
  );
}
