import { docPages, pageMarkdown } from "../../lib/source";

export const dynamic = "force-static";

export async function GET() {
  const pages = await Promise.all(docPages("en").map((page) => pageMarkdown(page)));
  return new Response(pages.join("\n---\n\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
