import type { APIRoute } from "astro";
import { getDocs } from "../lib/docs";
import { absolute } from "../lib/seo";

export const GET: APIRoute = () => {
  const parts = getDocs("en").map((doc) => `# ${doc.title}\n\nSource: ${absolute(doc.path)}\n\n${doc.lede}\n\n${doc.markdown}\n`);
  return new Response(`${parts.join("\n")}`, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
