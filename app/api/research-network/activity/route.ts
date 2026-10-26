import { getCollaborationSummary, listPageActivity } from "@/lib/research-network-v2";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const targetType = url.searchParams.get("targetType") === "source" ? "source" : "article";
  const targetId = (url.searchParams.get("targetId") || "").slice(0, 180);
  if (!targetId) return Response.json({ error: "An activity target is required." }, { status: 400 });
  const [summary, activity] = await Promise.all([getCollaborationSummary(targetType, targetId), listPageActivity(targetType, targetId)]);
  return Response.json({ summary, activity }, { headers: { "cache-control": "public, max-age=30" } });
}
