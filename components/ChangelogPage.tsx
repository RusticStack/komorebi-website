import { headings, markdownToHtml, prepareChangelog } from "../lib/markdown";
import type { Locale } from "../lib/i18n";
import { REPO_URL } from "../lib/site";
import { getRelease, readUpstream } from "../lib/upstream";
import { Toc } from "./Toc";

export const CHANGELOG_COPY = {
  en: {
    title: "Changelog",
    description: "Every Komorebi release and what it changed, including what each one changes in the local data.",
  },
  pt: {
    title: "Alterações",
    description: "Todas as versões do Komorebi e o que mudou em cada uma, incluindo o que cada uma altera nos dados locais.",
  },
};

export async function ChangelogPage({ locale }: { locale: Locale }) {
  const pt = locale === "pt";
  const release = getRelease();
  const tag = release?.tag ?? "main";
  const html = await markdownToHtml(prepareChangelog(readUpstream("CHANGELOG.md")));
  const toc = headings(html)
    .filter((h) => h.depth === 2)
    .map((h) => ({ title: h.text, url: `#${h.id}`, depth: 2 }));

  return (
    <div className="container page-shell">
      <main id="main" className="page-main">
        <article className="prose">
          <header className="docs-header">
            <h1>{CHANGELOG_COPY[locale].title}</h1>
            <p className="lead">{CHANGELOG_COPY[locale].description}</p>
            <p className="muted">
              {pt ? "Gerado a partir do " : "Generated from "}
              <a href={`${REPO_URL}/blob/${tag}/CHANGELOG.md`} rel="noopener">
                CHANGELOG.md
              </a>
              {pt ? ` na versão ${tag}. O registo de alterações é mantido em inglês. ` : ` at ${tag}. `}
              <a href={`${REPO_URL}/releases`} rel="noopener">
                {pt ? "Todas as versões no GitHub" : "All releases on GitHub"}
              </a>
            </p>
          </header>
          <div className="upstream changelog" lang="en" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      </main>
      <div className="docs-toc-aside">
        <Toc items={toc} label={pt ? "Versões" : "Versions"} />
      </div>
    </div>
  );
}
