import { env } from "cloudflare:workers";
import {
  assertSameOriginRequest,
  getResearcherSessionFromRequest,
  removeResearcherProfilePhoto,
  setResearcherProfilePhoto,
} from "@/lib/research-network";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const supportedTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function PUT(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  if (!account.emailVerified) return Response.json({ error: "Verify your private email before publishing a profile photo." }, { status: 403 });

  const mimeType = String(request.headers.get("content-type") || "").split(";")[0].toLowerCase();
  const extension = supportedTypes.get(mimeType);
  if (!extension) return Response.json({ error: "Upload a JPEG, PNG, or WebP image." }, { status: 415 });
  const declaredSize = Number(request.headers.get("content-length") || 0);
  if (declaredSize > MAX_PHOTO_BYTES) return Response.json({ error: "Profile photos must be 5 MB or smaller." }, { status: 413 });

  const bytes = await request.arrayBuffer();
  if (!bytes.byteLength || bytes.byteLength > MAX_PHOTO_BYTES) return Response.json({ error: "Profile photos must be between 1 byte and 5 MB." }, { status: 413 });
  if (!matchesImageSignature(new Uint8Array(bytes), mimeType)) return Response.json({ error: "The file contents do not match the selected image type." }, { status: 400 });

  const bucket = (env as unknown as { MANUSCRIPTS?: R2Bucket }).MANUSCRIPTS;
  if (!bucket) return Response.json({ error: "Profile-photo storage is not configured." }, { status: 503 });
  const key = `profile-images/${account.accountId}/${crypto.randomUUID()}.${extension}`;
  await bucket.put(key, bytes, { httpMetadata: { contentType: mimeType }, customMetadata: { ownerAccountId: account.accountId, purpose: "public_researcher_profile" } });
  try {
    const result = await setResearcherProfilePhoto(account, { r2Key: key, mimeType, alt: new URL(request.url).searchParams.get("alt") });
    if (result.previousR2Key && result.previousR2Key !== key) await bucket.delete(result.previousR2Key);
    return Response.json({ photoUrl: `/researchers/${account.orcid}/photo?v=${encodeURIComponent(result.photoUpdatedAt)}`, photoUpdatedAt: result.photoUpdatedAt });
  } catch (error) {
    await bucket.delete(key);
    return Response.json({ error: error instanceof Error ? error.message : "The profile photo could not be saved." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const account = await getResearcherSessionFromRequest(request);
  if (!account) return Response.json({ error: "ORCID sign-in is required." }, { status: 401 });
  try {
    const result = await removeResearcherProfilePhoto(account);
    const bucket = (env as unknown as { MANUSCRIPTS?: R2Bucket }).MANUSCRIPTS;
    if (result.previousR2Key && bucket) await bucket.delete(result.previousR2Key);
    return Response.json({ removed: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "The profile photo could not be removed." }, { status: 400 });
  }
}

function matchesImageSignature(bytes: Uint8Array, mimeType: string) {
  if (mimeType === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === "image/png") return bytes.length >= 8 && [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((value, index) => bytes[index] === value);
  if (mimeType === "image/webp") return bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return false;
}
