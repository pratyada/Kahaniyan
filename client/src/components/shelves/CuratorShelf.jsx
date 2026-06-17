// Our Creators shelf — shows published user-created series from Firestore

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import ShelfSection from './ShelfSection.jsx';
import ShelfRow from './ShelfRow.jsx';

export default function CuratorShelf() {
  const navigate = useNavigate();
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { db } = await import('../../lib/firebase.js');
        if (!db) { setLoading(false); return; }
        const { collection, getDocs } = await import('firebase/firestore');

        const [serSnap, storySnap] = await Promise.all([
          getDocs(collection(db, 'creatorSeries')),
          getDocs(collection(db, 'creatorStories')),
        ]);

        // Exclude Prat's bulk-imported content — show everyone else
        const isExcluded = (data) => {
          const email = (data.authorEmail || '').toLowerCase();
          const name = (data.authorName || '').toLowerCase();
          return email === 'prateekyadav2010@gmail.com' || (name === 'prateek yadav' && !email);
        };

        const byCreator = {};
        serSnap.forEach(d => {
          const data = d.data();
          if (data.status !== 'published' || isExcluded(data)) return;
          const key = data.authorEmail || data.authorName;
          if (!byCreator[key]) byCreator[key] = { name: data.authorName, slug: data.authorUsername || data.authorName?.toLowerCase().replace(/\s+/g, '-'), series: [], stories: 0, photoURL: null };
          byCreator[key].series.push({ id: d.id, title: data.title, icon: data.icon, episodes: data.episodes?.length || data.totalEpisodes || 0, gradient: data.gradient, coverImage: data.episodes?.[0]?.coverImage });
          if (data.authorUsername) byCreator[key].slug = data.authorUsername;
        });
        storySnap.forEach(d => {
          const data = d.data();
          if (data.status !== 'published' || isExcluded(data)) return;
          const key = data.authorEmail || data.authorName;
          if (!byCreator[key]) byCreator[key] = { name: data.authorName, slug: data.authorUsername || data.authorName?.toLowerCase().replace(/\s+/g, '-'), series: [], stories: 0, photoURL: null };
          byCreator[key].stories++;
          if (data.authorUsername) byCreator[key].slug = data.authorUsername;
        });

        // Fetch photos
        const { doc: fdoc, getDoc: fget, query, where } = await import('firebase/firestore');
        for (const c of Object.values(byCreator)) {
          try {
            const usernameSnap = await fget(fdoc(db, 'usernames', c.slug));
            if (usernameSnap.exists() && usernameSnap.data().uid) {
              const userSnap = await fget(fdoc(db, 'users', usernameSnap.data().uid));
              if (userSnap.exists() && userSnap.data().photoURL) c.photoURL = userSnap.data().photoURL;
            }
          } catch {}
        }

        const filtered = Object.values(byCreator).filter(c => c.series.length > 0 || c.stories > 0);
        console.log('[CuratorShelf] Found creators:', filtered.length, filtered.map(c => c.name));
        setCreators(filtered);
      } catch (e) { console.warn('[CuratorShelf] Error:', e.message); }
      setLoading(false);
    })();
  }, []);

  if (creators.length === 0 && !loading) return null;

  return (
    <ShelfSection title="✍️ Our Creators" subtitle="Stories & series by the community" onSeeAll={() => navigate('/creators')}>
      <ShelfRow>
        {creators.map((creator) => (
          <motion.button
            key={creator.slug}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(`/creator/${creator.slug}`)}
            className="shrink-0 snap-start relative overflow-hidden rounded-2xl ring-1 ring-white/8 text-left"
            style={{ width: 160, minHeight: 220 }}
          >
            {/* Background */}
            <div className="absolute inset-0" style={{ background: creator.series[0]?.gradient || 'linear-gradient(135deg, #1a1a2e, #16213e)' }} />
            {creator.series[0]?.coverImage && (
              <img src={creator.series[0].coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

            {/* Creator avatar */}
            <div className="absolute top-3 left-3">
              {creator.photoURL ? (
                <img src={creator.photoURL} alt="" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full ring-2 ring-gold/30 object-cover" />
              ) : (
                <div className="grid h-8 w-8 place-items-center rounded-full bg-gold/20 ring-2 ring-gold/30 text-[10px] font-bold text-gold">
                  {creator.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                </div>
              )}
            </div>

            {/* Play button */}
            <div className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-gold/20 text-gold backdrop-blur-sm">
              <Play size={10} fill="currentColor" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-xs font-bold text-white leading-tight" style={{ fontFamily: 'Lora, serif' }}>
                {creator.name}
              </p>
              <p className="text-[9px] text-white/60 mt-1">
                {creator.series.length > 0 && `${creator.series.length} series`}
                {creator.series.length > 0 && creator.stories > 0 && ' · '}
                {creator.stories > 0 && `${creator.stories} stories`}
              </p>
              {creator.series[0] && (
                <p className="text-[8px] text-gold/70 mt-1 truncate">
                  {creator.series[0].icon} {creator.series[0].title}
                </p>
              )}
            </div>
          </motion.button>
        ))}
      </ShelfRow>
    </ShelfSection>
  );
}
