// After the build: for every page, adds <link rel="modulepreload"> for each page script and the
// shared chunks it imports. Without it the browser finds a chunk only after it has parsed the script
// that imports it, which makes a request chain (page, script, chunk) on the critical path. The
// links make them all start with the page. Only static imports are followed: the tooltip and the
// dialog are dynamic imports, loaded when they are about to be used.
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// import{a}from"./x.js"  export{a}from"./x.js"  import"./x.js" (not import("./x.js"), which is dynamic)
const STATIC_IMPORT = /\b(?:from|import)\s*["'](\.\/[^"']+\.js)["']/g;

export default function modulepreload() {
  return {
    name: "komorebi-modulepreload",
    hooks: {
      "astro:build:done": ({ dir }) => {
        const root = fileURLToPath(dir);
        const chunks = new Map();
        const imports = (url) => {
          if (chunks.has(url)) return chunks.get(url);
          const file = join(root, url);
          const found = [];
          chunks.set(url, found);
          const code = readFileSync(file, "utf8");
          for (const m of code.matchAll(STATIC_IMPORT)) {
            const child = join(dirname(url), m[1]).replaceAll("\\", "/");
            found.push(child, ...imports(child));
          }
          return found;
        };
        const walk = (d) => {
          for (const name of readdirSync(d)) {
            const full = join(d, name);
            if (statSync(full).isDirectory()) walk(full);
            else if (name.endsWith(".html")) rewrite(full);
          }
        };
        const rewrite = (file) => {
          const html = readFileSync(file, "utf8");
          const urls = new Set();
          for (const m of html.matchAll(/<script type="module" src="(\/_astro\/[^"]+\.js)"/g)) {
            urls.add(m[1]);
            for (const u of imports(m[1])) urls.add(u);
          }
          if (!urls.size) return;
          const links = [...urls].map((u) => `<link rel="modulepreload" href="${u}">`).join("");
          // right after <title>: after the head script and before the long run of meta tags
          writeFileSync(file, html.replace("</title>", `</title>${links}`));
        };
        walk(root);
      },
    },
  };
}
