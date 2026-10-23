"use client";

import { useEffect, useState, type ReactNode } from "react";

export type TocItem = { title: ReactNode; url: string; depth: number };

// The active item is the last heading above a line just under the sticky header, computed on
// scroll (once per frame), so a fast scroll or a jump never leaves a stale or empty highlight.
function useActiveHeading(items: TocItem[]) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const targets = items
      .map((item) => document.getElementById(decodeURIComponent(item.url.slice(1))))
      .filter(Boolean) as HTMLElement[];
    if (targets.length === 0) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const header = document.querySelector(".site-header")?.getBoundingClientRect().height ?? 56;
      const line = header + 16;
      let current = targets[0];
      for (const target of targets) {
        if (target.getBoundingClientRect().top <= line) current = target;
        else break;
      }
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) {
        const last = targets.findLast((target) => target.getBoundingClientRect().top < innerHeight);
        if (last) current = last;
      }
      setActive(current.id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [items]);
  return active;
}

function TocList({ items, active }: { items: TocItem[]; active?: string | null }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.url} data-depth={item.depth}>
          <a href={item.url} aria-current={active === decodeURIComponent(item.url.slice(1)) ? "location" : undefined}>
            {item.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** The sticky table of contents beside the article on wide screens. */
export function Toc({ items, label }: { items: TocItem[]; label: string }) {
  const active = useActiveHeading(items);
  if (items.length === 0) return null;
  return (
    <nav className="toc" aria-label={label}>
      <p className="toc-title">{label}</p>
      <TocList items={items} active={active} />
    </nav>
  );
}

/** The folded table of contents under the page title on narrow screens. */
export function TocInline({ items, label }: { items: TocItem[]; label: string }) {
  if (items.length === 0) return null;
  return (
    <details className="toc-inline">
      <summary>{label}</summary>
      <nav aria-label={label}>
        <TocList items={items} />
      </nav>
    </details>
  );
}
