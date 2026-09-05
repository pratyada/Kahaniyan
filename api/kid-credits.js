// POST /api/kid-credits — Manage kid creator credits (stars)
// Actions: award, balance, transactions, streak
// Credit rules:
//   +5  create a story
//   +10 animate a story
//   +1  per play received (cap 50/story)
//   +2  per like received
//   +10 bonus for 3-day streak
//   +25 bonus for 7-day streak

import { getFirestore } from './_firebase.js';

const CREDIT_RULES = {
  story_created: 5,
  story_animated: 10,
  play_received: 1,
  like_received: 2,
  streak_3: 10,
  streak_7: 25,
  chain_created: 5,
  chain_part_added: 3,
  chain_compiled: 15,
};

// Level thresholds
function getLevel(totalEarned) {
  if (totalEarned >= 500) return { level: 5, title: 'Story Legend', icon: '👑' };
  if (totalEarned >= 250) return { level: 4, title: 'Story Master', icon: '🏆' };
  if (totalEarned >= 100) return { level: 3, title: 'Story Hero', icon: '🦸' };
  if (totalEarned >= 25) return { level: 2, title: 'Story Star', icon: '⭐' };
  return { level: 1, title: 'Little Storyteller', icon: '🌱' };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { action, kidId, parentUid } = req.body || {};

  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Firestore not available' });

  // ── GET BALANCE ──
  if (action === 'balance') {
    if (!kidId) return res.status(400).json({ error: 'kidId required' });
    const credRef = db.collection('kidCredits').doc(kidId);
    const snap = await credRef.get();
    if (!snap.exists) {
      const fresh = { kidId, parentUid: parentUid || '', balance: 0, totalEarned: 0, streak: 0, lastStoryDate: null };
      return res.json({ ...fresh, ...getLevel(0) });
    }
    const data = snap.data();
    return res.json({ ...data, ...getLevel(data.totalEarned || 0) });
  }

  // ── GET TRANSACTIONS ──
  if (action === 'transactions') {
    if (!kidId) return res.status(400).json({ error: 'kidId required' });
    const snap = await db.collection('kidCredits').doc(kidId).collection('transactions')
      .orderBy('createdAt', 'desc').limit(50).get();
    return res.json({ transactions: snap.docs.map(d => d.data()) });
  }

  // ── AWARD CREDITS ──
  if (action === 'award') {
    const { type, storyId } = req.body;
    if (!kidId || !type) return res.status(400).json({ error: 'kidId and type required' });

    const amount = CREDIT_RULES[type];
    if (!amount) return res.status(400).json({ error: 'Invalid credit type', validTypes: Object.keys(CREDIT_RULES) });

    // Play cap: max 50 credits per story from plays
    if (type === 'play_received' && storyId) {
      const playCredits = await db.collection('kidCredits').doc(kidId).collection('transactions')
        .where('type', '==', 'play_received')
        .where('storyId', '==', storyId)
        .get();
      if (playCredits.size >= 50) {
        return res.json({ awarded: false, reason: 'Play credit cap reached for this story', balance: null });
      }
    }

    const credRef = db.collection('kidCredits').doc(kidId);
    const { FieldValue } = await import('firebase-admin/firestore');

    // Ensure doc exists
    const snap = await credRef.get();
    if (!snap.exists) {
      await credRef.set({ kidId, parentUid: parentUid || '', balance: 0, totalEarned: 0, streak: 0, lastStoryDate: null });
    }

    // Award
    await credRef.update({
      balance: FieldValue.increment(amount),
      totalEarned: FieldValue.increment(amount),
    });

    // Log transaction
    const txRef = credRef.collection('transactions').doc();
    await txRef.set({
      type,
      amount,
      storyId: storyId || null,
      description: `${type.replace(/_/g, ' ')} (+${amount} ⭐)`,
      createdAt: new Date().toISOString(),
    });

    // Check streak (only for story_created)
    if (type === 'story_created') {
      const today = new Date().toISOString().slice(0, 10);
      const data = (await credRef.get()).data();
      const lastDate = data?.lastStoryDate?.slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

      let newStreak = 1;
      if (lastDate === yesterday) {
        newStreak = (data.streak || 0) + 1;
      } else if (lastDate === today) {
        newStreak = data.streak || 1; // same day, keep streak
      }

      await credRef.update({ streak: newStreak, lastStoryDate: today });

      // Streak bonuses
      if (newStreak === 3) {
        await credRef.update({ balance: FieldValue.increment(CREDIT_RULES.streak_3), totalEarned: FieldValue.increment(CREDIT_RULES.streak_3) });
        await credRef.collection('transactions').doc().set({ type: 'streak_3', amount: CREDIT_RULES.streak_3, storyId: null, description: '3-day streak bonus! (+10 ⭐)', createdAt: new Date().toISOString() });
      }
      if (newStreak === 7) {
        await credRef.update({ balance: FieldValue.increment(CREDIT_RULES.streak_7), totalEarned: FieldValue.increment(CREDIT_RULES.streak_7) });
        await credRef.collection('transactions').doc().set({ type: 'streak_7', amount: CREDIT_RULES.streak_7, storyId: null, description: '7-day streak bonus! (+25 ⭐)', createdAt: new Date().toISOString() });
      }
    }

    // Return updated balance
    const updated = (await credRef.get()).data();
    return res.json({ awarded: true, amount, type, ...updated, ...getLevel(updated.totalEarned || 0) });
  }

  return res.status(400).json({ error: 'Invalid action. Use: balance, transactions, award' });
}
