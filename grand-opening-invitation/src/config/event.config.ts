import type { EventConfig } from './types';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  EDIT THIS FILE FOR EACH CLIENT
 * ─────────────────────────────────────────────────────────────────────────────
 *  Everything a guest sees — names, date, schedule, venue, theme, event type —
 *  is controlled from here. Copy that depends on the *kind* of opening lives in
 *  presets.ts and switches automatically when you change `eventType`.
 *
 *  All content below is fictional demo content.
 */
export const eventConfig: EventConfig = {
  slug: 'aurelia-grand-opening-2026',

  /** 'showroom' | 'corporate' | 'boutique' | 'restaurant' | 'traditional' */
  eventType: 'showroom',

  /** 'auto' | 'black-gold' | 'maroon-gold' | 'navy-silver' | 'ivory-rosegold' | 'emerald-gold' */
  theme: 'auto',

  business: {
    name: 'The Aurelia Group',
    monogram: 'A',
    category: 'Luxury Lifestyle Showroom',
    logoSrc: null,
  },

  event: {
    title: 'Grand Opening & Inauguration Ceremony',
    date: '2026-11-15',
    startTime: '10:00',
    endTime: '13:00',
    timezone: 'Asia/Kolkata',
    timezoneLabel: 'IST',
    message:
      'With immense pleasure and heartfelt gratitude, we cordially invite you to celebrate the grand opening of our new venture. Your gracious presence will make this special occasion truly memorable.',
  },

  hosts: 'Mr. Aarav Mehta & Family',

  founder: {
    name: 'Mr. Aarav Mehta',
    role: 'Founder',
    initials: 'AM',
    signature: 'Aarav Mehta',
    // Demo stock portrait — replace with the client's approved photo, or set to null for a monogram.
    photo: {
      src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80',
      alt: 'Portrait of the founder',
      focus: '50% 25%',
    },
  },

  chiefGuest: {
    name: 'Mr. Rajesh Sharma',
    role: 'Chief Guest',
    initials: 'RS',
    // Real people: only add a photo with their permission. Null shows an elegant monogram.
    photo: null,
  },

  schedule: [
    { time: '10:00', title: 'Guest Welcome', description: 'A warm welcome to our esteemed guests.', icon: 'welcome' },
    { time: '10:30', title: 'Ribbon Cutting Ceremony', description: 'The official grand opening of our new venture.', icon: 'ribbon' },
    { time: '11:00', title: 'Inauguration & {space} Tour', description: 'Explore our new space and celebrate the beginning of our journey.', icon: 'tour' },
    { time: '12:00', title: 'Refreshments & Networking', description: 'A delightful gathering with our honoured guests.', icon: 'refreshments' },
  ],

  venue: {
    name: 'The Aurelia Group',
    addressLines: ['Vaishali Nagar', 'Jaipur, Rajasthan'],
    city: 'Jaipur',
    // Paste the client's exact Google Maps link here when available.
    mapsUrl: null,
    mapsQuery: 'Vaishali Nagar, Jaipur, Rajasthan',
    // false = we only know the area, so the map is shown as an area preview, not a pin.
    exactLocation: false,
  },

  share: {
    url: null, // null = the current page address
    title: 'You are invited — The Aurelia Group Grand Opening',
    text: 'You are cordially invited to the Grand Opening & Inauguration of The Aurelia Group — Sunday, 15 November 2026, 10:00 AM onwards, Vaishali Nagar, Jaipur.',
  },

  intro: {
    enabled: true,
    ribbon: true,
    oncePerVisit: true,
  },

  demoControls: true,

  // Optional: override any preset text for this client, e.g.
  // copyOverrides: { hero: { tagline: 'Luxury, Reimagined.' } },
  // imageOverrides: { hero: { src: './images/hero.jpg', alt: 'Our showroom' } },
};
