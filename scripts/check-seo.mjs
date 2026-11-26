// Checks the SEO basics of every page in the static export and exits 1 on any problem:
//   - a <title> and a meta description, both unique across the site
//   - a canonical URL that is the page's own address
//   - hreflang alternates for en, pt-PT and x-default, pointing at pages that exist
//   - at least one JSON-LD block, and every block valid JSON with a @type
//   - exactly one <h1>, the right <html lang>, Open Graph and Twitter cards
//   - every <img> with an alt attribute and a width and height
//   - every page listed in sitemap.xml
//   node scripts/check-seo.mjs [out]
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const SITE = "https://komorebi.rusticstack.com";
const root = resolve(process.argv[2] ?? "out");
const pages = new Map();

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (!entry.startsWith("_next") && entry !== "md" && entry !== "search-index") walk(full);
    } else if (entry.endsWith(".html") && !/^(404|_not-found)\.html$/.test(entry)) pages.set(full, readFileSync(full, "utf8"));
  }
}
walk(root);

/** The public path of an exported file, as Vercel's cleanUrls serves it. */
function pathOf(file) {
  const rel = relative(root, file).replace(/\\/g, "/").replace(/\.html$/, "");
  if (rel === "index") return "/";
  return `/${rel.replace(/\/index$/, "")}`;
}

function exists(path) {
  const clean = path.replace(/^\/+/, "");
  return ["", ".html", "/index.html"].some((ext) => {
    const candidate = join(root, clean ? `${clean}${ext}` : "index.html");
    return existsSync(candidate) && statSync(candidate).isFile();
  });
}

const decode = (text) => text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attr = (tag, name) => {
  const m = new RegExp(`\\s${name}="([^"]*)"`, "i").exec(tag);
  return m ? decode(m[1]) : null;
};
const metaContent = (html, key, value) => {
  for (const tag of html.match(/<meta\s[^>]*>/gi) ?? []) if (attr(tag, key) === value) return attr(tag, "content");
  return null;
};

const sitemap = existsSync(join(root, "sitemap.xml")) ? readFileSync(join(root, "sitemap.xml"), "utf8") : "";
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => decode(m[1])));

const problems = [];
const titles = new Map();
const descriptions = new Map();
let checked = 0;

for (const [file, html] of pages) {
  const path = pathOf(file);
  const url = `${SITE}${path === "/" ? "" : path}`;
  const at = (message) => problems.push(`${path}: ${message}`);
  checked += 1;

  const head = /<head>([\s\S]*?)<\/head>/i.exec(html)?.[1] ?? "";
  const title = decode(/<title>([\s\S]*?)<\/title>/i.exec(head)?.[1]?.trim() ?? "");
  if (!title) at("no <title>");
  else {
    if (title.length > 70) at(`title is ${title.length} characters (over 70): ${title}`);
    titles.set(title, [...(titles.get(title) ?? []), path]);
  }

  const description = metaContent(head, "name", "description");
  if (!description) at("no meta description");
  else {
    if (description.length < 50 || description.length > 170) at(`description is ${description.length} characters (want 50 to 170)`);
    descriptions.set(description, [...(descriptions.get(description) ?? []), path]);
  }

  const links = head.match(/<link\s[^>]*>/gi) ?? [];
  const canonical = links.find((tag) => attr(tag, "rel") === "canonical");
  if (!canonical) at("no canonical link");
  else if (attr(canonical, "href") !== url) at(`canonical is ${attr(canonical, "href")}, expected ${url}`);

  const alternates = new Map(links.filter((tag) => attr(tag, "rel") === "alternate" && attr(tag, "hreflang")).map((tag) => [attr(tag, "hreflang"), attr(tag, "href")]));
  for (const lang of ["en", "pt-PT", "x-default"]) {
    const href = alternates.get(lang);
    if (!href) at(`no hreflang="${lang}"`);
    else if (!href.startsWith(SITE)) at(`hreflang="${lang}" is not absolute: ${href}`);
    else if (!exists(href.slice(SITE.length) || "/")) at(`hreflang="${lang}" points at a missing page: ${href}`);
  }
  if (alternates.size && ![...alternates.values()].includes(url)) at("hreflang alternates do not include the page itself");

  const lang = /<html[^>]*\slang="([^"]+)"/i.exec(html)?.[1];
  const expectedLang = path === "/pt" || path.startsWith("/pt/") ? "pt-PT" : "en";
  if (lang !== expectedLang) at(`<html lang="${lang}">, expected ${expectedLang}`);

  for (const [key, value] of [
    ["property", "og:title"],
    ["property", "og:description"],
    ["property", "og:image"],
    ["property", "og:url"],
    ["name", "twitter:card"],
  ]) {
    if (!metaContent(head, key, value)) at(`no ${value}`);
  }
  const ogImage = metaContent(head, "property", "og:image");
  if (ogImage && ogImage.startsWith(SITE) && !exists(ogImage.slice(SITE.length).split("?")[0])) at(`og:image is missing: ${ogImage}`);

  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (blocks.length === 0) at("no JSON-LD");
  for (const block of blocks) {
    try {
      const data = JSON.parse(block);
      if (!data["@type"]) at("a JSON-LD block has no @type");
      if (data["@type"] === "SoftwareApplication" && data.aggregateRating) at("SoftwareApplication has an aggregateRating");
    } catch {
      at("a JSON-LD block is not valid JSON");
    }
  }

  const body = /<body[^>]*>([\s\S]*)<\/body>/i.exec(html)?.[1] ?? "";
  const h1 = (body.match(/<h1[\s>]/gi) ?? []).length;
  if (h1 !== 1) at(`${h1} <h1> elements, expected 1`);

  for (const img of body.match(/<img\s[^>]*>/gi) ?? []) {
    if (attr(img, "alt") === null) at(`an image has no alt: ${attr(img, "src")}`);
    if (!attr(img, "width") || !attr(img, "height")) at(`an image has no width and height: ${attr(img, "src")}`);
  }

  if (/<meta\s[^>]*name="robots"[^>]*noindex/i.test(head)) continue;
  if (sitemap && !sitemapUrls.has(url)) at("not in sitemap.xml");
}

for (const [title, where] of titles) if (where.length > 1) problems.push(`duplicate title "${title}": ${where.join(", ")}`);
for (const [description, where] of descriptions) if (where.length > 1) problems.push(`duplicate description on ${where.join(", ")}: ${description.slice(0, 60)}...`);
for (const url of sitemapUrls) if (!exists(url.slice(SITE.length) || "/")) problems.push(`sitemap.xml lists a missing page: ${url}`);
if (!sitemap) problems.push("no sitemap.xml");
if (!existsSync(join(root, "robots.txt"))) problems.push("no robots.txt");

console.log(`check-seo: ${checked} pages, ${sitemapUrls.size} sitemap URLs`);
if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`check-seo: ${problems.length} problems`);
  process.exit(1);
}
console.log("check-seo: no problems");
