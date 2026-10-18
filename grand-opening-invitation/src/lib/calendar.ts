import type { ResolvedInvitation } from '../config/useInvitation';
import { formatTime } from './date';
import { toast } from './toast';

const toIcsUtc = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

const escapeText = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** RFC 5545 line folding (max 75 octets per line). */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let current = '';
  let currentBytes = 0;
  for (const ch of line) {
    const len = new TextEncoder().encode(ch).length;
    const limit = out.length === 0 ? 75 : 74;
    if (currentBytes + len > limit) {
      out.push(current);
      current = '';
      currentBytes = 0;
    }
    current += ch;
    currentBytes += len;
  }
  out.push(current);
  return out.join('\r\n ');
}

export function buildIcs(inv: ResolvedInvitation): string {
  const { config, start, end, mapsUrl } = inv;
  const scheduleText = config.schedule.map((s) => `${formatTime(s.time)} — ${s.title}`).join('\n');
  const description = [
    config.event.message,
    '',
    scheduleText,
    '',
    `Hosted by ${config.hosts}`,
    config.chiefGuest ? `Chief Guest: ${config.chiefGuest.name}` : '',
    `Directions: ${mapsUrl}`,
  ]
    .filter((l, i, arr) => l !== '' || arr[i - 1] !== '')
    .join('\n');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Digital Invitation//Grand Opening//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${config.slug}@invitation`,
    `DTSTAMP:${toIcsUtc(new Date())}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${escapeText(`${config.business.name} — ${config.event.title}`)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText([config.venue.name, ...config.venue.addressLines].join(', '))}`,
    `URL:${mapsUrl}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeText(`Tomorrow: ${config.business.name} ${config.event.title}`)}`,
    'TRIGGER:-P1D',
    'END:VALARM',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeText(`${config.event.title} begins in 2 hours`)}`,
    'TRIGGER:-PT2H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

const isIOS = () =>
  typeof navigator !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

/** Downloads (or on iOS, opens) a real .ics calendar invitation. */
export function downloadCalendar(inv: ResolvedInvitation) {
  try {
    const ics = buildIcs(inv);
    const filename = `${inv.config.slug}.ics`;
    if (isIOS()) {
      // iOS Safari hands data: calendar URLs straight to the Calendar app.
      window.location.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
    } else {
      const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.rel = 'noopener';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    }
    toast('Calendar invite ready — open it to add the event');
  } catch {
    toast('Sorry, the calendar file could not be created on this device');
  }
}
