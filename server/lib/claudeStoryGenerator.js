// Claude-powered story generation — driven by Story Lab content engine.

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

const DURATION_GUIDE = {
  2: { words: 350, pacing: 'Super short. One tiny adventure. Done.' },
  5: { words: 850, pacing: 'Full story. One main adventure with a subplot or side moment — maybe a character does something funny on the way, or they stop to help someone, or explore a place. Fill the time naturally.' },
  10: { words: 1600, pacing: 'Rich story. Main adventure plus side moments — characters doing silly things, exploring, discovering, small interactions that teach without being preachy.' },
  15: { words: 2400, pacing: 'Full adventure. Main plot plus subplots — characters have their own little moments, discoveries, funny side quests. Fill the world with life.' },
};

// Pick random items from an array
function pickRandom(arr, n = 1) {
  if (!arr?.length) return [];
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, arr.length));
}

// Build dynamic prompt sections from Story Lab config
function buildStoryLabPrompt(lab, { beliefs, country, value, age }) {
  if (!lab) return '';
  const parts = [];

  // ── Character Archetypes ──
  if (lab.archetypes?.length) {
    parts.push('CHARACTER PERSONALITY GUIDE (use these traits & activities — never stereotypes):');
    for (const a of lab.archetypes) {
      parts.push(`- ${a.defaultCall || a.key} (${a.callOptions?.join('/')  || a.key}): personality: ${a.traits}. Does: ${a.activities}`);
    }
  }

  // ── Cultural References ──
  const beliefKey = beliefs?.[0] || 'secular';
  const culture = lab.culturalRefs?.[beliefKey] || lab.culturalRefs?.secular;
  if (culture) {
    parts.push('');
    parts.push('CULTURAL REFERENCE BANK (pick 2-3 from these, never repeat the same ones):');
    if (culture.foods?.length) parts.push(`  Foods: ${pickRandom(culture.foods, 6).join(', ')}`);
    if (culture.festivals?.length) parts.push(`  Festivals: ${pickRandom(culture.festivals, 4).join(', ')}`);
    if (culture.traditions?.length) parts.push(`  Traditions: ${pickRandom(culture.traditions, 4).join(', ')}`);
    if (culture.places?.length) parts.push(`  Places: ${pickRandom(culture.places, 4).join(', ')}`);
    if (culture.music?.length) parts.push(`  Sounds/Music: ${pickRandom(culture.music, 3).join(', ')}`);
    if (culture.games?.length) parts.push(`  Games: ${pickRandom(culture.games, 3).join(', ')}`);
    if (culture.clothing?.length) parts.push(`  Clothing: ${pickRandom(culture.clothing, 3).join(', ')}`);
    if (culture.greetings?.length) parts.push(`  Greetings: ${pickRandom(culture.greetings, 2).join(', ')}`);
  }

  // ── Story Openers ──
  if (lab.storyOpeners?.length) {
    const ageNum = parseInt(age) || 5;
    const suitable = lab.storyOpeners.filter((o) => {
      if (!o.ages) return true;
      const [lo, hi] = o.ages.split('-').map(Number);
      return ageNum >= lo && ageNum <= hi;
    });
    const picks = pickRandom(suitable.length ? suitable : lab.storyOpeners, 3);
    parts.push('');
    parts.push('OPENING HOOK IDEAS (use one of these styles or something equally strong):');
    for (const o of picks) {
      parts.push(`  [${o.type}] "${o.text}"`);
    }
  }

  // ── Plot Twists ──
  if (lab.plotTwists?.length) {
    const picks = pickRandom(lab.plotTwists, 3);
    parts.push('');
    parts.push('PLOT TWIST IDEAS (weave one of these or similar into the middle):');
    for (const t of picks) {
      parts.push(`  - ${t}`);
    }
  }

  // ── Sound Effects ──
  if (lab.soundFx?.length) {
    const picks = pickRandom(lab.soundFx, 5);
    parts.push('');
    parts.push('SOUND EFFECTS TO USE (weave 3-4 of these naturally into the story):');
    for (const fx of picks) {
      parts.push(`  ${fx.sound} — ${fx.when}`);
    }
  }

  // ── World Settings ──
  if (lab.settings?.length) {
    const ageNum = parseInt(age) || 5;
    const suitable = lab.settings.filter((s) => {
      if (!s.ages) return true;
      const [lo, hi] = s.ages.split('-').map(Number);
      return ageNum >= lo && ageNum <= hi;
    });
    const pick = pickRandom(suitable.length ? suitable : lab.settings, 1)[0];
    if (pick) {
      parts.push('');
      parts.push(`WORLD SETTING SUGGESTION: ${pick.emoji} ${pick.name} — ${pick.description}`);
      parts.push('(You may use this setting or create your own, but make the world vivid and specific)');
    }
  }

  // ── Wind-down Patterns ──
  if (lab.windDowns?.length) {
    const pick = pickRandom(lab.windDowns, 2);
    parts.push('');
    parts.push('WIND-DOWN INSPIRATION (end the story with this feeling):');
    for (const w of pick) {
      parts.push(`  "${w}"`);
    }
  }

  // ── Value Delivery Guide ──
  if (lab.valueDelivery?.length) {
    const guide = lab.valueDelivery.find((v) => v.value === value);
    if (guide) {
      parts.push('');
      parts.push(`HOW TO DELIVER THE LESSON (${value}):`);
      parts.push(`  DO: ${guide.doThis}`);
      parts.push(`  DON'T: ${guide.notThis}`);
    }
  }

  // ── Age Guide ──
  if (lab.ageGuides?.length) {
    const ageNum = parseInt(age) || 5;
    const guide = lab.ageGuides.find((g) => {
      const [lo, hi] = g.range.split('-').map(Number);
      return ageNum >= lo && ageNum <= hi;
    });
    if (guide) {
      parts.push('');
      parts.push(`AGE-SPECIFIC GUIDE (${guide.range} years):`);
      parts.push(`  Vocabulary: ${guide.vocab}`);
      parts.push(`  Humor: ${guide.humor}`);
      parts.push(`  Themes: ${guide.themes}`);
      parts.push(`  Pacing: ${guide.attention}`);
    }
  }

  // ── Global Rules (admin-configured) ──
  if (lab.globalRules?.length) {
    parts.push('');
    parts.push('MANDATORY RULES (never violate these):');
    for (const rule of lab.globalRules) {
      parts.push(`  - ${rule}`);
    }
  }

  return parts.length > 0 ? '\n\n== STORY LAB CONTENT GUIDE ==\n' + parts.join('\n') : '';
}

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
  _storyLab,
  _archetypes, // legacy — now part of _storyLab
}) {
  if (!ANTHROPIC_KEY) return null;

  // Merge legacy _archetypes into _storyLab
  const lab = _storyLab || {};
  if (_archetypes?.length && !lab.archetypes?.length) {
    lab.archetypes = _archetypes;
  }

  const pronoun = gender === 'girl' ? 'she/her' : gender === 'boy' ? 'he/him' : 'they/them';

  const castList = (selectedCast || [])
    .filter((c) => c.relation !== 'self')
    .map((c) => {
      let desc = `${c.name} (${c.relation}`;
      if (c.gender) desc += `, ${c.gender === 'boy' ? 'he/him' : c.gender === 'girl' ? 'she/her' : c.gender}`;
      if (c.nickname) desc += `, ${childName} calls them "${c.nickname}"`;
      if (c.tags?.length) desc += `, loves: ${c.tags.join(', ')}`;
      else if (c.traits) desc += `, ${c.traits}`;
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

  // Build Story Lab dynamic prompt
  const storyLabPrompt = buildStoryLabPrompt(lab, { beliefs, country, value, age });

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
- USE WHAT CHARACTERS LOVE: If a character loves dinosaurs, put dinosaurs in the story. If they love cricket, weave cricket into the adventure. If they love space, set a scene in space. Their interests should shape the plot, not just be mentioned.
- USE NICKNAMES: If the child calls someone "Dadu" or "Chiku", use that name in the story — it makes it feel like home.
- USE THE RIGHT PRONOUNS: Respect each character's gender (he/him, she/her) as specified.
- NEVER use stereotypical gender roles. Grandmothers are NOT always cooking in the kitchen. Grandfathers are NOT always reading newspapers. Women can be adventurous, strong, silly, inventive. Men can be gentle, nurturing, creative. Give every character surprising, non-stereotypical traits and activities. Break expectations.
- End gently. Slow the words down. Make the sentences shorter and shorter. Let the world get quiet.

CULTURAL WARMTH & RELIGIOUS SENSITIVITY
- Weave in 2-3 real details from ${cultureHint} world — foods, festivals, places, traditions — but make them feel natural, not like a lesson about culture
- These details should make a child from that culture smile with recognition
- VARY your cultural references every story — never repeat the same ones
- When referring to Prophet Muhammad in Islamic culture, ALWAYS use the honorific "peace be upon him" after his name
- NEVER create content that could hurt religious sentiments of ANY faith — no mocking, no negative portrayal, no controversial interpretations of religious figures or practices
- Treat ALL religious figures, scriptures, and traditions with deep respect and reverence
- If unsure whether something might be sensitive, leave it out — err on the side of respect
${country ? `- Country context: ${country}` : ''}

FILLING THE TIME NATURALLY
- Characters should have small side moments — a funny observation, helping someone along the way, discovering something curious, a silly interaction between supporting characters
- Add sensory details: what they smell, hear, feel. Describe the world around them
- Supporting characters can have their own tiny arcs or funny bits that run alongside the main plot
- These moments should feel organic, not like filler — each one should either be funny, teach something subtly, or build the world

PACING
- Target: EXACTLY ~${dur.words} words (${duration} minute story). This is critical.
- Do NOT stop early. Do NOT write less than ${Math.round(dur.words * 0.85)} words. If you're under, ADD more story moments.
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
${storyLabPrompt}

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
        max_tokens: Math.max(1200, dur.words * 2.5),
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
      if (t && t.length < 60) title = t.replace(/^["'*#\s]+|["'*#\s]+$/g, '').trim();
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
