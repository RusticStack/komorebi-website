// Fetches what the site takes from the Komorebi repository, at build time:
//   - the latest release from the GitHub API: tag, date, and the name, size, download URL and
//     SHA-256 of the installer (komorebi-<version>-setup.exe) and of the portable zip
//     (komorebi-<version>-portable-x64.zip, new in 1.0). The hashes come from the installer's
//     .sha256 asset and from SHA256SUMS, which 1.0 releases carry for every file.
//   - CHANGELOG.md, PRIVACY.md and README.md at that release's tag
// and writes them to .generated/ (ignored by git). When the network or the API fails, it
// falls back to the snapshot committed in upstream/, so a build never depends on GitHub.
//
//   node scripts/upstream.mjs            fetch, or fall back to upstream/
//   node scripts/upstream.mjs --snapshot fetch and also refresh upstream/ (commit the result)
//   KOMOREBI_UPSTREAM_OFFLINE=1          use upstream/ only
//   KOMOREBI_UPSTREAM_LOCAL=<checkout>   preview a version that is not released yet: the three
//                                        files from a local Komorebi checkout, the version from
//                                        its Cargo.toml (its "Unreleased" changelog entry dated
//                                        today) and the file names its release will have, with
//                                        no size or hash. For checking the site only, never for
//                                        a deploy; it leaves upstream/ alone.
//
// GITHUB_TOKEN, when set, is sent to the API to raise the rate limit. It is never printed.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const REPO = "RusticStack/komorebi";
const FILES = ["CHANGELOG.md", "PRIVACY.md", "README.md"];
const INSTALLER = /^komorebi-.+-setup\.exe$/;
const PORTABLE = /^komorebi-.+-portable-x64\.zip$/;
const root = resolve(import.meta.dirname, "..");
const out = join(root, ".generated");
const snapshot = join(root, "upstream");
const writeSnapshot = process.argv.includes("--snapshot");
const offline = process.env.KOMOREBI_UPSTREAM_OFFLINE === "1";
const local = process.env.KOMOREBI_UPSTREAM_LOCAL;

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
  const installer = data.assets.find((asset) => INSTALLER.test(asset.name));
  const portable = data.assets.find((asset) => PORTABLE.test(asset.name));
  const sha256Asset = installer ? data.assets.find((asset) => asset.name === `${installer.name}.sha256`) : null;
  const sumsAsset = data.assets.find((asset) => asset.name === "SHA256SUMS");
  let sha256 = null;
  if (sha256Asset) {
    // The .sha256 asset holds the installer's hash, optionally followed by the file name.
    const text = await (await get(sha256Asset.browser_download_url, "text/plain")).text();
    sha256 = /\b[0-9a-f]{64}\b/i.exec(text)?.[0].toLowerCase() ?? null;
  }
  // SHA256SUMS: one "<hash>  <file name>" line per file of the release.
  const sums = new Map();
  if (sumsAsset) {
    const text = await (await get(sumsAsset.browser_download_url, "text/plain")).text();
    for (const [, hash, name] of text.matchAll(/^([0-9a-f]{64})\s+\*?(\S+)\s*$/gim)) sums.set(name, hash.toLowerCase());
  }
  const file = (asset, hash = null) => ({
    name: asset.name,
    size: asset.size,
    url: asset.browser_download_url,
    sha256: hash ?? sums.get(asset.name) ?? null,
  });
  return {
    tag: data.tag_name,
    version: String(data.tag_name).replace(/^v/, ""),
    name: data.name,
    publishedAt: data.published_at,
    htmlUrl: data.html_url,
    installer: installer ? { ...file(installer, sha256), sha256Url: sha256Asset?.browser_download_url ?? null } : null,
    portable: portable ? file(portable) : null,
    sha256sumsUrl: sumsAsset?.browser_download_url ?? null,
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

function useLocal(dir) {
  const read = (file) => readFileSync(join(dir, file), "utf8").replace(/\r\n/g, "\n");
  const pkg = read("Cargo.toml").split(/^(?=\[)/m).find((section) => section.startsWith("[package]")) ?? "";
  const version = /^version\s*=\s*"([^"]+)"/m.exec(pkg)?.[1];
  if (!version) throw new Error(`upstream: no [package] version in ${join(dir, "Cargo.toml")}`);
  const today = new Date().toISOString().slice(0, 10);
  const tag = `v${version}`;
  const download = (name) => `https://github.com/${REPO}/releases/download/${tag}/${name}`;
  const texts = Object.fromEntries(FILES.map((file) => [file, read(file)]));
  texts["CHANGELOG.md"] = texts["CHANGELOG.md"].replace(`## [${version}] - Unreleased`, `## [${version}] - ${today}`);
  const installer = `komorebi-${version}-setup.exe`;
  const portable = `komorebi-${version}-portable-x64.zip`;
  const release = {
    tag,
    version,
    name: `Komorebi ${version}`,
    publishedAt: `${today}T00:00:00Z`,
    htmlUrl: `https://github.com/${REPO}/releases/tag/${tag}`,
    installer: { name: installer, size: null, url: download(installer), sha256: null, sha256Url: download(`${installer}.sha256`) },
    portable: { name: portable, size: null, url: download(portable), sha256: null },
    sha256sumsUrl: download("SHA256SUMS"),
    preview: true,
    fetchedFrom: dir,
  };
  writeFileSync(join(out, "release.json"), `${JSON.stringify(release, null, 2)}\n`);
  for (const file of FILES) writeFileSync(join(out, file), texts[file]);
  console.warn(`upstream: PREVIEW of ${tag} from ${dir}, not a release: do not deploy this build`);
}

async function main() {
  if (local) return useLocal(resolve(local));
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
