import type { Metadata } from "next";
import { SCHEME_INIT_SCRIPT } from "../lib/theme";
import "./globals.css";
import "./site.css";

export const metadata: Metadata = {
  title: "Page not found | Komorebi",
  robots: { index: false },
};

/** The 404 page for both languages: the URL may be in either, so it says it in both. */
export default function GlobalNotFound() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCHEME_INIT_SCRIPT }} />
      </head>
      <body>
        <main id="main" className="not-found">
          <img src="/brand/mark.svg" alt="" width={64} height={64} />
          <h1>Page not found</h1>
          <p>The page you asked for does not exist or has moved.</p>
          <p className="actions">
            <a role="button" href="/">
              Komorebi home
            </a>
            <a role="button" className="secondary outline" href="/docs">
              Read the docs
            </a>
          </p>
          <div lang="pt-PT">
            <h2>Página não encontrada</h2>
            <p>A página que procura não existe ou mudou de sítio.</p>
            <p className="actions">
              <a role="button" className="secondary outline" href="/pt">
                Página inicial
              </a>
              <a role="button" className="secondary outline" href="/pt/docs">
                Ler a documentação
              </a>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
