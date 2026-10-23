import type { APIRoute } from "astro";
import { DOC_GROUPS, getDoc } from "../lib/docs";
import { absolute } from "../lib/seo";
import { LATEST_RELEASE_URL, REPO_URL } from "../lib/site";
import { downloadHref, getRelease } from "../lib/upstream";

// https://llmstxt.org: a short map of the site for language models. The full help text, in
// English, is in /llms-full.txt.
export const GET: APIRoute = () => {
  const release = getRelease();
  const lines = [
    "# Komorebi",
    "",
    "> Komorebi is a small, private email app for Windows 10 and 11. It reads and sends mail over IMAP and SMTP, keeps a local cache, and has no AI, no telemetry and no web engine. Free and open source under GPL-3.0-or-later.",
    "",
    `- Latest release: ${release ? `${release.version}, ${downloadHref()}` : LATEST_RELEASE_URL}`,
    `- Source code: ${REPO_URL}`,
    "- The site is in English and in European Portuguese (under /pt).",
    "",
    "## Pages",
    "",
    `- [Download](${absolute("/download")}): the installer, its SHA-256 and the requirements`,
    `- [Privacy](${absolute("/privacy")}): a ten-line summary and the full privacy statement`,
    `- [Changelog](${absolute("/changelog")}): every release, latest first`,
    `- [Code signing policy](${absolute("/code-signing")})`,
    `- [About](${absolute("/about")})`,
    "",
    ...DOC_GROUPS.flatMap((group) => [
      `## Help: ${group.title.en}`,
      "",
      ...group.pages.map((slug) => {
        const doc = getDoc("en", slug);
        return `- [${doc.title}](${absolute(doc.path)}): ${doc.description}`;
      }),
      "",
    ]),
    "## Optional",
    "",
    `- [All help pages in one file](${absolute("/llms-full.txt")})`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
