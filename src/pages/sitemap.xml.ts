import type { APIRoute } from "astro";
import { localePath } from "../lib/i18n";
import { allPages, lastModified } from "../lib/pages";
import { absolute } from "../lib/seo";

export const GET: APIRoute = () => {
  const urls = allPages().flatMap((page) => {
    const lastmod = lastModified(page);
    const links = [
      `<xhtml:link rel="alternate" hreflang="en" href="${absolute(localePath("en", page.path))}"/>`,
      `<xhtml:link rel="alternate" hreflang="pt-PT" href="${absolute(localePath("pt", page.path))}"/>`,
      `<xhtml:link rel="alternate" hreflang="x-default" href="${absolute(localePath("en", page.path))}"/>`,
    ].join("");
    return (["en", "pt"] as const).map(
      (locale) => `<url><loc>${absolute(localePath(locale, page.path))}</loc><lastmod>${lastmod}</lastmod>${links}</url>`,
    );
  });
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
