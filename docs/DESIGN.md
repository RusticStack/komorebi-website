# Site design

The site follows the Komorebi brand (`D:\Projects\komorebi-brand\final`: `BRAND.md`, the mockups in `site\site.html` and `site\png`). This page records how the brand maps to this code.

**Variant A.** The brand board drew two website heroes: A, the very large fall (the K's light, in the fall tone) at the right of the hero, and B, a plain 44 px seal. The site was first built on B; at the owner's request it now uses **A** (November 2026), because B left out the brand's one image. The fall is the seal's K alone, drawn inline from `logo/fall.svg`'s path (`src/components/Logo.astro`, kind `fall`) in `--fall`. It stands at the right of the home hero and runs off the page; the hero clips it sideways (`overflow-x: clip`, so no horizontal scroll and no scroll container). It never sits behind reading text: wider than a phone the copy is kept narrower than the room the fall leaves (`min(36rem, 54vw)`), and on a phone, as in `a-home-*-390.png`, the fall stands at the top right and the copy starts under it. The product window sits in front of the fall's foot. The persimmon seal stays above the headline, as on the app's welcome screen.

## Rules

- **One colour.** The persimmon seal `#B3503A` is the only colour, and it only fills the seal (`src/components/Logo.astro`). It is never text, a link, a button or a state. Everything else is paper, ink and greys.
- **One square.** The seal is the only square. Controls are pills (radius half the height) or circles. The docs' `<kbd>` and code use the brand's 6 px code radius.
- **Flat.** No gradients, blur, glow or shadows. The one edge is 1 px: table rules and the bottom of `<kbd>`.
- **System fonts.** Segoe UI Variable Display for headings, Segoe UI Variable Text for text, then Segoe UI and `system-ui`. No web fonts.
- **Calm motion.** Colour and opacity changes of 100 ms on hover, a 250 ms fade for the search dialog; nothing moves. `prefers-reduced-motion: reduce` turns all of it off.
- **Focus.** Keyboard focus is one 2 px ink ring with a 2 px paper gap (`outline` with `outline-offset`), following the pill.

## Tokens

All in `src/styles/site.css` as custom properties on `:root`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#FFFFFF` | `#141414` | page ground |
| `--canvas` | `#F6F6F4` | `#1B1B1B` | search field, tip boxes, code, picture frame |
| `--wash` | `#EEEEEB` | `#262626` | current page in the help list, secondary button |
| `--fall` | `#F3F3F0` | `#1D1D1D` | the fall only (BRAND.md site values) |
| `--line` | `#E2E2DE` | `#2C2C2C` | the 1 px edge |
| `--ink` | `#171717` | `#F2F2F0` | text, primary button, focus ring |
| `--ink-2` | `#555552` | `#B0B0AC` | secondary text |
| `--ink-3` | `#6A6A66` | `#939390` | captions, small print |
| `--on-ink` | `#FFFFFF` | `#141414` | text on ink |
| `--seal` | `#B3503A` | `#B3503A` | the seal only |

Contrast (WCAG 2), lowest pair per text colour:

| Text | Light (on wash) | Dark (on wash) | On paper, light / dark |
|---|---|---|---|
| ink | 15.42 | 13.50 | 17.93 / 16.44 |
| ink-2 | 6.43 | 6.96 | 7.48 / 8.47 |
| ink-3 | 4.67 | 4.91 | 5.43 / 5.98 |
| on-ink on ink | 17.93 | 16.44 | |

Every text pair passes AA (4.5:1).

The theme follows Windows (`prefers-color-scheme`). The theme control in the header (light, dark or system) sets `data-color-scheme` on `<html>` and remembers it in `localStorage`; "system" goes back to following Windows.

## Layout

- Content width 1184 px (the mockup's 1312 px frame less its gutters), gutters from 16 px on a phone to 64 px, set with `clamp()`.
- Type is fluid with `clamp()`: the hero from 46 to 64 px, body from 17 to 18 px.
- Header: wordmark, Help, Privacy, Source, a small Download pill, the language links and the theme control. Under 640 px the three links and the theme fold into a Menu button; without JavaScript the links are in the footer, as in the mockup.
- Help: a 240 px page list beside a 680 px column. Under 960 px the list becomes an "All help pages" disclosure under the page.

## Script

The scripts are `src/scripts/site.ts` (the theme, light, dark or system, and the phone menu, with UI SDK web components; see the README) and `src/scripts/search.ts` (the help search: a static index, `/search-en.json` and `/search-pt.json`, the field on the help home and a Ctrl+K dialog on every help page). Without them, every page still reads and every link works; the theme control, the menu button and the search field stay hidden.
