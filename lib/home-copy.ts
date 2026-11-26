import type { FeatureIcon } from "../components/icons";
import type { Locale } from "./i18n";

type Feature = { icon: FeatureIcon; title: string; text: string; href: string; link: string };
type Showcase = { shot: string; title: string; text: string; alt: string; href: string; link: string };
type Row = { label: string; value: string };

export type HomeCopy = {
  badge: string;
  title: string;
  lead: string;
  secondary: string;
  facts: string[];
  smartscreen: string;
  smartscreenLink: string;
  heroAlt: string;
  videoTitle: string;
  videoLead: string;
  videoLabel: string;
  transcriptTitle: string;
  transcript: string[];
  featuresTitle: string;
  featuresLead: string;
  features: Feature[];
  showcaseTitle: string;
  showcase: Showcase[];
  whyTitle: string;
  whyLead: string;
  whyHas: string;
  whyHasRows: Row[];
  whyNot: string;
  whyNotRows: Row[];
  whyNote: string;
  compareLinks: { href: string; label: string }[];
  installTitle: string;
  installSteps: { title: string; text: string }[];
  installLink: string;
  faqTitle: string;
  faq: { q: string; a: string }[];
  faqLink: string;
  ctaTitle: string;
  ctaText: string;
};

/** {size} is the installer's size, filled in at build time from the latest release. */
const EN: HomeCopy = {
  badge: "Free and open source",
  title: "A small, fast email client for Windows.",
  lead: "Read and write IMAP mail in a native app that looks like Windows 11. No AI, no telemetry, no web engine.",
  secondary: "Read the docs",
  facts: ["No administrator rights", "No account to create", "English and Português"],
  smartscreen: "The installer is not code-signed yet, so Windows SmartScreen may warn once.",
  smartscreenLink: "How to check the download",
  heroAlt: "Komorebi in the light theme: the folder pane, the inbox and a newsletter in the reading pane, with its remote images blocked",
  videoTitle: "Komorebi in 36 seconds",
  videoLead: "A silent tour with captions: reading, writing, rules, contacts, the calendar and privacy.",
  videoLabel: "Play the Komorebi tour video",
  transcriptTitle: "Read the transcript",
  transcript: [],
  featuresTitle: "Everything mail needs",
  featuresLead: "One native program for Windows 10 and 11.",
  features: [
    { icon: "reader", title: "Reads mail, not trackers", text: "Its own HTML engine, no scripts. Remote images wait for you.", href: "/docs/remote-content", link: "How remote content is handled" },
    { icon: "composer", title: "Rich-text composer", text: "Fonts, colours, lists, quotes, links and tables.", href: "/docs/composer", link: "Writing and formatting mail" },
    { icon: "recipients", title: "Recipients as chips", text: "A wrong address is flagged before you send.", href: "/docs/recipients-and-attachments", link: "Recipients and attachments" },
    { icon: "contacts", title: "Contacts with CardDAV", text: "A local address book, synced if you want.", href: "/docs/contacts", link: "Contacts and CardDAV" },
    { icon: "calendar", title: "Calendar with CalDAV", text: "Month, week, day and agenda views. Answer invitations.", href: "/docs/calendar", link: "The calendar" },
    { icon: "rules", title: "Rules and Sieve", text: "Move, delete or mark new mail. Copy rules as Sieve.", href: "/docs/rules", link: "Rules" },
    { icon: "tabs", title: "Tabs and windows", text: "Read messages side by side. Tabs come back next time.", href: "/docs/keyboard-shortcuts", link: "Keyboard shortcuts" },
    { icon: "server", title: "Any IMAP server", text: "Presets for Purelymail and Postale.io, or your own server.", href: "/docs/adding-an-account", link: "Adding an account" },
    { icon: "bell", title: "Notifications, opt-in", text: "New mail, reminders and a tray icon. All off by default.", href: "/docs/notifications-and-tray", link: "Notifications and tray" },
  ],
  showcaseTitle: "A closer look",
  showcase: [
    {
      shot: "compose-table",
      title: "Write formatted mail",
      text: "Formatted mail always goes out with a plain-text part, so every recipient can read it.",
      alt: "The composer with bold, italic, a colour, a link, a bulleted and a numbered list, a quote and a 3 by 3 table",
      href: "/docs/composer",
      link: "More about the composer",
    },
    {
      shot: "calendar-month",
      title: "Your calendar beside your mail",
      text: "A local calendar and your CalDAV calendars, in month, week, day and agenda views.",
      alt: "The calendar month view with sample events and the selected day's agenda beside it",
      href: "/docs/calendar",
      link: "More about the calendar",
    },
    {
      shot: "rules",
      title: "Rules that stay on your PC",
      text: "Ordered rules for new Inbox mail, with an activity list. No rule ever sends mail.",
      alt: "Settings, Rules: four mail rules for the account, one paused, with recent activity",
      href: "/docs/rules",
      link: "More about rules",
    },
  ],
  whyTitle: "Why Komorebi",
  whyLead: "Facts you can check, and what Komorebi does not do.",
  whyHas: "What you get",
  whyHasRows: [
    { label: "Telemetry", value: "None. No analytics, no crash upload, no Komorebi server." },
    { label: "Size", value: "A {size} installer. The program is one file under 20 MB." },
    { label: "Start-up", value: "Budget: first window in under 200 ms. About 40 to 60 ms measured on a quiet PC." },
    { label: "HTML mail", value: "Drawn by its own layout engine. No scripts, no web engine." },
    { label: "Price", value: "Free. GPL-3.0-or-later. No account to create." },
  ],
  whyNot: "What it does not do",
  whyNotRows: [
    { label: "OAuth sign-in", value: "Not supported, so Gmail and Microsoft 365 accounts that require it do not work." },
    { label: "Exchange", value: "Not supported. Komorebi speaks IMAP and SMTP." },
    { label: "PGP and S/MIME", value: "Encrypted mail is shown as encrypted, not decrypted." },
    { label: "Other systems", value: "Windows 10 and 11 on x64 only." },
  ],
  whyNote: "Timings depend on your computer and disk. The first start after installing can be slower.",
  compareLinks: [
    { href: "/outlook-alternative", label: "Compared with Outlook" },
    { href: "/thunderbird-alternative", label: "Compared with Thunderbird" },
    { href: "/em-client-alternative", label: "Compared with eM Client" },
  ],
  installTitle: "Install in three steps",
  installSteps: [
    { title: "Download", text: "Get the installer for Windows 10 or 11." },
    { title: "Run it", text: "It installs for your user. No admin rights needed." },
    { title: "Add your account", text: "Type your address and password. Done." },
  ],
  installLink: "Full install guide",
  faqTitle: "Questions",
  faq: [
    { q: "Is Komorebi free?", a: "Yes. It is free and open source under GPL-3.0-or-later, with no ads and no paid tier." },
    { q: "Does it work with Gmail or Outlook.com?", a: "Komorebi has no OAuth sign-in. Gmail can work with an app password, if your Google account offers one. Accounts that require OAuth, such as Outlook.com and Microsoft 365, do not work." },
    { q: "Does Komorebi send anything to its developers?", a: "No. There is no telemetry and no Komorebi server. The only other request is the update check to GitHub." },
    { q: "Why does SmartScreen warn about the installer?", a: "It is not Authenticode-signed yet. Check the SHA-256 from the release, then choose More info and Run anyway." },
    { q: "Where are my passwords?", a: "In Windows Credential Manager, never in Komorebi's files." },
  ],
  faqLink: "All questions",
  ctaTitle: "Try Komorebi",
  ctaText: "Installs for your Windows user and uninstalls from Settings > Apps.",
};

