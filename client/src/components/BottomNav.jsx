import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', label: 'Tonight', icon: '🌙' },
  { to: '/library', label: 'Library', icon: '📚' },
  { to: '/guides', label: 'Guides', icon: '✨' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function BottomNav() {
  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 border-t border-white/5 bg-bg-base/95 backdrop-blur-xl safe-bottom">
      <ul className="flex items-center justify-around px-2 pt-2">
        {tabs.map((t) => (
          <li key={t.to} className="flex-1">
            <NavLink
              to={t.to}
              end={t.to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-2xl py-2 transition ${
                  isActive ? 'text-gold' : 'text-ink-muted'
                }`
              }
            >
              <span className="text-xl leading-none">{t.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.14em]">
                {t.label}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
