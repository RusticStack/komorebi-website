import type { MetadataRoute } from "next";
import { docFile } from "../components/DocArticle";
import { siteFile } from "../components/SiteArticle";
import { lastModified } from "../lib/git-dates";
import { localePath } from "../lib/i18n";
import { staticKeys, staticPage } from "../lib/pages";
import { SITE_URL } from "../lib/site";
import { docPages, sitePages } from "../lib/source";

export const dynamic = "force-static";

/** The source files a static page is built from, for its <lastmod>. */
const STATIC_FILES: Record<string, string[]> = {
  home: ["components/Home.tsx", "lib/home-copy.ts"],
  download: ["components/DownloadPage.tsx", "upstream/release.json"],
  changelog: ["components/ChangelogPage.tsx", "upstream/CHANGELOG.md"],
  privacy: ["components/PrivacyPage.tsx", "upstream/PRIVACY.md"],
  "code-signing": ["components/CodeSigningPage.tsx"],
};

/** Every page in both languages, each with its hreflang alternates and the git date of its sources. */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: { path: string; files: string[] }[] = [
    ...staticKeys().map((key) => ({ path: staticPage("en", key).path, files: STATIC_FILES[key] ?? [] })),
    ...docPages("en").map((page) => {
      const pt = docPages("pt").find((p) => p.slugs.join("/") === page.slugs.join("/"));
      return { path: page.url, files: [docFile(page), ...(pt ? [docFile(pt)] : [])] };
    }),
    ...sitePages("en").map((page) => {
      const pt = sitePages("pt").find((p) => p.slugs.join("/") === page.slugs.join("/"));
      return { path: page.url, files: [siteFile(page), ...(pt ? [siteFile(pt)] : [])] };
    }),
  ];
  const url = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;
  return entries.flatMap(({ path, files }) => {
    const languages = { en: url(localePath("en", path)), "pt-PT": url(localePath("pt", path)), "x-default": url(localePath("en", path)) };
    const lastModifiedDate = lastModified(...files);
    return [
      { url: languages.en, lastModified: lastModifiedDate, alternates: { languages } },
      { url: languages["pt-PT"], lastModified: lastModifiedDate, alternates: { languages } },
    ];
  });
}
