"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import { CheckIcon, CopyIcon } from "./icons";

/**
 * A code block with a copy button. The button is rendered hidden and shown once JavaScript
 * runs, since copying needs it. Long lines scroll inside the block; the block itself never
 * makes the page wider than the screen.
 */
export function CodeBlock({ labels, ...props }: ComponentProps<"pre"> & { labels: { copy: string; copied: string } }) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(Boolean(navigator.clipboard)), []);
  return (
    <div className="code">
      <pre ref={ref} tabIndex={0} {...props} />
      <button
        type="button"
        className="code-copy"
        hidden={!ready}
        aria-label={copied ? labels.copied : labels.copy}
        title={copied ? labels.copied : labels.copy}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(ref.current?.innerText.replace(/\n$/, "") ?? "");
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
        <span aria-live="polite" className="visually-hidden">
          {copied ? labels.copied : ""}
        </span>
      </button>
    </div>
  );
}
