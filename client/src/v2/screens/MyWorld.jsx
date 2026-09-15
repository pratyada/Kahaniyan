// V2 My World — the child's PRIVATE growing world (family-only, no public feed).
// Slice-1 preview of the empty-world state; the constellation map + gallery is the next build.
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';

export default function MyWorld() {
  const { profile } = useFamilyProfile();
  const name = profile?.childName && profile.childName !== 'little one' ? profile.childName : 'your';

  return (
    <div className="pb-28">
      <header className="px-5 pt-7">
        <p className="ui-label text-ink-dim">🔒 Private — family only</p>
        <h1 className="display-title text-2xl mt-1 text-ink">{name === 'your' ? 'Your World' : `${name}'s World`}</h1>
      </header>

      {/* Empty constellation */}
      <section className="px-5 mt-6">
        <div
          className="relative rounded-2xl overflow-hidden ring-1 ring-white/8"
          style={{ height: 300, background: 'radial-gradient(120% 90% at 50% 10%, #1A1040 0%, #0D1B2A 60%, #070A19 100%)' }}
        >
          {/* faint ghost stars */}
          {[
            [20, 30], [70, 22], [45, 55], [82, 62], [30, 75], [60, 80], [15, 60],
          ].map(([x, y], i) => (
            <span
              key={i}
              className="absolute animate-twinkle"
              style={{ left: `${x}%`, top: `${y}%`, fontSize: 12, opacity: 0.35 }}
            >
              ✦
            </span>
          ))}
          <div className="absolute inset-0 grid place-items-center text-center px-8">
            <div>
              <div className="text-5xl mb-3">🌟</div>
              <p className="display-title text-lg text-white">Your first star awaits</p>
              <p className="text-[13px] text-white/70 mt-1">
                Every story you make lights up a new star. Your sky grows a little every night.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => (window.location.href = '/v2/build')}
          className="mt-5 w-full rounded-pill bg-gold px-6 py-3.5 text-sm font-bold text-bg-base shadow-glow active:scale-95 transition"
        >
          🎨 Make my first story
        </button>

        <p className="text-center text-[11px] text-ink-dim mt-6 px-6">
          Private — family only, no public feed. Share with Grandma by invite. Recurring characters &amp; the growing world-map arrive in the next build.
        </p>
      </section>
    </div>
  );
}
