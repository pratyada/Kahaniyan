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
import Admin from './pages/Admin.jsx';
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
import { AdminProvider } from './hooks/useAdmin.jsx';

function Shell() {
  const location = useLocation();
  const { user, loading: authLoading, isConfigured } = useAuth();
  const { profile, ready, accountStatus } = useFamilyProfile();
  const { current } = usePlayer();
  const { stationId } = useRadio();

  // Wait for auth + profile to load
  if (authLoading || !ready) return null;

  const needsAuth = isConfigured && !user;
  const onboarded = !!profile?.childName;
  const isBlocked = accountStatus === 'blocked' || accountStatus === 'paused';

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

  // Admin page is a full-width desktop layout — not inside the phone shell
  if (isAdminRoute) {
    return <Admin />;
  }

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
          <Route path="/admin" element={<Admin />} />
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
