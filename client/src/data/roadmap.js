// Product roadmap — synced with the requirements doc.
// Update the "status" field as items ship.
// status: 'shipped' | 'in-progress' | 'planned' | 'considering'

export const ROADMAP = [
  {
    id: 'app-rename',
    title: 'Rename app to My Sleepy Tale',
    impact: 'med',
    mvp: false,
    status: 'shipped',
    notes: 'Brand updated across header, footer, OG tags, and metadata.',
  },
  {
    id: 'theme-toggle',
    title: 'Day / night mode toggle, kid-friendly typography',
    impact: 'med',
    mvp: false,
    status: 'shipped',
    notes: 'CSS variable system swaps the entire palette via data-theme.',
  },
  {
    id: 'family-voices',
    title: 'Add audio samples from different family members',
    impact: 'high',
    mvp: true,
    status: 'shipped',
    notes:
      'New Voice Studio: HOLD-to-record training, label & save per family member, list/manage all voices. Stored locally (IndexedDB).',
  },
  {
    id: 'voice-priority',
    title: 'Prioritize stories that use all recorded voices',
    impact: 'high',
    mvp: false,
    status: 'planned',
    notes: 'Will weight story selection by which voices are loaded.',
  },
  {
    id: 'cultural-lessons',
    title: 'Pre-built cultural lesson stories (Krishna, Prophet, Jesus, Buddha)',
    impact: 'med',
    mvp: true,
    status: 'shipped',
    notes:
      'Added 8 compassion-to-animals stories from Hindu, Islamic, Christian, Sikh and Buddhist traditions.',
  },
  {
    id: 'white-noise',
    title: 'White noise tracks + dialogue fade as child sleeps',
    impact: 'high',
    mvp: false,
    status: 'shipped',
    notes:
      '4 procedurally-generated noise types (rain, ocean, fan, drone) via Web Audio API. Optional fade after T minutes — speech volume ramps down while noise grows.',
  },
  {
    id: 'outline-to-story',
    title: 'User writes outline → app completes the story',
    impact: 'high',
    mvp: false,
    status: 'planned',
    notes: 'Whisper feature is the predecessor — outline-mode is the next step.',
  },
  {
    id: 'autoplay-next',
    title: 'Toggle autoplay next related story',
    impact: 'high',
    mvp: false,
    status: 'shipped',
    notes: 'Settings → Playback → Autoplay next. Off by default.',
  },
  {
    id: 'demographic-recommendations',
    title: 'New users see content based on age, country, religion, ethnicity',
    impact: 'high',
    mvp: true,
    status: 'shipped',
    notes:
      'Onboarding now captures country, religion and (optional) ethnicity. Cultural lesson page filters by religion.',
  },
  {
    id: 'cross-culture',
    title: 'Show similar stories from different cultures (open-mindedness)',
    impact: 'med',
    mvp: false,
    status: 'shipped',
    notes:
      'Cultural Lessons page groups the same theme (e.g. compassion to animals) across traditions when "Open to all" is enabled.',
  },
  {
    id: 'voice-training-paragraph',
    title: 'Training paragraph for voice cloning model',
    impact: 'high',
    mvp: true,
    status: 'shipped',
    notes:
      'Full paragraph displayed in Voice Studio recording screen with a HOLD-to-record button.',
  },
  {
    id: 'community-listening',
    title: 'Show what others in your community are listening to',
    impact: 'med',
    mvp: false,
    status: 'considering',
    notes: 'Requires backend + privacy review before MVP.',
  },
  {
    id: 'exclude-similar',
    title: 'Do not show similar option (e.g. exclude other religions)',
    impact: 'med',
    mvp: false,
    status: 'shipped',
    notes:
      'Settings → Content → "Only show stories from my tradition". Filters cross-culture suggestions.',
  },
  {
    id: 'share-story',
    title: 'Share stories to other users; recipient plays original or own voice',
    impact: 'high',
    mvp: false,
    status: 'shipped',
    notes:
      'Story player has a Share button — copies a deep link with the story id. Voice swap on receive is planned.',
  },
  {
    id: 'family-recommendations',
    title: 'Family members can submit story outlines under "Family Recommendations"',
    impact: 'high',
    mvp: true,
    status: 'planned',
    notes: 'Needs auth + multi-user backend. Designed but not built.',
  },
  {
    id: 'browse-categories',
    title: 'Many browseable categories to reduce generation cost',
    impact: 'high',
    mvp: true,
    status: 'shipped',
    notes:
      'Library now has filter pills + Cultural Lessons page is a curated, generation-free section.',
  },
];

export const STATUS_META = {
  shipped: { label: 'Shipped', color: '#7ad9a1', bg: 'rgba(122,217,161,0.12)' },
  'in-progress': { label: 'In progress', color: '#ffb733', bg: 'rgba(255,183,51,0.12)' },
  planned: { label: 'Planned', color: '#9cb3ff', bg: 'rgba(156,179,255,0.12)' },
  considering: { label: 'Considering', color: '#a8a39a', bg: 'rgba(168,163,154,0.10)' },
};

export const IMPACT_META = {
  high: { label: 'High impact', color: '#f0a500' },
  med: { label: 'Med impact', color: '#a8a39a' },
  low: { label: 'Low impact', color: '#6e6a63' },
};
