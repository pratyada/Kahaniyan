import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition.jsx';
import VersionFooter from '../components/VersionFooter.jsx';
import { useFamilyProfile } from '../hooks/useFamilyProfile.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { LANGUAGES, RELIGIONS } from '../utils/constants.js';
import { COUNTRIES, getStates } from '../data/regions.js';

export default function EditFamily() {
  const navigate = useNavigate();
  const { profile, update } = useFamilyProfile();
  const { user } = useAuth();
  const [draft, setDraft] = useState(profile || {});
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState(null); // null | 'checking' | 'available' | 'taken' | 'invalid' | 'saved'
  const [currentUsername, setCurrentUsername] = useState('');

  // Load current username from Firestore
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const { doc, getDoc } = await import('firebase/firestore');
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (snap.exists() && snap.data().username) {
          setCurrentUsername(snap.data().username);
          setUsername(snap.data().username);
        }
      } catch {}
    })();
  }, [user]);

  // Check username availability (debounced)
  useEffect(() => {
    if (!username || username === currentUsername) { setUsernameStatus(null); return; }
    const clean = username.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    if (clean !== username) { setUsernameStatus('invalid'); return; }
    if (clean.length < 3) { setUsernameStatus('invalid'); return; }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const { db } = await import('../lib/firebase.js');
        if (!db) return;
        const { doc, getDoc } = await import('firebase/firestore');
        const snap = await getDoc(doc(db, 'usernames', clean));
        setUsernameStatus(snap.exists() ? 'taken' : 'available');
      } catch { setUsernameStatus(null); }
    }, 500);
    return () => clearTimeout(timer);
  }, [username, currentUsername]);

  const saveUsername = async () => {
    if (usernameStatus !== 'available' || !user) return;
    const clean = username.toLowerCase().replace(/[^a-z0-9-_]/g, '');
    try {
      const { db } = await import('../lib/firebase.js');
      if (!db) return;
      const { doc, setDoc, deleteDoc, collection, query, where, getDocs, writeBatch } = await import('firebase/firestore');

      // Release old username
      if (currentUsername) {
        await deleteDoc(doc(db, 'usernames', currentUsername));
      }

      // Claim new username
      await setDoc(doc(db, 'usernames', clean), { uid: user.uid, email: user.email });

      // Save to user profile
      await setDoc(doc(db, 'users', user.uid), { username: clean }, { merge: true });

      // Update all creatorStories and creatorSeries with new username
      const [storySnap, seriesSnap] = await Promise.all([
        getDocs(query(collection(db, 'creatorStories'), where('authorUid', '==', user.uid))),
        getDocs(query(collection(db, 'creatorSeries'), where('authorUid', '==', user.uid))),
      ]);
      const batch = writeBatch(db);
      storySnap.forEach(d => batch.update(d.ref, { authorUsername: clean }));
      seriesSnap.forEach(d => batch.update(d.ref, { authorUsername: clean }));
      if (storySnap.size + seriesSnap.size > 0) await batch.commit();

      setCurrentUsername(clean);
      setUsernameStatus('saved');
    } catch (e) { console.error('Username save failed:', e); }
  };

  if (!profile) return null;

  const handleSave = () => {
    // Use update() to merge changes — preserves characters, tier, etc.
    update({
      childName: draft.childName,
      age: Number(draft.age) || profile.age,
      gender: draft.gender,
      motherName: draft.motherName,
      fatherName: draft.fatherName,
      country: draft.country,
      province: draft.province,
      beliefs: draft.beliefs,
      language: draft.language,
    });
    navigate('/settings');
  };

  return (
    <PageTransition className="page-scroll px-5 pt-10 safe-top">
      <header className="mb-6">
        <button
          onClick={() => navigate('/settings')}
          className="mb-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted hover:text-ink"
        >
          ← Back
        </button>
        <p className="ui-label">Customization</p>
        <h1 className="display-title mt-1 text-ink">
          Edit <span className="text-gold">family</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Everything you set during onboarding — change anytime.
        </p>
      </header>

      <div className="space-y-5">
        <Field label="Child's name">
          <input
            type="text"
            value={draft.childName || ''}
            onChange={(e) => setDraft({ ...draft, childName: e.target.value })}
            className="field"
          />
        </Field>

        <Field label="Gender">
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'boy', label: 'Boy', emoji: '👦' },
              { key: 'girl', label: 'Girl', emoji: '👧' },
            ].map((g) => (
              <button
                key={g.key}
                onClick={() => setDraft({ ...draft, gender: g.key })}
                className={`flex items-center gap-2 rounded-2xl px-3 py-3 transition ${
                  draft.gender === g.key
                    ? 'bg-gold text-bg-base shadow-glow'
                    : 'bg-bg-surface text-ink ring-1 ring-white/5'
                }`}
              >
                <span className="text-2xl">{g.emoji}</span>
                <span className="text-sm font-bold">{g.label}</span>
              </button>
            ))}
          </div>
        </Field>

        <Field label="Age">
          <input
            type="number"
            min="1"
            max="14"
            value={draft.age || ''}
            onChange={(e) => setDraft({ ...draft, age: e.target.value })}
            className="field"
          />
        </Field>

        <Field label="Mother's name">
          <input
            type="text"
            value={draft.motherName || ''}
            onChange={(e) => setDraft({ ...draft, motherName: e.target.value })}
            placeholder="optional"
            className="field"
          />
        </Field>

        <Field label="Father's name">
          <input
            type="text"
            value={draft.fatherName || ''}
            onChange={(e) => setDraft({ ...draft, fatherName: e.target.value })}
            placeholder="optional"
            className="field"
          />
        </Field>

        <Field label="Country">
          <select
            value={draft.country || 'CA'}
            onChange={(e) => setDraft({ ...draft, country: e.target.value, province: '' })}
            className="field text-sm"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
            ))}
          </select>
        </Field>

        {getStates(draft.country || 'CA').length > 0 && (
          <Field label="State / Province">
            <select
              value={draft.province || ''}
              onChange={(e) => setDraft({ ...draft, province: e.target.value })}
              className="field text-sm"
            >
              <option value="">Select...</option>
              {getStates(draft.country || 'CA').map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        )}

        <Field label="Belief — pick one or more">
          <p className="mb-2 text-[11px] text-ink-dim">
            Wisdom Stories will come from your selected traditions. Leave empty for stories from
            all traditions.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {RELIGIONS.filter((r) => r.key !== 'all').map((r) => {
              const selected = (draft.beliefs || []).includes(r.key);
              return (
                <button
                  key={r.key}
                  onClick={() => {
                    const cur = draft.beliefs || [];
                    if (r.key === 'universal') {
                      setDraft({ ...draft, beliefs: cur.includes('universal') ? [] : ['universal'] });
                      return;
                    }
                    const without = cur.filter((x) => x !== 'universal');
                    const next = without.includes(r.key)
                      ? without.filter((x) => x !== r.key)
                      : [...without, r.key];
                    setDraft({ ...draft, beliefs: next });
                  }}
                  className={`flex items-center gap-2 rounded-2xl px-3 py-3 text-left transition ${
                    selected
                      ? 'bg-gold text-bg-base shadow-glow'
                      : 'bg-bg-surface text-ink ring-1 ring-white/5'
                  }`}
                >
                  <span className="text-lg">{r.icon}</span>
                  <span className="text-sm font-bold">{r.label}</span>
                  {selected && <span className="ml-auto text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Language">
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.key}
                onClick={() => setDraft({ ...draft, language: l.key })}
                className={`rounded-2xl px-3 py-3 text-left transition ${
                  draft.language === l.key
                    ? 'bg-gold text-bg-base shadow-glow'
                    : 'bg-bg-surface text-ink ring-1 ring-white/5'
                }`}
              >
                <div className="font-display text-lg">{l.label}</div>
              </button>
            ))}
          </div>
        </Field>

        {/* Creator Username */}
        {user && (
          <Field label="Creator Username">
            <p className="text-[10px] text-ink-dim mb-2">
              Your public creator profile: mysleepytale.com/creator/<strong className="text-gold">{username || 'your-name'}</strong>
            </p>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="e.g. deepti-ramaul"
                  className="field pr-8"
                />
                {usernameStatus === 'checking' && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-dim">...</span>}
                {usernameStatus === 'available' && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-400">✓</span>}
                {usernameStatus === 'taken' && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-400">✕</span>}
                {usernameStatus === 'saved' && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-green-400">Saved!</span>}
              </div>
              {usernameStatus === 'available' && (
                <button onClick={saveUsername} className="rounded-xl bg-gold px-4 py-2 text-xs font-bold text-bg-base shrink-0">
                  Save
                </button>
              )}
            </div>
            {usernameStatus === 'taken' && <p className="text-[10px] text-red-400 mt-1">This username is already taken</p>}
            {usernameStatus === 'invalid' && <p className="text-[10px] text-red-400 mt-1">Only lowercase letters, numbers, hyphens. Min 3 characters.</p>}
            {currentUsername && username === currentUsername && <p className="text-[10px] text-ink-dim mt-1">Current username: <span className="text-gold">{currentUsername}</span></p>}
          </Field>
        )}

        <p className="text-[11px] text-ink-muted">
          Tip: To add or remove people in stories, use the <strong className="text-ink">Story cast</strong> page.
        </p>

        <button onClick={handleSave} className="btn-primary w-full py-4">
          Save family
        </button>
      </div>

      <VersionFooter />
    </PageTransition>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="ui-label mb-2 block">{label}</label>
      {children}
    </div>
  );
}
