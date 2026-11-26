import { readFileSync } from "node:fs";
import { join } from "node:path";

/** Questions and plain-text answers of the <Faq q="..."> blocks in an MDX file, for FAQPage JSON-LD. */
export function faqItems(file: string): { q: string; a: string }[] {
  const source = readFileSync(join(process.cwd(), file), "utf8").replace(/\r\n/g, "\n");
  return [...source.matchAll(/<Faq q="([^"]+)">\n([\s\S]*?)\n<\/Faq>/g)].map((match) => ({
    q: match[1],
    a: match[2]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/<Kbd>([^<]*)<\/Kbd>/g, "$1")
      .replace(/[*`]/g, "")
      .replace(/\s+/g, " ")
      .trim(),
  }));
}
