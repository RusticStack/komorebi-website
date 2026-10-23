import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentProps } from "react";
import { Callout } from "./components/Callout";
import { DownloadLink } from "./components/DownloadButton";
import { Shortcuts } from "./components/Shortcuts";
import { Shot } from "./components/Shot";

function Anchor({ href = "", ...props }: ComponentProps<"a">) {
  // Files such as /llms.txt are not pages, so a router link would prefetch a route that does not exist
  const isFile = /\.[a-z0-9]+$/i.test(href.split(/[?#]/)[0]);
  if ((href.startsWith("/") && !isFile) || href.startsWith("#")) return <Link href={href} {...props} />;
  const external = /^https?:/.test(href);
  return <a href={href} {...(external ? { rel: "noopener" } : {})} {...props} />;
}

/** Headings get a link to themselves, shown on hover and focus. */
function heading(Tag: "h2" | "h3") {
  return function Heading({ id, children, ...props }: ComponentProps<"h2">) {
    if (!id) return <Tag {...props}>{children}</Tag>;
    return (
      <Tag id={id} {...props}>
        {children}
        <a href={`#${id}`} className="heading-anchor" aria-hidden="true" tabIndex={-1}>
          #
        </a>
      </Tag>
    );
  };
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    a: Anchor,
    h2: heading("h2"),
    h3: heading("h3"),
    table: (props: ComponentProps<"table">) => (
      <div className="table-wrap">
        <table {...props} />
      </div>
    ),
    Callout,
    Shot,
    Shortcuts,
    DownloadLink,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
