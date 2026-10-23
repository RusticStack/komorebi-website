import { DocArticle, docMetadata, docParams } from "../../../../components/DocArticle";

type Props = { params: Promise<{ slug?: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return docParams("en");
}

export async function generateMetadata({ params }: Props) {
  return docMetadata("en", (await params).slug);
}

export default async function Page({ params }: Props) {
  return <DocArticle locale="en" slug={(await params).slug} />;
}
