import { defineConfig } from "astro/config";
import modulepreload from "./src/integrations/modulepreload.mjs";

// A static site: every page is plain HTML with one inlined stylesheet. The scripts (UI SDK web
// components for the theme, the menu, the tabs and the lightbox; the help search) are bundled
// modules, and nothing needs them to be read.
export default defineConfig({
  site: "https://komorebi.rusticstack.com",
  output: "static",
  integrations: [modulepreload()],
  trailingSlash: "never",
  build: {
    format: "file",
    inlineStylesheets: "always",
  },
  // No script is inlined into a page (the Content-Security-Policy allows exactly one inline script).
  vite: { build: { assetsInlineLimit: 0 } },
  devToolbar: { enabled: false },
  prefetch: false,
});
