// Content Publisher — 4-step wizard for publishing episodes, series, stories, blogs.
// Lives inside Founder Hub. Saves to Firestore publishedContent — instantly live.

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../lib/firebase.js';
import { SERIES } from '../../data/series.js';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

const API = import.meta.env.VITE_API_URL || '';

const TRADITIONS = [
  { v: 'universal', l: '🌍 Universal' }, { v: 'hindu', l: '🙏 Hindu' },
  { v: 'muslim', l: '☪️ Islamic' }, { v: 'catholic', l: '✝️ Catholic' },
  { v: 'sikh', l: '🪯 Sikh' }, { v: 'buddhist', l: '☸️ Buddhist' },
  { v: 'jewish', l: '✡️ Jewish' }, { v: 'filipino', l: '🇵🇭 Filipino' },
  { v: 'hispanic', l: '🇲🇽 Hispanic' }, { v: 'indigenous', l: '🪶 Indigenous' },
];
const THEMES = ['courage', 'kindness', 'wisdom', 'honesty', 'friendship', 'perseverance', 'sharing', 'humility', 'forgiveness', 'patience', 'gratitude'];
const TYPES = [
  { id: 'episode', icon: '🎧', label: 'New Episode', desc: 'Add to an existing series' },
  { id: 'series', icon: '📚', label: 'New Series', desc: 'Create a series + first episode' },
  { id: 'story', icon: '✨', label: 'Standalone Story', desc: 'Single wisdom/bedtime story' },
  { id: 'blog', icon: '📝', label: 'Blog Post', desc: 'SEO blog article' },
];
const BLOG_CATS = ['psychology', 'guide', 'culture', 'creators', 'toronto', 'fifa', 'comparison'];
const SERIES_LIST = [
  { id: 'rainbow-kindergarten-jlps-yr25-26', name: '🌈 Rainbow Kindergarten Adventures' },
  { id: 'fifa-world-cup-2026', name: '⚽ FIFA World Cup 2026 — Toronto' },
  { id: 'fifa-world-cup-2026-dallas', name: '⚽ FIFA World Cup 2026 — Dallas' },
  { id: 'fire-truck-academy', name: '🚒 Fire Truck Academy' },
  { id: 'dr-spock-parenting', name: '👨‍⚕️ Dr. Spock Says' },
  { id: 'little-astronaut', name: '🚀 Little Astronaut' },
  { id: 'who-would-win-series', name: '🥊 Who Would Win?' },
  { id: 'who-would-win-animals', name: '🦁 Who Would Win? — Animal Battles' },
  { id: 'panchatantra-tales', name: '🐒 Panchatantra Tales' },
  { id: 'lightning-wheels', name: '🏎️ Lightning Wheels' },
  { id: 'rocket-adventures', name: '🚀 Rocket Adventures' },
  { id: 'kindness-squad', name: '💛 The Kindness Squad' },
  { id: 'planet-explorers', name: '🪐 Planet Explorers' },
  { id: 'planets-and-stars', name: '🌟 Planets & Stars' },
  { id: 'camping-outdoors', name: '🏕️ Camping & Outdoors' },
  { id: 'music-lessons', name: '🎵 Music Lessons' },
  { id: 'water-and-swim', name: '🏊 Water & Swim' },
  { id: 'maths-adventures', name: '🔢 Maths Adventures' },
  { id: 'geometry-shapes', name: '📐 Geometry & Shapes' },
  { id: 'discover-india', name: '🇮🇳 Discover India' },
  { id: 'discover-canada', name: '🇨🇦 Discover Canada' },
  { id: 'discover-united-states', name: '🇺🇸 Discover United States' },
  { id: 'stories-of-the-prophets', name: '☪️ Stories of the Prophets' },
  { id: 'names-of-allah', name: '☪️ Beautiful Names of Allah' },
  { id: 'ramadan-adventures', name: '☪️ Ramadan Adventures' },
  { id: 'tallest-towers', name: '🗼 Tallest Towers in the World' },
];

