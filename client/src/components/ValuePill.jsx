import { valueMeta } from '../utils/constants.js';

// Visual card-style value selector
const VALUE_VISUALS = {
  kindness:  { bg: 'linear-gradient(135deg, #7c3f00, #f0a500)', icon: '🤲' },
  courage:   { bg: 'linear-gradient(135deg, #7c2d12, #ff7a59)', icon: '🦁' },
  honesty:   { bg: 'linear-gradient(135deg, #064e3b, #7ad9a1)', icon: '🌿' },
  patience:  { bg: 'linear-gradient(135deg, #1e1b4b, #9cb3ff)', icon: '🌱' },
  gratitude: { bg: 'linear-gradient(135deg, #4a1942, #e8b4ff)', icon: '🙏' },
  sharing:   { bg: 'linear-gradient(135deg, #78350f, #ffd166)', icon: '🍪' },
  respect:   { bg: 'linear-gradient(135deg, #064e3b, #9ad7c4)', icon: '🌳' },
  bravery:   { bg: 'linear-gradient(135deg, #78350f, #ffb733)', icon: '⭐' },
};

export default function ValuePill({ value, active, onClick, size = 'md' }) {
  const meta = valueMeta(value);
  const vis = VALUE_VISUALS[value] || { bg: `linear-gradient(135deg, ${meta.color}44, ${meta.color})`, icon: meta.emoji };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex shrink-0 flex-col items-center justify-center overflow-hidden rounded-2xl transition active:scale-95 ${
        size === 'sm' ? 'w-20 h-20' : 'w-24 h-24'
      } ${active ? 'ring-2 ring-gold shadow-glow' : 'ring-1 ring-white/10'}`}
    >
      <div className="absolute inset-0" style={{ background: vis.bg, opacity: active ? 1 : 0.6 }} />
      <div className="absolute inset-0 bg-black/10" />
      <span className={`relative ${size === 'sm' ? 'text-2xl' : 'text-3xl'} mb-1`}>{vis.icon}</span>
      <span className={`relative font-bold text-white ${size === 'sm' ? 'text-[9px]' : 'text-[10px]'}`}
        style={{ fontFamily: 'Nunito, sans-serif', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
        {meta.label}
      </span>
      {active && (
        <div className="absolute top-1.5 right-1.5 grid h-4 w-4 place-items-center rounded-full bg-gold">
          <span className="text-[8px] text-bg-base font-bold">✓</span>
        </div>
      )}
    </button>
  );
}
