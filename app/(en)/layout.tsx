import type { ReactNode } from "react";
import { Shell } from "../../components/Shell";
import { rootMetadata, rootViewport } from "../../lib/root";
import "../site.css";

export const metadata = rootMetadata();
export const viewport = rootViewport;

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <Shell locale="en">{children}</Shell>;
}
