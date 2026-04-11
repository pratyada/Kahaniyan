export default function VoiceAvatar({ narrator, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-2 rounded-2xl p-2 transition ${
        active ? 'scale-105' : 'opacity-70 hover:opacity-100'
      }`}
    >
      <div
        className={`grid h-16 w-16 place-items-center rounded-full text-2xl transition ${
          active
            ? 'bg-gold text-bg-base shadow-glow'
            : 'bg-bg-elevated text-ink ring-1 ring-white/10'
        }`}
      >
        {narrator.emoji}
      </div>
      <span className={`text-xs font-bold ${active ? 'text-gold' : 'text-ink-muted'}`}>
        {narrator.label}
      </span>
    </button>
  );
}