export default function ContentPublisher({ user }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState('episode');
  const [published, setPublished] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [aiWriting, setAiWriting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Form state
  const [form, setForm] = useState({
    title: '', subtitle: '', body: '', tradition: 'universal', theme: 'kindness',
    durationMinutes: 2, source: '', seriesId: '', episodeNumber: 1,
    coverImage: '', coverImageBase64: '', images: [],
    metaDescription: '', imagePrompt: '',
    blog: { enabled: false, slug: '', category: 'guide', tag: 'Story', readingTime: 5 },
    aiTopic: '',
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setBlog = (key, val) => setForm(f => ({ ...f, blog: { ...f.blog, [key]: val } }));

  // Load published content history
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(
      query(collection(db, 'publishedContent'), orderBy('createdAt', 'desc'), limit(20)),
      (snap) => setPublished(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      () => {}
    );
    return unsub;
  }, []);

  // AI story writer
  const handleAiWrite = async () => {
    if (!form.aiTopic.trim()) return;
    setAiWriting(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/ai-story-writer`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid, topic: form.aiTopic, tradition: form.tradition,
          theme: form.theme, targetAge: '4-7', duration: form.durationMinutes,
          seriesContext: form.source || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm(f => ({
        ...f,
        title: data.title || f.title,
        subtitle: data.subtitle || f.subtitle,
        body: data.body || f.body,
        metaDescription: data.metaDescription || f.metaDescription,
        durationMinutes: data.estimatedMinutes || f.durationMinutes,
      }));
      setStep(2);
    } catch (e) {
      setError('AI write failed: ' + e.message);
    }
    setAiWriting(false);
  };

  // Compress image to max 1200px, JPEG quality 0.7 (~100-200KB each)
  const compressImage = (file) => new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 1200;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  // Image upload handler
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    files.forEach(async (file) => {
      const compressed = await compressImage(file);
      setForm(f => {
        const newImages = [...f.images, compressed];
        return {
          ...f,
          images: newImages,
          coverImage: newImages[0],
          coverImageBase64: newImages[0].split(',')[1],
        };
      });
    });
  };

  const removeImage = (index) => {
    setForm(f => {
      const newImages = f.images.filter((_, i) => i !== index);
      return {
        ...f,
        images: newImages,
        coverImage: newImages[0] || '',
        coverImageBase64: newImages[0] ? newImages[0].split(',')[1] : '',
      };
    });
  };

  // Publish
  const handlePublish = async () => {
    if (!form.title || !form.body) { setError('Title and story text required'); return; }
    setPublishing(true);
    setError(null);
    try {
      const id = form.seriesId
        ? `${form.seriesId.replace(/-/g, '_')}_ep${form.episodeNumber}_${form.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30)}`
        : form.title.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 50);

      const slug = form.blog.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60);

      // Upload images one-by-one first (avoids Lambda 6MB payload limit)
      const uploadedImageUrls = [];
      for (let i = 0; i < form.images.length; i++) {
        const img = form.images[i];
        if (img.startsWith('http')) {
          uploadedImageUrls.push(img);
        } else {
          const b64 = img.split(',')[1];
          const imgRes = await fetch(`${API}/api/upload-image`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ key: `media/published/${id}_img${i}.jpg`, image: b64, contentType: 'image/jpeg' }),
          });
          if (imgRes.ok) {
            const { imageUrl } = await imgRes.json();
            uploadedImageUrls.push(imageUrl);
          }
        }
      }

      const content = {
        ...form,
        id,
        type,
        blog: { ...form.blog, slug },
        coverImage: uploadedImageUrls[0] || form.coverImage || '',
        coverImageBase64: undefined, // already uploaded
        images: uploadedImageUrls,
      };

      const res = await fetch(`${API}/api/publish-content`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setStep(4);
    } catch (e) {
      setError('Publish failed: ' + e.message);
    }
    setPublishing(false);
  };

  const wordCount = (form.body || '').split(/\s+/).filter(Boolean).length;
  const estMinutes = Math.round(wordCount / 150) || 1;

  return (
    <div>
      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-5">
        {['Type', 'Write', 'Preview', 'Published'].map((label, i) => (
          <button key={label} onClick={() => i < 3 && setStep(i + 1)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold transition ${
              step === i + 1 ? 'bg-gold text-bg-base' : step > i + 1 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-ink-dim'
            }`}>
            {step > i + 1 ? '✓' : i + 1}. {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-xs text-red-400 ring-1 ring-red-500/20">
          {error} <button onClick={() => setError(null)} className="ml-2">✕</button>
        </div>
      )}

      {/* Step 1: Type */}
      {step === 1 && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {TYPES.map(t => (
              <button key={t.id} onClick={() => { setType(t.id); setStep(2); }}
                className={`rounded-2xl p-4 text-left ring-1 transition active:scale-98 ${
                  type === t.id ? 'bg-gold/10 ring-gold/30' : 'bg-bg-surface ring-white/5 hover:ring-gold/20'
                }`}>
                <span className="text-2xl">{t.icon}</span>
                <h3 className="text-sm font-bold text-ink mt-2">{t.label}</h3>
                <p className="text-[10px] text-ink-muted mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>

          {/* AI Quick Start */}
          <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 p-4 mt-4">
            <h3 className="text-xs font-bold text-ink mb-2">✨ Or start with AI — describe what you want</h3>
            <textarea
              value={form.aiTopic}
              onChange={e => set('aiTopic', e.target.value)}
              placeholder="e.g., Write a story about Veda's first swimming lesson at the community pool... or: Next episode of kindergarten series about the end-of-year picnic"
              className="w-full rounded-xl bg-bg-base px-3 py-2.5 text-xs text-ink ring-1 ring-white/10 focus:ring-gold/50 outline-none resize-y min-h-[60px]"
              rows={2}
            />
            <button onClick={handleAiWrite} disabled={!form.aiTopic.trim() || aiWriting}
              className="mt-2 w-full rounded-full bg-gold px-4 py-2.5 text-xs font-bold text-bg-base shadow-glow disabled:opacity-40">
              {aiWriting ? '⏳ AI is writing...' : '✨ AI Write Story'}
            </button>
          </div>

          {/* Recent published */}
          {published.length > 0 && (
            <div className="mt-4">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-2">Recently Published</h3>
              <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                {published.slice(0, 8).map(p => (
                  <div key={p.id} className="flex items-center gap-2 rounded-lg bg-white/3 px-3 py-2">
                    <span className="text-emerald-400 text-[9px]">●</span>
                    <span className="text-xs text-ink truncate flex-1">{p.title}</span>
                    <span className="text-[9px] text-ink-dim">{p.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Editor */}
      {step === 2 && (
        <div className="space-y-4">
          {/* Series selector (for episodes) */}
          {type === 'episode' && (
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1">Series</label>
                <select value={form.seriesId} onChange={e => {
                    const sid = e.target.value;
                    set('seriesId', sid);
                    // Auto-calculate next episode number
                    const series = SERIES.find(s => s.id === sid);
                    if (series) {
                      const nextEp = (series.episodes?.length || 0) + 1;
                      set('episodeNumber', nextEp);
                      set('source', `${series.title} · Episode ${nextEp}`);
                    }
                  }}
                  className="w-full rounded-xl bg-bg-base px-3 py-2.5 text-xs text-ink ring-1 ring-white/10 focus:ring-gold/50 outline-none">
                  <option value="">— Select series —</option>
                  {SERIES_LIST.map(s => {
                    const seriesData = SERIES.find(sd => sd.id === s.id);
                    const epCount = seriesData?.episodes?.length || 0;
                    return <option key={s.id} value={s.id}>{s.name} ({epCount} eps)</option>;
                  })}
                </select>
              </div>
              <div className="w-20">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1">Ep #</label>
                <input type="number" value={form.episodeNumber} onChange={e => set('episodeNumber', parseInt(e.target.value) || 1)}
                  className="w-full rounded-xl bg-bg-base px-3 py-2.5 text-xs text-ink ring-1 ring-white/10 focus:ring-gold/50 outline-none" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1">Title</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Episode title"
              className="w-full rounded-xl bg-bg-base px-3 py-2.5 text-sm text-ink ring-1 ring-white/10 focus:ring-gold/50 outline-none font-bold" />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1">Subtitle</label>
            <input value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="One-line description"
              className="w-full rounded-xl bg-bg-base px-3 py-2.5 text-xs text-ink ring-1 ring-white/10 focus:ring-gold/50 outline-none" />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1">Tradition</label>
              <select value={form.tradition} onChange={e => set('tradition', e.target.value)}
                className="w-full rounded-xl bg-bg-base px-3 py-2.5 text-xs text-ink ring-1 ring-white/10 outline-none">
                {TRADITIONS.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1">Theme</label>
              <select value={form.theme} onChange={e => set('theme', e.target.value)}
                className="w-full rounded-xl bg-bg-base px-3 py-2.5 text-xs text-ink ring-1 ring-white/10 outline-none capitalize">
                {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="w-20">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1">Min</label>
              <input type="number" value={form.durationMinutes} onChange={e => set('durationMinutes', parseInt(e.target.value) || 2)}
                className="w-full rounded-xl bg-bg-base px-3 py-2.5 text-xs text-ink ring-1 ring-white/10 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1">Source / Attribution</label>
            <input value={form.source} onChange={e => set('source', e.target.value)} placeholder="Rainbow Kindergarten · Episode 7"
              className="w-full rounded-xl bg-bg-base px-3 py-2.5 text-xs text-ink ring-1 ring-white/10 focus:ring-gold/50 outline-none" />
          </div>

          {/* Story body */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Story Text</label>
              <span className="text-[10px] text-ink-dim">{wordCount} words · ~{estMinutes} min</span>
            </div>
            <textarea value={form.body} onChange={e => set('body', e.target.value)}
              placeholder="Once upon a time... (use {childName} for personalization)"
              className="w-full rounded-xl bg-bg-base px-4 py-3 text-xs text-ink ring-1 ring-white/10 focus:ring-gold/50 outline-none resize-y min-h-[200px] max-h-[500px] font-mono leading-relaxed whitespace-pre-wrap" />
          </div>

          {/* AI Write inline */}
          <div className="flex gap-2">
            <input value={form.aiTopic} onChange={e => set('aiTopic', e.target.value)} placeholder="Describe topic for AI to write..."
              className="flex-1 rounded-xl bg-bg-base px-3 py-2 text-xs text-ink ring-1 ring-white/10 outline-none" />
            <button onClick={handleAiWrite} disabled={!form.aiTopic.trim() || aiWriting}
              className="shrink-0 rounded-full bg-gold/10 px-4 py-2 text-[10px] font-bold text-gold disabled:opacity-40">
              {aiWriting ? '⏳' : '✨ AI Write'}
            </button>
          </div>

          {/* Images (multi-upload, first = cover) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Images (first = cover)</label>
              <span className="text-[9px] text-ink-dim">{form.images.length} uploaded</span>
            </div>
            {form.images.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
                {form.images.map((img, i) => (
                  <div key={i} className="relative shrink-0">
                    <img src={img} alt={`Image ${i + 1}`} className={`w-24 h-20 rounded-lg object-cover ring-2 ${i === 0 ? 'ring-gold' : 'ring-white/10'}`} />
                    {i === 0 && <span className="absolute -top-1 -left-1 text-[8px] bg-gold text-bg-base px-1.5 py-0.5 rounded-full font-bold">Cover</span>}
                    <button onClick={() => removeImage(i)}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center">✕</button>
                  </div>
                ))}
              </div>
            )}
            <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()}
              className="rounded-xl bg-white/5 px-4 py-2.5 text-xs text-ink-muted ring-1 ring-white/10 hover:ring-gold/20 transition w-full text-left">
              📷 Upload images (select multiple)
            </button>
            <input value={''} onChange={e => {
              if (e.target.value) setForm(f => ({ ...f, images: [...f.images, e.target.value], coverImage: f.images[0] || e.target.value }));
              e.target.value = '';
            }} placeholder="Or paste image URL and press Enter"
              onKeyDown={e => {
                if (e.key === 'Enter' && e.target.value) {
                  setForm(f => {
                    const newImages = [...f.images, e.target.value];
                    return { ...f, images: newImages, coverImage: newImages[0] };
                  });
                  e.target.value = '';
                }
              }}
              className="w-full mt-1.5 rounded-xl bg-bg-base px-3 py-2 text-[10px] text-ink-muted ring-1 ring-white/10 outline-none" />
          </div>

          {/* Blog toggle */}
          <div className="rounded-xl bg-white/3 ring-1 ring-white/5 p-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.blog.enabled} onChange={e => setBlog('enabled', e.target.checked)}
                className="rounded" />
              <span className="text-xs font-bold text-ink">📝 Also create a blog post</span>
            </label>
            {form.blog.enabled && (
              <div className="mt-3 space-y-2">
                <div className="flex gap-2">
                  <input value={form.blog.slug} onChange={e => setBlog('slug', e.target.value)}
                    placeholder="blog-slug (auto from title)"
                    className="flex-1 rounded-lg bg-bg-base px-3 py-1.5 text-[10px] text-ink ring-1 ring-white/10 outline-none" />
                  <select value={form.blog.category} onChange={e => setBlog('category', e.target.value)}
                    className="rounded-lg bg-bg-base px-2 py-1.5 text-[10px] text-ink ring-1 ring-white/10 outline-none">
                    {BLOG_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <input value={form.blog.tag} onChange={e => setBlog('tag', e.target.value)} placeholder="Display tag"
                  className="w-full rounded-lg bg-bg-base px-3 py-1.5 text-[10px] text-ink ring-1 ring-white/10 outline-none" />
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1">Blog Context & References</label>
                  <textarea value={form.blog.context || ''} onChange={e => setBlog('context', e.target.value)}
                    placeholder={"Write additional blog context here. Add reference links, backlinks, notes for the blog generator.\n\nExamples:\n• This story is inspired by a real birthday party at Jump for Joy on Danforth\n• Backlink: https://mysleepytale.com/blog/why-bedtime-stories-matter\n• Reference: https://thestar.com/article-link\n• Mention the Rainbow Kindergarten series"}
                    className="w-full rounded-lg bg-bg-base px-3 py-2.5 text-[10px] text-ink ring-1 ring-white/10 focus:ring-gold/50 outline-none resize-y min-h-[100px] max-h-[250px] whitespace-pre-wrap leading-relaxed font-mono" />
                  <p className="text-[9px] text-ink-dim mt-1">Links pasted here will be included as backlinks in the generated blog. Add any context the blog should cover beyond the story itself.</p>
                </div>
              </div>
            )}
          </div>

          {/* Meta description */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1">Meta Description (SEO)</label>
            <input value={form.metaDescription} onChange={e => set('metaDescription', e.target.value)} placeholder="155 chars for search engines"
              maxLength={155}
              className="w-full rounded-xl bg-bg-base px-3 py-2.5 text-xs text-ink ring-1 ring-white/10 focus:ring-gold/50 outline-none" />
          </div>

          {/* Validation hints */}
          {(!form.title || !form.body) && (
            <div className="rounded-xl bg-gold/5 ring-1 ring-gold/20 px-4 py-2.5 text-[11px] text-gold">
              {!form.title && <p>⚠ Title is required</p>}
              {!form.body && <p>⚠ Story text is required — write it or use ✨ AI Write</p>}
            </div>
          )}

          <div className="sticky bottom-0 bg-bg-base/95 backdrop-blur-sm pt-3 pb-1 -mx-1 px-1">
            <button onClick={() => setStep(3)} disabled={!form.title || !form.body}
              className="w-full rounded-full bg-gold px-6 py-3 text-sm font-bold text-bg-base shadow-glow disabled:opacity-40">
              {form.title && form.body ? '👀 Preview →' : 'Fill title + story text to preview'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 3 && (
        <div className="space-y-4">
          {/* Story card preview */}
          <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 overflow-hidden">
            <div className="p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gold mb-2">Story Card Preview</p>
              <div className="flex gap-3">
                {form.images[0] && <img src={form.images[0]} alt="" className="w-20 h-20 rounded-xl object-cover ring-2 ring-gold" />}
                <div>
                  <h3 className="text-sm font-bold text-ink">{form.title}</h3>
                  <p className="text-[11px] text-ink-muted mt-0.5">{form.subtitle}</p>
                  <div className="flex gap-2 mt-1.5">
                    <span className="text-[9px] bg-gold/10 text-gold px-1.5 py-0.5 rounded-full">{form.tradition}</span>
                    <span className="text-[9px] bg-white/5 text-ink-dim px-1.5 py-0.5 rounded-full">{estMinutes} min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* OG card preview */}
          <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gold mb-2">Share Card Preview (WhatsApp/Twitter)</p>
            <div className="rounded-xl bg-[#1a1a25] ring-1 ring-white/10 overflow-hidden max-w-sm">
              {form.images[0] && <img src={form.images[0]} alt="" className="w-full aspect-[16/9] object-cover" />}
              <div className="p-3">
                <p className="text-[10px] text-ink-dim">mysleepytale.com</p>
                <p className="text-sm font-bold text-ink mt-0.5">{form.title} — My Sleepy Tale</p>
                <p className="text-[11px] text-ink-muted mt-0.5 line-clamp-2">{form.metaDescription || form.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Story text preview */}
          <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gold mb-2">Story Text ({wordCount} words)</p>
            <div className="text-xs text-ink-muted leading-relaxed whitespace-pre-line max-h-[200px] overflow-y-auto">
              {form.body}
            </div>
          </div>

          {/* Link preview */}
          <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gold mb-2">Story Link (live after publish)</p>
            <div className="space-y-1 text-[11px] text-ink-dim">
              <p>🔗 <span className="text-ink-muted">mysleepytale.com/api/share?id=...</span></p>
              {form.blog.enabled && <p>📝 <span className="text-ink-muted">mysleepytale.com/blog/{form.blog.slug || '...'}</span></p>}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 rounded-full bg-white/5 px-4 py-3 text-sm font-bold text-ink-muted ring-1 ring-white/10">
              ← Edit
            </button>
            <button onClick={handlePublish} disabled={publishing}
              className="flex-1 rounded-full bg-gold px-6 py-3 text-sm font-bold text-bg-base shadow-glow disabled:opacity-40">
              {publishing ? '⏳ Publishing...' : '🚀 Publish Now'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Published */}
      {step === 4 && result && (
        <div className="space-y-4">
          <div className="text-center py-6">
            <p className="text-4xl mb-3">🎉</p>
            <h2 className="text-lg font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>Published!</h2>
            <p className="text-sm text-ink-muted mt-1">{result.content?.title} is now live.</p>
          </div>

          <div className="rounded-2xl bg-bg-surface ring-1 ring-emerald-500/20 p-4 space-y-3">
            {Object.entries(result.links || {}).map(([key, url]) => (
              <div key={key} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-ink-dim uppercase w-14">{key}</span>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-gold truncate flex-1 hover:underline">{url}</a>
                <button onClick={() => navigator.clipboard.writeText(url)}
                  className="text-[10px] font-bold bg-gold/10 text-gold px-2 py-1 rounded-full">Copy</button>
              </div>
            ))}
          </div>

          <button onClick={() => { setStep(1); setResult(null); setForm(f => ({ ...f, title: '', subtitle: '', body: '', coverImage: '', coverImageBase64: '', images: [], aiTopic: '' })); }}
            className="w-full rounded-full bg-white/5 px-4 py-3 text-sm font-bold text-ink-muted ring-1 ring-white/10">
            ← Publish Another
          </button>
        </div>
      )}
    </div>
  );
}
