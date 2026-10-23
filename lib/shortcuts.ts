import { readUpstream } from "./upstream";
import type { Locale } from "./i18n";

// The keyboard table is generated from the "## Keyboard" section of Komorebi's README.md at the
// release the site was built from. English is the README's own text. Portuguese translates each
// row by its English text; a row this file does not know yet stays in English (the build prints
// a warning), so a README change never drops a shortcut from the page.

export type Shortcut = { keys: string; action: string };
export type ShortcutTable = { rows: Shortcut[]; notes: string[]; missing: number };

const PT_ACTIONS: Record<string, string> = {
  "New mail": "Novo correio",
  "Keyboard shortcuts: every key on this list, by group (also in Settings › About)":
    "Atalhos de teclado: todas as teclas desta lista, por grupo (também em Definições › Acerca de)",
  "Settings, and back to the mail (as the gear and Settings' back arrow do; Esc closes them too; from the account form, Esc goes back to the list first)":
    "Definições, e voltar ao correio (como a roda dentada e a seta para trás das Definições; Esc também as fecha; no formulário da conta, Esc volta primeiro à lista)",
  "Send (in the composer)": "Enviar (no editor de mensagens)",
  "Show Cc and Bcc, and go to Cc / Bcc (in the composer)": "Mostrar Cc e Bcc, e ir para Cc / Bcc (no editor de mensagens)",
  "Attach files (in the composer)": "Anexar ficheiros (no editor de mensagens)",
  "Attach the files copied in Explorer (in the composer; text pastes as usual)":
    "Anexar os ficheiros copiados no Explorador (no editor de mensagens; o texto cola-se como habitualmente)",
  "Pick, take or close the recipient suggestions (while they show under an address field; a group adds each of its members)":
    "Escolher, aceitar ou fechar as sugestões de destinatários (enquanto aparecem por baixo de um campo de endereço; um grupo adiciona cada um dos seus membros)",
  "Save the contact": "Guardar o contacto",
  "Bold / italic / underline (in a formatted message's body, where Ctrl+U does not mark as unread)":
    "Negrito / itálico / sublinhado (no corpo de uma mensagem formatada, onde Ctrl+U não marca como não lida)",
  "Strikethrough (in a formatted message's body)": "Rasurado (no corpo de uma mensagem formatada)",
  "Link the selection to an address, or insert one at the caret (in a formatted message's body; Enter inserts, Esc cancels)":
    "Ligar a seleção a um endereço, ou inserir um no cursor (no corpo de uma mensagem formatada; Enter insere, Esc cancela)",
  "Bulleted / numbered list on the selected paragraphs (the key that types `8` / `7`); typing `- `, `* ` or `1. ` at a line start does the same":
    "Lista com marcas / numerada nos parágrafos selecionados (a tecla que escreve `8` / `7`); escrever `- `, `* ` ou `1. ` no início de uma linha faz o mesmo",
  "Quote the selected paragraphs (again takes it off)": "Citar os parágrafos selecionados (de novo, retira a citação)",
  "Align left / center / right / justify (in the body these come before Search and Reply)":
    "Alinhar à esquerda / ao centro / à direita / justificar (no corpo, estas teclas têm prioridade sobre Pesquisar e Responder)",
  "One font size larger / smaller": "Um tamanho de letra acima / abaixo",
  "Increase / decrease the indent": "Aumentar / diminuir o avanço",
  "A list item's level, or the next / previous table cell (Tab after the last cell leaves the table); elsewhere Tab moves the focus":
    "O nível de um item de lista, ou a célula seguinte / anterior da tabela (Tab depois da última célula sai da tabela); noutros sítios, Tab move o foco",
  "Clear formatting": "Limpar formatação",
  "Undo / redo text and formatting together (200 steps)": "Desfazer / refazer texto e formatação em conjunto (200 passos)",
  "Paste as plain text (in the body, where it does not move messages)":
    "Colar como texto simples (no corpo, onde não move mensagens)",
  "Close the composer, saving the draft (in a composer tab, close the tab)":
    "Fechar o editor de mensagens e guardar o rascunho (num separador de rascunho, fecha o separador)",
  "Next / previous control; the folders, the list, the reader's toolbar and the composer's formatting buttons are one stop each (a row's quick actions, shown on hover and on the keyboard's row, are never Tab stops: the keys below do the same)":
    "Controlo seguinte / anterior; as pastas, a lista, a barra de ferramentas do leitor e os botões de formatação do editor são uma paragem cada (as ações rápidas de uma linha, que aparecem ao passar o rato e na linha do teclado, nunca são paragens do Tab: as teclas abaixo fazem o mesmo)",
  "Next / previous pane: the title bar's search, folders, message list, reader (toolbar, composer or the selection's buttons)":
    "Painel seguinte / anterior: a pesquisa da barra de título, as pastas, a lista de mensagens, o leitor (barra de ferramentas, editor ou os botões da seleção)",
  "Press the focused button or toggle": "Premir o botão ou interruptor com o foco",
  "Move along the reader's toolbar or the formatting buttons (while they have the focus)":
    "Percorrer a barra de ferramentas do leitor ou os botões de formatação (enquanto têm o foco)",
  "Move through the folders and open one (while they have the focus; Left / Right fold an account)":
    "Percorrer as pastas e abrir uma (enquanto têm o foco; as setas para a esquerda e para a direita fecham ou abrem uma conta)",
  "In the folders: the row's menu (Mark all as read and Collapse all; on an account also Refresh and Account settings; on a rail tile its Inbox, Sent and Archive)":
    "Nas pastas: o menu da linha (Marcar todas como lidas e Fechar tudo; numa conta também Atualizar e Definições da conta; num mosaico da barra estreita, a sua Caixa de entrada, Itens enviados e Arquivo)",
  "Reply / Reply all": "Responder / Responder a todos",
  Forward: "Reencaminhar",
  "Move to: the Move list with its filter box focused (type to narrow it, Enter moves to the first folder listed)":
    "Mover para: a lista Mover com a caixa de filtro em foco (escreva para a reduzir; Enter move para a primeira pasta da lista)",
  "Go to the Inbox (All inboxes with two or more accounts; from Settings too)":
    "Ir para a Caixa de entrada (Todas as caixas de entrada com duas ou mais contas; também a partir das Definições)",
  "Search (the title bar's box; from Settings too, which then close)":
    "Pesquisar (a caixa da barra de título; também a partir das Definições, que então fecham)",
  "Mark as read / Mark as unread (Outlook's keys; on a selection, every message)":
    "Marcar como lida / Marcar como não lida (as teclas do Outlook; numa seleção, todas as mensagens)",
  "Save the message as a .eml file": "Guardar a mensagem como ficheiro .eml",
  "Mark as important / Remove importance (Ctrl+Shift+G for keyboards without Insert)":
    "Marcar como importante / Desmarcar como importante (Ctrl+Shift+G para teclados sem Insert)",
  "Archive (with the focus on a message row or the reader's page only; never in a text field, Drafts or the Outbox)":
    "Arquivar (só com o foco numa linha de mensagem ou na página do leitor; nunca num campo de texto, em Rascunhos ou na Caixa de saída)",
  "Previous / next message (with none open, the first); in Drafts, move to a draft (Enter opens it); in the Outbox, show the entry":
    "Mensagem anterior / seguinte (sem nenhuma aberta, a primeira); em Rascunhos, ir para um rascunho (Enter abre-o); na Caixa de saída, mostrar a entrada",
  "First / last message": "Primeira / última mensagem",
  "Up / down by the rows the list shows": "Subir / descer as linhas que a lista mostra",
  "Open the selected message (with none, the first) and move to the page, where PageUp/PageDown, Space and Tab work":
    "Abrir a mensagem selecionada (sem nenhuma, a primeira) e passar para a página, onde funcionam PageUp/PageDown, Espaço e Tab",
  'Close the folder pane opened over a narrow window (the toggle at the top of the narrow rail opens it), else clear the search, else the selection and the open message or Outbox entry (below 720 px, back to the list, as the reader\'s back arrow does), else "Select messages", else the status line (Esc on its buttons always closes it); never the Undo offer at the bottom of the list':
    "Fechar o painel de pastas aberto sobre uma janela estreita (o botão no topo da barra estreita abre-o); senão, limpar a pesquisa; senão, a seleção e a mensagem ou entrada da Caixa de saída aberta (abaixo de 720 px, volta à lista, como a seta para trás do leitor); senão, \"Selecionar mensagens\"; senão, a linha de estado (Esc nos seus botões fecha-a sempre); nunca a oferta de Desfazer no fundo da lista",
  "Add or remove a message from the selection / select a range":
    "Adicionar ou retirar uma mensagem da seleção / selecionar um intervalo",
  "Extend the selection": "Alargar a seleção",
  "Select every message in the list (with the list focused)": "Selecionar todas as mensagens da lista (com a lista em foco)",
  "Delete (move to Trash); in Trash (deleted on the server) or Junk, after asking (the prompt has no default button); in Drafts or the Outbox, discard the row (asking first)":
    "Eliminar (mover para Itens eliminados); em Itens eliminados (elimina no servidor) ou Lixo eletrónico, depois de perguntar (a pergunta não tem botão predefinido); em Rascunhos ou na Caixa de saída, descartar a linha (pergunta primeiro)",
  "The row menu for what is selected, under the current row (a draft or Outbox row: Open, Discard)":
    "O menu da linha para o que está selecionado, por baixo da linha atual (numa linha de rascunho ou da Caixa de saída: Abrir, Descartar)",
  "Undo the last archive, delete, move, junk report or send (while the offer at the bottom of the list shows: at least 10 s, or until the next one; its time stops while the pointer is over it)":
    "Desfazer o último arquivo, eliminação, movimento, marcação como lixo eletrónico ou envio (enquanto a oferta aparece no fundo da lista: pelo menos 10 s, ou até à seguinte; o tempo para enquanto o ponteiro estiver por cima)",
  "Refresh (also retries a rejected sign-in)": "Atualizar (também tenta de novo um início de sessão recusado)",
  "Show / hide the folders (the pane folds to the rail)": "Mostrar / ocultar as pastas (o painel recolhe para a barra estreita)",
  "Open the message in a new tab (a tab it already has comes forward)":
    "Abrir a mensagem num novo separador (se já tiver um, esse passa para a frente)",
  "On a message row, open it in a background tab; on a tab, close it":
    "Numa linha de mensagem, abri-la num separador em segundo plano; num separador, fechá-lo",
  "Open the message in a new window (a tab moved this way closes)":
    "Abrir a mensagem numa nova janela (um separador movido assim fecha-se)",
  "Close the tab (not the Mail tab); in a message window, close the window":
    "Fechar o separador (não o separador Correio); numa janela de mensagem, fechar a janela",
  "Next / previous tab": "Separador seguinte / anterior",
  "Go to tab 1 to 8, the last tab": "Ir para o separador 1 a 8, o último separador",
  "Move the tab left / right (the Mail tab stays first)":
    "Mover o separador para a esquerda / direita (o separador Correio fica sempre em primeiro)",
  "Reopen the last closed tab": "Reabrir o último separador fechado",
  "Close the window; in a message tab Esc never closes the tab":
    "Fechar a janela; num separador de mensagem, Esc nunca fecha o separador",
};

