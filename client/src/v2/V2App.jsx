// ─────────────────────────────────────────────────────────────
// MST V2 — the redesigned app ("Night-Sky Storybook").
// Mounted from App.jsx Shell when the path starts with /v2 (opt-in flag).
// Reuses all existing providers (theme/auth/profile/player) mounted above Shell,
// so it shares real data + playback with the current app. Existing routes untouched.
// Renders as a clean, centered phone-width column on every screen size.
// Three tabs: 🎧 Listen · 🎨 Build · 🪐 My World.
// ─────────────────────────────────────────────────────────────
import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import ListenHome from './screens/ListenHome.jsx';
import Build from './screens/Build.jsx';
import MyWorld from './screens/MyWorld.jsx';

const TABS = [
  { to: '/v2', icon: '🎧', label: 'Listen', end: true },
  { to: '/v2/build', icon: '🎨', label: 'Build', end: false },
  { to: '/v2/world', icon: '🪐', label: 'My World', end: false },
];

export default function V2App() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'var(--bg-base)' }}>
      {/* Centered phone-width column — clean on mobile AND desktop */}
      <div className="relative mx-auto flex h-full w-full max-w-[460px] flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
          <Routes>
            <Route path="/v2" element={<ListenHome />} />
            <Route path="/v2/build" element={<Build />} />
            <Route path="/v2/world" element={<MyWorld />} />
            <Route path="*" element={<Navigate to="/v2" replace />} />
          </Routes>
        </main>
        <V2Nav />
      </div>
    </div>
  );
}

function V2Nav() {
  const { pathname } = useLocation();
  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-30 border-t border-white/8 bg-bg-base/95 backdrop-blur-xl safe-bottom"
      style={{ boxShadow: '0 -8px 24px rgba(0,0,0,0.35)' }}
    >
      <ul className="flex items-stretch">
        {TABS.map((t) => {
          const active = t.end ? pathname === t.to : pathname.startsWith(t.to);
          return (
            <li key={t.to} className="flex-1">
              <NavLink
                to={t.to}
                className={`flex min-h-[60px] flex-col items-center justify-center gap-1 py-2 transition ${
                  active ? 'text-gold' : 'text-ink-dim active:text-ink'
                }`}
              >
                <span
                  className="text-[22px] leading-none"
                  style={{ filter: active ? 'none' : 'grayscale(0.4)', opacity: active ? 1 : 0.85 }}
                >
                  {t.icon}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.1em]">{t.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
