import { loader } from "fumadocs-core/source";
import { renderPlaceholder } from "fumadocs-core/mdx-plugins/remark-llms.runtime";
import type { Item, Node } from "fumadocs-core/page-tree";
import { docs } from "../.source/server";
import { i18n, type Locale } from "./i18n";
import { shortcutsMarkdown } from "./shortcuts";
import { SITE_URL } from "./site";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  i18n,
});

export type DocPage = (typeof source)["$inferPage"];

export function docPages(locale: Locale): DocPage[] {
  return source.getPages(locale);
}

export type NavItem = { title: string; url: string };

/** The docs pages of a locale in sidebar order. */
export function docsNav(locale: Locale): NavItem[] {
  const walk = (nodes: Node[]): Item[] =>
    nodes.flatMap((node) => {
      if (node.type === "page") return [node];
      if (node.type === "folder") return [...(node.index ? [node.index] : []), ...walk(node.children)];
      return [];
    });
  return walk(source.getPageTree(locale).children).map((item) => ({
    title: typeof item.name === "string" ? item.name : String(item.name ?? ""),
    url: item.url,
  }));
}

type Attributes = Record<string, unknown>;

const placeholders = {
  Shortcuts: ({ attributes }: { attributes: Attributes }) =>
    shortcutsMarkdown(attributes.lang === "pt" ? "pt" : "en"),
  Shot: ({ attributes }: { attributes: Attributes }) =>
    `![${String(attributes.alt ?? "")}](${SITE_URL}/shots/${String(attributes.name)}-light-${attributes.lang === "pt" ? "pt" : "en"}.webp)`,
  DownloadLink: () => `[Download the latest release](https://github.com/RusticStack/komorebi/releases/latest)`,
};

/** <Callout> blocks become Markdown quotes with a bold title. */
function callouts(markdown: string) {
  return markdown.replace(/<Callout([^>]*)>\n?([\s\S]*?)\n?<\/Callout>/g, (_, attrs: string, text: string) => {
    const title = /title="([^"]*)"/.exec(attrs)?.[1] ?? "Note";
    const lines = text
      .trim()
      .split("\n")
      .map((line) => `> ${line}`.trimEnd());
    return [`> **${title}**`, ">", ...lines].join("\n");
  });
}

export function mdUrl(page: DocPage): string {
  const prefix = page.locale === "pt" ? "/md/pt" : "/md";
  return `${prefix}/${page.slugs.length ? page.slugs.join("/") : "index"}.md`;
}

/** Markdown of a page, with its title on top. Used by llms.txt, llms-full.txt and the /md routes. */
export async function pageMarkdown(page: DocPage): Promise<string> {
  const body = callouts(await renderPlaceholder(await page.data.getText("processed"), placeholders));
  const desc = page.data.description ? `\n\n> ${page.data.description}` : "";
  return `# ${page.data.title}${desc}\n\nPage: ${SITE_URL}${page.url}\n\n${body.trim()}\n`;
}
