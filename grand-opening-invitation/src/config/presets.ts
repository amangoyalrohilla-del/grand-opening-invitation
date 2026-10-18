import type { EventPreset, EventTypeId, ImageAsset, PresetCopy } from './types';

/**
 * Event-type presets: the copy and imagery that change between a showroom launch,
 * an office inauguration, a café opening, etc. Facts about the client (names, date,
 * venue) live in event.config.ts — never here.
 *
 * Text can use these tokens, filled in automatically:
 *   {business} {space} {founder} {chiefGuest} {city} {category} {date}
 *
 * Demo photography is from Unsplash (free to use under the Unsplash License).
 * Replace with the client's own photos for production.
 */

const u = (id: string, alt: string, extra: Partial<ImageAsset> = {}): ImageAsset => ({
  src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`,
  alt,
  ...extra,
});

const baseCopy: PresetCopy = {
  eventLabel: 'Grand Opening & Inauguration',
  space: 'Showroom',
  gate: {
    eyebrow: 'You are cordially invited',
    title: 'To Witness a New Beginning',
    button: 'Open Invitation',
  },
  reveal: { kicker: 'Welcome to', title: 'The Grand Opening' },
  ribbon: {
    title: 'Every Great Journey Begins With a Grand Opening',
    subtitle: 'Join us as we unveil something extraordinary',
    hint: 'Tap the button — or swipe across the ribbon',
    celebrationKicker: 'Officially open',
    celebrationTitle: 'Grand Opening',
  },
  hero: {
    kicker: 'The Grand Opening',
    tagline: 'A New Chapter. A Grand Beginning.',
    intro: 'We are delighted to invite you to celebrate the beginning of an extraordinary journey.',
  },
  invitation: {
    eyebrow: 'The Official Invitation',
    opening: 'With immense joy and gratitude,',
    lead: 'We cordially invite you and your family to grace the auspicious occasion of the',
    headline: 'Grand Inauguration',
    closing: 'Your presence and blessings will make this new beginning even more special.',
  },
  founder: {
    eyebrow: 'Meet the Founder',
    heading: 'The Vision Behind Our New Beginning',
    paragraphs: [
      '{business} begins with a simple belief — that every visit should feel like an occasion. With our new {space}, {founder} sets out to create a destination where thoughtfully curated collections meet warm, personal hospitality.',
      'This opening marks the first chapter of that vision: a space designed with care, built for our community in {city}, and shaped by the people we hope to welcome through our doors for many years to come.',
    ],
  },
  gallery: {
    eyebrow: 'A First Look',
    heading: 'Step Inside Our New {space}',
    intro: 'A glimpse of the spaces we have prepared to welcome you — from the grand entrance to the finest details.',
  },
  details: { eyebrow: 'Save the Date', ceremonyLabel: 'Grand Inauguration Ceremony' },
  timeline: {
    eyebrow: 'Order of Ceremony',
    heading: 'The Inauguration Timeline',
    intro: 'A morning of celebration, carefully planned for our honoured guests.',
  },
  chiefGuest: {
    heading: 'Graced by the Presence of',
    line: 'We are deeply honoured to have our Chief Guest inaugurate this new beginning.',
  },
  venue: { heading: 'The Venue', tagline: 'Where New Beginnings Come to Life' },
  message: {
    heading: 'Your Presence Means the World to Us',
    paragraphs: [
      'Every new beginning becomes more meaningful when celebrated with the people who inspire and support us.',
      'As we embark upon this exciting journey, we would be honoured to have you by our side.',
      'Your presence will make our celebration truly special.',
    ],
  },
  finale: { title: 'A New Beginning Awaits', subtitle: 'We look forward to celebrating with you' },
};

function merge(overrides: Partial<{ [K in keyof PresetCopy]: Partial<PresetCopy[K]> }> & { eventLabel?: string; space?: string }): PresetCopy {
  const out: Record<string, unknown> = { ...baseCopy };
  for (const [key, value] of Object.entries(overrides)) {
    const baseValue = (baseCopy as unknown as Record<string, unknown>)[key];
    out[key] =
      value && typeof value === 'object' && !Array.isArray(value) && baseValue && typeof baseValue === 'object'
        ? { ...(baseValue as object), ...(value as object) }
        : value;
  }
  return out as unknown as PresetCopy;
}

export const presets: Record<EventTypeId, EventPreset> = {
  showroom: {
    id: 'showroom',
    label: 'Luxury Showroom',
    defaultTheme: 'black-gold',
    copy: baseCopy,
    images: {
      hero: u('photo-1486406146926-c627a92ad1ab', 'Modern glass building rising into the sky', { focus: '50% 40%' }),
      finale: u('photo-1477959858617-67f85cf4f1df', 'City lights glowing at dusk'),
      venue: u('photo-1600585154340-be6161a56a0c', 'Elegant modern building exterior lit in the evening'),
      gallery: [
        u('photo-1545324418-cc1a3fa10c00', 'Contemporary building exterior', { label: 'The Exterior', caption: 'Our new address — designed to make a lasting first impression.' }),
        u('photo-1555529669-e69e7aa0ba9a', 'Elegant storefront entrance', { label: 'Grand Entrance', caption: 'The doors that open to a new chapter.' }),
        u('photo-1441986300917-64674bd600d8', 'Bright, curated showroom interior', { label: 'The Showroom', caption: 'A calm, light-filled space for discovery.' }),
        u('photo-1441984904996-e0b6ba687e04', 'Curated product display', { label: 'Signature Display', caption: 'Collections presented with care and attention.' }),
        u('photo-1497366216548-37526070297c', 'Welcoming reception lounge', { label: 'Welcome Lounge', caption: 'Where every guest is received personally.' }),
        u('photo-1600607687939-ce8a6c25118c', 'Refined interior architectural details', { label: 'Fine Details', caption: 'Materials and finishes chosen with intention.' }),
      ],
    },
  },

  corporate: {
    id: 'corporate',
    label: 'Corporate Office',
    defaultTheme: 'navy-silver',
    copy: merge({
      eventLabel: 'Office Inauguration Ceremony',
      space: 'Office',
      reveal: { kicker: 'Welcome to', title: 'Our New Office' },
      hero: {
        kicker: 'Office Inauguration',
        tagline: 'New Workplace. New Possibilities.',
        intro: 'We are delighted to invite you to the inauguration of our new corporate office.',
      },
      founder: {
        heading: 'The Vision Behind Our New Workplace',
        paragraphs: [
          'Our new office reflects how {business} intends to grow — with space to collaborate, to welcome partners, and to build lasting relationships.',
          'Under the leadership of {founder}, this workplace in {city} has been designed as a home for our team and a meeting place for everyone who shares our journey.',
        ],
      },
      gallery: { heading: 'Inside Our New Office', intro: 'A preview of the spaces where our next chapter will be written.' },
      timeline: { intro: 'An inauguration morning for our partners, clients and well-wishers.' },
    }),
    images: {
      hero: u('photo-1486406146926-c627a92ad1ab', 'Corporate glass tower', { focus: '50% 40%' }),
      finale: u('photo-1477959858617-67f85cf4f1df', 'City skyline at dusk'),
      venue: u('photo-1497366811353-6870744d04b2', 'Bright modern office workspace'),
      gallery: [
        u('photo-1545324418-cc1a3fa10c00', 'Office building exterior', { label: 'The Building', caption: 'Our new corporate address.' }),
        u('photo-1497366216548-37526070297c', 'Office reception', { label: 'Reception', caption: 'A warm welcome for every visitor.' }),
        u('photo-1497366811353-6870744d04b2', 'Open-plan workspace', { label: 'Workspace', caption: 'Designed for focus and collaboration.' }),
        u('photo-1524758631624-e2822e304c36', 'Meeting lounge', { label: 'Meeting Lounge', caption: 'Spaces for conversations that matter.' }),
        u('photo-1497215728101-856f4ea42174', 'Team collaboration area', { label: 'Collaboration', caption: 'Where ideas come together.' }),
        u('photo-1504384308090-c894fdcc538d', 'Modern office interior', { label: 'Details', caption: 'Thoughtful details throughout.' }),
      ],
    },
  },

  boutique: {
    id: 'boutique',
    label: 'Boutique / Salon',
    defaultTheme: 'ivory-rosegold',
    copy: merge({
      eventLabel: 'Boutique Grand Opening',
      space: 'Boutique',
      hero: { kicker: 'The Grand Opening', tagline: 'Elegance, Newly Unveiled.', intro: 'We are delighted to invite you to the grand opening of our new boutique.' },
      gallery: { heading: 'Inside Our New Boutique' },
    }),
    images: {
      hero: u('photo-1441986300917-64674bd600d8', 'Boutique interior with soft lighting'),
      finale: u('photo-1477959858617-67f85cf4f1df', 'City lights at dusk'),
      venue: u('photo-1555529669-e69e7aa0ba9a', 'Boutique storefront'),
      gallery: [
        u('photo-1555529669-e69e7aa0ba9a', 'Boutique storefront', { label: 'The Storefront', caption: 'Our new home.' }),
        u('photo-1567401893414-76b7b1e5a7a5', 'Curated clothing rail', { label: 'Collections', caption: 'Curated pieces for every occasion.' }),
        u('photo-1441986300917-64674bd600d8', 'Boutique interior', { label: 'The Boutique', caption: 'A calm, beautiful space to explore.' }),
        u('photo-1490481651871-ab68de25d43d', 'Styled fashion display', { label: 'Styling', caption: 'Personal styling, by appointment.' }),
        u('photo-1445205170230-053b83016050', 'Fashion details', { label: 'Details', caption: 'Every detail considered.' }),
        u('photo-1483985988355-763728e1935b', 'Shopping experience', { label: 'Experience', caption: 'An experience made for you.' }),
      ],
    },
  },

  restaurant: {
    id: 'restaurant',
    label: 'Restaurant / Café',
    defaultTheme: 'emerald-gold',
    copy: merge({
      eventLabel: 'Grand Launch Celebration',
      space: 'Restaurant',
      hero: { kicker: 'The Grand Launch', tagline: 'A New Table. A Grand Beginning.', intro: 'We are delighted to invite you to the opening of our new restaurant.' },
      gallery: { heading: 'Take a Seat at Our Table', intro: 'A first look at the dining room, the bar and the little details we love.' },
    }),
    images: {
      hero: u('photo-1517248135467-4c7edcad34c4', 'Warm restaurant dining room'),
      finale: u('photo-1414235077428-338989a2e8c0', 'Fine dining table set for the evening'),
      venue: u('photo-1552566626-52f8b828add9', 'Restaurant interior lit in the evening'),
      gallery: [
        u('photo-1517248135467-4c7edcad34c4', 'Dining room', { label: 'The Dining Room', caption: 'Warm light, good company.' }),
        u('photo-1555396273-367ea4eb4db5', 'Restaurant interior', { label: 'Interiors', caption: 'Designed for long, happy evenings.' }),
        u('photo-1414235077428-338989a2e8c0', 'Fine dining plate', { label: 'The Kitchen', caption: 'Food made with care.' }),
        u('photo-1559339352-11d035aa65de', 'Restaurant bar', { label: 'The Bar', caption: 'A place to gather.' }),
        u('photo-1552566626-52f8b828add9', 'Restaurant seating', { label: 'Seating', caption: 'A seat for everyone.' }),
        u('photo-1424847651672-bf20a4b0982b', 'Table details', { label: 'Details', caption: 'The little things.' }),
      ],
    },
  },

  traditional: {
    id: 'traditional',
    label: 'Traditional Shop',
    defaultTheme: 'maroon-gold',
    copy: merge({
      eventLabel: 'Shubh Udghatan · Grand Inauguration',
      space: 'Store',
      gate: { eyebrow: 'Shubh Aagman', title: 'You Are Warmly Invited' },
      reveal: { kicker: 'Shubh Udghatan', title: 'The Grand Opening' },
      hero: {
        kicker: 'Shubh Udghatan',
        tagline: 'With Blessings, A New Beginning.',
        intro: 'With the blessings of our elders, we invite you to the auspicious opening of our new store.',
      },
      gallery: { heading: 'Step Inside Our New Store' },
    }),
    images: {
      hero: u('photo-1441986300917-64674bd600d8', 'Store interior', { focus: '50% 50%' }),
      finale: u('photo-1477959858617-67f85cf4f1df', 'City lights at dusk'),
      venue: u('photo-1555529669-e69e7aa0ba9a', 'Store front'),
      gallery: [
        u('photo-1555529669-e69e7aa0ba9a', 'Store front', { label: 'The Store', caption: 'Our new address.' }),
        u('photo-1441984904996-e0b6ba687e04', 'Product display', { label: 'Collections', caption: 'Our finest collections, under one roof.' }),
        u('photo-1441986300917-64674bd600d8', 'Store interior', { label: 'Inside', caption: 'A welcoming space for every family.' }),
        u('photo-1600607687939-ce8a6c25118c', 'Interior details', { label: 'Craft', caption: 'Made with care.' }),
        u('photo-1497366216548-37526070297c', 'Seating area', { label: 'Welcome Area', caption: 'Please, be seated.' }),
        u('photo-1545324418-cc1a3fa10c00', 'Building exterior', { label: 'Exterior', caption: 'Easy to find, hard to forget.' }),
      ],
    },
  },
};

export const presetList = Object.values(presets);
