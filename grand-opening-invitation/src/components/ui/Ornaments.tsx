import { useId } from 'react';
import { useInvitation } from '../../config/useInvitation';

/** Gold gradient definition shared by ornaments. Returns the url() reference. */
function useGoldGradient() {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const defs = (
    <defs>
      <linearGradient id={`gold-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="var(--gold-light)" />
        <stop offset="0.5" stopColor="var(--gold)" />
        <stop offset="1" stopColor="var(--gold-deep)" />
      </linearGradient>
    </defs>
  );
  return { defs, fill: `url(#gold-${id})` };
}

/** Line — diamond — line divider */
export function Divider({ className = '', width = 180 }: { className?: string; width?: number }) {
  const { defs, fill } = useGoldGradient();
  return (
    <svg className={className} width={width} height="14" viewBox="0 0 180 14" aria-hidden>
      {defs}
      <path d="M0 7 H70" stroke={fill} strokeWidth="1" />
      <path d="M110 7 H180" stroke={fill} strokeWidth="1" />
      <path d="M90 1 L96 7 L90 13 L84 7 Z" fill={fill} />
      <circle cx="77" cy="7" r="1.6" fill={fill} />
      <circle cx="103" cy="7" r="1.6" fill={fill} />
    </svg>
  );
}

/** Business crest — uses the logo image if configured, otherwise a monogram crest. */
export function Monogram({ size = 96, className = '', glow = false }: { size?: number; className?: string; glow?: boolean }) {
  const { config } = useInvitation();
  const { defs, fill } = useGoldGradient();
  if (config.business.logoSrc) {
    return (
      <img
        src={config.business.logoSrc}
        alt={`${config.business.name} logo`}
        width={size}
        height={size}
        className={`${className} object-contain`}
      />
    );
  }
  const ticks = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <svg
      className={`${className} ${glow ? 'crest-glow' : ''}`}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`${config.business.name} crest`}
    >
      {defs}
      <circle cx="60" cy="60" r="56" fill="none" stroke={fill} strokeWidth="1.4" />
      <circle cx="60" cy="60" r="50" fill="none" stroke={fill} strokeWidth="0.6" />
      {ticks.map((a) => (
        <line
          key={a}
          x1="60"
          y1="7"
          x2="60"
          y2={a % 90 === 0 ? 13 : 10}
          stroke={fill}
          strokeWidth={a % 90 === 0 ? 1.2 : 0.6}
          transform={`rotate(${a} 60 60)`}
        />
      ))}
      {[0, 90, 180, 270].map((a) => (
        <path key={a} d="M60 1.5 L62.5 4 L60 6.5 L57.5 4 Z" fill={fill} transform={`rotate(${a} 60 60)`} />
      ))}
      <text
        x="60"
        y="61"
        textAnchor="middle"
        dominantBaseline="central"
        fill={fill}
        style={{ fontFamily: 'Cinzel, Georgia, serif', fontSize: config.business.monogram.length > 1 ? 38 : 50, fontWeight: 500 }}
      >
        {config.business.monogram}
      </text>
    </svg>
  );
}

/** Ornamental corner flourish (rotate with CSS for other corners) */
export function CornerFlourish({ className = '' }: { className?: string }) {
  const { defs, fill } = useGoldGradient();
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden>
      {defs}
      <g fill="none" stroke={fill} strokeLinecap="round">
        <path d="M4 4 H96" strokeWidth="1.4" />
        <path d="M4 4 V96" strokeWidth="1.4" />
        <path d="M11 11 H62" strokeWidth="0.7" />
        <path d="M11 11 V62" strokeWidth="0.7" />
        <path d="M11 11 C36 11 46 24 37 34 C29 43 17 35 23 26 C27 20 34 23 32 28" strokeWidth="1.1" />
        <path d="M62 11 C70 11 74 16 72 20" strokeWidth="0.8" />
        <path d="M11 62 C11 70 16 74 20 72" strokeWidth="0.8" />
        <path d="M44 4 C52 -1 60 -1 66 4" strokeWidth="0.8" />
        <path d="M4 44 C-1 52 -1 60 4 66" strokeWidth="0.8" />
      </g>
      <g fill={fill}>
        <circle cx="96" cy="4" r="2" />
        <circle cx="4" cy="96" r="2" />
        <path d="M44 22 q7 -6 14 0 q-7 6 -14 0z" opacity="0.85" />
        <path d="M22 44 q-6 7 0 14 q6 -7 0 -14z" opacity="0.85" />
      </g>
    </svg>
  );
}

