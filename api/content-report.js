// POST /api/content-report — Report inappropriate content
// Saves to Firestore contentReports collection.
// Auto-hides content after 3 reports (sets status to 'flagged').

import { getFirestore } from './_firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { contentId, contentType, reason, description, reportedBy, reporterEmail } = req.body || {};
  if (!contentId || !reason) return res.status(400).json({ error: 'contentId and reason required' });

  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Firestore not available' });

  // Save report
  const reportRef = db.collection('contentReports').doc();
  await reportRef.set({
    id: reportRef.id,
    contentId,
    contentType: contentType || 'story',
    reason,
    description: (description || '').slice(0, 500),
    reportedBy: reportedBy || 'anonymous',
    reporterEmail: reporterEmail || '',
    status: 'open',
    createdAt: new Date().toISOString(),
  });

  // Count total reports for this content
  const reportsSnap = await db.collection('contentReports')
    .where('contentId', '==', contentId)
    .where('status', '==', 'open')
    .get();
  const reportCount = reportsSnap.size;

  // Auto-hide after 3 reports
  if (reportCount >= 3) {
    // Try to flag in kidStories
    try {
      const storyRef = db.collection('kidStories').doc(contentId);
      const storySnap = await storyRef.get();
      if (storySnap.exists) {
        await storyRef.update({ status: 'flagged', flaggedAt: new Date().toISOString(), flagReason: reason });
      }
    } catch {}

    // Try to flag in creatorStories
    try {
      const creatorRef = db.collection('creatorStories').doc(contentId);
      const creatorSnap = await creatorRef.get();
      if (creatorSnap.exists) {
        await creatorRef.update({ status: 'flagged', flaggedAt: new Date().toISOString(), flagReason: reason });
      }
    } catch {}
  }

  return res.json({
    reported: true,
    reportId: reportRef.id,
    totalReports: reportCount,
    autoHidden: reportCount >= 3,
  });
}
