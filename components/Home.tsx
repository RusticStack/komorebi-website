import Link from "next/link";
import { homeCopy } from "../lib/home-copy";
import { localePath, type Locale } from "../lib/i18n";
import { organization, softwareApplication, VIDEO, videoObject, website } from "../lib/seo";
import { formatMb, getRelease } from "../lib/upstream";
import { transcript } from "../lib/video";
import { DownloadButton } from "./DownloadButton";
import { ArrowRightIcon, FEATURE_ICONS, InfoIcon } from "./icons";
import { JsonLd } from "./JsonLd";
import { Shot } from "./Shot";
import { VideoPlayer } from "./VideoPlayer";

export function Home({ locale }: { locale: Locale }) {
  const c = homeCopy(locale);
  const p = (path: string) => localePath(locale, path);
  const release = getRelease();
  const size = release?.installer ? formatMb(release.installer.size, locale) : null;
  const fill = (text: string) => (size ? text.replace("{size}", size) : text.replace("{size} ", "").replace(" de {size}", ""));
  const lines = transcript(locale);
  const pt = locale === "pt";

  return (
    <main id="main" className="home" tabIndex={-1}>
      <JsonLd data={organization()} />
      <JsonLd data={website(locale)} />
      <JsonLd data={softwareApplication(locale)} />
      <JsonLd data={videoObject(locale, lines.join(" "))} />

      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-text">
            <p className="hero-badge">
              <span data-badge>{c.badge}</span>
              <span>GPL-3.0-or-later</span>
            </p>
            <h1 id="hero-title">{c.title}</h1>
            <p className="lead">{c.lead}</p>
            <div className="hero-actions">
              <DownloadButton locale={locale} showNotes={false} />
              <Link href={p("/docs")} role="button" className="secondary outline">
                {c.secondary}
              </Link>
            </div>
            <ul className="hero-facts">
              {c.facts.filter((fact) => size || !fact.includes("{size}")).map((fact) => (
                <li key={fact}>{fill(fact)}</li>
              ))}
            </ul>
            <p className="hero-note">
              <InfoIcon size={16} />
              <span>
                {c.smartscreen} <Link href={`${p("/docs/getting-started")}#check-the-download`}>{c.smartscreenLink}</Link>
              </span>
            </p>
          </div>
          <div className="hero-shot">
            <Shot name="inbox" alt={c.heroAlt} lang={locale} priority sizes="(min-width: 1280px) 760px, (min-width: 900px) 58vw, calc(100vw - 2rem)" />
          </div>
        </div>
      </section>

      <section className="section" id="features" aria-labelledby="features-title">
        <div className="container">
          <hgroup className="section-head">
            <h2 id="features-title">{c.featuresTitle}</h2>
            <p>{c.featuresLead}</p>
          </hgroup>
          <ul className="tiles">
            {c.features.map((feature) => {
              const Icon = FEATURE_ICONS[feature.icon];
              return (
                <li key={feature.title} className="tile">
                  <span className="tile-icon">
                    <Icon size={22} />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                  <Link href={p(feature.href)} className="more">
                    {feature.link} <ArrowRightIcon size={14} />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section band" id="video" aria-labelledby="video-title">
        <div className="container video-grid">
          <hgroup className="section-head">
            <h2 id="video-title">{c.videoTitle}</h2>
            <p>{c.videoLead}</p>
          </hgroup>
          <VideoPlayer
            locale={locale}
            label={c.videoLabel}
            title={c.videoTitle}
            sources={{ mp4: VIDEO.mp4, webm: VIDEO.webm, poster: VIDEO.poster }}
            width={VIDEO.width}
            height={VIDEO.height}
          />
          <details className="transcript">
            <summary>{c.transcriptTitle}</summary>
            <div>
              {lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </details>
        </div>
      </section>

      <section className="section" aria-labelledby="showcase-title">
        <div className="container">
          <h2 id="showcase-title" className="section-title">
            {c.showcaseTitle}
          </h2>
          <div className="showcase">
            {c.showcase.map((item, index) => (
              <article key={item.shot} className={index % 2 ? "showcase-item reverse" : "showcase-item"}>
                <div className="showcase-text">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <Link href={p(item.href)} className="more">
                    {item.link} <ArrowRightIcon size={14} />
                  </Link>
                </div>
                <Shot name={item.shot} alt={item.alt} lang={locale} sizes="(min-width: 1100px) 640px, calc(100vw - 2rem)" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section band" id="why" aria-labelledby="why-title">
        <div className="container">
          <hgroup className="section-head">
            <h2 id="why-title">{c.whyTitle}</h2>
            <p>{c.whyLead}</p>
          </hgroup>
          <div className="why">
            <article className="why-card" data-tone="has">
              <h3>{c.whyHas}</h3>
              <dl>
                {c.whyHasRows.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{fill(row.value)}</dd>
                  </div>
                ))}
              </dl>
            </article>
            <article className="why-card" data-tone="not">
              <h3>{c.whyNot}</h3>
              <dl>
                {c.whyNotRows.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </div>
          <p className="muted small">{c.whyNote}</p>
          <ul className="link-row">
            {c.compareLinks.map((link) => (
              <li key={link.href}>
                <Link href={p(link.href)} className="more">
                  {link.label} <ArrowRightIcon size={14} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="install" aria-labelledby="install-title">
        <div className="container">
          <h2 id="install-title" className="section-title">
            {c.installTitle}
          </h2>
          <ol className="install-steps">
            {c.installSteps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <Link href={p("/docs/getting-started")} className="more">
            {c.installLink} <ArrowRightIcon size={14} />
          </Link>
        </div>
      </section>

      <section className="section band" id="faq" aria-labelledby="faq-title">
        <div className="container narrow">
          <h2 id="faq-title" className="section-title">
            {c.faqTitle}
          </h2>
          {c.faq.map((item) => (
            <details key={item.q} className="faq">
              <summary>{item.q}</summary>
              <div>
                <p>{item.a}</p>
              </div>
            </details>
          ))}
          <Link href={p("/docs/faq")} className="more">
            {c.faqLink} <ArrowRightIcon size={14} />
          </Link>
        </div>
      </section>

      <section className="section closing" aria-labelledby="cta-title">
        <div className="container cta-box">
          <h2 id="cta-title">{c.ctaTitle}</h2>
          <p>{c.ctaText}</p>
          <DownloadButton locale={locale} />
          <p className="small">
            <Link href={p("/about")}>{pt ? "Sobre o Komorebi e quem o faz" : "About Komorebi and who makes it"}</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
