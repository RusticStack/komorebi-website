import { localePath, ui, type Locale } from "../lib/i18n";
import { docsTasks, popularDocs, primaryNav } from "../lib/nav";
import { downloadTarget } from "../lib/upstream";
import { CommandPalette } from "./CommandPalette";
import { DownloadIcon, SearchIcon } from "./icons";
import { LangSegment } from "./LangSegment";
import { Logo } from "./Logo";
import { MobileSheet } from "./MobileSheet";
import { ThemeButton } from "./ThemeButton";
import { TopBarBehaviour } from "./TopBarBehaviour";
import { TopNav } from "./TopNav";

/**
 * The top bar. Desktop (900 px and wider): a 48 px command bar with the logo, the primary items
 * with a sliding selection pill, a Docs split button with a flyout, a search box that opens the
 * command palette, the language segment, the colour scheme button and the download button.
 * Narrower: the logo, a search button and a menu button that opens a full-height sheet.
 * Everything here is links and <details>, so it works with JavaScript off; TopBarBehaviour and
 * the small client components add the keyboard model, the scroll surface and the palette.
 */
export function Header({ locale }: { locale: Locale }) {
  const t = ui(locale);
  const { release, href, direct } = downloadTarget();
  const version = release?.version;
  const items = primaryNav(locale);
  const tasks = docsTasks(locale);
  const popular = popularDocs(locale);
  const docsHome = localePath(locale, "/docs");
  const downloadLabel = version ? `${t.downloadFor}, ${locale === "pt" ? "versão" : "version"} ${version}` : t.downloadFor;

  return (
    <>
      <header className="topbar" data-topbar>
        <div className="topbar-inner">
          <Logo locale={locale} />
          <TopNav
            items={items}
            tasks={tasks}
            popular={popular}
            docsHome={docsHome}
            labels={{ nav: t.nav, docsMenu: t.docsMenu, iWantTo: t.iWantTo, popular: t.popular, allDocs: t.allDocs }}
          />
          <a className="searchbox" href={docsHome} data-search-open aria-label={t.searchDocs} aria-keyshortcuts="Control+K">
            <SearchIcon size={16} />
            <span className="searchbox-label">{t.searchDocs}</span>
            <kbd aria-hidden="true">Ctrl K</kbd>
          </a>
          <div className="topbar-tools">
            <LangSegment locale={locale} label={t.language} />
            <ThemeButton
              labels={{ system: t.themeSystem, light: t.themeLight, dark: t.themeDark }}
              short={{ system: t.themeShortSystem, light: t.themeShortLight, dark: t.themeShortDark }}
            />
            <a className="cta" href={href} {...(direct ? {} : { rel: "noopener" })} aria-label={downloadLabel} data-download>
              <DownloadIcon size={16} />
              <span className="cta-label">{t.download}</span>
              {version ? <span className="cta-version">{version}</span> : null}
            </a>
          </div>
          <a className="icon-button search-mobile" href={docsHome} data-search-open aria-label={t.searchDocs}>
            <SearchIcon size={18} />
          </a>
          <MobileSheet
            locale={locale}
            items={items}
            tasks={tasks}
            downloadHref={href}
            downloadDirect={direct}
            downloadLabel={downloadLabel}
            version={version}
            labels={{
              menu: t.menu,
              close: t.closeMenu,
              nav: t.navMenu,
              iWantTo: t.iWantTo,
              download: t.downloadFor,
              language: t.language,
            }}
          />
        </div>
      </header>
      <TopBarBehaviour />
      <CommandPalette locale={locale} />
    </>
  );
}
