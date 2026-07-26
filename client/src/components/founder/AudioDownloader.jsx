// Audio Downloader — Generate & download MP3s for entire series
// For YouTube / Spotify publishing. Founder-only (Prateek + Raksha).

import { useState, useMemo } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useLocalizedSeries } from '../../hooks/useLocalizedData.js';
import { Download, Play, Loader, CheckCircle, XCircle } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || '';

const VOICES = [
  { id: 'sage', label: 'Sage (calm narrator)', region: 'Indian/Western' },
  { id: 'fable', label: 'Fable (British)', region: 'British' },
  { id: 'coral', label: 'Coral (warm female)', region: 'Universal' },
  { id: 'ash', label: 'Ash (warm male)', region: 'Universal' },
  { id: 'onyx', label: 'Onyx (deep resonant)', region: 'Arabic' },
  { id: 'echo', label: 'Echo (mature male)', region: 'Universal' },
  { id: 'shimmer', label: 'Shimmer (soft female)', region: 'Universal' },
  { id: 'nova', label: 'Nova (energetic female)', region: 'Universal' },
];

const SPEEDS = [
  { value: 0.8, label: '0.8x (slow bedtime)' },
  { value: 0.9, label: '0.9x (default)' },
  { value: 1.0, label: '1.0x (normal)' },
  { value: 1.1, label: '1.1x (slightly fast)' },
];

