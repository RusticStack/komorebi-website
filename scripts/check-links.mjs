// Checks every internal link and image in the static export: the target file exists and, for a
// link with a #fragment, the target page has an element with that id. Exits 1 on any problem.
//   node scripts/check-links.mjs [out]
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve(process.argv[2] ?? "out");
const pages = new Map();

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith(".html")) pages.set(full, readFileSync(full, "utf8"));
  }
}
walk(root);

/** The file a site path is served from, as Vercel's cleanUrls serves it. */
function fileFor(path) {
  const clean = decodeURIComponent(path).replace(/^\/+/, "");
  const base = join(root, clean);
  for (const candidate of [base, `${base}.html`, join(base, "index.html")]) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function ids(html) {
  return new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&")));
}

const problems = [];
let checked = 0;
for (const [file, html] of pages) {
  const from = `/${relative(root, file).replace(/\\/g, "/")}`;
  const refs = [
    ...[...html.matchAll(/<a\s[^>]*href="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/<(?:img|source)\s[^>]*(?:src|srcSet|srcset)="([^"]+)"/g)].flatMap((m) =>
      m[1].split(",").map((part) => part.trim().split(/\s+/)[0]),
    ),
    ...[...html.matchAll(/<link\s[^>]*href="([^"]+)"/g)].map((m) => m[1]),
  ];
  for (const raw of refs) {
    const ref = raw.replace(/&amp;/g, "&");
    if (/^(https?:|mailto:|data:)/.test(ref)) continue;
    checked += 1;
    const [path, fragment] = ref.split("#");
    const target = path ? fileFor(path.split("?")[0]) : file;
    if (!target) {
      problems.push(`${from}: missing ${ref}`);
      continue;
    }
    if (fragment && target.endsWith(".html")) {
      const targetIds = ids(pages.get(target) ?? readFileSync(target, "utf8"));
      if (!targetIds.has(decodeURIComponent(fragment))) problems.push(`${from}: no #${decodeURIComponent(fragment)} in ${path || "the same page"}`);
    }
  }
}

console.log(`check-links: ${pages.size} pages, ${checked} internal references`);
if (problems.length) {
  console.error([...new Set(problems)].join("\n"));
  console.error(`check-links: ${problems.length} problems`);
  process.exit(1);
}
console.log("check-links: no problems");
