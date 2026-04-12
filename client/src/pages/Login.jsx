import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.jsx';
import VersionFooter from '../components/VersionFooter.jsx';

export default function Login() {
  const navigate = useNavigate();
  const { loginEmail, signupEmail, loginGoogle, error, clearError } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  const toggleMode = () => {
    setMode((m) => (m === 'login' ? 'signup' : 'login'));
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === 'signup') {
        await signupEmail(email, password, name);
      } else {
        await loginEmail(email, password);
      }
      navigate('/');
    } catch {
      // error is set by the hook
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      await loginGoogle();
      navigate('/');
    } catch {
      // error set by hook
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="phone-shell">
      <div className="aurora" />
      <div className="starfield opacity-30" />

      <div className="relative z-10 flex h-full flex-col justify-center px-6 safe-top safe-bottom">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-2 text-5xl">🌙</div>
          <h1 className="font-display text-3xl font-bold text-gold">Qissaa</h1>
          <p className="mt-1 text-sm text-ink-muted">Bedtime stories that grow with your child</p>
        </motion.div>

        {/* Google sign-in — primary CTA */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={handleGoogle}
          disabled={busy}
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-pill bg-white px-5 py-4 font-ui text-sm font-bold text-gray-800 shadow-card transition active:scale-[0.98] disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </motion.button>

        {/* Divider */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-[10px] uppercase tracking-wider text-ink-dim">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Email form */}
        <motion.form
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-3"
        >
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field"
              autoComplete="name"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            autoComplete="email"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            minLength={6}
            required
          />

          {error && (
            <div className="rounded-xl bg-negative/10 px-3 py-2 text-[12px] text-negative">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn-primary w-full py-4 disabled:opacity-60"
          >
            {busy
              ? 'Please wait…'
              : mode === 'signup'
              ? 'Create account'
              : 'Log in'}
          </button>
        </motion.form>

        {/* Toggle */}
        <p className="mt-6 text-center text-[12px] text-ink-muted">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={toggleMode} className="font-bold text-gold">
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>

        <VersionFooter className="mt-8" />
      </div>
    </div>
  );
}
