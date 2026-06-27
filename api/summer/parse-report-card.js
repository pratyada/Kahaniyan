// POST /api/summer/parse-report-card — Upload report card image, Claude vision extracts data.
// Body: { uid, image (base64), contentType }
// Returns: { extractedData: { childName, grade, subjects, strengths, growthAreas, teacherNotes } }

import { getFirestore } from '../_firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, image, contentType } = req.body || {};
  if (!uid || !image) return res.status(400).json({ error: 'uid and image required' });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  try {
    // Send image to Claude vision for extraction
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: contentType || 'image/jpeg', data: image },
            },
            {
              type: 'text',
              text: `You are analyzing a child's school report card or progress report. This could be from ANY format:

- Ontario Kindergarten Communication of Learning (has "Demonstrating Literacy and Mathematics Behaviours", "Problem Solving and Innovating", learning frameworks — this IS a valid report card)
- Ontario Elementary Progress Report or Report Card
- US report cards, UK school reports
- Any school assessment document with student information

IMPORTANT: Ontario Kindergarten reports describe learning frameworks alongside student observations. Do NOT reject these as "instructional documents" — they ARE the student's report card.

Extract whatever student-specific information you can find. If the page mainly describes learning expectations/frameworks, still extract the skill areas mentioned and mark them as "on-track" by default.

Return ONLY valid JSON with this structure:
{
  "childName": "name if visible, or null",
  "grade": "JK/SK/Grade 1/Grade 2/etc or null",
  "school": "school name if visible, or null",
  "term": "Term 1/Term 2/Final/etc or null",
  "subjects": [
    { "name": "Reading", "level": "strong|on-track|growing|needs-support", "comments": "teacher comment if any" }
  ],
  "strengths": [
    { "skill": "creativity", "label": "Creativity", "evidence": "brief evidence from report" }
  ],
  "growthAreas": [
    { "skill": "math-problem-solving", "label": "Math Problem Solving", "level": "growing", "evidence": "brief evidence" }
  ],
  "learningSkills": [
    { "skill": "self-regulation", "label": "Self-Regulation", "level": "strong|developing|needs-support" }
  ],
  "teacherNotes": ["direct quote or paraphrase of notable teacher comments"],
  "recommendations": ["any teacher suggestions for next steps"]
}

If a page only shows learning framework descriptions without specific student data, extract the skill categories mentioned (e.g., "Literacy", "Mathematics", "Problem Solving") as subjects with level "on-track" and note "Framework description — upload student-specific pages for detailed assessment."

Map everything to friendly, positive labels. Never use negative language.
"Needs support" not "failing". "Growing" not "behind". "Building" not "struggling".

NEVER return an error saying this is not a report card. Always extract whatever you can.`,
            },
          ],
        }],
      }),
    });

    if (!apiRes.ok) throw new Error(`Claude API: ${apiRes.status}`);
    const data = await apiRes.json();
    const text = data.content?.[0]?.text || '';

    let extractedData;
    try {
      const match = text.match(/\{[\s\S]*\}/);
      extractedData = JSON.parse(match[0]);
    } catch {
      return res.status(400).json({ error: 'Could not parse report card. Please try a clearer photo.' });
    }

    if (extractedData.error) {
      return res.status(400).json({ error: extractedData.error });
    }

    // Upload image to S3 for reference
    let imageUrl = null;
    try {
      const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
      const s3 = new S3Client({ region: 'us-east-1' });
      const filename = `summer/report-cards/${uid}_${Date.now()}.jpg`;
      await s3.send(new PutObjectCommand({
        Bucket: 'mysleepytale-app', Key: filename,
        Body: Buffer.from(image, 'base64'),
        ContentType: contentType || 'image/jpeg',
        CacheControl: 'private, max-age=31536000',
      }));
      imageUrl = `https://mysleepytale.com/${filename}`;
    } catch {}

    return res.status(200).json({
      extractedData,
      imageUrl,
      tokens: { input: data.usage?.input_tokens || 0, output: data.usage?.output_tokens || 0 },
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
