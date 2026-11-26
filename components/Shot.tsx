import type { Locale } from "../lib/i18n";

type Props = {
  /** A view name from public/shots, such as "compose-table". */
  name: string;
  alt: string;
  lang?: Locale;
  caption?: string;
  /** The hero image: loaded first, never lazily. */
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * A screenshot from the app's offline snapshot tool, light or dark with the visitor's colour
 * scheme, in AVIF with a WebP fallback. Every view is 1280 x 800 with a 640 px copy; width and
 * height are set so the page does not move while it loads. The dark sources carry
 * data-scheme="dark" so a scheme forced with the theme button can switch them (lib/theme.ts).
 */
export function Shot({ name, alt, lang = "en", caption, priority = false, sizes = "(min-width: 1100px) 760px, 100vw", className }: Props) {
  const base = `/shots/${name}`;
  const set = (theme: "light" | "dark", ext: "avif" | "webp") => `${base}-${theme}-${lang}-640.${ext} 640w, ${base}-${theme}-${lang}.${ext} 1280w`;
  return (
    <figure className={className ? `shot ${className}` : "shot"}>
      <picture>
        <source data-scheme="dark" media="(prefers-color-scheme: dark)" type="image/avif" srcSet={set("dark", "avif")} sizes={sizes} suppressHydrationWarning />
        <source data-scheme="dark" media="(prefers-color-scheme: dark)" type="image/webp" srcSet={set("dark", "webp")} sizes={sizes} suppressHydrationWarning />
        <source type="image/avif" srcSet={set("light", "avif")} sizes={sizes} />
        <img
          src={`${base}-light-${lang}.webp`}
          srcSet={set("light", "webp")}
          sizes={sizes}
          width={1280}
          height={800}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : undefined}
        />
      </picture>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
