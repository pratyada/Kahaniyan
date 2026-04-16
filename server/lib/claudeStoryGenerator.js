// Claude-powered story generation — fun, silly, kid-appropriate.
// Replaces template-based stories with fresh AI-generated ones.

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

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
}) {
  if (!ANTHROPIC_KEY) return null;

  const pronoun = gender === 'girl' ? 'she/her' : gender === 'boy' ? 'he/him' : 'they/them';
  const castList = (selectedCast || [])
    .filter((c) => c.relation !== 'self')
    .map((c) => `${c.name} (${c.relation}${c.traits ? `, ${c.traits}` : ''})`)
    .join(', ');

  const family = [];
  if (familyMembers?.sibling) family.push(`Sibling: ${familyMembers.sibling}`);
  if (familyMembers?.grandfather) family.push(`Grandfather: ${familyMembers.grandfather}`);
  if (familyMembers?.grandmother) family.push(`Grandmother: ${familyMembers.grandmother}`);
  if (familyMembers?.pet) family.push(`Pet: ${familyMembers.pet}`);

  const wordTarget = Math.round(duration * 150);

  const systemPrompt = `You are the world's best bedtime storyteller for young children. You create stories that make kids giggle, feel safe, and drift gently to sleep.

YOUR VOICE RULES (CRITICAL — follow these exactly):
- Short sentences. 8-12 words max. Some even shorter. Like this.
- Use fun sounds throughout: "WHOOOOSH!", "splish-splash!", "BONK!", "wheeeee!", "pitter-patter", "KABOOM!", "shhhhhh"
- Repeat things kids love: "again and again and again", "bigger and bigger and BIGGER"
- Give characters silly voices and actions: "whispered Bruno, wagging his tail SO fast it was a blur"
- Ask the child direct questions: "Can you guess what happened next?", "Do you know what she found?"
- Use big fun words: "ENORMOUS", "teeny-tiny", "super-duper", "bazillion", "fantastical", "magnificently"
- Add giggly silly moments mixed with warmth
- The last 3-4 paragraphs must get sleepier: sentences slow down, voice gets softer, words get dreamier
- End with the child falling asleep: "And as ${childName}'s eyes grew heavy... sweet dreams, little one."
- NEVER be scary. NEVER be sad. Always warm, safe, magical.
- Value/lesson (${value}) must be woven in NATURALLY through the story — never stated as a moral or lecture.

STRUCTURE:
1. Fun exciting opening that hooks the child
2. Adventure/problem with the characters
3. Silly moments + the value emerges naturally
4. Gentle wind-down — slower, softer, dreamier
5. Sleep ending — eyes closing, warmth, goodnight

ABOUT THE CHILD:
- Name: ${childName} (pronouns: ${pronoun})
- Age: ${age} years old
- Adjust vocabulary and complexity for this exact age
${family.length > 0 ? `- Family: ${family.join(', ')}` : ''}
${castList ? `- Tonight's cast: ${castList}` : ''}
${beliefs?.length > 0 ? `- Cultural background: ${beliefs.join(', ')}` : ''}
${country ? `- Country: ${country}` : ''}

TARGET: ~${wordTarget} words (${duration} minute story at bedtime reading pace)
LANGUAGE: ${language}${language !== 'English' ? ' (write natively in this language, not translated)' : ''}
VALUE TO TEACH: ${value}`;

  const userMessage = whisper
    ? `Tonight's context: "${whisper}". Create a bedtime story that gently addresses this through the lens of ${value}. Make it fun and light — not heavy. The child should giggle before they sleep.`
    : `Create a fun, silly, warm bedtime story about ${value}. Use ${childName}'s name and family members throughout. Make it magical and giggly.`;

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
        max_tokens: Math.max(1000, wordTarget * 2),
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

    // Extract a title from the first line if it looks like one
    const lines = text.split('\n').filter((l) => l.trim());
    let title = 'Tonight\'s Story';
    let body = text;
    if (lines[0] && lines[0].length < 80 && !lines[0].endsWith('.')) {
      title = lines[0].replace(/^[#*\s]+/, '').replace(/[*#]+$/, '').trim();
      body = lines.slice(1).join('\n').trim();
    }

    return {
      title,
      text: body,
      wordCount: body.split(/\s+/).length,
      generatedBy: 'claude',
    };
  } catch (err) {
    console.error('Claude generation failed:', err);
    return null;
  }
}
