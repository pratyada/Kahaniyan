// Upload outreach leads to Firestore — one-time script
// Usage: node scripts/upload-outreach-leads.mjs

import { readFileSync } from 'fs';
import { config } from 'dotenv';
import admin from 'firebase-admin';

// Load .env
config();
config({ path: '.env.prod', override: false });

const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!raw) { console.error('FIREBASE_SERVICE_ACCOUNT env var not set'); process.exit(1); }

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(raw)),
});
const db = admin.firestore();

const leads = JSON.parse(readFileSync('/tmp/outreach_leads.json', 'utf8'));
console.log(`Uploading ${leads.length} leads to Firestore...`);

let created = 0, skipped = 0;

for (let i = 0; i < leads.length; i++) {
  const lead = leads[i];
  const docId = lead.email.replace(/[^a-zA-Z0-9@._-]/g, '_');

  // Check if already exists
  const existing = await db.collection('outreachLeads').doc(docId).get();
  if (existing.exists) {
    skipped++;
    continue;
  }

  await db.collection('outreachLeads').doc(docId).set({
    ...lead,
    status: 'new',           // new | contacted | responded | signed_up | paid | not_interested
    outreachSent: false,
    outreachSentAt: null,
    signedUp: false,
    signedUpAt: null,
    isPaid: false,
    paidAt: null,
    tags: [],
    createdAt: new Date().toISOString(),
  });
  created++;

  if ((i + 1) % 100 === 0) console.log(`  ${i + 1}/${leads.length}...`);
}

console.log(`\nDone! Created: ${created}, Skipped (existing): ${skipped}`);
process.exit(0);
