# 🌙 My Sleepy Tale

> *Turn off the screen. Turn on their imagination.*

[![Live](https://img.shields.io/badge/Live-mysleepytale.com-f0a500?style=flat-square)](https://mysleepytale.com)
[![Built with Claude](https://img.shields.io/badge/AI-Claude%20Opus-blueviolet?style=flat-square)](https://anthropic.com)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![AWS](https://img.shields.io/badge/AWS-S3%20%2B%20CloudFront%20%2B%20Lambda-FF9900?style=flat-square&logo=amazonaws)](https://aws.amazon.com)

---

## What is My Sleepy Tale?

**My Sleepy Tale** is a bedtime story app where kids **listen**, not watch. Every story uses your child's name, their family, their pet — narrated in a warm voice that feels like home. Stories are rooted in real cultural traditions: Hindu, Sikh, Muslim, Christian, Buddhist, Jewish, and Universal.

No video. No animation. No blue light. Just a voice, a story, and sleep.

**Live at [mysleepytale.com](https://mysleepytale.com)**

---

## Why It Exists

Every night in our house ended the same way — "one more episode" of some animated show, bright colours flashing, negotiations, meltdowns. We kept thinking: kids used to fall asleep to *stories*, not screens.

So we built what we wished existed. Our daughter heard her own name in a story about her kindergarten field trip. She fell asleep smiling. That moment told us we were onto something.

---

## Features

### Stories & Series
- **100+ wisdom stories** from 7 cultural traditions
- **8 multi-episode series** — Netflix-style "what happens next?" pull
  - Rainbow Kindergarten Adventures (real school, real teachers, real kids)
  - Dr. Spock Says (parenting wisdom as bedtime conversations)
  - Fire Truck Academy, Rocket Adventures, Cricket Champions, and more
- **Collection shelves** — Pets & Animals, Superheroes, Vehicles, Sports, Planets, Who Would Win
- **Personalization tokens** — `{childName}`, `{sibling}`, `{pet}` woven into every story

### Audio
- **ElevenLabs premium voices** — George, Lily, Muskaan, Brian, Sarah
- **OpenAI TTS fallback** — instant generation for any story
- **Pre-generated audio** cached in Firebase — plays instantly, no waiting
- **IndexedDB local cache** — offline replay of previously heard stories

### Player
- Immersive dark UI with blurred story art background
- Highlighted text scrolls in sync with narration
- **Swipeable photo gallery** — tap to expand fullscreen, audio keeps playing
- Speed control (0.8x / 1x / 1.2x), seek, rewind/forward 10s
- Series badge links to full series detail page
- **"Play Next Episode"** prompt with share option after each episode

### Learning & Engagement
- **Learning streaks** — track consecutive bedtime story nights
- **Post-story reflections** — gentle questions after each story
- **Morning recap** — revisit last night's story and its lesson
- **Share cards** — beautiful cards with story art, moral, and child's name

### Creator Platform
- **Curation tab** — write and submit stories for review
- **Credit system** — earn credits for approved stories, plays, shares
- **Creator tiers** — Storyteller, Keeper, Elder, Guardian
- **Leaderboard** — top creators by tradition

### Radio
- **3D globe** with cultural radio stations (cobe library)
- Ambient audio streams by tradition
- Runs alongside story playback

### Admin Panel
- 4 tabs: Dashboard, Story Studio, Creators, Settings
- Per-story voice selection + ElevenLabs generation
- AI image generation (OpenAI gpt-image-1)
- Multi-photo gallery upload per episode
- User management with play history

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 + Tailwind CSS + Framer Motion |
| Hosting | AWS S3 + CloudFront (CDN) |
| API | AWS Lambda + API Gateway |
| Auth | Firebase Authentication (Google + Email) |
| Database | Firestore (users, config, stories, galleries) |
| Storage | Firebase Storage (audio, images) |
| AI Stories | Anthropic Claude API |
| AI Images | OpenAI gpt-image-1 |
| TTS | ElevenLabs (premium) + OpenAI TTS (fallback) |
| Audio Cache | IndexedDB (client) + Firebase Storage (server) |
| CI/CD | GitHub Actions + deploy.sh |
| Domain | Route 53 + CloudFront |
| Blog | Static HTML served by CloudFront |

---

## Project Structure

```
mysleepytale/
├── client/                          # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Shelf-based home (Netflix-style)
│   │   │   ├── Player.jsx           # Immersive audio player
│   │   │   ├── SeriesDetail.jsx     # Series page with episode cards
│   │   │   ├── Radio.jsx            # 3D globe radio stations
│   │   │   ├── Creator.jsx          # Story submission + credits
│   │   │   ├── Admin.jsx            # Admin panel (4 tabs)
│   │   │   └── Settings.jsx         # Family profile & preferences
│   │   ├── components/
│   │   │   ├── cards/               # SeriesCard, StoryTile
│   │   │   ├── shelves/             # ShelfRow, SeriesShelf, CollectionShelf
│   │   │   ├── StoryGallery.jsx     # Swipeable gallery + fullscreen lightbox
│   │   │   ├── ShareCardSheet.jsx   # Share story with art + moral
│   │   │   ├── BottomSheet.jsx      # Reusable bottom sheet
│   │   │   └── PostStoryReflection.jsx
│   │   ├── hooks/
│   │   │   ├── usePlayer.jsx        # Global player context
│   │   │   ├── useNarrator.js       # TTS generation + cached playback
│   │   │   ├── useWisdomData.js     # Firestore audio/image/story cache
│   │   │   ├── useSeriesProgress.js # Episode completion tracking
│   │   │   └── useStreak.js         # Learning streak tracker
│   │   ├── data/
│   │   │   ├── series.js            # 8 series with full episode text
│   │   │   ├── culturalLessons.js   # 50+ wisdom stories
│   │   │   └── collections.js       # 8 themed collections
│   │   └── utils/
│   │       ├── cardExport.js        # Canvas share card generation
│   │       ├── imagePrompts.js      # 130+ AI image prompts
│   │       ├── socialProof.js       # Seeded play counts + ratings
│   │       └── storyHelpers.js      # Token filling, play limits
│   └── dist/blog/                   # Static blog (15+ posts)
├── api/                             # Lambda API handlers
│   ├── generate-story.js            # Claude story generation
│   ├── generate-elevenlabs-audio.js # ElevenLabs TTS
│   ├── generate-story-image.js      # OpenAI image generation
│   ├── share.js                     # Dynamic OG tags for social sharing
│   └── tts.js                       # OpenAI TTS fallback
├── .github/
│   ├── lambda-handler.mjs           # Lambda router
│   └── workflows/deploy.yml         # GitHub Actions CI/CD
├── deploy.sh                        # Manual deploy script
└── .env.prod                        # Production environment variables
```

---

## Series

| Series | Episodes | Theme |
|---|---|---|
| Fire Truck Academy | 3 | Courage, teamwork, finding your bravery |
| Rocket Adventures | 3 | Space exploration, perseverance |
| The Kindness Squad | 3 | Superpowers through values |
| Around the World in 3 Nights | 3 | Culture, geography, empathy |
| Pluto's Journey | 3 | Self-worth, belonging |
| Cricket Champions | 3 | Sportsmanship, teamwork |
| Rainbow Kindergarten Adventures | 3 | Real school adventures (JLPS 2026) |
| Dr. Spock Says | 5 | Parenting conversations for 3-5 year olds |

---

## Creator Credits

| Action | Credits |
|---|---|
| Story submitted | +5 |
| Story approved | +25 |
| Series created (3+ episodes) | +50 |
| Each episode approved | +15 |
| Story played (per unique listener) | +1 |
| Story shared | +3 |
| Story completed | +2 |
| 5-star feedback | +5 |

**Tiers:** Storyteller (0-99) → Keeper (100-499) → Elder (500-1999) → Guardian (2000+)

---

## Getting Started

### Prerequisites
- Node.js 18+
- AWS CLI configured
- Firebase project (Firestore + Auth + Storage)
- API keys: Anthropic, OpenAI, ElevenLabs

### Local Development

```bash
cd client && npm install && npm run dev
# Opens on http://localhost:5173
```

### Deploy

```bash
bash deploy.sh
# Builds → S3 sync → Lambda update → CloudFront invalidation
```

---

## Blog

15+ SEO-optimized blog posts at [mysleepytale.com/blog](https://mysleepytale.com/blog):
- Why kids love cars, planets, superheroes, sports, "who would win"
- Indian bedtime stories, Islamic stories for kids
- Creator credits guide
- Rainbow Kindergarten series spotlight

---

## Contributing

We welcome story contributions from every cultural tradition. Open the app, go to **Curation**, and submit your story. We review within 48 hours.

For code contributions, fork and PR. For story contributions, just use the app.

---

## License

MIT

---

*Built by Prateek & Deepti Ramaul in Toronto, Canada.*
*Powered by Claude AI. Narrated by ElevenLabs. Hosted on AWS.*
*Made with love for children everywhere.* 🌙
