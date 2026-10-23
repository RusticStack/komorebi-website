import Link from "next/link";
import { localePath, type Locale } from "../lib/i18n";
import { AUTHOR, REPO_URL } from "../lib/site";

export const CODE_SIGNING_COPY = {
  en: {
    title: "Code signing policy",
    description:
      "How Komorebi's Windows releases are signed, who approves each signing, where signed builds come from and what the signed program does with your data.",
  },
  pt: {
    title: "Política de assinatura de código",
    description:
      "Como as versões do Komorebi para Windows são assinadas, quem aprova cada assinatura, de onde vêm as compilações assinadas e o que o programa assinado faz com os seus dados.",
  },
};

const SIGNPATH_SENTENCE = (
  <>
    Free code signing provided by <a href="https://signpath.io" rel="noopener">SignPath.io</a>, certificate by{" "}
    <a href="https://signpath.org" rel="noopener">SignPath Foundation</a>
  </>
);

export function CodeSigningPage({ locale }: { locale: Locale }) {
  const pt = locale === "pt";
  const privacy = localePath(locale, "/privacy");

  return (
    <div className="container page-shell narrow">
      <main id="main" className="page-main">
        <article className="prose">
          <header className="docs-header">
            <h1>{CODE_SIGNING_COPY[locale].title}</h1>
            <p className="lead">{CODE_SIGNING_COPY[locale].description}</p>
          </header>

          {pt ? (
            <>
              <p className="signpath" lang="en">
                {SIGNPATH_SENTENCE}
              </p>
              <p>Em português: assinatura de código gratuita fornecida pela SignPath.io, certificado da SignPath Foundation.</p>
            </>
          ) : (
            <p className="signpath">{SIGNPATH_SENTENCE}</p>
          )}

          <h2 id="status">{pt ? "Estado" : "Status"}</h2>
          {pt ? (
            <p>
              O Komorebi está a candidatar-se à SignPath Foundation para assinatura de código gratuita. Até haver um certificado, as versões não têm assinatura Authenticode e o Windows SmartScreen pode mostrar um aviso quando executa o instalador. Cada versão no GitHub inclui o SHA-256 do instalador (<code>.sha256</code>) e uma assinatura Ed25519 (<code>.sig</code>) que a atualização na aplicação verifica.{" "}
              <Link href={localePath(locale, "/docs/updates")}>Como as atualizações são verificadas</Link>.
            </p>
          ) : (
            <p>
              Komorebi is applying to SignPath Foundation for free code signing. Until a certificate is issued, releases are not Authenticode-signed, and Windows SmartScreen may warn when you run the installer. Every release on GitHub carries the installer&apos;s SHA-256 (<code>.sha256</code>) and an Ed25519 signature (<code>.sig</code>) that the in-app update verifies.{" "}
              <Link href={localePath(locale, "/docs/updates")}>How updates are verified</Link>.
            </p>
          )}

          <h2 id="what-is-signed">{pt ? "O que é assinado" : "What is signed"}</h2>
          {pt ? (
            <p>
              Só os ficheiros feitos a partir do repositório do Komorebi: o programa <code>komorebi.exe</code> e o instalador <code>komorebi-&lt;versão&gt;-setup.exe</code>. Programas de outros projetos não são assinados com este certificado.
            </p>
          ) : (
            <p>
              Only files built from the Komorebi repository: the program <code>komorebi.exe</code> and the installer <code>komorebi-&lt;version&gt;-setup.exe</code>. Programs from other projects are not signed with this certificate.
            </p>
          )}

          <h2 id="roles">{pt ? "Funções" : "Roles"}</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">{pt ? "Função" : "Role"}</th>
                  <th scope="col">{pt ? "Pessoa" : "Person"}</th>
                  <th scope="col">{pt ? "O que faz" : "What it means"}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{pt ? "Autor" : "Author"}</td>
                  <td>{AUTHOR}</td>
                  <td>{pt ? "Escreve e revê as alterações ao código e faz o commit no repositório público." : "Writes and reviews changes to the code and commits them to the public repository."}</td>
                </tr>
                <tr>
                  <td>{pt ? "Aprovador" : "Approver"}</td>
                  <td>{AUTHOR}</td>
                  <td>{pt ? "Aprova à mão cada pedido de assinatura de uma versão." : "Approves each release's signing request by hand."}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 id="builds">{pt ? "Compilações" : "Builds"}</h2>
          {pt ? (
            <p>
              As compilações assinadas vêm do repositório público no GitHub, <a href={REPO_URL} rel="noopener">github.com/RusticStack/komorebi</a>, compiladas pelo GitHub Actions a partir de um commit desse repositório. Nada compilado num computador pessoal é assinado com este certificado. Até à versão 0.7.0, inclusive, as versões foram compiladas e publicadas à mão e não têm assinatura Authenticode.
            </p>
          ) : (
            <p>
              Signed builds come from the public repository on GitHub, <a href={REPO_URL} rel="noopener">github.com/RusticStack/komorebi</a>, built by GitHub Actions from a commit in that repository. Nothing built on a personal computer is signed with this certificate. Releases up to and including 0.7.0 were built and published by hand and are not Authenticode-signed.
            </p>
          )}

          <h2 id="privacy">{pt ? "Privacidade" : "Privacy"}</h2>
          {pt ? (
            <>
              <p>
                O Komorebi não recolhe dados. Não envia nada ao projeto nem a terceiros: sem telemetria, estatísticas ou relatórios de falhas. As verificações de atualizações só contactam o GitHub: um pedido HTTPS a <code>api.github.com</code> pela versão mais recente, quando prime Procurar atualizações ou no máximo uma vez por dia com a verificação automática ativa, e uma transferência de <code>github.com</code> só quando prime Transferir e instalar.
              </p>
              <p>
                Este programa não transfere nenhuma informação para outros sistemas em rede, a menos que isso seja pedido expressamente pelo utilizador ou pela pessoa que o instala ou utiliza. <Link href={privacy}>Declaração de privacidade</Link>.
              </p>
            </>
          ) : (
            <>
              <p>
                Komorebi collects no data. It sends nothing to the project or to any third party: no telemetry, analytics or crash reports. Update checks contact GitHub only: one HTTPS request to <code>api.github.com</code> for the latest release, when you press Check for updates or at most once a day with automatic checks on, and a download from <code>github.com</code> only when you press Download and install.
              </p>
              <p>
                This program will not transfer any information to other networked systems unless specifically requested by the user or the person installing or operating it. <Link href={privacy}>Privacy statement</Link>.
              </p>
            </>
          )}
        </article>
      </main>
    </div>
  );
}
