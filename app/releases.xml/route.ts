import { markdownToHtml } from "../../lib/markdown";
import { AUTHOR, RELEASES_URL, SITE_URL } from "../../lib/site";
import { getReleases } from "../../lib/upstream";

export const dynamic = "force-static";

function escape(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** An Atom feed of Komorebi releases, from the GitHub releases API at build time. */
export async function GET() {
  const releases = getReleases();
  const updated = releases[0]?.publishedAt ?? new Date().toISOString();
  const entries = await Promise.all(
    releases.map(async (release) => {
      const html = await markdownToHtml(release.body || release.name);
      return `  <entry>
    <id>${escape(release.htmlUrl)}</id>
    <title>${escape(release.name)}</title>
    <link rel="alternate" type="text/html" href="${escape(release.htmlUrl)}"/>
    <updated>${escape(release.publishedAt)}</updated>
    <published>${escape(release.publishedAt)}</published>
    <content type="html">${escape(html)}</content>
  </entry>`;
    }),
  );
  const body = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">
  <id>${SITE_URL}/releases.xml</id>
  <title>Komorebi releases</title>
  <subtitle>New versions of Komorebi, a small, fast email client for Windows.</subtitle>
  <link rel="self" type="application/atom+xml" href="${SITE_URL}/releases.xml"/>
  <link rel="alternate" type="text/html" href="${RELEASES_URL}"/>
  <icon>${SITE_URL}/brand/mark-192.png</icon>
  <author><name>${escape(AUTHOR)}</name></author>
  <updated>${escape(updated)}</updated>
${entries.join("\n")}
</feed>
`;
  return new Response(body, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}
