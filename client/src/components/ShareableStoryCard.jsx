// Shareable story card — Instagram-story sized (1080x1920 logical, rendered at 360x640).
// Premium design: full-bleed art, quote-style moral, glowing accents.

import { forwardRef } from 'react';
import { getStoryArt, getTraditionArt } from '../utils/storyArt.js';
import { TRADITIONS } from '../data/culturalLessons.js';
import { valueMeta } from '../utils/constants.js';

const ShareableStoryCard = forwardRef(function ShareableStoryCard({ story, moral, childName, imageUrl, feeling }, ref) {
  const lessonKey = story?.id?.startsWith('lesson_') ? story.id.slice(7) : story?.id || '';
  const art = getStoryArt(lessonKey);
  const tradition = TRADITIONS.find((t) => t.key === story?.tradition);
  const tradArt = getTraditionArt(story?.tradition);
  const value = valueMeta(story?.value);

  // Short moral for the card (max 2 sentences)
  const shortMoral = moral
    ? moral.split(/[.!?]+/).filter(Boolean).slice(0, 2).join('. ').trim() + '.'
    : '';

  return (
    <div
      ref={ref}
      style={{
        width: 360, height: 640,
        position: 'relative', overflow: 'hidden', borderRadius: 28,
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: '#0a0a0f',
      }}
    >
      {/* Full-bleed cover image/gradient */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div style={{ position: 'absolute', inset: 0, background: art.gradient }} />
        {(imageUrl || art.image) && (
          <img
            src={imageUrl || art.image}
            alt=""
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        {/* Multi-layer overlay for depth */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.3) 30%, rgba(10,10,15,0.85) 65%, rgba(10,10,15,0.98) 100%)',
        }} />
      </div>

      {/* Top: tradition badge + value emoji */}
      <div style={{
        position: 'absolute', top: 24, left: 24, right: 24,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {tradition && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
            borderRadius: 24, padding: '6px 14px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.02em' }}>
              {tradition.icon} {tradition.label}
            </span>
          </div>
        )}
        {value && (
          <div style={{
            width: 36, height: 36, borderRadius: 12,
            background: `${value.color}22`, border: `1px solid ${value.color}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>
            {value.emoji}
          </div>
        )}
      </div>

      {/* Center: large play icon hint */}
      <div style={{
        position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 64, height: 64, borderRadius: 32,
        background: 'rgba(240,165,0,0.2)', border: '2px solid rgba(240,165,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{
          width: 0, height: 0,
          borderLeft: '18px solid rgba(240,165,0,0.9)',
          borderTop: '11px solid transparent',
          borderBottom: '11px solid transparent',
          marginLeft: 4,
        }} />
      </div>

      {/* Bottom content */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '0 24px 28px',
      }}>
        {/* Title */}
        <h2 style={{
          fontSize: 24, fontWeight: 800, color: '#f5f0e8',
          lineHeight: 1.25, marginBottom: 14,
          fontFamily: "'Fraunces', 'Playfair Display', Georgia, serif",
          textShadow: '0 2px 12px rgba(0,0,0,0.5)',
        }}>
          {story?.title}
        </h2>

        {/* Moral quote — styled with gold accent bar */}
        {shortMoral && (
          <div style={{
            display: 'flex', gap: 10, marginBottom: 16,
            padding: '12px 14px',
            background: 'rgba(240,165,0,0.06)',
            borderLeft: '3px solid rgba(240,165,0,0.6)',
            borderRadius: '0 12px 12px 0',
          }}>
            <p style={{
              fontSize: 12, color: 'rgba(245,240,232,0.8)', lineHeight: 1.6,
              fontStyle: 'italic', margin: 0,
              maxHeight: 76, overflow: 'hidden',
            }}>
              {shortMoral}
            </p>
          </div>
        )}

        {/* Child badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 14,
            background: 'linear-gradient(135deg, #f0a500, #b87f00)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#0a0a0f',
          }}>
            {(childName || 'K')[0].toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f0a500', margin: 0, lineHeight: 1.2 }}>
              {childName ? `${childName}'s story tonight` : 'A bedtime story'}
            </p>
            <p style={{ fontSize: 9, color: 'rgba(168,163,154,0.7)', margin: 0, lineHeight: 1.2, marginTop: 2 }}>
              {feeling ? `Feeling: ${feeling}` : 'Tap to listen free'}
            </p>
          </div>
        </div>

        {/* Brand footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'rgba(240,165,0,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}>
              🌙
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 800, color: '#f5f0e8', margin: 0, letterSpacing: '0.02em' }}>
                My Sleepy Tale
              </p>
              <p style={{ fontSize: 8, color: '#6e6a63', margin: 0, marginTop: 1 }}>
                Stories that teach values
              </p>
            </div>
          </div>
          <div style={{
            padding: '5px 10px', borderRadius: 8,
            background: 'rgba(240,165,0,0.1)', border: '1px solid rgba(240,165,0,0.2)',
          }}>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#f0a500', margin: 0 }}>
              Try Free
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ShareableStoryCard;
