// Navigation — bottom bar on mobile, sidebar on desktop (lg:1024px+).

import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Moon, Feather, Radio, BookOpen, User, Sparkles } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Home', Icon: Moon },
  { to: '/creation', label: 'Creation', Icon: Feather },
  { to: '/radio', label: 'Radio', Icon: Radio },
  { to: '/blog/', label: 'Blog', Icon: BookOpen, external: true },
];

const MAIN_ORIGIN = 'https://mysleepytale.com';

function getInitials(user) {
  if (!user) return null;
  const name = user.displayName || user.email || '';
  const parts = name.split(/[\s@]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return '?';
}

export default function BottomNav() {
  const { user } = useAuth();
  const initials = getInitials(user);
  const hostname = window.location.hostname;
  const isSubdomain = hostname.endsWith('.mysleepytale.com');

  return (
    <>
      {/* ═══ MOBILE: Bottom nav bar ═══ */}
      <nav id="bottom-nav" className="lg:hidden absolute bottom-0 left-0 right-0 z-30 border-t border-white/5 bg-bg-base/95 backdrop-blur-xl safe-bottom">
        <ul className="mx-auto flex max-w-2xl items-center justify-around px-2 pt-2">
          {tabs.map((t) => (
            <li key={t.to} className="flex-1">
              <MobileTab tab={t} isSubdomain={isSubdomain} />
            </li>
          ))}
          <li className="flex-1">
            <MobileMoreTab user={user} initials={initials} isSubdomain={isSubdomain} />
          </li>
        </ul>
      </nav>

      {/* ═══ DESKTOP: Sidebar nav ═══ */}
      <nav className="hidden lg:flex flex-col w-56 shrink-0 border-r border-white/5 bg-bg-surface/50 backdrop-blur-xl px-3 py-6 gap-1 z-30">
        {/* Brand */}
        <div className="mb-6 px-3">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gold/15">
              <Sparkles size={18} className="text-gold" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>My Sleepy Tale</p>
              <p className="text-[10px] text-ink-muted">Microlearning to complete your day</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        {tabs.map((t) => (
          <SidebarTab key={t.to} tab={t} isSubdomain={isSubdomain} />
        ))}

        <div className="my-2 border-t border-white/5" />

        {/* More / Settings */}
        {isSubdomain ? (
          <a
            href={`${MAIN_ORIGIN}/settings`}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted transition hover:bg-white/5 hover:text-ink"
          >
            <User size={20} strokeWidth={1.8} />
            <span>Settings</span>
          </a>
        ) : (
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-gold/10 text-gold'
                  : 'text-ink-muted hover:bg-white/5 hover:text-ink'
              }`
            }
          >
            {user ? (
              user.photoURL ? (
                <img src={user.photoURL} alt="" className="h-6 w-6 rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="grid h-6 w-6 place-items-center rounded-full bg-gold text-[10px] font-bold text-bg-base">
                  {initials}
                </span>
              )
            ) : (
              <User size={20} strokeWidth={1.8} />
            )}
            <span>{user ? 'Me' : 'Settings'}</span>
          </NavLink>
        )}

        {/* Spacer pushes user info to bottom */}
        <div className="flex-1" />

        {/* User info at bottom of sidebar */}
        {user && (
          <div className="mt-4 rounded-xl bg-bg-surface p-3 ring-1 ring-white/5">
            <div className="flex items-center gap-2">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-xs font-bold text-bg-base">
                  {initials}
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-ink">{user.displayName || 'User'}</p>
                <p className="truncate text-[10px] text-ink-muted">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

function MobileTab({ tab, isSubdomain }) {
  if (tab.external || isSubdomain) {
    const href = isSubdomain ? `${MAIN_ORIGIN}${tab.to}` : tab.to;
    const isActive = window.location.pathname.startsWith(tab.to);
    return (
      <a
        href={href}
        className={`flex min-h-[56px] flex-col items-center justify-center gap-1.5 rounded-2xl py-2 transition ${
          isActive ? 'text-gold' : 'text-ink-muted active:text-ink'
        }`}
      >
        <tab.Icon size={22} strokeWidth={1.8} />
        <span className="text-[10px] font-bold uppercase tracking-[0.14em]">{tab.label}</span>
      </a>
    );
  }
  return (
    <NavLink
      to={tab.to}
      end={tab.to === '/'}
      className={({ isActive }) =>
        `flex min-h-[56px] flex-col items-center justify-center gap-1.5 rounded-2xl py-2 transition ${
          isActive ? 'text-gold' : 'text-ink-muted active:text-ink'
        }`
      }
    >
      <tab.Icon size={22} strokeWidth={1.8} />
      <span className="text-[10px] font-bold uppercase tracking-[0.14em]">{tab.label}</span>
    </NavLink>
  );
}

function MobileMoreTab({ user, initials, isSubdomain }) {
  if (isSubdomain) {
    return (
      <a
        href={`${MAIN_ORIGIN}/settings`}
        className="flex min-h-[56px] flex-col items-center justify-center gap-1.5 rounded-2xl py-2 transition text-ink-muted active:text-ink"
      >
        <User size={22} strokeWidth={1.8} />
        <span className="text-[10px] font-bold uppercase tracking-[0.14em]">More</span>
      </a>
    );
  }
  return (
    <NavLink
      to="/settings"
      className={({ isActive }) =>
        `flex min-h-[56px] flex-col items-center justify-center gap-1.5 rounded-2xl py-2 transition ${
          isActive ? 'text-gold' : 'text-ink-muted active:text-ink'
        }`
      }
    >
      {user ? (
        user.photoURL ? (
          <img src={user.photoURL} alt="" className="h-7 w-7 rounded-full object-cover ring-2 ring-transparent" referrerPolicy="no-referrer" />
        ) : (
          <span className="grid h-7 w-7 place-items-center rounded-full bg-gold text-[11px] font-bold text-bg-base">
            {initials}
          </span>
        )
      ) : (
        <User size={22} strokeWidth={1.8} />
      )}
      <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
        {user ? 'Me' : 'More'}
      </span>
    </NavLink>
  );
}

function SidebarTab({ tab, isSubdomain }) {
  if (tab.external || isSubdomain) {
    const href = isSubdomain ? `${MAIN_ORIGIN}${tab.to}` : tab.to;
    const isActive = window.location.pathname.startsWith(tab.to);
    return (
      <a
        href={href}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          isActive
            ? 'bg-gold/10 text-gold'
            : 'text-ink-muted hover:bg-white/5 hover:text-ink'
        }`}
      >
        <tab.Icon size={20} strokeWidth={1.8} />
        <span>{tab.label}</span>
      </a>
    );
  }
  return (
    <NavLink
      to={tab.to}
      end={tab.to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          isActive
            ? 'bg-gold/10 text-gold'
            : 'text-ink-muted hover:bg-white/5 hover:text-ink'
        }`
      }
    >
      <tab.Icon size={20} strokeWidth={1.8} />
      <span>{tab.label}</span>
    </NavLink>
  );
}
