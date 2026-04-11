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
import BottomNav from './components/BottomNav.jsx';
import PlayerBar from './components/PlayerBar.jsx';
import RadioBar from './components/RadioBar.jsx';
import { FamilyProfileProvider, useFamilyProfile } from './hooks/useFamilyProfile.js';
import { PlayerProvider, usePlayer } from './hooks/usePlayer.jsx';
import { RadioProvider, useRadio } from './hooks/useRadio.jsx';
import { ThemeProvider } from './hooks/useTheme.jsx';
import { WhiteNoiseProvider } from './hooks/useWhiteNoise.jsx';
import { FamilyVoicesProvider } from './hooks/useFamilyVoices.jsx';

function Shell() {
  const location = useLocation();
  const { profile, ready } = useFamilyProfile();
  const { current } = usePlayer();
  const { stationId } = useRadio();

  if (!ready) return null;

  const onboarded = !!profile?.childName;
  const isPlayerRoute = location.pathname.startsWith('/player');
  const isOnboardingRoute = location.pathname === '/onboarding';
  const isRadioRoute = location.pathname.startsWith('/radio');

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
          <Route path="/radio" element={<Radio />} />
          <Route path="/lessons" element={<CulturalLessons />} />
          <Route path="/voices" element={<VoiceStudio />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      {/* Mini player bar — visible everywhere except player + onboarding */}
      {current && !isPlayerRoute && !isOnboardingRoute && <PlayerBar />}

      {/* Radio mini bar */}
      {stationId && !isOnboardingRoute && !isPlayerRoute && !isRadioRoute && !current && <RadioBar />}

      {/* Bottom nav */}
      {!isPlayerRoute && !isOnboardingRoute && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
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
    </ThemeProvider>
  );
}
