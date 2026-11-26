import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentProps } from "react";
import { CodeBlock } from "./components/CodeBlock";
import { DownloadLink } from "./components/DownloadButton";
import { Advanced, Callout, Checked, Compare, Faq, Kbd, NextSteps, Step, Steps } from "./components/Prose";
import { Shortcuts } from "./components/Shortcuts";
import { Shot } from "./components/Shot";
import { ui, type Locale } from "./lib/i18n";

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

export function getMDXComponents(locale: Locale = "en", components?: MDXComponents): MDXComponents {
  const t = ui(locale);
  return {
    a: Anchor,
    h2: heading("h2"),
    h3: heading("h3"),
    pre: (props: ComponentProps<"pre">) => <CodeBlock labels={{ copy: t.copyCode, copied: t.copied }} {...props} />,
    table: (props: ComponentProps<"table">) => (
      <div className="table-wrap" role="region" aria-label={locale === "pt" ? "Tabela" : "Table"} tabIndex={0}>
        <table {...props} />
      </div>
    ),
    Callout: (props: ComponentProps<typeof Callout>) => <Callout lang={locale} {...props} />,
    Advanced: (props: ComponentProps<typeof Advanced>) => <Advanced lang={locale} {...props} />,
    NextSteps: (props: ComponentProps<typeof NextSteps>) => <NextSteps lang={locale} {...props} />,
    Checked: (props: ComponentProps<typeof Checked>) => <Checked lang={locale} {...props} />,
    Shot: (props: ComponentProps<typeof Shot>) => <Shot lang={locale} {...props} />,
    Shortcuts: (props: ComponentProps<typeof Shortcuts>) => <Shortcuts lang={locale} {...props} />,
    DownloadLink: (props: ComponentProps<typeof DownloadLink>) => <DownloadLink lang={locale} {...props} />,
    Steps,
    Step,
    Faq,
    Compare,
    Kbd,
    ...components,
  };
}

export const useMDXComponents = getMDXComponents;
