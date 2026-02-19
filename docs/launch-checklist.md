# Launch Checklist

## Pre-launch

- [ ] Replace placeholder coach bios in `content/coaches.ts` with real names, roles, credentials, bios, and headshots.
- [ ] Add real facility photos and hero imagery (optimized; use next/image).
- [ ] Add testimonials and before/after/results copy where desired.
- [ ] Set production env: `NEXT_PUBLIC_SITE_URL`, any analytics IDs.
- [ ] Confirm all StatStak deep links (events, leaderboard, login) point to correct URLs.
- [ ] Run `npm run build` and fix any TypeScript/ESLint errors.
- [ ] Test sticky CTA bar on mobile; confirm CTAs go to correct actions (e.g. contact or booking).
- [ ] Accessibility: run axe or Lighthouse; fix heading order, aria-labels, focus states.

## Content needed from client

- **Coaches:** Full names, titles, credentials (e.g. CSCS, PT), short bios (2–4 sentences), high-res headshots. Currently using placeholders in `content/coaches.ts`.
- **Facility:** 3–6 high-quality photos (hero, training floor, assessment/tech). Alt text for each.
- **Results:** Any approved before/after stories, leaderboard highlights, or metrics with clear definitions.
- **Rehab:** Any specific disclaimers or wording the client wants on the Rehab & Return-to-Throw page.
- **Contact:** Final booking or contact URL for “Book an Evaluation” and “View Programs” CTAs.

## Optional

- Run `npm run extract-trainers` if StatStak ever exposes structured trainer data; then wire output into `content/coaches.ts`.
- Add LocalBusiness/Organization schema values (address, phone, hours) if desired for SEO.
