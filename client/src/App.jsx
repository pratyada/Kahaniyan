import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Onboarding from './pages/Onboarding.jsx';
import Home from './pages/Home.jsx';
import Player from './pages/Player.jsx';
import Library from './pages/Library.jsx';
import Guides from './pages/Guides.jsx';
import Settings from './pages/Settings.jsx';
import BottomNav from './components/BottomNav.jsx';
import PlayerBar from './components/PlayerBar.jsx';
import { FamilyProfileProvider, useFamilyProfile } from './hooks/useFamilyProfile.js';
import { PlayerProvider, usePlayer } from './hooks/usePlayer.jsx';

function Shell() {
  const location = useLocation();
  const { profile, ready } = useFamilyProfile();
  const { current } = usePlayer();

  if (!ready) return null;

  const onboarded = !!profile?.childName;
  const isPlayerRoute = location.pathname.startsWith('/player');
  const isOnboardingRoute = location.pathname === '/onboarding';

  return (
    <div className="phone-shell">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={onboarded ? <Home /> : <Navigate to="/onboarding" replace />}
          />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/player" element={<Player />} />
          <Route path="/library" element={<Library />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {/* Mini player bar — visible everywhere except player + onboarding */}
      {current && !isPlayerRoute && !isOnboardingRoute && <PlayerBar />}

      {/* Bottom nav — hidden on player + onboarding */}
      {!isPlayerRoute && !isOnboardingRoute && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <FamilyProfileProvider>
      <PlayerProvider>
        <Shell />
      </PlayerProvider>
    </FamilyProfileProvider>
  );
}
