import { PrivacyPage, PRIVACY_COPY } from "../../../components/PrivacyPage";
import { pageMetadata } from "../../../lib/seo";

export const metadata = pageMetadata({
  locale: "en",
  path: "/privacy",
  title: PRIVACY_COPY.en.title,
  description: PRIVACY_COPY.en.description,
  ogKey: "privacy",
});

export default function Page() {
  return <PrivacyPage locale="en" />;
}
