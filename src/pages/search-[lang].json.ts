import type { APIRoute, GetStaticPaths } from "astro";
import { getDocs } from "../lib/docs";
import { LOCALES, type Locale } from "../lib/i18n";

// The static index behind the help search: title, lede and plain text of every help page.
export const getStaticPaths = (() => LOCALES.map((lang) => ({ params: { lang } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const docs = getDocs(params.lang as Locale).map((doc) => ({ t: doc.title, d: doc.lede, u: doc.path, x: doc.text }));
  return new Response(JSON.stringify(docs), { headers: { "Content-Type": "application/json; charset=utf-8" } });
};
