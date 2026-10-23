import { CodeSigningPage, CODE_SIGNING_COPY } from "../../../components/CodeSigningPage";
import { pageMetadata } from "../../../lib/seo";

export const metadata = pageMetadata({
  locale: "en",
  path: "/code-signing",
  title: CODE_SIGNING_COPY.en.title,
  description: CODE_SIGNING_COPY.en.description,
  ogKey: "code-signing",
});

export default function Page() {
  return <CodeSigningPage locale="en" />;
}
