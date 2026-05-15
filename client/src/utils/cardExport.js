// Export story card as image + share via native APIs.

export async function exportCardAsImage(domElement) {
  if (!domElement) { console.warn('Card: no DOM element'); return null; }

  try {
    // Clone the element and strip external images (they taint the canvas)
    const clone = domElement.cloneNode(true);
    clone.querySelectorAll('img').forEach((img) => img.remove());
    // Position off-screen for rendering
    clone.style.position = 'fixed';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    document.body.appendChild(clone);

    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(clone, {
      backgroundColor: '#0a0a0f',
      scale: 2,
      useCORS: false,
      allowTaint: false,
      logging: false,
      width: 360,
      height: 640,
    });

    document.body.removeChild(clone);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) console.warn('Card: canvas.toBlob returned null');
        resolve(blob);
      }, 'image/png');
    });
  } catch (e) {
    console.warn('Card export failed:', e.message);
    return null;
  }
}

export async function getStoryShareUrl(story, profile) {
  try {
    const { shareStoryToFirestore } = await import('./shareStory.js');
    const url = await shareStoryToFirestore(story, {
      beliefs: profile?.beliefs || [],
      country: profile?.country || '',
    });
    return url;
  } catch {
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
  const fullText = `${text}\n\n🔗 ${url}`;

  // Priority 1: Web Share API with image file
  if (blob) {
    try {
      const file = new File([blob], `MySleepyTale-${(story?.title || 'story').replace(/[^a-zA-Z0-9]/g, '_')}.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title, text: fullText, files: [file] });
        return 'shared';
      }
    } catch (e) {
      if (e.name === 'AbortError') return 'cancelled';
      console.warn('Share with file failed:', e.message);
    }
  }

  // Priority 2: Web Share API text-only
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return 'shared';
    } catch (e) {
      if (e.name === 'AbortError') return 'cancelled';
      console.warn('Share text failed:', e.message);
    }
  }

  // Priority 3: Copy to clipboard
  try {
    await navigator.clipboard.writeText(fullText);
    return 'copied';
  } catch {
    return 'failed';
  }
}

export async function downloadCardImage(blob, story) {
  if (!blob) return false;

  // On mobile: use Web Share API to "Save Image" (saves to gallery)
  try {
    const file = new File([blob], `MySleepyTale-${(story?.title || 'story').replace(/[^a-zA-Z0-9]/g, '_')}.png`, { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file] });
      return true;
    }
  } catch (e) {
    if (e.name === 'AbortError') return false;
  }

  // Fallback: download via <a> tag (desktop browsers)
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `MySleepyTale-${(story?.title || 'story').replace(/[^a-zA-Z0-9]/g, '_')}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
