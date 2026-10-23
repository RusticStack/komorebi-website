// Fetches what the site takes from the Komorebi repository, at build time:
//   - the latest release (tag, date, installer name, size and download URL) from the GitHub API
//   - CHANGELOG.md, PRIVACY.md and README.md at that release's tag
// and writes them to .generated/ (ignored by git). When the network or the API fails, it
// falls back to the snapshot committed in upstream/, so a build never depends on GitHub.
//
//   node scripts/upstream.mjs            fetch, or fall back to upstream/
//   node scripts/upstream.mjs --snapshot fetch and also refresh upstream/ (commit the result)
//   KOMOREBI_UPSTREAM_OFFLINE=1          use upstream/ only
//
// GITHUB_TOKEN, when set, is sent to the API to raise the rate limit. It is never printed.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const REPO = "RusticStack/komorebi";
const FILES = ["CHANGELOG.md", "PRIVACY.md", "README.md"];
const root = resolve(import.meta.dirname, "..");
const out = join(root, ".generated");
const snapshot = join(root, "upstream");
const writeSnapshot = process.argv.includes("--snapshot");
const offline = process.env.KOMOREBI_UPSTREAM_OFFLINE === "1";

mkdirSync(out, { recursive: true });

async function get(url, accept) {
  const headers = { "User-Agent": "komorebi-website-build", Accept: accept };
  if (process.env.GITHUB_TOKEN && url.startsWith("https://api.github.com/")) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response;
}

async function fetchRelease() {
  const response = await get(`https://api.github.com/repos/${REPO}/releases/latest`, "application/vnd.github+json");
  const data = await response.json();
  const installer = data.assets.find((asset) => /^komorebi-.+-setup\.exe$/.test(asset.name));
  return {
    tag: data.tag_name,
    version: String(data.tag_name).replace(/^v/, ""),
    name: data.name,
    publishedAt: data.published_at,
    htmlUrl: data.html_url,
    installer: installer
      ? {
          name: installer.name,
          size: installer.size,
          url: installer.browser_download_url,
          sha256Url: data.assets.find((asset) => asset.name === `${installer.name}.sha256`)?.browser_download_url ?? null,
        }
      : null,
  };
}

function useSnapshot(reason) {
  console.warn(`upstream: using the committed snapshot (${reason})`);
  for (const file of [...FILES, "release.json"]) {
    const source = join(snapshot, file);
    if (!existsSync(source)) throw new Error(`upstream: no snapshot of ${file} in upstream/`);
    copyFileSync(source, join(out, file));
  }
}

async function main() {
  if (offline) return useSnapshot("KOMOREBI_UPSTREAM_OFFLINE=1");
  let release;
  const texts = {};
  try {
    release = await fetchRelease();
    for (const file of FILES) {
      const response = await get(`https://raw.githubusercontent.com/${REPO}/${release.tag}/${file}`, "text/plain");
      texts[file] = await response.text();
    }
  } catch (error) {
    return useSnapshot(error instanceof Error ? error.message : String(error));
  }
  release.fetchedFrom = `https://github.com/${REPO}/tree/${release.tag}`;
  const json = `${JSON.stringify(release, null, 2)}\n`;
  writeFileSync(join(out, "release.json"), json);
  for (const file of FILES) writeFileSync(join(out, file), texts[file]);
  if (writeSnapshot) {
    mkdirSync(snapshot, { recursive: true });
    writeFileSync(join(snapshot, "release.json"), json);
    for (const file of FILES) writeFileSync(join(snapshot, file), texts[file]);
  }
  const committed = existsSync(join(snapshot, "release.json"))
    ? JSON.parse(readFileSync(join(snapshot, "release.json"), "utf8")).tag
    : "none";
  console.log(`upstream: ${release.tag} from GitHub (committed snapshot: ${committed})`);
}

await main();
