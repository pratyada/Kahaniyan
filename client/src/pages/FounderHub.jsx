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

const FOUNDER_EMAILS = ['prateekyadav2010@gmail.com', 'rakshajoshi476@gmail.com'];
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
  { id: 'reddit', label: 'Reddit', icon: '🟠', status: 'active', description: 'Monitor subreddits, AI-draft comments, approve & post. 10 subreddits × 10 keywords.', automation: '80% automated', features: ['Keyword monitoring', 'AI comment drafting (3 styles)', 'Slack approval flow', 'Auto-post after approval', 'Karma tracking'] },
  { id: 'x-twitter', label: 'X / Twitter', icon: '🐦', status: 'coming-soon', description: 'Schedule tweets, reply to relevant threads, track engagement. Thread writer agent.', automation: '70% automated', features: ['Trending topic scanner', 'AI tweet/thread writer', 'Scheduled posting', 'Engagement tracker', 'Hashtag optimizer'] },
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

// ─── Main Component ───────────────────────────────────────────────
export default function FounderHub() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState(null);
  const [marketingChannel, setMarketingChannel] = useState('reddit');
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

              {/* Instagram Channel — Creative Generator */}
              {marketingChannel === 'instagram' && (
                <CreativeGenerator user={user} />
              )}

              {/* Other channels — coming soon placeholder */}
              {marketingChannel !== 'reddit' && marketingChannel !== 'instagram' && (
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
