import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "./i18n";

/** The caption lines of the promo video, in order, as its transcript. */
export function transcript(locale: Locale): string[] {
  const vtt = readFileSync(join(process.cwd(), "public", "video", `komorebi-promo.${locale}.vtt`), "utf8").replace(/\r\n/g, "\n");
  return vtt
    .split(/\n\n+/)
    .map((block) => block.split("\n").filter((line) => line && !line.includes("-->") && line !== "WEBVTT").join(" "))
    .filter(Boolean);
}
