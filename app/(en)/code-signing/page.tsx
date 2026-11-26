import { CodeSigningPage } from "../../../components/CodeSigningPage";
import { staticMetadata } from "../../../lib/pages";

export const metadata = staticMetadata("en", "code-signing");

export default function Page() {
  return <CodeSigningPage locale="en" />;
}
