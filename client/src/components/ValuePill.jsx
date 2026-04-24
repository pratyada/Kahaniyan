import { useState, useEffect } from 'react';
import { valueMeta } from '../utils/constants.js';

// Fetch value images from Firestore once, cache in module scope
let _cachedImages = null;
let _fetchPromise = null;

function useValueImages() {
  const [images, setImages] = useState(_cachedImages || {});

  useEffect(() => {
    if (_cachedImages) { setImages(_cachedImages); return; }
    if (!_fetchPromise) {
      _fetchPromise = (async () => {
        try {
          const { db } = await import('../lib/firebase.js');
          if (!db) return {};
          const { doc, getDoc } = await import('firebase/firestore');
          const snap = await getDoc(doc(db, 'config', 'valueImages'));
          _cachedImages = snap.exists() ? snap.data() : {};
          return _cachedImages;
        } catch { return {}; }
      })();
    }
    _fetchPromise.then((imgs) => setImages(imgs));
  }, []);

  return images;
}

const VALUE_BG = {
  kindness:  'linear-gradient(135deg, #7c3f00, #f0a500)',
  courage:   'linear-gradient(135deg, #7c2d12, #ff7a59)',
  honesty:   'linear-gradient(135deg, #064e3b, #7ad9a1)',
  patience:  'linear-gradient(135deg, #1e1b4b, #9cb3ff)',
  gratitude: 'linear-gradient(135deg, #4a1942, #e8b4ff)',
  sharing:   'linear-gradient(135deg, #78350f, #ffd166)',
  respect:   'linear-gradient(135deg, #064e3b, #9ad7c4)',
  bravery:   'linear-gradient(135deg, #78350f, #ffb733)',
};

export default function ValuePill({ value, active, onClick }) {
  const meta = valueMeta(value);
  const images = useValueImages();
  const imgSrc = images[value];
  const bg = VALUE_BG[value] || `linear-gradient(135deg, ${meta.color}44, ${meta.color})`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-24 h-24 shrink-0 flex-col items-center justify-end overflow-hidden rounded-2xl transition active:scale-95 ${
        active ? 'ring-2 ring-gold shadow-glow' : 'ring-1 ring-white/10'
      }`}
    >
      {/* Background: DALL-E image or gradient fallback */}
      {imgSrc ? (
        <img src={imgSrc} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: active ? 1 : 0.7 }} loading="lazy" />
      ) : (
        <div className="absolute inset-0" style={{ background: bg, opacity: active ? 1 : 0.6 }} />
      )}
      {/* Dark gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      {/* Label */}
      <span className="relative mb-2 font-bold text-white text-[11px]"
        style={{ fontFamily: 'Nunito, sans-serif', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
        {meta.label}
      </span>
      {/* Active checkmark */}
      {active && (
        <div className="absolute top-1.5 right-1.5 grid h-5 w-5 place-items-center rounded-full bg-gold">
          <span className="text-[9px] text-bg-base font-bold">✓</span>
        </div>
      )}
    </button>
  );
}
