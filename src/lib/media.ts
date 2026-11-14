import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "./i18n";

// The videos on the site and the files that make one, found at build time by name:
//
//   public/media/<base>.webm and/or .mp4     the video (English interface)
//   public/media/<base>.webp or .jpg         its poster (`pnpm posters` makes the .webp from a .jpg)
//   public/media/<base>.vtt                  captions, when there are any
//   public/media/<base>.pt.*                 the same for Portuguese pages
//
// The launch film is <base> = komorebi-film, a help page's recording guides/<slug>. A Portuguese
// page uses the .pt video when there is one and the English one otherwise; its captions are the
// .pt track when there is one, then the English track.

export type Media = {
  sources: { src: string; type: string }[];
  poster?: string;
  captions?: { src: string; srclang: string; label: string };
  /** The video's language: "pt" when the page uses the Portuguese recording. */
  lang: Locale;
};

const PUBLIC = join(process.cwd(), "public", "media");
const has = (file: string) => existsSync(join(PUBLIC, file));
const url = (file: string) => `/media/${file}`;

const TRACK: Record<Locale, { srclang: string; label: string }> = {
  en: { srclang: "en", label: "English" },
  pt: { srclang: "pt-PT", label: "Português" },
};

export function findMedia(base: string, locale: Locale): Media | null {
  const variant = (suffix: string) =>
    [
      { file: `${base}${suffix}.webm`, type: "video/webm" },
      { file: `${base}${suffix}.mp4`, type: "video/mp4" },
    ]
      .filter((s) => has(s.file))
      .map((s) => ({ src: url(s.file), type: s.type }));
  const pt = locale === "pt" ? variant(".pt") : [];
  const sources = pt.length ? pt : variant("");
  if (!sources.length) return null;
  const suffix = pt.length ? ".pt" : "";
  const poster = [`${base}${suffix}.webp`, `${base}${suffix}.jpg`, `${base}.webp`, `${base}.jpg`].find(has);
  const track = [...(locale === "pt" ? [{ file: `${base}.pt.vtt`, lang: "pt" as const }] : []), { file: `${base}.vtt`, lang: "en" as const }].find((t) => has(t.file));
  return {
    sources,
    poster: poster ? url(poster) : undefined,
    captions: track ? { src: url(track.file), ...TRACK[track.lang] } : undefined,
    lang: pt.length ? "pt" : "en",
  };
}
