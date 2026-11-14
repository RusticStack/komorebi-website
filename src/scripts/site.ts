// The script on every page: the theme preference and the menu. Pages read fine without it.
// UI SDK (@ui-sdk/web) gives the behaviour: custom elements that are unstyled and keep their
// markup; src/styles/site.css styles their data-slot and data-* state attributes with the site's
// own tokens. The tooltip and the dialog are imported only when they are about to be used.
import "@ui-sdk/web/preferences";
import "@ui-sdk/web/segmented-control";
import "@ui-sdk/web/collapsible";
import type { ColorSchemeValue } from "@ui-sdk/core";
import type { UiTooltipElement } from "@ui-sdk/web/tooltip";
import type { UiSegmentedControlElement } from "@ui-sdk/web/segmented-control";
import type { UiCollapsibleElement } from "@ui-sdk/web/collapsible";
import type { UiDialogElement } from "@ui-sdk/web/dialog";
import { colorScheme } from "../lib/color-scheme";

// ---------- theme: light, dark or follow Windows ----------
const preferences = document.querySelector("ui-preferences");
if (preferences) preferences.preferences = [colorScheme];

const scheme = document.querySelector<UiSegmentedControlElement>("ui-segmented-control.scheme");
if (scheme) {
  const show = () => {
    scheme.value = colorScheme.get().value;
  };
  scheme.addEventListener("valuechange", (event) => {
    colorScheme.set(event.detail.value as ColorSchemeValue);
  });
  show();
  colorScheme.subscribe(show);
  tooltips(scheme);
}

// One shared tooltip names the theme icons where their text is hidden (wider than a phone). Its
// module loads on the first hover or keyboard focus, during the tooltip's own delay.
function tooltips(control: HTMLElement) {
  const wide = matchMedia("(min-width: 641px)");
  let tip: Promise<UiTooltipElement> | null = null;
  let timer = 0;
  let shownAt = 0;
  const load = () =>
    (tip ??= import("@ui-sdk/web/tooltip").then(async () => {
      const element = document.createElement("ui-tooltip");
      element.className = "tip";
      const content = document.createElement("ui-tooltip-content");
      content.setAttribute("side", "bottom");
      content.setAttribute("side-offset", "8");
      content.setAttribute("hidden", "");
      element.append(content);
      document.body.append(element);
      await customElements.whenDefined("ui-tooltip");
      return element;
    }));
  const label = (item: Element) => item.querySelector(".scheme-text")?.textContent?.trim() ?? "";
  const open = async (item: Element) => {
    const element = await load();
    const content = element.querySelector("ui-tooltip-content")!;
    content.textContent = label(item);
    element.api.open({ anchor: item });
    shownAt = Date.now();
  };
  const close = async () => {
    clearTimeout(timer);
    if (tip) (await tip).open = false;
  };
  control.addEventListener("pointerover", (event) => {
    if (!wide.matches || (event as PointerEvent).pointerType === "touch") return;
    const item = (event.target as Element).closest("ui-segmented-control-item");
    if (!item) return;
    load();
    clearTimeout(timer);
    // the next icon after one that showed a moment ago opens at once, as in a toolbar
    timer = window.setTimeout(() => open(item), Date.now() - shownAt < 800 ? 0 : 600);
  });
  control.addEventListener("pointerleave", () => {
    shownAt = Date.now();
    close();
  });
  control.addEventListener("focusin", (event) => {
    const item = (event.target as Element).closest("ui-segmented-control-item");
    if (wide.matches && item && item.matches(":focus-visible")) open(item);
  });
  control.addEventListener("focusout", close);
  control.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
  control.addEventListener("pointerdown", close);
}

// ---------- the menu on a phone ----------
// Wider than a phone the button is hidden and the panel is kept open, so CSS can lay its links
// and the theme out in the header row (UI SDK hides a closed panel with an !important rule).
const menu = document.querySelector<UiCollapsibleElement>("ui-collapsible.menu");
if (menu) {
  const button = menu.querySelector<HTMLButtonElement>(".menu-trigger button");
  const wide = matchMedia("(min-width: 641px)");
  const fit = () => {
    menu.open = wide.matches;
  };
  fit();
  wide.addEventListener("change", fit);
  menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.open && !wide.matches) {
      menu.open = false;
      button?.focus();
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (menu.open && !wide.matches && !menu.contains(event.target as Node)) menu.open = false;
  });
}

// ---------- the product picture, larger, in a dialog ----------
const zoom = document.querySelector<HTMLButtonElement>("[data-lightbox]");
if (zoom) {
  const dialog = document.querySelector<UiDialogElement>(`ui-dialog#${zoom.dataset.lightbox}`);
  let ready: Promise<unknown> | null = null;
  const load = () => (ready ??= import("@ui-sdk/web/dialog").then(() => customElements.whenDefined("ui-dialog")));
  zoom.addEventListener("pointerenter", load, { once: true });
  zoom.addEventListener("focus", load, { once: true });
  zoom.addEventListener("click", async () => {
    await load();
    if (dialog) dialog.open = true;
  });
}
