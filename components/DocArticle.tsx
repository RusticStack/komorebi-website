import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMDXComponents } from "../mdx-components";
import { localePath, ui, type Locale } from "../lib/i18n";
import { breadcrumbs, pageMetadata } from "../lib/seo";
import { SITE_REPO_URL } from "../lib/site";
import { docPages, docsNav, source } from "../lib/source";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";
import { JsonLd } from "./JsonLd";
import { Toc, TocInline } from "./Toc";

export function docParams(locale: Locale) {
  return docPages(locale).map((page) => ({ slug: page.slugs }));
}

/** The path of a docs page without the language prefix, as alternates() expects it. */
function barePath(slugs: string[]) {
  return slugs.length ? `/docs/${slugs.join("/")}` : "/docs";
}

export function docMetadata(locale: Locale, slug: string[] | undefined): Metadata {
  const page = source.getPage(slug, locale);
  if (!page) return {};
  return pageMetadata({
    locale,
    path: barePath(page.slugs),
    title: page.data.title,
    description: page.data.description ?? "",
    ogKey: page.slugs.length ? `docs-${page.slugs.join("-")}` : "docs",
    type: "article",
  });
}

export function DocArticle({ locale, slug }: { locale: Locale; slug: string[] | undefined }) {
  const page = source.getPage(slug, locale);
  if (!page) notFound();
  const t = ui(locale);
  const Body = page.data.body;
  const nav = docsNav(locale);
  const index = nav.findIndex((item) => item.url === page.url);
  const previous = index > 0 ? nav[index - 1] : undefined;
  const next = index >= 0 && index < nav.length - 1 ? nav[index + 1] : undefined;
  const docsHome = localePath(locale, "/docs");
  const file = `content/docs/${page.path}`;
  const isIndex = page.slugs.length === 0;

  const list = (
    <ul>
      {nav.map((item) => (
        <li key={item.url}>
          <Link href={item.url} aria-current={item.url === page.url ? "page" : undefined}>
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="container docs-shell">
      <aside className="docs-aside">
        <nav className="docs-nav" aria-label={t.docsNav}>
          {list}
        </nav>
      </aside>
      <main id="main" className="docs-main">
        <details className="docs-nav-fold">
          <summary>{t.docsNav}</summary>
          <nav className="docs-nav" aria-label={`${t.docsNav} (${t.menu})`}>
            {list}
          </nav>
        </details>
        <JsonLd
          data={breadcrumbs([
            { name: "Komorebi", url: localePath(locale, "/") },
            { name: t.docs, url: docsHome },
            ...(isIndex ? [] : [{ name: page.data.title, url: page.url }]),
          ])}
        />
        <article className="prose">
          <header className="docs-header">
            {!isIndex ? (
              <nav aria-label={t.breadcrumb} className="breadcrumb">
                <ol>
                  <li>
                    <Link href={docsHome}>{t.docs}</Link>
                  </li>
                  <li>
                    <span aria-current="page">{page.data.title}</span>
                  </li>
                </ol>
              </nav>
            ) : null}
            <h1>{page.data.title}</h1>
            {page.data.description ? <p className="lead">{page.data.description}</p> : null}
            <TocInline items={page.data.toc} label={t.onThisPage} />
          </header>
          <Body components={getMDXComponents()} />
        </article>
        <footer className="docs-footer">
          <p className="docs-meta">
            <a href={`${SITE_REPO_URL}/blob/main/${file}`} rel="noopener">
              {t.editPage}
            </a>
          </p>
          <nav className="pager" aria-label={t.pager}>
            {previous ? (
              <Link href={previous.url} rel="prev">
                <small>
                  <ArrowLeftIcon size={14} /> {t.previous}
                </small>
                <span>{previous.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={next.url} rel="next" className="pager-next">
                <small>
                  {t.next} <ArrowRightIcon size={14} />
                </small>
                <span>{next.title}</span>
              </Link>
            ) : null}
          </nav>
        </footer>
      </main>
      <div className="docs-toc-aside">
        <Toc items={page.data.toc} label={t.onThisPage} />
      </div>
    </div>
  );
}
