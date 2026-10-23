# Komorebi website

The website and documentation for [Komorebi](https://github.com/RusticStack/komorebi), a small, fast, free and open-source email client for Windows 10 and 11. Served at https://komorebi.rusticstack.com, in English and European Portuguese.

Next.js 16 (App Router, static export) with Fumadocs headless (`fumadocs-core`, `fumadocs-mdx`, no `fumadocs-ui`, no Tailwind). The styles are plain CSS in `app/site.css` with the system fonts, in the Fluent 2 look of the app.

## Develop

Node 22.18 or newer and pnpm.

```shell
pnpm install
pnpm dev
```

Build and preview the static output:

```shell
pnpm build
pnpm preview       # serves out/ on http://localhost:3000
pnpm check:links   # every internal link, image and #fragment in out/
pnpm typecheck
```

## What comes from the Komorebi repository

`pnpm build` first runs `scripts/upstream.mjs`. It asks the GitHub API for the latest Komorebi release and fetches `CHANGELOG.md`, `PRIVACY.md` and `README.md` at that release's tag into `.generated/` (ignored by git):

- the download button and the JSON-LD `downloadUrl` point at that release's installer;
- the Changelog page renders `CHANGELOG.md`, the Privacy page renders `PRIVACY.md`;
- the Keyboard shortcuts page is generated from the README's "Keyboard" table. Portuguese rows are translated in `lib/shortcuts.ts` by their English text; a row that has no translation yet stays in English and the build prints a warning.

When GitHub cannot be reached, the build uses the snapshot committed in `upstream/`. Refresh it after a release with `pnpm sync:upstream` and commit the result. A new Komorebi release shows on the site after the next deploy.

## Content

- Docs: `content/docs/<page>.mdx` (English) and `<page>.pt.mdx` (European Portuguese, never Brazilian). Order comes from `meta.json` and `meta.pt.json`. Every page must exist in both languages.
- Home page copy: `lib/home-copy.ts`. Interface strings: `lib/i18n.ts`.
- MDX components: `<Shot name="compose-table" alt="..." lang="pt" />` (a light and dark screenshot), `<Callout title="..." variant="caution">`, `<Shortcuts />`, `<DownloadLink />`.

English pages are at `/...`, Portuguese pages at `/pt/...`. Each language has its own root layout, so `<html lang>` is right in the HTML.

## Images

Screenshots and brand files in `public/` come from the Komorebi launch assets, made with the app's offline snapshot tool on a throwaway cache with made-up messages. `scripts/prepare-images.mjs` copies them and writes the 640 px copies; it needs sharp (`KOMOREBI_ASSET_TOOLS`), which is not a dependency of the site.

`scripts/render-og.mjs` renders the Open Graph card of every page, in both languages, with resvg and the Geist font, into `public/og/` at build time.

## Deploy

The Vercel project `komorebi-website` is linked to this repository. `vercel.json` sets the framework to none, `pnpm install --frozen-lockfile`, `pnpm build` and the output directory `out`. Pushes to `main` deploy to production; other branches get preview URLs. The domain `komorebi.rusticstack.com` points at Vercel with a DNS record in `rusticstack.com`.

## License

GPL-3.0-or-later, as Komorebi itself. See [LICENSE](LICENSE).
