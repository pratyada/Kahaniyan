# Collaborative Chain Stories — Implementation Plan

## Context
Kids build stories together: Kid 1 picks an image + records the opening → shares link → Kid 2 listens + adds their part → more kids join → originator closes + compiles → final story can be animated. Like "dum sharaz" but digital.

## Architecture

### Firestore: New `storyChains` collection
```
storyChains/{chainId} → {
  id, title, inviteToken (16-char URL-safe),
  originatorKidId, originatorParentUid, originatorKidName,
  promptImageUrl, promptType, topic, language,
  status: 'open' | 'closed' | 'compiled',
  partCount, maxParts: 10,
  currentTurnKidId: null | kidId,  // turn lock
  currentTurnClaimedAt: null | ISO,
  participantKidIds: [], participantNames: [],
  totalDurationSeconds,
  compiledParts: null | [{audioUrl, kidName, partNumber, durationSeconds}],
  compiledVideoUrl: null,
  createdAt, closedAt, compiledAt
}
```

### Extended `kidStories` docs (for chain parts)
```
existing fields + chainId: string|null, chainPartNumber: number
```

## New Files to Create

### API (1 file)
- **`/api/kid-story-chain.js`** — all chain actions:
  - `create` → create chain + return presign URL for part 1
  - `join` → lookup by inviteToken, return chain + all parts
  - `claim-turn` → lock next turn (Firestore transaction, 30-min timeout)
  - `release-turn` → release claimed turn
  - `add-part` → validate audio + save part + update chain + award credits
  - `close` → originator marks chain closed
  - `compile` → build ordered playlist, award +15 stars
  - `get` → fetch chain + all parts (public read)
  - `list-mine` → chains kid participates in

### Frontend Pages (2 files)
- **`/client/src/pages/ChainStory.jsx`** — view chain: timeline of parts, listen all, share, close/compile (originator)
  - Route: `/incubate/chain/:chainId`
  - Also handles join: `/incubate/chain/join/:inviteToken`
- **`/client/src/pages/ChainRecord.jsx`** — record a chain part
  - Route: `/incubate/chain/:chainId/record`
  - Must listen to ALL previous parts before record button activates
  - Same recording UI as KidRecord (big button, timer, playback)

### Frontend Components (3 files)
- **`/client/src/components/ChainTimeline.jsx`** — vertical timeline of parts (kid name, duration, play button per part)
- **`/client/src/components/ChainPlayer.jsx`** — sequential audio player across all parts, unified progress bar
- **`/client/src/components/ChainShareSheet.jsx`** — share invite link (Web Share API + clipboard fallback)

### Frontend Hook (1 file)
- **`/client/src/hooks/useChainStory.js`** — fetches chain data, handles turn claim, provides `chainData`, `parts`, `claimTurn()`, `isMyTurn`

## Files to Modify

| File | Change |
|------|--------|
| `/client/src/App.jsx` | Add 3 routes: `/incubate/chain/:chainId`, `/incubate/chain/join/:inviteToken`, `/incubate/chain/:chainId/record` |
| `/client/src/pages/Incubate.jsx` | Add "Build a Story with Friends" card in Create tab + "Chain Stories" section in My Stories tab |
| `/api/kid-credits.js` | Add credit types: `chain_created: 5`, `chain_part_added: 3`, `chain_compiled: 15` |
| `/api/kid-story-save.js` | Accept `chainId`/`chainPartNumber` in save action |
| `/api/share.js` | Add OG tags for chain invite links (title: "Join X's Chain Story") |

## User Flow

### Kid 1 Creates
1. Incubate → "Build a Story with Friends" card
2. Pick image prompt (same picker as solo)
3. Record opening (same UI as KidRecord)
4. AI validates → Save → Creates `storyChains` doc + first `kidStories` part
5. Celebration: "Your chain story has started!" → Share button → copies invite link

### Kid 2 Joins
1. Parent taps invite link → `/incubate/chain/join/{token}`
2. ChainStory page loads → shows prompt image + Part 1 by Kid 1
3. "Listen & Add Your Part!" CTA
4. ChainRecord: must listen to all parts first (record button grayed until done)
5. `claim-turn` locks the turn → Record → AI validates → Save → +3 stars
6. Turn released for next kid

### Originator Closes
1. Kid 1 opens chain → sees all parts
2. "Close Story" → no more additions
3. "Compile" → ordered playlist built → +15 stars
4. "Animate!" → Gemini Veo animates from prompt image + all transcripts

## Credit Rules
| Action | Stars |
|--------|-------|
| Create chain (first part) | +5 |
| Add a part | +3 |
| Compile final story | +15 |
| Plays/likes on parts | existing rules (+1/+2) |

## Safety
- Every part goes through content-validate.js (Whisper + Claude)
- Turn lock prevents conflicts (30-min timeout)
- Max 10 parts per chain
- Max 5 open chains per kid
- Originator can close anytime
- Report button on each part
- Parent must be logged in to add parts
- No direct messaging between kids

## Playback
- Client-side sequential: play Part 1 → onended → play Part 2 → etc.
- Unified progress bar across total duration
- Display: "Part 2 of 4 — by Liam"
- No server-side audio merging needed

## Sharing
- Invite link: `mysleepytale.com/incubate/chain/join/{inviteToken}`
- inviteToken: `crypto.randomBytes(12).toString('base64url')` (144-bit)
- OG preview: "Join Ava's Chain Story: The Magic Forest Adventure"
- Web Share API + clipboard fallback

## Build Order
1. **API**: `kid-story-chain.js` + credit types (~1 day)
2. **Core UI**: ChainStory + ChainRecord pages + hook (~2 days)
3. **Polish**: Timeline, Player, ShareSheet, Incubate integration (~1 day)
Total: ~4 days

## Verification
1. Create a chain as Prateek's kid → get invite link
2. Open invite link in incognito (login as different account) → join + add part
3. Go back as originator → see both parts → close → compile
4. Play compiled story → sequential playback works
5. Test turn conflict (two browsers trying to claim)
6. Test AI safety rejection on a chain part
7. Verify credits awarded correctly
