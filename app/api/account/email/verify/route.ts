import { verifyResearcherEmail } from "@/lib/research-network";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") || "";
  const result = token ? await verifyResearcherEmail(token) : { state: "invalid" as const, accountId: null };
  return Response.redirect(new URL(`/researcher/dashboard?email=${result.state}`, request.url), 303);
}
