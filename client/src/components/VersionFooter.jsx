import { APP_NAME, APP_VERSION, APP_BUILD_LABEL } from '../utils/version.js';

export default function VersionFooter({ className = '' }) {
  return (
    <footer
      className={`mt-12 mb-4 text-center text-ink-dim ${className}`}
    >
      <a href="mailto:hello@mysleepytale.com" className="text-[11px] text-gold/70 hover:text-gold transition">
        hello@mysleepytale.com
      </a>
      <p className="mt-1 text-[9px] uppercase tracking-[0.2em]">
        {APP_NAME} · v{APP_VERSION} · {APP_BUILD_LABEL}
      </p>
    </footer>
  );
}
