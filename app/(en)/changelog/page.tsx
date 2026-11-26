import { ChangelogPage } from "../../../components/ChangelogPage";
import { staticMetadata } from "../../../lib/pages";

export const metadata = staticMetadata("en", "changelog");

export default function Page() {
  return <ChangelogPage locale="en" />;
}
