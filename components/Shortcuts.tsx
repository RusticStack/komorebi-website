import { Fragment, type ReactNode } from "react";
import type { Locale } from "../lib/i18n";
import { shortcutTable } from "../lib/shortcuts";

/** `code` spans in README text become <code>; the rest stays text. */
function inline(text: string): ReactNode {
  return text.split(/(`[^`]+`)/).map((part, index) =>
    part.startsWith("`") && part.endsWith("`") ? <code key={index}>{part.slice(1, -1)}</code> : <Fragment key={index}>{part}</Fragment>,
  );
}

/** Keys as <kbd>: "Ctrl+Shift+T" becomes Ctrl + Shift + T, the words between combinations stay text. */
const SEPARATOR = /( \/ |, | or | ou | to | até )/;

function keys(text: string): ReactNode {
  const [, head, note] = /^(.*?)(\s*\(.*\))?$/.exec(text) ?? [text, text, ""];
  return (
    <>
      {head.split(SEPARATOR).map((part, index) => {
        if (index % 2 === 1 || !part) return <Fragment key={index}>{part}</Fragment>;
        const combo = part.split(/\+(?=.)/);
        return (
          <span className="combo" key={index}>
            {combo.map((key, i) => (
              <Fragment key={i}>
                {i > 0 ? "+" : null}
                <kbd>{key}</kbd>
              </Fragment>
            ))}
          </span>
        );
      })}
      {note ? <span className="keys-note">{note}</span> : null}
    </>
  );
}

export function Shortcuts({ lang = "en" }: { lang?: Locale }) {
  const { rows, notes } = shortcutTable(lang);
  return (
    <>
      <div className="table-wrap">
        <table className="shortcuts">
          <thead>
            <tr>
              <th scope="col">{lang === "pt" ? "Tecla" : "Key"}</th>
              <th scope="col">{lang === "pt" ? "Ação" : "Action"}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td className="keys">{keys(row.keys)}</td>
                <td>{inline(row.action)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {notes.map((note, index) => (
        <p key={index}>{inline(note)}</p>
      ))}
    </>
  );
}
