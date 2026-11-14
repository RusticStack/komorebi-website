import { renderMarkdown } from "./markdown";
import { readUpstream } from "./upstream";

// CHANGELOG.md from the Komorebi repository at the latest release tag, in the Keep a Changelog
// format: "## [0.7.0] - 2026-10-23", then "### Added" and so on. "Unreleased" is left out.

export type ReleaseEntry = { version: string; date: string; markdown: string; html: string; id: string };

let cached: ReleaseEntry[] | null = null;

export function releases(): ReleaseEntry[] {
  if (cached) return cached;
  const text = readUpstream("CHANGELOG.md");
  const entries: ReleaseEntry[] = [];
  for (const part of text.split(/^## /m).slice(1)) {
    const head = /^\[?([^\]\s]+)\]?\s*-\s*(\d{4}-\d{2}-\d{2})/.exec(part);
    if (!head) continue;
    const markdown = part.slice(part.indexOf("\n") + 1).replace(/^\[[^\]]+\]:\s*\S+\s*$/gm, "").trim();
    const id = `v${head[1].replace(/\./g, "-")}`;
    // every release has its own "Added" and "Fixed" headings: prefix their ids with the version
    // a link relative to the app repository (docs/GPUI-MIGRATION.md) points at that file on GitHub, at this release's tag
    const html = renderMarkdown(markdown)
      .replace(/ id="/g, ` id="${id}-`)
      .replace(
        / href="(?![a-z][a-z0-9+.-]*:|#|\/)([^"]+)"/gi,
        ` href="https://github.com/RusticStack/komorebi/blob/v${head[1]}/$1"`,
      );
    entries.push({ version: head[1], date: head[2], markdown, html, id });
  }
  cached = entries;
  return entries;
}
