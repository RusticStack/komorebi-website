import { execFileSync } from "node:child_process";
import { DOC_SLUGS } from "./docs";
import { getRelease } from "./upstream";

// Every indexable page, by its path without the language prefix, with the files it is made from,
// for the sitemap's <lastmod>.

export type PageEntry = { path: string; sources: string[]; release?: boolean };

export function allPages(): PageEntry[] {
  return [
    { path: "/", sources: ["src/views/Home.astro"] },
    { path: "/download", sources: ["src/views/Download.astro"], release: true },
    { path: "/docs", sources: ["src/views/DocsHome.astro", "src/content/docs"] },
    ...DOC_SLUGS.map((slug) => ({
      path: `/docs/${slug}`,
      sources: [`src/content/docs/en/${slug}.md`, `src/content/docs/pt/${slug}.md`],
    })),
    { path: "/privacy", sources: ["src/views/Privacy.astro"], release: true },
    { path: "/changelog", sources: ["src/views/Changelog.astro"], release: true },
    { path: "/code-signing", sources: ["src/views/CodeSigning.astro"] },
    { path: "/about", sources: ["src/views/About.astro"] },
  ];
}

function gitDate(args: string[]): string | null {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cs", ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
}

/** The newest of: the last commit that touched the page's files, and the release it shows. */
export function lastModified(page: PageEntry): string {
  const dates = [gitDate(["--", ...page.sources]) ?? gitDate([])];
  if (page.release) dates.push(getRelease()?.publishedAt.slice(0, 10) ?? null);
  const known = dates.filter((d): d is string => Boolean(d)).sort();
  return known.at(-1) ?? new Date().toISOString().slice(0, 10);
}
