// One-time test endpoint to send a sample task email preview.
// POST /api/test-email-preview { to: "email@example.com" }

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

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

const sampleTasks = [
  { title: 'Day 1/30 — Daily Platform X marketing post', activity: 'marketing', priority: 'normal', status: 'todo', description: 'Post daily marketing content on Platform X (Twitter). Day 1 of 30-day marketing campaign.' },
  { title: 'Write 3 new bedtime stories for Filipino collection', activity: 'content', priority: 'high', status: 'in_progress', description: 'Continue expanding Filipino cultural stories series.' },
  { title: 'Fix audio player buffering on mobile Safari', activity: 'tech', priority: 'urgent', status: 'todo', description: 'Users reported playback stops after 30 seconds on iOS.' },
  { title: 'Design new series cover art for Islamic Heroes', activity: 'design', priority: 'normal', status: 'done', description: 'Cover images for the 5 new Islamic Heroes episodes.' },
  { title: 'Reach out to 5 mommy bloggers for partnerships', activity: 'outreach', priority: 'high', status: 'todo', description: 'Target parenting influencers with 10K+ followers.' },
  { title: 'Update team expense tracker with May receipts', activity: 'ops', priority: 'low', status: 'todo', description: 'Upload remaining receipts from May purchases.' },
];

function buildMorningHtml(name, tasks, dayLabel) {
  const actColors = { content: '#9f7aea', marketing: '#f0a500', tech: '#4299e1', design: '#f472b6', ops: '#48bb78', outreach: '#ed8936' };
  const priColors = { urgent: '#f3727f', high: '#f0a500', normal: '#6e6a63', low: '#4a4a5a' };

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
        ${tasks.length} tasks today
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

function buildEveningHtml(allTasks, dayLabel) {
  const actColors = { content: '#9f7aea', marketing: '#f0a500', tech: '#4299e1', design: '#f472b6', ops: '#48bb78', outreach: '#ed8936' };
  const done = allTasks.filter(t => t.status === 'done');
  const pending = allTasks.filter(t => t.status !== 'done');
  const blocked = allTasks.filter(t => t.status === 'blocked');
  const pct = allTasks.length > 0 ? Math.round((done.length / allTasks.length) * 100) : 0;

  const byAssignee = { 'prateekyadav': { done: allTasks.filter(t => t.status === 'done'), pending: allTasks.filter(t => t.status !== 'done') } };

  let memberSections = '';
  for (const [name, data] of Object.entries(byAssignee)) {
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
        <div style="margin-bottom:8px;">
          <h3 style="color:#f5f0e8;font-size:14px;margin:0;display:inline;">👤 ${name}</h3>
          <span style="color:#6e6a63;font-size:12px;margin-left:12px;">${data.done.length}/${memberTotal} done (${memberPct}%)</span>
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

    <table style="width:100%;border-collapse:collapse;margin-bottom:28px;text-align:center;">
      <tr>
        <td style="padding:16px;background:#48bb7815;border:1px solid #48bb7830;border-radius:12px;">
          <div style="font-size:28px;font-weight:bold;color:#48bb78;">${done.length}</div>
          <div style="font-size:11px;color:#6e6a63;margin-top:4px;">Completed</div>
        </td>
        <td style="width:12px;"></td>
        <td style="padding:16px;background:#f0a50015;border:1px solid #f0a50030;border-radius:12px;">
          <div style="font-size:28px;font-weight:bold;color:#f0a500;">${pending.length}</div>
          <div style="font-size:11px;color:#6e6a63;margin-top:4px;">Pending</div>
        </td>
        <td style="width:12px;"></td>
        <td style="padding:16px;background:#f3727f15;border:1px solid #f3727f30;border-radius:12px;">
          <div style="font-size:28px;font-weight:bold;color:#f3727f;">${blocked.length}</div>
          <div style="font-size:11px;color:#6e6a63;margin-top:4px;">Blocked</div>
        </td>
      </tr>
    </table>

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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const to = req.body?.to;
  if (!to || !to.includes('@')) return res.status(400).json({ error: 'Provide "to" email' });

  const dayLabel = 'Tuesday, June 3, 2026 (Sample)';

  // Send both morning + evening preview
  const results = [];

  try {
    await ses.send(new SendEmailCommand({
      Source: `My Sleepy Tale <${FROM_EMAIL}>`,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: 'SAMPLE: Your Tasks for Tuesday, June 3 — My Sleepy Tale' },
        Body: { Html: { Data: buildMorningHtml('Team Member', sampleTasks, dayLabel) } },
      },
    }));
    results.push({ type: 'morning', status: 'sent' });
  } catch (e) { results.push({ type: 'morning', status: 'failed', error: e.message }); }

  try {
    await ses.send(new SendEmailCommand({
      Source: `My Sleepy Tale <${FROM_EMAIL}>`,
      Destination: { ToAddresses: [to] },
      Message: {
        Subject: { Data: 'SAMPLE: EOD Summary: 1/6 done — Tuesday, June 3 — My Sleepy Tale' },
        Body: { Html: { Data: buildEveningHtml(sampleTasks, dayLabel) } },
      },
    }));
    results.push({ type: 'evening', status: 'sent' });
  } catch (e) { results.push({ type: 'evening', status: 'failed', error: e.message }); }

  return res.json({ to, results });
}
