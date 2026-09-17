// V2 Settings — native (no more stranding in the old app). Edit child, app language,
// links to voices + info pages (info pages open in a new tab so V2 is never left),
// and logout.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Mic2, BookOpen, Shield, Info, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';
import ChildSetup from './ChildSetup.jsx';
import { GOLD } from '../ui.js';

const LANGS = ['English', 'French', 'Spanish', 'Hindi'];

export default function SettingsV2() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile, save, update } = useFamilyProfile();
  const [savedTick, setSavedTick] = useState(false);
  const lang = profile?.language || 'English';

  const links = [
    { Icon: Mic2, label: 'My Voices', sub: 'Family voice clones', onClick: () => navigate('/v2/voices') },
    { Icon: BookOpen, label: 'How it works', sub: 'Guides', onClick: () => window.open('/guides', '_blank') },
    { Icon: Info, label: 'About My Sleepy Tale', sub: 'Our story', onClick: () => window.open('/aboutus', '_blank') },
    { Icon: Shield, label: 'Privacy & safety', sub: 'COPPA & parental controls', onClick: () => window.open('/privacy', '_blank') },
  ];

  return (
    <div className="px-5 lg:px-8 pt-7 lg:pt-10 pb-28 max-w-[560px]">
      <header className="flex items-center gap-2">
        <button onClick={() => navigate('/v2/profile')} className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] ring-1 ring-white/10 text-[#F7F1E8]"><ChevronLeft size={18} /></button>
        <h1 className="font-display text-[24px] lg:text-3xl text-[#F7F1E8]">Settings</h1>
      </header>

      {/* Edit child */}
      <section className="mt-6">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#7A6B8A] mb-3">Your child</h2>
        <ChildSetup
          initial={profile}
          cta={savedTick ? 'Saved ✓' : 'Save changes'}
          onSave={(p) => { save(p); setSavedTick(true); setTimeout(() => setSavedTick(false), 1600); }}
        />
      </section>

      {/* Language */}
      <section className="mt-9">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#7A6B8A] mb-3">App language</h2>
        <div className="flex flex-wrap gap-2">
          {LANGS.map((l) => (
            <button key={l} onClick={() => update({ language: l })} className={`rounded-full px-4 py-2 text-sm font-bold transition ${lang === l ? 'text-[#0D1B2A]' : 'text-[#B8AAC8] bg-white/[0.06] ring-1 ring-white/10'}`} style={lang === l ? { background: GOLD } : undefined}>{l}</button>
          ))}
        </div>
      </section>

      {/* More */}
      <section className="mt-9">
        <h2 className="text-[13px] font-bold uppercase tracking-[0.12em] text-[#7A6B8A] mb-3">More</h2>
        <div className="rounded-2xl ring-1 ring-white/10 overflow-hidden divide-y divide-white/8">
          {links.map(({ Icon, label, sub, onClick }) => (
            <button key={label} onClick={onClick} className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left hover:bg-white/[0.04] transition">
              <Icon size={19} className="text-[#B8AAC8] shrink-0" />
              <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[#F7F1E8]">{label}</p><p className="text-[11px] text-[#7A6B8A]">{sub}</p></div>
              <ChevronRight size={17} className="text-[#7A6B8A]" />
            </button>
          ))}
        </div>
      </section>

      {user && (
        <button onClick={() => logout && logout()} className="mt-8 w-full flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-[#f3727f] ring-1 ring-[#f3727f]/30 hover:bg-[#f3727f]/10 active:scale-95 transition">
          <LogOut size={16} /> Log out
        </button>
      )}
    </div>
  );
}
