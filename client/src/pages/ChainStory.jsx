// Chain Story — View collaborative chain, listen to parts, share, close/compile
// Routes: /incubate/chain/:chainId OR /incubate/chain/join/:inviteToken

import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Pause, Share2, Lock, Users, ArrowLeft, CheckCircle } from 'lucide-react';
import PageTransition from '../components/PageTransition.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';

const API = import.meta.env.VITE_API_BASE_URL || '';

export default function ChainStory() {
  const navigate = useNavigate();
  const { chainId, inviteToken } = useParams();
  const { user, loginGoogle } = useAuth();
  const { profile, activeIndex } = useFamilyProfile();

  const [chain, setChain] = useState(null);
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playingPart, setPlayingPart] = useState(null);
  const [playingAll, setPlayingAll] = useState(false);
  const [closing, setClosing] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState(null);
  const audioRef = useRef(null);
  const allQueueRef = useRef([]);

  const kidId = user ? `${user.uid}_${activeIndex || 0}` : null;
  const isOriginator = chain?.originatorParentUid === user?.uid;

  // Load chain data
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const body = inviteToken
          ? { action: 'join', inviteToken }
          : { action: 'get', chainId };
        const res = await fetch(`${API}/api/kid-story-chain`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.error) { setError(data.error); }
        else { setChain(data.chain); setParts(data.parts || []); }
      } catch (e) { setError(e.message); }
      setLoading(false);
    })();
  }, [chainId, inviteToken]);

  // Play a single part
  const playPart = (part) => {
    if (audioRef.current) { audioRef.current.pause(); }
    const audio = new Audio(part.audioUrl);
    audioRef.current = audio;
    audio.onended = () => setPlayingPart(null);
    audio.play();
    setPlayingPart(part.chainPartNumber);
  };

  const stopPlaying = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setPlayingPart(null);
    setPlayingAll(false);
  };

  // Play all parts sequentially
  const playAll = () => {
    if (parts.length === 0) return;
    stopPlaying();
    setPlayingAll(true);
    let idx = 0;
    const playNext = () => {
      if (idx >= parts.length) { setPlayingAll(false); setPlayingPart(null); return; }
      const part = parts[idx];
      setPlayingPart(part.chainPartNumber);
      const audio = new Audio(part.audioUrl);
      audioRef.current = audio;
      audio.onended = () => { idx++; playNext(); };
      audio.play();
    };
    playNext();
  };

  // Claim turn and go to record
  const handleAddPart = async () => {
    if (!user) { loginGoogle(); return; }
    setClaiming(true);
    setClaimError(null);
    try {
      const res = await fetch(`${API}/api/kid-story-chain`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'claim-turn', chainId: chain.id, kidId, parentUid: user.uid }),
      });
      const data = await res.json();
      if (data.claimed) {
        navigate(`/incubate/chain/${chain.id}/record?partNumber=${data.partNumber}&storyId=${data.storyId}&audioKey=${encodeURIComponent(data.audioKey)}&uploadUrl=${encodeURIComponent(data.uploadUrl)}`);
      } else {
        setClaimError(data.reason || 'Could not claim turn');
      }
    } catch (e) { setClaimError(e.message); }
    setClaiming(false);
  };

  // Close chain
  const handleClose = async () => {
    if (!confirm('No more friends can add parts. Are you sure?')) return;
    setClosing(true);
    await fetch(`${API}/api/kid-story-chain`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'close', chainId: chain.id, parentUid: user.uid }),
    });
    setChain(prev => ({ ...prev, status: 'closed' }));
    setClosing(false);
  };

  // Compile
  const handleCompile = async () => {
    setCompiling(true);
    const res = await fetch(`${API}/api/kid-story-chain`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'compile', chainId: chain.id, parentUid: user.uid }),
    });
    const data = await res.json();
    if (data.compiled) {
      setChain(prev => ({ ...prev, status: 'compiled', compiledParts: data.parts }));
    }
    setCompiling(false);
  };

  // Share
  const handleShare = () => {
    const url = `https://mysleepytale.com/incubate/chain/join/${chain.inviteToken}`;
    const text = `Join "${chain.title}" — a chain story on My Sleepy Tale! Add your part.`;
    if (navigator.share) {
      navigator.share({ title: chain.title, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied!');
    }
  };

  // Loading
  if (loading) {
    return (
      <PageTransition className="flex h-screen items-center justify-center bg-bg-base">
        <div className="text-center"><div className="text-4xl animate-pulse">🔗</div><p className="mt-2 text-sm text-ink-muted">Loading chain story...</p></div>
      </PageTransition>
    );
  }

  // Error
  if (error || !chain) {
    return (
      <PageTransition className="flex h-screen flex-col items-center justify-center bg-bg-base px-6 text-center">
        <div className="text-4xl mb-3">😔</div>
        <h1 className="text-xl font-bold text-gold">Story not found</h1>
        <p className="mt-2 text-sm text-ink-muted">{error || 'This chain story may have been removed.'}</p>
        <button onClick={() => navigate('/incubate')} className="mt-4 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-bg-base">Back to My Stories</button>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="page-scroll px-5 pt-10 pb-32 safe-top">
      {/* Back */}
      <button onClick={() => navigate('/incubate')} className="mb-4 flex items-center gap-1 text-xs text-ink-muted">
        <ArrowLeft size={14} /> Back to My Stories
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        {chain.promptImageUrl && (
          <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 mb-4 mx-auto" style={{ maxWidth: 300 }}>
            <img src={chain.promptImageUrl} alt="" className="w-full object-contain" style={{ maxHeight: '30vh' }} />
          </div>
        )}
        <h1 className="text-xl font-bold text-ink" style={{ fontFamily: 'Lora, serif' }}>{chain.title}</h1>
        <p className="text-xs text-ink-muted mt-1">
          Started by {chain.originatorKidName} · {chain.partCount} part{chain.partCount !== 1 ? 's' : ''} · {chain.participantNames?.length || 1} kid{(chain.participantNames?.length || 1) !== 1 ? 's' : ''}
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold ${
            chain.status === 'open' ? 'bg-green-500/20 text-green-400' :
            chain.status === 'closed' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-gold/20 text-gold'
          }`}>
            {chain.status === 'open' ? '🟢 Open — friends can add parts' :
             chain.status === 'closed' ? '🔒 Closed' :
             '✨ Compiled'}
          </span>
        </div>
      </div>

      {/* Play All button */}
      {parts.length > 0 && (
        <button
          onClick={playingAll ? stopPlaying : playAll}
          className="w-full mb-4 rounded-2xl bg-gold py-3.5 text-sm font-bold text-bg-base shadow-glow transition active:scale-95 flex items-center justify-center gap-2"
        >
          {playingAll ? <><Pause size={16} fill="currentColor" /> Stop</> : <><Play size={16} fill="currentColor" /> Listen to Full Story</>}
        </button>
      )}

      {/* Timeline */}
      <div className="space-y-3 mb-6">
        {parts.map((part, i) => (
          <motion.div
            key={part.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-3 rounded-2xl p-4 ring-1 transition ${
              playingPart === part.chainPartNumber ? 'bg-gold/10 ring-gold/30' : 'bg-bg-surface ring-white/5'
            }`}
          >
            {/* Part number */}
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold/20 text-sm font-bold text-gold">
              {part.chainPartNumber}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-ink">{part.kidName}</p>
              <p className="text-[10px] text-ink-muted">{Math.ceil((part.durationSeconds || 0) / 60)} min · Part {part.chainPartNumber}</p>
            </div>

            {/* Play button */}
            <button
              onClick={() => playingPart === part.chainPartNumber ? stopPlaying() : playPart(part)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold text-bg-base transition active:scale-90"
            >
              {playingPart === part.chainPartNumber ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {/* Add part — only if open */}
        {chain.status === 'open' && chain.partCount < chain.maxParts && (
          <button
            onClick={handleAddPart}
            disabled={claiming}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-500/30 to-gold/30 py-4 text-sm font-bold text-ink ring-1 ring-gold/20 transition active:scale-95 disabled:opacity-50"
          >
            {claiming ? '⏳ Claiming your turn...' : '🎤 Add Your Part to This Story'}
          </button>
        )}
        {claimError && <p className="text-xs text-yellow-400 text-center">{claimError}</p>}

        {/* Share */}
        {chain.status === 'open' && (
          <button onClick={handleShare} className="w-full rounded-xl bg-white/5 py-3 text-xs font-bold text-gold ring-1 ring-white/10 transition active:scale-95 flex items-center justify-center gap-2">
            <Share2 size={14} /> Share with a Friend
          </button>
        )}

        {/* Originator controls */}
        {isOriginator && chain.status === 'open' && chain.partCount >= 1 && (
          <button onClick={handleClose} disabled={closing} className="w-full rounded-xl bg-white/5 py-3 text-xs font-bold text-ink-muted ring-1 ring-white/10 transition active:scale-95">
            {closing ? 'Closing...' : '🔒 Close Story (no more parts)'}
          </button>
        )}

        {isOriginator && chain.status === 'closed' && (
          <button onClick={handleCompile} disabled={compiling} className="w-full rounded-2xl bg-gold py-3.5 text-sm font-bold text-bg-base shadow-glow transition active:scale-95">
            {compiling ? '✨ Compiling...' : '✨ Compile Final Story (+15 ⭐)'}
          </button>
        )}

        {chain.status === 'compiled' && (
          <div className="rounded-2xl bg-gold/10 p-4 ring-1 ring-gold/30 text-center">
            <p className="text-sm font-bold text-gold">Story Compiled!</p>
            <p className="text-[10px] text-ink-muted mt-1">{parts.length} parts by {chain.participantNames?.join(', ')}</p>
          </div>
        )}
      </div>

      <div className="h-20" />
    </PageTransition>
  );
}
