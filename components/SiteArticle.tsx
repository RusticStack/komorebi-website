import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMDXComponents } from "../mdx-components";
import { lastModified } from "../lib/git-dates";
import { HTML_LANG, localePath, ui, type Locale } from "../lib/i18n";
import { breadcrumbs, ogImage, pageMetadata } from "../lib/seo";
import { SITE_URL } from "../lib/site";
import { pagesSource, sitePages } from "../lib/source";
import { Checked } from "./Prose";
import { DownloadButton } from "./DownloadButton";
import { JsonLd } from "./JsonLd";

export function siteParams(locale: Locale) {
  return sitePages(locale).map((page) => ({ page: page.slugs[0] }));
}

export function siteFile(page: { path: string }) {
  return `content/pages/${page.path}`;
}

export function siteMetadata(locale: Locale, slug: string): Metadata {
  const page = pagesSource.getPage([slug], locale);
  if (!page) return {};
  return pageMetadata({
    locale,
    path: `/${slug}`,
    title: page.data.title,
    description: page.data.description ?? "",
    ogKey: `page-${slug}`,
    type: "article",
    absoluteTitle: true,
    modified: lastModified(siteFile(page)),
  });
}

/** About and the search-intent pages: a short header, the MDX body and a download block. */
export function SiteArticle({ locale, slug }: { locale: Locale; slug: string }) {
  const page = pagesSource.getPage([slug], locale);
  if (!page) notFound();
  const t = ui(locale);
  const Body = page.data.body;
  const file = siteFile(page);
  const pt = locale === "pt";
  return (
    <main id="main" className="page" tabIndex={-1}>
      <JsonLd
        data={breadcrumbs([
          { name: "Komorebi", url: localePath(locale, "/") },
          { name: page.data.heading ?? page.data.title, url: page.url },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": slug === "about" ? "AboutPage" : "WebPage",
          name: page.data.title,
          description: page.data.description,
          url: `${SITE_URL}${page.url}`,
          inLanguage: HTML_LANG[locale],
          dateModified: lastModified(file),
          primaryImageOfPage: `${SITE_URL}${ogImage(locale, `page-${slug}`).url}`,
          about: { "@id": `${SITE_URL}/#software` },
          isPartOf: { "@id": `${SITE_URL}/#website` },
        }}
      />
      <article className="prose page-article">
        <header className="page-header">
          {page.data.eyebrow ? <p className="eyebrow">{page.data.eyebrow}</p> : null}
          <h1>{page.data.heading ?? page.data.title}</h1>
          {page.data.description ? <p className="lead">{page.data.description}</p> : null}
          {page.data.checked ? <Checked date={page.data.checked} lang={locale} /> : null}
        </header>
        <Body components={getMDXComponents(locale)} />
      </article>
      <section className="page-cta" aria-labelledby="page-cta-title">
        <h2 id="page-cta-title">{pt ? "Experimente o Komorebi" : "Try Komorebi"}</h2>
        <p>{pt ? "Gratuito, sem conta e sem direitos de administrador." : "Free, with no account and no administrator rights."}</p>
        <DownloadButton locale={locale} />
        <p className="muted small">
          <a href={localePath(locale, "/docs/getting-started")}>{pt ? "Como instalar, passo a passo" : "How to install, step by step"}</a>
          <span aria-hidden="true"> · </span>
          <a href={localePath(locale, "/docs")}>{t.readDocs}</a>
        </p>
      </section>
    </main>
  );
}
