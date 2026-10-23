import type { Metadata } from "next";
import { alternates, OG_LOCALE, type Locale } from "./i18n";
import { AUTHOR, REPO_URL, SITE_NAME, SITE_URL } from "./site";
import { getRelease } from "./upstream";

/** The Open Graph card rendered for a page by scripts/render-og.mjs. */
export function ogImage(locale: Locale, key: string) {
  return { url: `/og/${locale}/${key}.png`, width: 1200, height: 630, type: "image/png" };
}

/** Title, description, canonical, hreflang, Open Graph and Twitter for one page. */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  ogKey,
  type = "website",
  absoluteTitle = false,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  ogKey: string;
  type?: "website" | "article";
  absoluteTitle?: boolean;
}): Metadata {
  const image = ogImage(locale, ogKey);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: alternates(locale, path),
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      alternateLocale: [OG_LOCALE[locale === "en" ? "pt" : "en"]],
      url: alternates(locale, path).canonical,
      title,
      description,
      images: [{ ...image, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

export function softwareApplication(locale: Locale) {
  const release = getRelease();
  const pt = locale === "pt";
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    url: SITE_URL,
    description: pt
      ? "Um cliente de e-mail pequeno, rápido, livre e de código aberto para Windows 10 e 11. IMAP e SMTP com cache SQLite local. Sem IA, sem telemetria, sem motor web."
      : "A small, fast, free and open-source email client for Windows 10 and 11. IMAP and SMTP with a local SQLite cache. No AI, no telemetry, no web engine.",
    applicationCategory: "CommunicationApplication",
    applicationSubCategory: "Email client",
    operatingSystem: "Windows 10, Windows 11",
    processorRequirements: "x64",
    inLanguage: ["en", "pt-PT"],
    isAccessibleForFree: true,
    license: "https://www.gnu.org/licenses/gpl-3.0.html",
    codeRepository: REPO_URL,
    ...(release
      ? {
          softwareVersion: release.version,
          datePublished: release.publishedAt.slice(0, 10),
          downloadUrl: release.installer?.url ?? `${REPO_URL}/releases/latest`,
          installUrl: release.installer?.url ?? `${REPO_URL}/releases/latest`,
          releaseNotes: `${SITE_URL}${pt ? "/pt" : ""}/changelog`,
          ...(release.installer ? { fileSize: `${(release.installer.size / 1_000_000).toFixed(1)} MB` } : {}),
        }
      : { downloadUrl: `${REPO_URL}/releases/latest` }),
    screenshot: `${SITE_URL}/shots/inbox-light-${pt ? "pt" : "en"}.webp`,
    image: `${SITE_URL}/brand/mark-512.png`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    author: { "@type": "Person", name: AUTHOR },
    publisher: { "@type": "Organization", name: "RusticStack", url: "https://rusticstack.com" },
  };
}

export function breadcrumbs(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}
