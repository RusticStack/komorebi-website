import { defineConfig } from "astro/config";

// A static site: every page is plain HTML with one inlined stylesheet. The scripts (UI SDK web
// components for the theme, the menu, the tabs and the lightbox; the help search) are bundled
// modules, and nothing needs them to be read.
export default defineConfig({
  site: "https://komorebi.rusticstack.com",
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file",
    inlineStylesheets: "always",
  },
  devToolbar: { enabled: false },
  prefetch: false,
});
