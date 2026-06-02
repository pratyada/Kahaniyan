// Send welcome email when a team member is added.
// POST /api/team-welcome { email, role, addedBy }

import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const FROM_EMAIL = 'hello@mysleepytale.com';
const ses = new SESClient({ region: 'us-east-1' });

const ROLE_LABELS = {
  tester: 'Tester',
  marketing: 'Marketing',
  content: 'Content Creator',
  dev: 'Developer',
};

function buildHtml(email, role) {
  const roleLabel = ROLE_LABELS[role] || role;
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:40px;">🌙</span>
      <h1 style="color:#f0a500;font-size:22px;margin:12px 0 4px;">Welcome to the Team!</h1>
      <p style="color:#6e6a63;font-size:13px;margin:0;">My Sleepy Tale</p>
    </div>

    <div style="background:#12121c;border-radius:16px;padding:28px;border:1px solid rgba(255,255,255,0.05);">
      <p style="color:#c8c3ba;font-size:15px;line-height:1.7;margin:0 0 16px;">
        You have been added to the <strong style="color:#f5f0e8;">My Sleepy Tale</strong> team as a <strong style="color:#f0a500;">${roleLabel}</strong>.
      </p>

      <p style="color:#c8c3ba;font-size:15px;line-height:1.7;margin:0 0 16px;">
        My Sleepy Tale is a bedtime stories app for kids — personalized, multilingual, and rooted in cultural traditions. We are building something meaningful for families around the world, and we are glad to have you on board.
      </p>

      <p style="color:#c8c3ba;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Here is what you need to know:
      </p>

      <div style="background:#0a0a0f;border-radius:12px;padding:16px;margin-bottom:20px;">
        <p style="color:#f0a500;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Your Daily Tasks</p>
        <p style="color:#c8c3ba;font-size:13px;margin:0 0 8px;">Every morning at 7 AM, you will receive an email with your tasks for the day. You can also view and update them anytime at:</p>
        <a href="https://mysleepytale.com/my-tasks" style="display:inline-block;background:#f0a500;color:#0a0a0f;font-weight:bold;padding:10px 24px;border-radius:24px;font-size:14px;text-decoration:none;margin-top:4px;">Open My Tasks</a>
      </div>

      <div style="background:#0a0a0f;border-radius:12px;padding:16px;margin-bottom:20px;">
        <p style="color:#f0a500;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">The App</p>
        <p style="color:#c8c3ba;font-size:13px;margin:0;">
          <a href="https://mysleepytale.com" style="color:#f0a500;">mysleepytale.com</a> — sign in with your Google account to explore the app.
        </p>
      </div>

      <p style="color:#c8c3ba;font-size:15px;line-height:1.7;margin:0;">
        If you have any questions, just reply to this email. Welcome aboard!
      </p>
    </div>

    <p style="color:#4a4a5a;font-size:11px;text-align:center;margin-top:32px;">
      My Sleepy Tale · Bedtime Stories for Kids
    </p>
  </div>
</body>
</html>`;
}

function buildText(email, role) {
  const roleLabel = ROLE_LABELS[role] || role;
  return `Welcome to the My Sleepy Tale Team!

You have been added as a ${roleLabel}.

My Sleepy Tale is a bedtime stories app for kids — personalized, multilingual, and rooted in cultural traditions.

Your Daily Tasks:
Every morning at 7 AM, you will receive an email with your tasks for the day.
View and update them at: https://mysleepytale.com/my-tasks

The App: https://mysleepytale.com

If you have any questions, just reply to this email. Welcome aboard!

— My Sleepy Tale Team`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { email, role } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });

  const roleLabel = ROLE_LABELS[role] || role || 'Team Member';

  try {
    await ses.send(new SendEmailCommand({
      Source: `My Sleepy Tale <${FROM_EMAIL}>`,
      Destination: { ToAddresses: [email] },
      Message: {
        Subject: { Data: `Welcome to My Sleepy Tale — You're now a ${roleLabel}!` },
        Body: {
          Text: { Data: buildText(email, role) },
          Html: { Data: buildHtml(email, role) },
        },
      },
    }));
    console.log(`[team-welcome] Sent to ${email} as ${role}`);
    return res.json({ sent: true, email, role });
  } catch (e) {
    console.error('[team-welcome] Send error:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
