import Link from "next/link";
import { ui, type Locale } from "../lib/i18n";
import { footerNav } from "../lib/nav";
import { ISSUES_URL, LATEST_RELEASE_URL, REPO_URL, RUSTICSTACK_URL, SITE_REPO_URL } from "../lib/site";
import { localePath } from "../lib/i18n";
import { Mark } from "./Logo";

function Column({ title, links }: { title: string; links: { href: string; label: string; external?: boolean }[] }) {
  return (
    <nav aria-label={title}>
      <p className="footer-title">{title}</p>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            {link.external || !link.href.startsWith("/") ? (
              <a href={link.href} rel="noopener">
                {link.label}
              </a>
            ) : link.href.endsWith(".xml") || link.href.endsWith(".txt") ? (
              <a href={link.href}>{link.label}</a>
            ) : (
              <Link href={link.href}>{link.label}</Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer({ locale }: { locale: Locale }) {
  const t = ui(locale);
  const nav = footerNav(locale);
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <Mark size={36} />
          <p>
            <strong>{t.footerTagline}</strong>
          </p>
          <p className="muted">{t.footerName}</p>
        </div>
        <Column title={t.footerProduct} links={nav.product} />
        <Column title={t.footerDocs} links={nav.docs} />
        <Column title={t.footerCompare} links={nav.compare} />
        <Column
          title={t.footerProject}
          links={[
            { href: REPO_URL, label: t.github },
            { href: LATEST_RELEASE_URL, label: t.releasesOnGitHub },
            { href: ISSUES_URL, label: t.reportProblem },
            { href: localePath(locale, "/privacy"), label: t.privacy },
            { href: localePath(locale, "/code-signing"), label: t.codeSigning },
            { href: "/releases.xml", label: t.releasesFeed },
            { href: "/llms.txt", label: "llms.txt" },
          ]}
        />
      </div>
      <div className="container footer-bottom">
        <p>{t.footerIndependent}</p>
        <p>
          {t.footerLicense}{" "}
          <a href={RUSTICSTACK_URL} rel="noopener">
            {t.footerBy}
          </a>
          {" · "}
          <a href={SITE_REPO_URL} rel="noopener">
            {t.footerSite}
          </a>
        </p>
      </div>
    </footer>
  );
}
