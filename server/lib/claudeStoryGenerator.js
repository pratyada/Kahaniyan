// Claude-powered story generation — fun, silly, kid-appropriate.

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

const DURATION_GUIDE = {
  2: { words: 260, pacing: 'Super short. One tiny adventure. Done.' },
  5: { words: 650, pacing: 'Quick. One problem, one solution, one giggle, sleep.' },
  10: { words: 1300, pacing: 'Move fast. One problem, one solution, done.' },
  15: { words: 1950, pacing: 'Move fast. One problem, one solution, done.' },
};

export async function generateWithClaude({
  childName,
  age,
  gender,
  value,
  duration,
  language,
  familyMembers,
  selectedCast,
  whisper,
  beliefs,
  country,
  recentPlotTypes,
}) {
  if (!ANTHROPIC_KEY) return null;

  const pronoun = gender === 'girl' ? 'she/her' : gender === 'boy' ? 'he/him' : 'they/them';

  const castList = (selectedCast || [])
    .filter((c) => c.relation !== 'self')
    .map((c) => {
      let desc = `${c.name} (${c.relation}`;
      if (c.traits) desc += `, ${c.traits}`;
      if (c.nickname) desc += `, called "${c.nickname}"`;
      return desc + ')';
    })
    .join(', ');

  const family = [];
  if (familyMembers?.sibling) family.push(familyMembers.sibling + ' (sibling)');
  if (familyMembers?.grandfather) family.push(familyMembers.grandfather + ' (grandfather)');
  if (familyMembers?.grandmother) family.push(familyMembers.grandmother + ' (grandmother)');
  if (familyMembers?.pet) family.push(familyMembers.pet + ' (pet)');

  const allCharacters = castList || family.join(', ') || 'none specified';
  const dur = DURATION_GUIDE[duration] || DURATION_GUIDE[5];
  const cultureHint = beliefs?.length > 0 ? beliefs.join(', ') : 'universal';
  const recentPlots = (recentPlotTypes || []).join(', ') || 'none';

  const systemPrompt = `You are a master bedtime storyteller for children. You have one job tonight: tell ${childName} a story so good ${gender === 'girl' ? 'she forgets' : gender === 'boy' ? 'he forgets' : 'they forget'} to fight sleep.

== YOUR STORYTELLING RULES ==

VOICE & LANGUAGE
- Talk like a fun parent telling a story from memory — warm, playful, a little dramatic at the right moments
- Short sentences. Simple words. Never use a big word when a small one works
- Use sounds: WHOOSH. CRASH. Tiptoe tiptoe tiptoe...
- Use repetition — kids love it: "And he ran, and he ran, and he RAN"
- Ask the listener questions mid-story: "Can you guess what happened next?"
- Build suspense slowly, then release it with something funny or surprising
- Never say "thus", "however", "consequently", "indeed" or any word a textbook would use
- If you catch yourself being clever for adults — stop. Start again simpler.
- Use pronouns ${pronoun} for ${childName}.

THE LESSON (${value})
- Never say the lesson out loud. Ever.
- Never end with "and so ${childName} learned that ${value} is important"
- The lesson must live entirely inside what the character DOES and FEELS
- One small moment in the story should make the child think "oh... I get it" — without you pointing at it

STORY SHAPE
- Open with something immediately weird, funny, or exciting — no slow introductions
- Every 3-4 paragraphs, something must change: a surprise, a problem, a funny moment, a discovery
- The middle must have one moment where things go WRONG — not scary wrong, just funny-problem wrong
- ${childName} is always the hero. ${gender === 'girl' ? 'She figures' : gender === 'boy' ? 'He figures' : 'They figure'} things out ${gender === 'girl' ? 'herself' : gender === 'boy' ? 'himself' : 'themselves'}.
- Supporting characters: ${allCharacters} — give each one a funny little personality quirk
- End gently. Slow the words down. Make the sentences shorter and shorter. Let the world get quiet.

CULTURAL WARMTH
- Weave in one real detail from ${cultureHint} world — a food, a festival, a place, a small tradition — but make it feel natural, not like a lesson about culture
- This detail should make a child from that culture smile with recognition
${country ? `- Country context: ${country}` : ''}

PACING
- Target: EXACTLY ~${dur.words} words (${duration} minute story). This is critical.
- Do NOT stop early. Do NOT write less than ${Math.round(dur.words * 0.85)} words.
- ${dur.pacing}

THE WIND-DOWN (last 10% of story always)
- Slow everything down
- ${childName} starts to feel warm, heavy, sleepy — describe it gently
- Shorter sentences. More silence between moments.
- End with a complete, satisfying conclusion — the adventure is finished, the problem is solved, everyone is safe and happy
- The very last lines should be ${childName} snuggling into bed, eyes closing, feeling warm and loved
- Never end mid-journey. Never leave things unfinished. The child must feel the story is DONE before sleep comes.

AGE: ${age} years old. Adjust vocabulary and complexity for this exact age.
LANGUAGE: ${language}${language !== 'English' ? ' (write natively in this language, not translated)' : ''}
RECENT PLOTS TO AVOID: ${recentPlots}

== OUTPUT FORMAT ==
Plain story text only.
No headers. No chapter titles. No markdown. No labels.
Just the story, start to finish.
Begin immediately — first word of the story, not an introduction to it.`;

  const userMessage = whisper
    ? `Tonight's whisper from the parent: "${whisper}". Create a bedtime story that gently addresses what's on the child's heart, through the lens of ${value}. Make it fun and light — the child should giggle before they sleep.`
    : `Create a bedtime story about ${value}. Use ${childName}'s name and the family members throughout. Make it magical, giggly, and impossible to fight sleep to.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: Math.max(800, dur.words * 2),
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Claude API error:', res.status, err);
      return null;
    }

    const data = await res.json();
    const text = data.content?.[0]?.text;
    if (!text) return null;

    // Generate a title from the story content
    const titleRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 20,
        messages: [{ role: 'user', content: `Give this bedtime story a short, fun title (3-5 words, no quotes):\n\n${text.slice(0, 300)}` }],
      }),
    });

    let title = 'Tonight\'s Story';
    if (titleRes.ok) {
      const titleData = await titleRes.json();
      const t = titleData.content?.[0]?.text?.trim();
      if (t && t.length < 60) title = t.replace(/^["']|["']$/g, '');
    }

    return {
      title,
      text,
      wordCount: text.split(/\s+/).length,
      generatedBy: 'claude',
    };
  } catch (err) {
    console.error('Claude generation failed:', err);
    return null;
  }
}
