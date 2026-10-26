import { env } from "cloudflare:workers";
import { getResearcherProfilePhoto } from "@/lib/research-network";

type Props = { params: Promise<{ orcid: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { orcid } = await params;
  const photo = await getResearcherProfilePhoto(orcid);
  if (!photo) return new Response("Profile photo not found.", { status: 404 });
  const bucket = (env as unknown as { MANUSCRIPTS?: R2Bucket }).MANUSCRIPTS;
  if (!bucket) return new Response("Profile-photo storage is unavailable.", { status: 503 });
  const object = await bucket.get(photo.r2Key);
  if (!object) return new Response("Profile photo not found.", { status: 404 });
  return new Response(object.body, {
    headers: {
      "content-type": photo.mimeType,
      "cache-control": "public, max-age=31536000, immutable",
      "content-security-policy": "default-src 'none'; sandbox",
      "x-content-type-options": "nosniff",
      etag: object.httpEtag,
    },
  });
}
