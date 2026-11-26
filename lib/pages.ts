import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { pageMetadata } from "./seo";
import STATIC_PAGES from "./static-pages.json";

export type StaticKey = keyof (typeof STATIC_PAGES)["en"];
export type StaticPage = { path: string; title: string; og: string; description: string };

/** Title, description and path of a page that is not MDX (home, download, changelog...). */
export function staticPage(locale: Locale, key: StaticKey): StaticPage {
  return STATIC_PAGES[locale][key];
}

export function staticKeys(): StaticKey[] {
  return Object.keys(STATIC_PAGES.en) as StaticKey[];
}

export function staticMetadata(locale: Locale, key: StaticKey): Metadata {
  const page = staticPage(locale, key);
  return pageMetadata({ locale, path: page.path, title: page.title, description: page.description, ogKey: key, absoluteTitle: true });
}
