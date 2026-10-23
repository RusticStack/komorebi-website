import { defineConfig } from "astro/config";

// A static site: every page is plain HTML with one inlined stylesheet. The only script is
// public/site.js (theme toggle, docs search), and nothing needs it to be read.
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
