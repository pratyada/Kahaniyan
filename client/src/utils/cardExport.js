// Export a DOM element as a shareable image + share via native share sheet.

export async function exportCardAsImage(domElement) {
  if (!domElement) return null;

  try {
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(domElement, {
      backgroundColor: '#0a0a0f',
      scale: 2,
      useCORS: false,
      allowTaint: true,
      logging: false,
      // Skip cross-origin images that would taint the canvas
      onclone: (doc) => {
        // Remove crossOrigin attributes so images render with taint allowed
        doc.querySelectorAll('img[crossorigin]').forEach((img) => {
          img.removeAttribute('crossorigin');
        });
      },
    });
    return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  } catch (e) {
    console.warn('Card export failed:', e.message);
    return null;
  }
}

export async function getStoryShareUrl(story, profile) {
  // Save to Firestore so the shared link works for recipients
  try {
    const { shareStoryToFirestore } = await import('./shareStory.js');
    const url = await shareStoryToFirestore(story, {
      beliefs: profile?.beliefs || [],
      country: profile?.country || '',
    });
    return url;
  } catch {
    // Fallback: direct link (may not work if story isn't in Firestore)
    return `${window.location.origin}/player?storyId=${story?.id || ''}`;
  }
}

export function getShareText(story, childName) {
  const title = story?.title || 'a bedtime story';
  const name = childName ? `${childName} just` : 'We just';
  return `${name} listened to "${title}" on My Sleepy Tale — a bedtime story that teaches real values. Try it free!`;
}

export async function shareStoryCard(blob, story, childName, profile) {
  const url = await getStoryShareUrl(story, profile);
  const text = getShareText(story, childName);
  const title = `${story?.title} — My Sleepy Tale`;

  // Priority 1: Web Share API with image file (WhatsApp, iMessage, Instagram, etc.)
  if (blob) {
    const file = new File([blob], `${story?.title || 'story'}.png`, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          title,
          text: `${text}\n\n${url}`,
          files: [file],
        });
        return 'shared';
      } catch (e) {
        if (e.name === 'AbortError') return 'cancelled';
        // Fall through to share without image
      }
    }
  }

  // Priority 2: Web Share API without image (text + link only)
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch (e) {
      if (e.name === 'AbortError') return 'cancelled';
    }
  }

  // Priority 3: Copy link to clipboard
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return 'copied';
  } catch {
    return 'failed';
  }
}

export function downloadCardImage(blob, story) {
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${story?.title || 'story'}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
