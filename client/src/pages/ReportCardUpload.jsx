// Report Card Upload — Camera/file upload + AI processing.
// Route: /summer/upload

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useSummerAdventure } from '../hooks/useSummerAdventure.js';

export default function ReportCardUpload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { parseReportCard } = useSummerAdventure();
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    // Compress and convert
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 1600;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPreview(dataUrl);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!preview || !user) return;
    setProcessing(true);
    setError(null);
    try {
      const base64 = preview.split(',')[1];
      const result = await parseReportCard(base64, 'image/jpeg');
      if (result.error) throw new Error(result.error);

      // Save extracted data to session and navigate to profile
      sessionStorage.setItem('mst:reportCardData', JSON.stringify({
        extractedData: result.extractedData,
        imageUrl: result.imageUrl,
      }));
      navigate('/summer/profile');
    } catch (e) {
      setError(e.message);
    }
    setProcessing(false);
  };

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-6">
        <button onClick={() => navigate('/summer')} className="text-xs text-gold font-bold mb-2">← Back</button>
        <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
          📸 Upload <span className="text-gold">Report Card</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Take a photo or upload an image. AI will read it and extract your child's strengths and growth areas.
        </p>
      </header>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-xs text-red-400 ring-1 ring-red-500/20">
          {error} <button onClick={() => setError(null)} className="ml-2">✕</button>
        </div>
      )}

      {/* Upload area */}
      {!preview && (
        <div className="mb-6">
          <input type="file" accept="image/*" capture="environment" ref={fileRef} onChange={handleFile} className="hidden" />

          <button onClick={() => fileRef.current?.click()}
            className="w-full rounded-2xl border-2 border-dashed border-gold/30 bg-gold/5 p-12 text-center transition hover:border-gold/50 active:scale-98">
            <span className="text-5xl block mb-3">📷</span>
            <p className="text-sm font-bold text-ink">Tap to take a photo or choose a file</p>
            <p className="text-[11px] text-ink-muted mt-1">JPEG, PNG — report card, progress report, or teacher comments</p>
          </button>

          <div className="mt-4 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Tips for best results:</p>
            <div className="flex items-start gap-2 text-[11px] text-ink-muted">
              <span>✓</span><span>Place report card on a flat, well-lit surface</span>
            </div>
            <div className="flex items-start gap-2 text-[11px] text-ink-muted">
              <span>✓</span><span>Make sure all text is readable in the photo</span>
            </div>
            <div className="flex items-start gap-2 text-[11px] text-ink-muted">
              <span>✓</span><span>Include all pages if it's multi-page</span>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {preview && !processing && (
        <div className="mb-6">
          <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/10 mb-4">
            <img src={preview} alt="Report card" className="w-full" />
            <button onClick={() => { setPreview(null); setError(null); }}
              className="absolute top-2 right-2 rounded-full bg-black/50 px-3 py-1 text-[10px] text-white font-bold backdrop-blur-sm">
              ✕ Retake
            </button>
          </div>

          <button onClick={handleAnalyze}
            className="w-full rounded-full bg-gold px-8 py-4 text-base font-bold text-bg-base shadow-glow transition hover:brightness-110 active:scale-95">
            🧠 Analyze Report Card
          </button>
        </div>
      )}

      {/* Processing */}
      <AnimatePresence>
        {processing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-center py-16">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
              <span className="text-5xl block">🔭</span>
            </motion.div>
            <h2 className="mt-4 text-lg font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
              Reading report card...
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              AI is finding strengths and growth areas
            </p>
            <div className="mt-4 flex justify-center gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="h-2 w-2 rounded-full bg-gold"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No report card? Manual entry */}
      {!preview && !processing && (
        <div className="mt-4 rounded-xl bg-white/3 ring-1 ring-white/5 p-4 text-center">
          <p className="text-xs text-ink-muted">Don't have the report card handy?</p>
          <button onClick={() => {
            sessionStorage.setItem('mst:reportCardData', JSON.stringify({ extractedData: null, manual: true }));
            navigate('/summer/profile');
          }}
            className="mt-2 text-xs font-bold text-gold">
            Enter growth areas manually →
          </button>
        </div>
      )}

      <div className="h-32" />
    </PageTransition>
  );
}
