import type { APIRoute } from "astro";
import { manifest } from "../../lib/manifest";

export const GET: APIRoute = () =>
  new Response(JSON.stringify(manifest("pt"), null, 2), { headers: { "Content-Type": "application/manifest+json" } });
