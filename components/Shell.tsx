import type { ReactNode } from "react";
import { HTML_LANG, ui, type Locale } from "../lib/i18n";
import { Footer } from "./Footer";
import { Header } from "./Header";

/** The document for one language: each language has its own root layout, so <html lang> is right in the HTML. */
export function Shell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={HTML_LANG[locale]}>
      <body>
        <a className="skip-link" href="#main">
          {ui(locale).skip}
        </a>
        <Header locale={locale} />
        {children}
        <Footer locale={locale} />
      </body>
    </html>
  );
}
