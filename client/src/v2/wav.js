// Convert a recorded audio Blob (usually webm/opus from MediaRecorder) into a
// 16-bit PCM WAV Blob. WAV plays on EVERY browser including iOS Safari, which
// cannot decode webm/opus — so shared kid recordings play everywhere.
// Dependency-free (Web Audio API). Mono, 16 kHz keeps the file small.
export async function toWav(blob, sampleRate = 16000) {
  const arrayBuf = await blob.arrayBuffer();
  const AC = window.AudioContext || window.webkitAudioContext;
  const ctx = new AC();
  const decoded = await ctx.decodeAudioData(arrayBuf);

  // Mix down to mono
  const chs = decoded.numberOfChannels;
  const len = decoded.length;
  const mono = new Float32Array(len);
  for (let c = 0; c < chs; c++) {
    const data = decoded.getChannelData(c);
    for (let i = 0; i < len; i++) mono[i] += data[i] / chs;
  }

  // Resample (linear) to the target rate
  const ratio = decoded.sampleRate / sampleRate;
  const outLen = Math.max(1, Math.floor(len / ratio));
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const idx = i * ratio;
    const i0 = Math.floor(idx);
    const i1 = Math.min(i0 + 1, len - 1);
    const f = idx - i0;
    out[i] = mono[i0] * (1 - f) + mono[i1] * f;
  }
  try { ctx.close(); } catch {}

  // Encode 16-bit PCM WAV
  const bytesPerSample = 2;
  const buffer = new ArrayBuffer(44 + outLen * bytesPerSample);
  const view = new DataView(buffer);
  const writeStr = (off, s) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + outLen * bytesPerSample, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);        // PCM chunk size
  view.setUint16(20, 1, true);         // PCM format
  view.setUint16(22, 1, true);         // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);        // bits per sample
  writeStr(36, 'data');
  view.setUint32(40, outLen * bytesPerSample, true);
  let off = 44;
  for (let i = 0; i < outLen; i++) {
    const s = Math.max(-1, Math.min(1, out[i]));
    view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    off += 2;
  }
  return new Blob([view], { type: 'audio/wav' });
}
