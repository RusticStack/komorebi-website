// Help search over a static index of the help pages: the field on the help home and the Ctrl+K
// dialog (a native <dialog>, which needs no library) on every help page. Only help pages load it.
type Entry = { t: string; d: string; x: string; u: string };

const dialog = document.getElementById("search-dialog") as HTMLDialogElement | null;
if (dialog) setup(dialog);

function setup(dialog: HTMLDialogElement) {
  let index: Promise<Entry[]> | null = null;
  const load = () =>
    (index ??= fetch(dialog.dataset.index ?? "")
      .then((r) => (r.ok ? (r.json() as Promise<Entry[]>) : []))
      .catch(() => []));
  const fold = (text: string) => text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  function find(query: string, docs: Entry[]): Entry[] {
    const terms = fold(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    const hits: [number, Entry][] = [];
    for (const doc of docs) {
      const title = fold(doc.t);
      const body = fold(`${doc.d} ${doc.x}`);
      let score = 0;
      for (const term of terms) {
        if (title.includes(term)) score += 10;
        else if (body.includes(term)) score += 1;
        else {
          score = 0;
          break;
        }
      }
      if (score) hits.push([score, doc]);
    }
    return hits
      .sort((a, b) => b[0] - a[0])
      .slice(0, 8)
      .map((hit) => hit[1]);
  }

  function bind(input: HTMLInputElement, list: HTMLElement, status: HTMLElement) {
    const links = () => [...list.querySelectorAll("a")];
    input.addEventListener("input", async () => {
      const query = input.value.trim();
      const hits = query ? find(query, await load()) : [];
      if (query !== input.value.trim()) return;
      list.replaceChildren(
        ...hits.map((doc) => {
          const li = document.createElement("li");
          const a = document.createElement("a");
          a.href = doc.u;
          a.textContent = doc.t;
          const small = document.createElement("small");
          small.textContent = doc.d;
          a.append(small);
          li.append(a);
          return li;
        }),
      );
      if (query && !hits.length) {
        const li = document.createElement("li");
        li.className = "none";
        li.textContent = dialog.dataset.none ?? "";
        list.append(li);
      }
      status.textContent = query
        ? hits.length
          ? (dialog.dataset.count ?? "").replace("{n}", String(hits.length))
          : (dialog.dataset.none ?? "")
        : "";
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" && links().length) {
        event.preventDefault();
        links()[0].focus();
      } else if (event.key === "Enter" && links().length) {
        event.preventDefault();
        location.href = links()[0].href;
      }
    });
    list.addEventListener("keydown", (event) => {
      const all = links();
      const at = all.indexOf(document.activeElement as HTMLAnchorElement);
      if (at < 0) return;
      if (event.key === "ArrowDown" && at < all.length - 1) {
        event.preventDefault();
        all[at + 1].focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        (at > 0 ? all[at - 1] : input).focus();
      }
    });
  }

  const inline = document.getElementById("search-input") as HTMLInputElement | null;
  if (inline) {
    bind(inline, document.getElementById("search-results")!, document.getElementById("search-status")!);
  }
  const dialogInput = document.getElementById("search-dialog-input") as HTMLInputElement;
  bind(dialogInput, document.getElementById("search-dialog-results")!, dialog.querySelector<HTMLElement>("[data-status]")!);

  const open = () => {
    if (dialog.open) return;
    load();
    dialog.showModal();
    dialogInput.focus();
    dialogInput.select();
  };
  for (const button of document.querySelectorAll("[data-open-search]")) {
    button.addEventListener("click", open);
  }
  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === "k") {
      event.preventDefault();
      open();
    }
  });
  // a click on the dimmed backdrop closes the dialog
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
    if (!inside) dialog.close();
  });
}
