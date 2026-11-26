import { DownloadPage } from "../../../../components/DownloadPage";
import { staticMetadata } from "../../../../lib/pages";

export const metadata = staticMetadata("pt", "download");

export default function Page() {
  return <DownloadPage locale="pt" />;
}
