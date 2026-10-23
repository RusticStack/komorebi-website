import Link from "next/link";
import { headings, markdownToHtml, preparePrivacy } from "../lib/markdown";
import { localePath, ui, type Locale } from "../lib/i18n";
import { REPO_URL } from "../lib/site";
import { getRelease, readUpstream } from "../lib/upstream";
import { Toc } from "./Toc";

export const PRIVACY_COPY = {
  en: {
    title: "Privacy",
    description:
      "Komorebi collects nothing and has no server. What it keeps on your computer, what it sends to your own mail servers, and the privacy of this website.",
  },
  pt: {
    title: "Privacidade",
    description:
      "O Komorebi não recolhe nada e não tem servidor. O que guarda no seu computador, o que envia aos seus servidores de correio e a privacidade deste site.",
  },
};

export async function PrivacyPage({ locale }: { locale: Locale }) {
  const pt = locale === "pt";
  const t = ui(locale);
  const release = getRelease();
  const tag = release?.tag ?? "main";
  const { body, updated } = preparePrivacy(readUpstream("PRIVACY.md"));
  const html = await markdownToHtml(body);
  const toc = [
    { title: pt ? "Em resumo" : "In short", url: "#summary", depth: 2 },
    { title: pt ? "Este site" : "This website", url: "#this-website", depth: 2 },
    { title: pt ? "Declaração de privacidade da aplicação" : "The app's privacy statement", url: "#statement", depth: 2 },
    ...headings(html).filter((h) => h.depth === 2).map((h) => ({ title: h.text, url: `#${h.id}`, depth: 3 })),
  ];

  return (
    <div className="container page-shell">
      <main id="main" className="page-main">
        <article className="prose">
          <header className="docs-header">
            <h1>{PRIVACY_COPY[locale].title}</h1>
            <p className="lead">{PRIVACY_COPY[locale].description}</p>
          </header>

          <h2 id="summary">{pt ? "Em resumo" : "In short"}</h2>
          {pt ? (
            <ul>
              <li>O Komorebi não tem telemetria, publicidade nem estatísticas de utilização, e não envia relatórios de falhas. Não existe nenhum serviço do Komorebi.</li>
              <li>
                O correio, os rascunhos, os contactos, o calendário, as regras e as definições ficam numa cache SQLite em <code>%LOCALAPPDATA%\komorebi</code>. A cache está em texto simples, a menos que ative Cifrar a cache de correio neste computador.
              </li>
              <li>As palavras-passe ficam só no Gestor de Credenciais do Windows, nunca nos ficheiros do Komorebi.</li>
              <li>
                A aplicação só liga aos servidores que configurar (IMAP, SMTP, CardDAV, CalDAV), ao DNS e à página de autoconfiguração do seu domínio quando pede para procurar definições, aos servidores de imagens de uma mensagem quando decide transferir as imagens, e ao GitHub quando procura ou transfere uma atualização.
              </li>
              <li>As notificações são locais: não há serviço de notificações push nem retransmissão na nuvem.</li>
              <li>Definições &gt; Privacidade &gt; Remover todos os dados apaga as palavras-passe guardadas e todos os ficheiros locais. O correio no servidor não é alterado.</li>
            </ul>
          ) : (
            <ul>
              <li>Komorebi has no telemetry, ads or usage analytics, and uploads no crash reports. There is no Komorebi service.</li>
              <li>
                Mail, drafts, contacts, the calendar, rules and settings stay in a SQLite cache in <code>%LOCALAPPDATA%\komorebi</code>. The cache is plaintext unless you turn on Encrypt the mail cache on this computer.
              </li>
              <li>Passwords are kept only in Windows Credential Manager, never in Komorebi&apos;s files.</li>
              <li>
                The app connects only to the servers you set up (IMAP, SMTP, CardDAV, CalDAV), to your domain&apos;s DNS and autoconfig page when you ask it to find settings, to a message&apos;s image hosts when you choose to load its images, and to GitHub when you check for or download an update.
              </li>
              <li>Notifications are local: there is no push service and no cloud relay.</li>
              <li>Settings &gt; Privacy &gt; Remove all data deletes the saved passwords and every local file. Mail on your server is not changed.</li>
            </ul>
          )}

          <h2 id="this-website">{pt ? "Este site" : "This website"}</h2>
          {pt ? (
            <p>
              Este site é um conjunto de páginas estáticas alojadas na Vercel. Não usa cookies, não tem estatísticas nem rastreadores e não carrega nada de outros sites: as imagens e os scripts vêm deste domínio, e o texto usa os tipos de letra do seu sistema. Para servir as páginas, a Vercel, como fornecedor de alojamento, processa os dados de cada pedido, como o endereço IP. O botão de transferência leva-o ao GitHub, onde estão os ficheiros das versões.
            </p>
          ) : (
            <p>
              This website is a set of static pages hosted on Vercel. It sets no cookies, runs no analytics or trackers and loads nothing from other sites: images and scripts come from this domain, and text uses your system's fonts. To serve the pages, Vercel, as the host, processes the data of each request, such as your IP address. The download button takes you to GitHub, where the release files are.
            </p>
          )}

          <h2 id="statement">{pt ? "Declaração de privacidade da aplicação" : "The app's privacy statement"}</h2>
          <p className="muted">
            {pt
              ? "Abaixo está a declaração de privacidade incluída com o Komorebi (PRIVACY.md), tal como está na versão "
              : "Below is the privacy statement that ships with Komorebi (PRIVACY.md), as it stands at release "}
            <a href={`${REPO_URL}/blob/${tag}/PRIVACY.md`} rel="noopener">
              {tag}
            </a>
            {updated ? (pt ? `, atualizada em ${updated}.` : `, last updated ${updated}.`) : "."}
            {pt ? " O texto completo é mantido em inglês." : ""}
          </p>
          <div className="upstream" lang="en" dangerouslySetInnerHTML={{ __html: html.replace(/<h2 /g, "<h3 ").replace(/<\/h2>/g, "</h3>") }} />
          <p className="muted small">
            <Link href={localePath(locale, "/code-signing")}>{t.codeSigning}</Link>
          </p>
        </article>
      </main>
      <div className="docs-toc-aside">
        <Toc items={toc} label={t.onThisPage} />
      </div>
    </div>
  );
}
