import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

// authDomain: prefer Firebase's DEFAULT <projectId>.firebaseapp.com over a custom
// subdomain (e.g. auth.mysleepytale.com). A custom subdomain is a different origin
// from the app, so storage-partitioned browsers (Safari ITP, incognito, strict
// third-party cookies) block the sessionStorage the auth handler needs → the
// "Unable to process request due to missing initial state" sign-in error. The
// default firebaseapp.com domain is not partitioned against and works everywhere.
const authDomain = projectId
  ? `${projectId}.firebaseapp.com`
  : import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain,
  projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Google Analytics Measurement ID for admin dashboard embed
export const GA_MEASUREMENT_ID = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '';

// Only initialize if config is present — app works without Firebase
// (localStorage-only mode) until the env vars are set.
const hasConfig = !!firebaseConfig.apiKey;
const app = hasConfig ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const googleProvider = app ? new GoogleAuthProvider() : null;
const db = app ? getFirestore(app) : null;
const storage = app ? getStorage(app) : null;

export { app, auth, db, storage, googleProvider, hasConfig };
