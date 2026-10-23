import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { LATEST_RELEASE_URL } from "./site";
import type { Locale } from "./i18n";

// Files fetched from the Komorebi repository by scripts/upstream.mjs before the build, with the
// committed snapshot in upstream/ as the fallback when .generated/ is missing.

type UpstreamFile = "CHANGELOG.md" | "PRIVACY.md" | "README.md" | "release.json";

export function readUpstream(file: UpstreamFile): string {
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
  installer: { name: string; size: number; url: string; sha256Url: string | null; sha256?: string | null } | null;
};

let cached: Release | null | undefined;

export function getRelease(): Release | null {
  if (cached !== undefined) return cached;
  try {
    cached = JSON.parse(readUpstream("release.json")) as Release;
  } catch {
    cached = null;
  }
  return cached;
}

/** Where a download button points: the installer itself, or the latest release page. */
export function downloadHref(): string {
  return getRelease()?.installer?.url ?? LATEST_RELEASE_URL;
}

/** "8.9 MB" in English, "8,9 MB" in Portuguese: decimal megabytes. */
export function formatMb(bytes: number, locale: Locale): string {
  const value = (bytes / 1_000_000).toFixed(1);
  return `${locale === "pt" ? value.replace(".", ",") : value} MB`;
}

export function installerSize(locale: Locale): string | null {
  const size = getRelease()?.installer?.size;
  return size ? formatMb(size, locale) : null;
}

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
