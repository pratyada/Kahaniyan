// Export a DOM element as a shareable image.
// Uses html2canvas if available, otherwise offers a screenshot prompt.

export async function exportCardAsImage(domElement) {
  if (!domElement) return null;

  try {
    // Dynamically import html2canvas
    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(domElement, {
      backgroundColor: '#0a0a0f',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
    });
    return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  } catch {
    // html2canvas not available — return null
    return null;
  }
}

export async function shareCardImage(blob, story) {
  if (!blob) return false;

  const file = new File([blob], `${story?.title || 'story'}.png`, { type: 'image/png' });

  // Try Web Share API with file
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: `${story?.title} — My Sleepy Tale`,
        text: 'A story from My Sleepy Tale',
        files: [file],
      });
      return true;
    } catch (e) {
      if (e.name === 'AbortError') return false;
    }
  }

  // Fallback: download the image
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${story?.title || 'story'}.png`;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}
