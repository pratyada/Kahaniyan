// Evening summary cron — sends end-of-day task snapshot to all team members at 9:30PM ET.
// Shows completed vs pending tasks for the day.
// Triggered by CloudWatch Events or manually via POST /api/evening-summary

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'qissaa-61a78';
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;
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

async function getTodayTasks() {
  const today = new Date().toLocaleDateString('en-CA');
  try {
    const res = await fetch(`${FIRESTORE_URL}/dailyTasks`);
    if (!res.ok) return [];
    const data = await res.json();
    const docs = data.documents || [];
    return docs
      .map(d => {
        const f = d.fields || {};
        return {
          id: f.id?.stringValue || '',
          title: f.title?.stringValue || '',
          description: f.description?.stringValue || '',
          activity: f.activity?.stringValue || '',
          assignee: f.assignee?.stringValue || '',
          priority: f.priority?.stringValue || 'normal',
          status: f.status?.stringValue || 'todo',
          dueDate: f.dueDate?.stringValue || '',
        };
      })
      .filter(t => t.dueDate === today);
  } catch (e) {
    console.error('[evening-summary] Firestore error:', e.message);
    return [];
  }
}

async function getTeam() {
  try {
    const res = await fetch(`${FIRESTORE_URL}/config/admin`);
    if (!res.ok) return [];
    const data = await res.json();
    const teamField = data.fields?.team?.arrayValue?.values || [];
    return teamField.map(v => {
      const m = v.mapValue?.fields || {};
      return {
        email: m.email?.stringValue || '',
        name: m.name?.stringValue || '',
        role: m.role?.stringValue || '',
        status: m.status?.stringValue || 'active',
      };
    }).filter(m => m.status === 'active' && m.email);
  } catch (e) {
    console.error('[evening-summary] Team fetch error:', e.message);
    return [];
  }
}

function getAdminEmails() {
  return ['prateekyadav2010@gmail.com', 'sahil.faraz@gmail.com'];
}

