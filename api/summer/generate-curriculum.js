// POST /api/summer/generate-curriculum — Generate 8-week summer adventure plan.
// Body: { uid, adventureId, growthProfile, childName, childAge, tradition, theme }
// Returns: { curriculum: { weeks: [...], totalDays: 56 } }

import { getFirestore } from '../_firebase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { uid, adventureId, growthProfile, childName, childAge, tradition, adventureTheme } = req.body || {};
  if (!uid || !growthProfile) return res.status(400).json({ error: 'uid and growthProfile required' });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });

  const strengths = (growthProfile.strengths || []).map(s => s.label).join(', ');
  const gaps = (growthProfile.growthAreas || []).map(g => `${g.label} (${g.level})`).join(', ');

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4000,
        system: `You are a children's education specialist designing a personalized 8-week summer learning adventure for a child.

Rules:
- Every day must feel like an ADVENTURE, never homework
- Stories should secretly reinforce growth areas but feel like fun
- Missions are real-world activities (2-5 min), never worksheets
- Difficulty increases gently from week 1 (easy) to week 8 (challenging)
- Celebrate strengths too, not just work on weaknesses
- Age-appropriate for ${childAge || 5} year olds
- Monday-Friday: daily adventure. Weekend: family story mission
- Each week has a fun theme name (e.g., "The Mountain Climbers", "Ocean Explorers")
- Use soft, positive language. Never say "practice" or "improve" — say "explore" or "discover"`,
        messages: [{
          role: 'user',
          content: `Design an 8-week Summer Adventure for ${childName || 'this child'} (age ${childAge || 5}).

Strengths: ${strengths || 'curiosity, imagination'}
Growth areas: ${gaps || 'reading confidence, number sense'}
Adventure style: ${adventureTheme || 'explorer'}
Cultural tradition: ${tradition || 'universal'}

Return ONLY valid JSON:
{
  "adventureTitle": "The Summer of [creative title]",
  "weeks": [
    {
      "weekNumber": 1,
      "theme": "fun theme name",
      "constellationName": "constellation name for the star map",
      "primarySkill": "growth area being targeted",
      "secondarySkill": "second skill or strength being celebrated",
      "description": "one-line adventure description",
      "days": [
        {
          "dayNumber": 1,
          "dayOfWeek": "Monday",
          "storyPrompt": "detailed story prompt that secretly teaches [skill] through adventure",
          "missionTitle": "fun mission name",
          "missionDescription": "2-5 min real-world activity",
          "missionType": "count|draw|observe|move|create|talk|measure|find",
          "reflectionQuestion": "simple question for the child",
          "targetSkill": "specific skill being reinforced"
        }
      ]
    }
  ]
}

Generate all 8 weeks with 7 days each (Mon-Fri = daily adventures, Sat-Sun = family missions).`
        }],
      }),
    });

    if (!apiRes.ok) throw new Error(`Claude API: ${apiRes.status}`);
    const data = await apiRes.json();
    const text = data.content?.[0]?.text || '';

    let curriculum;
    try {
      const match = text.match(/\{[\s\S]*\}/);
      curriculum = JSON.parse(match[0]);
    } catch {
      return res.status(500).json({ error: 'Failed to generate curriculum. Please try again.' });
    }

    // Save to Firestore if adventureId provided
    if (adventureId) {
      const db = await getFirestore();
      if (db) {
        await db.collection('summerAdventures').doc(adventureId).update({
          curriculum,
          'curriculum.generatedAt': new Date().toISOString(),
        });

        // Create day documents
        const weeks = curriculum.weeks || [];
        for (const week of weeks) {
          for (const day of (week.days || [])) {
            await db.collection('summerAdventures').doc(adventureId)
              .collection('days').doc(String(day.dayNumber)).set({
                ...day,
                weekNumber: week.weekNumber,
                weekTheme: week.theme,
                constellationName: week.constellationName,
                story: { title: null, audioUrl: null, generatedAt: null },
                mission: { ...day, completed: false, completedAt: null },
                reflection: { feeling: null, answer: null, completedAt: null },
                xpEarned: 0,
                status: day.dayNumber === 1 ? 'available' : 'locked',
              });
          }
        }

        // Unlock day 1
        await db.collection('summerAdventures').doc(adventureId)
          .collection('days').doc('1').update({ status: 'available' });
      }
    }

    return res.status(200).json({ curriculum });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
