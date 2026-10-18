import { CalendarDays, MapPin, Navigation } from 'lucide-react';
import { useInvitation } from '../../config/useInvitation';
import { formatTime } from '../../lib/date';
import { PremiumButton } from '../ui/PremiumButton';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { SmartImage } from '../ui/SmartImage';

export function VenueSection() {
  const { copy, config, images, date, mapsUrl, mapsEmbedUrl, mapsIsArea } = useInvitation();
  const { venue } = config;

  return (
    <section id="venue" className="section-alt relative overflow-hidden py-24 sm:py-32" aria-labelledby="venue-title">
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading id="venue-title" eyebrow={copy.venue.heading} title={copy.venue.tagline} />

        <div className="mt-16 grid items-stretch gap-8 lg:grid-cols-[7fr_5fr]">
          <Reveal x={-30} y={0} className="venue-photo relative">
            <SmartImage image={images.venue} className="absolute inset-0 h-full w-full object-cover" sizes="(min-width: 1024px) 58vw, 100vw" />
            <div className="venue-photo-shade" aria-hidden />
            <div className="venue-card">
              <span className="venue-pin" aria-hidden>
                <MapPin size={20} strokeWidth={1.5} />
              </span>
              <div>
                <p className="font-display text-[0.65rem] uppercase tracking-[0.34em] text-gold">The Address</p>
                <address className="mt-2 not-italic">
                  <span className="block font-serif text-2xl leading-tight text-white">{venue.name}</span>
                  {venue.addressLines.map((l) => (
                    <span key={l} className="block text-white/80">
                      {l}
                    </span>
                  ))}
                </address>
              </div>
            </div>
          </Reveal>

          <Reveal x={30} y={0} delay={0.1} className="flex flex-col gap-6">
            <div className="map-frame">
              {mapsEmbedUrl ? (
                <iframe
                  title={`Map showing ${venue.name}`}
                  src={mapsEmbedUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <a className="map-art" href={mapsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${venue.addressLines.join(', ')} in Google Maps (opens in a new tab)`}>
                  <span className="map-roads" aria-hidden />
                  <span className="map-pulse" aria-hidden />
                  <span className="map-marker" aria-hidden>
                    <MapPin size={26} strokeWidth={1.5} />
                  </span>
                  <span className="map-label">
                    {mapsIsArea ? 'Area' : 'Location'} · {venue.addressLines.join(', ')}
                  </span>
                </a>
              )}
            </div>

            <div className="glass-panel p-6 sm:p-8">
              <dl className="grid gap-5">
                <div className="flex gap-4">
                  <CalendarDays size={20} strokeWidth={1.5} className="mt-1 shrink-0 text-gold" aria-hidden />
                  <div>
                    <dt className="text-[0.68rem] uppercase tracking-[0.3em] text-muted">When</dt>
                    <dd className="mt-1 font-serif text-xl text-fg">
                      {date.weekday}, {date.long}
                      <span className="block text-base text-muted">{formatTime(config.event.startTime)} onwards</span>
                    </dd>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MapPin size={20} strokeWidth={1.5} className="mt-1 shrink-0 text-gold" aria-hidden />
                  <div>
                    <dt className="text-[0.68rem] uppercase tracking-[0.3em] text-muted">Where</dt>
                    <dd className="mt-1 font-serif text-xl text-fg">
                      {venue.name}
                      <span className="block text-base text-muted">{venue.addressLines.join(', ')}</span>
                    </dd>
                  </div>
                </div>
              </dl>
              <div className="mt-8">
                <PremiumButton href={mapsUrl} external icon={Navigation} iconMotion="none" className="w-full sm:w-auto">
                  Open Google Maps
                </PremiumButton>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
