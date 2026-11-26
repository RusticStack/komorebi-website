import { Children, isValidElement, type ReactNode } from "react";
import type { Locale } from "../lib/i18n";
import { ui } from "../lib/i18n";
import { formatDate } from "../lib/upstream";
import { ArrowRightIcon, InfoIcon, LightbulbIcon, WarningIcon } from "./icons";

// Building blocks for MDX pages. Each is semantic HTML with one hook for site.css.

type CalloutType = "note" | "tip" | "warning";

/** A note, tip or warning beside the text. The type is in the title for screen readers too. */
export function Callout({ type = "note", title, lang = "en", children }: { type?: CalloutType | "caution"; title?: string; lang?: Locale; children: ReactNode }) {
  const kind: CalloutType = type === "caution" ? "warning" : type;
  const t = ui(lang);
  const Icon = kind === "tip" ? LightbulbIcon : kind === "warning" ? WarningIcon : InfoIcon;
  const label = kind === "tip" ? t.tip : kind === "warning" ? t.warning : t.note;
  return (
    <aside className="callout" data-callout={kind} aria-label={title ? `${label}: ${title}` : label}>
      <Icon size={18} />
      <div>
        <p className="callout-title">{title ?? label}</p>
        {children}
      </div>
    </aside>
  );
}

/** Numbered steps, one action each. */
export function Steps({ children }: { children: ReactNode }) {
  return <ol className="steps">{children}</ol>;
}

export function Step({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <li>
      <p className="step-title">{title}</p>
      {children}
    </li>
  );
}

/** Detail most readers can skip, folded away. */
export function Advanced({ title, lang = "en", children }: { title: string; lang?: Locale; children: ReactNode }) {
  return (
    <details className="advanced">
      <summary>
        <span className="advanced-badge" data-badge="secondary">
          {ui(lang).advanced}
        </span>{" "}
        {title}
      </summary>
      <div>{children}</div>
    </details>
  );
}

/** One question of an FAQ, as an accordion. */
export function Faq({ q, children }: { q: string; children: ReactNode }) {
  return (
    <details className="faq">
      <summary>{q}</summary>
      <div>{children}</div>
    </details>
  );
}

/**
 * The "Next steps" block at the end of a page: the Markdown list inside becomes cards. Each list
 * item is a link, optionally followed by ": a short hint".
 */
export function NextSteps({ lang = "en", children }: { lang?: Locale; children: ReactNode }) {
  return (
    <nav className="next-steps" aria-label={ui(lang).nextSteps}>
      <p className="next-steps-title">{ui(lang).nextSteps}</p>
      {children}
    </nav>
  );
}

/** A comparison table, with the Komorebi column marked. */
export function Compare({ children }: { children: ReactNode }) {
  return <div className="compare">{children}</div>;
}

export function Kbd({ children }: { children: ReactNode }) {
  const text = Children.toArray(children).filter((c) => !isValidElement(c)).join("");
  const keys = text.split(/\+(?=.)/);
  if (keys.length < 2) return <kbd>{children}</kbd>;
  return (
    <kbd className="combo">
      {keys.map((key, i) => (
        <span key={i}>
          {i > 0 ? "+" : null}
          <kbd>{key}</kbd>
        </span>
      ))}
    </kbd>
  );
}

/** "Checked on 23 October 2026": when the facts on a comparison page were last checked. */
export function Checked({ date, lang = "en" }: { date: string; lang?: Locale }) {
  return (
    <p className="checked">
      {ui(lang).checked} <time dateTime={date}>{formatDate(`${date}T12:00:00Z`, lang)}</time>
    </p>
  );
}

export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="more">
      {children} <ArrowRightIcon size={16} />
    </a>
  );
}
