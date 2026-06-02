// Morning email cron — sends daily task briefs to team members at 7AM ET.
// Triggered by CloudWatch Events or manually via POST /api/morning-email
// Reads tasks from Firestore dailyTasks collection, sends via SES from hello@mysleepytale.com

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { getFirestore } from './_firebase.js';

const FROM_EMAIL = 'hello@mysleepytale.com';
const ses = new SESClient({ region: 'us-east-1' });

const ACTIVITIES = {
  content: '📝 Content',
  marketing: '📣 Marketing',
  tech: '💻 Tech',
  design: '🎨 Design',
  ops: '⚙️ Operations',
  outreach: '🤝 Outreach',
};

// Fetch today's tasks from Firestore (authenticated)
async function getTodayTasks() {
  const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
  try {
    const db = await getFirestore();
    if (!db) { console.error('[morning-email] Firestore not configured'); return []; }
    const snap = await db.collection('dailyTasks').where('dueDate', '==', today).get();
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(t => t.status !== 'done');
  } catch (e) {
    console.error('[morning-email] Firestore error:', e.message);
    return [];
  }
}

// Fetch team members from Firestore (authenticated)
async function getTeam() {
  try {
    const db = await getFirestore();
    if (!db) return [];
    const doc = await db.collection('config').doc('admin').get();
    if (!doc.exists) return [];
    const team = doc.data()?.team || [];
    return team.filter(m => m.status === 'active' && m.email);
  } catch (e) {
    console.error('[morning-email] Team fetch error:', e.message);
    return [];
  }
}

