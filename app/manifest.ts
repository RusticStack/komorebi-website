import type { MetadataRoute } from "next";

export const dynamic = "force-static";

/** The Web App Manifest: name, icons and colours for "Install" and home-screen shortcuts. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Komorebi: a small, fast email client for Windows",
    short_name: "Komorebi",
    description: "Website and documentation of Komorebi, a free and open-source email client for Windows 10 and 11.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "browser",
    lang: "en",
    background_color: "#f4f5f7",
    theme_color: "#f4f5f7",
    icons: [
      { src: "/brand/favicon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/brand/mark-192.png", type: "image/png", sizes: "192x192" },
      { src: "/brand/mark-512.png", type: "image/png", sizes: "512x512" },
      { src: "/brand/mark-512.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
    ],
  };
}
