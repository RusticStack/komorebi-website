// Copies the brand files and screenshots this site uses out of the Komorebi launch assets
// folder and writes a 640 px wide WebP beside each 1280 px one. Run by hand when the
// assets change; the output in public/ is committed, so the build does not need sharp.
//
//   node scripts/prepare-images.mjs <launch-assets-dir>
//
// sharp is not a dependency of this site. Set KOMOREBI_ASSET_TOOLS to a folder whose
// node_modules holds sharp (the launch assets README names one).
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";

const assets = resolve(process.argv[2] ?? "../komorebi-launch-assets");
const tools = process.env.KOMOREBI_ASSET_TOOLS;
if (!tools) throw new Error("Set KOMOREBI_ASSET_TOOLS to a folder with sharp in node_modules");
const sharp = createRequire(join(resolve(tools), "package.json"))("sharp");

const root = resolve(import.meta.dirname, "..");
const shots = join(root, "public", "shots");
const brand = join(root, "public", "brand");
mkdirSync(shots, { recursive: true });
mkdirSync(brand, { recursive: true });

export const VIEWS = [
  "inbox",
  "inbox-personal",
  "invite",
  "compose-table",
  "compose-signature",
  "recipients",
  "rules",
  "rule-edit",
  "contacts",
  "contact-edit",
  "calendar-month",
  "calendar-week",
  "calendar-agenda",
  "calendar-edit",
  "cert-prompt",
  "settings-general",
  "settings-privacy",
  "onboarding-found",
  "tabs",
  "welcome",
];

let count = 0;
for (const view of VIEWS) {
  for (const theme of ["light", "dark"]) {
    for (const lang of ["en", "pt"]) {
      const name = `${view}-${theme}-${lang}`;
      const webp = join(assets, "screenshots", `${name}.webp`);
      const png = join(assets, "screenshots", `${name}.png`);
      if (!existsSync(webp) || !existsSync(png)) throw new Error(`missing ${name}`);
      copyFileSync(webp, join(shots, `${name}.webp`));
      await sharp(png).resize({ width: 640 }).webp({ quality: 82, effort: 6 }).toFile(join(shots, `${name}-640.webp`));
      count += 2;
    }
  }
}

for (const file of ["mark.svg", "favicon.svg", "logo.svg", "logo-light.svg", "mark-mono.svg"]) {
  copyFileSync(join(assets, "brand", file), join(brand, file));
  count += 1;
}
await sharp(join(assets, "brand", "mark-512.png")).resize({ width: 180 }).png({ compressionLevel: 9 }).toFile(join(root, "public", "apple-touch-icon.png"));
await sharp(join(assets, "brand", "mark-512.png")).resize({ width: 192 }).png({ compressionLevel: 9 }).toFile(join(brand, "mark-192.png"));
copyFileSync(join(assets, "brand", "mark-512.png"), join(brand, "mark-512.png"));
copyFileSync(join(assets, "brand", "favicon-32.png"), join(root, "public", "favicon-32.png"));
count += 4;

// PNG copies of the inbox for the Open Graph cards (scripts/render-og.mjs embeds PNG, not WebP)
const ogAssets = join(root, "scripts", "og-assets");
mkdirSync(ogAssets, { recursive: true });
for (const lang of ["en", "pt"]) {
  await sharp(join(assets, "screenshots", `inbox-light-${lang}.png`)).resize({ width: 760 }).png({ compressionLevel: 9, palette: false }).toFile(join(ogAssets, `inbox-light-${lang}.png`));
  count += 1;
}
console.log(`prepare-images: wrote ${count} files`);
