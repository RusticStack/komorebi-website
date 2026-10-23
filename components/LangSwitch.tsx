"use client";

import { usePathname } from "next/navigation";
import { switchPath, type Locale } from "../lib/i18n";

/** A link to the same page in the other language. Every page of the site exists in both. */
export function LangSwitch({ to, label, short }: { to: Locale; label: string; short: string }) {
  const pathname = usePathname() ?? "/";
  return (
    <a className="lang-switch" href={switchPath(pathname, to)} hrefLang={to === "pt" ? "pt-PT" : "en"} lang={to === "pt" ? "pt-PT" : "en"} title={label}>
      <span aria-hidden="true">{short}</span>
      <span className="visually-hidden">{label}</span>
    </a>
  );
}
