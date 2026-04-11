import { APP_NAME, APP_VERSION, APP_BUILD_LABEL } from '../utils/version.js';

export default function VersionFooter({ className = '' }) {
  return (
    <footer
      className={`mt-12 mb-4 text-center text-[10px] uppercase tracking-[0.2em] text-ink-dim ${className}`}
    >
      {APP_NAME} · v{APP_VERSION} · {APP_BUILD_LABEL}
    </footer>
  );
}
