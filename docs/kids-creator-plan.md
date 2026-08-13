# Kids Creator Mode — Full Implementation Plan

**Started:** August 13, 2026
**Status:** Planning complete, ready to build

---

## Vision

Kids become creators. They see an image, speak a story about it in their own voice, AI validates it's safe, then the image **animates** based on their story — creating a mini animated film narrated by the kid. Parents share with pride. Kids earn credits. Best story wins monthly prizes.

---

## The Magic Flow

```
Kid sees image → Records voice story → AI validates (Whisper + Claude)
    ↓ if clean
Image animates (Higgsfield Seedance) → Kid's voice merged as narration
    ↓
Shareable animated story (15-30 sec, 9:16 format)
    ↓
Publish → Earn stars → Parents share → Other kids listen + like
```

---

## Phase 0: Safety & Legal (MUST ship first)

### Privacy Policy Page (`/privacy`)
- COPPA compliant statement
- "We do not collect personal data from children"
- "All accounts are created and managed by parents/guardians"
- "Voice recordings are stored under the parent's account"
- "Parents can delete any content at any time"
- Link from Settings, onboarding, and footer

### Report System
- Report button (🚩) on every kid-created story
- `contentReports` Firestore collection:
  ```
  { reportedBy, contentId, contentType, reason, description, status, createdAt }
  ```
- Reasons: inappropriate language, scary content, bullying, spam, other
- Auto-hide content after 3 reports (pending review)
- FounderHub moderation queue for flagged content
- Email notification to founders on new reports

### Content Validation (AI Safety Layer)
- **Whisper API** transcribes kid's voice recording to text
- **Claude Sonnet** validates transcript:
  - No profanity, slang, or foul language
  - No violence, nudity references, or harmful content
  - No personal information (addresses, phone numbers)
  - Age-appropriate content check
  - Returns: `{ safe: true/false, reason: string, cleanedText: string }`
- Stories that fail validation → "Let's try a different story!" (friendly rejection)
- Parent can override for private stories (behind ParentLock)

### Parent Controls
- Parent approval required for public stories (ParentLock PIN)
- Parent can view/delete all kid's recordings
- Parent can set recording limits (stories per day)
- Parent can disable public sharing entirely

### Files to Create (Phase 0)
- `/client/src/pages/Privacy.jsx` — privacy policy page
- `/client/src/components/ReportButton.jsx` — reusable report flag
- `/api/content-report.js` — save report to Firestore
- `/api/content-validate.js` — Whisper transcription + Claude safety check

### Files to Modify (Phase 0)
- `/client/src/App.jsx` — add `/privacy` route
- `/client/src/pages/Settings.jsx` — add Privacy Policy link
- `/client/src/pages/FounderHub.jsx` — add moderation queue section

**Effort: ~3 days**

---

## Phase 1: MVP — Record + Save + Share

### Core Flow
1. Kid opens "Story Lab" tab (new bottom nav item)
2. Sees 3-4 curated images (random from a prompt set)
3. Taps an image → recording screen opens
4. Big red button: tap to start, tap to stop (max 5 min)
5. Plays back their recording
6. AI validates (Whisper + Claude) → shows ✅ or friendly retry
7. Names the story → "Save My Story!" → celebration animation
8. Publish: private (instant) or public (parent approval via ParentLock)

### Firestore Schema

**Collection: `kidStories`**
```
{
  id: string,
  kidId: string (parentUid + '_' + profileIndex),
  parentUid: string,
  profileIndex: number,
  kidName: string,
  kidAge: number,
  title: string,
  audioUrl: string (S3),
  transcript: string (Whisper output),
  promptImageUrl: string (the image they spoke about),
  videoUrl: string | null (animated version, Phase 1.5),
  durationSeconds: number,
  language: string,
  plays: number,
  likes: number,
  likedBy: string[],
  visibility: 'private' | 'public' | 'class',
  classCode: string | null,
  approved: boolean,
  status: 'draft' | 'validating' | 'pending_approval' | 'published' | 'rejected' | 'flagged',
  seriesId: string | null,
  episodeNumber: number | null,
  createdAt: ISO string,
  publishedAt: ISO string | null,
}
```

### S3 Storage
```
audio/kids/{kidId}/{storyId}.webm     ← voice recording
video/kids/{kidId}/{storyId}.mp4      ← animated story (Phase 1.5)
images/kids/prompts/                  ← curated prompt images
```

