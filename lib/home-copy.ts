import type { FeatureIcon } from "../components/icons";
import type { Locale } from "./i18n";

type Feature = { icon: FeatureIcon; title: string; text: string; href: string };
type Stat = { value: string; label: string };
type Showcase = { shot: string; title: string; text: string; alt: string; href: string };

export type HomeCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  lead: string;
  secondary: string;
  smartscreenTitle: string;
  smartscreen: string;
  smartscreenLink: string;
  heroAlt: string;
  featuresTitle: string;
  featuresLead: string;
  features: Feature[];
  showcaseTitle: string;
  showcase: Showcase[];
  numbersTitle: string;
  numbersLead: string;
  numbers: Stat[];
  numbersNote: string;
  privacyTitle: string;
  privacyLead: string;
  privacyItems: string[];
  privacyLink: string;
  trustTitle: string;
  trust: { title: string; text: string; href: string; link: string }[];
  ctaTitle: string;
  ctaText: string;
};

/** {size} is the installer's size, filled in at build time from the latest release. */
const EN: HomeCopy = {
  metaTitle: "Komorebi: a small, fast email client for Windows",
  metaDescription:
    "Komorebi is a free and open-source email client for Windows 10 and 11: IMAP and SMTP with a local cache, a rich-text composer, contacts, calendar and rules. No AI, no telemetry, no web engine.",
  eyebrow: "Free and open source · GPL-3.0-or-later",
  title: "A small, fast email client for Windows.",
  lead: "Komorebi reads and writes mail without getting in the way. It keeps a local SQLite cache of your IMAP mail, draws HTML mail with its own layout engine and looks like the rest of Windows 11. No AI, no telemetry, no web engine.",
  secondary: "Source on GitHub",
  smartscreenTitle: "Not Authenticode-signed yet",
  smartscreen:
    "The installer is not code-signed yet, so Windows SmartScreen may warn the first time you run it. Check the SHA-256 published with the release, then choose More info and Run anyway.",
  smartscreenLink: "How to check the download",
  heroAlt: "Komorebi in the light theme: the folder pane, the inbox and a newsletter open in the reading pane, with its remote images blocked",
  featuresTitle: "Everything mail needs, nothing it does not",
  featuresLead: "One native program for Windows 10 and 11, in English and European Portuguese.",
  features: [
    {
      icon: "reader",
      title: "Reads mail, not trackers",
      text: "HTML mail is drawn by Komorebi's own layout engine, with no scripts and no web engine. Remote images wait until you choose to load them, and tracking pixels never load.",
      href: "/docs/privacy-and-network",
    },
    {
      icon: "composer",
      title: "A rich-text composer",
      text: "Email-safe fonts and sizes, ten named colours, lists, quotes, links and simple tables, with named signatures. Mail with no formatting goes out as plain text.",
      href: "/docs/composer",
    },
    {
      icon: "recipients",
      title: "Recipients as chips",
      text: "Addresses turn into chips as you type, a wrong one is flagged before you send, and suggestions come from your contacts first.",
      href: "/docs/composer#recipients",
    },
    {
      icon: "contacts",
      title: "Contacts with CardDAV",
      text: "A local address book with groups, synced per account over CardDAV if you want it, read only or read and write.",
      href: "/docs/contacts-and-calendar",
    },
    {
      icon: "calendar",
      title: "Calendar with CalDAV",
      text: "Month, week, day and agenda views, an event editor, invitations you can answer and your accounts' CalDAV calendars. Reminders are opt-in.",
      href: "/docs/contacts-and-calendar#calendar",
    },
    {
      icon: "rules",
      title: "Rules, and Copy as Sieve",
      text: "Simple local rules for new Inbox mail: move, delete, mark read or important. Copy them as a Sieve script for your provider's filters.",
      href: "/docs/rules",
    },
    {
      icon: "tabs",
      title: "Tabs and windows",
      text: "Open messages in tabs or in windows of their own to read side by side. Open tabs come back at the next start.",
      href: "/docs/keyboard-shortcuts",
    },
    {
      icon: "server",
      title: "Your provider or your own server",
      text: "Presets for Purelymail and Postale.io, any IMAP and SMTP server by hand, certificate pinning for self-signed servers and SMTP without sign-in for a local relay.",
      href: "/docs/adding-an-account",
    },
    {
      icon: "bell",
      title: "Notifications and tray",
      text: "Windows notifications for new mail and event reminders, a notification-area icon and start with Windows. All off until you turn them on.",
      href: "/docs/notifications-and-tray",
    },
  ],
  showcaseTitle: "A closer look",
  showcase: [
    {
      shot: "compose-table",
      title: "Write formatted mail",
      text: "Bold, italic, colours, both kinds of lists, quotes, links and a table, in a composer that sends a plain-text part with every formatted message.",
      alt: "The composer with bold, italic, a colour, a link, a bulleted and a numbered list, a quote and a 3 by 3 table",
      href: "/docs/composer",
    },
    {
      shot: "calendar-month",
      title: "Your calendar beside your mail",
      text: "A local calendar on this PC and your CalDAV calendars, in month, week, day and agenda views. Changes go to the server only over the version you edited.",
      alt: "The calendar month view with sample events and the selected day's agenda beside it",
      href: "/docs/contacts-and-calendar#calendar",
    },
    {
      shot: "rules",
      title: "Rules that stay on your computer",
      text: "Each account has an ordered list of rules for new Inbox mail. An activity list shows what they did, and no rule ever sends mail.",
      alt: "Settings, Rules: four mail rules for the account, one paused, with recent activity",
      href: "/docs/rules",
    },
    {
      shot: "cert-prompt",
      title: "Pin your own server's certificate",
      text: "For a self-signed or private-CA server, review the SHA-256 fingerprint and trust that certificate, its key or its issuing CA. A changed certificate is refused before any password is sent.",
      alt: "The Trust this certificate? prompt with the SHA-256 fingerprint and certificate details of a made-up server",
      href: "/docs/certificates-and-encrypted-cache",
    },
  ],
  numbersTitle: "Small and quick, by design",
  numbersLead: "The project holds itself to written budgets, checked with the app's own timing switch on a seeded cache.",
  numbers: [
    { value: "< 200 ms", label: "budget from start to the first window; about 40 to 60 ms measured on a quiet machine" },
    { value: "< 600 ms", label: "budget to list a cached folder" },
    { value: "{size}", label: "installer of the latest release" },
    { value: "0", label: "telemetry, analytics or crash reports sent anywhere" },
  ],
  numbersNote: "Timings depend on your computer and disk; a first start after installing can be slower.",
  privacyTitle: "What leaves your computer",
  privacyLead: "There is no Komorebi server. The app connects only to:",
  privacyItems: [
    "your mail servers (IMAP and SMTP, always over TLS or STARTTLS), and the CardDAV and CalDAV servers you set up;",
    "your mail domain's DNS and autoconfig page, only when you press Continue or Find settings for a domain without built-in settings;",
    "the image hosts of a message, only after you choose to load its images;",
    "api.github.com and github.com, only when you check for updates or download one.",
  ],
  privacyLink: "Read the privacy statement",
  trustTitle: "Open about how it is built",
  trust: [
    {
      title: "Verified updates",
      text: "The in-app update installs a new version only if its SHA-256 matches and its Ed25519 signature verifies against a key built into Komorebi.",
      href: "/docs/updates",
      link: "How updates are verified",
    },
    {
      title: "Code signing",
      text: "Releases are not Authenticode-signed yet. An application to SignPath Foundation for free code signing is in progress.",
      href: "/code-signing",
      link: "Code signing policy",
    },
    {
      title: "Source you can build",
      text: "Rust and Slint, GPL-3.0-or-later. Clone the repository and build the same single komorebi.exe with Cargo.",
      href: "/docs/building-from-source",
      link: "Build from source",
    },
  ],
  ctaTitle: "Try Komorebi",
  ctaText: "Installs for your Windows user, with no administrator rights, and uninstalls from Settings > Apps.",
};

