import { Home } from "../../components/Home";
import { homeCopy } from "../../lib/home-copy";
import { pageMetadata } from "../../lib/seo";

const c = homeCopy("en");

export const metadata = pageMetadata({
  locale: "en",
  path: "/",
  title: c.metaTitle,
  description: c.metaDescription,
  ogKey: "home",
  absoluteTitle: true,
});

export default function Page() {
  return <Home locale="en" />;
}
