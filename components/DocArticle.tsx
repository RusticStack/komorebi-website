import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMDXComponents } from "../mdx-components";
import { faqItems } from "../lib/faq";
import { lastModified } from "../lib/git-dates";
import { localePath, ui, type Locale } from "../lib/i18n";
import { breadcrumbs, faqPage, pageMetadata, techArticle } from "../lib/seo";
import { DOCS_FEEDBACK_URL, SITE_REPO_URL } from "../lib/site";
import { docPages, docsGroups, docsNav, source } from "../lib/source";
import { formatDate } from "../lib/upstream";
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

function ogKey(slugs: string[]) {
  return slugs.length ? `docs-${slugs.join("-")}` : "docs";
}

export function docFile(page: { path: string }) {
  return `content/docs/${page.path}`;
}

export function docMetadata(locale: Locale, slug: string[] | undefined): Metadata {
  const page = source.getPage(slug, locale);
  if (!page) return {};
  return pageMetadata({
    locale,
    path: barePath(page.slugs),
    title: page.slugs.length ? page.data.title : `${page.data.title}`,
    description: page.data.description ?? "",
    ogKey: ogKey(page.slugs),
    type: "article",
    modified: lastModified(docFile(page)),
  });
}

export function DocArticle({ locale, slug }: { locale: Locale; slug: string[] | undefined }) {
  const page = source.getPage(slug, locale);
  if (!page) notFound();
  const t = ui(locale);
  const Body = page.data.body;
  const groups = docsGroups(locale);
  const nav = docsNav(locale);
  const index = nav.findIndex((item) => item.url === page.url);
  const previous = index > 0 ? nav[index - 1] : undefined;
  const next = index >= 0 && index < nav.length - 1 ? nav[index + 1] : undefined;
  const docsHome = localePath(locale, "/docs");
  const file = docFile(page);
  const isIndex = page.slugs.length === 0;
  const group = groups.find((g) => g.items.some((item) => item.url === page.url));
  const updated = lastModified(file);
  const toc = page.data.toc.filter((item) => item.depth <= 3);
  const isFaq = page.slugs.join("/") === "faq";

  const sidebar = (
    <>
      {groups.map((g, gi) => (
        <section key={g.title ?? gi} aria-labelledby={g.title ? `nav-${gi}` : undefined}>
          {g.title ? (
            <p className="docs-nav-title" id={`nav-${gi}`}>
              {g.title}
            </p>
          ) : null}
          <ul>
            {g.items.map((item) => (
              <li key={item.url}>
                <Link href={item.url} aria-current={item.url === page.url ? "page" : undefined}>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );

  const crumbs = [
    { name: "Komorebi", url: localePath(locale, "/") },
    { name: t.docs, url: docsHome },
    ...(isIndex ? [] : [{ name: page.data.title, url: page.url }]),
  ];

  return (
    <div className="docs-shell">
      <aside className="docs-aside">
        <nav className="docs-nav" aria-label={t.docsNav}>
          {sidebar}
        </nav>
      </aside>
      <main id="main" className="docs-main" tabIndex={-1}>
        <details className="docs-nav-fold">
          <summary>
            <span>{t.docsNav}</span>
            {group?.title ? <small>{group.title}</small> : null}
          </summary>
          <nav className="docs-nav" aria-label={`${t.docsNav} (${t.menu})`}>
            {sidebar}
          </nav>
        </details>
        <JsonLd data={breadcrumbs(crumbs)} />
        <JsonLd
          data={techArticle({ locale, url: page.url, title: page.data.title, description: page.data.description ?? "", file, ogKey: ogKey(page.slugs) })}
        />
        {isFaq ? <JsonLd data={faqPage(faqItems(file))} /> : null}
        <article className="prose">
          <header className="doc-header">
            {!isIndex ? (
              <nav aria-label={t.breadcrumb} className="breadcrumb">
                <ol>
                  <li>
                    <Link href={docsHome}>{t.docs}</Link>
                  </li>
                  {group?.title ? <li>{group.title}</li> : null}
                  <li>
                    <span aria-current="page">{page.data.title}</span>
                  </li>
                </ol>
              </nav>
            ) : null}
            <h1>{page.data.title}</h1>
            {page.data.description ? <p className="lead">{page.data.description}</p> : null}
            {toc.length > 2 ? <TocInline items={toc} label={t.onThisPage} /> : null}
          </header>
          <Body components={getMDXComponents(locale)} />
        </article>
        <footer className="doc-footer">
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
          <div className="doc-meta">
            <p>
              {t.helpful}{" "}
              <a href={`${DOCS_FEEDBACK_URL}&title=${encodeURIComponent(`Docs: ${page.data.title}`)}&page=${encodeURIComponent(page.url)}`} rel="noopener">
                {t.helpfulLink}
              </a>
            </p>
            <p>
              <a href={`${SITE_REPO_URL}/edit/main/${file}`} rel="noopener">
                {t.editPage}
              </a>
              <span aria-hidden="true"> · </span>
              {t.lastUpdated} <time dateTime={updated}>{formatDate(`${updated}T12:00:00Z`, locale)}</time>
            </p>
          </div>
        </footer>
      </main>
      <div className="docs-toc-aside">{!isIndex && toc.length > 1 ? <Toc items={toc} label={t.onThisPage} /> : null}</div>
    </div>
  );
}
