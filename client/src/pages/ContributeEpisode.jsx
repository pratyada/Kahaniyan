import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { db, storage } from '../lib/firebase.js';
import { collection, query, where, getDocs, updateDoc, addDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ContributeEpisode() {
  const { token } = useParams();
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [invitation, setInvitation] = useState(null);
  const [invDoc, setInvDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Fetch invitation by token
  useEffect(() => {
    if (!db || !token) return;
    (async () => {
      try {
        const q = query(collection(db, 'seriesInvitations'), where('token', '==', token));
        const snap = await getDocs(q);
        if (snap.empty) { setError('Invitation not found or expired'); setLoading(false); return; }
        const docSnap = snap.docs[0];
        const data = docSnap.data();
        if (data.status === 'revoked') { setError('This invitation has been revoked'); setLoading(false); return; }
        setInvitation(data);
        setInvDoc(docSnap.ref);
      } catch (e) { setError('Failed to load invitation'); }
      setLoading(false);
    })();
  }, [token]);

  // Accept invitation on login
  useEffect(() => {
    if (!user || !invitation || !invDoc) return;
    if (invitation.status === 'pending') {
      updateDoc(invDoc, { status: 'accepted', acceptedAt: new Date().toISOString(), contributorUid: user.uid }).catch(() => {});
    }
  }, [user, invitation, invDoc]);

  // Image handler
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Submit
  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) return alert('Please fill in the episode title and story text');
    if (!user) return alert('Please sign in first');
    setSubmitting(true);

    try {
      let coverImage = null;

      // Upload image if provided
      if (imageFile && storage) {
        const ext = imageFile.name.split('.').pop() || 'jpg';
        const storageRef = ref(storage, `contributor-images/${user.uid}/${Date.now()}.${ext}`);
        await uploadBytes(storageRef, imageFile, { contentType: imageFile.type });
        coverImage = await getDownloadURL(storageRef);
      }

      // Create submission
      await addDoc(collection(db, 'seriesSubmissions'), {
        seriesId: invitation.seriesId,
        seriesTitle: invitation.seriesTitle,
        invitationId: invDoc.id,
        contributorUid: user.uid,
        contributorEmail: user.email,
        contributorName: user.displayName || user.email.split('@')[0],
        episodeTitle: title.trim(),
        body: body.trim(),
        wordCount: body.trim().split(/\s+/).length,
        coverImage,
        status: 'pending',
        ownerUid: invitation.ownerUid,
        ownerFeedback: null,
        submittedAt: new Date().toISOString(),
        reviewedAt: null,
        publishedEpisodeNumber: null,
      });

      setSubmitted(true);
    } catch (e) {
      alert('Submission failed: ' + e.message);
    }
    setSubmitting(false);
  };

  // Loading
  if (loading) return (
    <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center">
      <div className="text-[#6e6a63]">Loading invitation...</div>
    </div>
  );

  // Error
  if (error) return (
    <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-4xl mb-4">😔</div>
        <h2 className="text-[#f5f0e8] text-lg font-bold mb-2">Oops</h2>
        <p className="text-[#6e6a63] text-sm">{error}</p>
        <button onClick={() => navigate('/')} className="mt-6 rounded-full bg-[#f0a500] px-6 py-2 text-sm font-bold text-[#0f0f17]">
          Go Home
        </button>
      </div>
    </div>
  );

  // Submitted success
  if (submitted) return (
    <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-[#f5f0e8] text-xl font-bold mb-2">Episode Submitted!</h2>
        <p className="text-[#6e6a63] text-sm mb-2">
          Your episode <strong className="text-[#f5f0e8]">"{title}"</strong> has been submitted to
          <strong className="text-[#f0a500]"> {invitation.seriesTitle}</strong>.
        </p>
        <p className="text-[#6e6a63] text-sm mb-6">
          {invitation.ownerName || 'The series owner'} will review it and you will be notified when it is published.
        </p>
        <button onClick={() => navigate('/')} className="rounded-full bg-[#f0a500] px-6 py-2 text-sm font-bold text-[#0f0f17]">
          Explore My Sleepy Tale
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f0f17] text-[#f5f0e8]">
      <div className="mx-auto max-w-2xl px-6 py-12">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl">🌙</span>
          <h1 className="text-[#f0a500] text-xl font-bold mt-3">Contribute an Episode</h1>
          <p className="text-[#6e6a63] text-sm mt-1">
            to <strong className="text-[#f5f0e8]">{invitation.seriesTitle}</strong>
          </p>
          <p className="text-[#6e6a63] text-xs mt-1">
            Invited by {invitation.ownerName || invitation.ownerEmail}
          </p>
        </div>

        {/* Login prompt */}
        {!user ? (
          <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-8 text-center">
            <p className="text-[#c8c3ba] text-sm mb-4">Sign in with Google to submit your episode</p>
            <button onClick={login}
              className="rounded-full bg-[#f0a500] px-8 py-3 text-sm font-bold text-[#0f0f17]">
              Sign in with Google
            </button>
            <p className="text-[#6e6a63] text-xs mt-3">
              Use the email address: <strong>{invitation.contributorEmail}</strong>
            </p>
          </div>
        ) : (
          /* Submission form */
          <div className="space-y-6">
            <div className="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6">
              <div className="flex items-center gap-3 mb-1">
                <img src={user.photoURL} alt="" className="h-8 w-8 rounded-full" />
                <div>
                  <div className="text-sm font-bold">{user.displayName}</div>
                  <div className="text-[10px] text-[#6e6a63]">{user.email}</div>
                </div>
              </div>
            </div>

            {/* Episode title */}
            <div>
              <label className="block text-xs text-[#6e6a63] mb-2 uppercase tracking-wider">Episode Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. The Little Firefly's Journey"
                className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-[#f5f0e8] placeholder-[#4a4a5a] ring-1 ring-white/10 focus:ring-[#f0a500] outline-none" />
            </div>

            {/* Story body */}
            <div>
              <label className="block text-xs text-[#6e6a63] mb-2 uppercase tracking-wider">
                Story Text <span className="text-[#4a4a5a]">({body.split(/\s+/).filter(Boolean).length} words)</span>
              </label>
              <textarea value={body} onChange={e => setBody(e.target.value)}
                placeholder="Once upon a time, in a quiet village under the stars..."
                rows={14}
                className="w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-[#f5f0e8] placeholder-[#4a4a5a] ring-1 ring-white/10 focus:ring-[#f0a500] outline-none resize-y leading-relaxed" />
            </div>

            {/* Cover image */}
            <div>
              <label className="block text-xs text-[#6e6a63] mb-2 uppercase tracking-wider">Cover Image (optional)</label>
              <label className="flex items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 p-6 cursor-pointer hover:ring-[#f0a500] transition">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-cover" />
                ) : (
                  <div className="text-center">
                    <div className="text-2xl mb-2">🖼️</div>
                    <div className="text-xs text-[#6e6a63]">Click to upload an image</div>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
              {imagePreview && (
                <button onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="text-xs text-[#f3727f] mt-2">Remove image</button>
              )}
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={submitting || !title.trim() || !body.trim()}
              className="w-full rounded-xl bg-[#f0a500] py-4 text-sm font-bold text-[#0f0f17] disabled:opacity-50 transition">
              {submitting ? 'Submitting...' : 'Submit Episode for Review'}
            </button>

            <p className="text-[#6e6a63] text-xs text-center">
              Your episode will be reviewed by the series owner before publishing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
