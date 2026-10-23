import type { Locale } from "./i18n";

export function manifest(locale: Locale) {
  const pt = locale === "pt";
  return {
    name: "Komorebi",
    short_name: "Komorebi",
    description: pt ? "Uma pequena aplicação de email privada para Windows." : "A small, private email app for Windows.",
    lang: pt ? "pt-PT" : "en",
    start_url: pt ? "/pt" : "/",
    scope: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/brand/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/brand/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
  };
}
