# Grand Opening & Inauguration — Digital Invitation Template

A cinematic, mobile-first invitation website: 3D door entrance → interactive ribbon cutting →
a full luxury invitation (hero, invitation card, founder, gallery, live countdown, timeline,
chief guest, venue, personal note, finale).

Built with **React 19 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion + Lucide icons**.

---

## 1. Run it on your computer

You need **Node.js 18 or newer** (download from nodejs.org — choose "LTS").

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173).

Handy demo links:

- `?intro=1` — always play the opening (e.g. `http://localhost:5173/?intro=1`)
- `?intro=0` — skip straight to the invitation

The intro plays once per visit; "Replay Opening" (in the finale) plays it again.

## 2. Publish it (free)

```bash
npm run build
```

This creates a `dist` folder. Then either:

- **Netlify (easiest):** go to app.netlify.com/drop and drag the `dist` folder in. You get a live link in seconds.
- **Vercel:** `npx vercel` in this folder, or import the project on vercel.com.
- **Any hosting / cPanel:** upload the contents of `dist` to a folder. Paths are relative, so sub-folders work too.

## 3. Customise for a client

Almost everything lives in **`src/config/event.config.ts`**:

| What | Where |
|---|---|
| Business name, monogram letter, logo | `business` |
| Date, start/end time, timezone, main message | `event` |
| Founder, chief guest (photo optional) | `founder`, `chiefGuest` |
| Ceremony schedule | `schedule` |
| Venue + Google Maps link | `venue.mapsUrl` (paste the client's share link) |
| Theme | `theme` — `'auto'` or one of the 5 themes |
| Type of opening | `eventType` — `showroom`, `corporate`, `boutique`, `restaurant`, `traditional` |
| Turn the demo theme switcher off | `demoControls: false` ← **do this before sending to guests** |

- **Copy that depends on the type of opening** (headlines, gallery captions, etc.) is in
  `src/config/presets.ts`. Change `eventType` and the whole site updates. To change a single line
  for one client, use `copyOverrides` in the config instead of editing the preset.
- **Photos:** put the client's images in `public/images/` and reference them as
  `./images/front.jpg` (via `imageOverrides` in the config, or in the preset). Missing or broken
  images automatically fall back to an on-brand gold line-art placeholder.
- **Themes:** colours are in `src/config/themes.ts`. Add a new theme by copying one entry.
- **Link preview (WhatsApp, etc.):** edit the `<title>` and `og:` tags in `index.html`.
- **Maps:** with no exact link, "Get Directions" opens a Google Maps search for the area
  (`mapsQuery`) and the map card is labelled "Area". Once you have the exact pin, set `mapsUrl`
  and `exactLocation: true` to embed a live map.

## 4. What every button does

| Button | Action |
|---|---|
| Open Invitation | 3D doors open, camera pushes through, brand reveal |
| Cut the Ribbon | Scissors cut the ribbon (tap the button, tap the ribbon, or swipe across it) |
| Explore Invitation / View Event Details / Discover Our Journey / See the Details / View Ceremony Schedule | Smooth-scroll to the right section |
| Save the Date / Add to Calendar | Downloads a real `.ics` calendar event (opens the Calendar app on iPhone) with reminders 1 day and 2 hours before |
| Get Directions / Open Google Maps | Opens the venue in Google Maps |
| Share This Invitation | Phone share sheet, or copies the link on desktop |
| Replay Opening | Plays the intro again without reloading |

## 5. Accessibility & performance

- Skip intro button and the **Esc** key always leave the intro; nothing can trap the visitor.
- Full keyboard support (gallery lightbox: ← → Esc), visible focus states, 44px+ touch targets.
- Respects "Reduce motion": the 3D and confetti effects are replaced by simple fades.
- Particles pause off-screen and in background tabs; images are lazy-loaded with responsive sizes.

## Project structure

```
src/
  config/        event.config.ts (edit me) · presets.ts · themes.ts · types.ts · useInvitation.tsx
  components/
    intro/       IntroGate (3D doors) · RibbonCutting · IntroExperience
    sections/    Hero · InvitationCard · Founder · ShowcaseGallery + Lightbox · EventCountdown
                 CeremonyTimeline · ChiefGuest · Venue · InvitationMessage · GrandFinale
    effects/     ParticleEffects (canvas) · confetti
    ui/          PremiumButton · SmartImage · Ornaments · Reveal · SectionHeading · Toaster
    demo/        DemoControls (theme / event-type switcher)
  lib/           calendar (.ics) · date (timezones) · share · dom helpers
  styles/        index.css
```

Demo photography is loaded from Unsplash (free under the Unsplash License). All names and
business details are fictional demo content.
