import Link from "next/link";
import { homeCopy } from "../lib/home-copy";
import { localePath, type Locale } from "../lib/i18n";
import { softwareApplication } from "../lib/seo";
import { REPO_URL } from "../lib/site";
import { formatMb, getRelease } from "../lib/upstream";
import { DownloadButton } from "./DownloadButton";
import { ArrowRightIcon, FEATURE_ICONS, GitHubIcon, InfoIcon, ShieldIcon } from "./icons";
import { JsonLd } from "./JsonLd";
import { Shot } from "./Shot";

export function Home({ locale }: { locale: Locale }) {
  const c = homeCopy(locale);
  const p = (path: string) => localePath(locale, path);
  const release = getRelease();
  const size = release?.installer ? formatMb(release.installer.size, locale) : null;
  const numbers = c.numbers.filter((n) => n.value !== "{size}" || size).map((n) => (n.value === "{size}" ? { ...n, value: size ?? "" } : n));

  return (
    <main id="main">
      <JsonLd data={softwareApplication(locale)} />
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <img className="hero-mark" src="/brand/mark.svg" alt="" width={72} height={72} />
            <p className="eyebrow">{c.eyebrow}</p>
            <h1>{c.title}</h1>
            <p className="lead">{c.lead}</p>
            <div className="hero-actions">
              <DownloadButton locale={locale} />
              <a className="button secondary large" href={REPO_URL} rel="noopener">
                <GitHubIcon size={18} />
                <span>{c.secondary}</span>
              </a>
            </div>
            <aside className="notice" aria-labelledby="smartscreen-title">
              <InfoIcon size={18} />
              <div>
                <p id="smartscreen-title" className="notice-title">
                  {c.smartscreenTitle}
                </p>
                <p>
                  {c.smartscreen}{" "}
                  <Link href={`${p("/docs/getting-started")}#${locale === "pt" ? "confirmar-a-transferência" : "check-the-download"}`}>
                    {c.smartscreenLink}
                  </Link>
                </p>
              </div>
            </aside>
          </div>
          <div className="hero-shot">
            <Shot name="inbox" alt={c.heroAlt} lang={locale} priority sizes="(min-width: 1240px) 1160px, 100vw" />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="features-title">
        <div className="container">
          <h2 id="features-title">{c.featuresTitle}</h2>
          <p className="section-lead">{c.featuresLead}</p>
          <ul className="tiles">
            {c.features.map((feature) => {
              const Icon = FEATURE_ICONS[feature.icon];
              return (
                <li key={feature.title} className="tile">
                  <span className="tile-icon">
                    <Icon size={22} />
                  </span>
                  <h3>
                    <Link href={p(feature.href)}>{feature.title}</Link>
                  </h3>
                  <p>{feature.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section alt" aria-labelledby="showcase-title">
        <div className="container">
          <h2 id="showcase-title">{c.showcaseTitle}</h2>
          <div className="showcase">
            {c.showcase.map((item, index) => (
              <article key={item.shot} className={index % 2 ? "showcase-item reverse" : "showcase-item"}>
                <div className="showcase-text">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <p>
                    <Link href={p(item.href)} className="more">
                      {locale === "pt" ? "Saber mais" : "Learn more"} <ArrowRightIcon size={16} />
                    </Link>
                  </p>
                </div>
                <Shot name={item.shot} alt={item.alt} lang={locale} sizes="(min-width: 1100px) 640px, 100vw" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="numbers-title">
        <div className="container">
          <h2 id="numbers-title">{c.numbersTitle}</h2>
          <p className="section-lead">{c.numbersLead}</p>
          <dl className="stats">
            {numbers.map((stat) => (
              <div key={stat.label} className="stat">
                <dt>{stat.value}</dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
          <p className="muted small">{c.numbersNote}</p>
        </div>
      </section>

      <section className="section alt" aria-labelledby="privacy-title">
        <div className="container split">
          <div>
            <h2 id="privacy-title">{c.privacyTitle}</h2>
            <p className="section-lead">{c.privacyLead}</p>
            <ul className="checklist">
              {c.privacyItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p>
              <Link href={p("/privacy")} className="more">
                {c.privacyLink} <ArrowRightIcon size={16} />
              </Link>
            </p>
          </div>
          <Shot
            name="settings-privacy"
            alt={
              locale === "pt"
                ? "Definições, Privacidade: imagens remotas, a cache cifrada e a remoção de dados"
                : "Settings, Privacy: remote images, the encrypted cache and data removal"
            }
            lang={locale}
            sizes="(min-width: 1100px) 560px, 100vw"
          />
        </div>
      </section>

      <section className="section" aria-labelledby="trust-title">
        <div className="container">
          <h2 id="trust-title">{c.trustTitle}</h2>
          <ul className="tiles three">
            {c.trust.map((item) => (
              <li key={item.title} className="tile">
                <span className="tile-icon">
                  <ShieldIcon size={22} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <p>
                  <Link href={p(item.href)} className="more">
                    {item.link} <ArrowRightIcon size={16} />
                  </Link>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section cta" aria-labelledby="cta-title">
        <div className="container cta-box">
          <h2 id="cta-title">{c.ctaTitle}</h2>
          <p>{c.ctaText}</p>
          <DownloadButton locale={locale} compact />
        </div>
      </section>
    </main>
  );
}
