import { ChangelogPage } from "../../../../components/ChangelogPage";
import { staticMetadata } from "../../../../lib/pages";

export const metadata = staticMetadata("pt", "changelog");

export default function Page() {
  return <ChangelogPage locale="pt" />;
}
