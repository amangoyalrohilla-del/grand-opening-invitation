import { motion } from 'framer-motion';
import { ArrowDown, CalendarPlus } from 'lucide-react';
import { useRef } from 'react';
import { useInvitation } from '../../config/useInvitation';
import { useParallax } from '../../hooks/useParallax';
import { downloadCalendar } from '../../lib/calendar';
import { scrollToSection } from '../../lib/dom';
import { ParticleEffects } from '../effects/ParticleEffects';
import { Divider } from '../ui/Ornaments';
import { PremiumButton } from '../ui/PremiumButton';
import { SmartImage } from '../ui/SmartImage';

const EASE = [0.22, 1, 0.36, 1] as const;

export function HeroSection({ ready }: { ready: boolean }) {
  const inv = useInvitation();
  const { copy, config, images, date } = inv;
  const bgRef = useRef<HTMLDivElement>(null);
  useParallax(bgRef, 0.32);

  const enter = (i: number) => ({
    initial: { opacity: 0, y: 32 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 },
    transition: { duration: 1.15, delay: ready ? 0.2 + i * 0.13 : 0, ease: EASE },
  });

  const region = config.venue.addressLines[config.venue.addressLines.length - 1] ?? config.venue.city;

  return (
    <section id="top" className="hero on-image relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden" aria-labelledby="hero-title">
      <div ref={bgRef} className="hero-bg absolute inset-x-0 -top-[8%] -z-20 h-[116%]">
        <SmartImage image={images.hero} className={`hero-img h-full w-full object-cover ${ready ? 'is-ready' : ''}`} priority />
      </div>
      <div className="hero-scrim absolute inset-0 -z-10" aria-hidden />
      <ParticleEffects density={1.8} className="-z-10" />
      <div className="hero-frame" aria-hidden>
        <span />
        <span />
        <span />
        <span />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-6 pb-28 pt-28 text-center sm:px-10">
        <motion.p {...enter(0)} className="eyebrow eyebrow-on-image">
          {copy.hero.kicker}
        </motion.p>
        <motion.h1 {...enter(1)} id="hero-title" className="hero-title mt-5">
          {config.business.name}
        </motion.h1>
        <motion.p {...enter(2)} className="hero-tagline mt-4">
          {copy.hero.tagline}
        </motion.p>
        <motion.div {...enter(3)} className="mt-7 flex justify-center">
          <Divider width={200} />
        </motion.div>
        <motion.p {...enter(3)} className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          {copy.hero.intro}
        </motion.p>
        <motion.div {...enter(4)} className="hero-meta mt-8">
          <span>
            {date.day} {date.month} {date.year}
          </span>
          <span className="hero-meta-dot" aria-hidden />
          <span>{region}</span>
        </motion.div>
        <motion.div {...enter(5)} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <PremiumButton size="lg" icon={ArrowDown} iconMotion="bob" onClick={() => scrollToSection('invitation')}>
            Explore Invitation
          </PremiumButton>
          <PremiumButton size="lg" variant="outline" icon={CalendarPlus} iconMotion="none" onClick={() => downloadCalendar(inv)}>
            Save the Date
          </PremiumButton>
        </motion.div>
      </div>

      <button type="button" className="scroll-cue" onClick={() => scrollToSection('invitation')} aria-label="Scroll to the invitation">
        <span className="scroll-cue-line" aria-hidden />
        <span className="scroll-cue-text">Scroll</span>
      </button>
    </section>
  );
}
