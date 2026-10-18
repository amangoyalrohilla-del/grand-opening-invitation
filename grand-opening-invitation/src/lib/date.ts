/** Offset (ms) between UTC and the given IANA zone at a given instant. */
function zoneOffset(timestamp: number, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(timestamp));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'), get('second'));
  return asUtc - Math.floor(timestamp / 1000) * 1000;
}

/** Converts a wall-clock date + time in `timeZone` to the exact instant. */
export function zonedTimeToDate(date: string, time: string, timeZone: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = time.split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm, 0);
  let ts = guess - zoneOffset(guess, timeZone);
  const second = guess - zoneOffset(ts, timeZone);
  if (second !== ts) ts = second;
  return new Date(ts);
}

const noonUtc = (date: string) => {
  const [y, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
};

export function dateParts(date: string) {
  const dt = noonUtc(date);
  const fmt = (o: Intl.DateTimeFormatOptions) => dt.toLocaleDateString('en-GB', { ...o, timeZone: 'UTC' });
  return {
    day: fmt({ day: 'numeric' }),
    dayPadded: fmt({ day: '2-digit' }),
    month: fmt({ month: 'long' }),
    monthShort: fmt({ month: 'short' }),
    year: fmt({ year: 'numeric' }),
    weekday: fmt({ weekday: 'long' }),
    /** "15 November 2026" */
    long: fmt({ day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

/** "10:30" → "10:30 AM" */
export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function pad(n: number) {
  return String(n).padStart(2, '0');
}
