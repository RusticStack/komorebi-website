// The product pictures: crops of the real Komorebi 1.0 screenshots, made by
// scripts/prepare-images.mjs from the table in shots.json (keep both in step).
import table from "./shots.json";

export type ShotName = Exclude<keyof typeof table, "_">;
export type Theme = "light" | "dark";
type Crop = { src: string; x: number; y: number; w: number; h: number; widths: number[] };

export function crop(name: ShotName): Crop {
  return table[name] as Crop;
}

export function srcset(name: ShotName, theme: Theme, ext: "avif" | "webp"): string {
  return crop(name)
    .widths.map((w) => `/shots/${name}-${theme}-${w}.${ext} ${w}w`)
    .join(", ");
}

/** The largest file: the img fallback. */
export function fallback(name: ShotName, theme: Theme): string {
  const widths = crop(name).widths;
  return `/shots/${name}-${theme}-${widths[widths.length - 1]}.webp`;
}

/** The hero window's box: the content width, at most 74rem (gutters are 1rem to 4rem). */
const BOX = "calc(100vw - 2 * clamp(1rem, 5vw - 0.5rem, 4rem))";
export const PHONE = "(max-width: 640px)";
export const HERO_SIZES = `(min-width: 1312px) 1184px, ${BOX}`;
export const HERO_PHONE_SIZES = BOX;
/** A 1 x 1 transparent GIF: what the hero picture of the other theme loads (see HeroPicture.astro). */
export const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

/** Preload hints for the hero picture that matches the visitor's system theme and width. */
export function heroPreloads() {
  return (["light", "dark"] as Theme[]).flatMap((theme) => [
    { srcset: srcset("hero-phone", theme, "avif"), sizes: HERO_PHONE_SIZES, type: "image/avif", media: `${PHONE} and (prefers-color-scheme: ${theme})` },
    { srcset: srcset("hero", theme, "avif"), sizes: HERO_SIZES, type: "image/avif", media: `(min-width: 641px) and (prefers-color-scheme: ${theme})` },
  ]);
}
