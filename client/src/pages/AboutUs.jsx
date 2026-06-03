// About Us — landing page for new visitors.
// mysleepytale.com/aboutus

import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition.jsx';

const SEO = {
  title: 'About Us — My Sleepy Tale | Bedtime Stories That Teach Roots & Values',
  description: 'My Sleepy Tale is a free bedtime story web space for multicultural families. 146+ stories from 11 cultural traditions — Hindu, Islamic, Catholic, Filipino, Hispanic & more. Personalized with your child\'s name, narrated with warm voices. Built in Toronto for families everywhere.',
  ogImage: 'https://storage.googleapis.com/qissaa-61a78.firebasestorage.app/og/aboutus.png',
  url: 'https://mysleepytale.com/aboutus',
};

const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-40px' }, transition: { duration: 0.5 } };

const STATS = [
  { num: '146+', label: 'Bedtime Stories', icon: '📖' },
  { num: '49', label: 'Story Series', icon: '📚' },
  { num: '11', label: 'Cultural Traditions', icon: '🌍' },
  { num: '3', label: 'Languages', icon: '🗣️' },
];

const BENEFITS = [
  {
    icon: '🪷',
    title: 'Cultural Roots',
    desc: 'Children growing up away from their homeland lose touch with their heritage. Our stories bring traditions alive — Hindu, Islamic, Catholic, Sikh, Buddhist, Jewish, Filipino, Hispanic, and more. Every child deserves to hear stories from their own culture.',
  },
  {
    icon: '💛',
    title: 'Values That Stick',
    desc: 'Every story teaches kindness, courage, gratitude, or empathy. No screen time guilt — just meaningful moments before sleep that shape who your child becomes.',
  },
  {
    icon: '🧒',
    title: 'Learning While Sleeping',
    desc: 'Stories about space, maths, science, history, and nature — woven into bedtime adventures. Your child learns without even knowing it. The best classroom is a cozy bed and a good story.',
  },
  {
    icon: '🎧',
    title: 'Audio Narration',
    desc: 'Professional voice narration for every story. Put your phone down, dim the lights, and let the storyteller take over. Your child drifts off to sleep hearing a warm, gentle voice.',
  },
  {
    icon: '✨',
    title: 'Personalized',
    desc: 'Your child\'s name appears inside the story. Their age, their beliefs, their interests — everything shapes what stories they see. It feels like the story was written just for them.',
  },
  {
    icon: '🌈',
    title: 'Representation',
    desc: 'Every child deserves to see themselves in the stories they hear. We cover 11 cultural traditions because the world is not one story — it is thousands.',
  },
];

const CATEGORIES = [
  { icon: '🚀', label: 'Space Adventures', color: '#4299e1' },
  { icon: '🔢', label: 'Maths & Numbers', color: '#48bb78' },
  { icon: '💪', label: 'Motivation & Courage', color: '#f0a500' },
  { icon: '🪷', label: 'Faith & Beliefs', color: '#9f7aea' },
  { icon: '🌿', label: 'Nature & Animals', color: '#f472b6' },
  { icon: '🏛️', label: 'History & Heroes', color: '#ed8936' },
  { icon: '🔬', label: 'Science & Discovery', color: '#f3727f' },
  { icon: '🗺️', label: 'Adventure & Travel', color: '#63b3ed' },
  { icon: '💛', label: 'Kindness & Sharing', color: '#fbd38d' },
  { icon: '📚', label: 'Multi-Episode Series', color: '#b794f4' },
];

const TESTIMONIALS = [
  {
    name: 'Priya M.',
    location: 'Toronto, Canada',
    text: 'My daughter asks for "her story" every night now. She loves hearing her name in the tales. The Hindu mythology stories are exactly what I was looking for — I could not find anything like this anywhere else.',
    stars: 5,
  },
  {
    name: 'Fatima K.',
    location: 'Mississauga, Canada',
    text: 'As a Muslim mom, finding bedtime stories that reflect our values was so hard. My Sleepy Tale has Islamic stories that teach beautiful lessons. My son\'s favourite is the series about Prophet Ibrahim\'s kindness.',
    stars: 5,
  },
  {
    name: 'Maria S.',
    location: 'Brampton, Canada',
    text: 'The Filipino folklore collection made me cry. My kids are growing up in Canada but now they hear the same stories I heard from my lola. This web space is a gift to immigrant families.',
    stars: 5,
  },
  {
    name: 'David & Rachel L.',
    location: 'Vancouver, Canada',
    text: 'We use the audio narration every single night. The kids fall asleep in minutes. The stories about courage and sharing have actually changed how our 5-year-old behaves with his little sister.',
    stars: 5,
  },
];

