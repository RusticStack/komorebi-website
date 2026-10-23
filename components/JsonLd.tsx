/** Structured data for search engines, as a static <script type="application/ld+json">. */
export function JsonLd({ data }: { data: unknown }) {
  // "<" is escaped so a string in the data can never close the script element
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
