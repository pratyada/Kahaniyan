import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { trackPageView } from './utils/analytics.js';
import Onboarding from './pages/Onboarding.jsx';
import Home from './pages/Home.jsx';
import Player from './pages/Player.jsx';
import Library from './pages/Library.jsx';
import Radio from './pages/Radio.jsx';
import Guides from './pages/Guides.jsx';
import Settings from './pages/Settings.jsx';
import Roadmap from './pages/Roadmap.jsx';
import VoiceStudio from './pages/VoiceStudio.jsx';
import CulturalLessons from './pages/CulturalLessons.jsx';
import Characters from './pages/Characters.jsx';
import EditFamily from './pages/EditFamily.jsx';
import Login from './pages/Login.jsx';
import Admin from './pages/Admin.jsx';
import RecordVoice from './pages/RecordVoice.jsx';
import Invest from './pages/Invest.jsx';
import StonedAge from './pages/StonedAge.jsx';
import Blog from './pages/Blog.jsx';
import Creator from './pages/Creator.jsx';
import CreatorProfile from './pages/CreatorProfile.jsx';
import CuratorPage from './pages/CuratorPage.jsx';
import Curators from './pages/Curators.jsx';
import SeriesDetail from './pages/SeriesDetail.jsx';
import MyTasks from './pages/MyTasks.jsx';
import SearchPage from './pages/Search.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Creatives from './pages/Creatives.jsx';
import Studio from './pages/Studio.jsx';
import BottomNav from './components/BottomNav.jsx';
import BadgeUnlockToast from './components/BadgeUnlockToast.jsx';
import PlayerBar from './components/PlayerBar.jsx';
import RadioBar from './components/RadioBar.jsx';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import { FamilyProfileProvider, useFamilyProfile } from './hooks/useFamilyProfile.js';
import { PlayerProvider, usePlayer } from './hooks/usePlayer.jsx';
import { RadioProvider, useRadio } from './hooks/useRadio.jsx';
import { ThemeProvider } from './hooks/useTheme.jsx';
import { WhiteNoiseProvider } from './hooks/useWhiteNoise.jsx';
import { FamilyVoicesProvider } from './hooks/useFamilyVoices.jsx';
import { AdminProvider } from './hooks/useAdmin.jsx';

