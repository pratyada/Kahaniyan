// V2 Build — kid register (playful). Slice-1 preview of the entry screen;
// the full record → safety → animate flow is the next build.
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';

const PICKS = [
  { icon: '🚀', g: 'linear-gradient(135deg,#5AC8FA,#2D6CDF)' },
  { icon: '🦄', g: 'linear-gradient(135deg,#FF9FB2,#C44569)' },
  { icon: '🌳', g: 'linear-gradient(135deg,#7BD88F,#2D8C73)' },
  { icon: '🏰', g: 'linear-gradient(135deg,#F6C453,#C4853A)' },
];

export default function Build() {
  const { profile } = useFamilyProfile();
  const name = profile?.childName && profile.childName !== 'little one' ? profile.childName : 'friend';

  return (
    <div className="pb-28">
      <header className="px-5 pt-7 flex items-center justify-between">
        <div>
          <p className="ui-label text-ink-dim">Let&apos;s make something</p>
          <h1 className="display-title text-2xl mt-1 text-ink">{name}&apos;s Studio</h1>
        </div>
        <span className="rounded-pill bg-gold/15 px-3 py-1.5 text-sm font-bold text-gold ring-1 ring-gold/25">
          ✨ 3 left today
        </span>
      </header>

      <section className="px-5 mt-6">
        <h2 className="ui-title text-sm mb-3 text-ink">1 · Pick a picture</h2>
        <div className="grid grid-cols-2 gap-3">
          {PICKS.map((p, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl grid place-items-center text-5xl ring-1 ring-white/10 active:scale-95 transition"
              style={{ background: p.g }}
            >
              {p.icon}
            </div>
          ))}
        </div>
        <button className="mt-3 w-full rounded-2xl border-2 border-dashed border-white/15 py-3 text-sm font-bold text-ink-muted active:scale-[0.99] transition">
          📷 Upload your own photo
        </button>
      </section>

      <section className="px-5 mt-8 grid place-items-center">
        <h2 className="ui-title text-sm mb-4 text-ink self-start">2 · Tell your story</h2>
        <div
          className="grid place-items-center rounded-full"
          style={{
            width: 150, height: 150,
            background: 'radial-gradient(circle at 50% 40%, #F6C453 0%, #C4853A 70%)',
            boxShadow: '0 0 0 10px rgba(246,196,83,0.15), 0 0 0 22px rgba(246,196,83,0.08), var(--shadow-glow)',
          }}
        >
          <span className="text-6xl">🎙️</span>
        </div>
        <p className="text-sm text-ink-muted mt-4 text-center">Tap the mic and tell me your story!</p>
      </section>

      <p className="text-center text-[11px] text-ink-dim mt-8 px-8">
        Next build: recording, the Guardian Owl safety check, and watching your picture come alive. 🦉
      </p>
    </div>
  );
}
