// POST /api/reddit-post — Post an approved comment to Reddit.
// Body: { uid, leadId, draftIndex }
// Uses Reddit API to post the comment. Tracks karma.

import { getFirestore } from './_firebase.js';

async function getRedditToken() {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const username = process.env.REDDIT_USERNAME;
  const password = process.env.REDDIT_PASSWORD;

  if (!clientId || !clientSecret || !username || !password) return null;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'authorization': `Basic ${auth}`,
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'MySleepyTale/1.0',
    },
    body: `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, leadId, draftIndex = 0 } = req.body || {};
  if (!uid || !leadId) return res.status(400).json({ error: 'uid and leadId required' });

  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const leadRef = db.collection('redditLeads').doc(leadId);
  const leadSnap = await leadRef.get();
  if (!leadSnap.exists) return res.status(404).json({ error: 'Lead not found' });
  const lead = leadSnap.data();

  if (!lead.drafts || !lead.drafts[draftIndex]) {
    return res.status(400).json({ error: 'Draft not found at index ' + draftIndex });
  }

  const comment = lead.drafts[draftIndex];

  // Try to post to Reddit
  const token = await getRedditToken();

  if (!token) {
    // No Reddit credentials — mark as approved but not posted
    await leadRef.update({
      status: 'approved',
      approvedDraft: draftIndex,
      approvedComment: comment,
      approvedAt: new Date().toISOString(),
      postNote: 'Reddit API not configured — comment approved but needs manual posting.',
    });

    // Send to Slack for manual posting
    const slackWebhook = process.env.SLACK_WEBHOOK_URL;
    if (slackWebhook) {
      try {
        await fetch(slackWebhook, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            text: `✅ *Comment Approved — Manual Post Needed*\n\n*Subreddit:* r/${lead.subreddit}\n*Post:* ${lead.title}\n\n*Comment to post:*\n>${comment.replace(/\n/g, '\n>')}\n\n<${lead.url}|Open Reddit Post>`,
          }),
        });
      } catch {}
    }

    return res.status(200).json({
      status: 'approved',
      message: 'Comment approved. Reddit API not configured — post manually.',
      comment,
      redditUrl: lead.url,
    });
  }

  // Post to Reddit
  try {
    const postRes = await fetch('https://oauth.reddit.com/api/comment', {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${token}`,
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'MySleepyTale/1.0',
      },
      body: `thing_id=t3_${lead.redditId}&text=${encodeURIComponent(comment)}`,
    });

    if (!postRes.ok) {
      const err = await postRes.text();
      throw new Error(`Reddit API error: ${postRes.status} — ${err}`);
    }

    const postData = await postRes.json();
    const commentId = postData?.json?.data?.things?.[0]?.data?.id;

    await leadRef.update({
      status: 'posted',
      approvedDraft: draftIndex,
      approvedComment: comment,
      approvedAt: new Date().toISOString(),
      postedAt: new Date().toISOString(),
      commentId: commentId || null,
      karmaGained: 0,
    });

    // Notify Slack
    const slackWebhook = process.env.SLACK_WEBHOOK_URL;
    if (slackWebhook) {
      try {
        await fetch(slackWebhook, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            text: `✅ *Comment Posted to Reddit*\n\n*r/${lead.subreddit}:* ${lead.title}\n*Comment:* ${comment.slice(0, 200)}...\n\n<${lead.url}|View Thread>`,
          }),
        });
      } catch {}
    }

    return res.status(200).json({ status: 'posted', commentId });

  } catch (e) {
    await leadRef.update({ status: 'drafted' }); // revert on failure
    return res.status(500).json({ error: e.message });
  }
}
