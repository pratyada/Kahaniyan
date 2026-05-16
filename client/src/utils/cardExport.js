// Share story card — draw directly on Canvas (no html2canvas dependency).

import { getStoryArt, getTraditionArt } from './storyArt.js';
import { TRADITIONS } from '../data/culturalLessons.js';
import { valueMeta } from './constants.js';

export async function drawStoryCard(story, moral, childName) {
  const W = 720, H = 1280; // 2x for retina
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  const lessonKey = story?.id?.startsWith('lesson_') ? story.id.slice(7) : story?.id || '';
  const art = getStoryArt(lessonKey);
  const tradition = TRADITIONS.find((t) => t.key === story?.tradition);
  const tradArt = getTraditionArt(story?.tradition);
  const value = valueMeta(story?.value);

  // Background — parse gradient colors from art.gradient
  const colors = (art.gradient.match(/#[a-fA-F0-9]{6}/g) || ['#1a1a2e', '#0a0a0f']);
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, colors[0]);
  grad.addColorStop(0.5, colors[1] || colors[0]);
  grad.addColorStop(1, colors[2] || '#0a0a0f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Dark overlay at bottom for text
  const overlay = ctx.createLinearGradient(0, H * 0.3, 0, H);
  overlay.addColorStop(0, 'rgba(10,10,15,0.2)');
  overlay.addColorStop(0.5, 'rgba(10,10,15,0.8)');
  overlay.addColorStop(1, 'rgba(10,10,15,0.98)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, W, H);

  // Play button circle in upper area
  ctx.beginPath();
  ctx.arc(W / 2, H * 0.32, 64, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(240,165,0,0.15)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(240,165,0,0.4)';
  ctx.lineWidth = 3;
  ctx.stroke();
  // Play triangle
  ctx.beginPath();
  ctx.moveTo(W / 2 - 16, H * 0.32 - 22);
  ctx.lineTo(W / 2 - 16, H * 0.32 + 22);
  ctx.lineTo(W / 2 + 24, H * 0.32);
  ctx.closePath();
  ctx.fillStyle = 'rgba(240,165,0,0.8)';
  ctx.fill();

  // Tradition badge (top left)
  if (tradition) {
    const badgeText = `${tradition.icon} ${tradition.label}`;
    ctx.font = 'bold 22px "DM Sans", system-ui, sans-serif';
    const badgeW = ctx.measureText(badgeText).width + 28;
    roundRect(ctx, 40, 44, badgeW, 40, 20);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(badgeText, 54, 72);
  }

  // Value emoji (top right)
  if (value?.emoji) {
    ctx.font = '32px sans-serif';
    ctx.fillText(value.emoji, W - 80, 72);
  }

  // Title
  ctx.font = 'bold 44px "Playfair Display", Georgia, serif';
  ctx.fillStyle = '#f5f0e8';
  wrapText(ctx, story?.title || 'A Story', 48, H * 0.58, W - 96, 54);

  // Gold accent bar + moral
  const moralY = H * 0.68;
  ctx.fillStyle = 'rgba(240,165,0,0.5)';
  ctx.fillRect(48, moralY, 5, 100);
  ctx.font = 'italic 22px "DM Sans", system-ui, sans-serif';
  ctx.fillStyle = 'rgba(245,240,232,0.7)';
  const shortMoral = moral ? moral.split(/[.!?]+/).filter(Boolean).slice(0, 2).join('. ').trim() + '.' : '';
  wrapText(ctx, shortMoral, 68, moralY + 24, W - 120, 30);

  // Child badge
  const badgeY = H * 0.82;
  ctx.beginPath();
  ctx.arc(76, badgeY, 24, 0, Math.PI * 2);
  const avatarGrad = ctx.createLinearGradient(52, badgeY - 24, 100, badgeY + 24);
  avatarGrad.addColorStop(0, '#f0a500');
  avatarGrad.addColorStop(1, '#b87f00');
  ctx.fillStyle = avatarGrad;
  ctx.fill();
  ctx.font = 'bold 22px "DM Sans", sans-serif';
  ctx.fillStyle = '#0a0a0f';
  ctx.textAlign = 'center';
  ctx.fillText((childName || 'K')[0].toUpperCase(), 76, badgeY + 8);
  ctx.textAlign = 'left';

  ctx.font = 'bold 20px "DM Sans", sans-serif';
  ctx.fillStyle = '#f0a500';
  ctx.fillText(childName ? `${childName}'s story tonight` : 'A bedtime story', 112, badgeY - 4);
  ctx.font = '16px "DM Sans", sans-serif';
  ctx.fillStyle = 'rgba(168,163,154,0.7)';
  ctx.fillText('Tap link to listen free', 112, badgeY + 18);

  // Brand footer
  const footerY = H * 0.91;
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(48, footerY, W - 96, 1);

  ctx.font = 'bold 20px "DM Sans", sans-serif';
  ctx.fillStyle = '#f5f0e8';
  ctx.fillText('🌙  My Sleepy Tale', 48, footerY + 34);
  ctx.font = '14px "DM Sans", sans-serif';
  ctx.fillStyle = '#6e6a63';
  ctx.fillText('Stories that teach values · mysleepytale.com', 48, footerY + 56);

  // "Try Free" pill (right side)
  const tryW = 100;
  roundRect(ctx, W - 48 - tryW, footerY + 16, tryW, 36, 10);
  ctx.fillStyle = 'rgba(240,165,0,0.12)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(240,165,0,0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.font = 'bold 16px "DM Sans", sans-serif';
  ctx.fillStyle = '#f0a500';
  ctx.textAlign = 'center';
  ctx.fillText('Try Free', W - 48 - tryW / 2, footerY + 40);
  ctx.textAlign = 'left';

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx, text, x, y, maxW, lineH) {
  if (!text) return;
  const words = text.split(' ');
  let line = '';
  let curY = y;
  let lines = 0;
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line.trim(), x, curY);
      line = word + ' ';
      curY += lineH;
      lines++;
      if (lines >= 3) { ctx.fillText(line.trim() + '...', x, curY); return; }
    } else {
      line = test;
    }
  }
  if (line.trim()) ctx.fillText(line.trim(), x, curY);
}

// ── Share helpers ──

export async function getStoryShareUrl(story, profile) {
  // Use /api/share/ URL — serves dynamic OG tags for WhatsApp/iMessage previews
  const storyId = story?.id || '';
  const apiBase = import.meta.env.VITE_API_BASE_URL || '';
  const shareUrl = `${apiBase}/api/share?id=${storyId}`;

  // Also save to Firestore for non-wisdom stories
  if (!story?.isWisdom) {
    try {
      const { shareStoryToFirestore } = await import('./shareStory.js');
      await shareStoryToFirestore(story, {
        beliefs: profile?.beliefs || [],
        country: profile?.country || '',
      });
    } catch {}
  }

  return shareUrl;
}

export function getShareText(story, childName) {
  const title = story?.title || 'a bedtime story';
  const name = childName ? `${childName} just` : 'We just';
  return `${name} listened to "${title}" on My Sleepy Tale — a bedtime story that teaches real values. Try it free!`;
}

export async function shareStoryCard(story, childName, profile, moral) {
  const blob = await drawStoryCard(story, moral, childName);
  const url = await getStoryShareUrl(story, profile);
  const text = getShareText(story, childName);
  const title = `${story?.title} — My Sleepy Tale`;
  const fullText = `${text}\n\n🔗 ${url}`;

  // Priority 1: Share with image
  if (blob) {
    try {
      const file = new File([blob], 'MySleepyTale.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title, text: fullText, files: [file] });
        return 'shared';
      }
    } catch (e) {
      if (e.name === 'AbortError') return 'cancelled';
    }
  }

  // Priority 2: Share text only
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch (e) {
      if (e.name === 'AbortError') return 'cancelled';
    }
  }

  // Priority 3: Copy
  try {
    await navigator.clipboard.writeText(fullText);
    return 'copied';
  } catch {
    return 'failed';
  }
}

export async function saveCardImage(story, moral, childName) {
  const blob = await drawStoryCard(story, moral, childName);
  if (!blob) return false;

  // Mobile: share sheet with "Save Image" option
  try {
    const file = new File([blob], 'MySleepyTale.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file] });
      return true;
    }
  } catch (e) {
    if (e.name === 'AbortError') return false;
  }

  // Desktop: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'MySleepyTale.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