const FOOTER_LINKS = [
  {
    title: 'Stories',
    links: [
      { label: 'Browse All Stories', to: '/' },
      { label: 'Hindu Stories', to: '/?culture=hindu' },
      { label: 'Islamic Stories', to: '/?culture=muslim' },
      { label: 'Catholic Stories', to: '/?culture=catholic' },
      { label: 'Filipino Stories', to: '/?culture=filipino' },
      { label: 'Hispanic Stories', to: '/?culture=hispanic' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'Story Series', to: '/?view=series' },
      { label: 'Radio & Sleep Sounds', to: '/radio' },
      { label: 'Search Stories', to: '/search' },
      { label: 'Become a Creator', to: '/creation' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { label: 'Blog', to: '/blog' },
      { label: 'How It Works', to: '/guides' },
      { label: 'Our Roadmap', to: '/roadmap' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/mysleepytale_official' },
      { label: 'Email Us', href: 'mailto:hello@mysleepytale.com' },
    ],
  },
];

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <PageTransition className="page-scroll">
      <Helmet>
        <title>{SEO.title}</title>
        <meta name="description" content={SEO.description} />
        <link rel="canonical" href={SEO.url} />
        <meta property="og:title" content={SEO.title} />
        <meta property="og:description" content={SEO.description} />
        <meta property="og:image" content={SEO.ogImage} />
        <meta property="og:url" content={SEO.url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO.title} />
        <meta name="twitter:description" content={SEO.description} />
        <meta name="twitter:image" content={SEO.ogImage} />
      </Helmet>
      <div className="min-h-screen">

        {/* ═══ HERO ═══ */}
        <section className="relative overflow-hidden px-6 pt-16 pb-20 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-[#f0a500]/10 via-transparent to-transparent pointer-events-none" />
          <motion.div {...fadeUp} className="relative max-w-2xl mx-auto">
            <span className="text-5xl">🌙</span>
            <h1 className="mt-4 text-4xl lg:text-5xl font-bold text-ink leading-tight" style={{ fontFamily: 'Fraunces, serif' }}>
              Bedtime Stories That<br />
              <span className="text-gold">Teach Roots & Values</span>
            </h1>
            <p className="mt-5 text-base text-ink-muted leading-relaxed max-w-lg mx-auto">
              A bedtime story web space for families who want their children to learn about their culture, grow with strong values, and fall asleep to beautiful stories.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate('/')}
                className="rounded-full bg-gold px-8 py-3.5 text-base font-bold text-bg-base shadow-glow transition hover:brightness-110 active:scale-95">
                Explore Stories — Free
              </button>
              <button onClick={() => navigate('/search')}
                className="rounded-full bg-white/5 px-8 py-3.5 text-base font-bold text-ink ring-1 ring-white/10 transition hover:bg-white/10 active:scale-95">
                Search Stories
              </button>
            </div>
            <p className="mt-4 text-xs text-ink-muted">Free to use. No credit card. No downloads.</p>
          </motion.div>
        </section>

        {/* ═══ STATS BAR ═══ */}
        <motion.section {...fadeUp} className="px-6 pb-16">
          <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map(s => (
              <div key={s.label} className="rounded-2xl bg-white/5 ring-1 ring-white/5 p-5 text-center">
                <span className="text-2xl">{s.icon}</span>
                <p className="text-2xl font-bold text-gold mt-2">{s.num}</p>
                <p className="text-[11px] text-ink-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ═══ WHAT WE DO ═══ */}
        <section className="px-6 pb-20">
          <motion.div {...fadeUp} className="text-center mb-12">
            <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
              Why Parents <span className="text-gold">Love</span> My Sleepy Tale
            </h2>
            <p className="text-sm text-ink-muted mt-2 max-w-md mx-auto">
              More than just bedtime stories — a space where children connect with their heritage.
            </p>
          </motion.div>
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b, i) => (
              <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="rounded-2xl bg-white/5 ring-1 ring-white/5 p-6 hover:ring-gold/20 transition">
                <span className="text-3xl">{b.icon}</span>
                <h3 className="text-sm font-bold text-ink mt-3 mb-2">{b.title}</h3>
                <p className="text-xs text-ink-muted leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ STORY CATEGORIES ═══ */}
        <section className="px-6 pb-20">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
              Stories Your Family Will <span className="text-gold">Love</span>
            </h2>
          </motion.div>
          <motion.div {...fadeUp} className="max-w-3xl mx-auto flex flex-wrap justify-center gap-3">
            {CATEGORIES.map(c => (
              <span key={c.label} className="rounded-full px-4 py-2 text-sm font-bold ring-1"
                style={{ background: c.color + '15', color: c.color, borderColor: c.color + '30' }}>
                {c.icon} {c.label}
              </span>
            ))}
          </motion.div>
          <motion.p {...fadeUp} className="text-center text-xs text-ink-muted mt-6">
            New stories added every week
          </motion.p>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section className="px-6 pb-20">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
              How It <span className="text-gold">Works</span>
            </h2>
          </motion.div>
          <div className="max-w-2xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
            {[
              { step: '1', icon: '👤', title: 'Tell Us About Your Child', desc: 'Name, age, and cultural background. Takes 30 seconds.' },
              { step: '2', icon: '📖', title: 'Pick a Story', desc: 'Browse by tradition, theme, or search. Every story is personalized with your child\'s name.' },
              { step: '3', icon: '😴', title: 'Press Play & Sleep', desc: 'Audio narration fills the room. Dim the lights. Your child drifts off learning something beautiful.' },
            ].map((s, i) => (
              <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.12 }}>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-gold/15 text-2xl mb-3">{s.icon}</div>
                <p className="text-[10px] font-bold text-gold mb-1">STEP {s.step}</p>
                <h3 className="text-sm font-bold text-ink mb-1">{s.title}</h3>
                <p className="text-xs text-ink-muted">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section className="px-6 pb-20">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="text-2xl font-bold text-ink" style={{ fontFamily: 'Fraunces, serif' }}>
              What Parents <span className="text-gold">Say</span>
            </h2>
          </motion.div>
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.08 }}
                className="rounded-2xl bg-white/5 ring-1 ring-white/5 p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <span key={j} className="text-gold text-sm">★</span>
                  ))}
                </div>
                <p className="text-xs text-ink-muted leading-relaxed italic mb-4">"{t.text}"</p>
                <div>
                  <p className="text-sm font-bold text-ink">{t.name}</p>
                  <p className="text-[10px] text-ink-muted">{t.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="px-6 pb-20">
          <motion.div {...fadeUp}
            className="max-w-2xl mx-auto rounded-3xl bg-gradient-to-br from-gold/15 via-gold/5 to-transparent ring-1 ring-gold/20 p-10 text-center">
            <span className="text-4xl">🌙</span>
            <h2 className="text-2xl font-bold text-ink mt-4" style={{ fontFamily: 'Fraunces, serif' }}>
              Start Your Child's Journey Tonight
            </h2>
            <p className="text-sm text-ink-muted mt-3 max-w-md mx-auto">
              146+ stories from 11 traditions. Personalized. Narrated. Free.
            </p>
            <button onClick={() => navigate('/')}
              className="mt-6 rounded-full bg-gold px-10 py-4 text-base font-bold text-bg-base shadow-glow transition hover:brightness-110 active:scale-95">
              Explore Stories Now
            </button>
            <p className="text-[10px] text-ink-muted mt-3">No signup required to browse. Free forever for basic access.</p>
          </motion.div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="border-t border-white/5 px-6 pt-12 pb-32">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            {FOOTER_LINKS.map(section => (
              <div key={section.title}>
                <h4 className="text-xs font-bold text-ink mb-3 uppercase tracking-wider">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map(link => (
                    <li key={link.label}>
                      {link.to ? (
                        <a href={link.to} className="text-xs text-ink-muted hover:text-gold transition">{link.label}</a>
                      ) : (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-xs text-ink-muted hover:text-gold transition">{link.label}</a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center border-t border-white/5 pt-8">
            <span className="text-2xl">🌙</span>
            <p className="text-sm font-bold text-ink mt-2">My Sleepy Tale</p>
            <p className="text-[10px] text-ink-muted mt-1">Made with love for families everywhere</p>
            <p className="text-[10px] text-ink-dim mt-1">Toronto, Canada</p>
            <p className="text-[10px] text-ink-dim mt-3">hello@mysleepytale.com</p>
          </div>
        </footer>

      </div>
    </PageTransition>
  );
}
