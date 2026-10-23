import { PrivacyPage, PRIVACY_COPY } from "../../../../components/PrivacyPage";
import { pageMetadata } from "../../../../lib/seo";

export const metadata = pageMetadata({
  locale: "pt",
  path: "/privacy",
  title: PRIVACY_COPY.pt.title,
  description: PRIVACY_COPY.pt.description,
  ogKey: "privacy",
});

export default function Page() {
  return <PrivacyPage locale="pt" />;
}