const PT: HomeCopy = {
  metaTitle: "Komorebi: um cliente de e-mail pequeno e rápido para Windows",
  metaDescription:
    "O Komorebi é um cliente de e-mail livre e de código aberto para Windows 10 e 11: IMAP e SMTP com cache local, editor de texto formatado, contactos, calendário e regras. Sem IA, sem telemetria, sem motor web.",
  eyebrow: "Livre e de código aberto · GPL-3.0-or-later",
  title: "Um cliente de e-mail pequeno e rápido para Windows.",
  lead: "O Komorebi lê e escreve e-mail sem se meter no caminho. Guarda uma cache SQLite local do seu correio IMAP, desenha o e-mail HTML com um motor de renderização próprio e tem o aspeto do resto do Windows 11. Sem IA, sem telemetria, sem motor web.",
  secondary: "Código no GitHub",
  smartscreenTitle: "Ainda sem assinatura Authenticode",
  smartscreen:
    "O instalador ainda não tem assinatura de código, por isso o Windows SmartScreen pode mostrar um aviso na primeira execução. Confirme o SHA-256 publicado com a versão e escolha Mais informações e Executar mesmo assim.",
  smartscreenLink: "Como confirmar a transferência",
  heroAlt: "O Komorebi no tema claro: o painel de pastas, a caixa de entrada e uma newsletter aberta no painel de leitura, com as imagens remotas bloqueadas",
  featuresTitle: "Tudo o que o e-mail precisa, nada do que não precisa",
  featuresLead: "Um único programa nativo para Windows 10 e 11, em inglês e português europeu.",
  features: [
    {
      icon: "reader",
      title: "Lê o correio, não os rastreadores",
      text: "O e-mail HTML é desenhado pelo motor de renderização do próprio Komorebi, sem scripts e sem motor web. As imagens remotas esperam até decidir transferi-las, e os píxeis de rastreio nunca são transferidos.",
      href: "/docs/privacy-and-network",
    },
    {
      icon: "composer",
      title: "Editor de texto formatado",
      text: "Tipos de letra e tamanhos seguros para e-mail, dez cores com nome, listas, citações, hiperligações e tabelas simples, com assinaturas com nome. Uma mensagem sem formatação segue como texto simples.",
      href: "/docs/composer",
    },
    {
      icon: "recipients",
      title: "Destinatários em etiquetas",
      text: "Os endereços passam a etiquetas enquanto escreve, um endereço errado é assinalado antes de enviar e as sugestões vêm primeiro dos seus contactos.",
      href: "/docs/composer#destinatários",
    },
    {
      icon: "contacts",
      title: "Contactos com CardDAV",
      text: "Um livro de endereços local com grupos, sincronizado por conta através de CardDAV se quiser, só de leitura ou de leitura e escrita.",
      href: "/docs/contacts-and-calendar",
    },
    {
      icon: "calendar",
      title: "Calendário com CalDAV",
      text: "Vistas de mês, semana, dia e agenda, um editor de eventos, convites a que pode responder e os calendários CalDAV das suas contas. Os lembretes são opcionais.",
      href: "/docs/contacts-and-calendar#calendário",
    },
    {
      icon: "rules",
      title: "Regras e Copiar como Sieve",
      text: "Regras locais simples para o correio novo da Caixa de entrada: mover, eliminar, marcar como lida ou importante. Copie-as como script Sieve para os filtros do seu fornecedor.",
      href: "/docs/rules",
    },
    {
      icon: "tabs",
      title: "Separadores e janelas",
      text: "Abra mensagens em separadores ou em janelas próprias para as ler lado a lado. Os separadores abertos voltam no arranque seguinte.",
      href: "/docs/keyboard-shortcuts",
    },
    {
      icon: "server",
      title: "O seu fornecedor ou o seu servidor",
      text: "Predefinições para Purelymail e Postale.io, qualquer servidor IMAP e SMTP configurado à mão, fixação de certificados para servidores autoassinados e SMTP sem início de sessão para um relay local.",
      href: "/docs/adding-an-account",
    },
    {
      icon: "bell",
      title: "Notificações e área de notificação",
      text: "Notificações do Windows para correio novo e lembretes de eventos, um ícone na área de notificação e início com o Windows. Tudo desligado até o ativar.",
      href: "/docs/notifications-and-tray",
    },
  ],
  showcaseTitle: "Mais de perto",
  showcase: [
    {
      shot: "compose-table",
      title: "Escreva e-mail formatado",
      text: "Negrito, itálico, cores, os dois tipos de lista, citações, hiperligações e uma tabela, num editor que envia uma parte em texto simples com cada mensagem formatada.",
      alt: "O editor de mensagens com negrito, itálico, uma cor, uma hiperligação, uma lista com marcas e uma numerada, uma citação e uma tabela de 3 por 3",
      href: "/docs/composer",
    },
    {
      shot: "calendar-month",
      title: "O calendário ao lado do correio",
      text: "Um calendário local neste PC e os seus calendários CalDAV, em vistas de mês, semana, dia e agenda. As alterações só seguem para o servidor sobre a versão que editou.",
      alt: "A vista de mês do calendário com eventos de exemplo e a agenda do dia selecionado ao lado",
      href: "/docs/contacts-and-calendar#calendário",
    },
    {
      shot: "rules",
      title: "Regras que ficam no seu computador",
      text: "Cada conta tem uma lista ordenada de regras para o correio novo da Caixa de entrada. Uma lista de atividade mostra o que fizeram, e nenhuma regra envia correio.",
      alt: "Definições, Regras: quatro regras de correio da conta, uma em pausa, com a atividade recente",
      href: "/docs/rules",
    },
    {
      shot: "cert-prompt",
      title: "Fixe o certificado do seu servidor",
      text: "Para um servidor autoassinado ou com AC privada, reveja a impressão digital SHA-256 e confie nesse certificado, na sua chave ou na AC emissora. Um certificado alterado é recusado antes de qualquer palavra-passe ser enviada.",
      alt: "A pergunta Confiar neste certificado? com a impressão digital SHA-256 e os detalhes do certificado de um servidor fictício",
      href: "/docs/certificates-and-encrypted-cache",
    },
  ],
  numbersTitle: "Pequeno e rápido, por princípio",
  numbersLead: "O projeto segue metas escritas, verificadas com a opção de medição de tempos da própria aplicação numa cache de teste.",
  numbers: [
    { value: "< 200 ms", label: "meta do arranque até à primeira janela; cerca de 40 a 60 ms medidos num computador sem carga" },
    { value: "< 600 ms", label: "meta para listar uma pasta em cache" },
    { value: "{size}", label: "instalador da versão mais recente" },
    { value: "0", label: "envios de telemetria, estatísticas ou relatórios de falhas" },
  ],
  numbersNote: "Os tempos dependem do computador e do disco; o primeiro arranque depois de instalar pode ser mais lento.",
  privacyTitle: "O que sai do seu computador",
  privacyLead: "Não existe nenhum servidor do Komorebi. A aplicação só liga a:",
  privacyItems: [
    "os seus servidores de correio (IMAP e SMTP, sempre com TLS ou STARTTLS) e os servidores CardDAV e CalDAV que configurar;",
    "o DNS e a página de autoconfiguração do domínio do seu e-mail, só quando prime Continuar ou Procurar definições para um domínio sem definições incluídas;",
    "os servidores de imagens de uma mensagem, só depois de decidir transferir as imagens;",
    "api.github.com e github.com, só quando procura atualizações ou transfere uma.",
  ],
  privacyLink: "Ler a declaração de privacidade",
  trustTitle: "Transparente sobre a forma como é feito",
  trust: [
    {
      title: "Atualizações verificadas",
      text: "A atualização na aplicação só instala uma nova versão se o SHA-256 coincidir e a assinatura Ed25519 for válida para uma chave incluída no Komorebi.",
      href: "/docs/updates",
      link: "Como as atualizações são verificadas",
    },
    {
      title: "Assinatura de código",
      text: "As versões ainda não têm assinatura Authenticode. Está em curso uma candidatura à SignPath Foundation para assinatura de código gratuita.",
      href: "/code-signing",
      link: "Política de assinatura de código",
    },
    {
      title: "Código que pode compilar",
      text: "Rust e Slint, GPL-3.0-or-later. Clone o repositório e compile o mesmo komorebi.exe com o Cargo.",
      href: "/docs/building-from-source",
      link: "Compilar a partir do código",
    },
  ],
  ctaTitle: "Experimente o Komorebi",
  ctaText: "Instala-se para o seu utilizador do Windows, sem direitos de administrador, e desinstala-se em Definições > Aplicações.",
};

export function homeCopy(locale: Locale): HomeCopy {
  return locale === "pt" ? PT : EN;
}
