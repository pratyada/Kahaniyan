// V2 Profile — account, login/logout, subscription, settings. Night-sky base.
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight, Gem, Mic2, Star, Shield, Settings as SettingsIcon, Moon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';
import { GOLD } from '../ui.js';

export default function Profile() {
  const navigate = useNavigate();
  const { user, loginGoogle, logout, error } = useAuth();
  const { profile } = useFamilyProfile();

  /* ── Signed out ── */
  if (!user) {
    return (
      <div className="px-5 lg:px-8 pt-7 lg:pt-10 max-w-[520px]">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A6B8A]">Your account</p>
          <h1 className="font-display text-[26px] lg:text-3xl mt-1 text-[#F7F1E8]">Sign in to save your world</h1>
        </header>
        <div className="mt-6 rounded-3xl p-6 ring-1 ring-white/10 bg-white/[0.05]">
          <div className="grid h-14 w-14 place-items-center rounded-2xl mb-4" style={{ background: 'rgba(246,196,83,0.14)' }}>
            <Moon size={26} style={{ color: GOLD }} />
          </div>
          <ul className="space-y-2.5 text-sm text-[#B8AAC8]">
            <li className="flex items-center gap-2.5"><Star size={15} style={{ color: GOLD }} /> Keep your child&apos;s stories &amp; world</li>
            <li className="flex items-center gap-2.5"><Mic2 size={15} style={{ color: GOLD }} /> Add family voices (Mum, Dad, Grandma)</li>
            <li className="flex items-center gap-2.5"><Shield size={15} style={{ color: GOLD }} /> Private &amp; safe — family only</li>
          </ul>
          <button
            onClick={() => loginGoogle && loginGoogle()}
            className="mt-6 w-full rounded-full px-6 py-3.5 text-sm font-bold text-[#0D1B2A] active:scale-95 transition"
            style={{ background: GOLD }}
          >
            Continue with Google
          </button>
          {error && <p className="mt-3 text-center text-[12px] text-[#f3727f]">{error}</p>}
        </div>
      </div>
    );
  }

  /* ── Signed in ── */
  const rows = [
    { Icon: Mic2, label: 'My Voices', sub: 'Clone a family voice', onClick: () => navigate('/voices') },
    { Icon: Star, label: 'Family & kids', sub: profile?.childName ? `${profile.childName}'s profile` : 'Set up a child', onClick: () => navigate('/family') },
    { Icon: Shield, label: 'Privacy & safety', sub: 'Parental controls', onClick: () => navigate('/privacy') },
    { Icon: SettingsIcon, label: 'App settings', sub: 'Theme, language, more', onClick: () => navigate('/settings') },
  ];

  return (
    <div className="px-5 lg:px-8 pt-7 lg:pt-10 max-w-[560px]">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7A6B8A]">Your account</p>
        <h1 className="font-display text-[26px] lg:text-3xl mt-1 text-[#F7F1E8]">Profile</h1>
      </header>

      {/* Identity */}
      <div className="mt-6 flex items-center gap-3.5 rounded-2xl p-4 ring-1 ring-white/10 bg-white/[0.05]">
        {user.photoURL ? (
          <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="h-14 w-14 rounded-full object-cover" />
        ) : (
          <span className="grid h-14 w-14 place-items-center rounded-full text-lg font-bold text-[#0D1B2A]" style={{ background: GOLD }}>
            {(user.displayName?.[0] || user.email?.[0] || 'S').toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="font-display text-lg text-[#F7F1E8] truncate">{user.displayName || 'My account'}</p>
          <p className="text-[12px] text-[#7A6B8A] truncate">{user.email}</p>
        </div>
      </div>

      {/* Upgrade */}
      <button
        onClick={() => navigate('/settings')}
        className="mt-4 w-full flex items-center gap-3 rounded-2xl p-4 text-left ring-1 transition active:scale-[0.99]"
        style={{ background: 'linear-gradient(120deg, rgba(246,196,83,0.16), rgba(246,196,83,0.04))', borderColor: 'rgba(246,196,83,0.3)' }}
      >
        <div className="grid h-11 w-11 place-items-center rounded-xl shrink-0" style={{ background: 'rgba(246,196,83,0.2)' }}>
          <Gem size={20} style={{ color: GOLD }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#F7F1E8]">Family Plus</p>
          <p className="text-[12px] text-[#B8AAC8]">Family voices · unlimited sparkles · ad-free</p>
        </div>
        <ChevronRight size={18} className="text-[#7A6B8A]" />
      </button>

      {/* Settings rows */}
      <div className="mt-5 rounded-2xl ring-1 ring-white/10 overflow-hidden divide-y divide-white/8">
        {rows.map(({ Icon, label, sub, onClick }) => (
          <button key={label} onClick={onClick} className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left hover:bg-white/[0.04] transition">
            <Icon size={19} className="text-[#B8AAC8] shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#F7F1E8]">{label}</p>
              <p className="text-[11px] text-[#7A6B8A]">{sub}</p>
            </div>
            <ChevronRight size={17} className="text-[#7A6B8A]" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={() => logout && logout()}
        className="mt-5 w-full flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-[#f3727f] ring-1 ring-[#f3727f]/30 hover:bg-[#f3727f]/10 active:scale-95 transition"
      >
        <LogOut size={16} /> Log out
      </button>
    </div>
  );
}
