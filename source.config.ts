import { defineConfig, defineDocs, frontmatterSchema } from "fumadocs-mdx/config";
import { z } from "zod";

const placeholders = ["Shortcuts", "Shot", "DownloadLink", "Checked"];

export const docs = defineDocs({
  dir: "content/docs",
  docs: {
    schema: frontmatterSchema.extend({
      /** Short sidebar label, when the title is long. */
      nav: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: { headingIds: false, mdxAsPlaceholder: placeholders },
    },
  },
});

/** Pages outside the docs: About and the search-intent pages (comparisons and guides). */
export const pages = defineDocs({
  dir: "content/pages",
  docs: {
    schema: frontmatterSchema.extend({
      /** The page's h1 when it differs from the <title>. */
      heading: z.string().optional(),
      /** A short line above the h1. */
      eyebrow: z.string().optional(),
      /** The date the facts on the page were checked (comparisons), ISO yyyy-mm-dd. */
      checked: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: { headingIds: false, mdxAsPlaceholder: placeholders },
    },
  },
});

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: { light: "github-light", dark: "github-dark" },
    },
  },
});
