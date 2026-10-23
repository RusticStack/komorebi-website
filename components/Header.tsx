import Link from "next/link";
import { localePath, ui, type Locale } from "../lib/i18n";
import { REPO_URL } from "../lib/site";
import { GitHubIcon, MenuIcon } from "./icons";
import { LangSwitch } from "./LangSwitch";

export function Logo({ locale }: { locale: Locale }) {
  return (
    <Link href={localePath(locale, "/")} className="brand" aria-label={ui(locale).home}>
      <picture>
        <source media="(prefers-color-scheme: dark)" srcSet="/brand/logo-light.svg" />
        <img src="/brand/logo.svg" alt="Komorebi" width={135} height={28} />
      </picture>
    </Link>
  );
}

export function Header({ locale }: { locale: Locale }) {
  const t = ui(locale);
  const links = [
    { href: localePath(locale, "/docs"), label: t.docs },
    { href: localePath(locale, "/changelog"), label: t.changelog },
    { href: localePath(locale, "/privacy"), label: t.privacy },
  ];
  return (
    <header className="site-header">
      <div className="container header-row">
        <Logo locale={locale} />
        <nav className="header-nav" aria-label={t.nav}>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-tools">
          <LangSwitch to={locale === "en" ? "pt" : "en"} label={t.otherLanguageLabel} short={t.otherLanguageShort} />
          <a className="icon-button" href={REPO_URL} rel="noopener" aria-label={t.github} title={t.github}>
            <GitHubIcon />
          </a>
          <details className="mobile-menu">
            <summary className="icon-button" aria-label={t.menu} title={t.menu}>
              <MenuIcon />
            </summary>
            <nav aria-label={t.nav}>
              <ul>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
                <li>
                  <a href={REPO_URL} rel="noopener">
                    {t.github}
                  </a>
                </li>
              </ul>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
