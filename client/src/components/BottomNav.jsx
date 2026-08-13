// Navigation — bottom bar on mobile, collapsible sidebar on desktop (lg:1024px+).

import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth.jsx';
import { Moon, Search, Feather, Radio, BookOpen, User, Sparkles, Mic } from 'lucide-react';

const TAB_KEYS = [
  { to: '/', key: 'home', Icon: Moon },
  { to: '/creation', key: 'creation', Icon: Feather, labelOverride: 'Create' },
  { to: '/incubate', key: 'incubate', Icon: Mic, labelOverride: 'Incubate', authOnly: true },
  { to: '/settings', key: 'settings', Icon: User, labelOverride: 'Settings' },
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
  const { t } = useTranslation();
  const initials = getInitials(user);
  const hostname = window.location.hostname;
  const isSubdomain = hostname.endsWith('.mysleepytale.com');
  const tabs = TAB_KEYS
    .filter(tab => !tab.authOnly || user)
    .map(tab => ({ ...tab, label: tab.labelOverride || t(`nav.${tab.key}`) }));

  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('sidebar-collapsed') === '1'; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0'); } catch {}
  }, [collapsed]);

  return (
    <>
      {/* ═══ MOBILE: Bottom nav bar ═══ */}
      <nav id="bottom-nav" className="lg:hidden absolute bottom-0 left-0 right-0 z-30 border-t border-white/5 bg-bg-base/95 backdrop-blur-xl safe-bottom">
        <ul className="mx-auto flex max-w-2xl items-center justify-around px-2 pt-2">
          {tabs.map((t) => (
            <li key={t.to} className="flex-1">
              {t.key === 'settings' && user ? (
                <NavLink to="/settings" className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 py-1.5 transition ${isActive ? 'text-gold' : 'text-ink-dim'}`
                }>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="h-6 w-6 rounded-full ring-1 ring-white/10" />
                  ) : (
                    <div className="grid h-6 w-6 place-items-center rounded-full bg-gold text-[9px] font-bold text-bg-base">{initials}</div>
                  )}
                  <span className="text-[8px] font-bold uppercase tracking-[0.1em] truncate max-w-[80px]">{user.email?.split('@')[0] || 'Me'}</span>
                </NavLink>
              ) : (
                <MobileTab tab={t} isSubdomain={isSubdomain} />
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* ═══ DESKTOP: Collapsible sidebar ═══ */}
      <nav
        className={`hidden lg:flex flex-col shrink-0 border-r border-white/5 bg-bg-surface/50 backdrop-blur-xl py-6 gap-1 z-30 transition-all duration-200 ${
          collapsed ? 'w-[68px] px-2' : 'w-56 px-3'
        }`}
      >
        {/* Brand — click to toggle collapse */}
        <button
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={`mb-6 text-left cursor-pointer transition-colors hover:bg-white/5 rounded-xl ${collapsed ? 'px-0 flex justify-center py-2' : 'px-3 py-1'}`}
        >
          {collapsed ? (
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gold/15">
              <Sparkles size={18} className="text-gold" />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold/15">
                <Sparkles size={18} className="text-gold" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink truncate" style={{ fontFamily: 'Lora, serif' }}>{t('app.name')}</p>
                <p className="text-[10px] text-ink-muted truncate">{t('app.tagline')}</p>
              </div>
            </div>
          )}
        </button>

        {/* Nav items — Settings goes to bottom */}
        {tabs.filter(t => t.key !== 'settings').map((t) => (
          <SidebarTab key={t.to} tab={t} isSubdomain={isSubdomain} collapsed={collapsed} />
        ))}

        <div className="flex-1" />

        {/* Settings at bottom — show user avatar when logged in */}
        {user ? (
          <NavLink to="/settings" className={({ isActive }) =>
            `rounded-xl ring-1 transition ${collapsed ? 'p-2 flex justify-center' : 'p-3'} ${isActive ? 'bg-gold/10 ring-gold/20' : 'bg-bg-surface ring-white/5 hover:ring-gold/20'}`
          }>
            <div className={`flex items-center ${collapsed ? '' : 'gap-2'}`}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className={`${collapsed ? 'h-7 w-7' : 'h-8 w-8'} rounded-full object-cover shrink-0`} referrerPolicy="no-referrer" />
              ) : (
                <span className={`grid ${collapsed ? 'h-7 w-7 text-[10px]' : 'h-8 w-8 text-xs'} place-items-center rounded-full bg-gold font-bold text-bg-base shrink-0`}>
                  {initials}
                </span>
              )}
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-ink">{user.displayName || 'User'}</p>
                  <p className="truncate text-[10px] text-ink-muted">{user.email}</p>
                </div>
              )}
            </div>
          </NavLink>
        ) : (
          tabs.filter(t => t.key === 'settings').map((t) => (
            <SidebarTab key={t.to} tab={t} isSubdomain={isSubdomain} collapsed={collapsed} />
          ))
        )}
      </nav>
    </>
  );
}

function MobileTab({ tab, isSubdomain }) {
  if (isSubdomain) {
    return (
      <a
        href={`${MAIN_ORIGIN}${tab.to}`}
        className="flex min-h-[56px] flex-col items-center justify-center gap-1.5 rounded-2xl py-2 transition text-ink-muted active:text-ink"
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

function SidebarTab({ tab, isSubdomain, collapsed }) {
  if (isSubdomain) {
    return (
      <a
        href={`${MAIN_ORIGIN}${tab.to}`}
        title={tab.label}
        className={`flex items-center rounded-xl py-2.5 text-sm font-medium text-ink-muted transition hover:bg-white/5 hover:text-ink ${
          collapsed ? 'justify-center px-0' : 'gap-3 px-3'
        }`}
      >
        <tab.Icon size={20} strokeWidth={1.8} />
        {!collapsed && <span>{tab.label}</span>}
      </a>
    );
  }
  return (
    <NavLink
      to={tab.to}
      end={tab.to === '/'}
      title={tab.label}
      className={({ isActive }) =>
        `flex items-center rounded-xl py-2.5 text-sm font-medium transition ${
          collapsed ? 'justify-center px-0' : 'gap-3 px-3'
        } ${isActive ? 'bg-gold/10 text-gold' : 'text-ink-muted hover:bg-white/5 hover:text-ink'}`
      }
    >
      <tab.Icon size={20} strokeWidth={1.8} />
      {!collapsed && <span>{tab.label}</span>}
    </NavLink>
  );
}
