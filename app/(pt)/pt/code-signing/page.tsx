import { CodeSigningPage, CODE_SIGNING_COPY } from "../../../../components/CodeSigningPage";
import { pageMetadata } from "../../../../lib/seo";

export const metadata = pageMetadata({
  locale: "pt",
  path: "/code-signing",
  title: CODE_SIGNING_COPY.pt.title,
  description: CODE_SIGNING_COPY.pt.description,
  ogKey: "code-signing",
});

export default function Page() {
  return <CodeSigningPage locale="pt" />;
}
