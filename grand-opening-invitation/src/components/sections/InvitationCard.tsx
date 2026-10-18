import { CalendarDays, ChevronDown, Clock, MapPin } from 'lucide-react';
import { useInvitation } from '../../config/useInvitation';
import { formatTime } from '../../lib/date';
import { scrollToSection } from '../../lib/dom';
import { CornerFlourish, Divider, Monogram } from '../ui/Ornaments';
import { PremiumButton } from '../ui/PremiumButton';
import { Reveal } from '../ui/Reveal';

export function InvitationCard() {
  const { copy, config, date } = useInvitation();
  const details = [
    { icon: CalendarDays, label: 'Date', value: `${date.weekday}, ${date.long}` },
    { icon: Clock, label: 'Time', value: `${formatTime(config.event.startTime)} onwards` },
    { icon: MapPin, label: 'Venue', value: [config.venue.name, ...config.venue.addressLines].join(', ') },
  ];

  return (
    <section id="invitation" className="section-dark relative overflow-hidden py-24 sm:py-32" aria-labelledby="invitation-title">
      <div className="spotlight" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal className="text-center">
          <p className="eyebrow">{copy.invitation.eyebrow}</p>
        </Reveal>

        <Reveal y={60} scale={0.97} className="mt-10">
          <article className="paper-card mx-auto max-w-3xl">
            <div className="paper-border" aria-hidden />
            <CornerFlourish className="corner corner-tl" />
            <CornerFlourish className="corner corner-tr" />
            <CornerFlourish className="corner corner-bl" />
            <CornerFlourish className="corner corner-br" />

            <div className="relative px-7 py-14 text-center sm:px-16 sm:py-20">
              <Monogram size={72} className="mx-auto emboss" />
              <p className="mt-8 font-serif text-xl italic text-ink-soft sm:text-2xl">{copy.invitation.opening}</p>
              <p className="mx-auto mt-5 max-w-lg font-serif text-lg leading-relaxed text-ink sm:text-xl">{copy.invitation.lead}</p>
              <h2 id="invitation-title" data-section-focus className="card-headline mt-8 outline-none">
                {copy.invitation.headline}
              </h2>
              <p className="mt-4 font-serif text-lg italic text-ink-soft">of</p>
              <p className="card-business mt-3">{config.business.name}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-ink-soft">{config.business.category}</p>
              <Divider className="mx-auto mt-9" />
              <p className="mx-auto mt-8 max-w-md font-serif text-lg italic leading-relaxed text-ink sm:text-xl">{copy.invitation.closing}</p>

              <dl className="card-details mt-12">
                {details.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="card-detail">
                    <Icon size={18} strokeWidth={1.5} className="mx-auto text-gold-deep" aria-hidden />
                    <dt className="mt-3 text-[0.68rem] uppercase tracking-[0.32em] text-ink-soft">{label}</dt>
                    <dd className="mt-2 font-serif text-lg leading-snug text-ink">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-12">
                <p className="text-[0.68rem] uppercase tracking-[0.32em] text-ink-soft">With warm regards</p>
                <p className="signature mt-2 text-4xl sm:text-5xl">{config.founder.signature}</p>
                <p className="mt-1 font-serif text-base text-ink-soft">
                  {config.founder.name} · {config.founder.role}, {config.business.name}
                </p>
              </div>

              <div className="mt-12 flex justify-center">
                <PremiumButton variant="ink" icon={ChevronDown} iconMotion="bob" onClick={() => scrollToSection('details')}>
                  View Event Details
                </PremiumButton>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
