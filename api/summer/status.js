// GET /api/summer/status?uid=xxx — Get summer adventure status.
// Also handles POST for creating new adventures and updating stats.

import { getFirestore } from '../_firebase.js';

export default async function handler(req, res) {
  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  if (req.method === 'GET') {
    const uid = req.query?.uid;
    if (!uid) return res.status(400).json({ error: 'uid required' });

    // Get active adventure
    const snap = await db.collection('summerAdventures')
      .where('uid', '==', uid)
      .where('status', '==', 'active')
      .limit(1).get();

    if (snap.empty) return res.status(200).json({ adventure: null });

    const adventure = { id: snap.docs[0].id, ...snap.docs[0].data() };

    // Get day progress
    const daysSnap = await db.collection('summerAdventures').doc(adventure.id)
      .collection('days').orderBy('dayNumber').get();
    const days = daysSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    return res.status(200).json({ adventure, days });
  }

  if (req.method === 'POST') {
    const { uid, action, adventureId, data } = req.body || {};
    if (!uid) return res.status(400).json({ error: 'uid required' });

    // Create new adventure
    if (action === 'create') {
      const { childName, childAge, reportCard, growthProfile } = data || {};
      const ref = await db.collection('summerAdventures').add({
        uid,
        childName: childName || 'Explorer',
        childAge: childAge || 5,
        reportCard: reportCard || {},
        growthProfile: growthProfile || { strengths: [], growthAreas: [] },
        curriculum: null,
        stats: {
          totalXP: 0, daysCompleted: 0, missionsCompleted: 0,
          reflectionsCompleted: 0, perfectDays: 0,
          longestStreak: 0, currentStreak: 0,
        },
        status: 'active',
        createdAt: new Date().toISOString(),
        completedAt: null,
      });
      return res.status(200).json({ adventureId: ref.id });
    }

    // Complete mission
    if (action === 'complete-mission' && adventureId) {
      const { dayNumber } = data || {};
      const dayRef = db.collection('summerAdventures').doc(adventureId).collection('days').doc(String(dayNumber));
      await dayRef.update({
        'mission.completed': true,
        'mission.completedAt': new Date().toISOString(),
      });
      // Add XP
      const advRef = db.collection('summerAdventures').doc(adventureId);
      const { FieldValue } = await import('firebase-admin/firestore');
      await advRef.update({
        'stats.missionsCompleted': FieldValue.increment(1),
        'stats.totalXP': FieldValue.increment(15),
      });
      await dayRef.update({ xpEarned: FieldValue.increment(15) });
      return res.status(200).json({ xpEarned: 15 });
    }

    // Complete reflection
    if (action === 'complete-reflection' && adventureId) {
      const { dayNumber, feeling, answer } = data || {};
      const dayRef = db.collection('summerAdventures').doc(adventureId).collection('days').doc(String(dayNumber));
      await dayRef.update({
        'reflection.feeling': feeling,
        'reflection.answer': answer,
        'reflection.completedAt': new Date().toISOString(),
      });
      const { FieldValue } = await import('firebase-admin/firestore');
      const advRef = db.collection('summerAdventures').doc(adventureId);
      await advRef.update({
        'stats.reflectionsCompleted': FieldValue.increment(1),
        'stats.totalXP': FieldValue.increment(5),
      });
      await dayRef.update({ xpEarned: FieldValue.increment(5) });
      return res.status(200).json({ xpEarned: 5 });
    }

    // Complete day (story listened)
    if (action === 'complete-day' && adventureId) {
      const { dayNumber } = data || {};
      const dayRef = db.collection('summerAdventures').doc(adventureId).collection('days').doc(String(dayNumber));
      const daySnap = await dayRef.get();
      const dayData = daySnap.data() || {};

      await dayRef.update({ status: 'completed' });

      const { FieldValue } = await import('firebase-admin/firestore');
      const advRef = db.collection('summerAdventures').doc(adventureId);
      let xp = 10; // story XP

      // Check if perfect day
      if (dayData.mission?.completed && dayData.reflection?.completedAt) {
        xp += 10; // perfect day bonus
        await advRef.update({ 'stats.perfectDays': FieldValue.increment(1) });
      }

      await advRef.update({
        'stats.daysCompleted': FieldValue.increment(1),
        'stats.totalXP': FieldValue.increment(xp),
      });
      await dayRef.update({ xpEarned: FieldValue.increment(xp) });

      // Unlock next day
      const nextDay = parseInt(dayNumber) + 1;
      if (nextDay <= 56) {
        const nextRef = db.collection('summerAdventures').doc(adventureId).collection('days').doc(String(nextDay));
        const nextSnap = await nextRef.get();
        if (nextSnap.exists) {
          await nextRef.update({ status: 'available' });
        }
      }

      return res.status(200).json({ xpEarned: xp, nextDay: nextDay <= 56 ? nextDay : null });
    }

    return res.status(400).json({ error: 'Unknown action' });
  }

  return res.status(405).json({ error: 'GET or POST only' });
}
