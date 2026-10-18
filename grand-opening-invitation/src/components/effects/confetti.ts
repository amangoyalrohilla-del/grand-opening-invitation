import { prefersReducedMotion } from '../../lib/dom';

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  tilt: number;
  vt: number;
  color: string;
  shape: 'rect' | 'circle' | 'star';
  life: number;
}

const cssVar = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

/**
 * Fires a one-off confetti + sparkle burst on a temporary full-screen canvas.
 * The canvas removes itself when the animation finishes (no leftover overlays).
 */
export function burstConfetti(originX: number, originY: number, opts: { count?: number; spread?: number } = {}) {
  if (typeof document === 'undefined') return () => {};
  const reduced = prefersReducedMotion();
  const count = reduced ? 0 : Math.min(opts.count ?? 160, window.innerWidth < 640 ? 110 : 180);
  if (!count) return () => {};

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:90';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return () => {};
  }
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = window.innerWidth;
  const H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const palette = [
    cssVar('--gold', '#d4af6e'),
    cssVar('--gold-light', '#f3dfae'),
    cssVar('--gold-deep', '#9c7a3c'),
    cssVar('--ivory', '#faf5ea'),
    cssVar('--accent-light', '#cf4459'),
  ];
  const spread = opts.spread ?? 1;

  const pieces: Piece[] = Array.from({ length: count }, (_, i) => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.25 * spread;
    const power = 6 + Math.random() * 9;
    const shapeRoll = Math.random();
    return {
      x: originX + (Math.random() - 0.5) * 30,
      y: originY + (Math.random() - 0.5) * 10,
      vx: Math.cos(angle) * power * (0.6 + Math.random() * 0.6),
      vy: Math.sin(angle) * power,
      w: 5 + Math.random() * 7,
      h: 3 + Math.random() * 5,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      tilt: Math.random() * Math.PI,
      vt: 0.08 + Math.random() * 0.12,
      color: palette[i % palette.length],
      shape: shapeRoll > 0.88 ? 'star' : shapeRoll > 0.7 ? 'circle' : 'rect',
      life: 1,
    };
  });

  let raf = 0;
  let last = performance.now();
  const startTime = last;
  const DURATION = 4200;

  const drawStar = (r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      ctx.lineTo(Math.cos(a + Math.PI / 4) * r * 0.35, Math.sin(a + Math.PI / 4) * r * 0.35);
    }
    ctx.closePath();
    ctx.fill();
  };

  const frame = (now: number) => {
    const dt = Math.min(2.5, (now - last) / 16.67);
    last = now;
    const elapsed = now - startTime;
    ctx.clearRect(0, 0, W, H);
    for (const p of pieces) {
      p.vy += 0.22 * dt;
      p.vx *= Math.pow(0.985, dt);
      p.vy *= Math.pow(0.985, dt);
      p.x += (p.vx + Math.sin(p.tilt) * 0.6) * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
      p.tilt += p.vt * dt;
      p.life = Math.max(0, 1 - Math.max(0, elapsed - DURATION * 0.55) / (DURATION * 0.45));
      if (p.y > H + 40) continue;
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.scale(1, Math.cos(p.tilt));
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      } else if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.h / 1.6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        drawStar(p.w * 0.9);
      }
      ctx.restore();
    }
    if (elapsed < DURATION) raf = requestAnimationFrame(frame);
    else cleanup();
  };

  const cleanup = () => {
    cancelAnimationFrame(raf);
    canvas.remove();
  };
  raf = requestAnimationFrame(frame);
  return cleanup;
}
