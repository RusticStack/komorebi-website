// The Content-Security-Policy of the site and the check that keeps it true.
//
// The policy is sent as a header from vercel.json. Every page has the same inline code: the head
// script in src/layouts/Base.astro and the one inlined stylesheet. Both are allowed by their
// SHA-256, and nothing else is inline: scripts are bundled, same-origin modules, and the
// application/ld+json blocks are data, which a CSP does not govern.
//
// This script reads dist/ and exits 1 when
//   - an inline <script> or <style> has a hash that is not in the policy (new inline code),
//   - a page has an inline event handler, a style="" attribute or a javascript: URL,
//   - a page loads a script, style, image, font, media file or frame from another origin,
//   - the policy in vercel.json is not the one this script builds from the hashes found.
//
//   node scripts/check-csp.mjs [dist]          check
//   node scripts/check-csp.mjs [dist] --write  rewrite the policy in vercel.json to match dist
// `pnpm build` runs the check, so a stale hash fails the deploy instead of shipping a page with
// its stylesheet blocked. After editing site.css or the head script run `pnpm csp:update`.
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const args = process.argv.slice(2);
const write = args.includes("--write");
const root = resolve(args.find((a) => !a.startsWith("--")) ?? "dist");
const vercelPath = new URL("../vercel.json", import.meta.url);

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (entry.endsWith(".html")) files.push(full);
  }
})(root);

const sha256 = (text) => `'sha256-${createHash("sha256").update(text, "utf8").digest("base64")}'`;
const scriptHashes = new Set();
const styleHashes = new Set();
const problems = [];

// Scripts that run; the data types below never do.
const DATA_SCRIPT = /^(application\/(ld\+)?json|importmap|speculationrules)$/i;
const SELF = /^(\/(?!\/)|#|\.{0,2}\/|(?![a-z][a-z0-9+.-]*:|\/\/))/i; // relative or same-origin
const SITE = "https://komorebi.rusticstack.com";
const isSelf = (url) => SELF.test(url) || url.startsWith(`${SITE}/`) || url === SITE;

for (const file of files) {
  const rel = relative(root, file).replace(/\\/g, "/");
  const html = readFileSync(file, "utf8");
  const fail = (what) => problems.push(`${rel}: ${what}`);

  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1];
    const src = /\ssrc="([^"]*)"/i.exec(attrs)?.[1];
    const type = /\stype="([^"]*)"/i.exec(attrs)?.[1] ?? "";
    if (src !== undefined) {
      if (!isSelf(src)) fail(`script from another origin: ${src}`);
    } else if (!DATA_SCRIPT.test(type)) {
      scriptHashes.add(sha256(m[2]));
    }
  }
  for (const m of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) styleHashes.add(sha256(m[1]));

  // Everything outside <script> and <style> bodies.
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "<script></script>").replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "<style></style>");
  for (const tag of markup.matchAll(/<[a-z][a-z0-9-]*(?:\s+[^\s"'<>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?)*\s*\/?>/gi)) {
    const bare = tag[0].replace(/"[^"]*"|'[^']*'/g, '""');
    if (/\son[a-z]+\s*=/i.test(bare)) fail("inline event handler attribute");
    if (/\sstyle\s*=/i.test(bare)) fail('style="" attribute');
  }
  if (/\s(?:href|src|action)="\s*javascript:/i.test(markup)) fail("javascript: URL");
  for (const m of markup.matchAll(/<(link|img|source|video|audio|track|iframe|embed|object|form)\b([^>]*)>/gi)) {
    const tag = m[1].toLowerCase();
    const attrs = m[2];
    if (tag === "link" && !/\srel="(stylesheet|preload|icon|apple-touch-icon|manifest|modulepreload|prefetch)"/i.test(attrs)) continue;
    for (const a of attrs.matchAll(/\s(href|src|action|imagesrcset|srcset)="([^"]*)"/gi)) {
      const urls = /srcset/i.test(a[1]) ? a[2].split(",").map((s) => s.trim().split(/\s+/)[0]) : [a[2]];
      for (const u of urls) if (u && !isSelf(u) && !(tag !== "link" && u.startsWith("data:image/"))) fail(`<${tag}> loads ${u.slice(0, 60)}`); // img-src allows data: images
    }
    if (tag === "iframe" || tag === "embed" || tag === "object") fail(`<${tag}> is not allowed`);
  }
}

// The policy. Everything is 'self' except the two hashes sets above.
const policy = [
  "default-src 'self'",
  `script-src 'self' ${[...scriptHashes].sort().join(" ")}`,
  `style-src 'self' ${[...styleHashes].sort().join(" ")}`,
  "img-src 'self' data:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "worker-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

if (scriptHashes.size > 1) problems.push(`${scriptHashes.size} different inline scripts; expected one (the head script). Bundle the new one instead of inlining it.`);
if (styleHashes.size > 1) problems.push(`${styleHashes.size} different inline stylesheets; expected one. A page-specific <style> needs its own hash and a reason.`);

const config = JSON.parse(readFileSync(vercelPath, "utf8"));
const rule = config.headers.find((h) => h.source === "/(.*)");
const entry = rule?.headers.find((h) => h.key === "Content-Security-Policy");
if (write) {
  if (!entry) problems.push('vercel.json has no Content-Security-Policy header under "/(.*)"');
  else if (entry.value !== policy) {
    entry.value = policy;
    // Keep the file's own formatting: replace the one value in place.
    const text = readFileSync(vercelPath, "utf8");
    const next = text.replace(/("key": "Content-Security-Policy", "value": )"[^"]*"/, `$1${JSON.stringify(policy)}`);
    writeFileSync(vercelPath, next);
    console.log("check-csp: vercel.json updated");
  }
} else if (!entry) {
  problems.push('vercel.json has no Content-Security-Policy header under "/(.*)"');
} else if (entry.value !== policy) {
  problems.push(`the Content-Security-Policy in vercel.json is out of date. Run "pnpm csp:update". It should be:\n  ${policy}\nit is:\n  ${entry.value}`);
}
if (entry) {
  if (/unsafe-(inline|eval)/.test(entry.value)) problems.push("the policy contains 'unsafe-inline' or 'unsafe-eval'");
  const coop = rule.headers.find((h) => h.key === "Cross-Origin-Opener-Policy");
  if (coop?.value !== "same-origin") problems.push("Cross-Origin-Opener-Policy: same-origin is missing");
}

console.log(`check-csp: ${files.length} pages, ${scriptHashes.size} inline script hash, ${styleHashes.size} inline style hash`);
if (problems.length) {
  console.error(problems.join("\n"));
  console.error(`check-csp: ${problems.length} problems`);
  process.exit(1);
}
console.log("check-csp: no problems");
