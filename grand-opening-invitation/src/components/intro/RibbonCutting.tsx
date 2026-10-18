import { ArrowRight, Scissors, SkipForward } from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { useInvitation } from '../../config/useInvitation';
import { prefersReducedMotion } from '../../lib/dom';
import { burstConfetti } from '../effects/confetti';
import { ParticleEffects } from '../effects/ParticleEffects';
import { Monogram, Sparkle } from '../ui/Ornaments';
import { PremiumButton } from '../ui/PremiumButton';

type Stage = 'ready' | 'cutting' | 'cut' | 'celebrate';

interface Props {
  onComplete: () => void;
  onSkip: () => void;
}

export function RibbonCutting({ onComplete, onSkip }: Props) {
  const { copy, config } = useInvitation();
  const [stage, setStage] = useState<Stage>('ready');
  const timers = useRef<number[]>([]);
  const bandRef = useRef<HTMLDivElement>(null);
  const cleanupConfetti = useRef<() => void>(() => {});
  const gesture = useRef<{ x: number; y: number; id: number } | null>(null);
  const done = useRef(false);
  const started = useRef(false);

  useEffect(() => {
    const list = timers.current;
    return () => {
      list.forEach((t) => window.clearTimeout(t));
      cleanupConfetti.current();
    };
  }, []);

  useEffect(() => {
    if (stage === 'celebrate') {
      document.querySelector<HTMLButtonElement>('.celebration-inner button')?.focus({ preventScroll: true });
    }
  }, [stage]);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    onComplete();
  };

  const cut = () => {
    if (started.current) return;
    started.current = true;
    const reduced = prefersReducedMotion();
    setStage('cutting');
    const snipAt = reduced ? 60 : 780;
    timers.current.push(
      window.setTimeout(() => {
        setStage('cut');
        const rect = bandRef.current?.getBoundingClientRect();
        if (rect) cleanupConfetti.current = burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }, snipAt),
      window.setTimeout(() => setStage('celebrate'), snipAt + (reduced ? 200 : 900)),
      window.setTimeout(finish, snipAt + (reduced ? 2600 : 5200)),
    );
  };

  // Swipe across the ribbon (any direction) or tap it.
  const onPointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    gesture.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const g = gesture.current;
    if (!g || g.id !== e.pointerId) return;
    if (Math.abs(e.clientY - g.y) > 34 || Math.abs(e.clientX - g.x) > 70) {
      gesture.current = null;
      cut();
    }
  };

  return (
    <div
      className={`ribbon-scene is-${stage}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ribbon-title"
      onKeyDown={(e) => e.key === 'Escape' && onSkip()}
    >
      <div className="ribbon-spot" aria-hidden />
      <ParticleEffects density={2.2} speed={0.7} />

      <button type="button" className="intro-skip" onClick={onSkip}>
        Skip intro <SkipForward size={14} strokeWidth={1.75} aria-hidden />
      </button>

      <header className="ribbon-header">
        <Monogram size={46} />
        <p className="eyebrow mt-4">{config.business.name}</p>
        <h1 id="ribbon-title" className="ribbon-title">
          {copy.ribbon.title}
        </h1>
        <p className="ribbon-subtitle">{copy.ribbon.subtitle}</p>
      </header>

      <div className="ribbon-band" ref={bandRef}>
        <span className="stanchion stanchion-l" aria-hidden />
        <span className="stanchion stanchion-r" aria-hidden />
        <RibbonHalf side="l" cut={stage === 'cut' || stage === 'celebrate'} />
        <RibbonHalf side="r" cut={stage === 'cut' || stage === 'celebrate'} />
        <span className="ribbon-knot" aria-hidden />
        <ScissorsArt stage={stage} />
        <span className="snip-sparkles" aria-hidden>
          {Array.from({ length: 8 }, (_, i) => (
            <Sparkle key={i} size={10 + (i % 3) * 5} className="snip-sparkle" />
          ))}
        </span>
        <button
          type="button"
          className="ribbon-hit"
          aria-hidden="true"
          tabIndex={-1}
          onClick={cut}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => (gesture.current = null)}
          onPointerCancel={() => (gesture.current = null)}
          disabled={stage !== 'ready'}
        />
      </div>

      <div className="ribbon-cta">
        <PremiumButton size="lg" icon={Scissors} iconMotion="spin" onClick={cut} disabled={stage !== 'ready'}>
          Cut the Ribbon
        </PremiumButton>
        <p className="gate-hint">{copy.ribbon.hint}</p>
      </div>

      <div className="ribbon-celebration" aria-live="polite">
        {stage === 'celebrate' && (
          <div className="celebration-inner">
            <p className="eyebrow">{copy.ribbon.celebrationKicker}</p>
            <p className="celebration-title">{copy.ribbon.celebrationTitle}</p>
            <p className="celebration-brand">{config.business.name}</p>
            <div className="mt-8">
              <PremiumButton variant="outline" icon={ArrowRight} onClick={finish}>
                Enter the Invitation
              </PremiumButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RibbonHalf({ side, cut }: { side: 'l' | 'r'; cut: boolean }) {
  const id = `rib-${side}`;
  // Inner end is straight while whole, and a crisp angled cut once snipped.
  const whole = side === 'l' ? 'M0 26 C140 20 330 32 500 27 L500 73 C330 78 140 70 0 74 Z' : 'M0 27 C170 32 360 20 500 26 L500 74 C360 70 170 78 0 73 Z';
  const snipped =
    side === 'l' ? 'M0 26 C140 20 330 32 488 27 L500 73 C330 78 140 70 0 74 Z' : 'M0 27 C170 32 360 20 500 26 L500 74 C360 70 170 78 12 73 Z';
  const d = cut ? snipped : whole;
  return (
    <div className={`ribbon-half ribbon-${side}`} aria-hidden>
      <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`${id}-satin`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent-deep)" />
            <stop offset="0.28" stopColor="var(--accent)" />
            <stop offset="0.46" stopColor="var(--accent-light)" />
            <stop offset="0.6" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent-deep)" />
          </linearGradient>
          <linearGradient id={`${id}-sheen`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={`${id}-clip`}>
            <path d={d} />
          </clipPath>
        </defs>
        <path d={d} fill={`url(#${id}-satin)`} />
        <g clipPath={`url(#${id}-clip)`}>
          <rect className="ribbon-sheen" x="-160" y="0" width="160" height="100" fill={`url(#${id}-sheen)`} />
        </g>
        <path
          d={side === 'l' ? 'M0 31 C140 25 330 37 500 32' : 'M0 32 C170 37 360 25 500 31'}
          fill="none"
          stroke="var(--gold-light)"
          strokeOpacity="0.8"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d={side === 'l' ? 'M0 69 C140 65 330 73 500 68' : 'M0 68 C170 73 360 65 500 69'}
          fill="none"
          stroke="var(--gold-light)"
          strokeOpacity="0.8"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function ScissorsArt({ stage }: { stage: Stage }) {
  return (
    <div className={`scissors is-${stage}`} aria-hidden>
      <svg viewBox="0 0 200 100" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="sc-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--gold-light)" />
            <stop offset="0.55" stopColor="var(--gold)" />
            <stop offset="1" stopColor="var(--gold-deep)" />
          </linearGradient>
          <linearGradient id="sc-steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.5" stopColor="var(--gold-light)" />
            <stop offset="1" stopColor="var(--gold)" />
          </linearGradient>
        </defs>
        <g className="blade blade-top">
          <path d="M114 50 L10 45.5 Q4 47 9 49.2 L114 56 Z" fill="url(#sc-steel)" stroke="var(--gold-deep)" strokeWidth="0.6" />
          <path d="M114 50 C128 40 140 31 156 29" fill="none" stroke="url(#sc-gold)" strokeWidth="6" strokeLinecap="round" />
          <circle cx="172" cy="29" r="15" fill="none" stroke="url(#sc-gold)" strokeWidth="6" />
        </g>
        <g className="blade blade-bottom">
          <path d="M114 50 L10 54.5 Q4 53 9 50.8 L114 44 Z" fill="url(#sc-steel)" stroke="var(--gold-deep)" strokeWidth="0.6" />
          <path d="M114 50 C128 60 140 69 156 71" fill="none" stroke="url(#sc-gold)" strokeWidth="6" strokeLinecap="round" />
          <circle cx="172" cy="71" r="15" fill="none" stroke="url(#sc-gold)" strokeWidth="6" />
        </g>
        <circle cx="114" cy="50" r="5" fill="url(#sc-gold)" stroke="var(--gold-deep)" strokeWidth="0.8" />
        <circle cx="114" cy="50" r="1.6" fill="var(--gold-deep)" />
      </svg>
    </div>
  );
}
