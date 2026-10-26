import { getChatGPTUser } from "@/app/chatgpt-auth";
import { createContribution, isContributionType, isModerator, listContributionsForUser, listModerationQueue, sourceRequired } from "@/lib/contributions";
import { getWikiPage } from "@/lib/wikibiome";
import { assertSameOriginRequest } from "@/lib/research-network";

export async function GET(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in is required." }, { status: 401 });
  const queueRequested = new URL(request.url).searchParams.get("queue") === "1";
  if (queueRequested && !isModerator(user.userId)) return Response.json({ error: "Moderator access is required." }, { status: 403 });
  const rows = queueRequested ? await listModerationQueue() : await listContributionsForUser(user.userId);
  return Response.json({ contributions: rows });
}

export async function POST(request: Request) {
  try { assertSameOriginRequest(request); } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Request rejected." }, { status: 403 }); }
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Sign in is required." }, { status: 401 });

  const payload = await request.json() as Record<string, unknown>;
  const pageId = clean(payload.pageId, 180);
  const page = getWikiPage(pageId);
  const contributionType = clean(payload.contributionType, 40);
  const section = clean(payload.section, 180);
  const originalText = clean(payload.originalText, 4000);
  const proposedText = clean(payload.proposedText, 12000);
  const rationale = clean(payload.rationale, 4000);
  const sourceUrl = clean(payload.sourceUrl, 1000);

  if (!page) return Response.json({ error: "The selected WikiBiome article does not exist." }, { status: 400 });
  if (!isContributionType(contributionType)) return Response.json({ error: "Choose a valid contribution type." }, { status: 400 });
  if (!section || !proposedText || !rationale) return Response.json({ error: "Section, proposed text, and rationale are required." }, { status: 400 });
  if (sourceRequired(contributionType) && !sourceUrl) return Response.json({ error: "Scientific changes require a DOI, PMID, or source URL." }, { status: 400 });

  const contribution = await createContribution({ pageId: page.id, pageTitle: page.title, section, contributionType, originalText, proposedText, rationale, sourceUrl, user });
  return Response.json({ contribution }, { status: 201 });
}

function clean(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}
