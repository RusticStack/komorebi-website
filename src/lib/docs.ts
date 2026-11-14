import { readFileSync } from "node:fs";
import { join } from "node:path";
import { localePath, type Locale } from "./i18n";
import { headings, renderMarkdown, splitFrontMatter, textOf } from "./markdown";

// The help pages live in src/content/docs/<locale>/<slug>.md. Each has a title and a description
// in its front matter. The groups below are the "I want to..." list on the help home and the order
// of the page list and of the previous and next links.

export const DOC_GROUPS: { key: string; title: Record<Locale, string>; pages: string[] }[] = [
  { key: "start", title: { en: "Get started", pt: "Começar" }, pages: ["getting-started", "adding-an-account"] },
  {
    key: "daily",
    title: { en: "Daily use", pt: "No dia a dia" },
    pages: ["composer", "signatures", "rules", "contacts", "notifications-and-tray"],
  },
  {
    key: "private",
    title: { en: "Keep it private", pt: "Manter a privacidade" },
    pages: ["privacy-and-network", "certificates", "encrypted-cache", "updates", "remove-your-data"],
  },
  {
    key: "reference",
    title: { en: "Reference", pt: "Referência" },
    pages: ["keyboard-shortcuts", "faq", "building-from-source"],
  },
];

export const DOC_SLUGS = DOC_GROUPS.flatMap((group) => group.pages);

export type Doc = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  /** The short line under the title. */
  lede: string;
  group: string;
  path: string;
  html: string;
  markdown: string;
  text: string;
  words: number;
  minutes: number;
  /** The page's h2 headings, for its table of contents. */
  toc: { id: string; text: string }[];
  /** Question and answer pairs, for the FAQ page's FAQPage JSON-LD. */
  faq: { question: string; answer: string }[];
};

const cache = new Map<string, Doc>();

function load(locale: Locale, slug: string): Doc {
  const key = `${locale}/${slug}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const file = join(process.cwd(), "src", "content", "docs", locale, `${slug}.md`);
  const { data, body } = splitFrontMatter(readFileSync(file, "utf8"));
  if (!data.title || !data.description) throw new Error(`${key}.md needs a title and a description`);
  const html = renderMarkdown(body);
  const text = textOf(html);
  const words = text.split(/\s+/).filter(Boolean).length;
  const group = DOC_GROUPS.find((g) => g.pages.includes(slug))!.key;
  const faq: Doc["faq"] = [];
  if (slug === "faq") {
    for (const match of html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2|$)/g)) {
      faq.push({ question: textOf(match[1]), answer: textOf(match[2]) });
    }
  }
  const doc: Doc = {
    slug,
    locale,
    title: data.title,
    description: data.description,
    lede: data.lede ?? data.description,
    group,
    path: localePath(locale, `/docs/${slug}`),
    html,
    markdown: body.trim(),
    text,
    words,
    minutes: Math.max(1, Math.round(words / 200)),
    toc: headings(html),
    faq,
  };
  cache.set(key, doc);
  return doc;
}

export function getDoc(locale: Locale, slug: string): Doc {
  return load(locale, slug);
}

export function getDocs(locale: Locale): Doc[] {
  return DOC_SLUGS.map((slug) => load(locale, slug));
}

export function neighbours(locale: Locale, slug: string): { previous: Doc | null; next: Doc | null } {
  const at = DOC_SLUGS.indexOf(slug);
  return {
    previous: at > 0 ? load(locale, DOC_SLUGS[at - 1]) : null,
    next: at < DOC_SLUGS.length - 1 ? load(locale, DOC_SLUGS[at + 1]) : null,
  };
}
