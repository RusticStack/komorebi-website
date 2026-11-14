// Encodes the product pictures the site uses: crops of the real Komorebi 1.0 screenshots, light
// and dark, as AVIF and WebP at the widths in src/lib/shots.json. The output is committed under
// public/shots/, so a build needs neither sharp nor the source files.
//
//   node scripts/prepare-images.mjs <folder>
//
// <folder> is the app repository's .github/assets/screenshots: <name>-light.webp and
// <name>-dark.webp, 1280 x 800 windows with made-up demo mail.
import { mkdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const source = process.argv[2];
if (!source) {
  console.error("usage: node scripts/prepare-images.mjs <folder with <name>-light.webp and <name>-dark.webp>");
  process.exit(1);
}
const root = resolve(import.meta.dirname, "..");
const crops = JSON.parse(readFileSync(join(root, "src", "lib", "shots.json"), "utf8"));
const out = join(root, "public", "shots");
mkdirSync(out, { recursive: true });

for (const [name, crop] of Object.entries(crops)) {
  if (name === "_") continue;
  for (const theme of ["light", "dark"]) {
    const input = join(resolve(source), `${crop.src}-${theme}.webp`);
    const region = await sharp(input).extract({ left: crop.x, top: crop.y, width: crop.w, height: crop.h }).toBuffer();
    for (const width of crop.widths) {
      const base = join(out, `${name}-${theme}-${width}`);
      const image = sharp(region).resize({ width, withoutEnlargement: true });
      await image.clone().avif({ quality: 62, effort: 7 }).toFile(`${base}.avif`);
      await image.clone().webp({ quality: 84, effort: 6 }).toFile(`${base}.webp`);
      console.log(`images: ${name}-${theme}-${width}.{avif,webp}`);
    }
  }
}
