"use client";

import { usePathname } from "next/navigation";
import { switchPath, type Locale } from "../lib/i18n";

/** EN / PT as a small segmented control: two links to the same page in each language. */
export function LangSegment({ locale, label, className = "segment" }: { locale: Locale; label: string; className?: string }) {
  const pathname = usePathname() ?? "/";
  const options: { to: Locale; short: string; name: string; lang: string }[] = [
    { to: "en", short: "EN", name: "English", lang: "en" },
    { to: "pt", short: "PT", name: "Português (Portugal)", lang: "pt-PT" },
  ];
  return (
    <div className={className} role="group" aria-label={label}>
      {options.map((option) => (
        <a
          key={option.to}
          href={switchPath(pathname, option.to)}
          hrefLang={option.lang}
          lang={option.lang}
          aria-current={option.to === locale ? "true" : undefined}
          title={option.name}
        >
          <span aria-hidden="true">{option.short}</span>
          <span className="visually-hidden">{option.name}</span>
        </a>
      ))}
    </div>
  );
}
