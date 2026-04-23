import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Moon, BookOpen, Radio, User } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Tonight', Icon: Moon },
  { to: '/library', label: 'Library', Icon: BookOpen },
  { to: '/radio', label: 'Radio', Icon: Radio },
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
    <nav className="absolute bottom-0 left-0 right-0 z-30 border-t border-white/5 bg-bg-base/95 backdrop-blur-xl safe-bottom">
      <ul className="mx-auto flex max-w-2xl items-center justify-around px-2 pt-2">
        {tabs.map((t) => (
          <li key={t.to} className="flex-1">
            {isSubdomain ? (
              <a
                href={`${MAIN_ORIGIN}${t.to}`}
                className="flex min-h-[56px] flex-col items-center justify-center gap-1.5 rounded-2xl py-2 transition text-ink-muted active:text-ink"
              >
                <t.Icon size={22} strokeWidth={1.8} />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
                  {t.label}
                </span>
              </a>
            ) : (
              <NavLink
                to={t.to}
                end={t.to === '/'}
                className={({ isActive }) =>
                  `flex min-h-[56px] flex-col items-center justify-center gap-1.5 rounded-2xl py-2 transition ${
                    isActive ? 'text-gold' : 'text-ink-muted active:text-ink'
                  }`
                }
              >
                <t.Icon size={22} strokeWidth={1.8} />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
                  {t.label}
                </span>
              </NavLink>
            )}
          </li>
        ))}
        <li className="flex-1">
          {isSubdomain ? (
            <a
              href={`${MAIN_ORIGIN}/settings`}
              className="flex min-h-[56px] flex-col items-center justify-center gap-1.5 rounded-2xl py-2 transition text-ink-muted active:text-ink"
            >
              <User size={22} strokeWidth={1.8} />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]">More</span>
            </a>
          ) : (
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
                  <img
                    src={user.photoURL}
                    alt=""
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-transparent"
                    referrerPolicy="no-referrer"
                  />
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
          )}
        </li>
      </ul>
    </nav>
  );
}
