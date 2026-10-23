// Checks every page of the static build for the SEO basics and exits 1 on any problem:
// a title, a meta description, a canonical URL that matches the page, hreflang links for en, pt-PT
// and x-default, at least one JSON-LD block that parses, an <html lang>, and no title used twice.
// The 404 page is checked for noindex instead.
//   node scripts/check-seo.mjs [dist]
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const SITE = "https://komorebi.rusticstack.com";
const root = resolve(process.argv[2] ?? "dist");
const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith(".html")) files.push(full);
  }
})(root);

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attr = (html, re) => {
  const m = re.exec(html);
  return m ? decode(m[1]).trim() : "";
};

const problems = [];
const titles = new Map();
const descriptions = new Map();

for (const file of files) {
  const rel = relative(root, file).replace(/\\/g, "/");
  const html = readFileSync(file, "utf8");
  const head = html.slice(0, html.indexOf("</head>"));
  const fail = (what) => problems.push(`${rel}: ${what}`);

  if (!/<html[^>]*\slang="[^"]+"/.test(html)) fail("no <html lang>");
  const title = attr(head, /<title>([^<]*)<\/title>/);
  if (!title) fail("no <title>");
  const description = attr(head, /<meta name="description" content="([^"]*)"/);
  if (!description) fail("no meta description");
  else if (description.length < 50 || description.length > 170) fail(`description is ${description.length} characters (want 50 to 170)`);

  if (rel === "404.html") {
    if (!/<meta name="robots" content="noindex"/.test(head)) fail("404 page is not noindex");
    continue;
  }

  if (title) titles.set(title, [...(titles.get(title) ?? []), rel]);
  if (description) descriptions.set(description, [...(descriptions.get(description) ?? []), rel]);

  const path = `/${rel.replace(/\.html$/, "").replace(/(^|\/)index$/, "")}`.replace(/\/$/, "") || "/";
  const expected = path === "/" ? SITE : `${SITE}${path}`;
  const canonical = attr(head, /<link rel="canonical" href="([^"]+)"/);
  if (!canonical) fail("no canonical");
  else if (canonical !== expected) fail(`canonical is ${canonical}, expected ${expected}`);

  for (const lang of ["en", "pt-PT", "x-default"]) {
    if (!new RegExp(`<link rel="alternate" hreflang="${lang}" href="https://`).test(head)) fail(`no hreflang ${lang}`);
  }
  const self = attr(head, new RegExp(`<link rel="alternate" hreflang="${path.startsWith("/pt") ? "pt-PT" : "en"}" href="([^"]+)"`));
  if (self && self !== expected) fail(`hreflang for its own language points to ${self}`);

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!blocks.length) fail("no JSON-LD");
  for (const [, json] of blocks) {
    try {
      const data = JSON.parse(json);
      if (!data["@context"] || !data["@type"]) fail("JSON-LD block without @context or @type");
    } catch {
      fail("JSON-LD that does not parse");
    }
  }
  if (!/<meta property="og:image" content="https:\/\//.test(head)) fail("no og:image");
}

for (const [title, pages] of titles) if (pages.length > 1) problems.push(`duplicate title "${title}": ${pages.join(", ")}`);
for (const [, pages] of descriptions) if (pages.length > 1) problems.push(`duplicate description: ${pages.join(", ")}`);

console.log(`check-seo: ${files.length} pages`);
if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`check-seo: ${problems.length} problems`);
  process.exit(1);
}
console.log("check-seo: no problems");
