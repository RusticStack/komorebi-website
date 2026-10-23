import { defineI18n } from "fumadocs-core/i18n";

export const i18n = defineI18n({
  languages: ["en", "pt"],
  defaultLanguage: "en",
  hideLocale: "default-locale",
  parser: "dot",
  fallbackLanguage: null,
});

export type Locale = "en" | "pt";
export const LOCALES: Locale[] = ["en", "pt"];

/** The value for <html lang> and hreflang. The site's Portuguese is European Portuguese only. */
export const HTML_LANG: Record<Locale, string> = { en: "en", pt: "pt-PT" };
export const OG_LOCALE: Record<Locale, string> = { en: "en_GB", pt: "pt_PT" };

/** A site path in a locale: "/docs" becomes "/pt/docs" in Portuguese. */
export function localePath(locale: Locale, path: string): string {
  if (locale === "en") return path;
  return path === "/" ? "/pt" : `/pt${path}`;
}

/** The same page in the other language, from a path in either. */
export function switchPath(path: string, to: Locale): string {
  const bare = path === "/pt" ? "/" : path.startsWith("/pt/") ? path.slice(3) : path;
  return localePath(to, bare);
}

/** canonical and hreflang alternates for a page that exists in both languages. */
export function alternates(locale: Locale, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: {
      en: localePath("en", path),
      "pt-PT": localePath("pt", path),
      "x-default": localePath("en", path),
    },
  };
}

const EN = {
  skip: "Skip to content",
  home: "Komorebi home",
  nav: "Main",
  docs: "Docs",
  changelog: "Changelog",
  privacy: "Privacy",
  codeSigning: "Code signing policy",
  github: "GitHub",
  menu: "Menu",
  language: "Language",
  otherLanguage: "Português",
  otherLanguageShort: "PT",
  otherLanguageLabel: "Ler em português",
  footerTagline: "A small, fast email client for Windows 10 and 11.",
  footerName: "Komorebi is Japanese for sunlight filtering through leaves.",
  footerLicense: "Free and open source under GPL-3.0-or-later.",
  footerSite: "Source of this site",
  footerBy: "A RusticStack project.",
  footerProject: "Project",
  footerResources: "Resources",
  docsNav: "Documentation",
  onThisPage: "On this page",
  previous: "Previous",
  next: "Next",
  editPage: "Edit this page on GitHub",
  lastUpdated: "Last updated",
  breadcrumb: "Breadcrumb",
  pager: "Previous and next page",
  notFoundTitle: "Page not found",
  notFoundText: "The page you asked for does not exist or has moved.",
  readDocs: "Read the docs",
  goHome: "Go home",
};

export type UiStrings = Record<keyof typeof EN, string>;

const PT: UiStrings = {
  skip: "Saltar para o conteúdo",
  home: "Página inicial do Komorebi",
  nav: "Principal",
  docs: "Documentação",
  changelog: "Alterações",
  privacy: "Privacidade",
  codeSigning: "Política de assinatura de código",
  github: "GitHub",
  menu: "Menu",
  language: "Idioma",
  otherLanguage: "English",
  otherLanguageShort: "EN",
  otherLanguageLabel: "Read in English",
  footerTagline: "Um cliente de e-mail pequeno e rápido para Windows 10 e 11.",
  footerName: "Komorebi é a palavra japonesa para a luz do sol que passa entre as folhas.",
  footerLicense: "Livre e de código aberto, com a licença GPL-3.0-or-later.",
  footerSite: "Código deste site",
  footerBy: "Um projeto RusticStack.",
  footerProject: "Projeto",
  footerResources: "Recursos",
  docsNav: "Documentação",
  onThisPage: "Nesta página",
  previous: "Anterior",
  next: "Seguinte",
  editPage: "Editar esta página no GitHub",
  lastUpdated: "Última atualização",
  breadcrumb: "Localização",
  pager: "Página anterior e seguinte",
  notFoundTitle: "Página não encontrada",
  notFoundText: "A página que procura não existe ou mudou de sítio.",
  readDocs: "Ler a documentação",
  goHome: "Página inicial",
};

export function ui(locale: Locale): UiStrings {
  return locale === "pt" ? PT : EN;
}
