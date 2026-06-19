// POST /api/reddit-scan — Scan Reddit subreddits for keyword matches.
// Uses Reddit API (OAuth2) to search posts. Stores leads in Firestore.
// Env: REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD

import { getFirestore } from './_firebase.js';

const SUBREDDITS = ['Parenting', 'daddit', 'Mommit', 'toddlers', 'SideProject', 'startups', 'edtech', 'InternetIsBeautiful', 'worldcup', 'ProductHunt'];
const KEYWORDS = ['bedtime story', 'parenting app', 'personalized stories', 'kids reading', 'screen time kids', 'toddler bedtime', 'multicultural kids', 'audio stories', 'bedtime routine', 'kids audiobook'];
const FOUNDER_UID = 'prateekyadav2010@gmail.com';

async function getRedditToken() {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  const username = process.env.REDDIT_USERNAME;
  const password = process.env.REDDIT_PASSWORD;

  if (!clientId || !clientSecret) return null;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const body = username && password
    ? `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
    : 'grant_type=client_credentials';

  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'authorization': `Basic ${auth}`,
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': 'MySleepyTale/1.0',
    },
    body,
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token;
}

async function searchReddit(token, subreddit, keyword) {
  const url = `https://oauth.reddit.com/r/${subreddit}/search?q=${encodeURIComponent(keyword)}&restrict_sr=1&sort=new&limit=10&t=day`;
  const res = await fetch(url, {
    headers: {
      'authorization': `Bearer ${token}`,
      'user-agent': 'MySleepyTale/1.0',
    },
  });

  if (!res.ok) return [];
  const data = await res.json();
  return (data.data?.children || []).map(c => c.data);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  // Get Reddit token
  const token = await getRedditToken();

  if (!token) {
    // No Reddit credentials — create mock leads for testing the UI
    const mockLeads = [
      {
        redditId: 'mock_' + Date.now() + '_1',
        subreddit: 'Parenting',
        title: 'My 4-year-old won\'t go to bed without a story but I\'m too tired to read every night',
        selfText: 'Any suggestions for audio alternatives? We\'ve tried YouTube but the screen keeps them up longer...',
        url: 'https://reddit.com/r/Parenting/mock1',
        score: 47,
        numComments: 23,
        matchedKeyword: 'bedtime story',
        author: 'tired_parent_2026',
        status: 'new',
        createdAt: new Date().toISOString(),
      },
      {
        redditId: 'mock_' + Date.now() + '_2',
        subreddit: 'daddit',
        title: 'Looking for a screen-free bedtime routine for my toddler. What works for you?',
        selfText: 'My daughter is 3 and we\'re trying to cut screen time before bed. She loves stories but I run out of ideas...',
        url: 'https://reddit.com/r/daddit/mock2',
        score: 31,
        numComments: 15,
        matchedKeyword: 'screen time kids',
        author: 'new_dad_toronto',
        status: 'new',
        createdAt: new Date().toISOString(),
      },
      {
        redditId: 'mock_' + Date.now() + '_3',
        subreddit: 'SideProject',
        title: 'I built an audio bedtime story platform with 200+ stories in 9 languages — looking for feedback',
        selfText: 'Would love to hear what other builders think about the approach...',
        url: 'https://reddit.com/r/SideProject/mock3',
        score: 12,
        numComments: 8,
        matchedKeyword: 'audio stories',
        author: 'indie_builder',
        status: 'new',
        createdAt: new Date().toISOString(),
      },
    ];

    let created = 0;
    for (const lead of mockLeads) {
      const existing = await db.collection('redditLeads').where('redditId', '==', lead.redditId).limit(1).get();
      if (existing.empty) {
        await db.collection('redditLeads').add(lead);
        created++;
      }
    }

    return res.status(200).json({ leadsFound: created, mode: 'mock', message: 'Reddit API not configured — using mock data. Set REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET in Lambda env.' });
  }

  // Real Reddit scan
  let leadsFound = 0;
  const seenIds = new Set();

  for (const subreddit of SUBREDDITS) {
    for (const keyword of KEYWORDS) {
      try {
        const posts = await searchReddit(token, subreddit, keyword);
        for (const post of posts) {
          if (seenIds.has(post.id)) continue;
          seenIds.add(post.id);

          // Check if already stored
          const existing = await db.collection('redditLeads').where('redditId', '==', post.id).limit(1).get();
          if (!existing.empty) continue;

          await db.collection('redditLeads').add({
            redditId: post.id,
            subreddit: post.subreddit,
            title: post.title,
            selfText: (post.selftext || '').slice(0, 2000),
            url: `https://reddit.com${post.permalink}`,
            score: post.score,
            numComments: post.num_comments,
            matchedKeyword: keyword,
            author: post.author,
            status: 'new',
            createdAt: new Date().toISOString(),
            redditCreatedAt: new Date(post.created_utc * 1000).toISOString(),
          });
          leadsFound++;
        }
      } catch (e) {
        console.error(`[reddit-scan] Error scanning r/${subreddit} for "${keyword}":`, e.message);
      }
    }
  }

  return res.status(200).json({ leadsFound, mode: 'live' });
}
