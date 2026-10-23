import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { LATEST_RELEASE_URL } from "./site";

// Files fetched from the Komorebi repository by scripts/upstream.mjs before the build, with the
// committed snapshot in upstream/ as the fallback when .generated/ is missing (a plain `next dev`).

export function readUpstream(file: "CHANGELOG.md" | "PRIVACY.md" | "README.md" | "release.json"): string {
  for (const dir of [".generated", "upstream"]) {
    const path = join(process.cwd(), dir, file);
    if (existsSync(path)) return readFileSync(path, "utf8").replace(/\r\n/g, "\n");
  }
  throw new Error(`${file} not found in .generated/ or upstream/`);
}

export type Release = {
  tag: string;
  version: string;
  publishedAt: string;
  htmlUrl: string;
  installer: { name: string; size: number; url: string; sha256Url: string | null } | null;
};

export function getRelease(): Release | null {
  try {
    return JSON.parse(readUpstream("release.json")) as Release;
  } catch {
    return null;
  }
}

/** Where the download button points: the installer itself, or the latest release page. */
export function downloadTarget() {
  const release = getRelease();
  return {
    release,
    href: release?.installer?.url ?? LATEST_RELEASE_URL,
    direct: Boolean(release?.installer),
  };
}

/** "8.9 MB" in English, "8,9 MB" in Portuguese, decimal megabytes like Windows' installer pages. */
export function formatMb(bytes: number, locale: "en" | "pt"): string {
  const value = (bytes / 1_000_000).toFixed(1);
  return `${locale === "pt" ? value.replace(".", ",") : value} MB`;
}

export function formatDate(iso: string, locale: "en" | "pt"): string {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
