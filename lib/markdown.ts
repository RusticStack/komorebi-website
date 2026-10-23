import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

/**
 * Markdown from the Komorebi repository to HTML, at build time. The input is the project's own
 * CHANGELOG.md and PRIVACY.md; raw HTML in it is dropped (remark-rehype's default).
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const file = await remark().use(remarkGfm).use(remarkRehype).use(rehypeSlug).use(rehypeStringify).process(markdown);
  return String(file)
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, "</table></div>")
    .replace(/<a href="(https?:[^"]+)"/g, '<a href="$1" rel="noopener"');
}

export type Heading = { id: string; text: string; depth: number };

/** h2 and h3 of rendered HTML, for a table of contents. */
export function headings(html: string): Heading[] {
  const out: Heading[] = [];
  for (const match of html.matchAll(/<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g)) {
    out.push({ depth: Number(match[1]), id: match[2], text: match[3].replace(/<[^>]+>/g, "") });
  }
  return out;
}

/** The changelog as the site shows it: no title, no empty Unreleased section, plain version headings. */
export function prepareChangelog(markdown: string): string {
  return markdown
    .replace(/^# Changelog\n+/, "")
    .replace(/^## \[Unreleased\]\n+(?=## )/m, "")
    .replace(/^## \[([^\]]+)\] - (\d{4}-\d{2}-\d{2})/gm, "## $1 ($2)");
}

/** The privacy statement without its title and date lines, which the page shows itself. */
export function preparePrivacy(markdown: string): { body: string; updated: string | null } {
  const updated = /^Last updated: (\d{4}-\d{2}-\d{2})/m.exec(markdown)?.[1] ?? null;
  const body = markdown.replace(/^# .+\n+/, "").replace(/^Last updated: .+\n+/m, "");
  return { body, updated };
}
