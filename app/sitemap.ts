import type { MetadataRoute } from "next";
import { localePath } from "../lib/i18n";
import { SITE_URL } from "../lib/site";
import { docPages } from "../lib/source";

export const dynamic = "force-static";

/** Every page in both languages, each with its hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", "/changelog", "/privacy", "/code-signing", ...docPages("en").map((page) => page.url)];
  const url = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;
  return paths.flatMap((path) => {
    const languages = { en: url(localePath("en", path)), "pt-PT": url(localePath("pt", path)) };
    return [
      { url: languages.en, alternates: { languages } },
      { url: languages["pt-PT"], alternates: { languages } },
    ];
  });
}