function buildEmailBody(name, tasks, today) {
  const dayLabel = new Date(today + 'T12:00:00').toLocaleDateString('en-CA', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const priFlag = (p) => p === 'urgent' ? ' 🔴 URGENT' : p === 'high' ? ' 🟡 HIGH' : '';
  const lines = tasks.map((t, i) =>
    `${i + 1}. [${ACTIVITIES[t.activity] || t.activity}]${priFlag(t.priority)} ${t.title}${t.description ? '\n   → ' + t.description : ''}`
  ).join('\n\n');

  return `Good morning ${name}!

Here are your tasks for ${dayLabel}:

${lines}

──────────────────
Total: ${tasks.length} task${tasks.length !== 1 ? 's' : ''}
Priority: ${tasks.filter(t => t.priority === 'urgent').length} urgent, ${tasks.filter(t => t.priority === 'high').length} high

Please reply to this email with your status update by end of day.

— My Sleepy Tale Team

Update your tasks: https://mysleepytale.com/my-tasks`;
}

function buildHtmlBody(name, tasks, today) {
  const dayLabel = new Date(today + 'T12:00:00').toLocaleDateString('en-CA', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const priColors = { urgent: '#f3727f', high: '#f0a500', normal: '#6e6a63', low: '#4a4a5a' };
  const actColors = { content: '#9f7aea', marketing: '#f0a500', tech: '#4299e1', design: '#f472b6', ops: '#48bb78', outreach: '#ed8936' };

  const taskRows = tasks.map(t => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #1a1a28;">
        <span style="display:inline-block;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:bold;background:${(actColors[t.activity] || '#666')}22;color:${actColors[t.activity] || '#666'};">${ACTIVITIES[t.activity] || t.activity}</span>
        ${t.priority === 'urgent' ? '<span style="margin-left:6px;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:bold;background:#f3727f33;color:#f3727f;">URGENT</span>' : ''}
        ${t.priority === 'high' ? '<span style="margin-left:6px;padding:2px 8px;border-radius:12px;font-size:10px;font-weight:bold;background:#f0a50033;color:#f0a500;">HIGH</span>' : ''}
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #1a1a28;color:#f5f0e8;font-weight:bold;font-size:14px;">
        ${t.title}
        ${t.description ? `<br><span style="font-weight:normal;font-size:12px;color:#6e6a63;">${t.description}</span>` : ''}
      </td>
    </tr>`).join('');

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:28px;">🌙</span>
      <h1 style="color:#f0a500;font-size:18px;margin:8px 0 4px;">My Sleepy Tale — Daily Tasks</h1>
      <p style="color:#6e6a63;font-size:13px;margin:0;">${dayLabel}</p>
    </div>

    <p style="color:#c8c3ba;font-size:15px;margin-bottom:24px;">Good morning <strong style="color:#f5f0e8;">${name}</strong>! Here are your tasks for today:</p>

    <table style="width:100%;border-collapse:collapse;background:#12121c;border-radius:12px;overflow:hidden;">
      <thead>
        <tr style="background:#1a1a28;">
          <th style="padding:10px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#6e6a63;">Activity</th>
          <th style="padding:10px 16px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#6e6a63;">Task</th>
        </tr>
      </thead>
      <tbody>${taskRows}</tbody>
    </table>

    <div style="margin-top:24px;padding:16px;background:#f0a50015;border:1px solid #f0a50030;border-radius:12px;text-align:center;">
      <p style="color:#f0a500;font-size:13px;font-weight:bold;margin:0 0 4px;">
        ${tasks.length} task${tasks.length !== 1 ? 's' : ''} today
        ${tasks.filter(t => t.priority === 'urgent').length > 0 ? ' · ' + tasks.filter(t => t.priority === 'urgent').length + ' urgent' : ''}
      </p>
      <p style="color:#6e6a63;font-size:12px;margin:0;">Reply to this email with your status update by end of day.</p>
    </div>

    <p style="color:#4a4a5a;font-size:11px;text-align:center;margin-top:32px;">
      My Sleepy Tale · <a href="https://mysleepytale.com/my-tasks" style="color:#f0a500;">Update My Tasks</a>
    </p>
  </div>
</body>
</html>`;
}

async function sendEmail(to, subject, textBody, htmlBody) {
  const cmd = new SendEmailCommand({
    Source: `My Sleepy Tale <${FROM_EMAIL}>`,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: {
        Text: { Data: textBody },
        Html: { Data: htmlBody },
      },
    },
  });
  return ses.send(cmd);
}

export default async function handler(req, res) {
  // Allow both POST (manual trigger) and GET (cron trigger)
  const today = new Date().toLocaleDateString('en-CA');
  console.log(`[morning-email] Starting for ${today}`);

  const [tasks, team] = await Promise.all([getTodayTasks(), getTeam()]);
  console.log(`[morning-email] ${tasks.length} tasks, ${team.length} team members`);

  if (tasks.length === 0) {
    return res.json({ sent: 0, message: 'No tasks for today' });
  }

  // Group tasks by assignee
  const byAssignee = {};
  tasks.forEach(t => {
    const key = t.assignee || '';
    if (!byAssignee[key]) byAssignee[key] = [];
    byAssignee[key].push(t);
  });

  const results = [];
  for (const [email, memberTasks] of Object.entries(byAssignee)) {
    if (!email || !email.includes('@')) continue;
    const member = team.find(m => m.email === email);
    const name = member?.name || email.split('@')[0];
    const subject = `Your Tasks for ${new Date(today + 'T12:00:00').toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' })} — My Sleepy Tale`;

    try {
      const textBody = buildEmailBody(name, memberTasks, today);
      const htmlBody = buildHtmlBody(name, memberTasks, today);
      await sendEmail(email, subject, textBody, htmlBody);
      results.push({ email, tasks: memberTasks.length, status: 'sent' });
      console.log(`[morning-email] Sent to ${email} (${memberTasks.length} tasks)`);
    } catch (e) {
      results.push({ email, tasks: memberTasks.length, status: 'failed', error: e.message });
      console.error(`[morning-email] Failed for ${email}:`, e.message);
    }
  }

  return res.json({ sent: results.filter(r => r.status === 'sent').length, total: results.length, results });
}
