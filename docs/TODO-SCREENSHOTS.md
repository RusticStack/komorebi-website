# Product picture: placeholder until real screenshots exist

The home page shows one picture of the product, below the hero. Komorebi is moving to GPUI in the new brand, and screenshots of that app do not exist yet. Until they do, the picture is a **design preview**: the brand mockup render of the inbox, not a screenshot.

## What is there now

- Source: `F:\Projects\komorebi-brand\final\app\app.html`, views `light-inbox-wide`, `dark-inbox-wide`, `light-inbox-compact`, `dark-inbox-compact` (the same views as `app\png\inbox-*.png`), rendered at 2x with the brand's `tools\shot.js` (grayscale text, sRGB).
- Files: `public/preview/inbox-{light,dark}-{wide,compact}-<width>.{avif,webp}`, made by `pnpm images <folder>` (`scripts/prepare-images.mjs`).
- Markup: `src/components/ProductPicture.astro`, used by `src/views/Home.astro`. Both carry a comment that marks the placeholder.
- Words: the alt text is "Komorebi inbox, design preview" ("Caixa de entrada do Komorebi, pré-visualização do design"), and the caption says "A design preview of the inbox". The page never calls it a screenshot.

## To replace it with real screenshots

1. Take the inbox of the GPUI app with the made-up sample mail (no real accounts), light and dark, at a 1280 x 800 window (wide) and a 900 x 700 window (compact), at 200 percent scale.
2. Save them as `inbox-light-wide.png`, `inbox-dark-wide.png`, `inbox-light-compact.png` and `inbox-dark-compact.png` in one folder, and run `pnpm images <that folder>`.
3. In `src/views/Home.astro`, change the alt text to "Komorebi inbox" ("Caixa de entrada do Komorebi"), change the caption back to "The inbox. Komorebi follows the Windows theme, light or dark." ("A caixa de entrada. O Komorebi segue o tema do Windows, claro ou escuro."), and remove the placeholder comments there and in `ProductPicture.astro`.
4. Delete this file.

Old screenshots of the Slint app must not come back: they show the old look and the old blue logo.

## The launch film

`src/components/Film.astro` renders nothing until `public/media/komorebi-film.webm` or `.mp4` exists (with an optional `komorebi-film.<locale>.vtt` caption track and `komorebi-film-poster.webp`). The film itself (`F:\Projects\komorebi-brand\final\LAUNCH.md`) has not been made in the new style yet.
