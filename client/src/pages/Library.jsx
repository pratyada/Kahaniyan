// Creation — Create stories/series or view your creations.
// Guests can browse. Submit requires sign-in.

import { useEffect, useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Feather, Headphones, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import { Share2, Play, Trash2 as TrashIcon } from 'lucide-react';
import WhisperBox, { saveRecentWhisper } from '../components/WhisperBox.jsx';
import { getLibrary, removeFromLibrary } from '../utils/storyCache.js';
import LengthStrip from '../components/LengthStrip.jsx';
import ValuePill from '../components/ValuePill.jsx';
import UpgradeModal from '../components/UpgradeModal.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useStoryGenerator } from '../hooks/useStoryGenerator.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useRadio } from '../hooks/useRadio.jsx';
import { useAdmin } from '../hooks/useAdmin.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
// isAdmin controls: Write Story, Create Series, story duration options
import { RELIGIONS, VALUES, DURATIONS, RELATION_EMOJI } from '../utils/constants.js';
import { RADIO_STATIONS } from '../data/radioStations.js';
import { recommendedValueFor } from '../utils/storyHelpers.js';
import { maxDurationFor } from '../utils/tierGate.js';
import { trackStoryGenerated } from '../utils/analytics.js';
import { SERIES } from '../data/series.js';
import { FOUNDER } from '../utils/socialProof.js';

const THEMES = [
  { key: 'compassion-animals', label: 'Compassion' },
  { key: 'courage', label: 'Courage' },
  { key: 'wisdom', label: 'Wisdom' },
  { key: 'honesty', label: 'Honesty' },
  { key: 'sharing', label: 'Sharing' },
  { key: 'humility', label: 'Humility' },
  { key: 'forgiveness', label: 'Forgiveness' },
  { key: 'patience', label: 'Patience' },
  { key: 'inclusion', label: 'Inclusion' },
];

