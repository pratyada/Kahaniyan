import { createContext, createElement, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider, hasConfig } from '../lib/firebase.js';

const AuthCtx = createContext(null);

// Callback registered by FamilyProfileProvider so auth can notify
// it when the user changes. This avoids a circular dependency.
let _onUserChange = null;
export function registerOnUserChange(fn) {
  _onUserChange = fn;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notifiedRef = useRef(null);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      // Notify profile hook when user changes
      if (_onUserChange && u?.uid !== notifiedRef.current) {
        notifiedRef.current = u?.uid || null;
        _onUserChange(u);
      }
      // Save photoURL + email to Firestore user doc (for curator pages)
      if (u?.uid) {
        import('../lib/firebase.js').then(({ db }) => {
          if (!db) return;
          import('firebase/firestore').then(({ doc, setDoc, getDoc }) => {
            // Check if first-time user (doc doesn't exist yet)
            getDoc(doc(db, 'users', u.uid)).then(snap => {
              const isNewUser = !snap.exists();
              const updates = { email: u.email || '' };
              if (u.photoURL) updates.photoURL = u.photoURL;
              if (u.displayName) updates.displayName = u.displayName;
              setDoc(doc(db, 'users', u.uid), updates, { merge: true }).catch(() => {});
              // Send welcome email for first-time users
              if (isNewUser && u.email) {
                fetch('/api/marketing-welcome', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ to: u.email }),
                }).catch(() => {});
              }
            }).catch(() => {});
            // Auto-generate referral code if user doesn't have one
            import('../utils/referralHelper.js').then(({ ensureReferralCode }) => {
              ensureReferralCode(u.uid, u.displayName?.split(' ')[0]).catch(() => {});
            });
          });
        });
      }
    });
    return unsub;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const loginEmail = useCallback(async (email, password) => {
    if (!auth) return;
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(friendlyError(e.code));
      throw e;
    }
  }, []);

  const signupEmail = useCallback(async (email, password, displayName) => {
    if (!auth) return;
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
      // Send verification email
      try { await sendEmailVerification(cred.user); } catch {}
    } catch (e) {
      setError(friendlyError(e.code));
      throw e;
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    if (!auth) return;
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      setError(friendlyError(e.code));
      throw e;
    }
  }, []);

  const loginGoogle = useCallback(async () => {
    if (!auth || !googleProvider) return;
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      try { const { trackSignUp } = await import('../utils/analytics.js'); trackSignUp(); } catch {}
    } catch (e) {
      if (e.code === 'auth/popup-closed-by-user') return;
      console.error('Google sign-in error:', e.code, e.message);
      setError(friendlyError(e.code) + ` (${e.code})`);
      throw e;
    }
  }, []);

  const logout = useCallback(async () => {
    if (!auth) return;
    await signOut(auth);
  }, []);

  return createElement(
    AuthCtx.Provider,
    {
      value: {
        user,
        loading,
        error,
        clearError,
        loginEmail,
        signupEmail,
        loginGoogle,
        resetPassword,
        logout,
        isConfigured: hasConfig,
      },
    },
    children
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

function friendlyError(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try logging in.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email or password is incorrect.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
