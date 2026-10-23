import type { Metadata, Viewport } from "next";
import { SITE_NAME, SITE_URL } from "./site";

/** Shared by both root layouts; each page adds its own title, description and alternates. */
export function rootMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
    applicationName: SITE_NAME,
    authors: [{ name: "Mário Silva" }],
    creator: "Mário Silva",
    publisher: "RusticStack",
    formatDetection: { telephone: false, email: false, address: false },
    icons: {
      icon: [
        { url: "/brand/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      ],
      apple: "/apple-touch-icon.png",
    },
    robots: { index: true, follow: true },
  };
}

export const rootViewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f3f3" },
    { media: "(prefers-color-scheme: dark)", color: "#202020" },
  ],
};
