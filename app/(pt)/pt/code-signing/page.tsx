import { CodeSigningPage } from "../../../../components/CodeSigningPage";
import { staticMetadata } from "../../../../lib/pages";

export const metadata = staticMetadata("pt", "code-signing");

export default function Page() {
  return <CodeSigningPage locale="pt" />;
}
