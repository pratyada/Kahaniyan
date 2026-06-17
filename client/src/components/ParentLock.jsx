// Parent Lock — 4-digit PIN gate for grown-up sections
// Usage: <ParentLock onUnlock={() => ...}> or useParentLock() hook

import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOCK_KEY = 'mst:parent-pin';
const UNLOCK_KEY = 'mst:parent-unlocked';
const UNLOCK_DURATION = 5 * 60 * 1000; // 5 minutes before re-locking

const ParentLockCtx = createContext(null);

export function ParentLockProvider({ children }) {
  const [pin, setPin] = useState(() => {
    try { return localStorage.getItem(LOCK_KEY) || null; } catch { return null; }
  });
  const [unlocked, setUnlocked] = useState(() => {
    try {
      const ts = localStorage.getItem(UNLOCK_KEY);
      return ts && Date.now() - parseInt(ts) < UNLOCK_DURATION;
    } catch { return false; }
  });
  const [showGate, setShowGate] = useState(false);
  const [gateCallback, setGateCallback] = useState(null);

  const isLocked = pin && !unlocked;

  const setParentPin = useCallback((newPin) => {
    try {
      if (newPin) {
        localStorage.setItem(LOCK_KEY, newPin);
      } else {
        localStorage.removeItem(LOCK_KEY);
        localStorage.removeItem(UNLOCK_KEY);
      }
    } catch {}
    setPin(newPin || null);
    if (!newPin) setUnlocked(false);
  }, []);

  const unlock = useCallback(() => {
    setUnlocked(true);
    try { localStorage.setItem(UNLOCK_KEY, String(Date.now())); } catch {}
  }, []);

  const lock = useCallback(() => {
    setUnlocked(false);
    try { localStorage.removeItem(UNLOCK_KEY); } catch {}
  }, []);

  // Auto-lock after UNLOCK_DURATION
  useEffect(() => {
    if (!unlocked) return;
    const timer = setTimeout(() => {
      setUnlocked(false);
      try { localStorage.removeItem(UNLOCK_KEY); } catch {}
    }, UNLOCK_DURATION);
    return () => clearTimeout(timer);
  }, [unlocked]);

  // Request unlock — shows PIN gate, calls callback on success
  const requireUnlock = useCallback((callback) => {
    if (!pin) { callback(); return; } // no PIN set — pass through
    if (unlocked) { callback(); return; } // already unlocked
    setGateCallback(() => callback);
    setShowGate(true);
  }, [pin, unlocked]);

  const handleGateSuccess = useCallback(() => {
    unlock();
    setShowGate(false);
    if (gateCallback) gateCallback();
    setGateCallback(null);
  }, [unlock, gateCallback]);

  const handleGateClose = useCallback(() => {
    setShowGate(false);
    setGateCallback(null);
  }, []);

  return (
    <ParentLockCtx.Provider value={{ pin, isLocked, unlocked, setParentPin, unlock, lock, requireUnlock }}>
      {children}
      <AnimatePresence>
        {showGate && <PinGate pin={pin} onSuccess={handleGateSuccess} onClose={handleGateClose} />}
      </AnimatePresence>
    </ParentLockCtx.Provider>
  );
}

export function useParentLock() {
  const ctx = useContext(ParentLockCtx);
  if (!ctx) return { pin: null, isLocked: false, unlocked: true, setParentPin: () => {}, requireUnlock: (cb) => cb(), lock: () => {} };
  return ctx;
}

