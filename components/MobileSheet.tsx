"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { ui, type Locale } from "../lib/i18n";
import type { Link as NavLink } from "../lib/nav";
import { CloseIcon, DownloadIcon, MenuIcon } from "./icons";
import { LangSegment } from "./LangSegment";
import { ThemeButton } from "./ThemeButton";

type Item = { key: string; href: string; label: string; match: string | null };

/**
 * Under 900 px: a menu button that opens a full-height sheet below the bar. It is a <details>,
 * so it opens and closes without JavaScript; with it, Escape closes the sheet and returns the
 * focus, and a route change closes it. While it is open the page behind does not scroll (CSS).
 */
export function MobileSheet({
  locale,
  items,
  tasks,
  downloadHref,
  downloadDirect,
  downloadLabel,
  version,
  labels,
}: {
  locale: Locale;
  items: Item[];
  tasks: NavLink[];
  downloadHref: string;
  downloadDirect: boolean;
  downloadLabel: string;
  version?: string;
  labels: { menu: string; close: string; nav: string; iWantTo: string; download: string; language: string };
}) {
  const pathname = usePathname() ?? "/";
  const ref = useRef<HTMLDetailsElement>(null);
  const t = ui(locale);

  useEffect(() => {
    if (ref.current) ref.current.open = false;
  }, [pathname]);

  useEffect(() => {
    const sheet = ref.current;
    if (!sheet) return;
    const summary = sheet.querySelector("summary")!;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && sheet.open) {
        event.preventDefault();
        sheet.open = false;
        summary.focus();
      }
    };
    const onToggle = () => {
      summary.setAttribute("aria-label", sheet.open ? labels.close : labels.menu);
      summary.setAttribute("aria-expanded", String(sheet.open));
      if (sheet.open) sheet.querySelector<HTMLElement>(".sheet-panel a")?.focus();
    };
    sheet.addEventListener("keydown", onKey);
    sheet.addEventListener("toggle", onToggle);
    return () => {
      sheet.removeEventListener("keydown", onKey);
      sheet.removeEventListener("toggle", onToggle);
    };
  }, [labels.close, labels.menu]);

  const current = (item: Item) => Boolean(item.match && (pathname === item.match || pathname.startsWith(`${item.match}/`)));

  return (
    <details className="sheet" ref={ref}>
      <summary className="icon-button" aria-label={labels.menu}>
        <span className="sheet-open-icon">
          <MenuIcon size={20} />
        </span>
        <span className="sheet-close-icon">
          <CloseIcon size={20} />
        </span>
      </summary>
      <div className="sheet-panel">
        <nav aria-label={labels.nav}>
          <ul className="sheet-primary">
            {items.map((item) => (
              <li key={item.key}>
                <Link href={item.href} aria-current={current(item) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="sheet-title">{labels.iWantTo}</p>
          <ul className="sheet-tasks">
            {tasks.map((task) => (
              <li key={task.href}>
                <Link href={task.href}>{task.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sheet-tools">
          <LangSegment locale={locale} label={labels.language} />
          <ThemeButton
            className="theme-button theme-button-wide"
            labels={{ system: t.themeSystem, light: t.themeLight, dark: t.themeDark }}
            short={{ system: t.themeShortSystem, light: t.themeShortLight, dark: t.themeShortDark }}
          />
        </div>
        <a className="cta cta-block" href={downloadHref} {...(downloadDirect ? {} : { rel: "noopener" })} aria-label={downloadLabel} data-download>
          <DownloadIcon size={18} />
          <span>{labels.download}</span>
          {version ? <span className="cta-version">{version}</span> : null}
        </a>
      </div>
    </details>
  );
}
