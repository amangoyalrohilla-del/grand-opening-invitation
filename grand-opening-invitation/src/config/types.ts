export type ThemeId = 'black-gold' | 'maroon-gold' | 'navy-silver' | 'ivory-rosegold' | 'emerald-gold';

export type EventTypeId = 'showroom' | 'corporate' | 'boutique' | 'restaurant' | 'traditional';

export type ScheduleIcon =
  | 'welcome'
  | 'ribbon'
  | 'tour'
  | 'refreshments'
  | 'ceremony'
  | 'speech'
  | 'lunch'
  | 'music'
  | 'pooja';

export interface ImageAsset {
  /** Absolute URL or a path inside /public, e.g. "./images/front.jpg" */
  src: string;
  alt: string;
  /** Short label shown on gallery tiles, e.g. "Grand Entrance" */
  label?: string;
  /** One-line caption shown in the lightbox */
  caption?: string;
  /** CSS object-position, e.g. "50% 30%" */
  focus?: string;
}

export interface ScheduleItem {
  /** 24-hour "HH:mm" in the event timezone */
  time: string;
  title: string;
  description: string;
  icon: ScheduleIcon;
}

export interface Person {
  name: string;
  role: string;
  /** Only add a photo the person has approved. Leave null to show an elegant monogram. */
  photo?: ImageAsset | null;
  /** Initials for the monogram fallback, e.g. "RS" */
  initials: string;
}

/** All text that changes with the type of opening (showroom, office, café…). */
export interface PresetCopy {
  eventLabel: string;
  /** Noun for the new place: "Showroom", "Office", "Boutique"… used as {space} */
  space: string;
  gate: { eyebrow: string; title: string; button: string };
  reveal: { kicker: string; title: string };
  ribbon: { title: string; subtitle: string; hint: string; celebrationKicker: string; celebrationTitle: string };
  hero: { kicker: string; tagline: string; intro: string };
  invitation: { eyebrow: string; opening: string; lead: string; headline: string; closing: string };
  founder: { eyebrow: string; heading: string; paragraphs: string[] };
  gallery: { eyebrow: string; heading: string; intro: string };
  details: { eyebrow: string; ceremonyLabel: string };
  timeline: { eyebrow: string; heading: string; intro: string };
  chiefGuest: { heading: string; line: string };
  venue: { heading: string; tagline: string };
  message: { heading: string; paragraphs: string[] };
  finale: { title: string; subtitle: string };
}

export interface PresetImages {
  hero: ImageAsset;
  finale: ImageAsset;
  venue: ImageAsset;
  /** Exactly six images work best: 1 featured + 5 supporting */
  gallery: ImageAsset[];
}

export interface EventPreset {
  id: EventTypeId;
  label: string;
  defaultTheme: ThemeId;
  copy: PresetCopy;
  images: PresetImages;
}

type DeepPartial<T> = { [K in keyof T]?: T[K] extends (infer U)[] ? U[] : T[K] extends object ? DeepPartial<T[K]> : T[K] };

export interface EventConfig {
  /** Unique id — used for the calendar file name and to remember the intro per visit */
  slug: string;
  eventType: EventTypeId;
  /** 'auto' uses the event type's recommended theme */
  theme: ThemeId | 'auto';

  business: {
    name: string;
    /** 1–2 letters shown in the crest when no logo image is provided */
    monogram: string;
    category: string;
    /** Optional logo image (transparent PNG/SVG works best). Null = generated crest. */
    logoSrc?: string | null;
  };

  event: {
    title: string;
    /** YYYY-MM-DD in the event timezone */
    date: string;
    /** HH:mm (24h) */
    startTime: string;
    /** HH:mm (24h) — used for the calendar entry and "event finished" state */
    endTime: string;
    /** IANA timezone, e.g. "Asia/Kolkata" */
    timezone: string;
    timezoneLabel: string;
    /** The main invitation message */
    message: string;
  };

  hosts: string;
  founder: Person & { signature: string };
  chiefGuest: Person | null;
  schedule: ScheduleItem[];

  venue: {
    name: string;
    addressLines: string[];
    city: string;
    /**
     * Paste the client's exact Google Maps share link here (https://maps.app.goo.gl/… or
     * https://www.google.com/maps/place/…). Leave null to fall back to an area search.
     */
    mapsUrl: string | null;
    /** Used for the area search fallback and the map embed */
    mapsQuery: string;
    /** Only set true once mapsQuery points at the exact venue */
    exactLocation: boolean;
  };

  share: { url: string | null; title: string; text: string };

  intro: {
    enabled: boolean;
    ribbon: boolean;
    /** Show the intro only once per browser tab session */
    oncePerVisit: boolean;
  };

  /** Shows the floating theme / event-type switcher. Turn OFF for real clients. */
  demoControls: boolean;

  /** Optional per-client overrides of any preset text or image */
  copyOverrides?: DeepPartial<PresetCopy>;
  imageOverrides?: Partial<PresetImages>;
}

export interface ThemeTokens {
  id: ThemeId;
  label: string;
  /** Short description used in the demo switcher */
  note: string;
  mode: 'dark' | 'light';
  vars: Record<string, string>;
}
