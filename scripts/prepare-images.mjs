// Encodes the product picture into the AVIF and WebP files the home page uses, at a few widths.
// The output is committed under public/preview/, so a build needs neither sharp nor the source files.
//
//   node scripts/prepare-images.mjs <folder>
//
// <folder> holds inbox-light-wide.png, inbox-dark-wide.png, inbox-light-compact.png and
// inbox-dark-compact.png: real screenshots of the app (1280 x 800 and 900 x 700 windows).
//
// The compact picture is only shown on a phone, where the page crops it to its left half (the
// sidebar and the message list), so only that half is encoded: 450 x 700, 9:14, the shape of the
// phone's picture box. The wide picture is 1280 wide at most, so there is no bigger file.
import { mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const source = process.argv[2];
if (!source) {
  console.error("usage: node scripts/prepare-images.mjs <folder with inbox-*.png>");
  process.exit(1);
}
const out = resolve(import.meta.dirname, "..", "public", "preview");
mkdirSync(out, { recursive: true });

export const WIDTHS = { wide: [800, 1280], compact: [360, 450] };

for (const theme of ["light", "dark"]) {
  for (const size of ["wide", "compact"]) {
    const input = join(resolve(source), `inbox-${theme}-${size}.png`);
    // the compact picture: its left half
    const meta = await sharp(input).metadata();
    const half = size === "compact" ? await sharp(input).extract({ left: 0, top: 0, width: Math.floor(meta.width / 2), height: meta.height }).toBuffer() : null;
    for (const width of WIDTHS[size]) {
      const base = join(out, `inbox-${theme}-${size}-${width}`);
      const image = sharp(half ?? input).resize({ width, withoutEnlargement: true });
      await image.clone().avif({ quality: 60, effort: 6 }).toFile(`${base}.avif`);
      await image.clone().webp({ quality: 82, effort: 6 }).toFile(`${base}.webp`);
      console.log(`images: ${base}.{avif,webp}`);
    }
  }
}
