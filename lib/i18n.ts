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

/** The path without its language prefix. */
export function barePath(path: string): string {
  return path === "/pt" ? "/" : path.startsWith("/pt/") ? path.slice(3) : path;
}

/** The same page in the other language, from a path in either. */
export function switchPath(path: string, to: Locale): string {
  return localePath(to, barePath(path));
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
  navMenu: "Main menu",
  features: "Features",
  docs: "Docs",
  docsMenu: "More in the docs",
  allDocs: "All docs",
  iWantTo: "I want to",
  popular: "Popular pages",
  download: "Download",
  downloadFor: "Download for Windows",
  changelog: "Changelog",
  privacy: "Privacy",
  codeSigning: "Code signing policy",
  about: "About Komorebi",
  github: "Source code on GitHub",
  menu: "Menu",
  closeMenu: "Close menu",
  language: "Language",
  theme: "Colour scheme",
  themeSystem: "Colour scheme: system. Switch to light",
  themeLight: "Colour scheme: light. Switch to dark",
  themeDark: "Colour scheme: dark. Follow the system",
  themeShortSystem: "System",
  themeShortLight: "Light",
  themeShortDark: "Dark",
  search: "Search",
  searchDocs: "Search docs",
  searchPlaceholder: "Search docs, pages and shortcuts",
  searchClose: "Close search",
  searchEmpty: "No results for",
  searchSuggested: "Suggested",
  searchGroupDocs: "Docs",
  searchGroupPages: "Pages",
  searchGroupShortcuts: "Shortcuts",
  searchHintMove: "to move",
  searchHintOpen: "to open",
  searchHintClose: "to close",
  searchUnavailable: "Search is not available right now. The docs index lists every page.",
  footerTagline: "A small, fast email client for Windows 10 and 11.",
  footerName: "Komorebi is Japanese for sunlight filtering through leaves.",
  footerLicense: "Free and open source under GPL-3.0-or-later.",
  footerIndependent:
    "Komorebi is an independent open-source project by RusticStack. It is not affiliated with or endorsed by Microsoft, Mozilla, eM Client, Purelymail or Postale.io. Product names are trademarks of their owners.",
  footerSite: "Source of this site",
  footerBy: "A RusticStack project",
  footerProduct: "Product",
  footerDocs: "Docs",
  footerCompare: "Compare",
  footerProject: "Project",
  releasesFeed: "Releases feed (Atom)",
  reportProblem: "Report a problem",
  releasesOnGitHub: "Releases on GitHub",
  docsNav: "Documentation",
  onThisPage: "On this page",
  previous: "Previous",
  next: "Next",
  nextSteps: "Next steps",
  editPage: "Edit this page on GitHub",
  helpful: "Was this page helpful?",
  helpfulLink: "Tell us what to improve",
  lastUpdated: "Last updated",
  breadcrumb: "Breadcrumb",
  pager: "Previous and next page",
  copy: "Copy",
  copied: "Copied",
  copyCode: "Copy code",
  notFoundTitle: "Page not found",
  notFoundText: "The page you asked for does not exist or has moved.",
  readDocs: "Read the docs",
  goHome: "Go home",
  tip: "Tip",
  note: "Note",
  warning: "Warning",
  advanced: "Advanced",
  checked: "Checked on",
};

export type UiStrings = Record<keyof typeof EN, string>;

const PT: UiStrings = {
  skip: "Saltar para o conteúdo",
  home: "Página inicial do Komorebi",
  nav: "Principal",
  navMenu: "Menu principal",
  features: "Funcionalidades",
  docs: "Documentação",
  docsMenu: "Mais na documentação",
  allDocs: "Toda a documentação",
  iWantTo: "Quero",
  popular: "Páginas populares",
  download: "Transferir",
  downloadFor: "Transferir para Windows",
  changelog: "Alterações",
  privacy: "Privacidade",
  codeSigning: "Política de assinatura de código",
  about: "Sobre o Komorebi",
  github: "Código-fonte no GitHub",
  menu: "Menu",
  closeMenu: "Fechar o menu",
  language: "Idioma",
  theme: "Esquema de cores",
  themeSystem: "Esquema de cores: sistema. Mudar para claro",
  themeLight: "Esquema de cores: claro. Mudar para escuro",
  themeDark: "Esquema de cores: escuro. Seguir o sistema",
  themeShortSystem: "Sistema",
  themeShortLight: "Claro",
  themeShortDark: "Escuro",
  search: "Pesquisar",
  searchDocs: "Pesquisar na documentação",
  searchPlaceholder: "Pesquisar documentação, páginas e atalhos",
  searchClose: "Fechar a pesquisa",
  searchEmpty: "Sem resultados para",
  searchSuggested: "Sugestões",
  searchGroupDocs: "Documentação",
  searchGroupPages: "Páginas",
  searchGroupShortcuts: "Atalhos",
  searchHintMove: "para mover",
  searchHintOpen: "para abrir",
  searchHintClose: "para fechar",
  searchUnavailable: "A pesquisa não está disponível agora. O índice da documentação lista todas as páginas.",
  footerTagline: "Um cliente de e-mail pequeno e rápido para Windows 10 e 11.",
  footerName: "Komorebi é a palavra japonesa para a luz do sol que passa entre as folhas.",
  footerLicense: "Livre e de código aberto, com a licença GPL-3.0-or-later.",
  footerIndependent:
    "O Komorebi é um projeto de código aberto independente da RusticStack. Não tem ligação nem aprovação da Microsoft, da Mozilla, da eM Client, da Purelymail nem da Postale.io. Os nomes de produtos são marcas dos respetivos donos.",
  footerSite: "Código deste site",
  footerBy: "Um projeto RusticStack",
  footerProduct: "Produto",
  footerDocs: "Documentação",
  footerCompare: "Comparar",
  footerProject: "Projeto",
  releasesFeed: "Feed de versões (Atom)",
  reportProblem: "Comunicar um problema",
  releasesOnGitHub: "Versões no GitHub",
  docsNav: "Documentação",
  onThisPage: "Nesta página",
  previous: "Anterior",
  next: "Seguinte",
  nextSteps: "Próximos passos",
  editPage: "Editar esta página no GitHub",
  helpful: "Esta página foi útil?",
  helpfulLink: "Diga-nos o que melhorar",
  lastUpdated: "Última atualização",
  breadcrumb: "Localização",
  pager: "Página anterior e seguinte",
  copy: "Copiar",
  copied: "Copiado",
  copyCode: "Copiar o código",
  notFoundTitle: "Página não encontrada",
  notFoundText: "A página que procura não existe ou mudou de sítio.",
  readDocs: "Ler a documentação",
  goHome: "Página inicial",
  tip: "Dica",
  note: "Nota",
  warning: "Atenção",
  advanced: "Avançado",
  checked: "Verificado em",
};

export function ui(locale: Locale): UiStrings {
  return locale === "pt" ? PT : EN;
}
