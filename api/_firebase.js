// Shared Firebase Admin helper for API routes.
// Uses FIREBASE_SERVICE_ACCOUNT env var (JSON string) for authenticated access.

let admin = null;

export async function getFirebaseAdmin() {
  if (admin) return admin;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  const fbAdmin = (await import('firebase-admin')).default;
  if (!fbAdmin.apps.length) {
    fbAdmin.initializeApp({ credential: fbAdmin.credential.cert(JSON.parse(raw)) });
  }
  admin = fbAdmin;
  return admin;
}

export async function getFirestore() {
  const fb = await getFirebaseAdmin();
  return fb ? fb.firestore() : null;
}

export const FOUNDER_EMAILS = ['prateekyadav2010@gmail.com', 'rakshajoshi476@gmail.com'];
