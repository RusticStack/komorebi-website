import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

const processor = remark()
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeSlug)
  .use(rehypeStringify, { allowDangerousHtml: true });

/**
 * Markdown to HTML. Tables get a scrolling wrapper so a wide one never widens the page. A key
 * combination, <kbd>Ctrl+Shift+V</kbd>, becomes one keycap per key inside an outer <kbd> (the
 * HTML way to write a combination). A blockquote is a callout: the help pages write a tip as a
 * blockquote that starts with a bold line.
 */
export function renderMarkdown(markdown: string): string {
  return String(processor.processSync(markdown))
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, "</table></div>")
    .replace(/<kbd>([^<]+)<\/kbd>/g, (whole, keys: string) => {
      const parts = keys.split(/\+(?=.)/);
      if (parts.length < 2) return whole;
      return `<kbd class="combo">${parts.map((k) => `<kbd>${k}</kbd>`).join('<span class="plus">+</span>')}</kbd>`;
    })
    .replace(/<blockquote>/g, '<blockquote class="callout">');
}

/** The h2 headings of a rendered page, for its table of contents (rehype-slug gives the ids). */
export function headings(html: string): { id: string; text: string }[] {
  return [...html.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g)].map((m) => ({ id: m[1], text: textOf(m[2]) }));
}

/** Plain text of an HTML fragment, for the search index, word counts and llms-full.txt. */
export function textOf(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** A tiny front matter reader: "key: value" lines between two "---" lines. */
export function splitFrontMatter(source: string): { data: Record<string, string>; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(source.replace(/\r\n/g, "\n"));
  if (!match) return { data: {}, body: source };
  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const at = line.indexOf(":");
    if (at > 0) data[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  return { data, body: source.slice(match[0].length) };
}
