import { SITE_URL } from "../../lib/site";
import { docPages, mdUrl } from "../../lib/source";
import { getRelease } from "../../lib/upstream";

export const dynamic = "force-static";

export function GET() {
  const release = getRelease();
  const list = (locale: "en" | "pt") =>
    docPages(locale)
      .map((page) => `- [${page.data.title}](${SITE_URL}${mdUrl(page)})${page.data.description ? `: ${page.data.description}` : ""}`)
      .join("\n");
  const body = `# Komorebi

> A small, fast, free and open-source (GPL-3.0-or-later) email client for Windows 10 and 11, written in Rust with Slint. IMAP and SMTP with a local SQLite cache, its own HTML layout engine (no web engine), no AI and no telemetry. English and European Portuguese.

- Website: ${SITE_URL}
- Source: https://github.com/RusticStack/komorebi
- Latest release: ${release ? `${release.version}, ${release.htmlUrl}` : "https://github.com/RusticStack/komorebi/releases/latest"}
- Full text of the English docs: ${SITE_URL}/llms-full.txt

## Docs

${list("en")}

## Pages

- [Changelog](${SITE_URL}/changelog): every release and what it changed
- [Privacy](${SITE_URL}/privacy): what Komorebi keeps and sends
- [Code signing policy](${SITE_URL}/code-signing): how releases are signed

## Documentação em português europeu

${list("pt")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
