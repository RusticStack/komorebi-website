// Encodes the product picture into the AVIF and WebP files the home page uses, at a few widths.
// The output is committed under public/preview/, so a build needs neither sharp nor the source files.
//
//   node scripts/prepare-images.mjs <folder>
//
// <folder> holds inbox-light-wide.png, inbox-dark-wide.png, inbox-light-compact.png and
// inbox-dark-compact.png: real screenshots of the app (1280 x 800 and 900 x 700 windows).
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

export const WIDTHS = { wide: [800, 1312, 1920, 2560], compact: [720, 1440, 1800] };

for (const theme of ["light", "dark"]) {
  for (const size of ["wide", "compact"]) {
    const input = join(resolve(source), `inbox-${theme}-${size}.png`);
    for (const width of WIDTHS[size]) {
      const base = join(out, `inbox-${theme}-${size}-${width}`);
      const image = sharp(input).resize({ width, withoutEnlargement: true });
      await image.clone().avif({ quality: 60, effort: 6 }).toFile(`${base}.avif`);
      await image.clone().webp({ quality: 82, effort: 6 }).toFile(`${base}.webp`);
      console.log(`images: ${base}.{avif,webp}`);
    }
  }
}
