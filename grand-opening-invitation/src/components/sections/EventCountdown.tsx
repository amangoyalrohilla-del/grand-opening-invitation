import { CalendarPlus } from 'lucide-react';
import { useInvitation } from '../../config/useInvitation';
import { useCountdown } from '../../hooks/useCountdown';
import { formatTime, pad } from '../../lib/date';
import { downloadCalendar } from '../../lib/calendar';
import { Divider, Sparkle } from '../ui/Ornaments';
import { PremiumButton } from '../ui/PremiumButton';
import { Reveal } from '../ui/Reveal';

export function EventCountdown() {
  const inv = useInvitation();
  const { copy, config, date, start, end } = inv;
  const cd = useCountdown(start, end);
  const units = [
    { label: 'Days', value: cd.days },
    { label: 'Hours', value: cd.hours },
    { label: 'Minutes', value: cd.minutes },
    { label: 'Seconds', value: cd.seconds },
  ];

  return (
    <section id="details" className="section-deep relative overflow-hidden py-24 sm:py-32" aria-labelledby="details-title">
      <div className="marble" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-5 sm:px-8 lg:grid-cols-2 lg:gap-12">
        <Reveal className="text-center lg:text-left">
          <p className="eyebrow">{copy.details.eyebrow}</p>
          <h2 id="details-title" data-section-focus className="mt-6 outline-none">
            <span className="sr-only">
              {date.weekday}, {date.long}
            </span>
            <span className="date-stack" aria-hidden>
              <span className="date-day">{date.dayPadded}</span>
              <span className="date-side">
                <span className="date-month">{date.month}</span>
                <span className="date-year">{date.year}</span>
              </span>
            </span>
          </h2>
          <Divider className="mx-auto mt-8 lg:mx-0" />
          <p className="mt-6 font-display text-sm tracking-[0.34em] text-gold uppercase">{date.weekday}</p>
          <p className="mt-3 font-serif text-3xl text-fg sm:text-4xl">{copy.details.ceremonyLabel}</p>
          <p className="mt-2 text-muted">
            {formatTime(config.event.startTime)} Onwards · {config.event.timezoneLabel}
          </p>
          <p className="mx-auto mt-6 max-w-md font-serif text-lg italic leading-relaxed text-muted lg:mx-0">“{config.event.message}”</p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="glass-panel relative px-6 py-10 text-center sm:px-10 sm:py-12">
            <Sparkle className="absolute left-6 top-6 text-gold/70" size={12} />
            <Sparkle className="absolute bottom-6 right-6 text-gold/70" size={12} />
            {cd.phase === 'upcoming' && (
              <>
                <p className="eyebrow">The Countdown Begins</p>
                <div className="countdown mt-8" role="timer" aria-live="off" aria-label={`${cd.days} days, ${cd.hours} hours, ${cd.minutes} minutes to go`}>
                  {units.map((u, i) => (
                    <div key={u.label} className="countdown-cell">
                      <span key={`${u.label}-${u.value}`} className="countdown-value">
                        {u.label === 'Days' ? u.value : pad(u.value)}
                      </span>
                      <span className="countdown-label">{u.label}</span>
                      {i < units.length - 1 && <span className="countdown-sep" aria-hidden>:</span>}
                    </div>
                  ))}
                </div>
              </>
            )}
            {cd.phase === 'live' && (
              <div className="py-6">
                <p className="eyebrow">Happening Now</p>
                <p className="mt-5 font-display text-2xl tracking-[0.12em] text-gold-light sm:text-3xl">The Celebration Has Begun</p>
                <p className="mt-3 text-muted">We are delighted to welcome you today.</p>
              </div>
            )}
            {cd.phase === 'ended' && (
              <div className="py-6">
                <p className="eyebrow">With Gratitude</p>
                <p className="mt-5 font-display text-2xl tracking-[0.12em] text-gold-light sm:text-3xl">Thank You for Celebrating With Us</p>
              </div>
            )}
            {cd.phase !== 'ended' && (
              <div className="mt-10 flex justify-center">
                <PremiumButton icon={CalendarPlus} iconMotion="none" onClick={() => downloadCalendar(inv)}>
                  Add to Calendar
                </PremiumButton>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
