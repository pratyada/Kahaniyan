// V2 My World — the child's PRIVATE growing world (family-only, no public feed).
// Night-sky base. Empty-world preview; constellation map + gallery is the next build.
import { useNavigate } from 'react-router-dom';
import { Lock, Star, Wand2, Heart } from 'lucide-react';
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';
import { GOLD } from '../ui.js';

export default function MyWorld() {
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const name = profile?.childName && profile.childName !== 'little one' ? profile.childName : null;

  return (
    <div className="px-5 lg:px-8 pt-7 lg:pt-10">
      <header>
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A6B8A]">
          <Lock size={12} /> Private — family only
        </p>
        <h1 className="font-display text-[26px] lg:text-3xl mt-1 text-[#F7F1E8]">{name ? `${name}'s World` : 'Your World'}</h1>
      </header>

      <section className="mt-6 max-w-[560px]">
        <div className="relative rounded-3xl overflow-hidden ring-1 ring-white/10" style={{ height: 320, background: 'radial-gradient(120% 90% at 50% 8%, #1F1450 0%, #0D1B2A 58%, #070A19 100%)' }}>
          {[[18, 26], [72, 20], [46, 52], [83, 60], [28, 74], [62, 80], [13, 58], [90, 38]].map(([x, y], i) => (
            <span key={i} className="absolute animate-twinkle" style={{ left: `${x}%`, top: `${y}%` }}>
              <Star size={11} className="text-white/40" fill="currentColor" />
            </span>
          ))}
          <div className="absolute inset-0 grid place-items-center text-center px-10">
            <div>
              <Star size={44} strokeWidth={1.5} style={{ color: GOLD }} fill={GOLD} className="mx-auto mb-4 opacity-90" />
              <p className="font-display text-xl text-white">Your first star awaits</p>
              <p className="text-[13px] text-white/65 mt-1.5 leading-relaxed">Every story you make lights up a new star. Your sky grows a little every night.</p>
            </div>
          </div>
        </div>

        <button onClick={() => navigate('/v2/build')} className="mt-5 w-full flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-[#0D1B2A] active:scale-95 transition" style={{ background: GOLD, boxShadow: '0 10px 30px rgba(246,196,83,0.28)' }}>
          <Wand2 size={17} strokeWidth={2.2} /> Make my first story
        </button>

        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[#7A6B8A] mt-6 leading-relaxed">
          <Heart size={12} /> Family only — share with Grandma by invite. Growing world-map &amp; recurring characters arrive next.
        </p>
      </section>
    </div>
  );
}
