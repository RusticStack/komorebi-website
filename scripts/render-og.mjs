// Renders the Open Graph cards (public/og/<locale>/<page>.png, 1200 x 630) and the PNG icons
// (favicon-32.png, apple-touch-icon.png, brand/icon-192.png, brand/icon-512.png) with resvg.
// The output is committed, so a build does not depend on the fonts of the machine it runs on.
// Run it on Windows (it sets the line in Segoe UI) after changing a card:
//
//   node scripts/render-og.mjs
//
// A card is the paper ground, the seal, the wordmark and one line, nothing else. The seal is the
// neutral one (owner decision, November 2026): an ink square with the K in paper white, as in
// public/brand/*.svg, which the icons are made from.
import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const root = resolve(import.meta.dirname, "..");
const pub = join(root, "public");
const brand = (name) => readFileSync(join(pub, "brand", name), "utf8");
const pathOf = (svg) => /\sd="([^"]+)"/.exec(svg)[1];

const SEAL = pathOf(brand("mark.svg")); // the first path: the square with the K carved through
const WORD = pathOf(brand("wordmark.svg"));

const LINES = {
  home: { en: "Read. Reply. Rest.", pt: "Ler. Responder. Descansar." },
  download: { en: "Download for Windows 10 and 11", pt: "Transferir para Windows 10 e 11" },
  docs: { en: "Help", pt: "Ajuda" },
  privacy: { en: "Privacy", pt: "Privacidade" },
  changelog: { en: "Changelog", pt: "Alterações" },
  "code-signing": { en: "Code signing policy", pt: "Política de assinatura de código" },
  about: { en: "About Komorebi", pt: "Sobre o Komorebi" },
};

const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function card(line) {
  // seal: the mark's square spans 24..232 of its 256 box; draw it 112 px wide at the top left
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FFFFFF"/>
  <g transform="translate(${96 - 24 * (112 / 208)} ${96 - 24 * (112 / 208)}) scale(${112 / 208})"><path fill="#171717" fill-rule="evenodd" d="${SEAL}"/><path fill="#FFFFFF" d="${SEAL.slice(SEAL.indexOf("Z") + 1)}"/></g>
  <g transform="translate(96 ${390 - 24 * 0.75}) scale(0.75)"><path fill="#171717" d="${WORD}"/></g>
  <text x="96" y="530" font-family="Segoe UI" font-weight="600" font-size="52" letter-spacing="-1" fill="#555552">${escape(line)}</text>
</svg>`;
}

function png(svg, width, background) {
  return new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    background,
    font: { loadSystemFonts: true, defaultFontFamily: "Segoe UI" },
  })
    .render()
    .asPng();
}

for (const [key, lines] of Object.entries(LINES)) {
  for (const locale of ["en", "pt"]) {
    const dir = join(pub, "og", locale);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, `${key}.png`), png(card(lines[locale]), 1200));
  }
}

copyFileSync(join(pub, "brand", "favicon.svg"), join(pub, "favicon.svg"));
writeFileSync(join(pub, "favicon-32.png"), png(brand("favicon.svg"), 32));
writeFileSync(join(pub, "brand", "icon-192.png"), png(brand("app-icon.svg"), 192));
writeFileSync(join(pub, "brand", "icon-512.png"), png(brand("app-icon.svg"), 512));
// iOS fills transparency with black, so the touch icon sits on paper
writeFileSync(join(pub, "apple-touch-icon.png"), png(brand("app-icon.svg"), 180, "#FFFFFF"));
console.log("og: cards and icons written");
