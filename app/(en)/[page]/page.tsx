import { SiteArticle, siteMetadata, siteParams } from "../../../components/SiteArticle";

type Props = { params: Promise<{ page: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return siteParams("en");
}

export async function generateMetadata({ params }: Props) {
  return siteMetadata("en", (await params).page);
}

export default async function Page({ params }: Props) {
  return <SiteArticle locale="en" slug={(await params).page} />;
}
