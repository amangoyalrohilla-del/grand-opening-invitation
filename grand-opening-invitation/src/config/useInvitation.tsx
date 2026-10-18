import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { eventConfig } from './event.config';
import { presets } from './presets';
import { applyTheme } from './themes';
import type { EventConfig, EventTypeId, PresetCopy, PresetImages, ScheduleItem, ThemeId } from './types';
import { dateParts, zonedTimeToDate } from '../lib/date';

export interface ResolvedInvitation {
  config: EventConfig;
  copy: PresetCopy;
  images: PresetImages;
  schedule: ScheduleItem[];
  themeId: ThemeId;
  eventType: EventTypeId;
  start: Date;
  end: Date;
  date: ReturnType<typeof dateParts>;
  mapsUrl: string;
  mapsEmbedUrl: string | null;
  mapsIsArea: boolean;
  shareUrl: string;
  /** Fills {business}, {space}, … tokens */
  fill: (text: string) => string;
}

interface InvitationContextValue extends ResolvedInvitation {
  setTheme: (id: ThemeId) => void;
  setEventType: (id: EventTypeId) => void;
}

const InvitationContext = createContext<InvitationContextValue | null>(null);

function deepMerge<T>(base: T, override: unknown): T {
  if (!override || typeof override !== 'object') return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(override as Record<string, unknown>)) {
    if (v === undefined) continue;
    const bv = out[k];
    out[k] = v && typeof v === 'object' && !Array.isArray(v) && bv && typeof bv === 'object' && !Array.isArray(bv) ? deepMerge(bv, v) : v;
  }
  return out as T;
}

function fillDeep<T>(value: T, fill: (s: string) => string): T {
  if (typeof value === 'string') return fill(value) as T;
  if (Array.isArray(value)) return value.map((v) => fillDeep(v, fill)) as T;
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = fillDeep(v, fill);
    return out as T;
  }
  return value;
}

export function resolveInvitation(config: EventConfig, eventType: EventTypeId, themeId: ThemeId): ResolvedInvitation {
  const preset = presets[eventType];
  const rawCopy = deepMerge(preset.copy, config.copyOverrides);
  const images = { ...preset.images, ...config.imageOverrides } as PresetImages;
  const date = dateParts(config.event.date);

  const tokens: Record<string, string> = {
    business: config.business.name,
    space: rawCopy.space,
    founder: config.founder.name,
    chiefGuest: config.chiefGuest?.name ?? '',
    city: config.venue.city,
    category: config.business.category,
    date: date.long,
  };
  const fill = (text: string) => text.replace(/\{(\w+)\}/g, (m, key: string) => tokens[key] ?? m);

  const query = encodeURIComponent(config.venue.mapsQuery);
  const mapsIsArea = !config.venue.mapsUrl && !config.venue.exactLocation;
  const mapsUrl = config.venue.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${query}`;
  const mapsEmbedUrl = config.venue.exactLocation ? `https://www.google.com/maps?q=${query}&output=embed` : null;

  const shareUrl =
    config.share.url ||
    (typeof window !== 'undefined' ? window.location.href.split('#')[0].replace(/[?&]intro=\d/, '') : '');

  return {
    config,
    copy: fillDeep(rawCopy, fill),
    images,
    schedule: fillDeep(config.schedule, fill),
    themeId,
    eventType,
    start: zonedTimeToDate(config.event.date, config.event.startTime, config.event.timezone),
    end: zonedTimeToDate(config.event.date, config.event.endTime, config.event.timezone),
    date,
    mapsUrl,
    mapsEmbedUrl,
    mapsIsArea,
    shareUrl,
    fill,
  };
}

export function InvitationProvider({ children }: { children: ReactNode }) {
  const [eventType, setEventTypeState] = useState<EventTypeId>(eventConfig.eventType);
  const [themeOverride, setThemeOverride] = useState<ThemeId | null>(null);

  const themeId: ThemeId =
    themeOverride ?? (eventConfig.theme === 'auto' ? presets[eventType].defaultTheme : eventConfig.theme);

  useEffect(() => applyTheme(themeId), [themeId]);

  const value = useMemo<InvitationContextValue>(
    () => ({
      ...resolveInvitation(eventConfig, eventType, themeId),
      setTheme: (id) => setThemeOverride(id),
      setEventType: (id) => {
        setEventTypeState(id);
        setThemeOverride(null); // follow the new event type's recommended theme
      },
    }),
    [eventType, themeId],
  );

  useEffect(() => {
    document.title = `${value.config.business.name} — ${value.copy.eventLabel}`;
  }, [value.config.business.name, value.copy.eventLabel]);

  return <InvitationContext.Provider value={value}>{children}</InvitationContext.Provider>;
}

export function useInvitation() {
  const ctx = useContext(InvitationContext);
  if (!ctx) throw new Error('useInvitation must be used inside <InvitationProvider>');
  return ctx;
}