/** Laurel wreath for the chief guest medallion: two branches rising from the base */
export function Laurel({ className = '' }: { className?: string }) {
  const { defs, fill } = useGoldGradient();
  const cx = 120;
  const cy = 120;
  const r = 98;
  const rad = (d: number) => (d * Math.PI) / 180;
  // Screen angles (y down): 90° = bottom, 180° = left, 270° = top. Left branch: bottom → upper-left.
  const start = 104;
  const end = 246;
  const steps = 9;
  const leaves = Array.from({ length: steps }, (_, i) => start + 8 + (i * (end - start - 8)) / (steps - 1));
  const pt = (deg: number, radius: number) => [cx + radius * Math.cos(rad(deg)), cy + radius * Math.sin(rad(deg))];
  const [sx, sy] = pt(start, r);
  const [ex, ey] = pt(end, r);
  return (
    <svg className={className} viewBox="0 0 240 240" aria-hidden>
      {defs}
      {[false, true].map((mirror) => (
        <g key={String(mirror)} transform={mirror ? 'translate(240 0) scale(-1 1)' : undefined}>
          <path d={`M${sx} ${sy} A${r} ${r} 0 0 1 ${ex} ${ey}`} fill="none" stroke={fill} strokeWidth="1.3" />
          {leaves.map((deg, i) => {
            const size = 1 - i * 0.04;
            const tangent = deg + 90; // direction of growth along the arc
            return [10, -10].map((off) => {
              const [x, y] = pt(deg, r + off * 0.55);
              return (
                <ellipse
                  key={`${i}${off}`}
                  cx={x}
                  cy={y}
                  rx={9 * size}
                  ry={3.6 * size}
                  fill={fill}
                  opacity={off > 0 ? 0.9 : 0.7}
                  transform={`rotate(${tangent + (off > 0 ? -32 : 32)} ${x} ${y})`}
                />
              );
            });
          })}
          {(() => {
            const [bx, by] = pt(end + 4, r);
            return <circle cx={bx} cy={by} r="3" fill={fill} />;
          })()}
        </g>
      ))}
      <path d="M112 222 L120 214 L128 222 L120 230 Z" fill={fill} />
    </svg>
  );
}

/** Delicate botanical sprig for the personal message section */
export function FloralSprig({ className = '' }: { className?: string }) {
  const { defs, fill } = useGoldGradient();
  const leaves = [
    { x: 40, y: 150, r: -40 },
    { x: 62, y: 128, r: 30 },
    { x: 78, y: 104, r: -35 },
    { x: 102, y: 86, r: 25 },
    { x: 118, y: 62, r: -30 },
  ];
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden>
      {defs}
      <path d="M10 196 C40 160 70 130 100 92 C122 64 142 44 170 22" fill="none" stroke={fill} strokeWidth="1.2" />
      <path d="M100 92 C112 98 128 96 140 86" fill="none" stroke={fill} strokeWidth="0.9" />
      {leaves.map((l, i) => (
        <path key={i} d={`M${l.x} ${l.y} q10 -14 26 -12 q-8 14 -26 12z`} fill={fill} opacity="0.75" transform={`rotate(${l.r} ${l.x} ${l.y})`} />
      ))}
      {[
        [170, 22, 9],
        [140, 86, 6.5],
      ].map(([cx, cy, r], i) => (
        <g key={i} fill={fill}>
          {Array.from({ length: 5 }, (_, p) => (
            <ellipse key={p} cx={cx} cy={cy - r} rx={r * 0.55} ry={r} transform={`rotate(${p * 72} ${cx} ${cy})`} opacity="0.7" />
          ))}
          <circle cx={cx} cy={cy} r={r * 0.35} />
        </g>
      ))}
      <circle cx="58" cy="168" r="2.2" fill={fill} />
      <circle cx="152" cy="54" r="1.8" fill={fill} />
    </svg>
  );
}

/** Small gold sparkle star */
export function Sparkle({ className = '', size = 14 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" fill="currentColor" />
    </svg>
  );
}
