import { DownloadPage } from "../../../components/DownloadPage";
import { staticMetadata } from "../../../lib/pages";

export const metadata = staticMetadata("en", "download");

export default function Page() {
  return <DownloadPage locale="en" />;
}
