import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../lib/dom';

interface Props {
  /** Particles per 100,000 px² (capped) */
  density?: number;
  className?: string;
  /** Multiplies drift speed */
  speed?: number;
}

interface Dot {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  phase: number;
  twinkle: number;
}

/**
 * Lightweight ambient gold dust. Pauses when off-screen or when the tab is hidden,
 * caps device-pixel-ratio and particle count, and renders a static frame for reduced motion.
 */
export function ParticleEffects({ density = 3.2, className = '', speed = 1 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let raf = 0;
    let visible = true;
    let last = performance.now();

    const readColor = () => getComputedStyle(document.documentElement).getPropertyValue('--glow').trim() || '255, 200, 128';
    let rgb = readColor();

    const seed = () => {
      const area = width * height;
      const count = Math.min(width < 640 ? 38 : 80, Math.round((area / 100000) * density));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.4,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -(Math.random() * 0.22 + 0.05),
        phase: Math.random() * Math.PI * 2,
        twinkle: Math.random() * 0.002 + 0.0008,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw(0);
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        if (dt) {
          d.x += d.vx * dt * 0.06 * speed;
          d.y += d.vy * dt * 0.06 * speed;
          d.phase += d.twinkle * dt;
          if (d.y < -6) {
            d.y = height + 6;
            d.x = Math.random() * width;
          }
          if (d.x < -6) d.x = width + 6;
          if (d.x > width + 6) d.x = -6;
        }
        const alpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(d.phase));
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 4);
        g.addColorStop(0, `rgba(${rgb}, ${alpha})`);
        g.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduced || raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);
    const mo = new MutationObserver(() => (rgb = readColor()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    resize();
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [density, speed]);

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden />;
}
