import { paperRuntime } from "@/lib/paper-intake";
export async function bridgeAuthorized(request: Request) {
  const expected = paperRuntime().WIKIBIOME_INTAKE_BRIDGE_SECRET;
  if (!expected || expected.length < 32) return false;
  const token =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  const hash = async (s: string) =>
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)),
    );
  const [a, b] = await Promise.all([hash(token), hash(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
