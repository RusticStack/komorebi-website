"use client";

import { useEffect, useState } from "react";
import { applyPictureScheme, SCHEME_KEY, type Scheme } from "../lib/theme";
import { MonitorIcon, MoonIcon, SunIcon } from "./icons";

const ORDER: Scheme[] = ["system", "light", "dark"];

function read(): Scheme {
  try {
    const value = localStorage.getItem(SCHEME_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

function apply(scheme: Scheme) {
  const root = document.documentElement;
  if (scheme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", scheme);
  applyPictureScheme(scheme);
  try {
    if (scheme === "system") localStorage.removeItem(SCHEME_KEY);
    else localStorage.setItem(SCHEME_KEY, scheme);
  } catch {
    // storage can be blocked; the choice then lasts for this page only
  }
}

/**
 * One icon button with three states: follow the system, light, dark. Each press moves to the
 * next. Rendered hidden and shown once JavaScript runs, since it does nothing without it.
 */
export function ThemeButton({
  labels,
  short,
  className = "icon-button theme-button",
}: {
  labels: Record<Scheme, string>;
  short: Record<Scheme, string>;
  className?: string;
}) {
  const [scheme, setScheme] = useState<Scheme | null>(null);
  useEffect(() => {
    setScheme(read());
    const onStorage = (event: StorageEvent) => {
      if (event.key === SCHEME_KEY) {
        const next = read();
        apply(next);
        setScheme(next);
      }
    };
    addEventListener("storage", onStorage);
    return () => removeEventListener("storage", onStorage);
  }, []);
  const value = scheme ?? "system";
  const Icon = value === "light" ? SunIcon : value === "dark" ? MoonIcon : MonitorIcon;
  return (
    <button
      type="button"
      className={className}
      hidden={scheme === null}
      aria-label={labels[value]}
      title={labels[value]}
      data-scheme={value}
      onClick={() => {
        const next = ORDER[(ORDER.indexOf(value) + 1) % ORDER.length];
        apply(next);
        setScheme(next);
      }}
    >
      <Icon size={18} />
      <span className="theme-button-text">{short[value]}</span>
    </button>
  );
}
