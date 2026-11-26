import type { Locale } from "../lib/i18n";

/**
 * The promo video with the browser's own controls: nothing is downloaded until the visitor
 * presses play (preload="none"), it never plays by itself, and captions are a <track> in both
 * languages. Works without JavaScript.
 */
export function VideoPlayer({
  locale,
  label,
  title,
  sources,
  width,
  height,
}: {
  locale: Locale;
  label: string;
  title: string;
  sources: { mp4: string; webm: string; poster: string };
  width: number;
  height: number;
}) {
  return (
    <figure className="video">
      <video controls preload="none" playsInline poster={`${sources.poster}.webp`} width={width} height={height} aria-label={label} title={title}>
        <source src={sources.webm} type="video/webm" />
        <source src={sources.mp4} type="video/mp4" />
        <track kind="captions" src="/video/komorebi-promo.en.vtt" srcLang="en" label="English" default={locale === "en"} />
        <track kind="captions" src="/video/komorebi-promo.pt.vtt" srcLang="pt-PT" label="Português (Portugal)" default={locale === "pt"} />
        <a href={sources.mp4}>{title} (MP4)</a>
      </video>
    </figure>
  );
}
