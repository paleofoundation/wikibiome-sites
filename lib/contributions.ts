import { env } from "cloudflare:workers";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { contributions } from "@/db/schema";
import type { ChatGPTUser } from "@/app/chatgpt-auth";

export const contributionTypes = [
  { id: "new_evidence", label: "Add new evidence", requiresSource: true },
  { id: "correction", label: "Correct a scientific claim", requiresSource: true },
  { id: "clarification", label: "Clarify existing prose", requiresSource: true },
  { id: "copy_edit", label: "Copy or accessibility edit", requiresSource: false },
  { id: "link_update", label: "Repair or improve a link", requiresSource: false },
] as const;

export type ContributionType = (typeof contributionTypes)[number]["id"];

export function isContributionType(value: string): value is ContributionType {
  return contributionTypes.some((item) => item.id === value);
}

export function sourceRequired(type: ContributionType) {
  return contributionTypes.find((item) => item.id === type)?.requiresSource ?? true;
}

export function isModerator(userId: string) {
  const value = String((env as unknown as Record<string, unknown>).WIKIBIOME_MODERATOR_IDS ?? "");
  return value.split(",").map((item) => item.trim()).filter(Boolean).includes(userId);
}

export async function createContribution(input: {
  pageId: string;
  pageTitle: string;
  section: string;
  contributionType: ContributionType;
  originalText: string;
  proposedText: string;
  rationale: string;
  sourceUrl?: string;
  user: ChatGPTUser;
}) {
  const [row] = await getDb().insert(contributions).values({
    id: crypto.randomUUID(),
    pageId: input.pageId,
    pageTitle: input.pageTitle,
    section: input.section,
    contributionType: input.contributionType,
    originalText: input.originalText,
    proposedText: input.proposedText,
    rationale: input.rationale,
    sourceUrl: input.sourceUrl || null,
    contributorUserId: input.user.userId,
    contributorEmail: input.user.email,
    contributorName: input.user.displayName,
  }).returning();
  return row;
}

export async function listContributionsForUser(userId: string) {
  return getDb().select().from(contributions).where(eq(contributions.contributorUserId, userId)).orderBy(desc(contributions.createdAt)).limit(100);
}

export async function listModerationQueue() {
  return getDb().select().from(contributions).where(eq(contributions.status, "pending")).orderBy(desc(contributions.createdAt)).limit(200);
}

export async function getContributionForUser(id: string, user: ChatGPTUser) {
  const moderator = isModerator(user.userId);
  const rows = await getDb().select().from(contributions).where(moderator ? eq(contributions.id, id) : and(eq(contributions.id, id), eq(contributions.contributorUserId, user.userId))).limit(1);
  return rows[0];
}

export async function moderateContribution(id: string, status: "accepted" | "declined" | "needs_revision", moderatorNote: string) {
  const [row] = await getDb().update(contributions).set({ status, moderatorNote, updatedAt: new Date().toISOString() }).where(eq(contributions.id, id)).returning();
  return row;
}