const PT_NOTES: Record<string, string> = {
  "The keys that act on the selected message (reply, forward, read and unread, important, archive, Delete, Move, and the list keys above) work only while the reader shows, never in the composer or Settings. The list has the keys from the start, before any click. Show original has no key: it is in the reader's More menu (and the row menu), whose items show their keys.":
    "As teclas que atuam sobre a mensagem selecionada (responder, reencaminhar, lida e não lida, importante, arquivar, Delete, Mover e as teclas da lista acima) só funcionam enquanto o leitor está à vista, nunca no editor de mensagens nem nas Definições. A lista aceita as teclas desde o início, antes de qualquer clique. Mostrar original não tem tecla: está no menu Mais do leitor (e no menu da linha), cujos itens mostram as suas teclas.",
  'On a message row, the quick actions (hover, or the keyboard\'s row) are Archive, Delete, Mark as important and Mark as read / unread: they act on that row only, never open it and never mark it read. "Select messages" in the list\'s "..." menu shows check boxes (a click then checks a row instead of opening it). A message opened from the Unread filter stays in the list, read, until the filter or the view changes (as in Outlook).':
    'Numa linha de mensagem, as ações rápidas (ao passar o rato, ou na linha do teclado) são Arquivar, Eliminar, Marcar como importante e Marcar como lida / não lida: atuam só nessa linha, nunca a abrem e nunca a marcam como lida. "Selecionar mensagens", no menu "..." da lista, mostra caixas de verificação (um clique passa a marcar a linha em vez de a abrir). Uma mensagem aberta a partir do filtro Não lidas fica na lista, lida, até o filtro ou a vista mudarem (como no Outlook).',
};

