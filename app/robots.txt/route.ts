import { ROBOTS_TXT } from "@/lib/routing-policy.mjs";

export function GET() {
  return new Response(ROBOTS_TXT, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}
