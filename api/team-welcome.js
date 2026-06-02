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
  advisor: 'Advisor',
  ambassador: 'Ambassador',
};

function buildHtml(email, role) {
  const roleLabel = ROLE_LABELS[role] || role;
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:40px;">🌙</span>
      <h1 style="color:#f0a500;font-size:22px;margin:12px 0 4px;">You're a Tale Teller Now!</h1>
      <p style="color:#6e6a63;font-size:13px;margin:0;">Welcome Onboard</p>
    </div>

    <div style="background:#12121c;border-radius:16px;padding:28px;border:1px solid rgba(255,255,255,0.05);">
      <p style="color:#c8c3ba;font-size:15px;line-height:1.7;margin:0 0 16px;">
        Welcome to <strong style="color:#f5f0e8;">My Sleepy Tale</strong>! You are now part of the <strong style="color:#f0a500;">${roleLabel} team</strong>.
      </p>

      <p style="color:#c8c3ba;font-size:15px;line-height:1.7;margin:0 0 16px;">
        We are a small team with a big dream — building a bedtime stories app that helps kids fall asleep with stories rooted in their own culture, personalized with their name, and narrated with love. Every story we create reaches families around the world, and now you are part of that magic.
      </p>

      <p style="color:#c8c3ba;font-size:15px;line-height:1.7;margin:0 0 24px;">
        Here is how we work together:
      </p>

      <div style="background:#0a0a0f;border-radius:12px;padding:16px;margin-bottom:20px;">
        <p style="color:#f0a500;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Your Daily Tasks</p>
        <p style="color:#c8c3ba;font-size:13px;margin:0 0 8px;">Every morning at 7 AM, you will receive an email with your tasks for the day. You can also view and update them anytime at:</p>
        <a href="https://mysleepytale.com/my-tasks" style="display:inline-block;background:#f0a500;color:#0a0a0f;font-weight:bold;padding:10px 24px;border-radius:24px;font-size:14px;text-decoration:none;margin-top:4px;">Open My Tasks</a>
      </div>

      <div style="background:#0a0a0f;border-radius:12px;padding:16px;margin-bottom:20px;">
        <p style="color:#f0a500;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">The Website</p>
        <p style="color:#c8c3ba;font-size:13px;margin:0;">
          <a href="https://mysleepytale.com" style="color:#f0a500;">mysleepytale.com</a> — sign in with your Google account to explore the website.
        </p>
      </div>

      <p style="color:#c8c3ba;font-size:15px;line-height:1.7;margin:0;">
        If you have any questions, just reply to this email. We are so glad you are here. Let's build something beautiful together.
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
  return `Welcome to My Sleepy Tale — You're a Tale Teller Now!

Welcome! You are now part of the ${roleLabel} team.

We are a small team with a big dream — building a bedtime stories app that helps kids fall asleep with stories rooted in their own culture, personalized with their name, and narrated with love.

Your Daily Tasks:
Every morning at 7 AM, you will receive an email with your tasks for the day.
View and update them at: https://mysleepytale.com/my-tasks

The Website: https://mysleepytale.com

If you have any questions, just reply to this email. We are so glad you are here. Let's build something beautiful together.

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
      Destination: { ToAddresses: [email], CcAddresses: ['i@yprateek.com'] },
      Message: {
        Subject: { Data: `Welcome to My Sleepy Tale — You're a Tale Teller Now!` },
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
