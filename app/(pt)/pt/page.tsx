import { Home } from "../../../components/Home";
import { staticMetadata } from "../../../lib/pages";

export const metadata = staticMetadata("pt", "home");

export default function Page() {
  return <Home locale="pt" />;
}