export default function AudioDownloader() {
  const { user } = useAuth();
  const SERIES = useLocalizedSeries();
  const [selectedSeries, setSelectedSeries] = useState('');
  const [voice, setVoice] = useState('sage');
  const [speed, setSpeed] = useState(0.9);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState([]); // { id, title, status, audioUrl, error }
  const [currentEp, setCurrentEp] = useState(0);

  const series = useMemo(() => SERIES.find(s => s.id === selectedSeries), [SERIES, selectedSeries]);

  const generateAll = async () => {
    if (!series || !user) return;
    setGenerating(true);
    setProgress([]);
    setCurrentEp(0);

    const results = [];

    for (let i = 0; i < series.episodes.length; i++) {
      const ep = series.episodes[i];
      setCurrentEp(i + 1);
      setProgress(prev => [...prev, { id: ep.id, title: ep.title, episodeNumber: ep.episodeNumber, status: 'generating' }]);

      try {
        const res = await fetch(`${API}/api/batch-audio`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            uid: user.uid,
            episodeId: ep.id,
            title: ep.title,
            text: ep.body || '',
            voice,
            speed,
          }),
        });
        const data = await res.json();
        if (data.audioUrl) {
          results.push({ ...data, status: 'done', episodeNumber: ep.episodeNumber });
          setProgress(prev => prev.map(p => p.id === ep.id ? { ...p, status: 'done', audioUrl: data.audioUrl, cached: data.cached } : p));
        } else {
          results.push({ id: ep.id, title: ep.title, status: 'failed', error: data.error });
          setProgress(prev => prev.map(p => p.id === ep.id ? { ...p, status: 'failed', error: data.error } : p));
        }
      } catch (e) {
        results.push({ id: ep.id, title: ep.title, status: 'failed', error: e.message });
        setProgress(prev => prev.map(p => p.id === ep.id ? { ...p, status: 'failed', error: e.message } : p));
      }
    }

    setGenerating(false);
  };

  const downloadFile = async (url, filename) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadAll = () => {
    const done = progress.filter(p => p.status === 'done' && p.audioUrl);
    done.forEach((p, i) => {
      setTimeout(() => {
        const num = String(p.episodeNumber || i + 1).padStart(2, '0');
        const safeName = p.title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
        downloadFile(p.audioUrl, `${num}_${safeName}.mp3`);
      }, i * 500); // stagger downloads
    });
  };

  const doneCount = progress.filter(p => p.status === 'done').length;
  const failedCount = progress.filter(p => p.status === 'failed').length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-bg-surface p-6 ring-1 ring-white/10">
        <h3 className="text-lg font-bold text-ink mb-1" style={{ fontFamily: 'Lora, serif' }}>
          🎧 Audio Downloader
        </h3>
        <p className="text-xs text-ink-muted mb-5">
          Generate HD MP3 audio for entire series — ready for YouTube & Spotify.
        </p>

        {/* Series selector */}
        <div className="mb-4">
          <label className="text-xs font-bold text-ink-muted mb-1 block">Select Series</label>
          <select
            value={selectedSeries}
            onChange={e => { setSelectedSeries(e.target.value); setProgress([]); }}
            className="w-full rounded-xl bg-bg-base px-4 py-3 text-sm text-ink ring-1 ring-white/10 outline-none"
          >
            <option value="">Choose a series...</option>
            {SERIES.map(s => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.title} ({s.episodes.length} episodes)
              </option>
            ))}
          </select>
        </div>

        {/* Voice + Speed */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="text-xs font-bold text-ink-muted mb-1 block">Voice</label>
            <select
              value={voice}
              onChange={e => setVoice(e.target.value)}
              className="w-full rounded-xl bg-bg-base px-3 py-2.5 text-sm text-ink ring-1 ring-white/10 outline-none"
            >
              {VOICES.map(v => (
                <option key={v.id} value={v.id}>{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-ink-muted mb-1 block">Speed</label>
            <select
              value={speed}
              onChange={e => setSpeed(parseFloat(e.target.value))}
              className="w-full rounded-xl bg-bg-base px-3 py-2.5 text-sm text-ink ring-1 ring-white/10 outline-none"
            >
              {SPEEDS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={generateAll}
          disabled={!selectedSeries || generating}
          className="w-full rounded-xl bg-gold px-6 py-3 text-sm font-bold text-bg-base transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <Loader size={16} className="animate-spin" />
              Generating {currentEp} of {series?.episodes.length}...
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              Generate All Audio ({series?.episodes.length || 0} episodes)
            </>
          )}
        </button>
      </div>

      {/* Progress & Downloads */}
      {progress.length > 0 && (
        <div className="rounded-2xl bg-bg-surface p-6 ring-1 ring-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-ink">
                {generating ? 'Generating...' : 'Audio Ready'}
              </h4>
              <p className="text-[10px] text-ink-muted">
                {doneCount} done{failedCount > 0 ? `, ${failedCount} failed` : ''}
              </p>
            </div>
            {doneCount > 0 && !generating && (
              <button
                onClick={downloadAll}
                className="rounded-xl bg-green-500/20 px-4 py-2 text-xs font-bold text-green-400 ring-1 ring-green-500/30 transition active:scale-95 flex items-center gap-1.5"
              >
                <Download size={14} />
                Download All ({doneCount})
              </button>
            )}
          </div>

          <div className="space-y-2">
            {progress.map(p => (
              <div key={p.id} className="flex items-center gap-3 rounded-xl bg-bg-base p-3 ring-1 ring-white/5">
                <div className="shrink-0">
                  {p.status === 'generating' && <Loader size={16} className="text-gold animate-spin" />}
                  {p.status === 'done' && <CheckCircle size={16} className="text-green-400" />}
                  {p.status === 'failed' && <XCircle size={16} className="text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-ink truncate">
                    Ep {p.episodeNumber} — {p.title}
                  </p>
                  {p.cached && <span className="text-[9px] text-ink-dim">cached</span>}
                  {p.error && <p className="text-[9px] text-red-400 truncate">{p.error}</p>}
                </div>
                {p.status === 'done' && p.audioUrl && (
                  <button
                    onClick={() => {
                      const num = String(p.episodeNumber).padStart(2, '0');
                      const safeName = p.title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_');
                      downloadFile(p.audioUrl, `${num}_${safeName}.mp3`);
                    }}
                    className="shrink-0 rounded-lg bg-gold/20 px-3 py-1.5 text-[10px] font-bold text-gold transition active:scale-95"
                  >
                    ⬇️ MP3
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