const PT_KEY_WORDS: [RegExp, string][] = [
  [/\(in the contact editor's Name box\)/, "(na caixa Nome do editor de contactos)"],
  [/\(in a list or table\)/, "(numa lista ou tabela)"],
  [/\(in a message window\)/, "(numa janela de mensagem)"],
  [/Double-click/, "Duplo clique"],
  [/Middle-click/, "Clique do meio"],
  [/\+click/g, "+clique"],
  [/(?<![A-Za-z])Space(?![A-Za-z])/g, "Espaço"],
  [/(?<![A-Za-z])Up(?![A-Za-z])/g, "Seta para cima"],
  [/(?<![A-Za-z])Down(?![A-Za-z])/g, "Seta para baixo"],
  [/(?<![A-Za-z])Left(?![A-Za-z])/g, "Seta para a esquerda"],
  [/(?<![A-Za-z])Right(?![A-Za-z])/g, "Seta para a direita"],
  [/ or /g, " ou "],
  [/ to /g, " até "],
];

function normalize(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

/** The rows and the paragraphs under the table, from the README's "## Keyboard" section. */
function parse(readme: string): { rows: Shortcut[]; notes: string[] } {
  const lines = readme.replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex((line) => line.trim() === "## Keyboard");
  if (start < 0) throw new Error('README.md has no "## Keyboard" section');
  const rows: Shortcut[] = [];
  const notes: string[] = [];
  let paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) notes.push(normalize(paragraph.join(" ")));
    paragraph = [];
  };
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith("## ")) break;
    const cells = /^\|(.+)\|\s*$/.exec(line);
    if (cells) {
      const [keys, ...rest] = cells[1].split(" | ").map((cell) => cell.trim());
      const action = rest.join(" | ");
      if (keys === "Key" || /^-+$/.test(keys.replace(/\|/g, "")) || !action) continue;
      rows.push({ keys, action });
    } else if (line.trim() === "") {
      flush();
    } else {
      paragraph.push(line);
    }
  }
  flush();
  if (rows.length === 0) throw new Error("README.md keyboard table is empty");
  return { rows, notes };
}

