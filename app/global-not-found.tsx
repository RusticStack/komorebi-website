import type { Metadata } from "next";
import "./site.css";

export const metadata: Metadata = {
  title: "Page not found | Komorebi",
  robots: { index: false },
};

/** The 404 page for both languages: the URL may be in either, so it says it in both. */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <main id="main" className="container not-found">
          <img src="/brand/mark.svg" alt="" width={64} height={64} />
          <h1>Page not found</h1>
          <p>The page you asked for does not exist or has moved.</p>
          <p className="actions">
            <a className="button primary" href="/">
              Komorebi home
            </a>
            <a className="button secondary" href="/docs">
              Read the docs
            </a>
          </p>
          <div lang="pt-PT">
            <h2>Página não encontrada</h2>
            <p>A página que procura não existe ou mudou de sítio.</p>
            <p className="actions">
              <a className="button secondary" href="/pt">
                Página inicial
              </a>
              <a className="button secondary" href="/pt/docs">
                Ler a documentação
              </a>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
