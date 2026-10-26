import { PUBLIC_ORIGIN } from "@/lib/search-discovery";

export function GET() {
  return Response.redirect(`${PUBLIC_ORIGIN}/sitemap.xml`, 301);
}
