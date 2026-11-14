# Komorebi website

The website and help pages for [Komorebi](https://github.com/RusticStack/komorebi), a small, private email app for Windows 10 and 11. Served at https://komorebi.rusticstack.com, in English and European Portuguese.

Astro, static output, one hand-written stylesheet (`src/styles/site.css`) and a few scripts: the interactive parts are [UI SDK](https://ui-sdk.dev) web components (see below), and the help search is `src/scripts/search.ts`. Every page reads without JavaScript. The look is the Komorebi brand, website variant A; see [docs/DESIGN.md](docs/DESIGN.md).

## Develop

Node 22.18 or newer and pnpm.

```shell
pnpm install
pnpm dev
```

Build and check the static output in `dist/`:

```shell
pnpm build
pnpm preview
pnpm typecheck     # astro check
pnpm check:links   # every internal link, image and #fragment
pnpm check:seo     # title, description, canonical, hreflang and JSON-LD on every page; no title twice
pnpm check:csp     # the Content-Security-Policy in vercel.json matches the inline code in dist; no other inline code
pnpm csp:update    # rewrite the policy's hashes in vercel.json after editing site.css or the head script
pnpm serve         # serve dist with vercel.json's headers and redirects (use it, not preview, to see the CSP or run Lighthouse)
pnpm words         # help page word counts, now and on origin/main
```

## What comes from the Komorebi repository

`pnpm build` first runs `scripts/upstream.mjs`. It asks the GitHub API for the latest Komorebi release, reads the installer's SHA-256 from its `.sha256` asset, and fetches `CHANGELOG.md`, `PRIVACY.md` and `README.md` at that release's tag into `.generated/` (ignored by git):

- the download buttons and the JSON-LD `downloadUrl` point at that release's installer, `komorebi-<version>-setup.exe`, or at `releases/latest` when there is none;
- the download page shows the version, size and date, and the installer and (from 1.0 on) the portable zip, `komorebi-<version>-portable-x64.zip`, each with its SHA-256 from the installer's `.sha256` asset or from the release's `SHA256SUMS`;
- the Changelog page and `/releases.xml` (RSS) render `CHANGELOG.md`; the Privacy page renders `PRIVACY.md` under a ten-line summary.

When GitHub cannot be reached, the build uses the snapshot committed in `upstream/` (`KOMOREBI_UPSTREAM_OFFLINE=1` forces it). Refresh it after a release with `pnpm sync:upstream` and commit the result.

To see the site as it will be for a version that is not released yet, point `KOMOREBI_UPSTREAM_LOCAL` at a Komorebi checkout and build: `$env:KOMOREBI_UPSTREAM_LOCAL = '..\komorebi'; pnpm build` in PowerShell. It takes the three files from that checkout, the version from its `Cargo.toml`, dates its "Unreleased" changelog entry today and uses the file names the release will have, without sizes or hashes. Such a build is for checking only; never deploy it.

## Content

- Help pages: `src/content/docs/en/<slug>.md` and `src/content/docs/pt/<slug>.md` (European Portuguese, AO90). Front matter: `title`, `lede` (the line under the title) and `description` (the meta description). The groups and order are in `src/lib/docs.ts`. Every page exists in both languages. Keep each page to one screen: numbered steps, keys as `<kbd>`, a tip as a blockquote that starts with a bold line.
- Other pages: `src/views/*.astro`, routed for both languages by `src/pages/[...path].astro`. Interface strings: `src/lib/i18n.ts`.
- English pages are at `/...`, Portuguese pages at `/pt/...`.

## Interactive parts: UI SDK

The interactive parts use [UI SDK](https://ui-sdk.dev) (Vercel Labs, [source](https://github.com/vercel-labs/ui), Apache-2.0, which GPL-3.0 code may use): unstyled behaviour primitives that handle the keyboard, focus and ARIA, and leave the look to us. We use its **web components** (`@ui-sdk/web` over `@ui-sdk/core`), the build that needs no framework runtime, so the site has no React, Vue, Svelte or Solid and no hydration: the `<ui-*>` elements are written straight into the `.astro` files as static HTML and upgrade when their module loads. `src/styles/site.css` styles them with the site's own tokens, by element name (which also holds before they upgrade) and their `data-*` and ARIA states; `@layer ui-sdk;` at its top keeps UI SDK's few injected rules below ours.

| Where | Component | Loaded |
|---|---|---|
| Every page: light, dark or system theme | `createColorScheme` and `preferencesScript` from `@ui-sdk/core`, `<ui-preferences>`, `<ui-segmented-control>` | `src/scripts/site.ts`, a module on every page |
| Every page: the menu on a phone | `<ui-collapsible>` (wider screens keep it open and lay it out as the header row) | same |
| Every page, wider than a phone: the theme icons' names | `<ui-tooltip>`, one shared, opened from code | on the first hover or keyboard focus of the theme control |
| Help pages on a tablet or phone: All help pages | `<ui-collapsible>` | with the rest of `site.ts` |
| Download: installer or portable zip | `<ui-tabs>` (only when the release has both) | that page only |
| Home: the product picture, larger | `<ui-dialog>` | on the first hover, focus or press of the picture |

The theme choice is saved in `localStorage` under `color-scheme` and written on `<html>` as `data-color-scheme`. `preferencesScript` makes the inline script at the top of `<head>` at build time (`src/layouts/Base.astro`), so a saved choice is on `<html>` before the first paint and there is no flash of the other theme; "system" follows `prefers-color-scheme` in CSS, before any script runs. A choice saved by the old toggle (`theme`) is moved over once. The search dialog stays a native `<dialog>`, and the changelog's earlier releases stay `<details>`: both work without a script.

Without JavaScript the theme control and the menu button are not shown, the phone menu's links are in the footer, the help page list stays open and the Download options show as cards side by side.

**Versions.** `@ui-sdk/core` and `@ui-sdk/web` are pinned to exactly `0.1.0-beta.1`, the npm `latest`. `0.1.0-beta.2` (tag `beta`) was under a day old when this was set up, younger than pnpm's minimum release age, so it was not taken instead of adding an exception to that policy; move both to the same newer version together, and read the release notes first.

**Trade-offs.** UI SDK is a beta: its APIs and markup may change before 1.0, so upgrades need a look at every `<ui-*>` here. It costs more script than the 2 KB `site.js` it replaces, about 29 KB gzipped on every page and 33 KB on Download (`dist/_astro`), plus about 21 KB for the tooltip and about 37 KB for the lightbox, each loaded only when it is about to be used; all of it is deferred module script and nothing blocks the first paint. In return the theme switch, the menu, the tabs and the dialog get UI SDK's tested keyboard, focus and ARIA behaviour (radio group, disclosure, APG tabs, modal dialog with focus return). `@astrojs/react` islands were not needed: every component used is in the web components build. A closed collapsible panel is hidden by an `!important` rule in UI SDK's layer, which is why the header's panel is kept open on wider screens by the script rather than shown by CSS.

## Images

- Logo and wordmark: `src/components/Logo.astro` and `public/brand/` (from the brand folder).
- The product pictures are crops of the real Komorebi 1.0 screenshots, light and dark (1280 x 800 windows, made-up demo mail, `.github/assets/screenshots` in the app repository). The crops are listed in `src/lib/shots.json`; `pnpm images <that folder>` encodes them to AVIF and WebP in `public/shots/`.
- The launch film, `public/media/komorebi-film.webm` and `.mp4` (40 s, silent, 1920 x 1080, about 0.8 and 0.5 MB) with its poster and an English and a Portuguese caption track, is made from the brand storyboard (`launch/launch.html` in the brand folder, the nine frames rendered with the neutral seal, frame 5 replaced by the real 1.0 inbox, the tray frame left out) with 400 ms cross-fades in ffmpeg. `src/components/Film.astro` shows it on the home page only when the files exist.
- `pnpm og` renders the Open Graph cards (`public/og/`) and the PNG icons with resvg. The output is committed; run it on Windows, where the line is set in Segoe UI.

## Content-Security-Policy

`vercel.json` sends the policy as a header on every page, with `Cross-Origin-Opener-Policy: same-origin`. Everything is `'self'` (no third-party origin is loaded) plus exactly two inline items, allowed by SHA-256 and with no `'unsafe-inline'` anywhere: the head script in `src/layouts/Base.astro` (theme, `js` class) and the one stylesheet Astro inlines. Page scripts are same-origin modules (`assetsInlineLimit: 0` keeps Vite from inlining the small ones), and the JSON-LD blocks are data, which a CSP does not govern.

`scripts/check-csp.mjs` runs at the end of `pnpm build`. It hashes every inline script and style in `dist/`, rebuilds the policy from them, and fails when `vercel.json` differs, when a page has other inline code, an inline event handler, a `style=""` attribute or a load from another origin. Edited `site.css` or the head script? `pnpm csp:update` writes the new hashes; commit `vercel.json`.

UI SDK needs no `'unsafe-inline'` for styles: it normally adds its few rules in a `<style>` element, but with `<meta property="csp-nonce" content="">` in the head (see `Base.astro`) it uses adopted style sheets, which the policy allows, and its other styling is CSSOM (`element.style.setProperty`), which CSP does not block. `connect-src` is `'self'` because the only run-time fetch is the help search index; the Download page's release data is read at build time.

## Deploy

The Vercel project `komorebi-website` is linked to this repository. `vercel.json` sets the framework to none, `pnpm install --frozen-lockfile`, `pnpm build`, the output directory `dist` and redirects for renamed help pages. Pushes to `main` deploy to production; other branches get preview URLs.

## License

GPL-3.0-or-later, as Komorebi itself. See [LICENSE](LICENSE).