const PT: HomeCopy = {
  badge: "Livre e de código aberto",
  title: "Um cliente de e-mail pequeno e rápido para Windows.",
  lead: "Leia e escreva correio IMAP numa aplicação nativa com o aspeto do Windows 11. Sem IA, sem telemetria, sem motor web.",
  secondary: "Ler a documentação",
  facts: ["Sem direitos de administrador", "Sem conta para criar", "Inglês e português"],
  smartscreen: "O instalador ainda não tem assinatura de código, por isso o Windows SmartScreen pode avisar uma vez.",
  smartscreenLink: "Como confirmar a transferência",
  heroAlt: "O Komorebi no tema claro: o painel de pastas, a caixa de entrada e uma newsletter no painel de leitura, com as imagens remotas bloqueadas",
  videoTitle: "O Komorebi em 36 segundos",
  videoLead: "Uma visita sem som, com legendas: leitura, escrita, regras, contactos, calendário e privacidade.",
  videoLabel: "Reproduzir o vídeo de apresentação do Komorebi",
  transcriptTitle: "Ler a transcrição",
  transcript: [],
  featuresTitle: "Tudo o que o e-mail precisa",
  featuresLead: "Um único programa nativo para Windows 10 e 11.",
  features: [
    { icon: "reader", title: "Lê o correio, não os rastreadores", text: "Motor HTML próprio, sem scripts. As imagens remotas esperam por si.", href: "/docs/remote-content", link: "Como o conteúdo remoto é tratado" },
    { icon: "composer", title: "Editor de texto formatado", text: "Tipos de letra, cores, listas, citações, hiperligações e tabelas.", href: "/docs/composer", link: "Escrever e formatar correio" },
    { icon: "recipients", title: "Destinatários em etiquetas", text: "Um endereço errado é assinalado antes de enviar.", href: "/docs/recipients-and-attachments", link: "Destinatários e anexos" },
    { icon: "contacts", title: "Contactos com CardDAV", text: "Um livro de endereços local, sincronizado se quiser.", href: "/docs/contacts", link: "Contactos e CardDAV" },
    { icon: "calendar", title: "Calendário com CalDAV", text: "Vistas de mês, semana, dia e agenda. Responda a convites.", href: "/docs/calendar", link: "O calendário" },
    { icon: "rules", title: "Regras e Sieve", text: "Mova, elimine ou marque o correio novo. Copie as regras como Sieve.", href: "/docs/rules", link: "Regras" },
    { icon: "tabs", title: "Separadores e janelas", text: "Leia mensagens lado a lado. Os separadores voltam na vez seguinte.", href: "/docs/keyboard-shortcuts", link: "Atalhos de teclado" },
    { icon: "server", title: "Qualquer servidor IMAP", text: "Predefinições para Purelymail e Postale.io, ou o seu servidor.", href: "/docs/adding-an-account", link: "Adicionar uma conta" },
    { icon: "bell", title: "Notificações, se quiser", text: "Correio novo, lembretes e um ícone na área de notificação. Tudo desligado de início.", href: "/docs/notifications-and-tray", link: "Notificações e área de notificação" },
  ],
  showcaseTitle: "Mais de perto",
  showcase: [
    {
      shot: "compose-table",
      title: "Escreva e-mail formatado",
      text: "O correio formatado segue sempre com uma parte em texto simples, para todos o poderem ler.",
      alt: "O editor de mensagens com negrito, itálico, uma cor, uma hiperligação, uma lista com marcas e uma numerada, uma citação e uma tabela de 3 por 3",
      href: "/docs/composer",
      link: "Mais sobre o editor",
    },
    {
      shot: "calendar-month",
      title: "O calendário ao lado do correio",
      text: "Um calendário local e os seus calendários CalDAV, em vistas de mês, semana, dia e agenda.",
      alt: "A vista de mês do calendário com eventos de exemplo e a agenda do dia selecionado ao lado",
      href: "/docs/calendar",
      link: "Mais sobre o calendário",
    },
    {
      shot: "rules",
      title: "Regras que ficam no seu PC",
      text: "Regras ordenadas para o correio novo da Caixa de entrada, com uma lista de atividade. Nenhuma regra envia correio.",
      alt: "Definições, Regras: quatro regras de correio da conta, uma em pausa, com a atividade recente",
      href: "/docs/rules",
      link: "Mais sobre as regras",
    },
  ],
  whyTitle: "Porquê o Komorebi",
  whyLead: "Factos que pode confirmar, e o que o Komorebi não faz.",
  whyHas: "O que tem",
  whyHasRows: [
    { label: "Telemetria", value: "Nenhuma. Sem estatísticas, sem envio de falhas, sem servidor do Komorebi." },
    { label: "Tamanho", value: "Um instalador de {size}. O programa é um único ficheiro com menos de 20 MB." },
    { label: "Arranque", value: "Meta: primeira janela em menos de 200 ms. Cerca de 40 a 60 ms medidos num PC sem carga." },
    { label: "E-mail HTML", value: "Desenhado por um motor próprio. Sem scripts, sem motor web." },
    { label: "Preço", value: "Gratuito. GPL-3.0-or-later. Sem conta para criar." },
  ],
  whyNot: "O que não faz",
  whyNotRows: [
    { label: "Início de sessão OAuth", value: "Não suportado, por isso as contas Gmail e Microsoft 365 que o exigem não funcionam." },
    { label: "Exchange", value: "Não suportado. O Komorebi usa IMAP e SMTP." },
    { label: "PGP e S/MIME", value: "O correio cifrado é mostrado como cifrado, não é decifrado." },
    { label: "Outros sistemas", value: "Só Windows 10 e 11 em x64." },
  ],
  whyNote: "Os tempos dependem do computador e do disco. O primeiro arranque depois de instalar pode ser mais lento.",
  compareLinks: [
    { href: "/outlook-alternative", label: "Comparado com o Outlook" },
    { href: "/thunderbird-alternative", label: "Comparado com o Thunderbird" },
    { href: "/em-client-alternative", label: "Comparado com o eM Client" },
  ],
  installTitle: "Instale em três passos",
  installSteps: [
    { title: "Transfira", text: "Obtenha o instalador para Windows 10 ou 11." },
    { title: "Execute-o", text: "Instala-se para o seu utilizador. Sem direitos de administrador." },
    { title: "Adicione a sua conta", text: "Escreva o endereço e a palavra-passe. Pronto." },
  ],
  installLink: "Guia de instalação completo",
  faqTitle: "Perguntas",
  faq: [
    { q: "O Komorebi é gratuito?", a: "Sim. É livre e de código aberto, com a licença GPL-3.0-or-later, sem publicidade e sem versão paga." },
    { q: "Funciona com Gmail ou Outlook.com?", a: "O Komorebi não tem início de sessão OAuth. O Gmail pode funcionar com uma palavra-passe de aplicação, se a sua conta Google a oferecer. As contas que exigem OAuth, como Outlook.com e Microsoft 365, não funcionam." },
    { q: "O Komorebi envia alguma coisa aos programadores?", a: "Não. Não há telemetria nem servidor do Komorebi. O único outro pedido é a procura de atualizações no GitHub." },
    { q: "Porque é que o SmartScreen avisa sobre o instalador?", a: "Ainda não tem assinatura Authenticode. Confirme o SHA-256 da versão e escolha Mais informações e Executar mesmo assim." },
    { q: "Onde ficam as palavras-passe?", a: "No Gestor de Credenciais do Windows, nunca nos ficheiros do Komorebi." },
  ],
  faqLink: "Todas as perguntas",
  ctaTitle: "Experimente o Komorebi",
  ctaText: "Instala-se para o seu utilizador do Windows e desinstala-se em Definições > Aplicações.",
};

export function homeCopy(locale: Locale): HomeCopy {
  return locale === "pt" ? PT : EN;
}
