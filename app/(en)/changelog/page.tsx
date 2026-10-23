import { ChangelogPage, CHANGELOG_COPY } from "../../../components/ChangelogPage";
import { pageMetadata } from "../../../lib/seo";

export const metadata = pageMetadata({
  locale: "en",
  path: "/changelog",
  title: CHANGELOG_COPY.en.title,
  description: CHANGELOG_COPY.en.description,
  ogKey: "changelog",
});

export default function Page() {
  return <ChangelogPage locale="en" />;
}
