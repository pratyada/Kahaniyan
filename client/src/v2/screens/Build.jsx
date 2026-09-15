// V2 Build — kid register (playful) on the night-sky base. Uses real Higgsfield
// images as the "pick a picture" options. Full record→animate flow is the next build.
import { useMemo } from 'react';
import { Sparkles, Camera, Mic, Wand2 } from 'lucide-react';
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';
import { useWisdomData } from '../../hooks/useWisdomData.js';
import { GOLD } from '../ui.js';

const FALLBACKS = [
  'linear-gradient(135deg,#5AC8FA,#2D6CDF)',
  'linear-gradient(135deg,#FF9FB2,#C44569)',
  'linear-gradient(135deg,#7BD88F,#2D8C73)',
  'linear-gradient(135deg,#F6C453,#C4853A)',
];

export default function Build() {
  const { profile } = useFamilyProfile();
  const { wisdomImageUrls } = useWisdomData();
  const name = profile?.childName && profile.childName !== 'little one' ? profile.childName : 'friend';
  const pics = useMemo(() => Object.values(wisdomImageUrls || {}).filter(Boolean).slice(0, 4), [wisdomImageUrls]);

  return (
    <div className="px-5 lg:px-8 pt-7 lg:pt-10">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A6B8A]">Let&apos;s make something</p>
          <h1 className="font-display text-[26px] lg:text-3xl mt-1 text-[#F7F1E8]">{name}&apos;s Studio</h1>
        </div>
        <span className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-bold shrink-0" style={{ color: GOLD, background: 'rgba(246,196,83,0.10)', border: '1px solid rgba(246,196,83,0.22)' }}>
          <Sparkles size={14} strokeWidth={2.2} /> 3 left today
        </span>
      </header>

      <section className="mt-7 max-w-[520px]">
        <h2 className="text-[15px] font-bold text-[#F7F1E8] mb-3.5">1 · Pick a picture</h2>
        <div className="grid grid-cols-2 gap-3.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden ring-1 ring-white/10 relative active:scale-95 transition" style={{ background: FALLBACKS[i] }}>
              {pics[i] ? (
                <img src={pics[i]} alt="" loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <span className="absolute inset-0 grid place-items-center"><Sparkles size={30} className="text-white/70" /></span>
              )}
            </div>
          ))}
        </div>
        <button className="mt-3.5 w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/15 py-3.5 text-sm font-bold text-[#B8AAC8] hover:border-white/25 active:scale-[0.99] transition">
          <Camera size={17} /> Upload your own photo
        </button>
      </section>

      <section className="mt-9 grid place-items-center">
        <h2 className="text-[15px] font-bold text-[#F7F1E8] self-start mb-5 max-w-[520px] w-full">2 · Tell your story</h2>
        <div className="grid place-items-center rounded-full" style={{ width: 152, height: 152, background: 'radial-gradient(circle at 50% 38%, #F6C453 0%, #C4853A 72%)', boxShadow: '0 0 0 10px rgba(246,196,83,0.14), 0 0 0 22px rgba(246,196,83,0.07), 0 12px 40px rgba(246,196,83,0.25)' }}>
          <Mic size={58} strokeWidth={1.8} className="text-[#0D1B2A]" />
        </div>
        <p className="text-sm text-[#B8AAC8] mt-5 text-center">Tap the mic and tell me your story!</p>
      </section>

      <p className="flex items-center justify-center gap-1.5 text-center text-[12px] text-[#7A6B8A] mt-9">
        <Wand2 size={13} /> Next build: the Guardian Owl safety check &amp; watching your picture come alive.
      </p>
    </div>
  );
}
