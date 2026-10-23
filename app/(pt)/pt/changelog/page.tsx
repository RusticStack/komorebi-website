import { ChangelogPage, CHANGELOG_COPY } from "../../../../components/ChangelogPage";
import { pageMetadata } from "../../../../lib/seo";

export const metadata = pageMetadata({
  locale: "pt",
  path: "/changelog",
  title: CHANGELOG_COPY.pt.title,
  description: CHANGELOG_COPY.pt.description,
  ogKey: "changelog",
});

export default function Page() {
  return <ChangelogPage locale="pt" />;
}