function Shell() {
  const location = useLocation();
  const { user, loading: authLoading, isConfigured } = useAuth();
  const { profile, ready, accountStatus } = useFamilyProfile();
  const { current } = usePlayer();
  const { stationId } = useRadio();
  const navigate = useNavigate();

  // ALL hooks must be called before any conditional return
  const [loginTriggered, setLoginTriggered] = useState(false);

  // Expose trigger globally so Home can call it
  useEffect(() => {
    window.__triggerLogin = () => {
      if (isConfigured && !user) setLoginTriggered(true);
    };
    if (user) setLoginTriggered(false);
  }, [isConfigured, user]);

  // Track SPA page views
  useEffect(() => {
    trackPageView(location.pathname, document.title);
  }, [location.pathname]);

  // Wait for auth + profile to load
  if (authLoading || !ready) return null;

  const needsAuth = false;
  const showLoginPopup = isConfigured && !user && loginTriggered;
  const onboarded = !!profile?.childName;
  const isBlocked = !showLoginPopup && (accountStatus === 'blocked' || accountStatus === 'paused');

  // Blocked/paused users see a static screen
  if (!needsAuth && isBlocked && !location.pathname.startsWith('/login')) {
    return (
      <div className="phone-shell">
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <div className="text-5xl mb-4">{accountStatus === 'blocked' ? '🚫' : '⏸️'}</div>
          <h1 className="font-display text-2xl font-bold text-gold">
            Account {accountStatus}
          </h1>
          <p className="mt-3 text-sm text-ink-muted">
            {accountStatus === 'blocked'
              ? 'Your account has been suspended. Please contact support.'
              : 'Your account is paused. Please contact support to resume.'}
          </p>
        </div>
      </div>
    );
  }
  const isPlayerRoute = location.pathname.startsWith('/player');
  const isOnboardingRoute = location.pathname === '/onboarding';
  const isLoginRoute = location.pathname === '/login';
  const isRadioRoute = location.pathname.startsWith('/radio');
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Full-page layouts (no phone shell)
  if (isAdminRoute) return <Admin />;
  // Invest page disabled for now
  // if (location.pathname === '/invest') return <Invest />;
  if (location.pathname === '/stonedage' || window.location.hostname === 'stonedage.mysleepytale.com') {
    return (
      <div className="phone-shell">
        <StonedAge />
        <BottomNav />
      </div>
    );
  }

  // Voice recording link — public, no auth, no shell
  if (location.pathname.startsWith('/record/')) return <RecordVoice />;

  // Full-screen pages — no phone shell, no nav
  if (location.pathname === '/aboutus') {
    return (
      <div style={{ background: 'var(--bg-base)', minHeight: '100dvh', overflowY: 'auto' }}>
        <AboutUs />
      </div>
    );
  }
  if (location.pathname === '/creatives' || location.pathname === '/studio') {
    const StudioOrCreatives = location.pathname === '/studio' ? Studio : Creatives;
    return (
      <div style={{ background: 'var(--bg-base)', minHeight: '100dvh', overflowY: 'auto' }}>
        <StudioOrCreatives />
      </div>
    );
  }

  const showNav = !isPlayerRoute && !isOnboardingRoute && !isLoginRoute;

  return (
    <div className="phone-shell">
      {/* Sidebar nav (desktop) / Bottom nav (mobile) */}
      {showNav && <BottomNav />}

      {/* Main content area */}
      <div className="app-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                // Before sign-in: always show Home (Tonight) so the visitor sees the app
                // After sign-in: if no profile yet, go to onboarding
                !user ? <Home /> :
                onboarded ? <Home /> :
                <Navigate to="/onboarding" replace />
              }
            />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/player" element={<Player />} />
            <Route path="/library" element={<Library />} />
            <Route path="/creation" element={<Library />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/creatives" element={<Creatives />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/radio" element={<Radio />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/lessons" element={<CulturalLessons />} />
            <Route path="/voices" element={<VoiceStudio />} />
            <Route path="/characters" element={<Characters />} />
            <Route path="/family" element={<EditFamily />} />
            <Route path="/guides" element={<Guides />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/collection/:collectionId" element={<Home />} />
            <Route path="/series/:seriesId" element={<SeriesDetail />} />
            <Route path="/creator" element={<Navigate to="/creation" replace />} />
            <Route path="/creators" element={<Curators />} />
            <Route path="/creator/:slug" element={<CuratorPage />} />
            <Route path="/my-tasks" element={<MyTasks />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>

        {/* Mini player bar */}
        {current && !isPlayerRoute && !isOnboardingRoute && !isLoginRoute && <PlayerBar />}

        {/* Radio mini bar */}
        {stationId && !isOnboardingRoute && !isPlayerRoute && !isRadioRoute && !isLoginRoute && !current && <RadioBar />}

        {/* Badge unlock toast */}
        <BadgeUnlockToast />

        {/* Login popup — appears after 5 seconds if user isn't signed in */}
        <AnimatePresence>
          {showLoginPopup && !isLoginRoute && (
            <LoginPopup onLogin={() => navigate('/login')} onSkip={() => setLoginTriggered(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LoginPopup({ onLogin, onSkip }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-sm rounded-3xl bg-bg-elevated p-6 shadow-lift ring-1 ring-white/10"
      >
        <div className="mb-5 text-center">
          <div className="mb-3 text-5xl">🌙</div>
          <h2 className="font-display text-2xl font-bold text-gold">Sign in to continue</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Create an account or sign in to start your child's bedtime journey.
          </p>
        </div>
        <button
          onClick={onLogin}
          className="btn-primary w-full py-4 text-base"
        >
          Sign in / Sign up
        </button>
        <button
          onClick={onSkip}
          className="mt-3 w-full text-center text-sm text-ink-muted"
        >
          Skip — explore first
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FamilyProfileProvider>
          <AdminProvider>
            <FamilyVoicesProvider>
              <PlayerProvider>
                <RadioProvider>
                  <WhiteNoiseProvider>
                    <Shell />
                  </WhiteNoiseProvider>
                </RadioProvider>
              </PlayerProvider>
            </FamilyVoicesProvider>
          </AdminProvider>
        </FamilyProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
