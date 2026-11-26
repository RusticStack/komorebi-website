import type { Metadata } from "next";
import { alternates, HTML_LANG, localePath, OG_LOCALE, type Locale } from "./i18n";
import { lastModified } from "./git-dates";
import { AUTHOR, ORG_NAME, REPO_URL, RUSTICSTACK_URL, SITE_NAME, SITE_URL } from "./site";
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
  modified,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  ogKey: string;
  type?: "website" | "article";
  absoluteTitle?: boolean;
  modified?: string;
}): Metadata {
  const image = ogImage(locale, ogKey);
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
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
      title: fullTitle,
      description,
      images: [{ ...image, alt: title }],
      ...(type === "article" && modified ? { modifiedTime: modified } : {}),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [{ url: image.url, alt: title }] },
  };
}

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const APP_ID = `${SITE_URL}/#software`;

export function organization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORG_NAME,
    url: RUSTICSTACK_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/mark-512.png`, width: 512, height: 512 },
    sameAs: ["https://github.com/RusticStack"],
  };
}

export function website(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    name: SITE_NAME,
    url: `${SITE_URL}${localePath(locale, "/")}`.replace(/\/$/, ""),
    inLanguage: ["en", "pt-PT"],
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}${localePath(locale, "/docs")}?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

const FEATURES = {
  en: [
    "IMAP and SMTP with a local SQLite cache",
    "Several accounts and a combined inbox",
    "Presets for Purelymail and Postale.io, manual settings for any IMAP and SMTP server",
    "HTML mail drawn by its own layout engine, with remote images blocked until you load them",
    "Rich-text composer with named signatures, attachments and drafts",
    "Local rules for new mail, with Copy as Sieve",
    "Contacts with optional CardDAV sync",
    "Calendar with month, week, day and agenda views and optional CalDAV sync",
    "Meeting invitations you can answer",
    "Certificate pinning for self-signed and private-CA servers",
    "Optional encrypted mail cache (AES-256-GCM)",
    "Optional Windows notifications and notification-area icon",
    "English and European Portuguese",
    "No telemetry and no AI features",
  ],
  pt: [
    "IMAP e SMTP com cache SQLite local",
    "Várias contas e uma caixa de entrada combinada",
    "Predefinições para Purelymail e Postale.io, configuração manual para qualquer servidor IMAP e SMTP",
    "E-mail HTML desenhado por um motor próprio, com as imagens remotas bloqueadas até as transferir",
    "Editor de texto formatado com assinaturas com nome, anexos e rascunhos",
    "Regras locais para o correio novo, com Copiar como Sieve",
    "Contactos com sincronização CardDAV opcional",
    "Calendário com vistas de mês, semana, dia e agenda e sincronização CalDAV opcional",
    "Convites para reuniões a que pode responder",
    "Fixação de certificados para servidores autoassinados e com AC privada",
    "Cache de correio cifrada opcional (AES-256-GCM)",
    "Notificações do Windows e ícone na área de notificação, opcionais",
    "Inglês e português europeu",
    "Sem telemetria e sem funcionalidades de IA",
  ],
};

export function softwareApplication(locale: Locale) {
  const release = getRelease();
  const pt = locale === "pt";
  const shot = (name: string, caption: string) => ({
    "@type": "ImageObject",
    url: `${SITE_URL}/shots/${name}-light-${locale}.webp`,
    width: 1280,
    height: 800,
    caption,
  });
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": APP_ID,
    name: SITE_NAME,
    url: `${SITE_URL}${localePath(locale, "/")}`.replace(/\/$/, "") || SITE_URL,
    description: pt
      ? "Um cliente de e-mail pequeno, rápido, livre e de código aberto para Windows 10 e 11. IMAP e SMTP com cache SQLite local. Sem IA, sem telemetria, sem motor web."
      : "A small, fast, free and open-source email client for Windows 10 and 11. IMAP and SMTP with a local SQLite cache. No AI, no telemetry, no web engine.",
    applicationCategory: "CommunicationApplication",
    applicationSubCategory: pt ? "Cliente de e-mail" : "Email client",
    operatingSystem: "Windows 10, Windows 11",
    processorRequirements: "x64",
    inLanguage: ["en", "pt-PT"],
    isAccessibleForFree: true,
    license: "https://spdx.org/licenses/GPL-3.0-or-later.html",
    codeRepository: REPO_URL,
    featureList: FEATURES[locale],
    screenshot: [
      shot("inbox", pt ? "A caixa de entrada no tema claro" : "The inbox in the light theme"),
      shot("compose-table", pt ? "O editor de mensagens com formatação e uma tabela" : "The composer with formatting and a table"),
      shot("calendar-month", pt ? "A vista de mês do calendário" : "The calendar month view"),
    ],
    image: `${SITE_URL}/brand/mark-512.png`,
    ...(release
      ? {
          softwareVersion: release.version,
          datePublished: release.publishedAt.slice(0, 10),
          downloadUrl: release.installer?.url ?? `${REPO_URL}/releases/latest`,
          installUrl: release.installer?.url ?? `${REPO_URL}/releases/latest`,
          releaseNotes: `${SITE_URL}${localePath(locale, "/changelog")}`,
          ...(release.installer ? { fileSize: `${(release.installer.size / 1_000_000).toFixed(1)} MB` } : {}),
        }
      : { downloadUrl: `${REPO_URL}/releases/latest` }),
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR", availability: "https://schema.org/InStock" },
    author: { "@type": "Person", name: AUTHOR },
    publisher: { "@id": ORG_ID },
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

export function techArticle({ locale, url, title, description, file, ogKey }: { locale: Locale; url: string; title: string; description: string; file: string; ogKey: string }) {
  const modified = lastModified(file);
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url: `${SITE_URL}${url}`,
    mainEntityOfPage: `${SITE_URL}${url}`,
    inLanguage: HTML_LANG[locale],
    dateModified: modified,
    image: `${SITE_URL}${ogImage(locale, ogKey).url}`,
    author: { "@type": "Person", name: AUTHOR },
    publisher: { "@id": ORG_ID },
    about: { "@id": APP_ID },
    isPartOf: { "@id": SITE_ID },
  };
}

export function faqPage(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export const VIDEO = {
  mp4: "/video/komorebi-promo.mp4",
  webm: "/video/komorebi-promo.webm",
  poster: "/video/komorebi-promo-poster",
  width: 1920,
  height: 1080,
  duration: "PT36S",
  file: "public/video/komorebi-promo.mp4",
};

export function videoObject(locale: Locale, transcript: string) {
  const pt = locale === "pt";
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: pt ? "Komorebi em 36 segundos" : "Komorebi in 36 seconds",
    description: pt
      ? "Uma volta rápida pelo Komorebi: leitura, editor de mensagens, regras, contactos, calendário e privacidade."
      : "A quick tour of Komorebi: reading, the composer, rules, contacts, the calendar and privacy.",
    thumbnailUrl: [`${SITE_URL}${VIDEO.poster}.jpg`],
    uploadDate: lastModified(VIDEO.file),
    duration: VIDEO.duration,
    contentUrl: `${SITE_URL}${VIDEO.mp4}`,
    inLanguage: HTML_LANG[locale],
    transcript,
    publisher: { "@id": ORG_ID },
  };
}
