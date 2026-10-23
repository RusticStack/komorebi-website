import type { ReactNode } from "react";

type Props = { title?: string; variant?: "note" | "caution"; children: ReactNode };

export function Callout({ title, variant = "note", children }: Props) {
  return (
    <aside className={`callout callout-${variant}`} role="note">
      {title ? <p className="callout-title">{title}</p> : null}
      <div className="callout-body">{children}</div>
    </aside>
  );
}
