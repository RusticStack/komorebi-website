"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { Link as NavLink } from "../lib/nav";
import { ArrowRightIcon, ChevronDownIcon } from "./icons";

type Item = { key: string; href: string; label: string; match: string | null };
type Labels = { nav: string; docsMenu: string; iWantTo: string; popular: string; allDocs: string };

/** The current primary item of a path: the one whose match is the path or a parent of it. */
function currentKey(items: Item[], pathname: string) {
  return items.find((item) => item.match && (pathname === item.match || pathname.startsWith(`${item.match}/`)))?.key;
}

/**
 * The desktop primary items. With JavaScript: one Tab stop with arrow keys between items
 * (roving tabindex), a selection pill that slides to the hovered or focused item and back, and
 * a Docs flyout that opens with ArrowDown, moves with the arrow keys and closes with Escape,
 * an outside click or focus leaving it. Without JavaScript: plain links and a <details> flyout.
 */
export function TopNav({ items, tasks, popular, docsHome, labels }: { items: Item[]; tasks: NavLink[]; popular: NavLink[]; docsHome: string; labels: Labels }) {
  const pathname = usePathname() ?? "/";
  const current = currentKey(items, pathname);
  const navRef = useRef<HTMLElement>(null);
  const flyoutRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    const flyout = flyoutRef.current;
    if (!nav || !flyout) return;
    const summary = flyout.querySelector("summary")!;
    const indicator = nav.querySelector<HTMLElement>(".topnav-indicator")!;
    const stops = () => [...nav.querySelectorAll<HTMLElement>(":scope > ul > li > a, :scope > ul > li > details > summary")];
    const panelLinks = () => [...flyout.querySelectorAll<HTMLAnchorElement>(".flyout-panel a")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");

    nav.dataset.enhanced = "";

    // Roving tabindex: the current item (or the first) is the only Tab stop
    const setRoving = (target: HTMLElement) => stops().forEach((stop) => (stop.tabIndex = stop === target ? 0 : -1));
    const home = stops().find((stop) => stop.getAttribute("aria-current") === "page") ?? stops()[0];
    setRoving(home);

    // The selection pill: under the current item, or under the hovered or focused one
    const anchorOf = (el: Element | null | undefined) => (el?.closest("li")?.querySelector<HTMLElement>(":scope > a") ?? null);
    const place = (target: HTMLElement | null, instant = false) => {
      if (!target) {
        indicator.style.opacity = "0";
        return;
      }
      const navBox = nav.getBoundingClientRect();
      const box = target.getBoundingClientRect();
      const width = Math.min(24, box.width * 0.5);
      indicator.style.transition = instant || reduced.matches ? "none" : "";
      indicator.style.transform = `translateX(${box.left - navBox.left + (box.width - width) / 2}px)`;
      indicator.style.width = `${width}px`;
      indicator.style.opacity = "1";
    };
    const currentAnchor = () => nav.querySelector<HTMLElement>(":scope > ul > li > a[aria-current='page']");
    const rest = () => place(currentAnchor());
    place(currentAnchor(), true);

    const onOver = (event: Event) => {
      const a = anchorOf(event.target as Element);
      if (a) place(a);
    };
    const onLeave = () => {
      if (!nav.contains(document.activeElement)) rest();
    };
    const onFocusIn = (event: FocusEvent) => {
      const a = anchorOf(event.target as Element);
      if (a && !flyout.contains(event.target as Node)) place(a);
      else if (summary === event.target) place(anchorOf(summary));
    };
    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as Node | null;
      if (!next || !nav.contains(next)) {
        rest();
        if (flyout.open) close(false);
      } else if (flyout.open && !flyout.contains(next)) close(false);
    };

    const open = () => {
      flyout.open = true;
    };
    const close = (focusSummary: boolean) => {
      flyout.open = false;
      if (focusSummary) summary.focus();
    };
    let focusFirst = false;
    const sync = () => {
      summary.setAttribute("aria-expanded", String(flyout.open));
      if (flyout.open && focusFirst) panelLinks()[0]?.focus();
      focusFirst = false;
    };
    sync();

    const onNavKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const list = stops();
      const index = list.indexOf(target);
      if (index >= 0) {
        let next: HTMLElement | undefined;
        if (event.key === "ArrowRight") next = list[(index + 1) % list.length];
        else if (event.key === "ArrowLeft") next = list[(index - 1 + list.length) % list.length];
        else if (event.key === "Home") next = list[0];
        else if (event.key === "End") next = list[list.length - 1];
        else if (event.key === "ArrowDown" && target === summary) {
          event.preventDefault();
          if (flyout.open) panelLinks()[0]?.focus();
          else {
            focusFirst = true;
            open();
          }
          return;
        }
        if (next) {
          event.preventDefault();
          setRoving(next);
          next.focus();
        }
        return;
      }
      // Inside the flyout
      const links = panelLinks();
      const at = links.indexOf(target as HTMLAnchorElement);
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      } else if (at >= 0 && (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Home" || event.key === "End")) {
        event.preventDefault();
        const next =
          event.key === "Home" ? 0 : event.key === "End" ? links.length - 1 : (at + (event.key === "ArrowDown" ? 1 : -1) + links.length) % links.length;
        links[next].focus();
      }
    };
    const onSummaryKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && flyout.open) {
        event.preventDefault();
        close(true);
      }
    };
    const onDocClick = (event: MouseEvent) => {
      if (flyout.open && !flyout.contains(event.target as Node)) flyout.open = false;
    };
    const onResize = () => rest();

    nav.addEventListener("pointerover", onOver);
    nav.addEventListener("pointerleave", onLeave);
    nav.addEventListener("focusin", onFocusIn);
    nav.addEventListener("focusout", onFocusOut);
    nav.addEventListener("keydown", onNavKey);
    summary.addEventListener("keydown", onSummaryKey);
    flyout.addEventListener("toggle", sync);
    document.addEventListener("click", onDocClick);
    addEventListener("resize", onResize);
    document.fonts?.ready.then(() => place(currentAnchor(), true));
    return () => {
      nav.removeEventListener("pointerover", onOver);
      nav.removeEventListener("pointerleave", onLeave);
      nav.removeEventListener("focusin", onFocusIn);
      nav.removeEventListener("focusout", onFocusOut);
      nav.removeEventListener("keydown", onNavKey);
      summary.removeEventListener("keydown", onSummaryKey);
      flyout.removeEventListener("toggle", sync);
      document.removeEventListener("click", onDocClick);
      removeEventListener("resize", onResize);
    };
  }, [pathname]);

  // A route change closes the flyout
  useEffect(() => {
    if (flyoutRef.current) flyoutRef.current.open = false;
  }, [pathname]);

  return (
    <nav className="topnav" aria-label={labels.nav} ref={navRef}>
      <ul>
        {items.map((item) =>
          item.key === "docs" ? (
            <li key={item.key} className="split">
              <Link href={item.href} aria-current={current === item.key ? "page" : undefined}>
                {item.label}
              </Link>
              <details className="flyout" ref={flyoutRef}>
                <summary aria-label={labels.docsMenu}>
                  <ChevronDownIcon size={14} />
                </summary>
                <div className="flyout-panel">
                  <section aria-labelledby="flyout-tasks">
                    <p className="flyout-title" id="flyout-tasks">
                      {labels.iWantTo}
                    </p>
                    <ul className="flyout-tasks">
                      {tasks.map((task) => (
                        <li key={task.href}>
                          <Link href={task.href}>
                            <strong>{task.label}</strong>
                            {task.hint ? <small>{task.hint}</small> : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section aria-labelledby="flyout-popular" className="flyout-side">
                    <p className="flyout-title" id="flyout-popular">
                      {labels.popular}
                    </p>
                    <ul>
                      {popular.map((page) => (
                        <li key={page.href}>
                          <Link href={page.href}>{page.label}</Link>
                        </li>
                      ))}
                    </ul>
                    <Link href={docsHome} className="flyout-all">
                      {labels.allDocs} <ArrowRightIcon size={14} />
                    </Link>
                  </section>
                </div>
              </details>
            </li>
          ) : (
            <li key={item.key}>
              <Link href={item.href} aria-current={current === item.key ? "page" : undefined}>
                {item.label}
              </Link>
            </li>
          ),
        )}
      </ul>
      <span className="topnav-indicator" aria-hidden="true" />
    </nav>
  );
}
