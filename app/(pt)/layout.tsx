import type { ReactNode } from "react";
import { Shell } from "../../components/Shell";
import { rootMetadata, rootViewport } from "../../lib/root";
import "../site.css";

export const metadata = rootMetadata();
export const viewport = rootViewport;

export default function PortugueseLayout({ children }: { children: ReactNode }) {
  return <Shell locale="pt">{children}</Shell>;
}
