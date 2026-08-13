// Privacy Policy — COPPA compliant, kids safety focused.

import PageTransition from '../components/PageTransition.jsx';

export default function Privacy() {
  return (
    <PageTransition className="page-scroll px-5 pt-10 pb-32 safe-top">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-4xl">🔒</span>
          <h1 className="mt-2 text-2xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>Privacy Policy</h1>
          <p className="mt-1 text-xs text-ink-muted">Last updated: August 13, 2026</p>
        </div>

        <div className="space-y-6 text-sm text-ink-muted leading-relaxed">
          <Section title="Our Promise to Families">
            <p>My Sleepy Tale is built for families with children aged 3-10. We take your family's privacy seriously. This policy explains what data we collect, how we use it, and how we protect your children.</p>
            <p className="mt-2 font-bold text-gold">We do not collect personal data directly from children. All accounts are created and managed by parents or guardians.</p>
          </Section>

          <Section title="Children's Privacy (COPPA Compliance)">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>No child accounts:</strong> Children do not create their own accounts. Parents sign in with Google and manage their child's profile.</li>
              <li><strong>No data from children:</strong> We do not ask children for their email, location, phone number, or any personal information.</li>
              <li><strong>Child profiles are sub-profiles:</strong> A child's name and age are stored under the parent's account, not as a separate child account.</li>
              <li><strong>Voice recordings:</strong> When children use our creator features, their voice recordings are stored under the parent's account. Parents can view and delete all recordings at any time.</li>
              <li><strong>No tracking of children:</strong> We do not use cookies, advertising trackers, or analytics to track children's behavior.</li>
              <li><strong>Parental control:</strong> Parents can delete their child's profile, stories, and all associated data at any time from Settings.</li>
            </ul>
          </Section>

          <Section title="What We Collect">
            <p>When a parent creates an account, we collect:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Parent's email address</strong> — for login and account recovery (via Google Sign-In)</li>
              <li><strong>Parent's display name</strong> — from Google profile</li>
              <li><strong>Child's first name and age</strong> — for story personalization (stored under parent's account)</li>
              <li><strong>Language and country preferences</strong> — for content and voice selection</li>
              <li><strong>Cultural/belief preferences</strong> — to show relevant stories (optional)</li>
            </ul>
          </Section>

          <Section title="Voice Recordings">
            <p>Our Kids Creator feature allows children to record voice stories. These recordings are:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Stored securely on AWS S3 (encrypted at rest)</li>
              <li>Associated with the parent's account, not the child</li>
              <li>Deletable by the parent at any time</li>
              <li>Screened by AI for inappropriate content before publishing</li>
              <li>Only made public with explicit parent approval</li>
            </ul>
          </Section>

          <Section title="Content Safety">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>AI content moderation:</strong> All kid-created stories are reviewed by AI before they can be shared publicly. Stories containing inappropriate language, violence, or personal information are blocked.</li>
              <li><strong>Parent approval:</strong> Public stories require parent approval before other families can see them.</li>
              <li><strong>Report system:</strong> Any user can report inappropriate content. Reported content is automatically hidden and reviewed by our team.</li>
              <li><strong>Human review:</strong> Our team reviews flagged content within 24 hours.</li>
            </ul>
          </Section>

          <Section title="How We Use Data">
            <ul className="list-disc pl-5 space-y-1">
              <li>Personalize bedtime stories with the child's name</li>
              <li>Show culturally relevant content based on family preferences</li>
              <li>Send parents weekly newsletters (opt-out available)</li>
              <li>Improve our platform and fix bugs</li>
            </ul>
            <p className="mt-2">We <strong>never</strong> sell, rent, or share personal data with third parties for advertising purposes.</p>
          </Section>

          <Section title="Data Storage & Security">
            <ul className="list-disc pl-5 space-y-1">
              <li>Data is stored on Google Firebase (Firestore) and AWS S3</li>
              <li>All data is encrypted in transit (HTTPS/TLS) and at rest</li>
              <li>Access to data is restricted to authorized team members only</li>
              <li>We do not store payment information — all payments are processed by Stripe</li>
            </ul>
          </Section>

          <Section title="Your Rights">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Access:</strong> You can view all data we have about your family in Settings</li>
              <li><strong>Delete:</strong> You can delete your account and all associated data at any time</li>
              <li><strong>Unsubscribe:</strong> You can unsubscribe from emails in Settings or via the link in any email</li>
              <li><strong>Export:</strong> Contact us at hello@mysleepytale.com to request a data export</li>
            </ul>
          </Section>

          <Section title="Contact Us">
            <p>If you have any questions about this privacy policy or how we handle your family's data:</p>
            <p className="mt-2">
              <strong className="text-ink">Email:</strong> hello@mysleepytale.com<br />
              <strong className="text-ink">Location:</strong> Toronto, Ontario, Canada
            </p>
          </Section>
        </div>
      </div>
    </PageTransition>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-2xl bg-bg-surface p-5 ring-1 ring-white/5">
      <h2 className="text-base font-bold text-ink mb-3" style={{ fontFamily: 'Lora, serif' }}>{title}</h2>
      <div className="text-sm text-ink-muted leading-relaxed">{children}</div>
    </div>
  );
}
