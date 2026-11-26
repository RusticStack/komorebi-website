import type { ReactNode } from "react";
import { HTML_LANG, ui, type Locale } from "../lib/i18n";
import { PICTURE_SCHEME_SCRIPT, SCHEME_INIT_SCRIPT } from "../lib/theme";
import { Footer } from "./Footer";
import { Header } from "./Header";

/** The document for one language: each language has its own root layout, so <html lang> is right in the HTML. */
export function Shell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={HTML_LANG[locale]} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCHEME_INIT_SCRIPT }} />
        <link rel="alternate" type="application/atom+xml" title={locale === "pt" ? "Versões do Komorebi" : "Komorebi releases"} href="/releases.xml" />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {ui(locale).skip}
        </a>
        <Header locale={locale} />
        {children}
        <Footer locale={locale} />
        <script dangerouslySetInnerHTML={{ __html: PICTURE_SCHEME_SCRIPT }} />
      </body>
    </html>
  );
}
