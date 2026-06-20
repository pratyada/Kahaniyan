// POST /api/daily-task-sync — Sync git commits + deploys from last 24h into dailyTasks.
// Triggered by CloudWatch cron at 9 PM ET daily, or manually.
// Reads git log from the last 24h, parses commit messages, creates tasks.

import { getFirestore } from './_firebase.js';

const FOUNDER_UID = 'prateekyadav2010@gmail.com';

// Categorize commits by keywords in the message
function categorizeCommit(message) {
  const lower = message.toLowerCase();
  if (lower.includes('fix') || lower.includes('bug')) return { activity: 'tech', priority: 'normal', icon: '🐛' };
  if (lower.includes('feat') || lower.includes('add') || lower.includes('build')) return { activity: 'tech', priority: 'high', icon: '✨' };
  if (lower.includes('blog') || lower.includes('seo') || lower.includes('content')) return { activity: 'content', priority: 'normal', icon: '📝' };
  if (lower.includes('marketing') || lower.includes('email') || lower.includes('outreach')) return { activity: 'marketing', priority: 'normal', icon: '📣' };
  if (lower.includes('deploy') || lower.includes('infra')) return { activity: 'tech', priority: 'normal', icon: '🚀' };
  if (lower.includes('style') || lower.includes('ui') || lower.includes('design')) return { activity: 'design', priority: 'normal', icon: '🎨' };
  if (lower.includes('task') || lower.includes('team')) return { activity: 'content', priority: 'normal', icon: '📋' };
  return { activity: 'tech', priority: 'normal', icon: '⚙️' };
}

// Parse a commit message into a clean task title
function commitToTitle(message) {
  // Remove conventional commit prefixes
  let title = message
    .replace(/^(feat|fix|chore|docs|style|refactor|perf|test|ci|build)(\(.*?\))?:\s*/i, '')
    .replace(/Co-Authored-By:.*/s, '')
    .trim();

  // Take first line only
  title = title.split('\n')[0].trim();

  // Capitalize first letter
  if (title.length > 0) title = title[0].toUpperCase() + title.slice(1);

  return title.slice(0, 200);
}

// Extract bullet points from commit body as description
function commitToDescription(message) {
  const lines = message.split('\n').filter(l => l.trim());
  // Skip first line (title) and Co-Authored-By
  const body = lines.slice(1)
    .filter(l => !l.includes('Co-Authored-By'))
    .map(l => l.trim())
    .filter(l => l.length > 0)
    .join('\n');
  return body || '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const db = await getFirestore();
  if (!db) return res.status(500).json({ error: 'Database unavailable' });

  const { commits } = req.body || {};

  if (!commits || !Array.isArray(commits) || commits.length === 0) {
    return res.status(400).json({ error: 'commits array required. Send from the cron script.' });
  }

  const today = new Date().toISOString().slice(0, 10);
  let created = 0;
  let skipped = 0;

  for (const commit of commits) {
    const taskId = `auto_commit_${commit.hash}`;

    // Check if already exists
    const existing = await db.collection('dailyTasks').doc(taskId).get();
    if (existing.exists) { skipped++; continue; }

    const { activity, priority, icon } = categorizeCommit(commit.message);
    const title = commitToTitle(commit.message);
    const description = commitToDescription(commit.message);

    if (!title || title.length < 5) { skipped++; continue; }

    await db.collection('dailyTasks').doc(taskId).set({
      id: taskId,
      title: `${icon} ${title}`,
      description: description || `Git commit: ${commit.hash.slice(0, 7)}\nAuthor: ${commit.author}\nDate: ${commit.date}`,
      assignee: 'prateek',
      assigneeEmail: FOUNDER_UID,
      category: activity,
      activity,
      priority,
      status: 'done',
      dueDate: today,
      source: 'git-sync',
      commitHash: commit.hash,
      commitDate: commit.date,
      createdAt: new Date().toISOString(),
    });
    created++;
  }

  return res.status(200).json({ created, skipped, total: commits.length, date: today });
}
