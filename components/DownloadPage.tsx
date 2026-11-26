import Link from "next/link";
import { localePath, ui, type Locale } from "../lib/i18n";
import { staticPage } from "../lib/pages";
import { breadcrumbs, softwareApplication } from "../lib/seo";
import { LATEST_RELEASE_URL, RELEASES_URL } from "../lib/site";
import { formatDate, formatMb, getRelease } from "../lib/upstream";
import { CodeBlock } from "./CodeBlock";
import { DownloadButton } from "./DownloadButton";
import { ArrowRightIcon } from "./icons";
import { JsonLd } from "./JsonLd";
import { Callout } from "./Prose";

/** /download: the button, what you need, three steps, and how to check the file. */
export function DownloadPage({ locale }: { locale: Locale }) {
  const pt = locale === "pt";
  const t = ui(locale);
  const page = staticPage(locale, "download");
  const release = getRelease();
  const installer = release?.installer?.name ?? "komorebi-<version>-setup.exe";
  const p = (path: string) => localePath(locale, path);

  return (
    <main id="main" className="page" tabIndex={-1}>
      <JsonLd data={softwareApplication(locale)} />
      <JsonLd
        data={breadcrumbs([
          { name: "Komorebi", url: p("/") },
          { name: t.download, url: p("/download") },
        ])}
      />
      <article className="prose page-article">
        <header className="page-header">
          <h1>{pt ? "Transferir o Komorebi" : "Download Komorebi"}</h1>
          <p className="lead">{page.description}</p>
          <DownloadButton locale={locale} />
          {release ? (
            <p className="muted small">
              {pt ? "Publicada a " : "Released "}
              <time dateTime={release.publishedAt}>{formatDate(release.publishedAt, locale)}</time>
              {release.installer ? ` · ${installer}, ${formatMb(release.installer.size, locale)}` : null}
            </p>
          ) : null}
        </header>

        <h2 id="requirements">{pt ? "O que precisa" : "What you need"}</h2>
        <ul>
          <li>{pt ? "Windows 10 ou 11, 64 bits (x64)." : "Windows 10 or 11, 64-bit (x64)."}</li>
          <li>
            {pt
              ? "Uma conta de e-mail com IMAP e SMTP e uma palavra-passe (ou palavra-passe de aplicação)."
              : "An email account with IMAP and SMTP and a password (or app password)."}
          </li>
        </ul>

        <h2 id="steps">{pt ? "Instalar em três passos" : "Install in three steps"}</h2>
        <ol className="steps">
          <li>
            <p className="step-title">{pt ? "Transfira o instalador" : "Download the installer"}</p>
            <p>{pt ? "Use o botão acima. O ficheiro vem do GitHub." : "Use the button above. The file comes from GitHub."}</p>
          </li>
          <li>
            <p className="step-title">{pt ? "Execute-o" : "Run it"}</p>
            <p>
              {pt
                ? "Instala-se só para o seu utilizador, sem direitos de administrador."
                : "It installs for your user only, with no administrator rights."}
            </p>
          </li>
          <li>
            <p className="step-title">{pt ? "Adicione a sua conta" : "Add your account"}</p>
            <p>
              <Link href={p("/docs/adding-an-account")}>{pt ? "Adicionar uma conta em três passos" : "Add an account in three steps"}</Link>
            </p>
          </li>
        </ol>

        <Callout type="warning" lang={locale} title={pt ? "O Windows protegeu o computador" : "Windows protected your PC"}>
          <p>
            {pt
              ? "O instalador ainda não tem assinatura de código, por isso o SmartScreen pode avisar. Confirme o SHA-256 (abaixo) e escolha Mais informações e depois Executar mesmo assim."
              : "The installer is not code-signed yet, so SmartScreen may warn. Check the SHA-256 (below), then choose More info and Run anyway."}
          </p>
        </Callout>

        <h2 id="check">{pt ? "Confirmar a transferência" : "Check the download"}</h2>
        <p>
          {pt
            ? "No PowerShell, na pasta da transferência, as duas linhas têm de mostrar o mesmo valor:"
            : "In PowerShell, in your downloads folder, both lines must show the same value:"}
        </p>
        <CodeBlock labels={{ copy: t.copyCode, copied: t.copied }}>
          <code>{`(Get-FileHash .\\${installer} -Algorithm SHA256).Hash.ToLower()\nGet-Content .\\${installer}.sha256`}</code>
        </CodeBlock>
        <p>
          {pt ? "Se forem diferentes, apague o ficheiro e transfira-o de novo." : "If they differ, delete the file and download it again."}{" "}
          <Link href={p("/code-signing")}>{t.codeSigning}</Link>
        </p>

        <h2 id="other">{pt ? "Outras versões" : "Other versions"}</h2>
        <ul className="link-list">
          <li>
            <a href={LATEST_RELEASE_URL} rel="noopener">
              {pt ? "Notas da versão mais recente no GitHub" : "Latest release notes on GitHub"}
            </a>
          </li>
          <li>
            <a href={RELEASES_URL} rel="noopener">
              {pt ? "Todas as versões no GitHub" : "All releases on GitHub"}
            </a>
          </li>
          <li>
            <Link href={p("/changelog")}>{pt ? "O que mudou em cada versão" : "What changed in each version"}</Link>
          </li>
          <li>
            <a href="/releases.xml">{t.releasesFeed}</a>
          </li>
        </ul>

        <nav className="next-steps" aria-label={t.nextSteps}>
          <p className="next-steps-title">{t.nextSteps}</p>
          <ul>
            <li>
              <Link href={p("/docs/getting-started")}>{pt ? "Guia de instalação completo" : "Full install guide"}</Link>
            </li>
            <li>
              <Link href={p("/docs/adding-an-account")}>{pt ? "Adicionar uma conta" : "Add an account"}</Link>
            </li>
            <li>
              <Link href={p("/docs/updates")}>{pt ? "Como chegam as atualizações" : "How updates arrive"}</Link>
            </li>
          </ul>
        </nav>
        <p>
          <Link href={p("/")} className="more">
            {pt ? "Voltar à página inicial" : "Back to the home page"} <ArrowRightIcon size={14} />
          </Link>
        </p>
      </article>
    </main>
  );
}
