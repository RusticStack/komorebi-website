import { notFound } from "next/navigation";
import { docPages, mdUrl, pageMarkdown, sitePages } from "../../../lib/source";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string[] }> };

const pages = () => [...docPages("en"), ...docPages("pt"), ...sitePages("en"), ...sitePages("pt")];

/** /md/<page>.md, /md/pt/<page>.md and /md/pages/<page>.md: each page as Markdown. */
export function generateStaticParams() {
  return pages().map((page) => ({ slug: mdUrl(page).slice("/md/".length).split("/") }));
}

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const page = pages().find((entry) => mdUrl(entry) === `/md/${slug.join("/")}`);
  if (!page) notFound();
  return new Response(await pageMarkdown(page), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
