import { localePath, ui, type Locale } from "../lib/i18n";

/**
 * The Komorebi logo, the only place the site draws it. The files live in public/brand/:
 * logo.svg (dark wordmark, for light surfaces), logo-light.svg (light wordmark, for dark
 * surfaces) and mark.svg (the mark alone). A new logo replaces those files; the size here is
 * the logo's box, so a new file with another aspect ratio only needs WIDTH and HEIGHT changed.
 */
const WIDTH = 116;
const HEIGHT = 24;

export function LogoImage({ width = WIDTH, height = HEIGHT }: { width?: number; height?: number }) {
  return (
    <span className="logo">
      <img className="logo-on-light" src="/brand/logo.svg" alt="Komorebi" width={width} height={height} decoding="async" />
      <img className="logo-on-dark" src="/brand/logo-light.svg" alt="Komorebi" width={width} height={height} decoding="async" />
    </span>
  );
}

export function Logo({ locale }: { locale: Locale }) {
  return (
    <a href={localePath(locale, "/")} className="brand" aria-label={ui(locale).home}>
      <LogoImage />
    </a>
  );
}

/** The mark alone, for the footer, the 404 page and the docs home. */
export function Mark({ size = 32 }: { size?: number }) {
  return <img src="/brand/mark.svg" alt="" width={size} height={size} decoding="async" />;
}
