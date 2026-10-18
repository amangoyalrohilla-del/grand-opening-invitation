import { DoorOpen, SkipForward } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useInvitation } from '../../config/useInvitation';
import { prefersReducedMotion } from '../../lib/dom';
import { ParticleEffects } from '../effects/ParticleEffects';
import { Monogram } from '../ui/Ornaments';
import { PremiumButton } from '../ui/PremiumButton';
import { SmartImage } from '../ui/SmartImage';

interface Props {
  onComplete: () => void;
  onSkip: () => void;
}

/**
 * Steps: 0 idle → 1 glow → 2 handles turn → 3 doors swing open → 4 camera push-through
 *        → complete (hands over to the ribbon scene while the light is at full)
 */
export function IntroGate({ onComplete, onSkip }: Props) {
  const { copy, images, config, date } = useInvitation();
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);
  const buttonWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    buttonWrap.current?.querySelector('button')?.focus({ preventScroll: true });
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  const begin = () => {
    if (step !== 0) return;
    // Gate flows straight into the ribbon scene: no extra title screen in between.
    const plan: [number, number][] = prefersReducedMotion()
      ? [
          [1, 0],
          [3, 60],
          [7, 700],
        ]
      : [
          [1, 0],
          [2, 320],
          [3, 720],
          [4, 1850],
          [7, 2950],
        ];
    for (const [s, at] of plan) {
      timers.current.push(window.setTimeout(() => (s === 7 ? onComplete() : setStep(s)), at));
    }
  };

  const motes = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        x: (Math.random() - 0.5) * 140,
        y: -(Math.random() * 120 + 30),
        d: 1.4 + Math.random() * 1.6,
        delay: Math.random() * 0.9,
        s: 2 + Math.random() * 4,
        key: i,
      })),
    [],
  );

  const cls = [
    'gate',
    step >= 1 && 'is-glowing',
    step >= 2 && 'is-handles',
    step >= 3 && 'is-open',
    step >= 4 && 'is-zoom',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cls}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      onKeyDown={(e) => e.key === 'Escape' && onSkip()}
    >
      <div className="gate-wall" aria-hidden />
      <ParticleEffects density={2.6} speed={0.8} />

      <button type="button" className="intro-skip" onClick={onSkip}>
        Skip intro <SkipForward size={14} strokeWidth={1.75} aria-hidden />
      </button>

      <div className="gate-layout">
        <header className="gate-header">
          <Monogram size={58} glow className="gate-crest" />
          <p className="eyebrow mt-3">{copy.gate.eyebrow}</p>
          <h1 id="gate-title" className="gate-title">
            {copy.gate.title}
          </h1>
          <p className="gate-brand">{config.business.name}</p>
        </header>

        <div className="gate-arch-wrap" aria-hidden>
          <div className="gate-arch">
            <div className="gate-lintel">
              <span className="lintel-mark">
                <Monogram size={30} />
              </span>
            </div>
            <div className="gate-body">
              <Pillar side="l" />
              <div className="doorway" onClick={begin} title={copy.gate.button}>
                <div className="doorway-inside">
                  <SmartImage image={images.hero} className="h-full w-full object-cover" priority sizes="60vw" />
                  <span className="inside-light" />
                  <span className="inside-rays" />
                </div>
                <div className="door door-l">
                  <DoorFace side="l" />
                </div>
                <div className="door door-r">
                  <DoorFace side="r" />
                </div>
                <span className="door-seam" />
              </div>
              <Pillar side="r" />
              <span className="sconce sconce-l" />
              <span className="sconce sconce-r" />
            </div>
            <div className="gate-steps">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="motes">
            {motes.map((m) => (
              <span
                key={m.key}
                style={
                  {
                    '--mx': `${m.x}px`,
                    '--my': `${m.y}px`,
                    '--md': `${m.d}s`,
                    '--mdelay': `${m.delay}s`,
                    '--ms': `${m.s}px`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </div>

        <div className="gate-cta" ref={buttonWrap}>
          <PremiumButton size="lg" icon={DoorOpen} iconMotion="bob" onClick={begin} disabled={step > 0}>
            {copy.gate.button}
          </PremiumButton>
          <p className="gate-hint">
            {date.weekday} · {date.long} · {config.venue.city}
          </p>
        </div>
      </div>

      <div className="gate-flash" aria-hidden />

    </div>
  );
}

function Pillar({ side }: { side: 'l' | 'r' }) {
  return (
    <div className={`pillar pillar-${side}`}>
      <span className="pillar-cap" />
      <span className="pillar-shaft" />
      <span className="pillar-base" />
    </div>
  );
}

function DoorFace({ side }: { side: 'l' | 'r' }) {
  const rays = Array.from({ length: 9 }, (_, i) => i);
  return (
    <>
      <div className="door-face">
        <div className="door-molding" />
        <div className="door-panel door-panel-top">
          <svg viewBox="0 0 100 120" preserveAspectRatio="none" className="h-full w-full">
            <g fill="none" stroke="rgba(var(--gold-rgb), 0.55)" strokeWidth="0.6">
              {rays.map((i) => {
                const a = Math.PI + (i / (rays.length - 1)) * (Math.PI / 2);
                const cx = side === 'l' ? 100 : 0;
                const ax = side === 'l' ? a : Math.PI * 3 - a;
                return <line key={i} x1={cx} y1="118" x2={cx + Math.cos(ax) * 130} y2={118 + Math.sin(ax) * 130} />;
              })}
              {[40, 70, 100].map((r) => (
                <circle key={r} cx={side === 'l' ? 100 : 0} cy="118" r={r} />
              ))}
            </g>
          </svg>
        </div>
        <div className="door-panel door-panel-bottom">
          <span className="panel-diamond" />
        </div>
        <div className="door-handle">
          <span className="handle-plate">
            <span className="handle-key" />
          </span>
          <span className="handle-rose" />
          <span className="handle-lever" />
        </div>
        <div className="door-shade" />
      </div>
      <div className="door-edge" />
    </>
  );
}
