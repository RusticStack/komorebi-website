// Counts the words of the help pages, now and at a git ref (default origin/main), the same way on
// both sides: front matter, markup, component tags and link targets are left out.
//   node scripts/word-count.mjs [ref]
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ref = process.argv[2] ?? "origin/main";
const root = join(import.meta.dirname, "..");

function words(markdown) {
  const text = markdown
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/```\w*/g, ""))
    .replace(/<[^>]+>/g, " ")
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>|]/g, " ");
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

function now(locale) {
  const dir = join(root, "src", "content", "docs", locale);
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .reduce((sum, f) => sum + words(readFileSync(join(dir, f), "utf8").replace(/\r\n/g, "\n")), 0);
}

function before(locale) {
  const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" });
  const files = git("ls-tree", "--name-only", `${ref}:content/docs`)
    .split("\n")
    .filter((f) => f.endsWith(locale === "pt" ? ".pt.mdx" : ".mdx") && (locale === "pt" || !f.endsWith(".pt.mdx")));
  const mdx = files.reduce((sum, f) => sum + words(git("show", `${ref}:content/docs/${f}`).replace(/\r\n/g, "\n")), 0);
  // the old keyboard page also rendered the README's keyboard table (English text, both languages)
  const readme = git("show", `${ref}:upstream/README.md`).replace(/\r\n/g, "\n");
  const keyboard = /## Keyboard\n([\s\S]*?)\n## /.exec(readme)?.[1] ?? "";
  return { mdx, keyboard: words(keyboard) };
}

for (const locale of ["en", "pt"]) {
  const old = before(locale);
  const total = old.mdx + old.keyboard;
  const current = now(locale);
  console.log(
    `${locale}: before ${total} (${old.mdx} in the pages + ${old.keyboard} in the generated keyboard table), after ${current}, ${Math.round((1 - current / total) * 100)}% fewer`,
  );
}
