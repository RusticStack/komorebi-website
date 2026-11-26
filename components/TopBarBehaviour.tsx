"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { applyPictureScheme } from "../lib/theme";

/**
 * The top bar's layered surface: after 8 px of scroll it gets a border and a soft shadow.
 * The bar stays put (it never hides on scroll), so headings reached by a link are never covered
 * by a bar sliding back in. See docs/DESIGN.md. It also keeps screenshots on a page reached by
 * a client-side navigation in the scheme the visitor forced.
 */
export function TopBarBehaviour() {
  const pathname = usePathname();
  useEffect(() => {
    const bar = document.querySelector<HTMLElement>("[data-topbar]");
    if (!bar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      bar.toggleAttribute("data-scrolled", scrollY > 8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
    };
  }, []);
  useEffect(() => {
    const forced = document.documentElement.getAttribute("data-theme");
    if (forced === "light" || forced === "dark") applyPictureScheme(forced);
  }, [pathname]);
  return null;
}
