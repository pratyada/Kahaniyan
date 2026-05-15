// Static reflection question bank — keyed by theme and value.
// Each story gets 2 questions: always an emoji feeling + a value-based choice.

const FEELING_QUESTION = {
  type: 'emoji',
  prompt: 'How did this story make you feel?',
  options: [
    { emoji: '🥰', label: 'Loved' },
    { emoji: '🤔', label: 'Thoughtful' },
    { emoji: '😢', label: 'Moved' },
    { emoji: '💪', label: 'Strong' },
    { emoji: '😴', label: 'Sleepy' },
  ],
};

const THEME_QUESTIONS = {
  'compassion-animals': {
    type: 'choice',
    prompt: 'What small kind thing can you do tomorrow?',
    options: ['Be gentle with an animal', 'Help someone who is sad', 'Share my food', 'Say something kind'],
  },
  courage: {
    type: 'choice',
    prompt: 'When can you be brave like the hero in the story?',
    options: ['Try something new', 'Stand up for a friend', 'Speak up when I\'m scared', 'Keep going when it\'s hard'],
  },
  wisdom: {
    type: 'choice',
    prompt: 'What did this story teach you?',
    options: ['Think before acting', 'Listen to others', 'Be patient', 'Look at things differently'],
  },
  honesty: {
    type: 'choice',
    prompt: 'When is it important to tell the truth?',
    options: ['Even when it\'s hard', 'When someone asks me', 'When I make a mistake', 'Always'],
  },
  sharing: {
    type: 'choice',
    prompt: 'What can you share with someone tomorrow?',
    options: ['A toy or book', 'My time', 'A kind word', 'My food or snack'],
  },
  humility: {
    type: 'choice',
    prompt: 'What does being humble mean to you?',
    options: ['Not showing off', 'Listening to everyone', 'Saying thank you', 'Helping without being asked'],
  },
  forgiveness: {
    type: 'choice',
    prompt: 'When someone makes a mistake, what should you do?',
    options: ['Give them another chance', 'Talk about how I feel', 'Remember I make mistakes too', 'Let it go'],
  },
};

const VALUE_QUESTIONS = {
  kindness: {
    type: 'choice',
    prompt: 'Who would you like to be kind to tomorrow?',
    options: ['A friend', 'A family member', 'Someone new', 'An animal'],
  },
  courage: THEME_QUESTIONS.courage,
  honesty: THEME_QUESTIONS.honesty,
  patience: {
    type: 'choice',
    prompt: 'When do you need to be patient?',
    options: ['Waiting my turn', 'Learning something new', 'When things don\'t go my way', 'Helping someone learn'],
  },
  gratitude: {
    type: 'choice',
    prompt: 'What are you grateful for today?',
    options: ['My family', 'My friends', 'Something I learned', 'Being healthy'],
  },
  sharing: THEME_QUESTIONS.sharing,
  respect: {
    type: 'choice',
    prompt: 'How can you show respect tomorrow?',
    options: ['Listen carefully', 'Use kind words', 'Follow the rules', 'Be fair to everyone'],
  },
  bravery: THEME_QUESTIONS.courage,
};

export function getReflectionQuestions(story) {
  const questions = [FEELING_QUESTION];

  // Try theme first (cultural lessons), then value (generated stories)
  const themeQ = THEME_QUESTIONS[story?.theme];
  const valueQ = VALUE_QUESTIONS[story?.value];

  if (themeQ) {
    questions.push(themeQ);
  } else if (valueQ) {
    questions.push(valueQ);
  } else {
    questions.push({
      type: 'choice',
      prompt: 'What did you learn from this story?',
      options: ['Be kind', 'Be brave', 'Be honest', 'Be patient'],
    });
  }

  return questions;
}
