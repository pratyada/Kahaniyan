// ─────────────────────────────────────────────────────────────
// MST V2 — the redesigned app ("Night-Sky Storybook").
// Mounted from App.jsx Shell on /v2 (opt-in). Reuses existing providers/data/player.
// RESPONSIVE: left sidebar on laptop (lg+), bottom tab bar on mobile.
// Committed night-sky theme so it always matches the design regardless of app theme.
// Four tabs: Listen · Build · My World · Profile.
// ─────────────────────────────────────────────────────────────
import { useEffect } from 'react';
import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { Headphones, Wand2, Orbit } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { NIGHT_BG, GOLD } from './ui.js';
import ListenHome from './screens/ListenHome.jsx';
import Build from './screens/Build.jsx';
import MyWorld from './screens/MyWorld.jsx';
import Profile from './screens/Profile.jsx';
import V2Player from './screens/V2Player.jsx';
import V2Series from './screens/V2Series.jsx';

// Profile is NOT a nav item — it's reached via the username/avatar (sidebar bottom
// card on desktop, avatar slot on the mobile bar). No duplicate profile icon.
const NAV = [
  { to: '/v2', Icon: Headphones, label: 'Listen', end: true },
  { to: '/v2/build', Icon: Wand2, label: 'Build', end: false },
  { to: '/v2/world', Icon: Orbit, label: 'My World', end: false },
];

export default function V2App() {
  // Force the night theme while in V2 so reused production cards (gold accents)
  // render correctly regardless of the user's day/night toggle. Restore on exit.
  useEffect(() => {
    const el = document.documentElement;
    const prev = el.getAttribute('data-theme');
    const apply = () => el.setAttribute('data-theme', 'night');
    apply();
    // Re-assert after ThemeProvider's own mount effect (which runs after this
    // child effect and would otherwise restore the user's day theme).
    const raf = requestAnimationFrame(apply);
    return () => { cancelAnimationFrame(raf); if (prev) el.setAttribute('data-theme', prev); };
  }, []);

  return (
    <div
      className="fixed inset-0 flex text-[#F7F1E8]"
      style={{ background: NIGHT_BG, fontFamily: "'DM Sans', system-ui, sans-serif" }}
    >
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
        <div className="mx-auto w-full max-w-[1040px] pb-28 lg:pb-12">
          <Routes>
            <Route path="/v2" element={<ListenHome />} />
            <Route path="/v2/player/:storyId" element={<V2Player />} />
            <Route path="/v2/player" element={<V2Player />} />
            <Route path="/v2/series/:seriesId" element={<V2Series />} />
            <Route path="/v2/build" element={<Build />} />
            <Route path="/v2/world" element={<MyWorld />} />
            <Route path="/v2/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/v2" replace />} />
          </Routes>
        </div>
      </main>
      <BottomBar />
    </div>
  );
}

/* ── Desktop / laptop: left sidebar ── */
function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { profile } = useFamilyProfile();
  const name = profile?.childName && profile.childName !== 'little one' ? profile.childName : null;
  return (
    <aside className="hidden lg:flex w-[248px] shrink-0 flex-col border-r border-white/8 px-4 py-7">
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: 'rgba(246,196,83,0.14)' }}>
          <span className="text-xl">🌙</span>
        </div>
        <div className="min-w-0">
          <p className="font-display text-[15px] leading-tight text-[#F7F1E8]">My Sleepy Tale</p>
          <p className="text-[11px] text-[#7A6B8A]">{name ? `${name}'s stories` : 'Bedtime, reimagined'}</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map(({ to, Icon, label, end }) => {
          const active = end ? pathname === to : pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                active ? 'text-[#0D1B2A]' : 'text-[#B8AAC8] hover:bg-white/5 hover:text-[#F7F1E8]'
              }`}
              style={active ? { background: GOLD } : undefined}
            >
              <Icon size={20} strokeWidth={1.9} />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto">
        <NavLink to="/v2/profile" className="flex items-center gap-3 rounded-xl px-3 py-2.5 ring-1 ring-white/8 hover:ring-white/15 transition">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full object-cover" />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-full text-sm font-bold text-[#0D1B2A]" style={{ background: GOLD }}>
              {(user?.email?.[0] || 'S').toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-[12px] font-bold text-[#F7F1E8]">{user ? user.displayName || 'Account' : 'Sign in'}</p>
            <p className="truncate text-[10px] text-[#7A6B8A]">{user?.email || 'Save your world'}</p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
}

/* ── Mobile: bottom tab bar (nav tabs + username/avatar for profile) ── */
function BottomBar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const profileActive = pathname.startsWith('/v2/profile');
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-white/8 backdrop-blur-xl safe-bottom"
      style={{ background: 'rgba(7,10,25,0.92)', boxShadow: '0 -8px 24px rgba(0,0,0,0.4)' }}
    >
      <ul className="flex items-stretch">
        {NAV.map(({ to, Icon, label, end }) => {
          const active = end ? pathname === to : pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                className={`flex min-h-[60px] flex-col items-center justify-center gap-1 py-2 transition ${
                  active ? 'text-[#F6C453]' : 'text-[#7A6B8A] active:text-[#F7F1E8]'
                }`}
              >
                <Icon size={22} strokeWidth={1.9} />
                <span className="text-[10px] font-bold uppercase tracking-[0.09em]">{label}</span>
              </NavLink>
            </li>
          );
        })}
        {/* Profile = username/avatar, not a generic icon */}
        <li className="flex-1">
          <NavLink
            to="/v2/profile"
            className={`flex min-h-[60px] flex-col items-center justify-center gap-1 py-2 transition ${
              profileActive ? 'text-[#F6C453]' : 'text-[#7A6B8A] active:text-[#F7F1E8]'
            }`}
          >
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className={`h-6 w-6 rounded-full object-cover ${profileActive ? 'ring-2 ring-[#F6C453]' : ''}`} />
            ) : (
              <span className="grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold text-[#0D1B2A]" style={{ background: profileActive ? GOLD : '#B8AAC8' }}>
                {(user?.displayName?.[0] || user?.email?.[0] || 'S').toUpperCase()}
              </span>
            )}
            <span className="text-[10px] font-bold uppercase tracking-[0.09em]">{user ? 'Me' : 'Sign in'}</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
