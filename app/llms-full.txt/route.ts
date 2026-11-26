import { docPages, docsNav, pageMarkdown, sitePages, type DocPage } from "../../lib/source";

export const dynamic = "force-static";

/** Every English docs page in sidebar order, then the English site pages, as one Markdown file. */
export async function GET() {
  const pages = docPages("en");
  const ordered = docsNav("en")
    .map((item) => pages.find((page) => page.url === item.url))
    .filter((page): page is DocPage => Boolean(page));
  const texts = await Promise.all([...ordered, ...sitePages("en")].map((page) => pageMarkdown(page)));
  return new Response(texts.join("\n---\n\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
