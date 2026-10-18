import { CalendarPlus, Navigation, RotateCcw } from 'lucide-react';
import { useRef } from 'react';
import { useInvitation } from '../../config/useInvitation';
import { useParallax } from '../../hooks/useParallax';
import { downloadCalendar } from '../../lib/calendar';
import { ParticleEffects } from '../effects/ParticleEffects';
import { Divider, Monogram } from '../ui/Ornaments';
import { PremiumButton } from '../ui/PremiumButton';
import { Reveal } from '../ui/Reveal';
import { SmartImage } from '../ui/SmartImage';

export function GrandFinale({ onReplay }: { onReplay: () => void }) {
  const inv = useInvitation();
  const { copy, config, images, date, mapsUrl } = inv;
  const bgRef = useRef<HTMLDivElement>(null);
  useParallax(bgRef, 0.18);
  const region = config.venue.addressLines[config.venue.addressLines.length - 1] ?? config.venue.city;

  return (
    <section id="finale" className="finale on-image relative isolate flex min-h-[100svh] items-center overflow-hidden py-28" aria-labelledby="finale-title">
      <div ref={bgRef} className="absolute inset-x-0 -top-[10%] -z-20 h-[120%]">
        <SmartImage image={images.finale} className="h-full w-full object-cover" />
      </div>
      <div className="finale-scrim absolute inset-0 -z-10" aria-hidden />
      <ParticleEffects density={4} className="-z-10" />

      <div className="relative mx-auto w-full max-w-4xl px-6 text-center">
        <Reveal>
          <Monogram size={70} glow className="mx-auto" />
          <h2 id="finale-title" data-section-focus className="finale-title mt-10 outline-none">
            {copy.finale.title}
          </h2>
          <p className="mt-5 font-serif text-xl italic text-white/85 sm:text-2xl">{copy.finale.subtitle}</p>
          <Divider className="mx-auto mt-9" width={200} />
        </Reveal>

        <Reveal delay={0.15} className="mt-9">
          <p className="font-display text-2xl tracking-[0.18em] text-gold-light sm:text-3xl">{config.business.name}</p>
          <p className="mt-4 text-sm uppercase tracking-[0.42em] text-white/80">
            {date.day} {date.month} {date.year}
          </p>
          <p className="mt-2 text-sm uppercase tracking-[0.42em] text-white/80">{region}</p>
        </Reveal>

        <Reveal delay={0.3} className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <PremiumButton size="lg" href={mapsUrl} external icon={Navigation} iconMotion="none">
            Get Directions
          </PremiumButton>
          <PremiumButton size="lg" variant="outline" icon={CalendarPlus} iconMotion="none" onClick={() => downloadCalendar(inv)}>
            Save the Date
          </PremiumButton>
        </Reveal>
        <Reveal delay={0.4} className="mt-8 flex justify-center">
          <PremiumButton variant="ghost" icon={RotateCcw} iconMotion="spin" onClick={onReplay}>
            Replay Opening
          </PremiumButton>
        </Reveal>
      </div>
    </section>
  );
}
