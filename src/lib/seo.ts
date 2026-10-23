import { localePath, type Locale } from "./i18n";
import { AUTHOR, LATEST_RELEASE_URL, REPO_URL, RUSTICSTACK_URL, SITE_NAME, SITE_URL } from "./site";
import { getRelease } from "./upstream";

export type JsonLd = Record<string, unknown>;

export function absolute(path: string): string {
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

export function organization(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RusticStack",
    url: RUSTICSTACK_URL,
    logo: `${SITE_URL}/brand/icon-512.png`,
  };
}

export function website(locale: Locale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absolute(localePath(locale, "/")),
    inLanguage: locale === "pt" ? "pt-PT" : "en",
    publisher: { "@type": "Organization", name: "RusticStack", url: RUSTICSTACK_URL },
  };
}

export function softwareApplication(locale: Locale): JsonLd {
  const release = getRelease();
  const pt = locale === "pt";
  const download = release?.installer?.url ?? LATEST_RELEASE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    url: absolute(localePath(locale, "/")),
    description: pt
      ? "Uma pequena aplicação de email privada para Windows 10 e 11. IMAP e SMTP, sem IA e sem telemetria."
      : "A small, private email app for Windows 10 and 11. IMAP and SMTP, with no AI and no telemetry.",
    applicationCategory: "CommunicationApplication",
    applicationSubCategory: "Email client",
    operatingSystem: "Windows 10, Windows 11",
    processorRequirements: "x64",
    inLanguage: ["en", "pt-PT"],
    isAccessibleForFree: true,
    license: "https://www.gnu.org/licenses/gpl-3.0.html",
    downloadUrl: download,
    installUrl: download,
    ...(release
      ? {
          softwareVersion: release.version,
          datePublished: release.publishedAt.slice(0, 10),
          releaseNotes: absolute(localePath(locale, "/changelog")),
          ...(release.installer ? { fileSize: `${(release.installer.size / 1_000_000).toFixed(1)} MB` } : {}),
        }
      : {}),
    image: `${SITE_URL}/brand/icon-512.png`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    author: { "@type": "Person", name: AUTHOR },
    publisher: { "@type": "Organization", name: "RusticStack", url: RUSTICSTACK_URL },
    sameAs: [REPO_URL],
  };
}

export function breadcrumbs(items: { name: string; path: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function faqPage(entries: { question: string; answer: string }[], locale: Locale): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale === "pt" ? "pt-PT" : "en",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}
