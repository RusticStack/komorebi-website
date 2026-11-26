import { headings, markdownToHtml, prepareChangelog } from "../lib/markdown";
import { localePath, ui, type Locale } from "../lib/i18n";
import { staticPage } from "../lib/pages";
import { breadcrumbs } from "../lib/seo";
import { REPO_URL } from "../lib/site";
import { getRelease, readUpstream } from "../lib/upstream";
import { JsonLd } from "./JsonLd";
import { Toc } from "./Toc";

/** One version's section of the rendered changelog: its h2 and what follows it. */
function sections(html: string) {
  const parts = html.split(/(?=<h2 )/);
  const intro = parts[0].startsWith("<h2 ") ? "" : parts.shift() ?? "";
  return {
    intro,
    versions: parts.map((part) => {
      const m = /^<h2 id="([^"]+)">([\s\S]*?)<\/h2>/.exec(part);
      return { id: m?.[1] ?? "", title: (m?.[2] ?? "").replace(/<[^>]+>/g, ""), body: m ? part.slice(m[0].length) : part };
    }),
  };
}

export async function ChangelogPage({ locale }: { locale: Locale }) {
  const pt = locale === "pt";
  const t = ui(locale);
  const page = staticPage(locale, "changelog");
  const release = getRelease();
  const tag = release?.tag ?? "main";
  const html = await markdownToHtml(prepareChangelog(readUpstream("CHANGELOG.md")));
  const { intro, versions } = sections(html);
  const toc = headings(html)
    .filter((h) => h.depth === 2)
    .map((h) => ({ title: h.text, url: `#${h.id}`, depth: 2 }));

  return (
    <div className="page with-toc">
      <main id="main" tabIndex={-1}>
        <JsonLd
          data={breadcrumbs([
            { name: "Komorebi", url: localePath(locale, "/") },
            { name: t.changelog, url: localePath(locale, "/changelog") },
          ])}
        />
        <article className="prose">
          <header className="page-header">
            <h1>{t.changelog}</h1>
            <p className="lead">{page.description}</p>
            <p className="muted small">
              {pt ? "Gerado a partir do " : "Generated from "}
              <a href={`${REPO_URL}/blob/${tag}/CHANGELOG.md`} rel="noopener">
                CHANGELOG.md
              </a>
              {pt ? ` na versão ${tag}. O registo é mantido em inglês. ` : ` at ${tag}. `}
              <a href="/releases.xml">{t.releasesFeed}</a>
            </p>
          </header>
          <div className="upstream changelog" lang="en">
            {intro ? <div dangerouslySetInnerHTML={{ __html: intro }} /> : null}
            {versions.map((version, index) =>
              index === 0 ? (
                <section key={version.id} className="release latest" aria-labelledby={version.id}>
                  <h2 id={version.id}>
                    {version.title} <span data-badge>{pt ? "Mais recente" : "Latest"}</span>
                  </h2>
                  <div dangerouslySetInnerHTML={{ __html: version.body }} />
                </section>
              ) : (
                <details key={version.id} className="release">
                  <summary>
                    <h2 id={version.id}>{version.title}</h2>
                  </summary>
                  <div dangerouslySetInnerHTML={{ __html: version.body }} />
                </details>
              ),
            )}
          </div>
        </article>
      </main>
      <div className="docs-toc-aside">
        <Toc items={toc} label={pt ? "Versões" : "Versions"} />
      </div>
    </div>
  );
}
