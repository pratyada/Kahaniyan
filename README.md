# 🌙 Kahaniyo

> *Personalized AI bedtime stories for children — with cultural soul.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Built with Claude](https://img.shields.io/badge/AI-Claude%20Sonnet-blueviolet)](https://anthropic.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org)

---

## What is Kahaniyo?

**Kahaniyo** (*kahani* — story, in Hindi/Urdu) is a children's bedtime story app that generates fresh, personalized audio stories every night using AI. No two stories are ever the same.

Parents set up their family profile once. The app weaves the child's name, siblings, grandparents, and pets into every story — narrated in a voice that feels like home. Each story is rooted in a cultural value (honesty, courage, kindness) matched to the child's age group. The story begins playing in one second. No buttons. No effort. Just sleep.

---

## Features

### Story Generation
- AI-generated stories via Claude API — unique every session
- Non-repetition engine: tracks last 10 story structures per child, never repeats
- Cultural context layer: folklore, festivals, food, and places woven naturally
- Word count calibrated to duration: 15 / 30 / 45 / 60 minutes
- Stories end with a gentle, sleep-inducing wind-down

### Personalization
- Family profile: child's name, age, siblings, grandparents, pet
- All family members appear as supporting characters in every story
- Per-child profiles — up to 3 on Family plan, 5 on Annual

### Values Engine
- 8 core values: Honesty, Courage, Kindness, Respect, Sharing, Patience, Gratitude, Bravery
- Age-mapped priority system:
  - **2–4 yrs** → Sharing, Kindness, Saying sorry
  - **5–7 yrs** → Honesty, Respect, Gratitude
  - **8–10 yrs** → Courage, Patience, Fairness
  - **11–13 yrs** → Integrity, Empathy, Responsibility

### Voice Narration
- 5 preset voice personas: Mummy, Daddy, Dada ji, Nani ma, AI Narrator
- Web Speech API (SpeechSynthesis) for MVP
- ElevenLabs integration ready for premium voice quality
- Custom voice recording (paid tier — record a real family member's voice)

### Multilingual
- English, Hindi, Tamil, Spanish, Arabic (MVP)
- Stories generated natively in selected language — not translated

### Story Player
- 1-second auto-play — no button press needed at bedtime
- Full-screen immersive dark UI with CSS star-field animation
- Story text scrolls in sync with narration
- Speed control: 0.7x / 1x / 1.3x
- Sleep timer: auto-stop after selected minutes
- Audio fades out gently in final 2 minutes
- "Sweet dreams" end screen with fade-to-black

### Story Library
- All stories saved locally with value tag, duration, date, narrator
- Filter by value tag
- Replay any story
- 7-day archive on Free tier / unlimited on paid

---

## Design System

Kahaniyo uses a **Spotify-inspired dark UI** adapted for bedtime warmth.

| Token | Value |
|---|---|
| Base background | `#0a0a0f` |
| Card surface | `#141420` |
| Primary accent | `#f0a500` (warm gold) |
| Primary text | `#f5f0e8` (warm cream) |
| Display font | Playfair Display |
| UI font | DM Sans |
| Story body font | Lora (serif) |

See `client/src/styles/index.css` for the full CSS variable token system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TailwindCSS |
| Routing | React Router v6 |
| Animations | Framer Motion |
| Backend | Node.js + Express |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Voice (MVP) | Web Speech API (SpeechSynthesis) |
| Voice (Paid) | ElevenLabs API |
| Storage | localStorage (MVP) |
| Auth | None (single-device, single-family for MVP) |

---

## Project Structure

```
kahaniyo-app/
├── client/                        # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Onboarding.jsx     # Family profile setup wizard
│   │   │   ├── Home.jsx           # Story configuration screen
│   │   │   ├── Player.jsx         # Immersive story player
│   │   │   ├── Library.jsx        # Saved stories grid
│   │   │   └── Settings.jsx       # Language, voice, subscription
│   │   ├── components/
│   │   │   ├── BottomNav.jsx      # Persistent 5-tab navigation
│   │   │   ├── PlayerBar.jsx      # Mini player bar (Spotify-style)
│   │   │   ├── ValuePill.jsx      # Color-coded value tag component
│   │   │   ├── VoiceAvatar.jsx    # Narrator avatar selector
│   │   │   ├── StoryCard.jsx      # Library card component
│   │   │   └── UpgradeModal.jsx   # Tier gate modal
│   │   ├── hooks/
│   │   │   ├── useStoryGenerator.js  # Claude API story generation
│   │   │   ├── useSpeech.js          # Web Speech API wrapper
│   │   │   └── useFamilyProfile.js   # localStorage profile manager
│   │   ├── utils/
│   │   │   ├── promptBuilder.js   # Builds Claude prompt from inputs
│   │   │   ├── storyCache.js      # Non-repetition engine
│   │   │   └── tierGate.js        # Free vs paid feature logic
│   │   ├── styles/
│   │   │   └── index.css          # Design tokens + global styles
│   │   └── App.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                        # Express backend
│   ├── routes/
│   │   └── story.js               # POST /api/generate-story
│   ├── middleware/
│   │   └── rateLimit.js           # Basic rate limiting
│   └── index.js
├── .env.example
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)
- (Optional) An [ElevenLabs API key](https://elevenlabs.io) for premium voice

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/kahaniyo-app.git
cd kahaniyo-app

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### Environment Setup

```bash
# In the root directory
cp .env.example .env
```

Edit `.env`:

```env
ANTHROPIC_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here     # optional for MVP
VITE_API_BASE_URL=http://localhost:3001
```

### Running Locally

```bash
# Terminal 1 — Start the backend
cd server && npm run dev
# Runs on http://localhost:3001

# Terminal 2 — Start the frontend
cd client && npm run dev
# Runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) and complete the family profile onboarding.

---

## Subscription Tiers

| Feature | Free | Family (₹299/mo) | Annual (₹179/mo) |
|---|---|---|---|
| Stories per week | 3 | Unlimited | Unlimited |
| Max duration | 30 min | 60 min | 60 min |
| Languages | 2 | All | All |
| Story archive | 7 days | 90 days | Forever |
| Custom voice recording | — | 2 voices | Unlimited |
| Child profiles | 1 | 3 | 5 |
| Cultural festival packs | — | — | ✓ |
| Offline download | — | — | ✓ |

---

## API Reference

### `POST /api/generate-story`

Generates a new bedtime story via Claude API.

**Request body:**
```json
{
  "childName": "Arjun",
  "age": 7,
  "value": "courage",
  "duration": 30,
  "language": "Hindi",
  "voice": "Dada ji",
  "familyMembers": {
    "sibling": "Priya",
    "grandfather": "Dada ji",
    "grandmother": "Nani ma",
    "pet": "Bruno"
  },
  "recentPlotTypes": ["forest adventure", "treasure hunt"]
}
```

**Response:**
```json
{
  "id": "story_1234567890",
  "text": "Once upon a time, in a little village near the mountains...",
  "wordCount": 3892,
  "estimatedMinutes": 30,
  "value": "courage",
  "language": "Hindi",
  "createdAt": "2025-04-11T20:30:00Z"
}
```

---

## Roadmap

- [ ] ElevenLabs voice integration (premium narration)
- [ ] Custom voice cloning — record a real family member's voice
- [ ] Cultural festival packs (Diwali, Eid, Christmas, Holi)
- [ ] Android + iOS apps (React Native port)
- [ ] Offline story download
- [ ] Multi-narrator mode — different characters, different voices
- [ ] Story illustration generation (AI image per chapter)
- [ ] Weekly value progress report for parents
- [ ] WhatsApp story sharing

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

MIT © Kahaniyo

---

*Built with Claude AI · Designed for bedtime · Made with love for children everywhere*
