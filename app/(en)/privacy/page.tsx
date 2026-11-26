import { PrivacyPage } from "../../../components/PrivacyPage";
import { staticMetadata } from "../../../lib/pages";

export const metadata = staticMetadata("en", "privacy");

export default function Page() {
  return <PrivacyPage locale="en" />;
}
