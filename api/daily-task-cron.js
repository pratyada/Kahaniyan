// GET /api/daily-task-cron — Triggered by CloudWatch at 9 PM ET.
// Fetches last 24h of commits from GitHub, creates done-tasks in Firestore.

import { getFirestore } from './_firebase.js';

const GITHUB_REPO = 'pratyada/Kahaniyan';
const FOUNDER_EMAIL = 'prateekyadav2010@gmail.com';

function categorizeCommit(message) {
  const lower = message.toLowerCase();
  if (lower.includes('fix') || lower.includes('bug')) return { activity: 'tech', priority: 'normal', icon: '🐛' };
  if (lower.includes('feat') || lower.includes('add') || lower.includes('build')) return { activity: 'tech', priority: 'high', icon: '✨' };
  if (lower.includes('blog') || lower.includes('seo') || lower.includes('content')) return { activity: 'content', priority: 'normal', icon: '📝' };
  if (lower.includes('marketing') || lower.includes('email') || lower.includes('outreach')) return { activity: 'marketing', priority: 'normal', icon: '📣' };
  if (lower.includes('deploy') || lower.includes('infra')) return { activity: 'tech', priority: 'normal', icon: '🚀' };
  if (lower.includes('radio') || lower.includes('player')) return { activity: 'tech', priority: 'normal', icon: '🎵' };
  if (lower.includes('task') || lower.includes('team')) return { activity: 'content', priority: 'normal', icon: '📋' };
  return { activity: 'tech', priority: 'normal', icon: '⚙️' };
}

function parseCommitTitle(message) {
  let title = message
    .replace(/^(feat|fix|chore|docs|style|refactor|perf|test|ci|build)(\(.*?\))?:\s*/i, '')
    .split('\n')[0]
    .replace(/Co-Authored-By:.*/i, '')
    .trim();
  if (title.length > 0) title = title[0].toUpperCase() + title.slice(1);
  return title.slice(0, 200);
}

function parseCommitBody(message) {
  return message.split('\n').slice(1)
    .filter(l => l.trim() && !l.includes('Co-Authored-By'))
    .map(l => l.trim())
    .join('\n');
}

export default async function handler(req, res) {
  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  // Fetch commits from GitHub API (last 24h)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const ghToken = process.env.GITHUB_TOKEN; // optional, for private repos
  const headers = { 'user-agent': 'MySleepyTale-TaskSync' };
  if (ghToken) headers.authorization = `token ${ghToken}`;

  let commits = [];
  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/commits?since=${since}&per_page=50`;
    const ghRes = await fetch(url, { headers });
    if (!ghRes.ok) throw new Error(`GitHub API: ${ghRes.status}`);
    const data = await ghRes.json();
    commits = data.map(c => ({
      hash: c.sha,
      message: c.commit.message,
      author: c.commit.author.name,
      date: c.commit.author.date,
    }));
  } catch (e) {
    return res.status(500).json({ error: 'GitHub fetch failed: ' + e.message });
  }

  if (commits.length === 0) {
    return res.status(200).json({ created: 0, message: 'No commits in last 24h' });
  }

  const today = new Date().toISOString().slice(0, 10);
  let created = 0;
  let skipped = 0;

  for (const commit of commits) {
    const taskId = `auto_${commit.hash.slice(0, 12)}`;

    // Skip if already exists
    const existing = await db.collection('dailyTasks').doc(taskId).get();
    if (existing.exists) { skipped++; continue; }

    const title = parseCommitTitle(commit.message);
    if (!title || title.length < 5) { skipped++; continue; }

    const { activity, priority, icon } = categorizeCommit(commit.message);
    const description = parseCommitBody(commit.message);

    await db.collection('dailyTasks').doc(taskId).set({
      id: taskId,
      title: `${icon} ${title}`,
      description: description || `Commit ${commit.hash.slice(0, 7)} by ${commit.author}`,
      assignee: 'prateek',
      assigneeEmail: FOUNDER_EMAIL,
      category: activity,
      activity,
      priority,
      status: 'done',
      dueDate: today,
      source: 'git-auto-sync',
      commitHash: commit.hash,
      commitDate: commit.date,
      createdAt: new Date().toISOString(),
    });
    created++;
  }

  return res.status(200).json({ created, skipped, total: commits.length, date: today });
}
