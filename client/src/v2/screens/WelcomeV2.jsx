// V2 onboarding — captures child name/age/belief after sign-in so the app is
// personalized (not "little one"). Reached via a redirect for signed-in users
// without a childName.
import { useNavigate } from 'react-router-dom';
import { useFamilyProfile } from '../../hooks/useFamilyProfile.js';
import ChildSetup from './ChildSetup.jsx';

export default function WelcomeV2() {
  const navigate = useNavigate();
  const { profile, save } = useFamilyProfile();
  return (
    <div className="px-5 lg:px-8 pt-10 pb-28">
      <div className="text-4xl">🌙</div>
      <h1 className="font-display text-[26px] lg:text-3xl mt-3 text-[#F7F1E8]">Welcome to My Sleepy Tale</h1>
      <p className="text-[13px] text-[#B8AAC8] mt-1 mb-7">Two quick things so every story feels made for your child.</p>
      <ChildSetup initial={profile} cta="Start listening ✨" onSave={(p) => { save(p); navigate('/'); }} />
      <button onClick={() => navigate('/')} className="mt-4 text-xs font-bold text-[#7A6B8A]">Skip for now</button>
    </div>
  );
}
