import { Coffee, DoorOpen, Flame, Mic, Music, Navigation, Scissors, Sparkles, Users, UtensilsCrossed, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { ScheduleIcon } from '../../config/types';
import { useInvitation } from '../../config/useInvitation';
import { formatTime } from '../../lib/date';
import { PremiumButton } from '../ui/PremiumButton';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';

const ICONS: Record<ScheduleIcon, LucideIcon> = {
  welcome: Users,
  ribbon: Scissors,
  tour: DoorOpen,
  refreshments: Coffee,
  ceremony: Sparkles,
  speech: Mic,
  lunch: UtensilsCrossed,
  music: Music,
  pooja: Flame,
};

export function CeremonyTimeline() {
  const { copy, schedule, mapsUrl, mapsIsArea } = useInvitation();
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  // Scroll-spy: the milestone nearest the middle of the screen glows; the gold line fills as you scroll.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-milestone]'));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.milestone));
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    items.forEach((el) => io.observe(el));

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = list.getBoundingClientRect();
      const mid = window.innerHeight * 0.55;
      setProgress(Math.min(1, Math.max(0, (mid - rect.top) / rect.height)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, [schedule.length]);

  return (
    <section id="schedule" className="section-dark relative overflow-hidden py-24 sm:py-32" aria-labelledby="schedule-title">
      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <SectionHeading id="schedule-title" eyebrow={copy.timeline.eyebrow} title={copy.timeline.heading} intro={copy.timeline.intro} />

        <ol ref={listRef} className="timeline mt-16" style={{ '--progress': progress } as CSSProperties}>
          <span className="timeline-line" aria-hidden>
            <span className="timeline-fill" />
          </span>
          {schedule.map((item, i) => {
            const Icon = ICONS[item.icon] ?? Sparkles;
            const side = i % 2 === 0 ? 'left' : 'right';
            return (
              <li key={`${item.time}-${i}`} data-milestone={i} className={`timeline-item is-${side} ${active === i ? 'is-active' : ''}`}>
                <span className="timeline-node" aria-hidden>
                  <Icon size={20} strokeWidth={1.5} />
                </span>
                <Reveal x={side === 'left' ? -36 : 36} y={0} className="timeline-card-wrap">
                  <div className="timeline-card">
                    <p className="timeline-time">
                      <time>{formatTime(item.time)}</time>
                    </p>
                    <h3 className="mt-2 font-serif text-2xl leading-tight text-fg sm:text-[1.7rem]">{item.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted">{item.description}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <Reveal className="mt-16 flex flex-col items-center gap-3">
          <PremiumButton href={mapsUrl} external icon={Navigation} iconMotion="none">
            Get Directions
          </PremiumButton>
          {mapsIsArea && <p className="text-xs uppercase tracking-[0.25em] text-muted">Opens Google Maps for the venue area</p>}
        </Reveal>
      </div>
    </section>
  );
}
