import { Home } from "../../components/Home";
import { staticMetadata } from "../../lib/pages";

export const metadata = staticMetadata("en", "home");

export default function Page() {
  return <Home locale="en" />;
}
