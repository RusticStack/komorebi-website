// Renders the Open Graph card of every page, in both languages, to public/og/<lang>/<key>.png
// with resvg and the Geist font from the geist package (the face of the Komorebi wordmark).
// Docs titles and descriptions come from the MDX frontmatter; the other pages are listed below.
import { Resvg } from "@resvg/resvg-js";
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
// The package's exports map hides its font files, so they are read from its folder directly
const geist = join(root, "node_modules", "geist", "dist", "fonts", "geist-sans");
const fontFiles = ["Geist-Regular.ttf", "Geist-SemiBold.ttf"].map((file) => join(geist, file));
const out = join(root, "public", "og");

const PAGES = {
  en: {
    home: {
      title: "A small, fast email client for Windows.",
      description: "Free and open source. No AI, no telemetry, no web engine.",
    },
    privacy: { title: "Privacy", description: "Komorebi collects nothing and has no server. What stays on your computer and what it sends." },
    changelog: { title: "Changelog", description: "Every Komorebi release and what it changed." },
    "code-signing": { title: "Code signing policy", description: "How releases are signed, who approves them and where signed builds come from." },
  },
  pt: {
    home: {
      title: "Um cliente de e-mail pequeno e rápido para Windows.",
      description: "Livre e de código aberto. Sem IA, sem telemetria, sem motor web.",
    },
    privacy: { title: "Privacidade", description: "O Komorebi não recolhe nada e não tem servidor. O que fica no seu computador e o que envia." },
    changelog: { title: "Alterações", description: "Todas as versões do Komorebi e o que mudou em cada uma." },
    "code-signing": { title: "Política de assinatura de código", description: "Como as versões são assinadas, quem as aprova e de onde vêm as compilações assinadas." },
  },
};

/** title and description from the frontmatter of every docs page, by language. */
function docsPages() {
  const dir = join(root, "content", "docs");
  const pages = { en: {}, pt: {} };
  for (const file of readdirSync(dir).filter((name) => name.endsWith(".mdx"))) {
    const lang = file.endsWith(".pt.mdx") ? "pt" : "en";
    const slug = file.replace(/(\.pt)?\.mdx$/, "");
    const front = /^---\n([\s\S]*?)\n---/.exec(readFileSync(join(dir, file), "utf8").replace(/\r\n/g, "\n"))?.[1] ?? "";
    const field = (name) => new RegExp(`^${name}:\\s*(.*)$`, "m").exec(front)?.[1]?.replace(/^"(.*)"$/, "$1") ?? "";
    pages[lang][slug === "index" ? "docs" : `docs-${slug}`] = { title: field("title"), description: field("description") };
  }
  return pages;
}

function escape(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Greedy wrap by an average glyph width; good enough for short titles in Geist. */
function wrap(text, size, width, maxLines) {
  const perLine = Math.floor(width / (size * 0.53));
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if ((line ? `${line} ${word}` : word).length > perLine && line) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/[\s,.;:]+\S*$/, "")}...`;
  }
  return lines;
}

const mark = `data:image/svg+xml;base64,${readFileSync(join(root, "public", "brand", "mark.svg")).toString("base64")}`;

function card(lang, key, { title, description }) {
  const home = key === "home";
  const textWidth = home ? 560 : 1040;
  const titleSize = home ? 54 : title.length > 40 ? 60 : 72;
  const titleLines = wrap(title, titleSize, textWidth, 3);
  const descLines = wrap(description, 28, textWidth, home ? 3 : 2);
  const titleTop = 250;
  const descTop = titleTop + titleLines.length * titleSize * 1.15 + 24;
  const shot = home
    ? `<image href="data:image/png;base64,${readFileSync(join(root, "scripts", "og-assets", `inbox-light-${lang}.png`)).toString("base64")}" x="640" y="130" width="760" height="475" clip-path="url(#shot)" preserveAspectRatio="xMinYMin slice"/>
       <rect x="640.5" y="130.5" width="759" height="474" rx="16" fill="none" stroke="#d9dde3"/>`
    : "";
  const section = key.startsWith("docs") ? (lang === "pt" ? "Documentação" : "Documentation") : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="0.85" cy="0.05" r="0.7">
      <stop offset="0" stop-color="#0ea5e9" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#0ea5e9" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="sun" cx="0.05" cy="0" r="0.5">
      <stop offset="0" stop-color="#ffc43d" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#ffc43d" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="shot"><rect x="640" y="130" width="760" height="475" rx="16"/></clipPath>
  </defs>
  <rect width="1200" height="630" fill="#ffffff"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#sun)"/>
  <circle cx="1090" cy="70" r="70" fill="#0ea5e9" fill-opacity="0.08"/>
  <circle cx="1010" cy="40" r="38" fill="#0ea5e9" fill-opacity="0.07"/>
  <image href="${mark}" x="72" y="64" width="80" height="80"/>
  <text x="172" y="120" font-family="Geist" font-weight="600" font-size="44" fill="#121317">Komorebi</text>
  ${section ? `<text x="72" y="205" font-family="Geist" font-weight="600" font-size="24" fill="#0b5cad">${escape(section)}</text>` : ""}
  ${titleLines
    .map((line, i) => `<text x="72" y="${titleTop + i * titleSize * 1.15 + titleSize * 0.8}" font-family="Geist" font-weight="600" font-size="${titleSize}" fill="#121317">${escape(line)}</text>`)
    .join("\n  ")}
  ${descLines
    .map((line, i) => `<text x="72" y="${descTop + i * 40 + 28}" font-family="Geist" font-size="28" fill="#4a4f57">${escape(line)}</text>`)
    .join("\n  ")}
  <text x="72" y="580" font-family="Geist" font-weight="600" font-size="24" fill="#0b5cad">komorebi.rusticstack.com</text>
  ${shot}
</svg>`;
}

const docs = docsPages();
let count = 0;
for (const lang of ["en", "pt"]) {
  mkdirSync(join(out, lang), { recursive: true });
  for (const [key, page] of Object.entries({ ...PAGES[lang], ...docs[lang] })) {
    const svg = card(lang, key, page);
    const png = new Resvg(svg, {
      fitTo: { mode: "width", value: 1200 },
      font: { fontFiles, loadSystemFonts: false, defaultFontFamily: "Geist" },
      background: "#ffffff",
    })
      .render()
      .asPng();
    writeFileSync(join(out, lang, `${key}.png`), png);
    count += 1;
  }
}
console.log(`render-og: wrote ${count} cards`);
