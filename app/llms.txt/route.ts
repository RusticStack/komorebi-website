import { SITE_URL } from "../../lib/site";
import { docPages, docsGroups, mdUrl, sitePages, type DocPage } from "../../lib/source";
import { getRelease } from "../../lib/upstream";

export const dynamic = "force-static";

export function GET() {
  const release = getRelease();
  const docs = (locale: "en" | "pt") => {
    const pages = docPages(locale);
    return docsGroups(locale)
      .map((group) => {
        const lines = group.items
          .map((item) => pages.find((page) => page.url === item.url))
          .filter((page): page is DocPage => Boolean(page))
          .map((page) => `- [${page.data.title}](${SITE_URL}${mdUrl(page)})${page.data.description ? `: ${page.data.description}` : ""}`);
        return `${group.title ? `### ${group.title}\n\n` : ""}${lines.join("\n")}`;
      })
      .join("\n\n");
  };
  const pages = (locale: "en" | "pt") =>
    sitePages(locale)
      .map((page) => `- [${page.data.title}](${SITE_URL}${mdUrl(page)})${page.data.description ? `: ${page.data.description}` : ""}`)
      .join("\n");
  const body = `# Komorebi

> A small, fast, free and open-source (GPL-3.0-or-later) email client for Windows 10 and 11, written in Rust with Slint. IMAP and SMTP with a local SQLite cache, its own HTML layout engine (no web engine), no AI and no telemetry. English and European Portuguese.

- Website: ${SITE_URL}
- Source: https://github.com/RusticStack/komorebi
- Latest release: ${release ? `${release.version}, ${release.htmlUrl}` : "https://github.com/RusticStack/komorebi/releases/latest"}
- Download page: ${SITE_URL}/download
- Releases feed (Atom): ${SITE_URL}/releases.xml
- Full text of the English docs: ${SITE_URL}/llms-full.txt

## Docs

${docs("en")}

## Pages

${pages("en")}
- [Changelog](${SITE_URL}/changelog): every release and what it changed
- [Privacy](${SITE_URL}/privacy): what Komorebi keeps and sends
- [Code signing policy](${SITE_URL}/code-signing): how releases are signed

## Documentação em português europeu

${docs("pt")}

## Páginas em português europeu

${pages("pt")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
