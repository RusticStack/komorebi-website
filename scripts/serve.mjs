// A small static server for dist/ that behaves like the Vercel deployment: it applies the
// headers, redirects and cleanUrls of vercel.json and compresses text. Use it, not `astro preview`,
// to see the real Content-Security-Policy and to run Lighthouse locally.
//   node scripts/serve.mjs [dist] [port]      (port 4173 by default)
import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { extname, join, resolve, sep } from "node:path";
import { brotliCompressSync, gzipSync } from "node:zlib";

const root = resolve(process.argv[2] ?? "dist");
const port = Number(process.argv[3] ?? 4173);
// vercel.json is read again on every request, so `pnpm csp:update` takes effect without a restart
const loadConfig = () => JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".webm": "video/webm",
  ".mp4": "video/mp4",
  ".vtt": "text/vtt; charset=utf-8",
};
const COMPRESSIBLE = /^(text\/|application\/(json|xml|manifest\+json)|image\/svg)/;

// Vercel's `source` patterns are path-to-regexp; the ones used here are plain regular expressions
// and `:name*` parameters.
const toRegExp = (source) => new RegExp(`^${source.replace(/:(\w+)\*/g, "(?<$1>.*)")}$`);

function resolveFile(pathname) {
  const clean = decodeURIComponent(pathname).replace(/\/+$/, "") || "/";
  const candidates = clean === "/" ? ["index.html"] : [clean.slice(1), `${clean.slice(1)}.html`, join(clean.slice(1), "index.html")];
  for (const c of candidates) {
    const full = resolve(root, c);
    if (full.startsWith(root + sep) || full === root) if (existsSync(full) && statSync(full).isFile()) return full;
  }
  return null;
}

const cache = new Map();
createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const config = loadConfig();
  const headers = (config.headers ?? []).map((h) => ({ re: toRegExp(h.source), list: h.headers }));
  const redirects = (config.redirects ?? []).map((r) => ({ ...r, re: toRegExp(r.source) }));
  for (const r of redirects) {
    const m = r.re.exec(url.pathname);
    if (m) {
      const to = r.destination.replace(/:(\w+)/g, (_, k) => m.groups?.[k] ?? "");
      res.writeHead(r.permanent ? 308 : 307, { Location: to });
      return res.end();
    }
  }
  // cleanUrls: /x.html goes to /x
  if (url.pathname.endsWith(".html")) {
    res.writeHead(308, { Location: url.pathname.replace(/(\/index)?\.html$/, "") || "/" });
    return res.end();
  }
  let file = resolveFile(url.pathname);
  let status = 200;
  if (!file) {
    file = join(root, "404.html");
    status = 404;
  }
  const type = TYPES[extname(file)] ?? "application/octet-stream";
  const out = {};
  for (const h of headers) if (h.re.test(url.pathname)) for (const { key, value } of h.list) out[key] = value;
  out["Content-Type"] = out["Content-Type"] ?? type;
  if (!out["Cache-Control"]) out["Cache-Control"] = file.includes(`${sep}_astro${sep}`) ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate";
  let body = readFileSync(file);
  // video: answer a byte range, as a CDN does, so the browser can seek
  const range = /^bytes=(\d*)-(\d*)$/.exec(String(req.headers.range ?? ""));
  if (range && status === 200 && type.startsWith("video/")) {
    const start = range[1] ? Number(range[1]) : Math.max(0, body.length - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), body.length - 1) : body.length - 1;
    out["Content-Range"] = `bytes ${start}-${end}/${body.length}`;
    out["Accept-Ranges"] = "bytes";
    out["Content-Length"] = end - start + 1;
    res.writeHead(206, out);
    return res.end(req.method === "HEAD" ? undefined : body.subarray(start, end + 1));
  }
  if (type.startsWith("video/")) out["Accept-Ranges"] = "bytes";
  const accept = String(req.headers["accept-encoding"] ?? "");
  if (COMPRESSIBLE.test(out["Content-Type"]) && body.length > 1024) {
    const enc = accept.includes("br") ? "br" : accept.includes("gzip") ? "gzip" : "";
    if (enc) {
      const key = `${enc}:${file}:${statSync(file).mtimeMs}`;
      if (!cache.has(key)) cache.set(key, enc === "br" ? brotliCompressSync(body) : gzipSync(body));
      body = cache.get(key);
      out["Content-Encoding"] = enc;
      out["Vary"] = "Accept-Encoding";
    }
  }
  out["Content-Length"] = body.length;
  res.writeHead(status, out);
  res.end(req.method === "HEAD" ? undefined : body);
}).listen(port, "127.0.0.1", () => console.log(`serving ${root} at http://127.0.0.1:${port}`));
