import type { APIRoute } from "astro";
import { releases } from "../lib/changelog";
import { absolute } from "../lib/seo";
import { REPO_URL } from "../lib/site";

// An RSS 2.0 feed of Komorebi releases, from CHANGELOG.md at the latest release tag.
const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GET: APIRoute = () => {
  const entries = releases();
  const items = entries.map((entry) => {
    const date = new Date(`${entry.date}T12:00:00Z`).toUTCString();
    return [
      "<item>",
      `<title>Komorebi ${escape(entry.version)}</title>`,
      `<link>${REPO_URL}/releases/tag/v${escape(entry.version)}</link>`,
      `<guid isPermaLink="false">komorebi-${escape(entry.version)}</guid>`,
      `<pubDate>${date}</pubDate>`,
      `<description>${escape(entry.html)}</description>`,
      "</item>",
    ].join("");
  });
  const latest = entries[0] ? new Date(`${entries[0].date}T12:00:00Z`).toUTCString() : new Date().toUTCString();
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>Komorebi releases</title>
<link>${absolute("/changelog")}</link>
<atom:link href="${absolute("/releases.xml")}" rel="self" type="application/rss+xml"/>
<description>New versions of Komorebi, a small, private email app for Windows.</description>
<language>en</language>
<lastBuildDate>${latest}</lastBuildDate>
${items.join("\n")}
</channel>
</rss>
`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
};
