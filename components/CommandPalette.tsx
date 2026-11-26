"use client";

import { useRouter } from "next/navigation";
import { Fragment, useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { ui, type Locale } from "../lib/i18n";
import type { SearchIndex } from "../lib/search";
import { DocIcon, HashIcon, KeyboardIcon, PageIcon, SearchIcon } from "./icons";

export const OPEN_SEARCH_EVENT = "komorebi:open-search";

type Row = { id: string; url: string; kind: "doc" | "heading" | "page" | "shortcut"; title: string; detail?: string; group: "docs" | "pages" | "shortcuts" };

/** Lower case without accents, so "configuracao" finds "configuração". */
function fold(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function scoreText(text: string, terms: string[], weight: number) {
  const value = fold(text);
  let score = 0;
  for (const term of terms) {
    if (!value.includes(term)) return 0;
    score += value.startsWith(term) || value.includes(` ${term}`) ? weight : weight / 2;
  }
  return score;
}

function search(index: SearchIndex, query: string): Row[] {
  const terms = fold(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const docs: { row: Row; score: number; headings: Row[] }[] = [];
  for (const doc of index.docs) {
    const title = scoreText(doc.title, terms, 100);
    const description = scoreText(doc.description, terms, 30);
    const body = scoreText(`${doc.title} ${doc.description} ${doc.text}`, terms, 8);
    const headings = doc.headings
      .map((h) => ({ h, score: scoreText(h.text, terms, 50) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);
    const score = Math.max(title, description, body, ...headings.map((x) => x.score * 0.9));
    if (score <= 0) continue;
    docs.push({
      score,
      row: { id: doc.url, url: doc.url, kind: "doc", title: doc.title, detail: doc.description, group: "docs" },
      headings: headings.map(({ h }) => ({ id: h.url, url: h.url, kind: "heading", title: h.text, detail: doc.title, group: "docs" })),
    });
  }
  docs.sort((a, b) => b.score - a.score);
  const pages = index.pages
    .map((page) => ({ page, score: Math.max(scoreText(page.title, terms, 100), scoreText(`${page.title} ${page.description}`, terms, 20)) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ page }): Row => ({ id: `page:${page.url}`, url: page.url, kind: "page", title: page.title, detail: page.description, group: "pages" }));
  const shortcuts = index.shortcuts
    .map((s, i) => ({ s, i, score: Math.max(scoreText(s.action, terms, 60), scoreText(s.keys, terms, 80)) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ s, i }): Row => ({ id: `shortcut:${i}`, url: s.url, kind: "shortcut", title: s.action, detail: s.keys, group: "shortcuts" }));
  return [...docs.slice(0, 6).flatMap((d) => [d.row, ...d.headings]), ...pages, ...shortcuts];
}

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Marks the query terms in a result, accent-insensitively. */
function highlight(text: string, query: string): ReactNode {
  const terms = fold(query).split(/\s+/).filter(Boolean).map(escapeRegExp);
  if (!terms.length) return text;
  const folded = fold(text);
  if (folded.length !== text.length) return text;
  const re = new RegExp(terms.join("|"), "g");
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of folded.matchAll(re)) {
    const at = match.index ?? 0;
    if (at > last) parts.push(<Fragment key={`t${last}`}>{text.slice(last, at)}</Fragment>);
    parts.push(<mark key={`m${at}`}>{text.slice(at, at + match[0].length)}</mark>);
    last = at + match[0].length;
  }
  if (last < text.length) parts.push(<Fragment key={`t${last}`}>{text.slice(last)}</Fragment>);
  return parts;
}

/**
 * The command palette: Ctrl+K (or Cmd+K), or the search box in the top bar. It searches a
 * small static index built with the site (/search-index/<lang>) for docs pages and their
 * headings, the other pages and the app's keyboard shortcuts, grouped like the app's own
 * Ctrl+K. Without JavaScript the search box is a link to the docs index.
 */
export function CommandPalette({ locale }: { locale: Locale }) {
  const t = ui(locale);
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const listId = useId();
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [failed, setFailed] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const load = useCallback(() => {
    if (index || failed) return;
    fetch(`/search-index/${locale}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: SearchIndex) => setIndex(data))
      .catch(() => setFailed(true));
  }, [index, failed, locale]);

  const show = useCallback(
    (from?: HTMLElement | null) => {
      opener.current = from ?? (document.activeElement as HTMLElement | null);
      load();
      dialog.current?.showModal();
      setIsOpen(true);
      requestAnimationFrame(() => {
        input.current?.focus();
        input.current?.select();
      });
    },
    [load],
  );
  const close = () => dialog.current?.close();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialog.current?.open) close();
        else show();
      }
    };
    const onClick = (event: MouseEvent) => {
      const trigger = (event.target as Element | null)?.closest<HTMLElement>("[data-search-open]");
      if (!trigger || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey) return;
      event.preventDefault();
      show(trigger);
    };
    const onOpen = (event: Event) => show((event as CustomEvent<HTMLElement>).detail);
    const warm = (event: Event) => {
      if ((event.target as Element | null)?.closest?.("[data-search-open]")) load();
    };
    addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    document.addEventListener("pointerover", warm);
    addEventListener(OPEN_SEARCH_EVENT, onOpen);
    return () => {
      removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", warm);
      removeEventListener(OPEN_SEARCH_EVENT, onOpen);
    };
  }, [show, load]);

  const rows = useMemo<Row[]>(() => {
    if (!index) return [];
    if (!query.trim()) {
      return index.suggested.map((s) => ({ id: `s:${s.url}`, url: s.url, kind: "doc" as const, title: s.title, detail: s.description, group: "docs" as const }));
    }
    return search(index, query);
  }, [index, query]);

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    dialog.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (row: Row | undefined) => {
    if (!row) return;
    close();
    router.push(row.url);
  };

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(i + 1, rows.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      go(rows[active]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  const optionId = (i: number) => `${listId}-o${i}`;
  const groupLabel = { docs: t.searchGroupDocs, pages: t.searchGroupPages, shortcuts: t.searchGroupShortcuts };
  const groups = (["docs", "pages", "shortcuts"] as const)
    .map((group) => ({ group, items: rows.map((row, i) => ({ row, i })).filter((x) => x.row.group === group) }))
    .filter((g) => g.items.length > 0);
  const empty = Boolean(index && query.trim() && rows.length === 0);

  return (
    <dialog
      ref={dialog}
      className="palette"
      aria-label={t.searchDocs}
      onClose={() => {
        setIsOpen(false);
        opener.current?.focus();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) close();
      }}
    >
      <article>
        <header className="palette-head">
          <SearchIcon size={18} />
          <input
            ref={input}
            type="search"
            placeholder={t.searchPlaceholder}
            aria-label={t.searchPlaceholder}
            role="combobox"
            aria-expanded={rows.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={rows.length ? optionId(active) : undefined}
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
          />
          <button type="button" className="palette-esc" onClick={close} aria-label={t.searchClose}>
            Esc
          </button>
        </header>
        <div className="palette-body">
          {failed ? <p className="palette-note">{t.searchUnavailable}</p> : null}
          {!index && !failed ? <p className="palette-note" aria-busy="true" /> : null}
          {empty ? (
            <p className="palette-note">
              {t.searchEmpty} <strong>{query}</strong>
            </p>
          ) : null}
          {isOpen && rows.length > 0 ? (
            <div id={listId} role="listbox" aria-label={t.searchDocs} className="palette-results">
              {groups.map(({ group, items }) => (
                <div role="group" aria-labelledby={`${listId}-${group}`} key={group}>
                  <p className="palette-group" id={`${listId}-${group}`} role="presentation">
                    {query.trim() ? groupLabel[group] : t.searchSuggested}
                  </p>
                  {items.map(({ row, i }) => {
                    const Icon = row.kind === "heading" ? HashIcon : row.kind === "page" ? PageIcon : row.kind === "shortcut" ? KeyboardIcon : DocIcon;
                    return (
                      <div
                        key={row.id}
                        id={optionId(i)}
                        role="option"
                        aria-selected={i === active}
                        data-index={i}
                        data-kind={row.kind}
                        className="palette-option"
                        onMouseMove={() => setActive(i)}
                        onClick={() => go(row)}
                      >
                        <Icon size={16} />
                        <span className="palette-text">
                          <span className="palette-title">{highlight(row.title, query)}</span>
                          {row.detail ? <span className="palette-detail">{row.kind === "shortcut" ? <kbd>{row.detail}</kbd> : row.detail}</span> : null}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <footer className="palette-foot" aria-hidden="true">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> {t.searchHintMove}
          </span>
          <span>
            <kbd>Enter</kbd> {t.searchHintOpen}
          </span>
          <span>
            <kbd>Esc</kbd> {t.searchHintClose}
          </span>
        </footer>
      </article>
    </dialog>
  );
}
