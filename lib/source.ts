import { loader } from "fumadocs-core/source";
import { renderPlaceholder } from "fumadocs-core/mdx-plugins/remark-llms.runtime";
import type { Node } from "fumadocs-core/page-tree";
import { docs, pages as pagesCollection } from "../.source/server";
import { i18n, type Locale } from "./i18n";
import { shortcutsMarkdown } from "./shortcuts";
import { SITE_URL } from "./site";
import { downloadTarget } from "./upstream";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  i18n,
});

/** About and the search-intent pages, at the site root: /about, /pt/about and so on. */
export const pagesSource = loader({
  baseUrl: "/",
  source: pagesCollection.toFumadocsSource(),
  i18n,
});

export type DocPage = (typeof source)["$inferPage"];
export type SitePage = (typeof pagesSource)["$inferPage"];

export function docPages(locale: Locale): DocPage[] {
  return source.getPages(locale);
}

export function sitePages(locale: Locale): SitePage[] {
  return pagesSource.getPages(locale);
}

export type NavItem = { title: string; url: string };
export type NavGroup = { title: string | null; items: NavItem[] };

/** The docs sidebar of a locale: groups from the separators in meta.json, in order. */
export function docsGroups(locale: Locale): NavGroup[] {
  const groups: NavGroup[] = [{ title: null, items: [] }];
  const label = (url: string, name: unknown) => {
    const page = docPages(locale).find((p) => p.url === url);
    return page?.data.nav ?? (typeof name === "string" ? name : String(name ?? ""));
  };
  const walk = (nodes: Node[]) => {
    for (const node of nodes) {
      if (node.type === "separator") groups.push({ title: typeof node.name === "string" ? node.name : String(node.name ?? ""), items: [] });
      else if (node.type === "page") groups[groups.length - 1].items.push({ title: label(node.url, node.name), url: node.url });
      else if (node.type === "folder") {
        if (node.index) groups[groups.length - 1].items.push({ title: label(node.index.url, node.index.name), url: node.index.url });
        walk(node.children);
      }
    }
  };
  walk(source.getPageTree(locale).children);
  return groups.filter((group) => group.items.length > 0);
}

/** The docs pages of a locale in sidebar order. */
export function docsNav(locale: Locale): NavItem[] {
  return docsGroups(locale).flatMap((group) => group.items);
}

type Attributes = Record<string, unknown>;

const text = (value: unknown) => String(value ?? "");

const placeholders = {
  Shortcuts: ({ attributes }: { attributes: Attributes }) => shortcutsMarkdown(attributes.lang === "pt" ? "pt" : "en"),
  Shot: ({ attributes }: { attributes: Attributes }) =>
    `![${text(attributes.alt)}](${SITE_URL}/shots/${text(attributes.name)}-light-${attributes.lang === "pt" ? "pt" : "en"}.webp)`,
  DownloadLink: () => `[${downloadTarget().release?.installer?.name ?? "the latest release"}](${downloadTarget().href})`,
  Checked: ({ attributes }: { attributes: Attributes }) => `Checked on ${text(attributes.date)}.`,
};

/** <Callout>, <Advanced> and <Step> blocks become plain Markdown. */
function plain(markdown: string) {
  return markdown
    .replace(/<Callout([^>]*)>\n?([\s\S]*?)\n?<\/Callout>/g, (_, attrs: string, body: string) => {
      const title = /title="([^"]*)"/.exec(attrs)?.[1] ?? (/type="warning"/.test(attrs) ? "Warning" : /type="tip"/.test(attrs) ? "Tip" : "Note");
      return [`> **${title}**`, ">", ...body.trim().split("\n").map((line) => `> ${line}`.trimEnd())].join("\n");
    })
    .replace(/<Advanced([^>]*)>\n?/g, (_, attrs: string) => `**${/title="([^"]*)"/.exec(attrs)?.[1] ?? "Advanced"}**\n\n`)
    .replace(/<\/Advanced>/g, "")
    .replace(/<Faq q="([^"]*)">\n?/g, "### $1\n\n")
    .replace(/<\/Faq>/g, "")
    .replace(/<\/?(Steps|NextSteps|Compare)[^>]*>/g, "")
    .replace(/<Step title="([^"]*)"[^>]*>\n?/g, "1. **$1**\n\n")
    .replace(/<\/Step>/g, "")
    .replace(/<Kbd>([^<]*)<\/Kbd>/g, "`$1`")
    .replace(/\n{3,}/g, "\n\n");
}

export function mdUrl(page: DocPage | SitePage): string {
  const isDoc = page.url.startsWith("/docs") || page.url.startsWith("/pt/docs");
  const prefix = page.locale === "pt" ? "/md/pt" : "/md";
  const slug = page.slugs.length ? page.slugs.join("/") : "index";
  return isDoc ? `${prefix}/${slug}.md` : `${prefix}/pages/${slug}.md`;
}

/** Markdown of a page, with its title on top. Used by llms.txt, llms-full.txt and the /md routes. */
export async function pageMarkdown(page: DocPage | SitePage): Promise<string> {
  const body = plain(await renderPlaceholder(await page.data.getText("processed"), placeholders));
  const desc = page.data.description ? `\n\n> ${page.data.description}` : "";
  return `# ${page.data.title}${desc}\n\nPage: ${SITE_URL}${page.url}\n\n${body.trim()}\n`;
}
