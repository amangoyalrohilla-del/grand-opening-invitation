import { useEffect, useState } from 'react';

export type CountdownPhase = 'upcoming' | 'live' | 'ended';

export interface CountdownState {
  phase: CountdownPhase;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function compute(start: number, end: number, now: number): CountdownState {
  if (now >= end) return { phase: 'ended', days: 0, hours: 0, minutes: 0, seconds: 0 };
  if (now >= start) return { phase: 'live', days: 0, hours: 0, minutes: 0, seconds: 0 };
  const total = Math.max(0, Math.floor((start - now) / 1000));
  return {
    phase: 'upcoming',
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/** Real countdown against exact instants (already timezone-converted). Never negative. */
export function useCountdown(start: Date, end: Date): CountdownState {
  const s = start.getTime();
  const e = end.getTime();
  const [state, setState] = useState(() => compute(s, e, Date.now()));

  useEffect(() => {
    let timer = 0;
    const tick = () => {
      const now = Date.now();
      setState(compute(s, e, now));
      timer = window.setTimeout(tick, 1000 - (now % 1000) + 10);
    };
    tick();
    const onVisible = () => document.visibilityState === 'visible' && setState(compute(s, e, Date.now()));
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [s, e]);

  return state;
}
