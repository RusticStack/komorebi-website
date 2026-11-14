import { createColorScheme, createLocalStorage } from "@ui-sdk/core";

// The light, dark or system preference, from UI SDK. It is saved in localStorage under
// "color-scheme" and written on <html> as data-color-scheme ("system", "light" or "dark");
// site.css picks the tokens from that attribute and, for "system", from prefers-color-scheme.
// The same object makes the inline head script at build time (Base.astro) and drives the
// switcher in the browser (src/scripts/site.ts).
export const colorScheme = createColorScheme({
  storage: createLocalStorage("color-scheme"),
  global: true,
});
