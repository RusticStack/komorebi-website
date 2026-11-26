import { execFileSync } from "node:child_process";

// The date each file last changed in git, for the sitemap's <lastmod> and the docs' dateModified.
// A shallow clone (as some build hosts make) only knows recent commits; a file none of them
// touched falls back to the date of the newest commit, and without git to the build date.

const cache = new Map<string, string>();
let head: string | null | undefined;

function git(args: string[]): string {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function newestCommit(): string | null {
  if (head === undefined) head = git(["log", "-1", "--format=%cI"]) || null;
  return head;
}

/** ISO date (yyyy-mm-dd) of the last commit that touched any of the files. */
export function lastModified(...files: string[]): string {
  const dates = files.map((file) => {
    if (!cache.has(file)) cache.set(file, git(["log", "-1", "--format=%cI", "--", file]));
    return cache.get(file) ?? "";
  });
  const newest = dates.filter(Boolean).sort().pop() ?? newestCommit() ?? new Date().toISOString();
  return newest.slice(0, 10);
}
