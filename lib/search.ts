import type { Locale } from "./i18n";

/** The static search index the command palette loads from /search-index/<lang>.json. */
export type SearchIndex = {
  suggested: { title: string; url: string; description: string }[];
  docs: { title: string; url: string; description: string; headings: { text: string; url: string }[]; text: string }[];
  pages: { title: string; url: string; description: string }[];
  shortcuts: { keys: string; action: string; url: string }[];
};

export type SearchLocale = Locale;