export default function Library() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useFamilyProfile();
  const { user } = useAuth();
  const { generate, loading: genLoading } = useStoryGenerator();
  const { load, clear } = usePlayer();
  const radio = useRadio();
  const { isUnlimited, isAdmin } = useAdmin();

  const [tab, setTab] = useState('create');
  const [toast, setToast] = useState(null);
  const [createMode, setCreateMode] = useState(null); // null | 'story' | 'series'

  // AI story generator state
  const tier = profile?.tier || 'free';
  const recommended = useMemo(() => recommendedValueFor(profile?.age || 6), [profile?.age]);
  const characters = profile?.characters || [];
  const nonProtagonist = characters.filter((c) => c.relation !== 'self');
  const maxDuration = maxDurationFor(tier, isUnlimited);
  const [genValue, setGenValue] = useState('kindness');
  const [genDuration, setGenDuration] = useState(2);
  const [whisper, setWhisper] = useState('');
  const [whisperOverridesValue, setWhisperOverridesValue] = useState(true);
  const [selectedCharIds, setSelectedCharIds] = useState([]);
  const [storyError, setStoryError] = useState(null);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('');

  const toggleChar = (id) => {
    setSelectedCharIds((prev) => prev.includes(id) ? prev.filter(x => x !== id) : prev.length >= 5 ? prev : [...prev, id]);
  };

  const handleGenerateStory = async () => {
    setStoryError(null);
    // Must be signed in to generate stories
    if (!user) {
      navigate('/login');
      return;
    }
    if (!profile) { setStoryError('Set up your child\'s profile first.'); navigate('/onboarding'); return; }
    const selectedCharacters = characters.filter(c => selectedCharIds.includes(c.id) || c.relation === 'self');
    clear();
    navigate('/player');
    const raagNidra = RADIO_STATIONS.find(s => s.id === 'raag-nidra') || RADIO_STATIONS[0];
    try {
      radio.play(raagNidra);
      // Set background music to 40% — light, not distracting
      setTimeout(() => { document.querySelectorAll('audio').forEach(a => { if (a.src && !a.paused) a.volume = 0.4; }); }, 500);
    } catch {}
    if (whisper.trim()) saveRecentWhisper(whisper.trim());
    generate({
      profile, value: genValue, duration: genDuration,
      language: profile.language || 'English', voice: profile.defaultVoice || 'AI Narrator',
      whisper, whisperOverridesValue, selectedCharacters: selectedCharIds.length > 0 ? selectedCharacters : undefined,
    }).then((story) => {
      console.log('[Creation] Story generated:', story?.title);
      trackStoryGenerated('creation', genValue, genDuration);
      radio.stop();
      load(story);
      try { navigator.vibrate?.([200, 100, 200]); } catch {}
    }).catch((e) => {
      console.error('[Creation] Story generation FAILED:', e);
      radio.stop();
      // Navigate back and show the error — don't silently fail
      navigate('/creation');
      setTimeout(() => setStoryError(e.message || 'Could not generate story. Please try again.'), 100);
    });
  };

  // AI-generated stories from library
  const [generatedStories, setGeneratedStories] = useState(() => getLibrary());

  // Refresh generated stories when tab switches to listen
  useEffect(() => {
    if (tab === 'listen') setGeneratedStories(getLibrary());
  }, [tab]);

  const shareStory = async (story) => {
    // Save story to Firestore so anyone with the link can listen (no login)
    try {
      const { db: fireDb } = await import('../lib/firebase.js');
      if (fireDb) {
        const { doc: fdoc, setDoc: fset } = await import('firebase/firestore');
        await fset(fdoc(fireDb, 'sharedStories', story.id), {
          title: story.title,
          text: story.text,
          wordCount: story.wordCount,
          estimatedMinutes: story.estimatedMinutes,
          value: story.value,
          language: story.language || 'English',
          voice: story.voice || 'AI Narrator',
          tradition: story.tradition,
          coverImage: story.coverImage || null,
          audioUrl: story.audioUrl || null,
          createdAt: story.createdAt,
          sharedAt: new Date().toISOString(),
          sharedBy: user?.uid || 'anonymous',
        }, { merge: true });
      }
    } catch (e) { console.warn('Could not save shared story:', e); }

    const shareUrl = `https://mysleepytale.com/player?storyId=${story.id}`;
    const text = `Listen to "${story.title}" — a personalized bedtime story on My Sleepy Tale!`;
    if (navigator.share) {
      try { await navigator.share({ title: story.title, text, url: shareUrl }); localStorage.setItem('mst:hasShared', '1'); } catch {}
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setToast('Link copied!');
      localStorage.setItem('mst:hasShared', '1');
      setTimeout(() => setToast(null), 2000);
    }
  };

  const playStory = (story) => {
    load(story);
    navigate('/player');
  };

  const deleteGenerated = (storyId) => {
    if (!confirm('Remove this story?')) return;
    removeFromLibrary(storyId);
    setGeneratedStories(getLibrary());
  };

  // Creator state
  const [myStories, setMyStories] = useState([]);
  const [mySeries, setMySeries] = useState([]);
  const [credits, setCredits] = useState(0);

  // Contributor state
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitingSeriesId, setInvitingSeriesId] = useState(null);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [reviewingSubmission, setReviewingSubmission] = useState(null);
  const [approving, setApproving] = useState(null);

  // Shared with me
  const [sharedSeries, setSharedSeries] = useState([]);

  // Share series UI
  const [sharingSeriesId, setSharingSeriesId] = useState(null);
  const [shareEmail, setShareEmail] = useState('');
  const [sharing, setSharing] = useState(false);

  // Story form
  const [title, setTitle] = useState('');
  const [tradition, setTradition] = useState(profile?.beliefs?.[0] || 'universal');
  const [theme, setTheme] = useState('compassion-animals');
  const [source, setSource] = useState('');
  const [body, setBody] = useState('');
  const [storyImage, setStoryImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Series form
  const [seriesTitle, setSeriesTitle] = useState('');
  const [seriesDesc, setSeriesDesc] = useState('');
  const [seriesIcon, setSeriesIcon] = useState('📚');
  const [seriesAge, setSeriesAge] = useState('3-8');
  const [seriesTradition, setSeriesTradition] = useState('universal');
  const [seriesVisibility, setSeriesVisibility] = useState('public'); // public | personal
  const [seriesSharedWith, setSeriesSharedWith] = useState(''); // comma-separated emails for personal
  const [episodes, setEpisodes] = useState([{ title: '', body: '', image: null }]);

  const fileRef = useRef(null);
  const [activeImageIdx, setActiveImageIdx] = useState(-1); // -1 = story image, 0+ = episode index

  // Load creator data
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const { collection, query, where, getDocs, doc, getDoc } = await import('firebase/firestore');

        // My stories
        const myQ = query(collection(db, 'creatorStories'), where('authorUid', '==', user.uid));
        const mySnap = await getDocs(myQ);
        const stories = [];
        mySnap.forEach((d) => stories.push({ id: d.id, ...d.data() }));
        setMyStories(stories.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));

        // My series
        const serQ = query(collection(db, 'creatorSeries'), where('authorUid', '==', user.uid));
        const serSnap = await getDocs(serQ);
        const ser = [];
        serSnap.forEach((d) => ser.push({ id: d.id, ...d.data() }));
        setMySeries(ser.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));

        // Credits
        const creditDoc = await getDoc(doc(db, 'creatorCredits', user.uid));
        if (creditDoc.exists()) setCredits(creditDoc.data().total || 0);

        // Pending contributor submissions for my series
        const subQ = query(collection(db, 'seriesSubmissions'), where('ownerUid', '==', user.uid));
        const subSnap = await getDocs(subQ);
        const subs = [];
        subSnap.forEach((d) => subs.push({ id: d.id, ...d.data() }));
        setPendingSubmissions(subs.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));

        // Series shared with me (personal series where my email is in sharedWith)
        if (user.email) {
          const sharedQ = query(collection(db, 'creatorSeries'), where('sharedWith', 'array-contains', user.email.toLowerCase()));
          const sharedSnap = await getDocs(sharedQ);
          const shared = [];
          sharedSnap.forEach((d) => {
            const data = d.data();
            if (data.authorUid !== user.uid) shared.push({ id: d.id, ...data });
          });
          setSharedSeries(shared);
        }
      } catch {}
    })();
  }, [user]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleImagePick = (idx) => {
    setActiveImageIdx(idx);
    fileRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (activeImageIdx === -1) {
        setStoryImage(reader.result);
      } else {
        const updated = [...episodes];
        updated[activeImageIdx].image = reader.result;
        setEpisodes(updated);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmitStory = async () => {
    if (!user) { navigate('/login'); return; }
    if (!title.trim() || !body.trim()) { showToast('Title and story are required'); return; }
    const wc = body.trim().split(/\s+/).length;
    if (wc < 100) { showToast(`Need at least 100 words (${wc} now)`); return; }

    setSubmitting(true);
    try {
      const { db } = await import('../lib/firebase.js');
      const { collection, addDoc } = await import('firebase/firestore');

      const { getOrCreateUsername } = await import('../utils/usernameHelper.js');
      const authorUsername = await getOrCreateUsername() || '';

      const storyData = {
        title: title.trim(), tradition, theme,
        source: source.trim() || `${tradition} tradition`,
        body: body.trim(),
        authorUid: user.uid,
        authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        authorEmail: user.email || '',
        authorUsername,
        status: 'pending', submittedAt: new Date().toISOString(),
        views: 0, creditsEarned: 0,
        type: 'story',
      };

      // Upload image if provided
      if (storyImage) {
        try {
          const { storage } = await import('../lib/firebase.js');
          const { ref, uploadString, getDownloadURL } = await import('firebase/storage');
          const imgRef = ref(storage, `creator-images/${user.uid}/${Date.now()}.jpg`);
          await uploadString(imgRef, storyImage, 'data_url');
          storyData.coverImage = await getDownloadURL(imgRef);
        } catch {}
      }

      const storyRef = await addDoc(collection(db, 'creatorStories'), storyData);
      showToast('Story submitted! We\'ll review within 48 hours.');
      // Notify creator via email
      try { await fetch('/api/story-created-notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'story', title: title.trim(), authorEmail: user.email, authorName: user.displayName || user.email?.split('@')[0] || 'Anonymous', storyId: storyRef.id }) }); } catch {}
      setTitle(''); setBody(''); setSource(''); setStoryImage(null);
      setCreateMode(null);
      // Switch to My Creations and refresh
      setTab('listen');
      try {
        const { query: q2, where: w2, getDocs: gd2 } = await import('firebase/firestore');
        const myQ = q2(collection(db, 'creatorStories'), w2('authorUid', '==', user.uid));
        const snap = await gd2(myQ);
        const updated = [];
        snap.forEach((d) => updated.push({ id: d.id, ...d.data() }));
        setMyStories(updated.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
      } catch {}
    } catch (e) { showToast('Failed: ' + e.message); }
    setSubmitting(false);
  };

  const handleSubmitSeries = async () => {
    if (!user) { navigate('/login'); return; }
    if (!seriesTitle.trim()) { showToast('Series title is required'); return; }
    const validEps = episodes.filter(ep => ep.title.trim() && ep.body.trim());
    if (validEps.length < 2) { showToast('Need at least 2 episodes with title and story'); return; }

    setSubmitting(true);
    try {
      const { db } = await import('../lib/firebase.js');
      const { collection, addDoc } = await import('firebase/firestore');

      const epData = [];
      for (let i = 0; i < validEps.length; i++) {
        const ep = validEps[i];
        let epImage = null;
        if (ep.image) {
          try {
            const { storage } = await import('../lib/firebase.js');
            const { ref, uploadString, getDownloadURL } = await import('firebase/storage');
            const imgRef = ref(storage, `creator-images/${user.uid}/series_${Date.now()}_ep${i}.jpg`);
            await uploadString(imgRef, ep.image, 'data_url');
            epImage = await getDownloadURL(imgRef);
          } catch {}
        }
        epData.push({
          episodeNumber: i + 1,
          title: ep.title.trim(),
          body: ep.body.trim(),
          wordCount: ep.body.trim().split(/\s+/).length,
          coverImage: epImage,
        });
      }

      const sharedEmails = seriesVisibility === 'personal'
        ? seriesSharedWith.split(',').map(e => e.trim().toLowerCase()).filter(e => e.includes('@'))
        : [];

      const authorName = user.displayName || user.email?.split('@')[0] || 'Anonymous';
      const seriesRef = await addDoc(collection(db, 'creatorSeries'), {
        title: seriesTitle.trim(),
        description: seriesDesc.trim(),
        icon: seriesIcon,
        ageRange: seriesAge,
        tradition: seriesTradition,
        episodes: epData,
        totalEpisodes: epData.length,
        authorUid: user.uid,
        authorName,
        authorEmail: user.email || '',
        authorUsername: (await import('../utils/usernameHelper.js').then(m => m.getOrCreateUsername())) || '',
        status: seriesVisibility === 'personal' ? 'approved' : 'pending',
        visibility: seriesVisibility,
        sharedWith: sharedEmails,
        submittedAt: new Date().toISOString(),
        type: 'series',
      });
      showToast(seriesVisibility === 'personal' ? 'Personal series created!' : 'Series submitted! We\'ll review within 48 hours.');
      // Notify creator via email
      try { await fetch('/api/story-created-notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'series', title: seriesTitle.trim(), authorEmail: user.email, authorName, storyId: seriesRef.id }) }); } catch {}
      // Notify shared users via email
      if (sharedEmails.length > 0) {
        for (const sharedEmail of sharedEmails) {
          try { await fetch('/api/series-shared-notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ seriesTitle: seriesTitle.trim(), seriesId: seriesRef.id, ownerName: authorName, sharedWithEmail: sharedEmail }) }); } catch {}
        }
      }
      setSeriesTitle(''); setSeriesDesc(''); setSeriesIcon('📚');
      setEpisodes([{ title: '', body: '', image: null }]);
      setCreateMode(null);
      // Switch to My Creations tab and refresh
      setTab('listen');
      try {
        const { collection: coll, query: q2, where: w2, getDocs: gd2 } = await import('firebase/firestore');
        const serQ = q2(coll(db, 'creatorSeries'), w2('authorUid', '==', user.uid));
        const serSnap = await gd2(serQ);
        const ser = [];
        serSnap.forEach((d) => ser.push({ id: d.id, ...d.data() }));
        setMySeries(ser.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
      } catch {}
    } catch (e) { showToast('Failed: ' + e.message); }
    setSubmitting(false);
  };

  const addEpisode = () => setEpisodes([...episodes, { title: '', body: '', image: null }]);
  const removeEpisode = (i) => { if (episodes.length > 1) setEpisodes(episodes.filter((_, idx) => idx !== i)); };
  const updateEpisode = (i, field, value) => {
    const updated = [...episodes];
    updated[i][field] = value;
    setEpisodes(updated);
  };

  const handleDelete = async (id, collName) => {
    if (!confirm('Delete this? This cannot be undone.')) return;
    try {
      const { db } = await import('../lib/firebase.js');
      const { doc, deleteDoc } = await import('firebase/firestore');
      await deleteDoc(doc(db, collName, id));
      if (collName === 'creatorSeries') setMySeries(prev => prev.filter(s => s.id !== id));
      else setMyStories(prev => prev.filter(s => s.id !== id));
      showToast('Deleted');
    } catch (e) { showToast('Failed: ' + e.message); }
  };

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;

  const statusLabel = (status) => {
    const map = { pending: t('creation.submitted'), revision_requested: t('creation.needsEdits'), approved: 'Approved', published: t('creation.published'), rejected: 'Rejected' };
    return map[status] || status;
  };
  const statusColor = (status) => {
    const map = { pending: 'bg-gold/10 text-gold', revision_requested: 'bg-blue-500/10 text-blue-400', approved: 'bg-emerald-500/10 text-emerald-400', published: 'bg-green-500/10 text-green-400', rejected: 'bg-red-500/10 text-red-400' };
    return map[status] || 'bg-gold/10 text-gold';
  };

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleFileChange} />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gold px-5 py-2 text-sm font-bold text-bg-base shadow-glow">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
          <span className="text-gold">Create</span>
        </h1>
        <p className="mt-1 text-xs text-ink-muted">
          Create stories & series or view your creations
        </p>
      </header>

      {/* Tab bar */}
      <div className="mb-5 flex gap-1 rounded-2xl bg-bg-surface p-1 ring-1 ring-white/5">
        <button onClick={() => { setTab('create'); setCreateMode(null); }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition ${
            tab === 'create' ? 'bg-gold text-bg-base' : 'text-ink-muted'
          }`}>
          <Feather size={14} /> {t('creation.create')}
        </button>
        <button onClick={() => setTab('listen')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition ${
            tab === 'listen' ? 'bg-gold text-bg-base' : 'text-ink-muted'
          }`}>
          <Headphones size={14} /> {t('creation.myCreations')}
        </button>
      </div>

      {/* ═══ CREATE TAB ═══ */}
      {tab === 'create' && !createMode && (
        <>
          {/* ── AI Story Generator (inline) ── */}
          <div className="mb-6 rounded-2xl p-4 ring-1 ring-gold/20" style={{ background: 'linear-gradient(135deg, rgba(240,165,0,0.08) 0%, rgba(240,165,0,0.02) 100%)' }}>
            <h2 className="text-base font-bold text-gold mb-3" style={{ fontFamily: 'Fraunces, serif' }}>
              🌙 Tonight's Story for {profile?.childName || 'your child'}
            </h2>

            <WhisperBox value={whisper} onChange={setWhisper} overrideValue={whisperOverridesValue} onToggleOverride={setWhisperOverridesValue} />

            {/* Cast selection */}
            {nonProtagonist.length > 0 && (
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-2">Include in tonight's story</p>
                <div className="flex flex-wrap gap-1.5">
                  {nonProtagonist.map(c => (
                    <button key={c.id} onClick={() => toggleChar(c.id)}
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition ${
                        selectedCharIds.includes(c.id) ? 'bg-gold text-bg-base' : 'bg-bg-surface text-ink-muted ring-1 ring-white/10'
                      }`}>
                      <span>{RELATION_EMOJI[c.relation] || '✨'}</span>
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Auto-pick toggle */}
            <label className="mb-4 flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-bg-surface p-3 ring-1 ring-white/5">
              <div className="min-w-0 flex-1">
                <div className="font-ui text-xs font-bold text-ink">Auto-pick the lesson</div>
                <div className="mt-0.5 text-[11px] text-ink-muted">
                  {whisperOverridesValue ? "We'll choose the best value for you" : 'Pick a value below'}
                </div>
              </div>
              <span onClick={(e) => { e.preventDefault(); setWhisperOverridesValue(!whisperOverridesValue); }}
                className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition ${whisperOverridesValue ? 'bg-gold' : 'bg-bg-card ring-1 ring-white/10'}`}>
                <span className={`inline-block h-5 w-5 transform rounded-full bg-bg-base transition ${whisperOverridesValue ? 'translate-x-6' : 'translate-x-1'}`} />
              </span>
            </label>

            {!whisperOverridesValue && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                {VALUES.map(v => (
                  <button key={v.key} onClick={() => setGenValue(v.key)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${
                      genValue === v.key ? 'bg-gold text-bg-base' : 'bg-bg-surface text-ink-muted ring-1 ring-white/10'
                    }`}>
                    {v.emoji} {v.label}
                  </button>
                ))}
              </div>
            )}

            {/* Story length — non-admin locked to 2 min */}
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-ink-muted mb-2">Story Length</p>
              <div className="flex gap-2">
                {DURATIONS.map(d => {
                  const locked = !isAdmin && d.minutes > 2;
                  return (
                    <button key={d.minutes}
                      onClick={() => locked ? null : d.minutes <= maxDuration ? setGenDuration(d.minutes) : (setUpgradeReason('duration'), setUpgradeOpen(true))}
                      className={`flex-1 rounded-xl py-2 text-center text-xs font-bold transition ${
                        genDuration === d.minutes ? 'bg-gold text-bg-base'
                        : locked ? 'bg-bg-surface text-ink-dim ring-1 ring-white/5 opacity-30'
                        : d.minutes > maxDuration ? 'bg-bg-surface text-ink-dim ring-1 ring-white/5 opacity-50'
                        : 'bg-bg-surface text-ink-muted ring-1 ring-white/10'
                      }`}>
                      {d.label}{locked ? ' 🔒' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {storyError && <p className="mb-3 text-xs text-red-400">{storyError}</p>}

            <motion.button whileTap={{ scale: 0.97 }} onClick={handleGenerateStory} disabled={genLoading}
              className="w-full rounded-2xl bg-gold py-4 text-center text-base font-bold text-bg-base shadow-glow disabled:opacity-50">
              {genLoading ? 'Creating story...' : user ? "Start Tonight's Story" : "Sign in to Start Tonight's Story"}
            </motion.button>
            {!user && <p className="mt-2 text-center text-[10px] text-ink-dim">Free account required to generate stories</p>}
          </div>

          {/* ── Creator Submissions — admin only ── */}
          {isAdmin && (
            <>
              <div className="mb-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/2 p-4 ring-1 ring-white/5">
                <h3 className="text-sm font-bold text-ink mb-1" style={{ fontFamily: 'Fraunces, serif' }}>Write for the Community</h3>
                <p className="text-[10px] text-ink-muted">Submit stories for thousands of kids to hear</p>
              </div>

              <div className="space-y-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setCreateMode('story')}
                  className="w-full flex items-center gap-4 rounded-2xl bg-bg-surface p-4 ring-1 ring-white/8 text-left transition hover:ring-gold/30">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold/10 text-xl">📖</div>
                  <div>
                    <h3 className="text-sm font-bold text-ink">{t('creation.writeStory')}</h3>
                    <p className="text-[10px] text-ink-muted mt-0.5">A single bedtime story for the community</p>
                  </div>
                </motion.button>

                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setCreateMode('series')}
                  className="w-full flex items-center gap-4 rounded-2xl bg-bg-surface p-4 ring-1 ring-white/8 text-left transition hover:ring-gold/30">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold/10 text-xl">📺</div>
                  <div>
                    <h3 className="text-sm font-bold text-ink">{t('creation.createSeries')}</h3>
                    <p className="text-[10px] text-ink-muted mt-0.5">Multiple episodes — same characters each night</p>
                  </div>
                </motion.button>
              </div>
            </>
          )}

          <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} reason={upgradeReason} />
        </>
      )}

      {/* ═══ CREATE STORY FORM ═══ */}
      {tab === 'create' && createMode === 'story' && (
        <div className="space-y-4">
          <button onClick={() => setCreateMode(null)} className="text-[11px] font-bold text-ink-muted">← Back to options</button>
          <h3 className="text-sm font-bold text-ink">New Story</h3>

          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder={t('creation.storyTitle')} className="field" />

          <div className="flex gap-3">
            <select value={tradition} onChange={(e) => setTradition(e.target.value)} className="field flex-1 text-sm">
              {RELIGIONS.map((r) => <option key={r.key} value={r.key}>{r.icon} {r.label}</option>)}
            </select>
            <select value={theme} onChange={(e) => setTheme(e.target.value)} className="field flex-1 text-sm">
              {THEMES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
          </div>

          <input value={source} onChange={(e) => setSource(e.target.value)}
            placeholder="Source (e.g. Panchatantra folk tradition)" className="field" />

          <textarea value={body} onChange={(e) => setBody(e.target.value)}
            placeholder={'Write your story here...\n\nUse {childName} for personalization.\nEnd with a gentle bedtime message.'}
            className="field h-48 resize-y" />
          <p className="text-[10px] text-ink-dim">{wordCount} words {wordCount > 0 && wordCount < 100 ? `(need ${100 - wordCount} more)` : ''}</p>

          {/* Cover image upload */}
          <button onClick={() => handleImagePick(-1)}
            className="flex items-center gap-2 rounded-xl bg-bg-surface px-4 py-3 ring-1 ring-white/8 text-xs text-ink-muted w-full">
            <ImageIcon size={16} className="text-gold" />
            {storyImage ? 'Cover image added ✓' : 'Add cover image (optional)'}
          </button>
          {storyImage && (
            <img src={storyImage} alt="" className="h-24 w-full rounded-xl object-cover ring-1 ring-white/10" />
          )}

          <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmitStory}
            disabled={submitting || wordCount < 100 || !title.trim()}
            className="w-full rounded-2xl bg-gold py-4 text-base font-bold text-bg-base shadow-glow transition disabled:opacity-40">
            {!user ? t('login.signInToContinue') : submitting ? 'Submitting...' : t('creation.submit')}
          </motion.button>
        </div>
      )}

      {/* ═══ CREATE SERIES FORM ═══ */}
      {tab === 'create' && createMode === 'series' && (
        <div className="space-y-4">
          <button onClick={() => setCreateMode(null)} className="text-[11px] font-bold text-ink-muted">← Back to options</button>
          <h3 className="text-sm font-bold text-ink">New Series</h3>

          <div className="flex gap-3">
            <input value={seriesIcon} onChange={(e) => setSeriesIcon(e.target.value)}
              placeholder="Icon" className="field w-16 text-center text-xl" maxLength={2} />
            <input value={seriesTitle} onChange={(e) => setSeriesTitle(e.target.value)}
              placeholder="Series title" className="field flex-1" />
          </div>

          <textarea value={seriesDesc} onChange={(e) => setSeriesDesc(e.target.value)}
            placeholder="Describe your series in 1-2 lines" className="field h-16 resize-none" />

          <div className="flex gap-3">
            <select value={seriesTradition} onChange={(e) => setSeriesTradition(e.target.value)} className="field flex-1 text-sm">
              {RELIGIONS.map((r) => <option key={r.key} value={r.key}>{r.icon} {r.label}</option>)}
            </select>
            <select value={seriesAge} onChange={(e) => setSeriesAge(e.target.value)} className="field flex-1 text-sm">
              <option value="2-4">Ages 2-4</option>
              <option value="3-5">Ages 3-5</option>
              <option value="3-8">Ages 3-8</option>
              <option value="5-10">Ages 5-10</option>
              <option value="8-12">Ages 8-12</option>
            </select>
          </div>

          {/* Visibility */}
          <div className="rounded-xl bg-bg-surface p-4 ring-1 ring-white/8 space-y-3">
            <h4 className="text-xs font-bold text-ink">Visibility</h4>
            <div className="flex gap-2">
              <button onClick={() => setSeriesVisibility('public')}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition ${seriesVisibility === 'public' ? 'bg-gold/20 text-gold ring-1 ring-gold/30' : 'bg-white/5 text-ink-muted ring-1 ring-white/10'}`}>
                🌍 Public
              </button>
              <button onClick={() => setSeriesVisibility('personal')}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold transition ${seriesVisibility === 'personal' ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30' : 'bg-white/5 text-ink-muted ring-1 ring-white/10'}`}>
                🔒 Personal
              </button>
            </div>
            <p className="text-[10px] text-ink-dim">
              {seriesVisibility === 'public' ? 'Published for everyone after review.' : 'Only visible to you and people you share with. No review needed.'}
            </p>
            {seriesVisibility === 'personal' && (
              <div>
                <label className="text-[10px] text-ink-dim block mb-1">Share with (comma-separated emails)</label>
                <input value={seriesSharedWith} onChange={e => setSeriesSharedWith(e.target.value)}
                  placeholder="friend@email.com, family@email.com"
                  className="field text-sm" />
              </div>
            )}
          </div>

          {/* Episodes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-ink">Episodes ({episodes.length})</h4>
              <button onClick={addEpisode}
                className="flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1.5 text-[10px] font-bold text-gold ring-1 ring-gold/20">
                <Plus size={12} /> Add Episode
              </button>
            </div>

            {episodes.map((ep, i) => (
              <div key={i} className="rounded-xl bg-bg-surface p-4 ring-1 ring-white/8 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold">Episode {i + 1}</span>
                  {episodes.length > 1 && (
                    <button onClick={() => removeEpisode(i)} className="text-ink-dim hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                <input value={ep.title} onChange={(e) => updateEpisode(i, 'title', e.target.value)}
                  placeholder={`Episode ${i + 1} title`} className="field" />

                <textarea value={ep.body} onChange={(e) => updateEpisode(i, 'body', e.target.value)}
                  placeholder="Write the episode story..."
                  className="field h-32 resize-y" />
                <p className="text-[10px] text-ink-dim">
                  {ep.body.trim().split(/\s+/).filter(Boolean).length} words
                </p>

                {/* Episode image */}
                <button onClick={() => handleImagePick(i)}
                  className="flex items-center gap-2 rounded-lg bg-black/20 px-3 py-2 ring-1 ring-white/5 text-[10px] text-ink-muted w-full">
                  <ImageIcon size={12} className="text-gold" />
                  {ep.image ? 'Image added ✓' : 'Add episode image'}
                </button>
                {ep.image && (
                  <img src={ep.image} alt="" className="h-20 w-full rounded-lg object-cover ring-1 ring-white/10" />
                )}
              </div>
            ))}
          </div>

          <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmitSeries}
            disabled={submitting || !seriesTitle.trim() || episodes.filter(e => e.title.trim() && e.body.trim()).length < 2}
            className="w-full rounded-2xl bg-gold py-4 text-base font-bold text-bg-base shadow-glow transition disabled:opacity-40">
            {!user ? t('login.signInToContinue') : submitting ? 'Submitting...' : `${t('creation.submitSeries')} (${episodes.filter(e => e.title.trim() && e.body.trim()).length} ${t('home.episodes')})`}
          </motion.button>
        </div>
      )}

      {/* ═══ MY CREATIONS TAB ═══ */}
      {tab === 'listen' && (
        <>
          {/* AI-Generated Stories — visible to everyone (stored locally) */}
          {generatedStories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-ink mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
                🌙 Tonight's Stories
              </h3>
              <p className="text-[10px] text-ink-dim mb-3">AI-generated bedtime stories for your child — share with family & friends via link</p>
              <div className="space-y-2">
                {generatedStories.map((story) => (
                  <div key={story.id} className="rounded-xl bg-bg-surface p-3 ring-1 ring-white/5">
                    <div className="flex items-start gap-3">
                      {story.coverImage ? (
                        <img src={story.coverImage} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
                      ) : (
                        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gold/10 text-lg">🌙</div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-ink truncate">{story.title}</h4>
                        <p className="text-[10px] text-ink-muted mt-0.5">
                          {story.estimatedMinutes} min · {story.value} · {new Date(story.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold bg-purple-500/10 text-purple-400">personal</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => playStory(story)}
                        className="flex items-center gap-1 rounded-lg bg-gold/10 px-3 py-1.5 text-[10px] font-bold text-gold">
                        <Play size={12} /> Play
                      </button>
                      <button onClick={() => shareStory(story)}
                        className="flex items-center gap-1 rounded-lg bg-blue-500/10 px-3 py-1.5 text-[10px] font-bold text-blue-400">
                        <Share2 size={12} /> Share
                      </button>
                      <button onClick={() => deleteGenerated(story.id)}
                        className="ml-auto rounded-lg px-2 py-1.5 text-[10px] text-ink-dim hover:text-red-400">
                        <TrashIcon size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {generatedStories.length === 0 && !user && (
            <div className="mb-6 rounded-xl bg-bg-surface p-5 text-center ring-1 ring-white/5">
              <div className="text-3xl mb-2">🌙</div>
              <p className="text-sm text-ink-muted">Generate your first story from the Create tab!</p>
            </div>
          )}

          {/* Creator-submitted content */}
          {!user ? (
            generatedStories.length === 0 && (
              <div className="mt-12 text-center">
                <div className="text-5xl mb-4">🔒</div>
                <p className="text-lg font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>Sign in to see your creations</p>
                <p className="mt-2 text-sm text-ink-muted">Your submitted stories will appear here.</p>
                <button onClick={() => navigate('/login')} className="mt-4 rounded-2xl bg-gold px-6 py-3 text-sm font-bold text-bg-base">
                  Sign In
                </button>
              </div>
            )
          ) : (
            <div className="space-y-3">
              {/* Published community stories */}
              {/* Personal series */}
              {mySeries.filter(s => s.visibility === 'personal').length > 0 && (
                <div className="mb-4">
                  <div className="mb-2">
                    <h3 className="text-sm font-bold text-ink mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
                      🔒 My Personal Series
                    </h3>
                    <p className="text-[10px] text-ink-dim">Private — only visible to you and people you share with</p>
                  </div>
                  {mySeries.filter(s => s.visibility === 'personal').map((s) => (
                    <div key={`personal-${s.id}`} className="rounded-xl bg-bg-surface p-4 ring-1 ring-blue-500/10 mb-2">
                      <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => navigate(`/series/${s.id}`)}>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{s.icon}</span>
                            <h3 className="text-sm font-bold text-ink">{s.title}</h3>
                            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[8px] font-bold text-blue-400">PERSONAL</span>
                          </div>
                          <p className="text-[10px] text-ink-muted">{s.totalEpisodes} episodes · {s.ageRange}</p>
                          <div className="mt-2 space-y-0.5">
                            {(s.episodes || []).map((ep, i) => (
                              <p key={i} className="text-[10px] text-ink-dim">Ep {ep.episodeNumber}: {ep.title}</p>
                            ))}
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold bg-blue-500/10 text-blue-400">personal</span>
                      </div>

                      {/* Shared with list */}
                      {s.sharedWith?.length > 0 && (
                        <div className="mt-3 border-t border-white/5 pt-2">
                          <p className="text-[9px] text-ink-dim mb-1">Shared with:</p>
                          <div className="flex flex-wrap gap-1">
                            {s.sharedWith.map(email => (
                              <span key={email} className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[9px] text-blue-400">{email}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Share + Invite buttons */}
                      <div className="mt-3 border-t border-white/5 pt-3">
                        {sharingSeriesId === s.id ? (
                          <div className="flex gap-2">
                            <input type="email" value={shareEmail} onChange={e => setShareEmail(e.target.value)}
                              placeholder="email@example.com"
                              className="flex-1 rounded-lg bg-white/5 px-3 py-1.5 text-[11px] text-ink placeholder-ink-dim ring-1 ring-white/10 outline-none" />
                            <button disabled={sharing || !shareEmail.includes('@')}
                              onClick={async (e) => {
                                e.stopPropagation();
                                setSharing(true);
                                try {
                                  const { db: fireDb } = await import('../lib/firebase.js');
                                  const { updateDoc: uDoc, doc: fDoc, arrayUnion } = await import('firebase/firestore');
                                  const emailToShare = shareEmail.trim().toLowerCase();
                                  await uDoc(fDoc(fireDb, 'creatorSeries', s.id), { sharedWith: arrayUnion(emailToShare) });
                                  // Update local state
                                  setMySeries(prev => prev.map(ms => ms.id === s.id ? { ...ms, sharedWith: [...(ms.sharedWith || []), emailToShare] } : ms));
                                  showToast(`Shared with ${emailToShare}!`);
                                  setShareEmail('');
                                  setSharingSeriesId(null);
                                } catch (err) { alert('Share failed: ' + err.message); }
                                setSharing(false);
                              }}
                              className="rounded-lg bg-blue-500/20 px-3 py-1.5 text-[10px] font-bold text-blue-400 disabled:opacity-50">
                              {sharing ? '...' : 'Share'}
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setSharingSeriesId(null); setShareEmail(''); }}
                              className="text-[10px] text-ink-dim">Cancel</button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={(e) => { e.stopPropagation(); setSharingSeriesId(s.id); }}
                              className="text-[10px] text-blue-400/70 hover:text-blue-400">
                              + Share with someone
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(SERIES.some(s => s.createdBy === user?.email) || myStories.length > 0 || mySeries.filter(s => s.visibility !== 'personal').length > 0) && (
                <div className="mb-2">
                  <h3 className="text-sm font-bold text-ink mb-1" style={{ fontFamily: 'Fraunces, serif' }}>
                    📚 Published for Community
                  </h3>
                  <p className="text-[10px] text-ink-dim">Stories & series you wrote — available to all listeners worldwide</p>
                </div>
              )}
              {/* Built-in series — show to creator who owns them, or founder sees all */}
              {SERIES.filter(s => !s.comingSoon && (s.createdBy === user?.email || (!s.createdBy && user?.email === FOUNDER.email))).map((series) => (
                <div key={series.id} className="rounded-xl bg-bg-surface p-4 ring-1 ring-white/5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{series.icon}</span>
                        <h3 className="text-sm font-bold text-ink">{series.title}</h3>
                      </div>
                      <p className="text-[10px] text-ink-muted">Series · {series.totalEpisodes} episodes · {series.ageRange}</p>
                      <div className="mt-2 space-y-0.5">
                        {series.episodes.map((ep) => (
                          <p key={ep.id} className="text-[10px] text-ink-dim">Ep {ep.episodeNumber}: {ep.title}</p>
                        ))}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold bg-green-500/10 text-green-400">published</span>
                  </div>
                  <div className="mt-2 flex items-center gap-4 text-[11px] text-ink-muted">
                    <span>📺 {series.totalEpisodes} episodes</span>
                    <span>⭐ {series.totalEpisodes * 15 + 50} credits</span>
                  </div>
                </div>
              ))}

              {/* User-submitted series (public only — personal shown above) */}
              {mySeries.filter(s => s.visibility !== 'personal').map((s) => (
                <div key={s.id} className="rounded-xl bg-bg-surface p-4 ring-1 ring-white/5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{s.icon}</span>
                        <h3 className="text-sm font-bold text-ink">{s.title}</h3>
                      </div>
                      <p className="text-[10px] text-ink-muted">
                        {s.visibility === 'personal' ? '🔒 Personal' : '🌍 Public'} · {s.totalEpisodes} episodes · {s.ageRange}
                      </p>
                      <div className="mt-2 space-y-0.5">
                        {(s.episodes || []).map((ep, i) => (
                          <p key={i} className="text-[10px] text-ink-dim">Ep {ep.episodeNumber}: {ep.title}</p>
                        ))}
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusColor(s.status)}`}>
                      {statusLabel(s.status)}
                    </span>
                  </div>
                  {/* Admin feedback */}
                  {s.adminFeedback && s.status === 'revision_requested' && (
                    <div className="mt-2 rounded-lg bg-blue-500/5 border border-blue-500/20 p-2.5">
                      <p className="text-[9px] font-bold text-blue-400 uppercase tracking-wider mb-1">Admin feedback</p>
                      <p className="text-[10px] text-blue-300/80">{s.adminFeedback}</p>
                    </div>
                  )}
                  {s.status === 'pending' && (
                    <p className="mt-2 text-[10px] text-gold/70">Under review — we will notify you within 48 hours</p>
                  )}
                  {(s.status === 'pending' || s.status === 'rejected' || s.status === 'revision_requested') && (
                    <button onClick={() => handleDelete(s.id, 'creatorSeries')}
                      className="mt-2 text-[10px] text-red-400/60 hover:text-red-400">
                      {t('common.delete')}
                    </button>
                  )}

                  {/* Invite contributor */}
                  {s.status === 'approved' && (
                    <div className="mt-3 border-t border-white/5 pt-3">
                      {invitingSeriesId === s.id ? (
                        <div className="flex gap-2">
                          <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                            placeholder="contributor@email.com"
                            className="flex-1 rounded-lg bg-white/5 px-3 py-1.5 text-[11px] text-ink placeholder-ink-dim ring-1 ring-white/10 outline-none" />
                          <button disabled={sendingInvite || !inviteEmail.includes('@')}
                            onClick={async () => {
                              setSendingInvite(true);
                              try {
                                const resp = await fetch('/api/contributor-invite', {
                                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ seriesId: s.id, seriesTitle: s.title, contributorEmail: inviteEmail, ownerUid: user.uid, ownerEmail: user.email, ownerName: user.displayName || '' }),
                                });
                                const data = await resp.json();
                                if (data.sent) { showToast('Invitation sent!'); setInviteEmail(''); setInvitingSeriesId(null); }
                                else alert(data.error || 'Failed');
                              } catch (e) { alert('Failed: ' + e.message); }
                              setSendingInvite(false);
                            }}
                            className="rounded-lg bg-gold/20 px-3 py-1.5 text-[10px] font-bold text-gold disabled:opacity-50">
                            {sendingInvite ? '...' : 'Send'}
                          </button>
                          <button onClick={() => { setInvitingSeriesId(null); setInviteEmail(''); }}
                            className="text-[10px] text-ink-dim">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setInvitingSeriesId(s.id)}
                          className="text-[10px] text-gold/70 hover:text-gold">
                          + Invite Contributor
                        </button>
                      )}
                    </div>
                  )}

                  {/* Pending submissions for this series */}
                  {pendingSubmissions.filter(sub => sub.seriesId === s.id && sub.status === 'pending').length > 0 && (
                    <div className="mt-3 border-t border-white/5 pt-3">
                      <p className="text-[10px] font-bold text-gold mb-2">
                        {pendingSubmissions.filter(sub => sub.seriesId === s.id && sub.status === 'pending').length} pending submission(s)
                      </p>
                      {pendingSubmissions.filter(sub => sub.seriesId === s.id && sub.status === 'pending').map(sub => (
                        <div key={sub.id} className="rounded-lg bg-white/3 ring-1 ring-white/5 p-3 mb-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-ink truncate">{sub.episodeTitle}</p>
                              <p className="text-[9px] text-ink-dim">by {sub.contributorName} · {sub.wordCount} words · {new Date(sub.submittedAt).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => setReviewingSubmission(reviewingSubmission === sub.id ? null : sub.id)}
                              className="shrink-0 rounded-lg bg-gold/20 px-2 py-1 text-[9px] font-bold text-gold">
                              Review
                            </button>
                          </div>
                          {reviewingSubmission === sub.id && (
                            <div className="mt-3 space-y-3">
                              {sub.coverImage && <img src={sub.coverImage} alt="" className="w-full max-h-40 object-cover rounded-lg" />}
                              <div className="rounded-lg bg-white/5 p-3 max-h-48 overflow-y-auto">
                                <p className="text-[11px] text-ink-muted leading-relaxed whitespace-pre-wrap">{sub.body}</p>
                              </div>
                              <div className="flex gap-2">
                                <button disabled={approving === sub.id}
                                  onClick={async () => {
                                    setApproving(sub.id);
                                    try {
                                      const { updateDoc: uDoc, doc: fDoc, getDoc: gDoc, arrayUnion } = await import('firebase/firestore');
                                      // Get current series to find next episode number
                                      const serDoc = await gDoc(fDoc(db, 'creatorSeries', sub.seriesId));
                                      const serData = serDoc.data();
                                      const nextEp = (serData.totalEpisodes || serData.episodes?.length || 0) + 1;
                                      // Add episode to series
                                      await uDoc(fDoc(db, 'creatorSeries', sub.seriesId), {
                                        episodes: arrayUnion({ episodeNumber: nextEp, title: sub.episodeTitle, body: sub.body, wordCount: sub.wordCount, coverImage: sub.coverImage || null, contributorName: sub.contributorName }),
                                        totalEpisodes: nextEp,
                                      });
                                      // Update submission
                                      await uDoc(fDoc(db, 'seriesSubmissions', sub.id), { status: 'approved', reviewedAt: new Date().toISOString(), publishedEpisodeNumber: nextEp });
                                      setPendingSubmissions(prev => prev.map(p => p.id === sub.id ? { ...p, status: 'approved' } : p));
                                      showToast(`Episode "${sub.episodeTitle}" published as Ep ${nextEp}!`);
                                      setReviewingSubmission(null);
                                    } catch (e) { alert('Approve failed: ' + e.message); }
                                    setApproving(null);
                                  }}
                                  className="flex-1 rounded-lg bg-green-500/20 py-2 text-[10px] font-bold text-green-400 disabled:opacity-50">
                                  {approving === sub.id ? 'Publishing...' : 'Approve & Publish'}
                                </button>
                                <button onClick={async () => {
                                  const feedback = prompt('Feedback for contributor (optional):');
                                  const { updateDoc: uDoc, doc: fDoc } = await import('firebase/firestore');
                                  await uDoc(fDoc(db, 'seriesSubmissions', sub.id), { status: 'rejected', reviewedAt: new Date().toISOString(), ownerFeedback: feedback || '' });
                                  setPendingSubmissions(prev => prev.map(p => p.id === sub.id ? { ...p, status: 'rejected' } : p));
                                  showToast('Submission rejected');
                                  setReviewingSubmission(null);
                                }}
                                  className="flex-1 rounded-lg bg-red-500/20 py-2 text-[10px] font-bold text-red-400">
                                  Reject
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Credits */}
              {(credits > 0 || SERIES.some(s => s.createdBy === user?.email)) && (
                <div className="flex items-center justify-between rounded-xl bg-gold/10 p-4 ring-1 ring-gold/20">
                  <span className="text-sm font-bold text-ink">Total Credits</span>
                  <span className="text-lg font-bold text-gold">{credits}</span>
                </div>
              )}

              {/* Shared with me */}
              {sharedSeries.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 mt-4">Shared with me</h3>
                  {sharedSeries.map((s) => (
                    <div key={s.id} className="rounded-xl bg-bg-surface p-4 ring-1 ring-blue-500/10">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{s.icon}</span>
                            <h3 className="text-sm font-bold text-ink">{s.title}</h3>
                            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[8px] font-bold text-blue-400">PERSONAL</span>
                          </div>
                          <p className="text-[10px] text-ink-muted">by {s.authorName} · {s.totalEpisodes} episodes · {s.ageRange}</p>
                          <div className="mt-2 space-y-0.5">
                            {(s.episodes || []).map((ep, i) => (
                              <p key={i} className="text-[10px] text-ink-dim">Ep {ep.episodeNumber}: {ep.title}</p>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => navigate(`/series/${s.id}`)}
                          className="shrink-0 rounded-lg bg-blue-500/20 px-3 py-1.5 text-[10px] font-bold text-blue-400">
                          Listen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Individual stories */}
              {myStories.map((s) => (
                <div key={s.id} className="rounded-xl bg-bg-surface p-4 ring-1 ring-white/5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-ink">{s.title}</h3>
                      <p className="text-[10px] text-ink-muted mt-0.5">
                        {s.tradition} · {s.theme?.replace('-', ' ')} · {(s.body || '').split(/\s+/).length} words
                      </p>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${statusColor(s.status)}`}>
                      {statusLabel(s.status)}
                    </span>
                  </div>
                  {s.status === 'published' && (
                    <div className="mt-2 flex items-center gap-4 text-[11px] text-ink-muted">
                      <span>👁 {s.views || 0} plays</span>
                      <span>⭐ {s.creditsEarned || 0} credits</span>
                    </div>
                  )}
                  {s.status === 'pending' && (
                    <p className="mt-2 text-[10px] text-gold/70">Under review — we will notify you within 48 hours</p>
                  )}
                  {s.status === 'revision_requested' && (
                    <div className="mt-2 rounded-lg bg-blue-500/5 border border-blue-500/20 p-2.5">
                      <p className="text-[9px] font-bold text-blue-400 uppercase tracking-wider mb-1">Admin feedback</p>
                      <p className="text-[10px] text-blue-300/80">{s.adminFeedback}</p>
                      <p className="mt-1 text-[9px] text-ink-dim">Edit your story and resubmit</p>
                    </div>
                  )}
                  {(s.status === 'pending' || s.status === 'rejected' || s.status === 'revision_requested') && (
                    <button onClick={() => handleDelete(s.id, 'creatorStories')}
                      className="mt-2 text-[10px] text-red-400/60 hover:text-red-400">
                      {t('common.delete')}
                    </button>
                  )}
                </div>
              ))}

              {/* Empty state */}
              {myStories.length === 0 && mySeries.length === 0 && !(user?.email === FOUNDER.email) && (
                <div className="mt-8 text-center">
                  <div className="text-4xl mb-3">✍️</div>
                  <p className="text-sm text-ink-muted">{t('creation.noCreations')}</p>
                  <button onClick={() => { setTab('create'); setCreateMode(null); }}
                    className="mt-3 rounded-2xl bg-gold px-5 py-2.5 text-sm font-bold text-bg-base">
                    Start Creating
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* All Creators link */}
      <div className="mt-6 text-center">
        <button onClick={() => navigate('/creators')}
          className="inline-flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 text-xs font-bold text-gold ring-1 ring-white/10 transition active:scale-95">
          ✍️ All Creators →
        </button>
      </div>

      <div className="h-32" />
    </PageTransition>
  );
}