### New Files (Phase 1)

**Pages:**
- `/client/src/pages/Incubate.jsx` — Story Lab hub (Create + My Stories tabs)
- `/client/src/pages/KidRecord.jsx` — Recording screen with prompt image

**Components:**
- `/client/src/components/PromptPicker.jsx` — 3-4 image cards to choose from
- `/client/src/components/KidStoryCard.jsx` — Story card with play count, status
- `/client/src/components/CelebrationOverlay.jsx` — confetti + stars on publish

**Hooks:**
- `/client/src/hooks/useKidStories.js` — CRUD for kid stories
- `/client/src/hooks/useKidRecorder.js` — wraps useVoiceRecorder with maxDuration

**APIs:**
- `/api/kid-story-presign.js` — pre-signed S3 upload URL (avoids Lambda body limit)
- `/api/kid-story-save.js` — create Firestore doc after upload
- `/api/kid-story-publish.js` — set visibility + request approval
- `/api/kid-story-approve.js` — parent approves/rejects
- `/api/kid-story-play.js` — increment play counter
- `/api/kid-story-like.js` — like/unlike

### Files to Modify (Phase 1)
- `/client/src/App.jsx` — add `/incubate` and `/incubate/record` routes
- `/client/src/components/BottomNav.jsx` — add Story Lab tab (Mic icon)
- `/client/src/hooks/useVoiceRecorder.js` — add maxDuration auto-stop option

### UI Design Principles
- **BIG buttons** — minimum 60px touch targets
- **Minimal text** — icons + voice prompts
- **Bright colors** — gold, coral, purple (not dark theme)
- **Celebrations everywhere** — confetti on record, stars on save, fireworks on publish
- **Works on iPad** — primary kid device
- **Tap-to-start/tap-to-stop** — not hold (easier for small hands)

**Effort: ~9 days**

---

## Phase 1.5: The Animation Magic

### Flow (after recording is validated)
1. Kid's story passes AI validation ✅
2. "Want to see your story come alive?" button appears
3. System sends: prompt image + transcript → Higgsfield Seedance 2.0
4. Generates 8-15 second animation from the image
5. FFmpeg merges kid's voice audio as narration track
6. Result: a mini animated film narrated by the kid
7. Saved to S3, playable + shareable

### Technical Stack
- **Whisper API** → transcribe voice to text (already done in validation)
- **Claude Sonnet** → enhance transcript into animation prompt
  - "A dragon breathing ice cream instead of fire, flying over a candy mountain"
- **Higgsfield Seedance 2.0** → image-to-video (8-12s, 9:16 for social sharing)
- **FFmpeg (server-side)** → merge audio + video tracks
- **S3** → store final video at `video/kids/{kidId}/{storyId}.mp4`

### Cost Per Animated Story
| Component | Cost |
|-----------|------|
| Whisper transcription | ~$0.006/min |
| Claude content filter + prompt | ~$0.02 |
| Higgsfield Seedance 2.0 (8-12s) | ~10-15 credits ($0.30-0.50) |
| FFmpeg processing | free (server CPU) |
| S3 storage | ~$0.01/video |
| **Total per story** | **~$0.50-1.00** |

### Monetization
**Kids Creator is a paid feature overall.** First story is free (launch promo until August).

| Tier | Recording | Animation |
|------|-----------|-----------|
| Free | 1 story free (promo) | 1 free (promo) |
| Pro ($9.99/mo) | Unlimited recording | 5 animations/week |
| Family ($14.99/mo) | Unlimited recording | Unlimited animations |

After the free first story, parents see: "Your child loved creating! Unlock unlimited stories for $9.99/month"

### New Files (Phase 1.5)
- `/api/kid-story-animate.js` — orchestrates: Whisper → Claude prompt → Higgsfield → FFmpeg → S3
- `/client/src/components/AnimationProgress.jsx` — "Your story is coming alive!" loading screen with stages

### Files to Modify (Phase 1.5)
- `/client/src/pages/KidRecord.jsx` — add "Animate My Story" button after save
- `/client/src/components/KidStoryCard.jsx` — show video player when animated version exists

**Effort: ~5 days**

---

## Phase 2: Credits + Gamification

### Credit Rules
| Action | Stars Earned |
|--------|-------------|
| Create a story | +5 ⭐ |
| Story gets a play | +1 ⭐ (cap 50/story) |
| Story gets a like | +2 ⭐ |
| Animate a story | +10 ⭐ |
| 3-day creation streak | +10 ⭐ bonus |
| 7-day creation streak | +25 ⭐ bonus |

