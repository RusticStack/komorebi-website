import { localePath, type Locale } from "./i18n";

export type Link = { href: string; label: string; hint?: string };

/** Primary items of the top bar. `match` decides which one is current for a path. */
export function primaryNav(locale: Locale) {
  const pt = locale === "pt";
  const p = (path: string) => localePath(locale, path);
  return [
    { key: "features", href: `${p("/")}#features`, label: pt ? "Funcionalidades" : "Features", match: null },
    { key: "docs", href: p("/docs"), label: pt ? "Documentação" : "Docs", match: p("/docs") },
    { key: "download", href: p("/download"), label: pt ? "Transferir" : "Download", match: p("/download") },
    { key: "changelog", href: p("/changelog"), label: pt ? "Alterações" : "Changelog", match: p("/changelog") },
  ];
}

/** The "I want to..." tasks: the docs flyout, the docs home and the mobile sheet share them. */
export function docsTasks(locale: Locale): Link[] {
  const pt = locale === "pt";
  const p = (path: string) => localePath(locale, path);
  return pt
    ? [
        { href: p("/docs/getting-started"), label: "Instalar o Komorebi", hint: "Transferir, confirmar e instalar" },
        { href: p("/docs/adding-an-account"), label: "Adicionar uma conta", hint: "Três passos curtos" },
        { href: p("/docs/composer"), label: "Escrever e-mail formatado", hint: "Negrito, listas, tabelas" },
        { href: p("/docs/rules"), label: "Organizar o correio com regras", hint: "Mover, marcar, eliminar" },
        { href: p("/docs/calendar"), label: "Usar o calendário", hint: "Local ou CalDAV" },
        { href: p("/docs/privacy-and-network"), label: "Saber o que sai do computador", hint: "Cada ligação, uma a uma" },
      ]
    : [
        { href: p("/docs/getting-started"), label: "Install Komorebi", hint: "Download, check and install" },
        { href: p("/docs/adding-an-account"), label: "Add an account", hint: "Three short steps" },
        { href: p("/docs/composer"), label: "Write formatted mail", hint: "Bold, lists, tables" },
        { href: p("/docs/rules"), label: "Sort mail with rules", hint: "Move, mark, delete" },
        { href: p("/docs/calendar"), label: "Use the calendar", hint: "Local or CalDAV" },
        { href: p("/docs/privacy-and-network"), label: "See what leaves my PC", hint: "Every connection, one by one" },
      ];
}

export function popularDocs(locale: Locale): Link[] {
  const pt = locale === "pt";
  const p = (path: string) => localePath(locale, path);
  return [
    { href: p("/docs/keyboard-shortcuts"), label: pt ? "Atalhos de teclado" : "Keyboard shortcuts" },
    { href: p("/docs/purelymail"), label: pt ? "Configurar a Purelymail" : "Set up Purelymail" },
    { href: p("/docs/faq"), label: pt ? "Perguntas frequentes" : "FAQ" },
  ];
}

export function footerNav(locale: Locale) {
  const pt = locale === "pt";
  const p = (path: string) => localePath(locale, path);
  return {
    product: [
      { href: `${p("/")}#features`, label: pt ? "Funcionalidades" : "Features" },
      { href: p("/download"), label: pt ? "Transferir" : "Download" },
      { href: p("/changelog"), label: pt ? "Alterações" : "Changelog" },
      { href: p("/about"), label: pt ? "Sobre o Komorebi" : "About Komorebi" },
    ],
    docs: [
      { href: p("/docs/getting-started"), label: pt ? "Instalar" : "Install" },
      { href: p("/docs/adding-an-account"), label: pt ? "Adicionar uma conta" : "Add an account" },
      { href: p("/docs/keyboard-shortcuts"), label: pt ? "Atalhos de teclado" : "Keyboard shortcuts" },
      { href: p("/docs/faq"), label: pt ? "Perguntas frequentes" : "FAQ" },
    ],
    compare: [
      { href: p("/free-email-client-for-windows"), label: pt ? "Cliente de e-mail gratuito" : "Free email client for Windows" },
      { href: p("/email-client-without-telemetry"), label: pt ? "Sem telemetria" : "Email client without telemetry" },
      { href: p("/imap-email-client-for-windows"), label: pt ? "Cliente IMAP para Windows" : "IMAP email client for Windows" },
      { href: p("/outlook-alternative"), label: pt ? "Alternativa ao Outlook" : "Outlook alternative" },
      { href: p("/thunderbird-alternative"), label: pt ? "Alternativa ao Thunderbird" : "Thunderbird alternative" },
      { href: p("/em-client-alternative"), label: pt ? "Alternativa ao eM Client" : "eM Client alternative" },
    ],
  };
}
