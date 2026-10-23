import Link from "next/link";
import { localePath, ui, type Locale } from "../lib/i18n";
import { LATEST_RELEASE_URL, REPO_URL, RUSTICSTACK_URL, SITE_REPO_URL } from "../lib/site";

export function Footer({ locale }: { locale: Locale }) {
  const t = ui(locale);
  const p = (path: string) => localePath(locale, path);
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <img src="/brand/mark.svg" alt="" width={32} height={32} />
          <p>{t.footerTagline}</p>
          <p className="muted">{t.footerName}</p>
        </div>
        <nav aria-label={t.footerProject}>
          <p className="footer-title">{t.footerProject}</p>
          <ul>
            <li>
              <Link href={p("/docs")}>{t.docs}</Link>
            </li>
            <li>
              <Link href={p("/changelog")}>{t.changelog}</Link>
            </li>
            <li>
              <a href={LATEST_RELEASE_URL} rel="noopener">
                {locale === "pt" ? "Versões no GitHub" : "Releases on GitHub"}
              </a>
            </li>
            <li>
              <a href={REPO_URL} rel="noopener">
                {locale === "pt" ? "Código-fonte" : "Source code"}
              </a>
            </li>
          </ul>
        </nav>
        <nav aria-label={t.footerResources}>
          <p className="footer-title">{t.footerResources}</p>
          <ul>
            <li>
              <Link href={p("/privacy")}>{t.privacy}</Link>
            </li>
            <li>
              <Link href={p("/code-signing")}>{t.codeSigning}</Link>
            </li>
            <li>
              <a href={`${REPO_URL}/issues`} rel="noopener">
                {locale === "pt" ? "Comunicar um problema" : "Report a problem"}
              </a>
            </li>
            <li>
              <a href="/llms.txt">llms.txt</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container footer-bottom">
        <p>
          {t.footerLicense}{" "}
          <a href={RUSTICSTACK_URL} rel="noopener">
            {t.footerBy}
          </a>{" "}
          <a href={SITE_REPO_URL} rel="noopener">
            {t.footerSite}
          </a>
        </p>
      </div>
    </footer>
  );
}
