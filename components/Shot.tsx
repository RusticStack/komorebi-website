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
};

/**
 * A screenshot from the app's offline snapshot tool, light or dark with the visitor's colour
 * scheme. Every view is 1280 x 800 with a 640 px copy; width and height are set so the page does
 * not move while it loads.
 */
export function Shot({ name, alt, lang = "en", caption, priority = false, sizes = "(min-width: 1100px) 1040px, 100vw" }: Props) {
  const base = `/shots/${name}`;
  const set = (theme: "light" | "dark") => `${base}-${theme}-${lang}-640.webp 640w, ${base}-${theme}-${lang}.webp 1280w`;
  return (
    <figure className="shot">
      <picture>
        <source media="(prefers-color-scheme: dark)" type="image/webp" srcSet={set("dark")} sizes={sizes} />
        <img
          src={`${base}-light-${lang}.webp`}
          srcSet={set("light")}
          sizes={sizes}
          width={1280}
          height={800}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : undefined}
        />
      </picture>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