### Levels
| Stars | Level | Title |
|-------|-------|-------|
| 0-25 | 1 | Little Storyteller |
| 25-100 | 2 | Story Star |
| 100-250 | 3 | Story Hero |
| 250-500 | 4 | Story Master |
| 500+ | 5 | Story Legend |

### Firestore Schema
```
kidCredits/{kidId} → {
  balance: number,
  totalEarned: number,
  level: number,
  streak: number,
  lastStoryDate: ISO string,
}

kidCredits/{kidId}/transactions → {
  type: 'story_created' | 'play_received' | 'like_received' | 'animation' | 'streak_bonus',
  amount: number,
  storyId: string | null,
  createdAt: ISO string,
}
```

### Account Transfer at 13
- Credits accumulate under parent's account
- When kid turns 13: create their own Firebase Auth account
- Migrate `kidStories` + `kidCredits` to new account
- "Teenager gift" — unlock their full creator history

### New Files (Phase 2)
- `/client/src/hooks/useKidCredits.js` — balance, level, streak
- `/client/src/components/StarCounter.jsx` — animated star display
- `/client/src/components/KidBadgeWall.jsx` — creator badges
- `/api/kid-credits-award.js` — award credits (called by other APIs)

**Effort: ~4 days**

---

## Phase 3: Social — Explore, Leaderboard, Prizes

### Explore Tab
- Trending: most-played kid stories this week
- New: recently published
- Best of Month: featured winner banner

### Classroom Codes
- Parent creates a 6-char class code
- Share with other parents (WhatsApp, email)
- Kids in same classroom see each other's stories
- Perfect for schools, daycares, camps

### Monthly Prize
- Cron calculates top story by score: `plays + (likes × 3)`
- Winner gets: +100 bonus stars, special badge, featured on home page
- Parent notified by email

### Firestore Schema
```
kidLeaderboard/{YYYY-MM} → {
  topStories: [{ storyId, title, kidName, plays, likes, score }],
  topCreators: [{ kidId, kidName, storiesCount, totalPlays }],
}

kidClassrooms/{classCode} → {
  code, name, createdBy, members[], createdAt
}
```

### New Files (Phase 3)
- `/client/src/pages/KidExplore.jsx` — discover other kids' stories
- `/client/src/components/KidLeaderboard.jsx` — monthly rankings
- `/client/src/components/ClassroomManager.jsx` — create/join codes (behind ParentLock)
- `/api/kid-explore.js` — fetch public stories (trending/new/top)
- `/api/kid-leaderboard.js` — get/recalculate leaderboard
- `/api/kid-classroom-create.js` — create classroom
- `/api/kid-classroom-join.js` — join by code
- `/api/kid-monthly-prize.js` — cron for monthly winner

**Effort: ~7.5 days**

---

## Total Effort Summary

| Phase | Scope | Days |
|-------|-------|------|
| Phase 0 | Safety, privacy, report, AI validation | ~3 |
| Phase 1 | Record + save + share MVP | ~9 |
| Phase 1.5 | Animation magic (image-to-video) | ~5 |
| Phase 2 | Credits + gamification | ~4 |
| Phase 3 | Social + leaderboard + prizes | ~7.5 |
| **Total** | | **~28.5 days** |

---

## File Inventory

### New Files: 25+
- 4 pages, 9 components, 4 hooks, 12+ API routes

### Modified Files: 7
- App.jsx (routes)
- BottomNav.jsx (new tab)
- Player.jsx (kid story attribution + like)
- FounderHub.jsx (moderation queue)
- Settings.jsx (privacy link)
- useVoiceRecorder.js (maxDuration)
- tierGate.js (animation limits)

---

## Key Technical Decisions

1. **Kids never have their own account** — sub-profiles under parent (COPPA)
2. **Pre-signed S3 upload** for voice recordings (not through Lambda body)
3. **Tap-to-start/tap-to-stop** recording (not hold — easier for small hands)
4. **AI validation before publish** — Whisper + Claude safety check
5. **Animation is opt-in premium** — not required to publish a story
6. **Parent approval for public** — private stories publish instantly
7. **Report + auto-hide** — 3 reports = hidden until founder review
8. **9:16 video format** — Instagram/TikTok ready for parent sharing
