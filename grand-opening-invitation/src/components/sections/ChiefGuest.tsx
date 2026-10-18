import { ListOrdered } from 'lucide-react';
import { useInvitation } from '../../config/useInvitation';
import { scrollToSection } from '../../lib/dom';
import { Divider, Laurel, Sparkle } from '../ui/Ornaments';
import { PremiumButton } from '../ui/PremiumButton';
import { Reveal } from '../ui/Reveal';
import { SmartImage } from '../ui/SmartImage';

export function ChiefGuest() {
  const { copy, config } = useInvitation();
  const guest = config.chiefGuest;
  if (!guest) return null;

  return (
    <section id="chief-guest" className="section-deep relative overflow-hidden py-24 sm:py-32" aria-labelledby="guest-title">
      <div className="ceremonial-rays" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        <Reveal>
          <p className="eyebrow">{copy.chiefGuest.heading}</p>
        </Reveal>

        <Reveal scale={0.9} y={20} delay={0.1} className="mt-12 flex justify-center">
          <div className="medallion">
            <Laurel className="medallion-laurel" />
            <div className="medallion-ring">
              <div className="medallion-core">
                {guest.photo ? (
                  <SmartImage image={guest.photo} className="h-full w-full rounded-full object-cover" sizes="260px" fallbackLabel={guest.name} />
                ) : (
                  <span className="medallion-initials" aria-hidden>
                    {guest.initials}
                  </span>
                )}
              </div>
            </div>
            <Sparkle className="absolute -top-2 left-1/2 -translate-x-1/2 text-gold-light" size={16} />
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <h2 id="guest-title" data-section-focus className="mt-10 font-display text-3xl tracking-[0.06em] text-fg outline-none sm:text-5xl">
            {guest.name}
          </h2>
          <p className="mt-4 font-display text-sm uppercase tracking-[0.42em] text-gold">{guest.role}</p>
          <Divider className="mx-auto mt-8" />
          <p className="mx-auto mt-8 max-w-xl font-serif text-xl italic leading-relaxed text-muted">{copy.chiefGuest.line}</p>
        </Reveal>

        <Reveal delay={0.3} className="mt-12 flex justify-center">
          <PremiumButton variant="outline" icon={ListOrdered} iconMotion="none" onClick={() => scrollToSection('schedule')}>
            View Ceremony Schedule
          </PremiumButton>
        </Reveal>
      </div>
    </section>
  );
}
