# Site design

The site follows the Komorebi brand (`D:\Projects\komorebi-brand\final`: `BRAND.md`, the mockups in `site\site.html` and `site\png`). This page records how the brand maps to this code.

**Variant A.** The brand board drew two website heroes: A, the very large fall (the K's light, in the fall tone) at the right of the hero, and B, a plain 44 px seal. The site was first built on B; at the owner's request it now uses **A** (November 2026), because B left out the brand's one image. The fall is the seal's K alone, drawn inline from `logo/fall.svg`'s path (`src/components/Logo.astro`, kind `fall`) in `--fall`. It stands at the right of the home hero and runs off the page; the hero clips it sideways (`overflow-x: clip`, so no horizontal scroll and no scroll container). It never sits behind reading text: wider than a phone the copy is kept narrower than the room the fall leaves (`min(36rem, 54vw)`), and on a phone, as in `a-home-*-390.png`, the fall stands at the top right and the copy starts under it. The product window sits in front of the fall's foot. The seal stays above the headline, as on the app's welcome screen.

## Rules

- **No accent colour.** The site is paper, ink and greys only. The seal was persimmon `#B3503A`; by the owner's decision of November 2026 it is neutral, to match the K icon in the app: an ink square with the K carved through to the paper in light, the reverse in dark. Its colour is one token, `--seal`, so it can be set once when the app's final icon colours are known. The favicon, the touch and manifest icons and the Open Graph cards use the neutral seal too (`public/brand/*.svg`, rendered by `pnpm og`).
- **One square.** The seal is the only square. Controls are pills (radius half the height) or circles. The docs' `<kbd>` and code use the brand's 6 px code radius.
- **Flat, with one exception.** No gradients, blur or glow. Surfaces are flat and edges are 1 px (table rules, the bottom of `<kbd>`). The exception is the product: the app's window, the screenshots and the download cards are lifted off the page by a soft layered shadow (`--lift`, `--lift-sm`; in dark a 1 px light ring and a deeper shadow), because the owner asked for the product shot to have depth. BRAND.md says "no shadow"; this is a deliberate, documented departure, kept to pictures of the app and the cards that hold the download.
- **System fonts.** Segoe UI Variable Display for headings, Segoe UI Variable Text for text, then Segoe UI and `system-ui`. No web fonts.
- **Calm motion.** Transform and opacity only, never layout. The hero copy fades in (600 ms), the fall settles in (1.6 s) and the product window rises 16 px (900 ms, transform only, so the LCP image is painted at once). The fall drifts very slowly, like light through leaves (18 s, alternate), and pauses while the hero is off screen. Sections below the first screen fade and rise 12 px as they come into view (IntersectionObserver; group items follow each other by 70 ms). Pages cross-fade in 400 ms (CSS `@view-transition`, the header bar stays put). The header's hairline appears as the page scrolls (a scroll-driven animation). Hover changes take 100 ms. BRAND.md says nothing translates; the small rises and the drift are the owner's request for motion and stay under 16 px. `prefers-reduced-motion: reduce` turns all of it off, and without JavaScript nothing is hidden: the reveal styles apply only to elements the script marks.
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
| `--seal` | `#171717` | `#F2F2F0` | the seal only (neutral; the K is carved through to `--paper`) |

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
- Type is fluid with `clamp()`: the home headline from 46 to 80 px with tight tracking (-0.035em), body from 17 to 18 px. Reading text is kept to about 68 characters a line.
- Header: a sticky bar with the wordmark, Help, Privacy, Source, a small Download pill, the language links and the theme control. Under 640 px the three links and the theme fold into a Menu button; without JavaScript the links are in the footer.
- Home, top to bottom: the hero (seal, version pill, headline, lede, Download and the product window in both themes, which opens larger), proof points with measured numbers, the launch film, four feature sections (reading, replying, rules, privacy) that alternate sides and show crops of the real 1.0 screenshots (`src/lib/shots.json`, rendered by `pnpm images`), a bento of nine tiles (small, private, native rendering, quiet, contacts, notifications and tray, encrypted cache, rules, keyboard) and an ink download panel with the release facts. The footer has the brand and three link columns.
- Help: a 240 px page list, the article column and, from 1200 px, a 200 px "On this page" list of the page's sections that marks the one being read. Pages carry a breadcrumb, a reading time, callouts (blockquotes in the Markdown), keycaps (`<kbd>Ctrl+N</kbd>` is split into keys) and previous and next cards. Under 960 px the page list becomes an "All help pages" disclosure under the page.
- Video: one player (`src/components/Player.astro`, `src/scripts/player.ts`) for the launch film and the help videos, so a video looks like part of the page and not a browser default. The video sits on the window (radius, `--lift`, canvas ground) with its poster, its box fixed by its aspect ratio (16:9 or 16:10). One large ink circle with a play triangle sits in the middle, the only control until the visitor points at the player, focuses it or pauses. The controls are one paper pill at the foot, at most 42 rem wide, with circle buttons: play and pause, a 4 px scrubber (played in ink, loaded in a grey mix of ink, a thumb on hover, focus and drag), the time, mute only when the video has sound, captions when there is a track, speed on help videos and full screen. While playing, the pill slides away after 2.2 s without the pointer moving. Captions are drawn by the page as ink pills above the controls, in the site's type. Every control has an English and a Portuguese name, the keys are Space or K, Left and Right, F, M and C, and focus is the site's ring. On a phone, full screen is the browser's own; without JavaScript it is the native `<video controls>`.
- The launch film (`public/media/komorebi-film.*`, `src/components/Film.astro`) is the brand storyboard as a 40 s silent animatic with captions in English and Portuguese. It is a section of the home page's story, right after the numbers and before the four feature sections it sums up: an eyebrow, a heading and one line like the sections around it, the player on a canvas stage as wide as the feature pictures, and one line under it. It plays itself, muted and looping, while half of it is on screen, and pauses off screen; with reduced motion or Save-Data it waits for a press. Nothing loads before it comes into view.
- Help videos: `GuideVideo` (`src/components/GuideVideo.astro`) reserves a place on every help page, under the lede, for a screen recording. It renders nothing until `public/media/guides/<slug>.webm` or `.mp4` exists (with `<slug>.webp` or `.jpg` as the poster, `<slug>.vtt` captions, and `.pt` variants for Portuguese pages, which fall back to English). It plays when pressed and loads nothing until it is pointed at.
- No horizontal scroll from 360 to 1920 px: the fall is clipped inside its section.

## Why it looks like this

The earlier site was a single column of text with one small picture, which read as dated. Contemporary product sites (Linear, Raycast, Arc, Things) lead with the product and let it carry the page; this one does the same within the brand's narrow means: no colour, so hierarchy comes from scale, weight and the ink panel; the one big image is the brand's own K; real screenshots instead of illustrations, because Komorebi's case is that it is a plain, fast native window; numbers that were measured rather than adjectives; and motion slow enough to feel like the name.

## Script

The scripts are `src/scripts/site.ts` (the theme, light, dark or system, the phone menu, the scroll reveals and the help pages' "On this page" marker, with UI SDK web components; see the README) and `src/scripts/search.ts` (the help search: a static index, `/search-en.json` and `/search-pt.json`, the field on the help home and a Ctrl+K dialog on every help page). Without them, every page still reads and every link works; the theme control, the menu button and the search field stay hidden.
