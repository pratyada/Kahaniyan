// Bulk create daily tasks.
// POST /api/bulk-tasks { tasks: [...] }

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'qissaa-61a78';

let admin = null;
async function getAdmin() {
  if (admin) return admin;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) return null;
  const { default: fbAdmin } = await import('firebase-admin');
  if (!fbAdmin.apps.length) {
    fbAdmin.initializeApp({ credential: fbAdmin.credential.cert(JSON.parse(raw)) });
  }
  admin = fbAdmin;
  return admin;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { tasks } = req.body || {};
  if (!tasks || !Array.isArray(tasks)) return res.status(400).json({ error: 'tasks array required' });

  const fb = await getAdmin();
  if (!fb) return res.status(503).json({ error: 'Firebase not configured' });

  const db = fb.firestore();
  let created = 0;

  for (const task of tasks) {
    try {
      const id = task.id || `task_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      await db.collection('dailyTasks').doc(id).set({
        ...task,
        id,
        createdAt: task.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      created++;
    } catch (e) {
      console.error('[bulk-tasks] Error:', e.message);
    }
  }

  return res.json({ created, total: tasks.length });
}
