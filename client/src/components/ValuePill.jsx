import { valueMeta } from '../utils/constants.js';

export default function ValuePill({ value, active, onClick, size = 'md' }) {
  const meta = valueMeta(value);
  const padding = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn-pill ${padding} font-bold transition ${
        active
          ? 'bg-gold text-bg-base shadow-glow'
          : 'bg-bg-elevated text-ink hover:bg-bg-card'
      }`}
      style={
        active
          ? undefined
          : { boxShadow: `inset 0 0 0 1px ${meta.color}33` }
      }
    >
      <span>{meta.emoji}</span>
      <span>{meta.label}</span>
    </button>
  );
}
