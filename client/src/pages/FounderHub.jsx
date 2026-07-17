// Founder Hub — Prateek-only automation command center.
// Route: /founder-hub (gated to founder email only)

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { db } from '../lib/firebase.js';
import { collection, query, where, orderBy, limit, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import ContentPublisher from '../components/publisher/ContentPublisher.jsx';

const FOUNDER_EMAILS = ['prateekyadav2010@gmail.com', 'rakshajoshi476@gmail.com']; // NOTE: canonical list in api/_firebase.js
const API = import.meta.env.VITE_API_URL || '';

const PIPELINES = [
  {
    id: 'dev-pipeline',
    title: 'Dev Pipeline',
    icon: '🛠️',
    description: 'Convert feedback into development tasks and push to production.',
    status: 'coming-soon',
    accent: '#9f7aea',
  },
  {
    id: 'marketing-agents',
    title: 'Marketing Agents',
    icon: '🤖',
    description: 'Multi-channel outreach — Reddit, X, Instagram, Medium, TikTok, and more.',
    status: 'active',
    accent: '#f0a500',
    link: null,
  },
  {
    id: 'content-publisher',
    title: 'Content Publisher',
    icon: '📖',
    description: 'Create and publish episodes, series, stories, and blog posts — instantly live.',
    status: 'active',
    accent: '#7ad9a1',
    link: null,
  },
  {
    id: 'content-pipeline',
    title: 'Content Pipeline',
    icon: '✨',
    description: 'Story → Images → Blog → Social — full agentic content generation.',
    status: 'active',
    accent: '#c084fc',
    link: '/content-pipeline',
  },
  {
    id: 'task-ai',
    title: 'AI Task Allocation',
    icon: '📋',
    description: 'AI-assisted team task creation, assignment, and tracking.',
    status: 'coming-soon',
    accent: '#60a5fa',
  },
];

const MARKETING_CHANNELS = [
  { id: 'email-newsletter', label: 'Email Newsletter', icon: '📨', status: 'active', description: 'AI-generate branded newsletters and send to all users.', automation: '85% automated', features: ['AI content from prompt', 'Branded dark theme', 'Preview & test send', 'Bulk send to all users', 'Send tracking & history'] },
  { id: 'reddit', label: 'Reddit', icon: '🟠', status: 'active', description: 'Monitor subreddits, AI-draft comments, approve & post. 10 subreddits × 10 keywords.', automation: '80% automated', features: ['Keyword monitoring', 'AI comment drafting (3 styles)', 'Slack approval flow', 'Auto-post after approval', 'Karma tracking'] },
  { id: 'x-twitter', label: 'X / Twitter', icon: '🐦', status: 'coming-soon', description: 'Schedule tweets, reply to relevant threads, track engagement. Thread writer agent.', automation: '70% automated', features: ['Trending topic scanner', 'AI tweet/thread writer', 'Scheduled posting', 'Engagement tracker', 'Hashtag optimizer'] },
  { id: 'creative-studio', label: 'Creative Studio', icon: '🎨', status: 'active', description: 'Generate multi-format social media creatives from a single prompt. Instagram, Story, LinkedIn, Email, Pinterest, YouTube.', automation: '95% automated', features: ['Multi-format generation', 'AI prompt enhancement', 'Brand-consistent design', 'Auto-upload to S3', 'Campaign history'] },
  { id: 'instagram', label: 'Instagram', icon: '📸', status: 'active', description: 'Generate post images + captions + hashtags from any topic or link.', automation: '90% automated', features: ['AI image generator', 'Caption writer', 'Hashtag optimizer', 'Multi-format (square, portrait, story)', 'Brand-consistent Soul ID'] },
  { id: 'medium', label: 'Medium', icon: '📝', status: 'coming-soon', description: 'Auto-repurpose blog posts into Medium articles with backlinks.', automation: '90% automated', features: ['Blog-to-Medium converter', 'Backlink injector', 'Tag optimizer', 'Publication submitter', 'Clap tracker'] },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', status: 'coming-soon', description: 'Video script generator, trending sound matcher, caption optimizer.', automation: '50% automated', features: ['Script generator from stories', 'Trending sound matcher', 'Caption optimizer', 'Posting scheduler', 'View tracker'] },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', status: 'coming-soon', description: 'Founder thought leadership posts, company updates, network engagement.', automation: '70% automated', features: ['AI post writer', 'Carousel generator', 'Comment engagement', 'Connection outreach', 'Analytics'] },
  { id: 'product-hunt', label: 'Product Hunt', icon: '🚀', status: 'coming-soon', description: 'Launch day automation, comment monitoring, maker responses.', automation: '40% automated', features: ['Launch day dashboard', 'Comment responder', 'Upvote tracker', 'Maker comment drafter', 'Post-launch follow-up'] },
  { id: 'quora', label: 'Quora', icon: '❓', status: 'coming-soon', description: 'Find relevant questions, draft expert answers with backlinks.', automation: '80% automated', features: ['Question finder', 'AI answer drafter', 'Backlink placer', 'Upvote tracker', 'Topic follower'] },
  { id: 'email-outreach', label: 'Email Outreach', icon: '📧', status: 'coming-soon', description: 'Blogger outreach, partnership emails, press pitches.', automation: '70% automated', features: ['Contact finder', 'AI pitch writer', 'Follow-up scheduler', 'Open/reply tracker', 'Template library'] },
  { id: 'directories', label: 'Directories', icon: '📋', status: 'coming-soon', description: 'Auto-submit to startup directories, track listings.', automation: '90% automated', features: ['30+ directory list', 'Auto-fill submitter', 'Status tracker', 'Backlink verifier', 'Renewal reminders'] },
];

