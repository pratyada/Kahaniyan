# Migration: Firebase Storage → S3 (July 26, 2026)

## Why
- **Performance**: S3 + CloudFront = same domain as app → no extra DNS lookup, faster loads
- **Clean URLs**: `mysleepytale.com/media/stories/ep1.jpg` vs ugly Firebase Storage URLs with tokens
- **Cost**: S3 cheaper at scale, already paying for CloudFront
- **Consistency**: One storage layer for everything (images, audio, creatives)
- **SEO/OG**: Clean URLs for social sharing, never expire

## Current State (Pre-Migration)
| Storage | Count | What |
|---------|-------|------|
| Firebase Storage | 590 images | Episode covers (DALL-E generated) |
| S3 (mysleepytale-app) | 11 images | Brave Moments anime (Higgsfield) + 3 others |
| S3 (audio/) | varies | TTS audio files |
| S3 (media/creatives/) | varies | Marketing creatives |

## Target Architecture
```
S3: mysleepytale-app (us-east-1)
CDN: CloudFront → mysleepytale.com

mysleepytale.com/
├── media/
│   ├── stories/{episodeId}.jpg      ← ALL episode cover images
│   ├── audio/{episodeId}.mp3        ← TTS audio (existing)
│   ├── audio/download/{id}.mp3      ← Podcast exports (existing)
│   ├── creatives/                   ← Marketing images (existing)
│   └── brave-moments/               ← Brave Moments series (existing)
```

All new content goes to S3. Firebase Storage phased out.

---

## Phase 1: Migrate Existing Images (July 26, 2026)

### Status: READY TO RUN

**Scripts created:**
- `scripts/migrate-firebase-to-s3.js` — Downloads 590 Firebase images → uploads to S3
- `scripts/update-firestore-urls.js` — Updates Firestore `config/wisdomImages` to point to S3 URLs

**How to run:**
```bash
# Step 1: Download from Firebase, upload to S3 (creates mapping.json)
node scripts/migrate-firebase-to-s3.js

# Step 2: Verify images load (spot-check 5-10 URLs from mapping.json)

# Step 3: Update Firestore to point to new S3 URLs
node scripts/update-firestore-urls.js
```

**What it does:**
- Skips images already on S3 (mysleepytale.com/media/)
- Saves to `media/stories/{episodeId}.jpg` on S3
- CacheControl: 30 days
- Outputs `scripts/migration-mapping.json` for verification
- Updates Firestore via `/api/publish-content` (registerImage action)

### Completion: [ ] PENDING

---

## Phase 2: Higgsfield Anime for Top Traffic (July 26+)

### Status: PLANNED

Replace top-traffic episode covers with high-quality Higgsfield anime art.

**Top 5 episodes by traffic:**

| # | Episode ID | Title | Series | Why High Traffic |
|---|-----------|-------|--------|-----------------|
| 1 | `fifa26_ep1_history` | How the World Cup Began | FIFA 2026 | Pinned on home + banner |
| 2 | `multilingual_lion_mouse` | The Lion and the Mouse | Wisdom | Pinned on home hero |
| 3 | `krishna_squirrel` | Krishna and the Little Squirrel | Wisdom | Highest theme weight (1.8x) |
| 4 | `ks_ep1_cape` | The Golden Thread | Kindness Squad | First ep + compassion theme |
| 5 | `fta_ep1_afraid` | Afraid of Fire | Fire Truck Academy | First ep + adventure |

**Also: Home Feature Card**
- Hero slider images for pinned stories
- Series cover cards in CategoryShelves

**Higgsfield specs:**
- Model: GPT Image 2
- Style: Anime / Studio Ghibli inspired
- Resolution: 2K, 16:9
- Prompt suffix: "no text no words"
- Credits needed: ~5 per image × 5 episodes × 2 variations = 50 credits

### Completion: [ ] PENDING

---

## Phase 3: Full Higgsfield Migration (Future)

### Status: NOT STARTED

Replace ALL 590+ episode covers with consistent Higgsfield anime art.

**Approach:** Batch by series, highest-traffic first:
1. FIFA World Cup 2026 (17 episodes) — ~85 credits
2. Fire Truck Academy + originals (~30 episodes) — ~150 credits
3. Discover Countries (75 episodes) — ~375 credits
4. Collections (48 episodes) — ~240 credits
5. Islamic series (~50 episodes) — ~250 credits
6. Sikh + Belief series (50 episodes) — ~250 credits
7. Remaining (~330 episodes) — ~1,650 credits

**Total estimated: ~3,000 credits**

**Higgsfield plan needed:** Upgrade from Starter (165 credits) to higher tier for bulk generation.

### Completion: [ ] PENDING

---

## Rules Going Forward

1. **All new images → S3** (`media/stories/{episodeId}.jpg`)
2. **ContentPublisher auto-registers** in `config/wisdomImages` (already fixed)
3. **No more Firebase Storage uploads** — code updated to use S3
4. **Higgsfield for quality covers** — use GPT Image 2, anime style, 2K
5. **Audio stays on S3** (`audio/` prefix, already there)

---

## Files Changed

| File | Change |
|------|--------|
| `scripts/migrate-firebase-to-s3.js` | NEW — migration script |
| `scripts/update-firestore-urls.js` | NEW — Firestore URL updater |
| `docs/migration_firebase_S3_26jul.md` | NEW — this doc |
| `client/src/components/publisher/ContentPublisher.jsx` | Already uploads to S3 + registers |
| `api/publish-to-production.js` | Already saves coverImage to productionStories |

---

## Rollback Plan

If S3 images have issues:
1. Firestore `config/wisdomImages` still has old Firebase URLs in `scripts/migration-mapping.json`
2. Run reverse script to restore Firebase URLs
3. Firebase Storage images are NOT deleted during migration (safe)
