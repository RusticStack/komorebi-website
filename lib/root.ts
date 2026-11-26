import type { Metadata, Viewport } from "next";
import { AUTHOR, ORG_NAME, SITE_NAME, SITE_URL } from "./site";

/** Shared by both root layouts; each page adds its own title, description and alternates. */
export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
    applicationName: SITE_NAME,
    authors: [{ name: AUTHOR }],
    creator: AUTHOR,
    publisher: ORG_NAME,
    formatDetection: { telephone: false, email: false, address: false },
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/brand/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      ],
      apple: "/apple-touch-icon.png",
    },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  };
}

/** The bar and page colours of each scheme (see app/site.css), for the browser's own chrome. */
export const rootViewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1d20" },
  ],
};
