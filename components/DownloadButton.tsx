import type { Locale } from "../lib/i18n";
import { LATEST_RELEASE_URL } from "../lib/site";
import { downloadTarget, formatMb } from "../lib/upstream";
import { DownloadIcon } from "./icons";

/**
 * The installer of the latest GitHub release, looked up at build time (scripts/upstream.mjs).
 * Without that lookup the button opens the latest release page instead.
 */
export function DownloadButton({ locale, showNotes = true }: { locale: Locale; showNotes?: boolean }) {
  const { release, href, direct } = downloadTarget();
  const pt = locale === "pt";
  const facts = [
    release ? (pt ? `Versão ${release.version}` : `Version ${release.version}`) : null,
    release?.installer ? (pt ? `${formatMb(release.installer.size, "pt")}` : `${formatMb(release.installer.size, "en")}`) : null,
    pt ? "Windows 10 e 11, x64" : "Windows 10 and 11, x64",
  ].filter(Boolean) as string[];
  return (
    <div className="download">
      <a role="button" className="download-button" href={href} {...(direct ? {} : { rel: "noopener" })} data-download>
        <DownloadIcon size={20} />
        <span>{pt ? "Transferir para Windows" : "Download for Windows"}</span>
      </a>
      <p className="download-meta">
        {facts.map((fact, i) => (
          <span key={fact}>
            {i > 0 ? <span aria-hidden="true"> · </span> : null}
            {fact}
          </span>
        ))}
        {direct && showNotes ? (
          <span>
            <span aria-hidden="true"> · </span>
            <a href={LATEST_RELEASE_URL} rel="noopener">
              {pt ? "Notas da versão no GitHub" : "Release notes on GitHub"}
            </a>
          </span>
        ) : null}
      </p>
    </div>
  );
}

/** For MDX pages: a plain link to the installer, or to the latest release page. */
export function DownloadLink({ lang = "en" }: { lang?: Locale }) {
  const { release, href } = downloadTarget();
  const name = release?.installer?.name;
  if (!name) {
    return (
      <a href={LATEST_RELEASE_URL} rel="noopener">
        {lang === "pt" ? "a versão mais recente no GitHub" : "the latest release on GitHub"}
      </a>
    );
  }
  return (
    <a href={href}>
      <code>{name}</code>
    </a>
  );
}
