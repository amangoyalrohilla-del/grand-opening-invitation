import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { eventConfig } from './config/event.config';
import { InvitationProvider, useInvitation } from './config/useInvitation';
import { safeStorage } from './lib/dom';
import { IntroExperience } from './components/intro/IntroExperience';
import { HeroSection } from './components/sections/HeroSection';
import { InvitationCard } from './components/sections/InvitationCard';
import { FounderSection } from './components/sections/FounderSection';
import { ShowcaseGallery } from './components/sections/ShowcaseGallery';
import { EventCountdown } from './components/sections/EventCountdown';
import { CeremonyTimeline } from './components/sections/CeremonyTimeline';
import { ChiefGuest } from './components/sections/ChiefGuest';
import { VenueSection } from './components/sections/VenueSection';
import { InvitationMessage } from './components/sections/InvitationMessage';
import { GrandFinale } from './components/sections/GrandFinale';
import { DemoControls } from './components/demo/DemoControls';
import { Toaster } from './components/ui/Toaster';
import { Monogram } from './components/ui/Ornaments';

const INTRO_KEY = `${eventConfig.slug}:intro-seen`;

/** ?intro=1 always plays the intro, ?intro=0 skips it — handy when demoing. */
function shouldShowIntro() {
  const param = new URLSearchParams(window.location.search).get('intro');
  if (param === '1') return true;
  if (param === '0') return false;
  if (!eventConfig.intro.enabled) return false;
  if (eventConfig.intro.oncePerVisit && safeStorage.get(INTRO_KEY)) return false;
  return true;
}

function Invitation() {
  const { config } = useInvitation();
  const [introActive, setIntroActive] = useState(shouldShowIntro);
  const [introRun, setIntroRun] = useState(0);

  const finish = useCallback(() => {
    safeStorage.set(INTRO_KEY, '1');
    window.scrollTo(0, 0);
    setIntroActive(false);
  }, []);

  const replay = useCallback(() => {
    window.scrollTo(0, 0);
    setIntroRun((n) => n + 1);
    setIntroActive(true);
  }, []);

  return (
    <>
      {!introActive && (
        <a href="#invitation" className="skip-link">
          Skip to invitation details
        </a>
      )}

      <main id="main" inert={introActive}>
        <HeroSection ready={!introActive} />
        <InvitationCard />
        <FounderSection />
        <ShowcaseGallery />
        <EventCountdown />
        <CeremonyTimeline />
        <ChiefGuest />
        <VenueSection />
        <InvitationMessage />
        <GrandFinale onReplay={replay} />
        <footer className="site-footer">
          <Monogram size={36} className="mx-auto" />
          <p className="mt-4 font-display text-xs tracking-[0.3em] text-gold">{config.business.name}</p>
          <p className="mt-2 text-xs text-muted">
            © {new Date().getFullYear()} {config.business.name} · Digital invitation
          </p>
        </footer>
      </main>

      <AnimatePresence>
        {introActive && (
          <motion.div
            key={`intro-${introRun}`}
            className="fixed inset-0 z-[60]"
            initial={{ opacity: introRun === 0 ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          >
            <IntroExperience onFinish={finish} />
          </motion.div>
        )}
      </AnimatePresence>

      {config.demoControls && !introActive && <DemoControls onReplay={replay} />}
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <InvitationProvider>
        <Invitation />
      </InvitationProvider>
    </MotionConfig>
  );
}