// PIN Gate overlay
function PinGate({ pin, onSuccess, onClose }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleDigit = (d) => {
    if (input.length >= 4) return;
    const next = input + d;
    setInput(next);
    setError(false);

    if (next.length === 4) {
      if (next === pin) {
        onSuccess();
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => { setInput(''); setShake(false); }, 600);
      }
    }
  };

  const handleDelete = () => {
    setInput(input.slice(0, -1));
    setError(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1, x: shake ? [0, -10, 10, -10, 10, 0] : 0 }}
        transition={shake ? { duration: 0.4 } : { duration: 0.2 }}
        className="w-full max-w-xs rounded-3xl bg-bg-base p-6 text-center shadow-2xl ring-1 ring-white/10"
      >
        <div className="text-4xl mb-3">🔒</div>
        <h2 className="text-lg font-bold text-ink mb-1" style={{ fontFamily: 'Lora, serif' }}>Grown-ups Only</h2>
        <p className="text-xs text-ink-muted mb-6">Enter your 4-digit parent PIN</p>

        {/* PIN dots */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`h-4 w-4 rounded-full transition-all ${
              i < input.length
                ? error ? 'bg-red-400 scale-110' : 'bg-gold scale-110'
                : 'bg-white/10'
            }`} />
          ))}
        </div>

        {error && <p className="text-xs text-red-400 mb-3">Wrong PIN. Try again.</p>}

        {/* Number pad */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button key={n} onClick={() => handleDigit(String(n))}
              className="h-14 rounded-2xl bg-white/5 text-xl font-bold text-ink transition active:scale-90 active:bg-gold/20">
              {n}
            </button>
          ))}
          <button onClick={onClose}
            className="h-14 rounded-2xl text-xs font-bold text-ink-muted transition active:scale-90">
            Cancel
          </button>
          <button onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-white/5 text-xl font-bold text-ink transition active:scale-90 active:bg-gold/20">
            0
          </button>
          <button onClick={handleDelete}
            className="h-14 rounded-2xl text-xs font-bold text-ink-muted transition active:scale-90">
            ⌫
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// PIN Setup component — used in Settings
export function PinSetup() {
  const { pin, setParentPin } = useParentLock();
  const [mode, setMode] = useState(null); // null | 'set' | 'change' | 'remove'
  const [step, setStep] = useState(1); // 1: enter, 2: confirm
  const [input, setInput] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');

  const handleDigit = (d) => {
    if (input.length >= 4) return;
    const next = input + d;
    setInput(next);
    setError('');

    if (next.length === 4) {
      if (mode === 'remove') {
        if (next === pin) {
          setParentPin(null);
          setMode(null);
          setInput('');
        } else {
          setError('Wrong PIN');
          setTimeout(() => setInput(''), 500);
        }
      } else if (step === 1) {
        setFirstPin(next);
        setStep(2);
        setInput('');
      } else {
        if (next === firstPin) {
          setParentPin(next);
          setMode(null);
          setInput('');
          setFirstPin('');
          setStep(1);
        } else {
          setError('PINs do not match');
          setStep(1);
          setFirstPin('');
          setTimeout(() => setInput(''), 500);
        }
      }
    }
  };

  if (!mode) {
    return (
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-ink">🔒 Parent Lock</div>
          <div className="text-[10px] text-ink-muted">{pin ? 'PIN is set — Settings locked from kids' : 'No PIN set — anyone can access Settings'}</div>
        </div>
        <button onClick={() => setMode(pin ? 'change' : 'set')}
          className="rounded-xl bg-gold/10 px-4 py-2 text-[11px] font-bold text-gold transition active:scale-95">
          {pin ? 'Change PIN' : 'Set PIN'}
        </button>
        {pin && (
          <button onClick={() => setMode('remove')}
            className="ml-2 rounded-xl bg-red-400/10 px-3 py-2 text-[11px] font-bold text-red-400 transition active:scale-95">
            Remove
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="text-center py-2">
      <p className="text-sm font-bold text-ink mb-1">
        {mode === 'remove' ? 'Enter current PIN to remove' : step === 1 ? 'Enter new 4-digit PIN' : 'Confirm your PIN'}
      </p>
      <div className="flex justify-center gap-3 my-4">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`h-3 w-3 rounded-full transition ${i < input.length ? 'bg-gold' : 'bg-white/10'}`} />
        ))}
      </div>
      {error && <p className="text-xs text-red-400 mb-2">{error}</p>}
      <div className="grid grid-cols-3 gap-1.5 max-w-[200px] mx-auto">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} onClick={() => handleDigit(String(n))}
            className="h-10 rounded-xl bg-white/5 text-sm font-bold text-ink active:bg-gold/20">{n}</button>
        ))}
        <button onClick={() => { setMode(null); setInput(''); setFirstPin(''); setStep(1); setError(''); }}
          className="h-10 rounded-xl text-[10px] text-ink-muted">Cancel</button>
        <button onClick={() => handleDigit('0')}
          className="h-10 rounded-xl bg-white/5 text-sm font-bold text-ink active:bg-gold/20">0</button>
        <button onClick={() => { setInput(input.slice(0,-1)); setError(''); }}
          className="h-10 rounded-xl text-[10px] text-ink-muted">⌫</button>
      </div>
    </div>
  );
}
