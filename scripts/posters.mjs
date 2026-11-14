// Makes the video posters the site serves from the .jpg frames that come with the recordings:
// every public/media/**/<name>.jpg gets a <name>.webp next to it (at most 1920 px wide), which
// the player uses before the .jpg. Run it after adding or replacing a recording and commit both.
//
//   node scripts/posters.mjs        (pnpm posters)
import { readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const media = resolve(import.meta.dirname, "..", "public", "media");
const jpgs = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.jpe?g$/i.test(entry)) jpgs.push(full);
  }
})(media);

for (const jpg of jpgs) {
  const webp = jpg.replace(/\.jpe?g$/i, ".webp");
  const info = await sharp(jpg).resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 78, effort: 6 }).toFile(webp);
  console.log(`${webp.slice(media.length + 1)}  ${info.width} x ${info.height}  ${(info.size / 1024).toFixed(1)} KB`);
}
if (!jpgs.length) console.log("no .jpg posters in public/media");
