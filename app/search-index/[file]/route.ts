import { notFound } from "next/navigation";
import { docsTasks } from "../../../lib/nav";
import { localePath, type Locale } from "../../../lib/i18n";
import { staticKeys, staticPage } from "../../../lib/pages";
import type { SearchIndex } from "../../../lib/search";
import { shortcutTable } from "../../../lib/shortcuts";
import { docPages, sitePages } from "../../../lib/source";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { params: Promise<{ file: string }> };

/** /search-index/en.json and /search-index/pt.json: what the command palette searches. */
export function generateStaticParams() {
  return [{ file: "en.json" }, { file: "pt.json" }];
}

type StructuredData = { headings?: { id: string; content: string }[]; contents?: { heading?: string; content: string }[] };

function build(locale: Locale): SearchIndex {
  const docs = docPages(locale).map((page) => {
    const structured = (page.data as unknown as { structuredData?: StructuredData }).structuredData;
    const text = (structured?.contents ?? [])
      .map((c) => c.content)
      .join(" ")
      .replace(/[*_`]/g, "")
      .replace(/\s+/g, " ")
      .slice(0, 1500);
    return {
      title: page.data.title,
      url: page.url,
      description: page.data.description ?? "",
      headings: (structured?.headings ?? []).map((h) => ({ text: h.content, url: `${page.url}#${h.id}` })),
      text,
    };
  });
  const pages = [
    ...staticKeys().map((key) => {
      const page = staticPage(locale, key);
      return { title: page.og, url: localePath(locale, page.path), description: page.description };
    }),
    ...sitePages(locale).map((page) => ({ title: page.data.heading ?? page.data.title, url: page.url, description: page.data.description ?? "" })),
  ];
  const shortcutsUrl = localePath(locale, "/docs/keyboard-shortcuts");
  const shortcuts = shortcutTable(locale).rows.map((row) => ({ keys: row.keys, action: row.action.replace(/`/g, ""), url: shortcutsUrl }));
  const suggested = docsTasks(locale).map((task) => ({ title: task.label, url: task.href, description: task.hint ?? "" }));
  return { suggested, docs, pages, shortcuts };
}

export async function GET(_request: Request, { params }: Params) {
  const { file } = await params;
  const locale = file === "en.json" ? "en" : file === "pt.json" ? "pt" : null;
  if (!locale) notFound();
  return new Response(JSON.stringify(build(locale)), { headers: { "Content-Type": "application/json; charset=utf-8" } });
}
