import type { Locale } from "../lib/i18n";
import { LATEST_RELEASE_URL } from "../lib/site";
import { downloadTarget, formatMb } from "../lib/upstream";
import { DownloadIcon } from "./icons";

/**
 * The installer of the latest GitHub release, looked up at build time (scripts/upstream.mjs).
 * Without that lookup the button opens the latest release page instead.
 */
export function DownloadButton({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const { release, href, direct } = downloadTarget();
  const pt = locale === "pt";
  const meta = release?.installer
    ? pt
      ? `Versão ${release.version} · instalador de ${formatMb(release.installer.size, "pt")} · Windows 10 e 11 (x64)`
      : `Version ${release.version} · ${formatMb(release.installer.size, "en")} installer · Windows 10 and 11 (x64)`
    : pt
      ? "Windows 10 e 11 (x64)"
      : "Windows 10 and 11 (x64)";
  return (
    <div className={compact ? "download compact" : "download"}>
      <a className="button primary large" href={href} {...(direct ? {} : { rel: "noopener" })} data-download>
        <DownloadIcon size={20} />
        <span>{pt ? "Transferir para Windows" : "Download for Windows"}</span>
      </a>
      <p className="download-meta">
        {meta}
        {direct ? (
          <>
            {" · "}
            <a href={LATEST_RELEASE_URL} rel="noopener">
              {pt ? "Notas da versão" : "Release notes"}
            </a>
          </>
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
