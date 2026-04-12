import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
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
import BottomNav from './components/BottomNav.jsx';
import PlayerBar from './components/PlayerBar.jsx';
import RadioBar from './components/RadioBar.jsx';
import { AuthProvider, useAuth } from './hooks/useAuth.jsx';
import { FamilyProfileProvider, useFamilyProfile } from './hooks/useFamilyProfile.js';
import { PlayerProvider, usePlayer } from './hooks/usePlayer.jsx';
import { RadioProvider, useRadio } from './hooks/useRadio.jsx';
import { ThemeProvider } from './hooks/useTheme.jsx';
import { WhiteNoiseProvider } from './hooks/useWhiteNoise.jsx';
import { FamilyVoicesProvider } from './hooks/useFamilyVoices.jsx';

function Shell() {
  const location = useLocation();
  const { user, loading: authLoading, isConfigured } = useAuth();
  const { profile, ready } = useFamilyProfile();
  const { current } = usePlayer();
  const { stationId } = useRadio();

  // Wait for auth + profile to load
  if (authLoading || !ready) return null;

  // If Firebase is configured and user isn't logged in → Login page
  // If Firebase isn't configured → skip auth (local-only mode)
  const needsAuth = isConfigured && !user;
  const onboarded = !!profile?.childName;
  const isPlayerRoute = location.pathname.startsWith('/player');
  const isOnboardingRoute = location.pathname === '/onboarding';
  const isLoginRoute = location.pathname === '/login';
  const isRadioRoute = location.pathname.startsWith('/radio');

  return (
    <div className="phone-shell">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Auth routes */}
          <Route path="/login" element={
            needsAuth ? <Login /> : <Navigate to="/" replace />
          } />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              needsAuth ? <Navigate to="/login" replace /> :
              onboarded ? <Home /> : <Navigate to="/onboarding" replace />
            }
          />
          <Route path="/onboarding" element={
            needsAuth ? <Navigate to="/login" replace /> : <Onboarding />
          } />
          <Route path="/player" element={<Player />} />
          <Route path="/library" element={<Library />} />
          <Route path="/radio" element={<Radio />} />
          <Route path="/lessons" element={<CulturalLessons />} />
          <Route path="/voices" element={<VoiceStudio />} />
          <Route path="/characters" element={<Characters />} />
          <Route path="/family" element={<EditFamily />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="*" element={<Navigate to={needsAuth ? '/login' : '/'} replace />} />
        </Routes>
      </AnimatePresence>

      {/* Mini player bar */}
      {current && !isPlayerRoute && !isOnboardingRoute && !isLoginRoute && <PlayerBar />}

      {/* Radio mini bar */}
      {stationId && !isOnboardingRoute && !isPlayerRoute && !isRadioRoute && !isLoginRoute && !current && <RadioBar />}

      {/* Bottom nav */}
      {!isPlayerRoute && !isOnboardingRoute && !isLoginRoute && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FamilyProfileProvider>
          <FamilyVoicesProvider>
            <PlayerProvider>
              <RadioProvider>
                <WhiteNoiseProvider>
                  <Shell />
                </WhiteNoiseProvider>
              </RadioProvider>
            </PlayerProvider>
          </FamilyVoicesProvider>
        </FamilyProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
