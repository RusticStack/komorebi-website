// The product picture's files, made by scripts/prepare-images.mjs (keep the widths in step).
export const WIDE = [800, 1312, 1920, 2560];
export const COMPACT = [720, 1440, 1800];
export const WIDE_SIZES = "(min-width: 1440px) 1312px, 90vw";
/** On a phone the compact picture is cropped to the left half of a 9:14 box. */
export const COMPACT_SIZES = "calc(200vw - 64px)";
export const PHONE = "(max-width: 640px)";

export function srcset(theme: string, size: "wide" | "compact", ext: "avif" | "webp"): string {
  const widths = size === "wide" ? WIDE : COMPACT;
  return widths.map((w) => `/preview/inbox-${theme}-${size}-${w}.${ext} ${w}w`).join(", ");
}

/** Preload hints for the picture that matches the visitor's system theme and width. */
export function previewPreloads() {
  return ["light", "dark"].flatMap((theme) => [
    {
      srcset: srcset(theme, "compact", "avif"),
      sizes: COMPACT_SIZES,
      type: "image/avif",
      media: `${PHONE} and (prefers-color-scheme: ${theme})`,
    },
    {
      srcset: srcset(theme, "wide", "avif"),
      sizes: WIDE_SIZES,
      type: "image/avif",
      media: `(min-width: 641px) and (prefers-color-scheme: ${theme})`,
    },
  ]);
}
