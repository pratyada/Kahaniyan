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
  const [pages, setPages] = useState([]); // array of data URLs
  const [processing, setProcessing] = useState(false);
  const [processingPage, setProcessingPage] = useState(0);
  const [error, setError] = useState(null);

  const compressImage = (file) => new Promise((resolve) => {
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
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setError(null);
    const compressed = await Promise.all(files.map(f => compressImage(f)));
    setPages(prev => [...prev, ...compressed]);
  };

  const removePage = (index) => setPages(pages.filter((_, i) => i !== index));

  const handleAnalyze = async () => {
    if (pages.length === 0 || !user) return;
    setProcessing(true);
    setError(null);

    try {
      // Parse each page and merge results
      let allStrengths = [];
      let allGrowthAreas = [];
      let allSubjects = [];
      let allTeacherNotes = [];
      let allRecommendations = [];
      let childName = null;
      let grade = null;
      let school = null;
      const imageUrls = [];

      for (let i = 0; i < pages.length; i++) {
        setProcessingPage(i + 1);
        const base64 = pages[i].split(',')[1];
        const result = await parseReportCard(base64, 'image/jpeg');
        if (result.error) throw new Error(result.error);
        if (result.imageUrl) imageUrls.push(result.imageUrl);

        const d = result.extractedData || {};
        if (d.childName && !childName) childName = d.childName;
        if (d.grade && !grade) grade = d.grade;
        if (d.school && !school) school = d.school;
        if (d.strengths) allStrengths.push(...d.strengths);
        if (d.growthAreas) allGrowthAreas.push(...d.growthAreas);
        if (d.subjects) allSubjects.push(...d.subjects);
        if (d.teacherNotes) allTeacherNotes.push(...d.teacherNotes);
        if (d.recommendations) allRecommendations.push(...d.recommendations);
      }

      // Deduplicate by skill name
      const dedup = (arr) => {
        const seen = new Set();
        return arr.filter(item => {
          const key = (item.skill || item.name || '').toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      };

      const extractedData = {
        childName, grade, school,
        subjects: dedup(allSubjects),
        strengths: dedup(allStrengths),
        growthAreas: dedup(allGrowthAreas),
        learningSkills: [],
        teacherNotes: [...new Set(allTeacherNotes)],
        recommendations: [...new Set(allRecommendations)],
      };

      sessionStorage.setItem('mst:reportCardData', JSON.stringify({
        extractedData,
        imageUrls,
        pageCount: pages.length,
      }));
      navigate('/summer/profile');
    } catch (e) {
      setError(e.message);
    }
    setProcessing(false);
    setProcessingPage(0);
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

      {/* Upload area + page thumbnails */}
      {!processing && (
        <div className="mb-6">
          <input type="file" accept="image/*" multiple capture="environment" ref={fileRef} onChange={handleFiles} className="hidden" />

          {/* Page thumbnails */}
          {pages.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gold">{pages.length} page{pages.length !== 1 ? 's' : ''} uploaded</p>
                <button onClick={() => fileRef.current?.click()} className="text-[10px] font-bold text-gold">+ Add more pages</button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {pages.map((page, i) => (
                  <div key={i} className="relative shrink-0">
                    <img src={page} alt={`Page ${i + 1}`} className="w-24 h-32 rounded-lg object-cover ring-1 ring-white/10" />
                    <span className="absolute top-1 left-1 text-[8px] bg-gold text-bg-base px-1.5 py-0.5 rounded-full font-bold">P{i + 1}</span>
                    <button onClick={() => removePage(i)}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center">✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload button */}
          <button onClick={() => fileRef.current?.click()}
            className="w-full rounded-2xl border-2 border-dashed border-gold/30 bg-gold/5 p-8 text-center transition hover:border-gold/50 active:scale-98">
            <span className="text-4xl block mb-2">📷</span>
            <p className="text-sm font-bold text-ink">{pages.length === 0 ? 'Tap to take photos or choose files' : 'Add more pages'}</p>
            <p className="text-[11px] text-ink-muted mt-1">Upload all pages of the report card — 1, 2, 3, or 4 pages</p>
          </button>

          {pages.length === 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Tips for best results:</p>
              <div className="flex items-start gap-2 text-[11px] text-ink-muted"><span>✓</span><span>Place report card on a flat, well-lit surface</span></div>
              <div className="flex items-start gap-2 text-[11px] text-ink-muted"><span>✓</span><span>Upload ALL pages (front + back, page 1-4)</span></div>
              <div className="flex items-start gap-2 text-[11px] text-ink-muted"><span>✓</span><span>Make sure all text is readable in each photo</span></div>
            </div>
          )}

          {/* Analyze button */}
          {pages.length > 0 && (
            <button onClick={handleAnalyze}
              className="w-full mt-4 rounded-full bg-gold px-8 py-4 text-base font-bold text-bg-base shadow-glow transition hover:brightness-110 active:scale-95">
              🧠 Analyze {pages.length} Page{pages.length !== 1 ? 's' : ''}
            </button>
          )}
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
              Reading page {processingPage} of {pages.length}...
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              AI is finding strengths and growth areas
            </p>
            <div className="mt-3 mx-auto max-w-xs h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div className="h-full bg-gold rounded-full"
                animate={{ width: `${(processingPage / pages.length) * 100}%` }}
                transition={{ duration: 0.3 }} />
            </div>
            <p className="mt-2 text-[10px] text-ink-dim">{processingPage}/{pages.length} pages analyzed</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No report card? Manual entry */}
      {pages.length === 0 && !processing && (
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
