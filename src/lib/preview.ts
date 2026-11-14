// The product picture's files, made by scripts/prepare-images.mjs (keep the widths in step).
// The wide picture is 1280 px at most. The compact one is its own left half, 450 px at most: a
// phone shows only that half (the sidebar and the list), so the other half is never sent.
export const WIDE = [800, 1280];
export const COMPACT = [360, 450];
/** The picture's box: the content width, at most 74rem (the page's gutters are 1rem to 4rem). */
export const BOX = "calc(100vw - 2 * clamp(1rem, 5vw - 0.5rem, 4rem))";
export const WIDE_SIZES = `(min-width: 1312px) 1184px, ${BOX}`;
export const COMPACT_SIZES = BOX;
export const PHONE = "(max-width: 640px)";
/** A 1 x 1 transparent GIF: what the picture of the other theme loads (see ProductPicture.astro). */
export const BLANK = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

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
