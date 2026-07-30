// Series detail page — shows all episodes with progress.

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, CheckCircle, Mic } from 'lucide-react';
import { hasVoicePrompts } from '../data/voicePrompts.js';
import PageTransition from '../components/PageTransition.jsx';
import { useLocalizedSeries } from '../hooks/useLocalizedData.js';
import { useSeriesProgress } from '../hooks/useSeriesProgress.js';
import { usePlayer } from '../hooks/usePlayer.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { fillTokens } from '../utils/storyHelpers.js';
import { getPlayCount, getRating, formatCount } from '../utils/socialProof.js';

export default function SeriesDetail() {
  const { t } = useTranslation();
  const SERIES = useLocalizedSeries();
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const { load } = usePlayer();
  const { user, loginGoogle } = useAuth();
  const { profile } = useFamilyProfile();
  const { getSeriesProgress, isEpisodeComplete } = useSeriesProgress();
  const [galleryImages, setGalleryImages] = useState({});
  const [creatorPhoto, setCreatorPhoto] = useState(null);
  // Use localStorage cache for instant display, then refresh from Firestore
  const [coverImages, setCoverImages] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mst:cache:wisdomImages')) || {}; } catch { return {}; }
  });
  const [audioUrls, setAudioUrls] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mst:cache:wisdomAudio')) || {}; } catch { return {}; }
  });

  // Load gallery + refresh cover/audio from Firestore
  useEffect(() => {
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const { doc, getDoc } = await import('firebase/firestore');
        const [galSnap, imgSnap, audioSnap] = await Promise.all([
          getDoc(doc(db, 'config', 'wisdomGallery')),
          getDoc(doc(db, 'config', 'wisdomImages')),
          getDoc(doc(db, 'config', 'wisdomAudio')),
        ]);
        if (galSnap.exists()) setGalleryImages(galSnap.data());
        if (imgSnap.exists()) setCoverImages(imgSnap.data());
        if (audioSnap.exists()) setAudioUrls(audioSnap.data());
      } catch {}
    })();
  }, []);

  // Fetch creator photo
  useEffect(() => {
    const s = SERIES.find(s => s.id === seriesId);
    if (!s?.createdBy) return;
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const snap = await getDocs(query(collection(db, 'users'), where('email', '==', s.createdBy)));
        snap.forEach(d => { if (d.data().photoURL) setCreatorPhoto(d.data().photoURL); });
      } catch {}
    })();
  }, [seriesId]);

  // Firestore fallback for creator/personal series
  const [firestoreSeries, setFirestoreSeries] = useState(null);
  const [fsLoading, setFsLoading] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(null); // { title, authorName } if login required

  const staticSeries = SERIES.find((s) => s.id === seriesId);

  useEffect(() => {
    if (staticSeries || firestoreSeries) return;
    setFsLoading(true);
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        const { doc, getDoc } = await import('firebase/firestore');
        if (!db) { setFsLoading(false); return; }
        const snap = await getDoc(doc(db, 'creatorSeries', seriesId));
        if (snap.exists()) {
          const data = snap.data();
          const userEmail = user?.email?.toLowerCase();
          const isOwner = data.authorUid === user?.uid;
          const isShared = (data.sharedWith || []).includes(userEmail);
          const isPublic = data.visibility !== 'personal';
          if (isOwner || isShared || isPublic) {
            setNeedsLogin(null);
            // Map to series format the component expects
            setFirestoreSeries({
              id: snap.id,
              title: data.title,
              icon: data.icon || '📚',
              description: data.description || '',
              ageRange: data.ageRange || '3-8',
              totalEpisodes: data.totalEpisodes || data.episodes?.length || 0,
              gradient: 'from-[#1a1040] to-[#0a0a0f]',
              createdBy: data.authorEmail,
              authorUid: data.authorUid,
              authorName: data.authorName,
              visibility: data.visibility || 'public',
              sharedWith: data.sharedWith || [],
              episodes: (data.episodes || []).map((ep, i) => ({
                id: `${snap.id}_ep${ep.episodeNumber || i + 1}`,
                episodeNumber: ep.episodeNumber || i + 1,
                title: ep.title,
                body: ep.body,
                subtitle: ep.title,
                tradition: data.tradition || 'universal',
                theme: 'courage',
                durationMinutes: Math.ceil((ep.wordCount || ep.body?.split(/\s+/).length || 200) / 150),
                source: `${data.title} · Episode ${ep.episodeNumber || i + 1}`,
                coverImage: ep.coverImage,
                gallery: ep.gallery || [],
                contributorName: ep.contributorName,
              })),
            });
          } else if (data.visibility === 'personal' && !user) {
            // Personal series but user not logged in — prompt login
            setNeedsLogin({ title: data.title, authorName: data.authorName, icon: data.icon });
          }
        }
      } catch {}
      setFsLoading(false);
    })();
  }, [seriesId, staticSeries, user]);

  // Owner edit state
  const [editMode, setEditMode] = useState(false);
  const [uploadingEp, setUploadingEp] = useState(null);
  const [editingEpIndex, setEditingEpIndex] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [savingText, setSavingText] = useState(false);
  const [generatingAudio, setGeneratingAudio] = useState(null);

  // Contributor state
  const [showContributeForm, setShowContributeForm] = useState(false);
  const [contributeTitle, setContributeTitle] = useState('');
  const [contributeBody, setContributeBody] = useState('');
  const [contributeImages, setContributeImages] = useState([]); // { file, preview }
  const [submittingContribution, setSubmittingContribution] = useState(false);
  const [contributionSubmitted, setContributionSubmitted] = useState(false);

  // Pending submissions (for owner)
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [editingSubmission, setEditingSubmission] = useState(null);
  const [subEditTitle, setSubEditTitle] = useState('');
  const [subEditBody, setSubEditBody] = useState('');

  const [managingPhotosEp, setManagingPhotosEp] = useState(null);

  const isOwner = firestoreSeries && user?.uid === firestoreSeries?.authorUid;
  const isSharedUser = firestoreSeries && !isOwner && user?.email &&
    (firestoreSeries.sharedWith || []).includes(user.email.toLowerCase());

  const compressImage = (file) => new Promise((resolve) => {
    if (!file.type.startsWith('image/')) return resolve(file);
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1200;
      let { width: w, height: h } = img;
      if (w > MAX || h > MAX) { const s = MAX / Math.max(w, h); w = Math.round(w * s); h = Math.round(h * s); }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      canvas.toBlob(blob => { URL.revokeObjectURL(url); resolve(new File([blob], 'ep.jpg', { type: 'image/jpeg' })); }, 'image/jpeg', 0.8);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });

  const handleEpisodeImageUpload = async (epIndex, files) => {
    if (!files?.length || !isOwner) return;
    setUploadingEp(epIndex);
    try {
      const { storage, db: fireDb } = await import('../lib/firebase.js');
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { doc: fDoc, updateDoc: uDoc, getDoc: gDoc } = await import('firebase/firestore');

      const uploadedUrls = [];
      for (let f = 0; f < files.length; f++) {
        const compressed = await compressImage(files[f]);
        const storageRef = ref(storage, `creator-images/${user.uid}/series_${seriesId}_ep${epIndex}_${Date.now()}_${f}.jpg`);
        await uploadBytes(storageRef, compressed, { contentType: 'image/jpeg' });
        const imageUrl = await getDownloadURL(storageRef);
        uploadedUrls.push(imageUrl);
      }

      // Read current episodes from Firestore
      const serDoc = await gDoc(fDoc(fireDb, 'creatorSeries', seriesId));
      const episodes = serDoc.data().episodes || [];

      // First uploaded image becomes coverImage, all go into gallery array
      const existingGallery = episodes[epIndex]?.gallery || [];
      const newGallery = [...existingGallery, ...uploadedUrls];
      episodes[epIndex] = {
        ...episodes[epIndex],
        coverImage: episodes[epIndex]?.coverImage || uploadedUrls[0],
        gallery: newGallery,
      };
      await uDoc(fDoc(fireDb, 'creatorSeries', seriesId), { episodes });

      // Update local state
      setFirestoreSeries(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          episodes: prev.episodes.map((ep, i) => i === epIndex ? {
            ...ep,
            coverImage: ep.coverImage || uploadedUrls[0],
            gallery: newGallery,
          } : ep),
        };
      });
    } catch (e) {
      console.error('Upload error:', e);
      alert('Upload failed: ' + e.message);
    }
    setUploadingEp(null);
  };

  // Fetch pending submissions for owner
  useEffect(() => {
    if (!isOwner || !firestoreSeries) return;
    (async () => {
      try {
        const { db: fireDb } = await import('../lib/firebase.js');
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const q = query(collection(fireDb, 'seriesSubmissions'), where('seriesId', '==', seriesId));
        const snap = await getDocs(q);
        const subs = [];
        snap.forEach(d => subs.push({ id: d.id, ...d.data() }));
        setPendingSubmissions(subs.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
      } catch {}
    })();
  }, [isOwner, firestoreSeries, seriesId]);

  // Handle contributor image selection
  const handleContributeImages = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setContributeImages(prev => [...prev, { file, preview: ev.target.result }]);
      reader.readAsDataURL(file);
    });
  };

  // Submit contribution (shared user)
  const submitContribution = async () => {
    if (!contributeTitle.trim() || !contributeBody.trim()) return;
    setSubmittingContribution(true);
    try {
      const { db: fireDb, storage } = await import('../lib/firebase.js');
      const { collection, addDoc } = await import('firebase/firestore');
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');

      // Upload and compress images
      const uploadedUrls = [];
      for (const img of contributeImages) {
        const compressed = await compressImage(img.file);
        const storageRef = ref(storage, `contributor-images/${user.uid}/${Date.now()}_${uploadedUrls.length}.jpg`);
        await uploadBytes(storageRef, compressed, { contentType: 'image/jpeg' });
        const url = await getDownloadURL(storageRef);
        uploadedUrls.push(url);
      }

      await addDoc(collection(fireDb, 'seriesSubmissions'), {
        seriesId,
        seriesTitle: firestoreSeries.title,
        invitationId: null,
        contributorUid: user.uid,
        contributorEmail: user.email,
        contributorName: user.displayName || user.email.split('@')[0],
        episodeTitle: contributeTitle.trim(),
        body: contributeBody.trim(),
        wordCount: contributeBody.trim().split(/\s+/).length,
        coverImage: uploadedUrls[0] || null,
        gallery: uploadedUrls,
        status: 'pending',
        ownerUid: firestoreSeries.authorUid,
        ownerFeedback: null,
        submittedAt: new Date().toISOString(),
        reviewedAt: null,
        publishedEpisodeNumber: null,
      });
      setContributionSubmitted(true);
      setShowContributeForm(false);
      setContributeImages([]);

      // Notify owner via email
      fetch('/api/series-notify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'submitted', seriesId, seriesTitle: firestoreSeries.title,
          episodeTitle: contributeTitle.trim(),
          contributorName: user.displayName || user.email.split('@')[0],
          contributorEmail: user.email,
          ownerEmail: firestoreSeries.createdBy,
          ownerName: firestoreSeries.authorName,
        }),
      }).catch(() => {});
    } catch (e) { alert('Submit failed: ' + e.message); }
    setSubmittingContribution(false);
  };

  // Owner approves a submission (with edited text)
  const approveSubmission = async (sub) => {
    setSavingText(true);
    try {
      const { db: fireDb } = await import('../lib/firebase.js');
      const { doc: fDoc, updateDoc: uDoc, getDoc: gDoc } = await import('firebase/firestore');

      const title = subEditTitle.trim() || sub.episodeTitle;
      const body = subEditBody.trim() || sub.body;

      // Get current series for next episode number
      const serDoc = await gDoc(fDoc(fireDb, 'creatorSeries', seriesId));
      const serData = serDoc.data();
      const episodes = serData.episodes || [];
      const nextEp = episodes.length + 1;

      // Add episode — carry over contributor's images
      episodes.push({
        episodeNumber: nextEp,
        title,
        body,
        wordCount: body.split(/\s+/).length,
        coverImage: (sub.gallery || [])[0] || sub.coverImage || null,
        gallery: sub.gallery || [],
        contributorName: sub.contributorName,
      });
      await uDoc(fDoc(fireDb, 'creatorSeries', seriesId), { episodes, totalEpisodes: nextEp });

      // Mark submission approved
      await uDoc(fDoc(fireDb, 'seriesSubmissions', sub.id), {
        status: 'approved',
        reviewedAt: new Date().toISOString(),
        publishedEpisodeNumber: nextEp,
      });

      // Update local state
      setPendingSubmissions(prev => prev.map(p => p.id === sub.id ? { ...p, status: 'approved' } : p));
      setFirestoreSeries(prev => ({
        ...prev,
        totalEpisodes: nextEp,
        episodes: [...prev.episodes, {
          id: `${seriesId}_ep${nextEp}`,
          episodeNumber: nextEp,
          title, body, subtitle: title,
          tradition: 'universal', theme: 'courage',
          durationMinutes: Math.ceil(body.split(/\s+/).length / 150),
          source: `${prev.title} · Episode ${nextEp}`,
          coverImage: null, gallery: [], contributorName: sub.contributorName,
        }],
      }));
      setEditingSubmission(null);

      // Notify all shared users that a new episode was published
      fetch('/api/series-notify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'published', seriesId,
          seriesTitle: firestoreSeries.title,
          episodeTitle: title,
          contributorName: sub.contributorName,
          contributorEmail: sub.contributorEmail,
          ownerEmail: user.email,
          ownerName: user.displayName || user.email.split('@')[0],
          sharedWith: firestoreSeries.sharedWith || [],
        }),
      }).catch(() => {});
    } catch (e) { alert('Approve failed: ' + e.message); }
    setSavingText(false);
  };

  const removeEpisodeImage = async (epIndex, imgIndex) => {
    try {
      const { db: fireDb } = await import('../lib/firebase.js');
      const { doc: fDoc, updateDoc: uDoc, getDoc: gDoc } = await import('firebase/firestore');
      const serDoc = await gDoc(fDoc(fireDb, 'creatorSeries', seriesId));
      const episodes = serDoc.data().episodes || [];
      const ep = episodes[epIndex];
      const newGallery = (ep.gallery || []).filter((_, i) => i !== imgIndex);
      const newCover = newGallery[0] || null;
      episodes[epIndex] = { ...ep, gallery: newGallery, coverImage: newCover };
      await uDoc(fDoc(fireDb, 'creatorSeries', seriesId), { episodes });
      setFirestoreSeries(prev => ({
        ...prev,
        episodes: prev.episodes.map((e, i) => i === epIndex ? { ...e, gallery: newGallery, coverImage: newCover } : e),
      }));
    } catch (e) { alert('Remove failed: ' + e.message); }
  };

  const replaceAllEpisodeImages = async (epIndex, files) => {
    if (!files?.length) return;
    setUploadingEp(epIndex);
    try {
      const { storage, db: fireDb } = await import('../lib/firebase.js');
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { doc: fDoc, updateDoc: uDoc, getDoc: gDoc } = await import('firebase/firestore');
      const uploadedUrls = [];
      for (let f = 0; f < files.length; f++) {
        const compressed = await compressImage(files[f]);
        const storageRef = ref(storage, `creator-images/${user.uid}/series_${seriesId}_ep${epIndex}_${Date.now()}_${f}.jpg`);
        await uploadBytes(storageRef, compressed, { contentType: 'image/jpeg' });
        uploadedUrls.push(await getDownloadURL(storageRef));
      }
      const serDoc = await gDoc(fDoc(fireDb, 'creatorSeries', seriesId));
      const episodes = serDoc.data().episodes || [];
      episodes[epIndex] = { ...episodes[epIndex], gallery: uploadedUrls, coverImage: uploadedUrls[0] };
      await uDoc(fDoc(fireDb, 'creatorSeries', seriesId), { episodes });
      setFirestoreSeries(prev => ({
        ...prev,
        episodes: prev.episodes.map((e, i) => i === epIndex ? { ...e, gallery: uploadedUrls, coverImage: uploadedUrls[0] } : e),
      }));
    } catch (e) { alert('Replace failed: ' + e.message); }
    setUploadingEp(null);
  };

  const startEditingEpisode = (epIndex) => {
    const ep = firestoreSeries.episodes[epIndex];
    setEditingEpIndex(epIndex);
    setEditTitle(ep.title);
    setEditBody(ep.body || '');
  };

  const saveEpisodeText = async () => {
    if (editingEpIndex === null || !isOwner) return;
    setSavingText(true);
    try {
      const { db: fireDb } = await import('../lib/firebase.js');
      const { doc: fDoc, updateDoc: uDoc, getDoc: gDoc } = await import('firebase/firestore');
      const serDoc = await gDoc(fDoc(fireDb, 'creatorSeries', seriesId));
      const episodes = serDoc.data().episodes || [];
      episodes[editingEpIndex] = {
        ...episodes[editingEpIndex],
        title: editTitle.trim(),
        body: editBody.trim(),
        wordCount: editBody.trim().split(/\s+/).length,
      };
      await uDoc(fDoc(fireDb, 'creatorSeries', seriesId), { episodes });

      setFirestoreSeries(prev => ({
        ...prev,
        episodes: prev.episodes.map((ep, i) => i === editingEpIndex ? {
          ...ep,
          title: editTitle.trim(),
          body: editBody.trim(),
          subtitle: editTitle.trim(),
        } : ep),
      }));
      setEditingEpIndex(null);
    } catch (e) { alert('Save failed: ' + e.message); }
    setSavingText(false);
  };

  const regenerateAudio = async (epIndex) => {
    const ep = firestoreSeries.episodes[epIndex];
    if (!ep?.body) return alert('No story text to generate audio from');
    setGeneratingAudio(epIndex);
    try {
      const resp = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: ep.body, narrator: 'AI Narrator', speed: 0.9 }),
      });
      if (!resp.ok) { const e = await resp.json(); throw new Error(e.error || 'TTS failed'); }
      const audioBlob = await resp.blob();

      // Upload to Firebase Storage
      const { storage, db: fireDb } = await import('../lib/firebase.js');
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      const { doc: fDoc, updateDoc: uDoc, getDoc: gDoc } = await import('firebase/firestore');

      const storageRef = ref(storage, `creator-audio/${user.uid}/series_${seriesId}_ep${epIndex}_${Date.now()}.opus`);
      await uploadBytes(storageRef, audioBlob, { contentType: 'audio/opus' });
      const audioUrl = await getDownloadURL(storageRef);

      // Save audioUrl to episode in Firestore
      const serDoc = await gDoc(fDoc(fireDb, 'creatorSeries', seriesId));
      const episodes = serDoc.data().episodes || [];
      episodes[epIndex] = { ...episodes[epIndex], audioUrl };
      await uDoc(fDoc(fireDb, 'creatorSeries', seriesId), { episodes });

      setFirestoreSeries(prev => ({
        ...prev,
        episodes: prev.episodes.map((ep, i) => i === epIndex ? { ...ep, audioUrl } : ep),
      }));
      alert('Audio generated!');
    } catch (e) { alert('Audio generation failed: ' + e.message); }
    setGeneratingAudio(null);
  };

  // Merge published episodes from Firestore into static series
  const [publishedEps, setPublishedEps] = useState([]);
  useEffect(() => {
    if (!seriesId) return;
    (async () => {
      try {
        const { db: fireDb } = await import('../lib/firebase.js');
        if (!fireDb) return;
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        // Check both productionStories and publishedContent
        const [prodSnap, pubSnap] = await Promise.all([
          getDocs(query(collection(fireDb, 'productionStories'), where('seriesId', '==', seriesId))),
          getDocs(query(collection(fireDb, 'publishedContent'), where('seriesId', '==', seriesId))),
        ]);
        const allDocs = [...prodSnap.docs, ...pubSnap.docs];
        // Deduplicate by ID (production takes priority)
        const seen = new Set();
        const uniqueDocs = allDocs.filter(d => {
          const id = d.data().id || d.id;
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });
        const eps = uniqueDocs.map(d => {
          const data = d.data();
          return {
            id: data.id, episodeNumber: data.episodeNumber, title: data.title,
            subtitle: data.subtitle, body: data.body, tradition: data.tradition,
            theme: data.theme, durationMinutes: data.durationMinutes,
            source: data.source, coverImage: data.coverImage,
            gallery: (data.images || []).slice(1),
            multilingual: data.multilingual || false,
            enableTranslation: data.enableTranslation || false,
          };
        });
        setPublishedEps(eps);
      } catch {}
    })();
  }, [seriesId]);

  const baseSeries = staticSeries || firestoreSeries;
  const series = baseSeries ? {
    ...baseSeries,
    episodes: [
      ...(baseSeries.episodes || []),
      ...publishedEps.filter(pe => !(baseSeries.episodes || []).some(e => e.id === pe.id)),
    ],
    totalEpisodes: (baseSeries.episodes?.length || 0) + publishedEps.filter(pe => !(baseSeries.episodes || []).some(e => e.id === pe.id)).length,
  } : null;

  if (!series && fsLoading) {
    return (
      <PageTransition className="page-scroll px-5 pt-10 safe-top">
        <div className="mt-20 text-center"><p className="text-ink-muted">Loading...</p></div>
      </PageTransition>
    );
  }

  if (!series && needsLogin) {
    return (
      <PageTransition className="page-scroll px-5 pt-10 safe-top">
        <div className="mt-16 text-center max-w-md mx-auto px-6">
          <span className="text-5xl">{needsLogin.icon || '🔒'}</span>
          <h2 className="text-xl font-bold text-ink mt-4" style={{ fontFamily: 'Lora, serif' }}>
            {needsLogin.title}
          </h2>
          <p className="text-sm text-ink-muted mt-3">
            {needsLogin.authorName ? <><strong className="text-ink">{needsLogin.authorName}</strong> shared this series with you.</> : 'This is a private series.'}
          </p>
          <p className="text-sm text-ink-muted mt-2">
            Sign in to listen to the episodes and contribute your own.
          </p>
          <button onClick={() => loginGoogle()}
            className="mt-6 rounded-full bg-gold px-8 py-3 text-sm font-bold text-bg-base shadow-glow transition active:scale-95">
            Sign in with Google
          </button>
          <button onClick={() => navigate('/')}
            className="mt-3 block mx-auto text-xs text-ink-dim hover:text-ink-muted transition">
            Go Home
          </button>
        </div>
      </PageTransition>
    );
  }

  if (!series) {
    return (
      <PageTransition className="page-scroll px-5 pt-10 safe-top">
        <div className="mt-20 text-center">
          <p className="text-ink-muted">Series not found</p>
          <button onClick={() => navigate('/')} className="mt-4 rounded-xl bg-gold px-4 py-2 text-sm font-bold text-bg-base">Go Home</button>
        </div>
      </PageTransition>
    );
  }

  const sp = getSeriesProgress(series.id);
  const completedCount = sp.completed.length;

  const playEpisode = async (episode) => {
    let epBody = episode.body || '';
    // If no body (published content might still be loading), fetch from Firestore
    if (!epBody && episode.id) {
      try {
        const { db: fireDb } = await import('../lib/firebase.js');
        if (fireDb) {
          const { doc: fdoc, getDoc: fget } = await import('firebase/firestore');
          const snap = await fget(fdoc(fireDb, 'publishedContent', episode.id));
          if (snap.exists()) epBody = snap.data().body || '';
        }
      } catch {}
    }
    const filledText = fillTokens(epBody, user ? profile : null);
    // Get the best image for this episode (uploaded gallery > cover > fallback)
    const epImage = episode.coverImage || (episode.gallery || [])[0] ||
      (galleryImages[episode.id] || [])[0] || coverImages[episode.id] || null;
    load({
      id: episode.id,
      title: episode.title,
      text: filledText,
      wordCount: filledText.split(/\s+/).length,
      estimatedMinutes: episode.durationMinutes,
      value: episode.value || 'courage',
      language: profile?.language || 'English',
      voice: 'AI Narrator',
      tradition: episode.tradition,
      source: episode.source,
      createdAt: new Date().toISOString(),
      isWisdom: true,
      seriesId: series.id,
      episodeId: episode.id,
      audioUrl: audioUrls[episode.id] || episode.audioUrl,
      coverImage: epImage,
      gallery: episode.gallery || galleryImages[episode.id] || [],
      multilingual: episode.multilingual || false,
      enableTranslation: episode.enableTranslation || false,
    });
    navigate(`/player?storyId=${episode.id}`);
  };

  // Find next episode to play
  const nextEpisode = series.episodes.find((ep) => !isEpisodeComplete(series.id, ep.id));

  // Collect all images — uploaded gallery first, then AI covers as fallback
  const allPhotos = series.episodes.flatMap(ep => {
    const gallery = galleryImages[ep.id] || [];
    const fsGallery = ep.gallery || [];
    const cover = coverImages[ep.id] || ep.coverImage;
    // Gallery (uploaded) takes priority, then Firestore gallery, then cover
    return gallery.length > 0 ? gallery : fsGallery.length > 0 ? fsGallery : cover ? [cover] : [];
  });

  return (
    <PageTransition className="page-scroll safe-top">
      {/* Hero header with photo collage */}
      <div className="relative overflow-hidden" style={{ minHeight: allPhotos.length > 0 ? 280 : 240 }}>
        {/* Photo collage background */}
        {allPhotos.length > 0 ? (
          <div className="absolute inset-0 grid gap-0.5" style={{
            gridTemplateColumns: allPhotos.length >= 3 ? '1fr 1fr 1fr' : allPhotos.length === 2 ? '1fr 1fr' : '1fr',
            gridTemplateRows: allPhotos.length > 3 ? '1fr 1fr' : '1fr',
          }}>
            {allPhotos.slice(0, 6).map((url, i) => (
              <img key={i} src={url} alt="" className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            ))}
          </div>
        ) : (
          <div className="absolute inset-0" style={{ background: series.gradient }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-bg-base/70 to-bg-base/30" />

        <div className="relative px-5 pt-10 pb-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigate('/?view=series')}
              className="grid h-8 w-8 place-items-center rounded-full bg-gold text-bg-base shadow-glow transition active:scale-95">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const url = `https://mysleepytale.com/api/share?id=${series.id}`;
                const text = `Check out "${series.title}" on My Sleepy Tale — ${series.totalEpisodes} bedtime episodes!`;
                try {
                  if (navigator.share) {
                    await navigator.share({ title: series.title, text, url });
                  } else {
                    await navigator.clipboard.writeText(`${text}\n${url}`);
                    alert('Link copied!');
                  }
                } catch (err) {
                  // User cancelled share — that's fine
                  if (err.name !== 'AbortError') {
                    // Fallback: copy to clipboard
                    try {
                      await navigator.clipboard.writeText(`${text}\n${url}`);
                      alert('Link copied!');
                    } catch {}
                  }
                }
              }}
              className="grid h-8 w-8 place-items-center rounded-full bg-gold text-bg-base shadow-glow transition active:scale-95"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{series.icon}</span>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold/70">{t('home.series')} · {series.totalEpisodes} {t('home.episodes')}</p>
              <h1 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>
                {series.title}
              </h1>
            </div>
          </div>

          <p className="text-xs text-ink-muted leading-relaxed mb-3">{series.description}</p>

          {/* Creator badge */}
          {series.creatorName && (
            <button
              onClick={() => navigate(`/creator/${series.creatorUsername || encodeURIComponent(series.creatorName.toLowerCase().replace(/\s+/g, '-'))}`)}
              className="mb-3 flex items-center gap-2 rounded-full bg-black/30 pl-1 pr-3 py-1 backdrop-blur-sm ring-1 ring-white/10 transition active:scale-95"
            >
              {creatorPhoto ? (
                <img src={creatorPhoto} alt="" referrerPolicy="no-referrer" className="h-6 w-6 rounded-full object-cover" />
              ) : (
                <div className="grid h-6 w-6 place-items-center rounded-full bg-gold/20 text-[8px] font-bold text-gold">
                  {series.creatorName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                </div>
              )}
              <span className="text-[10px] text-white/70">by <span className="font-bold text-gold/90">{series.creatorName}</span></span>
            </button>
          )}

          {/* Owner edit toggle */}
          {isOwner && (
            <button onClick={() => setEditMode(!editMode)}
              className="mb-3 rounded-full bg-gold/20 px-4 py-1.5 text-[10px] font-bold text-gold ring-1 ring-gold/30">
              {editMode ? 'Done editing' : '✏️ Edit series'}
            </button>
          )}

          {/* Progress */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5 flex-1">
              {series.episodes.map((_, i) => (
                <div key={i} className={`h-2 flex-1 rounded-full ${i < completedCount ? 'bg-gold' : 'bg-white/15'}`} />
              ))}
            </div>
            <span className="text-xs font-bold text-white/50">
              {completedCount}/{series.totalEpisodes} done
            </span>
          </div>
        </div>
      </div>

      {/* Continue button */}
      {nextEpisode && (
        <div className="px-5 -mt-2 mb-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => playEpisode(nextEpisode)}
            className="w-full flex items-center gap-3 rounded-2xl bg-gold py-4 px-5 shadow-glow"
          >
            <Play size={20} fill="#0a0a0f" className="text-bg-base" />
            <div className="text-left flex-1">
              <p className="text-sm font-bold text-bg-base">
                {completedCount === 0 ? t('player.play') : t('home.continueListening')}
              </p>
              <p className="text-[10px] text-bg-base/70">
                Episode {nextEpisode.episodeNumber}: {nextEpisode.title}
              </p>
            </div>
          </motion.button>
        </div>
      )}

      {/* Episode list — card grid matching home page tile size */}
      <div className="px-5 grid grid-cols-2 md:grid-cols-3 gap-3">
        {series.episodes.map((ep, i) => {
          const done = isEpisodeComplete(series.id, ep.id);
          const isNext = nextEpisode?.id === ep.id;
          const plays = getPlayCount(ep.id);
          const rating = getRating(ep.id);
          const wordCount = (ep.body || '').split(/\s+/).filter(Boolean).length;
          const realDuration = Math.max(1, Math.round(wordCount / 150));

          return (
            <motion.button
              key={ep.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => playEpisode(ep)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`w-full overflow-hidden rounded-2xl text-left transition relative ${
                isNext ? 'ring-2 ring-gold/50' : 'ring-1 ring-white/5'
              }`}
              style={{ aspectRatio: '3/4', maxHeight: 280 }}
            >
              {/* Full card background — image or gradient */}
              {(() => {
                const epImg = (galleryImages[ep.id] || [])[0] || coverImages[ep.id] || ep.coverImage || (ep.gallery || [])[0];
                return epImg ? (
                  <img src={epImg} alt="" className="absolute inset-0 h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
                ) : (
                  <div className="absolute inset-0" style={{ background: series.gradient }} />
                );
              })()}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

              {/* Episode number badge */}
              <div className={`absolute top-2 left-2 grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold ${
                done ? 'bg-gold text-bg-base' : 'bg-black/50 text-white backdrop-blur-sm'
              }`}>
                {done ? <CheckCircle size={14} /> : ep.episodeNumber}
              </div>

              {/* Share + Copy + Play buttons */}
              <div className="absolute right-2 top-2 flex gap-1.5">
                {/* Copy description */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const desc = `${ep.title}\n${ep.subtitle || ''}\n\n${(ep.body || '').replace(/\{childName\}/g, 'little one').slice(0, 2000)}`;
                    navigator.clipboard.writeText(desc).then(() => {
                      e.currentTarget.textContent = '✓';
                      setTimeout(() => { e.currentTarget.textContent = '📋'; }, 1500);
                    }).catch(() => {});
                  }}
                  className="grid h-7 w-7 place-items-center rounded-full bg-black/40 text-white/70 backdrop-blur-sm transition active:scale-90 text-[10px]"
                  title="Copy description"
                >
                  📋
                </button>
                {/* Share link */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = `https://mysleepytale.com/api/share?id=${ep.id}`;
                    const text = `Listen to "${ep.title}" from ${series.title} on My Sleepy Tale!`;
                    if (navigator.share) {
                      navigator.share({ title: ep.title, text, url }).catch(() => {});
                    } else {
                      navigator.clipboard.writeText(`${text}\n${url}`);
                      alert('Link copied!');
                    }
                  }}
                  className="grid h-7 w-7 place-items-center rounded-full bg-black/40 text-white/70 backdrop-blur-sm transition active:scale-90"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                </button>
                <div className={`grid h-7 w-7 place-items-center rounded-full ${
                  isNext ? 'bg-gold text-bg-base' : 'bg-black/30 text-white/80 backdrop-blur-sm'
                }`}>
                  <Play size={10} fill="currentColor" />
                </div>
              </div>

              {/* Photo count */}
              {(galleryImages[ep.id] || []).length > 0 && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-0.5 backdrop-blur-sm">
                  <span className="text-[8px] font-bold text-white/80">📷 {(galleryImages[ep.id] || []).length}</span>
                </div>
              )}

              {/* Edit mode — overlay with image upload + edit text + audio buttons */}
              {editMode && isOwner && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 gap-2"
                  onClick={e => e.stopPropagation()}>
                  {uploadingEp === i ? (
                    <span className="text-white text-xs font-bold animate-pulse">Uploading...</span>
                  ) : (
                    <>
                      {/* Upload photos */}
                      <label className="rounded-lg bg-blue-500/30 px-4 py-2 text-[10px] font-bold text-blue-300 cursor-pointer">
                        📷 {ep.gallery?.length > 0 ? `Add more photos` : 'Add photos'}
                        <input type="file" accept="image/*" multiple className="hidden"
                          onChange={e => { if (e.target.files?.length) handleEpisodeImageUpload(i, Array.from(e.target.files)); e.target.value = ''; }} />
                      </label>
                      {/* Manage / replace photos */}
                      {(ep.gallery?.length > 0 || ep.coverImage) && (
                        <button onClick={() => setManagingPhotosEp(managingPhotosEp === i ? null : i)}
                          className="rounded-lg bg-red-500/20 px-4 py-2 text-[10px] font-bold text-red-300">
                          🔄 Manage {ep.gallery?.length || 1} photos
                        </button>
                      )}
                      <label className="rounded-lg bg-purple-500/20 px-4 py-2 text-[10px] font-bold text-purple-300 cursor-pointer">
                        Replace all photos
                        <input type="file" accept="image/*" multiple className="hidden"
                          onChange={e => { if (e.target.files?.length) replaceAllEpisodeImages(i, Array.from(e.target.files)); e.target.value = ''; }} />
                      </label>
                      {/* Edit text */}
                      <button onClick={() => startEditingEpisode(i)}
                        className="rounded-lg bg-gold/30 px-4 py-2 text-[10px] font-bold text-gold">
                        ✏️ Edit story text
                      </button>
                      {/* Generate audio */}
                      <button onClick={() => regenerateAudio(i)} disabled={generatingAudio === i}
                        className="rounded-lg bg-green-500/30 px-4 py-2 text-[10px] font-bold text-green-300 disabled:opacity-50">
                        {generatingAudio === i ? '🔄 Generating...' : ep.audioUrl ? '🔊 Regenerate audio' : '🔊 Generate audio'}
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-xs font-bold text-white leading-snug"
                  style={{ fontFamily: 'Lora, serif', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
                  {ep.title}
                </p>
                <p className="text-[9px] text-white/50 mt-0.5 line-clamp-1">{ep.subtitle}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[9px] text-white/50">
                  <span>▶ {formatCount(plays)}</span>
                  <span>⭐ {rating}</span>
                  <span>{realDuration} {t('home.min')}</span>
                  {hasVoicePrompts(ep.id) && (
                    <span className="flex items-center gap-0.5 text-gold/70">
                      <Mic size={8} />
                      {localStorage.getItem(`mst:voiceclips:${ep.id}`) ? 'Recorded' : 'Record voice'}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ═══ PHOTO MANAGER (owner edit mode) ═══ */}
      {editMode && isOwner && managingPhotosEp !== null && (() => {
        const ep = firestoreSeries.episodes[managingPhotosEp];
        if (!ep) return null;
        const photos = ep.gallery || (ep.coverImage ? [ep.coverImage] : []);
        return (
          <div className="px-5 mt-4">
            <div className="rounded-2xl bg-bg-surface ring-1 ring-red-500/20 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-red-400">
                  Manage photos — Episode {ep.episodeNumber}: {ep.title}
                </h3>
                <button onClick={() => setManagingPhotosEp(null)} className="text-[10px] text-ink-dim">Close</button>
              </div>
              {photos.length === 0 ? (
                <p className="text-xs text-ink-dim">No photos yet</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {photos.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img src={url} alt="" className="w-full aspect-square object-cover rounded-lg ring-1 ring-white/10" />
                      {idx === 0 && <span className="absolute top-1 left-1 rounded bg-gold/80 px-1.5 py-0.5 text-[7px] font-bold text-black">COVER</span>}
                      <a href={url} download={`ep${ep.episodeNumber}_photo${idx + 1}.jpg`} target="_blank" rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="absolute bottom-1 left-1 hidden group-hover:grid h-5 w-5 place-items-center rounded-full bg-blue-500 text-[9px] text-white font-bold">
                        ↓
                      </a>
                      <button onClick={() => removeEpisodeImage(managingPhotosEp, idx)}
                        className="absolute top-1 right-1 hidden group-hover:grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[9px] text-white font-bold">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[9px] text-ink-dim">Tap ✕ to remove a photo. First photo becomes the cover image.</p>
            </div>
          </div>
        );
      })()}

      {/* ═══ CONTRIBUTE BUTTON (shared users) ═══ */}
      {isSharedUser && !contributionSubmitted && (
        <div className="px-5 mt-4">
          {!showContributeForm ? (
            <button onClick={() => setShowContributeForm(true)}
              className="w-full rounded-2xl bg-blue-500/20 py-4 text-sm font-bold text-blue-400 ring-1 ring-blue-500/30 transition active:scale-98">
              + Contribute an episode to this series
            </button>
          ) : (
            <div className="rounded-2xl bg-bg-surface ring-1 ring-blue-500/20 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-blue-400">Add your episode</h3>
                <button onClick={() => setShowContributeForm(false)} className="text-[10px] text-ink-dim">Cancel</button>
              </div>
              <input value={contributeTitle} onChange={e => setContributeTitle(e.target.value)}
                placeholder="Episode title — e.g. Our First Snow Day in Denver"
                className="w-full rounded-xl bg-black/30 px-4 py-3 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-blue-500" />
              <div>
                <textarea value={contributeBody} onChange={e => setContributeBody(e.target.value)}
                  placeholder="Write your story here — quick bullet points of memories work too! The series owner can polish the text before publishing."
                  rows={8}
                  className="w-full rounded-xl bg-black/30 px-4 py-3 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-blue-500 resize-y leading-relaxed" />
                <p className="text-[10px] text-ink-dim mt-1">{contributeBody.split(/\s+/).filter(Boolean).length} words</p>
              </div>
              {/* Image upload */}
              <div>
                <label className="text-[10px] text-ink-dim block mb-1">Photos (optional — multiple allowed)</label>
                <label className="flex items-center justify-center rounded-xl bg-black/30 ring-1 ring-white/10 p-4 cursor-pointer hover:ring-blue-500 transition">
                  <div className="text-center">
                    <span className="text-xl">📷</span>
                    <p className="text-[10px] text-ink-muted mt-1">{contributeImages.length > 0 ? `${contributeImages.length} photo(s) selected — tap to add more` : 'Tap to add photos'}</p>
                  </div>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleContributeImages} />
                </label>
                {contributeImages.length > 0 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {contributeImages.map((img, idx) => (
                      <div key={idx} className="relative shrink-0">
                        <img src={img.preview} alt="" className="h-16 w-16 rounded-lg object-cover ring-1 ring-white/10" />
                        <button onClick={() => setContributeImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[8px] text-white">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={submitContribution}
                disabled={submittingContribution || !contributeTitle.trim() || !contributeBody.trim()}
                className="w-full rounded-xl bg-blue-500 py-4 text-sm font-bold text-white disabled:opacity-50">
                {submittingContribution ? (contributeImages.length > 0 ? 'Uploading photos & submitting...' : 'Submitting...') : 'Submit for review'}
              </button>
              <p className="text-[10px] text-ink-dim text-center">
                {firestoreSeries?.authorName || 'The series owner'} will review, edit, and publish your episode.
              </p>
            </div>
          )}
        </div>
      )}
      {isSharedUser && contributionSubmitted && (
        <div className="px-5 mt-4">
          <div className="rounded-2xl bg-blue-500/10 ring-1 ring-blue-500/20 p-5 text-center">
            <span className="text-2xl">🎉</span>
            <p className="text-sm font-bold text-blue-400 mt-2">Episode submitted!</p>
            <p className="text-[11px] text-ink-muted mt-1">{firestoreSeries?.authorName} will review and publish it.</p>
          </div>
        </div>
      )}

      {/* ═══ PENDING SUBMISSIONS (owner sees greyed-out cards) ═══ */}
      {isOwner && pendingSubmissions.filter(s => s.status === 'pending').length > 0 && (
        <div className="px-5 mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gold/70 mb-3">
            Pending contributions ({pendingSubmissions.filter(s => s.status === 'pending').length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {pendingSubmissions.filter(s => s.status === 'pending').map(sub => (
              <div key={sub.id}
                onClick={() => {
                  if (editingSubmission === sub.id) { setEditingSubmission(null); return; }
                  setEditingSubmission(sub.id);
                  setSubEditTitle(sub.episodeTitle);
                  setSubEditBody(sub.body);
                }}
                className="w-full overflow-hidden rounded-2xl text-left transition relative ring-1 ring-gold/30 opacity-60 hover:opacity-100 cursor-pointer"
                style={{ aspectRatio: '3/4', maxHeight: 280 }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-[#1a1040]/50 to-[#1a1040]/30" />
                <div className="absolute top-2 left-2 rounded-full bg-gold/20 px-2 py-0.5 text-[8px] font-bold text-gold">PENDING</div>
                <div className="absolute top-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[8px] text-white/60">by {sub.contributorName}</div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-xs font-bold text-white leading-snug" style={{ fontFamily: 'Lora, serif' }}>
                    {sub.episodeTitle}
                  </p>
                  <p className="text-[9px] text-white/50 mt-0.5">{sub.wordCount} words · {new Date(sub.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ SUBMISSION EDITOR (owner reviews + edits + publishes) ═══ */}
      {isOwner && editingSubmission && (() => {
        const sub = pendingSubmissions.find(s => s.id === editingSubmission);
        if (!sub || sub.status !== 'pending') return null;
        return (
          <div className="px-5 mt-4">
            <div className="rounded-2xl bg-bg-surface ring-1 ring-gold/20 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gold">Review contribution from {sub.contributorName}</h3>
                <button onClick={() => setEditingSubmission(null)} className="text-[10px] text-ink-dim">Close</button>
              </div>

              {/* Submitted images */}
              {(sub.gallery || []).length > 0 && (
                <div>
                  <p className="text-[9px] font-bold text-ink-dim uppercase tracking-wider mb-1">Submitted photos</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {sub.gallery.map((url, idx) => (
                      <div key={idx} className="relative shrink-0 group">
                        <img src={url} alt="" className="h-24 w-24 rounded-lg object-cover ring-1 ring-white/10" />
                        <a href={url} download={`contribution_photo${idx + 1}.jpg`} target="_blank" rel="noreferrer"
                          className="absolute bottom-1 right-1 hidden group-hover:grid h-5 w-5 place-items-center rounded-full bg-blue-500 text-[8px] text-white">↓</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Original text preview */}
              <div className="rounded-lg bg-black/20 p-3 ring-1 ring-white/5">
                <p className="text-[9px] font-bold text-ink-dim uppercase tracking-wider mb-1">Original submission</p>
                <p className="text-[11px] text-ink-muted leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">{sub.body}</p>
              </div>

              {/* Editable fields */}
              <div>
                <label className="text-[10px] text-ink-dim block mb-1">Episode Title (edit as needed)</label>
                <input value={subEditTitle} onChange={e => setSubEditTitle(e.target.value)}
                  className="w-full rounded-xl bg-black/30 px-4 py-3 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-gold" />
              </div>
              <div>
                <label className="text-[10px] text-ink-dim block mb-1">
                  Story Text — edit, polish, expand ({subEditBody.split(/\s+/).filter(Boolean).length} words)
                </label>
                <textarea value={subEditBody} onChange={e => setSubEditBody(e.target.value)}
                  rows={12}
                  className="w-full rounded-xl bg-black/30 px-4 py-3 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-gold resize-y leading-relaxed" />
              </div>

              <div className="flex gap-3">
                <button onClick={() => approveSubmission(sub)}
                  disabled={savingText || !subEditTitle.trim() || !subEditBody.trim()}
                  className="flex-1 rounded-xl bg-gold py-4 text-sm font-bold text-bg-base disabled:opacity-50">
                  {savingText ? 'Publishing...' : 'Publish as Episode'}
                </button>
                <button onClick={async () => {
                  const feedback = prompt('Feedback for contributor (optional):');
                  const { db: fireDb } = await import('../lib/firebase.js');
                  const { doc: fDoc, updateDoc: uDoc } = await import('firebase/firestore');
                  await uDoc(fDoc(fireDb, 'seriesSubmissions', sub.id), { status: 'rejected', reviewedAt: new Date().toISOString(), ownerFeedback: feedback || '' });
                  // Notify contributor via email
                  try { await fetch('/api/contribution-rejected-notify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ episodeTitle: sub.title, seriesTitle: series.title, contributorEmail: sub.contributorEmail, contributorName: sub.contributorName, ownerName: series.authorName || user?.displayName || '', feedback: feedback || '' }) }); } catch {}
                  setPendingSubmissions(prev => prev.map(p => p.id === sub.id ? { ...p, status: 'rejected' } : p));
                  setEditingSubmission(null);
                }}
                  className="rounded-xl bg-red-500/20 px-6 py-4 text-sm font-bold text-red-400 ring-1 ring-red-500/30">
                  Reject
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Episode text editor (edit mode) */}
      {editMode && isOwner && editingEpIndex !== null && (
        <div className="px-5 mt-4">
          <div className="rounded-2xl bg-bg-surface ring-1 ring-gold/20 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gold">
                Editing Episode {firestoreSeries.episodes[editingEpIndex]?.episodeNumber}
              </h3>
              <button onClick={() => setEditingEpIndex(null)} className="text-[10px] text-ink-dim">Cancel</button>
            </div>

            <div>
              <label className="text-[10px] text-ink-dim block mb-1">Episode Title</label>
              <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                className="w-full rounded-xl bg-black/30 px-4 py-3 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-gold" />
            </div>

            <div>
              <label className="text-[10px] text-ink-dim block mb-1">
                Story Text <span className="text-ink-dim">({editBody.split(/\s+/).filter(Boolean).length} words)</span>
              </label>
              <textarea value={editBody} onChange={e => setEditBody(e.target.value)}
                rows={12}
                className="w-full rounded-xl bg-black/30 px-4 py-3 text-sm text-white ring-1 ring-white/10 outline-none focus:ring-gold resize-y leading-relaxed" />
            </div>

            <button onClick={async () => { await saveEpisodeText(); await regenerateAudio(editingEpIndex); }}
              disabled={savingText || generatingAudio !== null || !editTitle.trim() || !editBody.trim()}
              className="w-full rounded-xl bg-gold py-4 text-sm font-bold text-bg-base disabled:opacity-50">
              {savingText ? 'Saving text...' : generatingAudio === editingEpIndex ? 'Generating audio...' : 'Save & Generate Audio'}
            </button>
          </div>
        </div>
      )}

      {/* Completion state */}
      {completedCount === series.totalEpisodes && (
        <div className="px-5 mt-6 mb-4 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <p className="text-sm font-bold text-gold" style={{ fontFamily: 'Lora, serif' }}>
            Series Complete!
          </p>
          <p className="text-[11px] text-ink-muted mt-1">
            You finished all {series.totalEpisodes} episodes. Replay anytime!
          </p>
        </div>
      )}

      {/* Creator attribution moved to header */}

      <div className="h-32" />
    </PageTransition>
  );
}
