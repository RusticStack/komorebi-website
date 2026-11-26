import { SiteArticle, siteMetadata, siteParams } from "../../../../components/SiteArticle";

type Props = { params: Promise<{ page: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return siteParams("pt");
}

export async function generateMetadata({ params }: Props) {
  return siteMetadata("pt", (await params).page);
}

export default async function Page({ params }: Props) {
  return <SiteArticle locale="pt" slug={(await params).page} />;
}