function buildTextBody(allTasks, today) {
  const dayLabel = new Date(today + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const done = allTasks.filter(t => t.status === 'done');
  const pending = allTasks.filter(t => t.status !== 'done');
  const blocked = allTasks.filter(t => t.status === 'blocked');

  // Group by assignee
  const byAssignee = {};
  allTasks.forEach(t => {
    const key = t.assignee || 'Unassigned';
    if (!byAssignee[key]) byAssignee[key] = { done: [], pending: [] };
    if (t.status === 'done') byAssignee[key].done.push(t);
    else byAssignee[key].pending.push(t);
  });

  let body = `End of Day Summary — ${dayLabel}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Completed: ${done.length}/${allTasks.length}  |  ⏳ Pending: ${pending.length}  |  🚫 Blocked: ${blocked.length}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

  for (const [email, data] of Object.entries(byAssignee)) {
    const name = email.split('@')[0];
    const pct = data.done.length + data.pending.length > 0
      ? Math.round((data.done.length / (data.done.length + data.pending.length)) * 100) : 0;

    body += `👤 ${name} — ${data.done.length}/${data.done.length + data.pending.length} done (${pct}%)\n`;

    if (data.done.length > 0) {
      body += '   ✅ Completed:\n';
      data.done.forEach(t => { body += `      • ${t.title}\n`; });
    }
    if (data.pending.length > 0) {
      body += '   ⏳ Pending:\n';
      data.pending.forEach(t => {
        const flag = t.status === 'blocked' ? ' 🚫 BLOCKED' : t.priority === 'urgent' ? ' 🔴' : '';
        body += `      • ${t.title}${flag}\n`;
      });
    }
    body += '\n';
  }

  body += `──────────────────
— My Sleepy Tale Team

View tasks: https://mysleepytale.com/my-tasks`;

  return body;
}

function buildHtmlBody(allTasks, today) {
  const dayLabel = new Date(today + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  const done = allTasks.filter(t => t.status === 'done');
  const pending = allTasks.filter(t => t.status !== 'done');
  const blocked = allTasks.filter(t => t.status === 'blocked');
  const pct = allTasks.length > 0 ? Math.round((done.length / allTasks.length) * 100) : 0;

  // Group by assignee
  const byAssignee = {};
  allTasks.forEach(t => {
    const key = t.assignee || 'Unassigned';
    if (!byAssignee[key]) byAssignee[key] = { done: [], pending: [] };
    if (t.status === 'done') byAssignee[key].done.push(t);
    else byAssignee[key].pending.push(t);
  });

  const actColors = { content: '#9f7aea', marketing: '#f0a500', tech: '#4299e1', design: '#f472b6', ops: '#48bb78', outreach: '#ed8936' };

  let memberSections = '';
  for (const [email, data] of Object.entries(byAssignee)) {
    const name = email.split('@')[0];
    const memberTotal = data.done.length + data.pending.length;
    const memberPct = memberTotal > 0 ? Math.round((data.done.length / memberTotal) * 100) : 0;

    let taskRows = '';
    [...data.done, ...data.pending].forEach(t => {
      const isDone = t.status === 'done';
      const statusIcon = isDone ? '✅' : t.status === 'blocked' ? '🚫' : '⏳';
      taskRows += `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #1a1a28;font-size:16px;width:30px;">${statusIcon}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #1a1a28;">
            <span style="display:inline-block;padding:2px 6px;border-radius:8px;font-size:10px;font-weight:bold;background:${(actColors[t.activity] || '#666')}22;color:${actColors[t.activity] || '#666'};">${ACTIVITIES[t.activity] || t.activity}</span>
          </td>
          <td style="padding:8px 12px;border-bottom:1px solid #1a1a28;color:${isDone ? '#48bb78' : '#f5f0e8'};font-size:13px;${isDone ? 'text-decoration:line-through;opacity:0.7;' : ''}">
            ${t.title}
          </td>
        </tr>`;
    });

    memberSections += `
      <div style="margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <h3 style="color:#f5f0e8;font-size:14px;margin:0;">👤 ${name}</h3>
          <span style="color:#6e6a63;font-size:12px;">${data.done.length}/${memberTotal} done (${memberPct}%)</span>
        </div>
        <div style="background:#1a1a28;border-radius:8px;height:6px;overflow:hidden;margin-bottom:12px;">
          <div style="background:${memberPct === 100 ? '#48bb78' : '#f0a500'};height:100%;width:${memberPct}%;border-radius:8px;"></div>
        </div>
        <table style="width:100%;border-collapse:collapse;background:#12121c;border-radius:8px;overflow:hidden;">
          ${taskRows}
        </table>
      </div>`;
  }

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;margin-bottom:24px;">
      <span style="font-size:28px;">🌙</span>
      <h1 style="color:#f0a500;font-size:18px;margin:8px 0 4px;">End of Day Summary</h1>
      <p style="color:#6e6a63;font-size:13px;margin:0;">${dayLabel}</p>
    </div>

    <div style="display:flex;gap:12px;margin-bottom:28px;text-align:center;">
      <div style="flex:1;padding:16px;background:#48bb7815;border:1px solid #48bb7830;border-radius:12px;">
        <div style="font-size:28px;font-weight:bold;color:#48bb78;">${done.length}</div>
        <div style="font-size:11px;color:#6e6a63;margin-top:4px;">Completed</div>
      </div>
      <div style="flex:1;padding:16px;background:#f0a50015;border:1px solid #f0a50030;border-radius:12px;">
        <div style="font-size:28px;font-weight:bold;color:#f0a500;">${pending.length}</div>
        <div style="font-size:11px;color:#6e6a63;margin-top:4px;">Pending</div>
      </div>
      <div style="flex:1;padding:16px;background:#f3727f15;border:1px solid #f3727f30;border-radius:12px;">
        <div style="font-size:28px;font-weight:bold;color:#f3727f;">${blocked.length}</div>
        <div style="font-size:11px;color:#6e6a63;margin-top:4px;">Blocked</div>
      </div>
    </div>

    <div style="background:#1a1a28;border-radius:8px;height:8px;overflow:hidden;margin-bottom:8px;">
      <div style="background:${pct === 100 ? '#48bb78' : '#f0a500'};height:100%;width:${pct}%;border-radius:8px;"></div>
    </div>
    <p style="text-align:center;color:#6e6a63;font-size:12px;margin:0 0 28px;">${pct}% complete</p>

    ${memberSections}

    <p style="color:#4a4a5a;font-size:11px;text-align:center;margin-top:32px;">
      My Sleepy Tale · <a href="https://mysleepytale.com/my-tasks" style="color:#f0a500;">View Tasks</a>
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
  const today = new Date().toLocaleDateString('en-CA');
  console.log(`[evening-summary] Starting for ${today}`);

  const [allTasks, team] = await Promise.all([getTodayTasks(), getTeam()]);
  console.log(`[evening-summary] ${allTasks.length} tasks, ${team.length} team members`);

  if (allTasks.length === 0) {
    return res.json({ sent: 0, message: 'No tasks for today' });
  }

  const done = allTasks.filter(t => t.status === 'done');
  const pending = allTasks.filter(t => t.status !== 'done');
  const dayLabel = new Date(today + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
  const subject = `EOD Summary: ${done.length}/${allTasks.length} done — ${dayLabel} — My Sleepy Tale`;

  const textBody = buildTextBody(allTasks, today);
  const htmlBody = buildHtmlBody(allTasks, today);

  // Send to all active team members + admins
  const recipients = new Set();
  team.forEach(m => recipients.add(m.email));
  getAdminEmails().forEach(e => recipients.add(e));

  const results = [];
  for (const email of recipients) {
    try {
      await sendEmail(email, subject, textBody, htmlBody);
      results.push({ email, status: 'sent' });
      console.log(`[evening-summary] Sent to ${email}`);
    } catch (e) {
      results.push({ email, status: 'failed', error: e.message });
      console.error(`[evening-summary] Failed for ${email}:`, e.message);
    }
  }

  return res.json({
    sent: results.filter(r => r.status === 'sent').length,
    total: results.length,
    summary: { done: done.length, pending: pending.length, total: allTasks.length },
    results,
  });
}
