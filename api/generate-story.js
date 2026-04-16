// Vercel Serverless Function — story generation with server-side tier enforcement.
import { selectStory } from '../server/lib/storySelector.js';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin (server-side — uses service account or auto-detected credentials)
let db = null;
try {
  if (getApps().length === 0) {
    // In Vercel, we can use the project ID + auto-credentials
    // Or a service account key set as FIREBASE_SERVICE_ACCOUNT env var
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;

    initializeApp(
      serviceAccount
        ? { credential: cert(serviceAccount), projectId: process.env.FIREBASE_PROJECT_ID || 'qissaa-61a78' }
        : { projectId: process.env.FIREBASE_PROJECT_ID || 'qissaa-61a78' }
    );
  }
  db = getFirestore();
} catch (e) {
  console.warn('Firebase Admin init failed — running without server-side enforcement:', e.message);
}

// Tier limits
const TIER_LIMITS = {
  free: { storiesPerWeek: 3, maxDuration: 5 },
  pro: { storiesPerWeek: Infinity, maxDuration: 30 },
  enterprise: { storiesPerWeek: Infinity, maxDuration: 30 },
  family: { storiesPerWeek: Infinity, maxDuration: 30 },
  annual: { storiesPerWeek: Infinity, maxDuration: 30 },
};

async function getRole(uid) {
  // Returns: 'admin' | 'tester' | 'marketing' | 'user'
  if (!db) return 'user';
  try {
    const configDoc = await db.collection('config').doc('app').get();
    if (!configDoc.exists) return 'user';
    const data = configDoc.data();
    const userDoc = await db.collection('users').doc(uid).get();
    const email = userDoc.exists ? userDoc.data().email : '';
    if (!email) return 'user';
    // Check admin
    if ((data.adminEmails || []).includes(email)) return 'admin';
    // Check team (testers get unlimited, marketing doesn't)
    const team = data.team || [];
    const member = team.find((t) => t.email === email && t.status === 'active');
    if (member) return member.role; // 'tester' or 'marketing'
    return 'user';
  } catch {
    return 'user';
  }
}

async function enforceUsageLimits(uid, requestedDuration) {
  if (!db || !uid) return { allowed: true }; // no enforcement if no DB

  try {
    // Admins and active testers get unlimited access
    const role = await getRole(uid);
    if (role === 'admin' || role === 'tester') {
      // Still track usage for analytics
      const userDoc = await db.collection('users').doc(uid).get();
      if (userDoc.exists) {
        const usage = userDoc.data().usage || {};
        await db.collection('users').doc(uid).update({
          'usage.totalStories': (usage.totalStories || 0) + 1,
          'usage.totalMinutes': (usage.totalMinutes || 0) + (requestedDuration || 0),
          'usage.lastStoryAt': new Date().toISOString(),
        });
      }
      return { allowed: true, tier: role };
    }

    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) return { allowed: true };

    const data = userDoc.data();
    const profiles = data.profiles || [];
    // Use the first profile's tier (all profiles share the account tier)
    const tier = profiles[0]?.tier || 'free';
    const limits = TIER_LIMITS[tier] || TIER_LIMITS.free;

    // Check duration limit
    if (requestedDuration > limits.maxDuration) {
      return {
        allowed: false,
        error: `${tier === 'free' ? 'Free' : tier} plan allows up to ${limits.maxDuration} min stories. Upgrade to unlock longer stories.`,
        code: 'DURATION_LIMIT',
      };
    }

    // Check weekly story count
    if (limits.storiesPerWeek !== Infinity) {
      const usage = data.usage || {};
      const totalStories = usage.totalStories || 0;
      // Simple weekly check: count stories in the last 7 days
      // (For a more precise check, we'd store timestamps per story)
      const lastStoryAt = usage.lastStoryAt ? new Date(usage.lastStoryAt) : null;
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

      // Use a server-side weekly counter stored in usage
      const weeklyCount = usage.weeklyCount || 0;
      const weekStartedAt = usage.weekStartedAt ? new Date(usage.weekStartedAt) : null;

      let currentWeekCount = weeklyCount;
      if (!weekStartedAt || weekStartedAt < weekAgo) {
        // New week — reset counter
        currentWeekCount = 0;
      }

      if (currentWeekCount >= limits.storiesPerWeek) {
        return {
          allowed: false,
          error: `Free plan allows ${limits.storiesPerWeek} stories per week. You've used ${currentWeekCount}. Upgrade for unlimited stories.`,
          code: 'WEEKLY_LIMIT',
        };
      }

      // Increment the counter
      const updateData = {
        'usage.weeklyCount': currentWeekCount + 1,
        'usage.totalStories': (usage.totalStories || 0) + 1,
        'usage.totalMinutes': (usage.totalMinutes || 0) + (requestedDuration || 0),
        'usage.lastStoryAt': new Date().toISOString(),
      };
      if (!weekStartedAt || weekStartedAt < weekAgo) {
        updateData['usage.weekStartedAt'] = new Date().toISOString();
        updateData['usage.weeklyCount'] = 1;
      }
      await db.collection('users').doc(uid).update(updateData);
    } else {
      // Paid tier — just increment total usage
      await db.collection('users').doc(uid).update({
        'usage.totalStories': (data.usage?.totalStories || 0) + 1,
        'usage.totalMinutes': (data.usage?.totalMinutes || 0) + (requestedDuration || 0),
        'usage.lastStoryAt': new Date().toISOString(),
      });
    }

    return { allowed: true, tier };
  } catch (e) {
    console.error('Usage enforcement error:', e);
    return { allowed: true }; // fail open — don't block users on errors
  }
}

// Check account status (blocked / paused)
async function checkAccountStatus(uid) {
  if (!db || !uid) return 'active';
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    if (!userDoc.exists) return 'active';
    return userDoc.data().accountStatus || 'active';
  } catch {
    return 'active';
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid, duration = 5, _adminTest, ...storyParams } = req.body || {};

    // Load Story Lab config for ALL story generation — this is the content engine
    let storyLabConfig = null;
    if (db) {
      try {
        const labDoc = await db.collection('config').doc('storyLab').get();
        if (labDoc.exists) storyLabConfig = labDoc.data();
      } catch (e) {
        console.warn('Could not load Story Lab config:', e.message);
      }
    }
    // Attach Story Lab to story params — flows into Claude prompt
    if (storyLabConfig) storyParams._storyLab = storyLabConfig;

    // Admin playground test — skip usage limits but verify admin role
    if (_adminTest && uid) {
      const role = await getRole(uid);
      if (role !== 'admin' && role !== 'tester') {
        return res.status(403).json({ error: 'Admin access required for test generation' });
      }
      const story = await selectStory({ ...storyParams, duration });
      return res.status(200).json(story);
    }

    // 1. Check account status
    if (uid) {
      const status = await checkAccountStatus(uid);
      if (status === 'blocked') {
        return res.status(403).json({ error: 'Account suspended.', code: 'BLOCKED' });
      }
      if (status === 'paused') {
        return res.status(403).json({ error: 'Account paused. Contact support.', code: 'PAUSED' });
      }
    }

    // 2. Enforce usage limits
    if (uid) {
      const check = await enforceUsageLimits(uid, duration);
      if (!check.allowed) {
        return res.status(429).json({ error: check.error, code: check.code });
      }
    }

    // 3. Generate story
    const story = await selectStory({ ...storyParams, duration });
    return res.status(200).json(story);
  } catch (err) {
    console.error('story generation failed', err);
    return res.status(500).json({ error: 'Story generation failed' });
  }
}
