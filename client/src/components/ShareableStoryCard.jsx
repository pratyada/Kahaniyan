// Shareable story card — portrait visual card with moral + cover art.
// Rendered as DOM for preview, exported as canvas image for sharing.

import { forwardRef } from 'react';
import { getStoryArt, getTraditionArt } from '../utils/storyArt.js';
import { TRADITIONS } from '../data/culturalLessons.js';

const ShareableStoryCard = forwardRef(function ShareableStoryCard({ story, moral, childName, imageUrl }, ref) {
  const lessonKey = story?.id?.startsWith('lesson_') ? story.id.slice(7) : story?.id || '';
  const art = getStoryArt(lessonKey);
  const tradition = TRADITIONS.find((t) => t.key === story?.tradition);
  const tradArt = getTraditionArt(story?.tradition);

  return (
    <div
      ref={ref}
      style={{
        width: 360,
        height: 640,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 24,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: '#0a0a0f',
      }}
    >
      {/* Cover art area (top 55%) */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%' }}>
        <div style={{ position: 'absolute', inset: 0, background: art.gradient }} />
        {(imageUrl || art.image) && (
          <img
            src={imageUrl || art.image}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(10,10,15,0.95) 100%)',
        }} />
      </div>

      {/* Content overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '0 28px 32px',
      }}>
        {/* Tradition badge */}
        {tradition && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: `${tradArt.color}33`, borderRadius: 20,
            padding: '4px 10px', marginBottom: 12,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
              {tradition.icon} {tradition.label}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 style={{
          fontSize: 22, fontWeight: 700, color: '#f5f0e8',
          lineHeight: 1.3, marginBottom: 12,
          fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
        }}>
          {story?.title}
        </h2>

        {/* Moral */}
        <p style={{
          fontSize: 13, color: 'rgba(168,163,154,1)', lineHeight: 1.6,
          marginBottom: 16, maxHeight: 100, overflow: 'hidden',
        }}>
          "{moral}"
        </p>

        {/* Child's journey */}
        <p style={{ fontSize: 11, color: '#f0a500', fontWeight: 700, marginBottom: 20 }}>
          {childName ? `${childName}'s learning journey` : 'A learning journey'}
        </p>

        {/* Watermark */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16,
        }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#f5f0e8' }}>My Sleepy Tale</p>
            <p style={{ fontSize: 9, color: '#6e6a63' }}>mysleepytale.com</p>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'rgba(240,165,0,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>
            🌙
          </div>
        </div>
      </div>
    </div>
  );
});

export default ShareableStoryCard;
