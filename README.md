# Komorebi website

The website and help pages for [Komorebi](https://github.com/RusticStack/komorebi), a small, private email app for Windows 10 and 11. Served at https://komorebi.rusticstack.com, in English and European Portuguese.

Astro, static output, one hand-written stylesheet (`src/styles/site.css`) and one small script (`public/site.js`, the theme toggle and the help search). Every page reads without JavaScript. The look is the Komorebi brand, website variant B; see [docs/DESIGN.md](docs/DESIGN.md).

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
pnpm words         # help page word counts, now and on origin/main
```

## What comes from the Komorebi repository

`pnpm build` first runs `scripts/upstream.mjs`. It asks the GitHub API for the latest Komorebi release, reads the installer's SHA-256 from its `.sha256` asset, and fetches `CHANGELOG.md`, `PRIVACY.md` and `README.md` at that release's tag into `.generated/` (ignored by git):

- the download buttons and the JSON-LD `downloadUrl` point at that release's installer, or at `releases/latest` when there is none;
- the download page shows the version, size, date and SHA-256;
- the Changelog page and `/releases.xml` (RSS) render `CHANGELOG.md`; the Privacy page renders `PRIVACY.md` under a ten-line summary.

When GitHub cannot be reached, the build uses the snapshot committed in `upstream/` (`KOMOREBI_UPSTREAM_OFFLINE=1` forces it). Refresh it after a release with `pnpm sync:upstream` and commit the result.

## Content

- Help pages: `src/content/docs/en/<slug>.md` and `src/content/docs/pt/<slug>.md` (European Portuguese, AO90). Front matter: `title`, `lede` (the line under the title) and `description` (the meta description). The groups and order are in `src/lib/docs.ts`. Every page exists in both languages. Keep each page to one screen: numbered steps, keys as `<kbd>`, a tip as a blockquote that starts with a bold line.
- Other pages: `src/views/*.astro`, routed for both languages by `src/pages/[...path].astro`. Interface strings: `src/lib/i18n.ts`.
- English pages are at `/...`, Portuguese pages at `/pt/...`.

## Images

- Logo and wordmark: `src/components/Logo.astro` and `public/brand/` (from the brand folder).
- The product picture on the home page is a design preview until real screenshots of the new app exist: see [docs/TODO-SCREENSHOTS.md](docs/TODO-SCREENSHOTS.md). `pnpm images <folder>` encodes it to AVIF and WebP in `public/preview/`.
- `pnpm og` renders the Open Graph cards (`public/og/`) and the PNG icons with resvg. The output is committed; run it on Windows, where the line is set in Segoe UI.

## Deploy

The Vercel project `komorebi-website` is linked to this repository. `vercel.json` sets the framework to none, `pnpm install --frozen-lockfile`, `pnpm build`, the output directory `dist` and redirects for renamed help pages. Pushes to `main` deploy to production; other branches get preview URLs.

## License

GPL-3.0-or-later, as Komorebi itself. See [LICENSE](LICENSE).