function ChannelPlaceholder({ channel }) {
  if (!channel) return null;
  return (
    <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 p-6">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{channel.icon}</span>
        <div>
          <h3 className="text-sm font-bold text-ink">{channel.label} Agent</h3>
          <p className="text-[10px] text-ink-dim">{channel.automation}</p>
        </div>
      </div>
      <p className="text-xs text-ink-muted mb-4">{channel.description}</p>
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-2">Planned Features</p>
        <div className="space-y-1.5">
          {channel.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold/30" />
              <span className="text-[11px] text-ink-muted">{f}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl bg-gold/5 ring-1 ring-gold/20 p-3 text-center">
        <p className="text-[11px] text-gold font-bold">🔜 Coming Soon</p>
        <p className="text-[10px] text-ink-dim mt-0.5">This channel agent is in the roadmap. Reddit is live now.</p>
      </div>
    </div>
  );
}

// ─── Creative Generator (Instagram / all platforms) ───────────────
function CreativeGenerator({ user }) {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [generating, setGenerating] = useState(false);
  const [creatives, setCreatives] = useState([]);
  const [error, setError] = useState(null);
  const API = import.meta.env.VITE_API_URL || '';

  // Load past creatives
  useEffect(() => {
    if (!db || !user) return;
    const unsub = onSnapshot(
      query(collection(db, 'creatives'), orderBy('createdAt', 'desc'), limit(20)),
      (snap) => setCreatives(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      () => {}
    );
    return unsub;
  }, [user]);

  const handleGenerate = async () => {
    if (!topic.trim() || !user) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/generate-creative`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, topic: topic.trim(), platform }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTopic('');
    } catch (e) {
      setError(e.message);
    }
    setGenerating(false);
  };

  const FORMATS = [
    { id: 'instagram', label: '1:1 Square', icon: '⬜' },
    { id: 'instagram-portrait', label: '4:5 Portrait', icon: '📱' },
    { id: 'instagram-story', label: '9:16 Story', icon: '📲' },
    { id: 'twitter', label: '16:9 Twitter', icon: '🐦' },
    { id: 'linkedin', label: '1:1 LinkedIn', icon: '💼' },
  ];

  return (
    <div>
      {/* Generator form */}
      <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 p-5 mb-4">
        <h3 className="text-sm font-bold text-ink mb-3" style={{ fontFamily: 'Lora, serif' }}>
          ✨ Generate Creative
        </h3>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Paste a link, describe a topic, or share a thought...&#10;&#10;Examples:&#10;• Canada just won 6-0 against Qatar in the World Cup&#10;• Write about screen-free bedtime routines&#10;• https://thestar.com/article-link"
          className="w-full rounded-xl bg-bg-base px-4 py-3 text-sm text-ink placeholder:text-ink-dim ring-1 ring-white/10 focus:ring-gold/50 outline-none resize-y min-h-[100px] max-h-[300px]"
          rows={3}
        />

        {/* Format selector */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {FORMATS.map(f => (
            <button
              key={f.id}
              onClick={() => setPlatform(f.id)}
              className={`shrink-0 flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-bold transition ${
                platform === f.id ? 'bg-gold text-bg-base' : 'bg-white/5 text-ink-muted ring-1 ring-white/10'
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {error && <p className="text-[11px] text-red-400 mt-2">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={!topic.trim() || generating}
          className="w-full mt-3 rounded-full bg-gold px-6 py-3 text-sm font-bold text-bg-base shadow-glow transition hover:brightness-110 active:scale-95 disabled:opacity-40"
        >
          {generating ? '⏳ Generating image + caption...' : '🎨 Generate Creative'}
        </button>
      </div>

      {/* Generated creatives */}
      {creatives.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-dim">Generated Creatives</h3>
          {creatives.map(c => (
            <div key={c.id} className="rounded-2xl bg-bg-surface ring-1 ring-white/5 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-[300px] shrink-0">
                  {c.imageUrl ? (
                    <a href={c.imageUrl} target="_blank" rel="noopener noreferrer">
                      <img src={c.imageUrl} alt={c.topic} className="w-full h-auto object-cover" loading="lazy" />
                    </a>
                  ) : (
                    <div className="w-full aspect-square bg-bg-base flex items-center justify-center">
                      <span className="text-3xl">🎨</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      c.status === 'ready' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gold/10 text-gold'
                    }`}>
                      {c.status === 'ready' ? '✓ Ready to post' : '📝 Caption only'}
                    </span>
                    <span className="text-[9px] text-ink-dim">{c.platform}</span>
                    <span className="text-[9px] text-ink-dim">{new Date(c.createdAt).toLocaleTimeString()}</span>
                  </div>

                  <p className="text-[10px] font-bold text-ink-dim mb-1 uppercase tracking-wider">Topic</p>
                  <p className="text-xs text-ink mb-3 line-clamp-1">{c.topic}</p>

                  <p className="text-[10px] font-bold text-ink-dim mb-1 uppercase tracking-wider">Caption</p>
                  <p className="text-xs text-ink-muted whitespace-pre-line leading-relaxed mb-3 max-h-[150px] overflow-y-auto">
                    {c.caption}
                  </p>

                  {c.hashtags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {c.hashtags.map((h, i) => (
                        <span key={i} className="text-[9px] bg-gold/10 text-gold px-1.5 py-0.5 rounded-full">#{h.replace('#', '')}</span>
                      ))}
                    </div>
                  )}

                  {/* Copy buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => { navigator.clipboard.writeText(c.caption + '\n\n' + (c.hashtags || []).map(h => '#' + h.replace('#', '')).join(' ')); }}
                      className="text-[10px] font-bold bg-gold/10 text-gold px-3 py-1.5 rounded-full hover:bg-gold/20 transition"
                    >
                      📋 Copy Caption
                    </button>
                    {c.imageUrl && (
                      <a href={c.imageUrl} target="_blank" rel="noopener noreferrer"
                        className="text-[10px] font-bold bg-white/5 text-ink-muted px-3 py-1.5 rounded-full hover:bg-white/10 transition">
                        ⬇️ Download Image
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const STATUS_BADGE = {
  'active': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: '● Active' },
  'coming-soon': { bg: 'bg-white/5', text: 'text-ink-dim', label: '○ Coming Soon' },
};

// ─── Reddit Lead Card ─────────────────────────────────────────────
function RedditLeadCard({ lead, onApprove, onReject, onDraft }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState(0);

  const statusColors = {
    new: 'bg-gold/10 text-gold',
    drafting: 'bg-blue-500/10 text-blue-400',
    drafted: 'bg-purple-500/10 text-purple-400',
    approved: 'bg-emerald-500/10 text-emerald-400',
    posted: 'bg-emerald-500/20 text-emerald-400',
    rejected: 'bg-red-500/10 text-red-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-bg-surface ring-1 ring-white/5 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-lg mt-0.5">📡</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusColors[lead.status] || statusColors.new}`}>
                {lead.status?.toUpperCase() || 'NEW'}
              </span>
              <span className="text-[10px] text-ink-dim">r/{lead.subreddit}</span>
              <span className="text-[10px] text-ink-dim">· {lead.score} pts</span>
              <span className="text-[10px] text-ink-dim">· {lead.numComments} comments</span>
            </div>
            <h4 className="text-sm font-bold text-ink mt-1 line-clamp-2">{lead.title}</h4>
            <p className="text-[11px] text-ink-muted mt-0.5 line-clamp-2">{lead.selfText?.slice(0, 200)}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[9px] text-ink-dim">Matched: {lead.matchedKeyword}</span>
              {lead.url && (
                <a href={lead.url} target="_blank" rel="noopener noreferrer" className="text-[9px] text-gold hover:underline">
                  Open on Reddit ↗
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          {lead.status === 'new' && (
            <button onClick={() => onDraft(lead.id)} className="text-[10px] font-bold bg-gold/10 text-gold px-3 py-1.5 rounded-full hover:bg-gold/20 transition">
              🤖 Draft Comments
            </button>
          )}
          {lead.status === 'drafted' && (
            <>
              <button onClick={() => setExpanded(!expanded)} className="text-[10px] font-bold bg-purple-500/10 text-purple-400 px-3 py-1.5 rounded-full">
                {expanded ? '▲ Hide Drafts' : '▼ Review 3 Drafts'}
              </button>
            </>
          )}
          {(lead.status === 'new' || lead.status === 'drafted') && (
            <button onClick={() => onReject(lead.id)} className="text-[10px] font-bold bg-white/5 text-ink-dim px-3 py-1.5 rounded-full">
              Skip
            </button>
          )}
        </div>
      </div>

      {/* Draft comments expansion */}
      <AnimatePresence>
        {expanded && lead.drafts && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                {['Educational', 'Personal Story', 'Expert Answer'].map((style, i) => (
                  <button
                    key={style}
                    onClick={() => setSelectedDraft(i)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition ${
                      selectedDraft === i ? 'bg-gold text-bg-base' : 'bg-white/5 text-ink-muted'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
              <div className="rounded-xl bg-bg-base p-3 ring-1 ring-white/5">
                <p className="text-xs text-ink whitespace-pre-line leading-relaxed">
                  {lead.drafts[selectedDraft] || 'Draft not available'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onApprove(lead.id, selectedDraft)}
                  className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full hover:bg-emerald-500/30 transition"
                >
                  ✓ Approve & Post
                </button>
                <button
                  onClick={() => onReject(lead.id)}
                  className="text-[10px] font-bold bg-white/5 text-ink-dim px-3 py-1.5 rounded-full"
                >
                  Skip
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Reddit Stats ─────────────────────────────────────────────────
function RedditStats({ leads }) {
  const newCount = leads.filter(l => l.status === 'new').length;
  const draftedCount = leads.filter(l => l.status === 'drafted').length;
  const postedCount = leads.filter(l => l.status === 'posted').length;
  const totalKarma = leads.reduce((sum, l) => sum + (l.karmaGained || 0), 0);

  return (
    <div className="grid grid-cols-4 gap-3 mb-4">
      {[
        { label: 'New Leads', value: newCount, color: '#f0a500' },
        { label: 'Drafted', value: draftedCount, color: '#c084fc' },
        { label: 'Posted', value: postedCount, color: '#7ad9a1' },
        { label: 'Karma', value: totalKarma, color: '#60a5fa' },
      ].map(s => (
        <div key={s.label} className="rounded-xl bg-bg-surface ring-1 ring-white/5 p-3 text-center">
          <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
          <p className="text-[9px] text-ink-dim uppercase tracking-wider">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Email Newsletter Agent ──────────────────────────────────────
function EmailNewsletter({ user }) {
  const [prompt, setPrompt] = useState('');
  const [newsletterName, setNewsletterName] = useState('');
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [textContent, setTextContent] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [newsletterId, setNewsletterId] = useState(null);
  const [sendResult, setSendResult] = useState(null);
  const [newsletters, setNewsletters] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [sendOneEmail, setSendOneEmail] = useState('');
  const [sendOneStatus, setSendOneStatus] = useState(null);
  const [error, setError] = useState(null);
  const API = import.meta.env.VITE_API_URL || '';

  // Load newsletter history
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/newsletter-send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'history' }),
        });
        const data = await res.json();
        if (data.newsletters) setNewsletters(data.newsletters);
      } catch {}
    })();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError(null);
    setHtmlContent('');
    setSendResult(null);
    setNewsletterId(null);
    try {
      const res = await fetch(`${API}/api/newsletter-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'generate', prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSubject(data.subject || '');
      setHtmlContent(data.htmlContent || '');
      setTextContent(data.textContent || '');
      // Auto-generate name from prompt
      if (!newsletterName) {
        setNewsletterName(prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40).replace(/-$/, ''));
      }
    } catch (e) {
      setError(e.message);
    }
    setGenerating(false);
  };

  const handleSaveAndTest = async () => {
    if (!htmlContent || !newsletterName || !subject) return;
    setSaving(true);
    setError(null);
    try {
      // Save first
      const saveRes = await fetch(`${API}/api/newsletter-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'save', prompt, newsletterName, subject, htmlContent, textContent }),
      });
      const saveData = await saveRes.json();
      if (saveData.error) throw new Error(saveData.error);
      setNewsletterId(saveData.newsletterId);

      // Then test send
      const testRes = await fetch(`${API}/api/newsletter-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'test', newsletterId: saveData.newsletterId }),
      });
      const testData = await testRes.json();
      setSendResult({ type: 'test', ...testData });
    } catch (e) {
      setError(e.message);
    }
    setSaving(false);
  };

  const handleSendAll = async (nlId) => {
    const targetId = nlId || newsletterId;
    if (!targetId) return;
    if (!confirm('Send this newsletter to ALL users? This cannot be undone.')) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/newsletter-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'sendAll', newsletterId: targetId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSendResult({ type: 'sendAll', ...data });
      // Refresh history
      const histRes = await fetch(`${API}/api/newsletter-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'history' }),
      });
      const histData = await histRes.json();
      if (histData.newsletters) setNewsletters(histData.newsletters);
    } catch (e) {
      setError(e.message);
    }
    setSending(false);
  };

  const loadRecipients = async (nlId) => {
    if (expandedId === nlId) { setExpandedId(null); return; }
    setExpandedId(nlId);
    setLoadingRecipients(true);
    try {
      const res = await fetch(`${API}/api/newsletter-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'recipients', newsletterId: nlId }),
      });
      const data = await res.json();
      setRecipients(data.recipients || []);
    } catch {}
    setLoadingRecipients(false);
  };

  const STATUS_COLORS = { draft: '#5a5550', 'test-sent': '#2b6cb0', sending: '#f0a500', sent: '#48bb78' };

  return (
    <div className="space-y-6">
      {/* Composer */}
      <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 p-5 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">📨</span>
          <div>
            <h3 className="text-sm font-bold text-ink">Newsletter Composer</h3>
            <p className="text-[10px] text-ink-dim">Write a prompt, AI generates a branded newsletter</p>
          </div>
        </div>

        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe what this newsletter is about... e.g. 'New Sikh stories series with 5 episodes about courage and kindness' or 'FIFA World Cup bedtime adventure series launching this week'"
          rows={3}
          className="w-full rounded-xl bg-bg-base px-4 py-3 text-sm text-ink placeholder-ink-dim ring-1 ring-white/10 focus:ring-gold outline-none resize-none"
        />

        <button onClick={handleGenerate} disabled={generating || !prompt.trim()}
          className="rounded-xl bg-gold/20 px-5 py-2.5 text-sm font-bold text-gold hover:bg-gold/30 transition disabled:opacity-50">
          {generating ? '✨ Generating...' : '✨ Generate Newsletter'}
        </button>

        {error && (
          <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/30 px-4 py-3 text-xs text-red-400">{error}</div>
        )}
      </div>

      {/* Preview */}
      {htmlContent && (
        <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 p-5 space-y-4">
          <h3 className="text-sm font-bold text-ink">Preview & Send</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-ink-dim uppercase tracking-wider mb-1 block">Subject Line</label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                className="w-full rounded-xl bg-bg-base px-4 py-2.5 text-sm text-ink ring-1 ring-white/10 focus:ring-gold outline-none" />
            </div>
            <div>
              <label className="text-[10px] text-ink-dim uppercase tracking-wider mb-1 block">Newsletter Name (unique ID)</label>
              <input type="text" value={newsletterName} onChange={e => setNewsletterName(e.target.value)}
                placeholder="e.g. sikh-series-july-2026"
                className="w-full rounded-xl bg-bg-base px-4 py-2.5 text-sm text-ink ring-1 ring-white/10 focus:ring-gold outline-none" />
            </div>
          </div>

          {/* Email preview iframe */}
          <div className="rounded-xl overflow-hidden ring-1 ring-white/10">
            <iframe
              srcDoc={htmlContent}
              title="Newsletter Preview"
              className="w-full border-0"
              style={{ height: '500px', background: '#0a0a0f' }}
              sandbox="allow-same-origin"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={handleSaveAndTest} disabled={saving || !subject || !newsletterName}
              className="rounded-xl bg-blue-500/20 px-5 py-2.5 text-sm font-bold text-blue-400 hover:bg-blue-500/30 transition disabled:opacity-50">
              {saving ? 'Sending test...' : '🧪 Save & Send Test'}
            </button>

            {newsletterId && (
              <button onClick={handleSendAll} disabled={sending}
                className="rounded-xl bg-gold/20 px-5 py-2.5 text-sm font-bold text-gold hover:bg-gold/30 transition disabled:opacity-50">
                {sending ? '📤 Sending to all users...' : '📤 Send to All Users'}
              </button>
            )}
          </div>

          {/* Send result */}
          {sendResult && (
            <div className={`rounded-xl px-4 py-3 text-xs ${sendResult.type === 'test' ? 'bg-blue-500/10 ring-1 ring-blue-500/30 text-blue-300' : 'bg-green-500/10 ring-1 ring-green-500/30 text-green-300'}`}>
              {sendResult.type === 'test' ? (
                <span>Test email sent to founder emails. Check your inbox.</span>
              ) : (
                <span>Newsletter sent! {sendResult.sentCount} sent, {sendResult.throttledCount || 0} throttled, {sendResult.failedCount || 0} failed out of {sendResult.total} users.</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* History Table */}
      <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 p-5">
        <h3 className="text-sm font-bold text-ink mb-4">Newsletter History</h3>

        {newsletters.length === 0 ? (
          <p className="text-xs text-ink-dim text-center py-8">No newsletters sent yet.</p>
        ) : (
          <div className="space-y-2">
            {newsletters.map(nl => (
              <div key={nl.id}>
                <button onClick={() => loadRecipients(nl.id)}
                  className="w-full text-left rounded-xl bg-bg-base ring-1 ring-white/5 px-4 py-3 hover:ring-gold/30 transition">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-ink truncate">{nl.name}</span>
                        <span className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase"
                          style={{ background: (STATUS_COLORS[nl.status] || '#666') + '22', color: STATUS_COLORS[nl.status] || '#666' }}>
                          {nl.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-dim mt-1 truncate">{nl.subject}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {nl.status !== 'sent' && nl.status !== 'sending' && (
                        <>
                          <button onClick={e => { e.stopPropagation(); setNewsletterId(nl.id); handleSendAll(nl.id); }}
                            disabled={sending}
                            className="rounded-lg bg-gold/20 px-3 py-1 text-[10px] font-bold text-gold hover:bg-gold/30 transition disabled:opacity-50">
                            {sending ? 'Sending...' : '📤 Send to All'}
                          </button>
                          <button onClick={async e => { e.stopPropagation(); setSending(true); try { await fetch(`${API}/api/newsletter-send`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode: 'test', newsletterId: nl.id }) }); setSendResult({ type: 'test' }); } catch {} setSending(false); }}
                            disabled={sending}
                            className="rounded-lg bg-blue-500/20 px-3 py-1 text-[10px] font-bold text-blue-400 hover:bg-blue-500/30 transition disabled:opacity-50">
                            🧪 Test
                          </button>
                        </>
                      )}
                      <div className="text-right">
                        <div className="text-xs text-ink-muted">{nl.sentCount || 0} sent</div>
                        <div className="text-[10px] text-ink-dim">{nl.sentAt ? new Date(nl.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not sent'}</div>
                      </div>
                    </div>
                    <span className="text-ink-dim text-xs">{expandedId === nl.id ? '▲' : '▼'}</span>
                  </div>
                </button>

                {/* Expanded: send to specific email + recipients */}
                {expandedId === nl.id && (
                  <div className="ml-4 mt-1 space-y-2">
                    {/* Send to specific email */}
                    <div className="rounded-xl bg-bg-base ring-1 ring-white/5 p-3">
                      <div className="flex items-center gap-2">
                        <input type="email" placeholder="Send to specific email..."
                          value={sendOneEmail} onChange={e => { setSendOneEmail(e.target.value); setSendOneStatus(null); }}
                          className="flex-1 rounded-lg bg-bg-surface px-3 py-1.5 text-xs text-ink placeholder-ink-dim ring-1 ring-white/10 focus:ring-gold outline-none" />
                        <button disabled={sending || !sendOneEmail.includes('@')}
                          onClick={async e => {
                            e.stopPropagation();
                            setSending(true); setSendOneStatus(null);
                            try {
                              const r = await fetch(`${API}/api/newsletter-send`, {
                                method: 'POST', headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ mode: 'sendOne', newsletterId: nl.id, to: sendOneEmail.trim() }),
                              });
                              const d = await r.json();
                              if (d.sent) { setSendOneStatus('sent'); setSendOneEmail(''); }
                              else setSendOneStatus(d.error || 'failed');
                            } catch (err) { setSendOneStatus(err.message); }
                            setSending(false);
                          }}
                          className="rounded-lg bg-gold/20 px-3 py-1.5 text-[10px] font-bold text-gold hover:bg-gold/30 transition disabled:opacity-50 whitespace-nowrap">
                          {sending ? 'Sending...' : '📤 Send'}
                        </button>
                      </div>
                      {sendOneStatus === 'sent' && <p className="text-[10px] text-green-400 mt-1">Sent successfully!</p>}
                      {sendOneStatus && sendOneStatus !== 'sent' && <p className="text-[10px] text-red-400 mt-1">{sendOneStatus}</p>}
                    </div>

                    {/* Recipients list */}
                    <div className="rounded-xl bg-bg-base ring-1 ring-white/5 p-3 max-h-60 overflow-y-auto">
                    {loadingRecipients ? (
                      <p className="text-xs text-ink-dim text-center py-4">Loading recipients...</p>
                    ) : recipients.length === 0 ? (
                      <p className="text-xs text-ink-dim text-center py-4">No recipients yet.</p>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex gap-3 text-[9px] text-ink-dim uppercase tracking-wider font-bold pb-1 border-b border-white/5">
                          <span className="flex-1">Email</span>
                          <span className="w-16 text-center">Status</span>
                          <span className="w-20 text-right">Date</span>
                        </div>
                        {recipients.map((r, i) => (
                          <div key={i} className="flex items-center gap-3 text-[11px]">
                            <span className="flex-1 text-ink-muted truncate">{r.email}</span>
                            <span className={`w-16 text-center font-bold ${r.status === 'sent' ? 'text-green-400' : r.status === 'throttled' ? 'text-yellow-400' : 'text-red-400'}`}>
                              {r.status}
                            </span>
                            <span className="w-20 text-right text-ink-dim">
                              {r.sentAt ? new Date(r.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Creative Studio (Multi-format Social Media) ─────────────────
const CREATIVE_FORMATS = [
  { id: 'instagram_post', label: 'Instagram Post', size: '1080×1080', icon: '📸' },
  { id: 'instagram_story', label: 'Story (IG/WhatsApp)', size: '1080×1920', icon: '📱' },
  { id: 'linkedin_banner', label: 'LinkedIn/X Banner', size: '1200×630', icon: '💼' },
  { id: 'email_header', label: 'Email Header', size: '1200×400', icon: '📧' },
  { id: 'facebook_post', label: 'Facebook Post', size: '1200×630', icon: '📘' },
  { id: 'x_post', label: 'X/Twitter Post', size: '1600×900', icon: '🐦' },
  { id: 'pinterest_pin', label: 'Pinterest Pin', size: '1000×1500', icon: '📌' },
  { id: 'youtube_thumb', label: 'YouTube Thumbnail', size: '1280×720', icon: '▶️' },
];

function CreativeStudio({ user }) {
  const [prompt, setPrompt] = useState('');
  const [selectedFormats, setSelectedFormats] = useState(['instagram_post', 'instagram_story', 'linkedin_banner', 'email_header']);
  const [variations, setVariations] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoResults, setVideoResults] = useState(null);
  const [results, setResults] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [error, setError] = useState(null);
  const API = import.meta.env.VITE_API_URL || '';

  // Load past campaigns
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/api/generate-social-creatives`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user.uid, mode: 'list' }),
        });
        const data = await res.json();
        if (data.campaigns) setCampaigns(data.campaigns);
      } catch {}
    })();
  }, []);

  const toggleFormat = (id) => {
    setSelectedFormats(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedFormats.length) return;
    setGenerating(true);
    setError(null);
    setResults(null);
    try {
      const res = await fetch(`${API}/api/generate-social-creatives`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, prompt, formats: selectedFormats, variations }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data);
      // Refresh campaigns
      setCampaigns(prev => [{ id: data.campaignId, prompt, formats: selectedFormats, creatives: data.creatives, status: 'done', createdAt: new Date().toISOString() }, ...prev]);
    } catch (e) {
      setError(e.message);
    }
    setGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Composer */}
      <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 p-5 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">🎨</span>
          <div>
            <h3 className="text-sm font-bold text-ink">Creative Studio</h3>
            <p className="text-[10px] text-ink-dim">Describe what you want, pick formats, AI generates all creatives</p>
          </div>
        </div>

        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe the creative... e.g. 'FIFA World Cup 2026 quarter-finals to finals — Argentina vs Spain final, 5 new bedtime story episodes, featuring flags and golden trophy'"
          rows={3}
          className="w-full rounded-xl bg-bg-base px-4 py-3 text-sm text-ink placeholder-ink-dim ring-1 ring-white/10 focus:ring-gold outline-none resize-none"
        />

        {/* Format checkboxes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Select Formats</label>
            <div className="flex gap-2">
              <button onClick={() => setSelectedFormats(CREATIVE_FORMATS.map(f => f.id))}
                className="text-[9px] text-gold hover:text-gold/80">Select All</button>
              <button onClick={() => setSelectedFormats([])}
                className="text-[9px] text-ink-dim hover:text-ink">Clear</button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CREATIVE_FORMATS.map(f => (
              <button key={f.id} onClick={() => toggleFormat(f.id)}
                className={`rounded-xl px-3 py-2.5 text-left ring-1 transition text-xs ${
                  selectedFormats.includes(f.id)
                    ? 'bg-gold/10 ring-gold/30 text-ink'
                    : 'bg-bg-base ring-white/5 text-ink-dim hover:ring-white/15'
                }`}>
                <div className="flex items-center gap-1.5">
                  <span>{f.icon}</span>
                  <span className="font-bold">{f.label}</span>
                </div>
                <div className="text-[9px] text-ink-dim mt-0.5">{f.size}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Variations selector */}
        <div className="flex items-center gap-4">
          <label className="text-[10px] font-bold uppercase tracking-wider text-ink-dim">Variations per format</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => setVariations(n)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition ${variations === n ? 'bg-gold text-bg-base' : 'bg-bg-base text-ink-dim ring-1 ring-white/10 hover:ring-gold/30'}`}>
                {n}
              </button>
            ))}
          </div>
          <span className="text-[9px] text-ink-dim">= {selectedFormats.length * variations} total images</span>
        </div>

        <button onClick={handleGenerate} disabled={generating || !prompt.trim() || !selectedFormats.length}
          className="w-full rounded-xl bg-gold px-5 py-3 text-sm font-bold text-bg-base shadow-glow disabled:opacity-40">
          {generating ? `🎨 Generating ${selectedFormats.length * variations} creatives...` : `🎨 Generate ${selectedFormats.length * variations} Creative${selectedFormats.length * variations !== 1 ? 's' : ''}`}
        </button>

        {generating && (
          <div className="rounded-xl bg-gold/5 ring-1 ring-gold/20 p-4 text-center">
            <div className="text-2xl mb-2 animate-pulse">🎨</div>
            <p className="text-xs text-ink-muted">AI is enhancing your prompt and generating {selectedFormats.length} creatives via Higgsfield GPT Image 2. This takes 1-3 minutes...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl bg-red-500/10 ring-1 ring-red-500/30 px-4 py-3 text-xs text-red-400">{error}</div>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 p-5 space-y-6">
          <h3 className="text-sm font-bold text-ink">Generated Creatives</h3>

          {Object.entries(results.creatives).map(([key, formatData]) => (
            <div key={key}>
              <h4 className="text-xs font-bold text-gold mb-2">{formatData.format} ({formatData.size})</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(formatData.images || []).map((img, i) => (
                  <div key={i} className="rounded-xl bg-bg-base ring-1 ring-white/5 overflow-hidden">
                    {img.status === 'done' ? (
                      <>
                        <a href={img.url} target="_blank" rel="noopener noreferrer">
                          <img src={img.url} alt={`${formatData.format} v${img.variation}`} className="w-full h-auto" loading="lazy" />
                        </a>
                        <div className="p-2 flex items-center justify-between">
                          <span className="text-[9px] text-ink-dim">v{img.variation}</span>
                          <a href={img.url} target="_blank" rel="noopener noreferrer" download
                            className="rounded-lg bg-gold/20 px-2 py-0.5 text-[9px] font-bold text-gold">Download</a>
                        </div>
                      </>
                    ) : (
                      <div className="p-4 text-center text-[10px] text-red-400">Failed</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Video Generation */}
          <div className="rounded-xl bg-purple-500/5 ring-1 ring-purple-500/20 p-4 space-y-3">
            <h4 className="text-xs font-bold text-purple-400 flex items-center gap-2">🎬 Generate Video from Images</h4>
            <p className="text-[10px] text-ink-dim">Select images above, AI generates a video using Gemini Veo 3.1</p>
            <textarea
              value={videoPrompt}
              onChange={e => setVideoPrompt(e.target.value)}
              placeholder="Video prompt... e.g. 'Gentle zoom in with magical sparkles, floating golden particles, warm bedtime atmosphere' (leave empty for auto)"
              rows={2}
              className="w-full rounded-xl bg-bg-base px-4 py-2.5 text-xs text-ink placeholder-ink-dim ring-1 ring-white/10 focus:ring-purple-500 outline-none resize-none"
            />
            <button onClick={async () => {
              setGeneratingVideo(true);
              setVideoResults(null);
              try {
                // Collect all successful image URLs
                const allImageUrls = [];
                Object.values(results.creatives).forEach(f => {
                  (f.images || []).forEach(img => {
                    if (img.status === 'done') allImageUrls.push(img.url);
                  });
                });
                if (!allImageUrls.length) throw new Error('No images to generate video from');
                const r = await fetch(`${API}/api/generate-social-creatives`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ uid: user.uid, mode: 'video', imageUrls: allImageUrls, videoPrompt: videoPrompt || undefined, campaignId: results.campaignId, prompt }),
                });
                const data = await r.json();
                if (data.error) throw new Error(data.error);
                setVideoResults(data.videos);
              } catch (e) { setError(e.message); }
              setGeneratingVideo(false);
            }} disabled={generatingVideo}
              className="w-full rounded-xl bg-purple-500/20 px-5 py-2.5 text-xs font-bold text-purple-400 hover:bg-purple-500/30 transition disabled:opacity-40">
              {generatingVideo ? '🎬 Generating videos... (this takes 2-5 min)' : '🎬 Generate Videos from All Images'}
            </button>
          </div>

          {/* Video results */}
          {videoResults && (
            <div>
              <h4 className="text-xs font-bold text-purple-400 mb-2">Generated Videos</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {videoResults.map((v, i) => (
                  <div key={i} className="rounded-xl bg-bg-base ring-1 ring-white/5 overflow-hidden">
                    {v.status === 'done' ? (
                      <>
                        <video src={v.url} controls className="w-full h-auto" />
                        <div className="p-2 flex items-center justify-between">
                          <span className="text-[9px] text-ink-dim">Video {i + 1}</span>
                          <a href={v.url} target="_blank" rel="noopener noreferrer" download
                            className="rounded-lg bg-purple-500/20 px-2 py-0.5 text-[9px] font-bold text-purple-400">Download</a>
                        </div>
                      </>
                    ) : (
                      <div className="p-4 text-center text-[10px] text-red-400">Failed: {v.error?.slice(0, 100)}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Past campaigns */}
      {campaigns.length > 0 && (
        <div className="rounded-2xl bg-bg-surface ring-1 ring-white/5 p-5">
          <h3 className="text-sm font-bold text-ink mb-4">Past Campaigns</h3>
          <div className="space-y-3">
            {campaigns.map(c => (
              <details key={c.id} className="rounded-xl bg-bg-base ring-1 ring-white/5 overflow-hidden">
                <summary className="px-4 py-3 cursor-pointer text-xs text-ink flex items-center justify-between">
                  <span className="truncate flex-1 font-bold">{c.prompt?.slice(0, 80)}{c.prompt?.length > 80 ? '...' : ''}</span>
                  <span className="text-[9px] text-ink-dim ml-2 shrink-0">
                    {c.formats?.length || 0} formats · {c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </span>
                </summary>
                <div className="px-4 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {c.creatives && Object.entries(c.creatives).map(([key, cr]) => (
                    (cr.images || []).filter(img => img.status === 'done').map((img, j) => (
                      <a key={`${key}-${j}`} href={img.url} target="_blank" rel="noopener noreferrer" className="block">
                        <img src={img.url} alt={cr.format} className="w-full h-auto rounded-lg ring-1 ring-white/5" loading="lazy" />
                        <div className="text-[9px] text-ink-dim mt-1">{cr.format} · v{img.variation}</div>
                      </a>
                    ))
                  ))}
                  {c.videos && c.videos.filter(v => v.status === 'done').map((v, j) => (
                    <div key={`video-${j}`}>
                      <video src={v.url} controls className="w-full h-auto rounded-lg ring-1 ring-white/5" />
                      <div className="text-[9px] text-purple-400 mt-1">Video {j + 1}</div>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Founder AI Command Bar ──────────────────────────────────────
function FounderCommand({ user }) {
  const [command, setCommand] = useState('');
  const [thinking, setThinking] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const API = import.meta.env.VITE_API_URL || '';

  const handleCommand = async () => {
    if (!command.trim() || thinking) return;
    const cmd = command.trim();
    setCommand('');
    setThinking(true);
    setResult(null);
    setHistory(prev => [...prev, { role: 'user', text: cmd }]);

    try {
      const res = await fetch(`${API}/api/founder-command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, command: cmd }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setHistory(prev => [...prev, { role: 'ai', text: data.message, data }]);
    } catch (e) {
      setHistory(prev => [...prev, { role: 'ai', text: `Error: ${e.message}`, error: true }]);
    }
    setThinking(false);
  };

  const executeAction = async (action) => {
    setThinking(true);
    try {
      const res = await fetch(`${API}/api/founder-command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, executeAction: action }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setHistory(prev => [...prev, { role: 'ai', text: `✅ ${data.message}` }]);
      setResult(null);
    } catch (e) {
      setHistory(prev => [...prev, { role: 'ai', text: `Error: ${e.message}`, error: true }]);
    }
    setThinking(false);
  };

  return (
    <div className="rounded-2xl bg-bg-surface ring-1 ring-gold/20 p-4 mb-6">
      {/* Input */}
      <div className="flex items-center gap-2">
        <span className="text-xl">🤖</span>
        <input
          value={command}
          onChange={e => setCommand(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCommand()}
          placeholder="What do you want to do? e.g. 'edit Spike episode title', 'list all published episodes', 'delete the test episode'..."
          className="flex-1 rounded-xl bg-bg-base px-4 py-3 text-sm text-ink placeholder-ink-dim ring-1 ring-white/10 focus:ring-gold outline-none"
        />
        <button onClick={handleCommand} disabled={thinking || !command.trim()}
          className="rounded-xl bg-gold px-4 py-3 text-sm font-bold text-bg-base disabled:opacity-40">
          {thinking ? '⏳' : '→'}
        </button>
      </div>

      {/* Chat history */}
      {history.length > 0 && (
        <div className="mt-3 space-y-2 max-h-[400px] overflow-y-auto">
          {history.map((h, i) => (
            <div key={i} className={`rounded-xl px-3 py-2 text-xs ${
              h.role === 'user'
                ? 'bg-gold/10 text-gold ml-12'
                : h.error
                  ? 'bg-red-500/10 text-red-400 mr-12'
                  : 'bg-white/5 text-ink mr-12'
            }`}>
              {h.role === 'user' ? '→ ' : '🤖 '}{h.text}

              {/* Show episode list */}
              {h.data?.episodes && (
                <div className="mt-2 space-y-1">
                  {h.data.episodes.map(ep => (
                    <div key={ep.id} className="flex items-center gap-2 rounded-lg bg-black/10 px-2 py-1">
                      <span className="text-[10px] text-ink-muted flex-1 truncate">{ep.title}</span>
                      <span className="text-[9px] text-ink-dim">{ep.series || 'standalone'}</span>
                      <span className="text-[9px] text-ink-dim">{ep.publishedAt ? new Date(ep.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Show episode info */}
              {h.data?.episodeData && (
                <div className="mt-2 rounded-lg bg-black/10 px-3 py-2 space-y-1">
                  <div className="text-[11px] font-bold text-ink">{h.data.episodeData.title}</div>
                  <div className="text-[10px] text-ink-dim">{h.data.episodeData.subtitle}</div>
                  <div className="text-[10px] text-ink-dim">Theme: {h.data.episodeData.theme} · Series: {h.data.episodeData.seriesId || 'none'}</div>
                  {h.data.episodeData.coverImage && <img src={h.data.episodeData.coverImage} alt="" className="w-20 h-14 rounded-lg object-cover mt-1" />}
                  {h.data.episodeData.body && <div className="text-[10px] text-ink-muted mt-1">{h.data.episodeData.body}</div>}
                </div>
              )}

              {/* Show stats */}
              {h.data?.stats && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {Object.entries(h.data.stats).map(([k, v]) => (
                    <div key={k} className="rounded-lg bg-black/10 px-3 py-2 text-center">
                      <div className="text-sm font-bold text-gold">{v}</div>
                      <div className="text-[9px] text-ink-dim">{k.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Show newsletters */}
              {h.data?.newsletters && (
                <div className="mt-2 space-y-1">
                  {h.data.newsletters.map(nl => (
                    <div key={nl.id} className="flex items-center gap-2 rounded-lg bg-black/10 px-2 py-1">
                      <span className="text-[10px] text-ink-muted flex-1 truncate">{nl.name}</span>
                      <span className="text-[9px] text-ink-dim">{nl.status}</span>
                      <span className="text-[9px] text-ink-dim">{nl.sentCount} sent</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Show users */}
              {h.data?.users && (
                <div className="mt-2 space-y-1">
                  {h.data.users.map((u, j) => (
                    <div key={j} className="flex items-center gap-2 rounded-lg bg-black/10 px-2 py-1">
                      <span className="text-[10px] text-ink-muted flex-1 truncate">{u.name || u.email}</span>
                      <span className="text-[9px] text-ink-dim">{u.lastActive ? new Date(u.lastActive).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Show outreach leads */}
              {h.data?.leads && (
                <div className="mt-2 space-y-1">
                  {h.data.leads.map((l, j) => (
                    <div key={j} className="flex items-center gap-2 rounded-lg bg-black/10 px-2 py-1">
                      <span className="text-[10px] text-ink-muted flex-1 truncate">{l.business || l.email}</span>
                      <span className="text-[9px] text-ink-dim">{l.city}</span>
                      <span className="text-[9px] text-ink-dim">Stage {l.stage}/4</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Show generated story preview */}
              {h.data?.story && (
                <div className="mt-2 rounded-lg bg-black/10 px-3 py-2">
                  <div className="text-[11px] font-bold text-ink">{h.data.story.title}</div>
                  <div className="text-[10px] text-ink-dim">{h.data.story.subtitle}</div>
                  <div className="text-[10px] text-ink-muted mt-1">{h.data.story.preview}</div>
                </div>
              )}

              {/* Show newsletter preview */}
              {h.data?.newsletter && (
                <div className="mt-2 rounded-lg bg-black/10 px-3 py-2">
                  <div className="text-[11px] font-bold text-ink">{h.data.newsletter.subject}</div>
                  <div className="text-[10px] text-ink-muted mt-1">{h.data.newsletter.preview}</div>
                </div>
              )}
            </div>
          ))}
          {thinking && (
            <div className="rounded-xl bg-white/5 px-3 py-2 text-xs text-ink-dim mr-12 animate-pulse">
              🤖 Thinking...
            </div>
          )}
        </div>
      )}

      {/* Confirmation buttons for actions that need it */}
      {result && result.confirm && (
        <div className="mt-3 rounded-xl bg-gold/5 ring-1 ring-gold/20 p-3">
          <p className="text-xs text-ink mb-2">{result.message}</p>
          {result.updates && (
            <div className="text-[10px] text-ink-dim mb-2 space-y-0.5">
              {Object.entries(result.updates).map(([k, v]) => (
                <div key={k}><span className="text-gold">{k}:</span> {String(v).slice(0, 200)}{String(v).length > 200 ? '...' : ''}</div>
              ))}
            </div>
          )}
          {result.params && !result.updates && (
            <div className="text-[10px] text-ink-dim mb-2 space-y-0.5">
              {Object.entries(result.params).filter(([k,v]) => v).map(([k, v]) => (
                <div key={k}><span className="text-gold">{k}:</span> {String(v).slice(0, 100)}</div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => executeAction(result)} disabled={thinking}
              className="rounded-lg bg-gold/20 px-4 py-1.5 text-[10px] font-bold text-gold hover:bg-gold/30 transition disabled:opacity-50">
              {result.action === 'delete' ? '🗑️ Confirm Delete' : result.action.includes('send') ? '📤 Confirm Send' : '✅ Confirm'}
            </button>
            <button onClick={() => setResult(null)}
              className="rounded-lg bg-white/5 px-4 py-1.5 text-[10px] text-ink-dim hover:bg-white/10 transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Quick actions */}
      {history.length === 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {['List published episodes', 'Show platform stats', 'List newsletters', 'Show recent users', 'List outreach leads', 'Write a new story'].map(q => (
            <button key={q} onClick={() => { setCommand(q); }}
              className="rounded-full bg-white/5 px-3 py-1 text-[10px] text-ink-dim hover:bg-white/10 transition">
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function FounderHub() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState(null);
  const [marketingChannel, setMarketingChannel] = useState('email-newsletter');
  const [redditLeads, setRedditLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [toast, setToast] = useState(null);

  // Gate: founder only
  useEffect(() => {
    if (user && !FOUNDER_EMAILS.includes(user.email?.toLowerCase())) {
      navigate('/');
    }
  }, [user, navigate]);

  // Load Reddit leads
  const loadLeads = useCallback(async () => {
    if (!db) return;
    setLoading(true);
    try {
      const snap = await getDocs(
        query(collection(db, 'redditLeads'), orderBy('createdAt', 'desc'), limit(50))
      );
      setRedditLeads(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error('Load leads error:', e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadLeads(); }, [loadLeads]);

  // Real-time updates for leads
  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(
      query(collection(db, 'redditLeads'), orderBy('createdAt', 'desc'), limit(50)),
      (snap) => setRedditLeads(snap.docs.map(d => ({ id: d.id, ...d.data() }))),
      () => {}
    );
    return unsub;
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // Scan Reddit for new leads
  const handleScan = async () => {
    setScanning(true);
    try {
      const res = await fetch(`${API}/api/reddit-scan`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ uid: user.uid }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(`Found ${data.leadsFound} new leads`);
    } catch (e) {
      showToast('Scan failed: ' + e.message);
    }
    setScanning(false);
  };

  // Draft comments for a lead
  const handleDraft = async (leadId) => {
    showToast('Drafting comments...');
    try {
      const res = await fetch(`${API}/api/reddit-draft`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ uid: user.uid, leadId }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('3 draft comments ready for review');
    } catch (e) {
      showToast('Draft failed: ' + e.message);
    }
  };

  // Approve and post a comment
  const handleApprove = async (leadId, draftIndex) => {
    showToast('Posting to Reddit...');
    try {
      const res = await fetch(`${API}/api/reddit-post`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ uid: user.uid, leadId, draftIndex }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('Comment posted successfully!');
    } catch (e) {
      showToast('Post failed: ' + e.message);
    }
  };

  // Reject/skip a lead
  const handleReject = async (leadId) => {
    if (!db) return;
    await updateDoc(doc(db, 'redditLeads', leadId), { status: 'rejected' });
  };

  if (!user || !FOUNDER_EMAILS.includes(user.email?.toLowerCase())) return null;

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-bg-base shadow-glow">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Founder Only</p>
        <h1 className="display-title mt-1 text-ink">
          Automation <span className="text-gold">Hub</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Your command center. Monitor agents, approve actions, track performance.
        </p>
      </header>

      {/* AI Command Bar */}
      <FounderCommand user={user} />

      {/* Pipeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {PIPELINES.map(p => {
          const badge = STATUS_BADGE[p.status];
          const isActive = activeSection === p.id;

          return (
            <motion.button
              key={p.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (p.link) navigate(p.link);
                else if (p.status === 'active') setActiveSection(isActive ? null : p.id);
              }}
              className={`rounded-2xl ring-1 p-5 text-left transition ${
                isActive ? 'bg-bg-elevated ring-gold/30 shadow-lift' : 'bg-bg-surface ring-white/5 hover:ring-gold/20'
              } ${p.status === 'coming-soon' ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{p.icon}</span>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-ink">{p.title}</h3>
                  <span className={`text-[9px] font-bold ${badge.text}`}>{badge.label}</span>
                </div>
                {p.link && <span className="text-ink-dim text-sm">↗</span>}
                {!p.link && p.status === 'active' && <span className="text-ink-dim text-xs">{isActive ? '▲' : '▼'}</span>}
              </div>
              <p className="text-[11px] text-ink-muted">{p.description}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Content Publisher Section */}
      <AnimatePresence>
        {activeSection === 'content-publisher' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-8">
              <h2 className="text-base font-bold text-ink mb-4" style={{ fontFamily: 'Lora, serif' }}>
                📖 Content Publisher
              </h2>
              <ContentPublisher user={user} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Marketing Agents Section */}
      <AnimatePresence>
        {activeSection === 'marketing-agents' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mb-8">
              <h2 className="text-base font-bold text-ink mb-4" style={{ fontFamily: 'Lora, serif' }}>
                🤖 Marketing & Outreach Agents
              </h2>

              {/* Channel tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
                {MARKETING_CHANNELS.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => setMarketingChannel(ch.id)}
                    className={`shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition active:scale-95 ${
                      marketingChannel === ch.id
                        ? 'bg-gold text-bg-base shadow-glow'
                        : ch.status === 'active' ? 'bg-white/5 text-ink-muted ring-1 ring-white/10 hover:ring-gold/20' : 'bg-white/3 text-ink-dim ring-1 ring-white/5 opacity-50'
                    }`}
                  >
                    {ch.icon} {ch.label}
                    {ch.status === 'coming-soon' && <span className="text-[8px] opacity-60">soon</span>}
                  </button>
                ))}
              </div>

              {/* Reddit Channel */}
              {marketingChannel === 'reddit' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-ink-muted">Find parenting posts → AI drafts comments → you approve → post</p>
                    <button
                      onClick={handleScan}
                      disabled={scanning}
                      className="rounded-full bg-gold px-4 py-2 text-xs font-bold text-bg-base shadow-glow transition hover:brightness-110 active:scale-95 disabled:opacity-40"
                    >
                      {scanning ? '⏳ Scanning...' : '📡 Scan Reddit'}
                    </button>
                  </div>
                  <RedditStats leads={redditLeads} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="rounded-xl bg-bg-surface ring-1 ring-white/5 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1">Keywords</p>
                      <div className="flex flex-wrap gap-1.5">
                        {['bedtime story', 'parenting app', 'personalized stories', 'kids reading', 'screen time kids', 'toddler bedtime', 'multicultural kids', 'audio stories'].map(kw => (
                          <span key={kw} className="text-[10px] bg-gold/10 text-gold px-2 py-0.5 rounded-full font-medium">{kw}</span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl bg-bg-surface ring-1 ring-white/5 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink-dim mb-1">Subreddits</p>
                      <div className="flex flex-wrap gap-1.5">
                        {['Parenting', 'daddit', 'Mommit', 'toddlers', 'SideProject', 'startups', 'edtech', 'InternetIsBeautiful'].map(sr => (
                          <span key={sr} className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-medium">r/{sr}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {loading && <p className="text-sm text-ink-muted text-center py-8">Loading leads...</p>}
                    {!loading && redditLeads.length === 0 && (
                      <div className="text-center py-12 rounded-2xl bg-bg-surface ring-1 ring-white/5">
                        <p className="text-3xl mb-2">📡</p>
                        <p className="text-sm text-ink-muted">No leads yet. Hit "Scan Reddit" to find opportunities.</p>
                      </div>
                    )}
                    {redditLeads.filter(l => l.status !== 'rejected').map(lead => (
                      <RedditLeadCard key={lead.id} lead={lead} onDraft={handleDraft} onApprove={handleApprove} onReject={handleReject} />
                    ))}
                  </div>
                </div>
              )}

              {/* Email Newsletter Channel */}
              {marketingChannel === 'email-newsletter' && (
                <EmailNewsletter user={user} />
              )}

              {/* Creative Studio */}
              {marketingChannel === 'creative-studio' && (
                <CreativeStudio user={user} />
              )}

              {/* Instagram Channel — Creative Generator */}
              {marketingChannel === 'instagram' && (
                <CreativeGenerator user={user} />
              )}

              {/* Other channels — coming soon placeholder */}
              {marketingChannel !== 'reddit' && marketingChannel !== 'instagram' && marketingChannel !== 'email-newsletter' && marketingChannel !== 'creative-studio' && (
                <ChannelPlaceholder channel={MARKETING_CHANNELS.find(c => c.id === marketingChannel)} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-32" />
    </PageTransition>
  );
}
