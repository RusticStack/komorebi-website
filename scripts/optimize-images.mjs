// Writes an AVIF beside every WebP screenshot in public/shots that has none yet, and AVIF and
// WebP copies of the video poster. Part of `pnpm build`: files that exist are skipped (use
// --force after replacing screenshots). The output is committed, so a build never waits for it.
//   node scripts/optimize-images.mjs [--force]
import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const force = process.argv.includes("--force");
const jobs = [];

const shots = join(root, "public", "shots");
for (const file of readdirSync(shots).filter((name) => name.endsWith(".webp"))) {
  const from = join(shots, file);
  const to = join(shots, file.replace(/\.webp$/, ".avif"));
  if (force || !existsSync(to)) {
    jobs.push(() => sharp(from).avif({ quality: 60, effort: 5 }).toFile(to));
  }
}

const poster = join(root, "public", "video", "komorebi-promo-poster.jpg");
if (existsSync(poster)) {
  for (const [ext, encode] of [
    ["avif", (s) => s.avif({ quality: 55, effort: 5 })],
    ["webp", (s) => s.webp({ quality: 80 })],
  ]) {
    const to = poster.replace(/\.jpg$/, `.${ext}`);
    if (force || !existsSync(to)) jobs.push(() => encode(sharp(poster)).toFile(to));
  }
}

let done = 0;
const workers = Array.from({ length: 4 }, async () => {
  while (jobs.length) {
    await jobs.shift()();
    done += 1;
  }
});
await Promise.all(workers);
console.log(`optimize-images: wrote ${done} files`);