const cache = new Map<Locale, ShortcutTable>();

export function shortcutTable(locale: Locale): ShortcutTable {
  const hit = cache.get(locale);
  if (hit) return hit;
  const { rows, notes } = parse(readUpstream("README.md"));
  let missing = 0;
  const table: ShortcutTable =
    locale === "en"
      ? { rows, notes, missing: 0 }
      : {
          rows: rows.map((row) => {
            const action = PT_ACTIONS[row.action];
            if (!action) missing += 1;
            const keys = PT_KEY_WORDS.reduce((text, [pattern, value]) => text.replace(pattern, value), row.keys);
            return { keys, action: action ?? row.action };
          }),
          notes: notes.map((note) => {
            const text = PT_NOTES[note];
            if (!text) missing += 1;
            return text ?? note;
          }),
          missing: 0,
        };
  table.missing = missing;
  if (missing) console.warn(`shortcuts: ${missing} README keyboard rows or notes have no Portuguese text yet`);
  cache.set(locale, table);
  return table;
}

function cell(text: string) {
  return text.replaceAll("|", "\\|");
}

export function shortcutsMarkdown(locale: Locale): string {
  const { rows, notes } = shortcutTable(locale);
  const head = locale === "pt" ? "| Tecla | Ação |" : "| Key | Action |";
  return [head, "| --- | --- |", ...rows.map((row) => `| ${cell(row.keys)} | ${cell(row.action)} |`), "", ...notes.flatMap((note) => [note, ""])]
    .join("\n")
    .trim();
}
