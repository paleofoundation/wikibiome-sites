import { and, asc, count, desc, eq, gt, inArray, isNull, lt, or } from "drizzle-orm";
import {
  accounts,
  authorReviews,
  contentProposals,
  discussionPosts,
  discussionThreads,
  editorialChangePackets,
  messageReports,
  messageThreads,
  notificationOutbox,
  proposalEvents,
  proposalSources,
  rateLimitEvents,
  recognitionEvents,
  paperPublications,
  researcherBlocks,
  researcherEmails,
  researcherFollows,
  researcherMessages,
  researcherNotifications,
  researcherProfiles,
  researcherWorks,
  roundtableInterests,
  sourceClaims,
  workMatchSuggestions,
  workSubmissions,
  orcidSyncState,
} from "@/db/schema";
import {
  cleanText,
  createWorkSubmission,
  getPublicResearchersByAccountIds,
  isModeratorRole,
  recalculateInferredExpertise,
  recordAudit,
  type ResearcherSession,
} from "@/lib/research-network";
import { lookupResearchMetadata } from "@/lib/research-metadata";
import { allSources, findPagesUsingSource, getSource, getWikiPage, normalizeDoi } from "@/lib/wikibiome";
import {
  classifyWorkMatch,
  maskEmail,
  normalizeWorkDoi,
  normalizeWorkText,
  participantKey,
  recognitionMilestones,
  validateProposalInput,
} from "@/lib/research-network-v2-policy.mjs";

import { isPublishedProposalChange, isPublishedAuthorContext } from "@/lib/public-page-history-policy.mjs";
import publicationManifest from "@/data/content-manifest.generated.json";

const ONE_DAY = 86_400_000;
const AUTO_SYNC_AGE = 7 * ONE_DAY;
const proposalTypes = ["new_page", "new_section", "cross_page_connection", "framework_correction"] as const;
const followTypes = ["article", "source", "thread", "researcher"] as const;

async function getResearchDb() {
  const database = await import("@/db");
  return database.getDb();
}

type OrcidWork = {
  workKey: string;
  putCode: string | null;
  doi: string | null;
  title: string;
  year: number | null;
  journal: string | null;
  sourceUpdatedAt: string | null;
};

type InAppNotificationInput = {
  accountId: string;
  kind: string;
  actorAccountId?: string | null;
  targetType: string;
  targetId: string;
  title: string;
  body?: string;
  href: string;
  dedupeKey: string;
  emailMode?: "none" | "immediate" | "digest";
};

function assertVerified(account: ResearcherSession) {
  if (!account.orcid) throw new Error("Connect an authenticated ORCID iD first.");
  if (!account.emailVerified) throw new Error("Verify your private email before participating.");
}

function textList(value: unknown, limit: number, itemLimit = 100) {
  const values = Array.isArray(value) ? value : typeof value === "string" ? value.split(/[\n,]/) : [];
  return [...new Set(values.map((item) => cleanText(item, itemLimit)).filter(Boolean))].slice(0, limit);
}

function parseList(value: string) {
  try {
    const result = JSON.parse(value);
    return Array.isArray(result) ? result.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function parseJsonObject(value: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function safeHref(value: unknown, fallback = "/researcher/dashboard") {
  const href = cleanText(value, 500);
  return href.startsWith("/") && !href.startsWith("//") ? href : fallback;
}

async function enforceV2RateLimit(accountId: string, action: string, limit: number, minutes: number) {
  const db = await getResearchDb();
  const since = new Date(Date.now() - minutes * 60_000).toISOString();
  const [{ value }] = await db.select({ value: count() }).from(rateLimitEvents).where(and(eq(rateLimitEvents.accountId, accountId), eq(rateLimitEvents.action, action), gt(rateLimitEvents.createdAt, since)));
  if (Number(value) >= limit) throw new Error("You have reached the participation limit for now. Please try again later.");
  await db.insert(rateLimitEvents).values({ id: crypto.randomUUID(), accountId, action });
}

async function runtimeEnv() {
  try {
    const runtime = await import("cloudflare:workers");
    return runtime.env as unknown as Record<string, string | undefined>;
  } catch {
    return process.env as Record<string, string | undefined>;
  }
}

function orcidRegistryBase(runtime: Record<string, string | undefined>) {
  return runtime.ORCID_ENVIRONMENT === "sandbox" ? "https://sandbox.orcid.org" : "https://orcid.org";
}

function orcidApiBase(runtime: Record<string, string | undefined>) {
  return runtime.ORCID_ENVIRONMENT === "sandbox" ? "https://pub.sandbox.orcid.org" : "https://pub.orcid.org";
}

export async function getEmailVerificationStatus(accountId: string) {
  const db = await getResearchDb();
  const email = (await db.select().from(researcherEmails).where(eq(researcherEmails.accountId, accountId)).limit(1))[0];
  if (!email) return { configured: false, email: null, maskedEmail: "", verified: false, delivery: { state: "not_requested", detail: "No private contact email has been added." } };
  const latest = (await db.select().from(notificationOutbox).where(and(eq(notificationOutbox.accountId, accountId), eq(notificationOutbox.email, email.email), eq(notificationOutbox.kind, "email_verification"))).orderBy(desc(notificationOutbox.createdAt)).limit(1))[0];
  const state = email.verifiedAt ? "verified" : latest?.status === "sent" || latest?.status === "delivered" ? "sent" : latest?.status === "bounced" ? "bounced" : latest?.status === "complained" || latest?.status === "suppressed" ? "suppressed" : latest?.status === "failed" ? "failed" : latest ? "not_sent" : "not_requested";
  const detail = state === "verified"
    ? "Private email verified."
    : state === "sent"
      ? "A verification message was accepted by the email provider."
      : state === "bounced"
        ? "The verification message bounced. Change the address before trying again."
        : state === "suppressed"
          ? "Delivery is disabled after an unsubscribe, bounce, or complaint."
          : state === "failed"
            ? "The email provider could not accept the verification message."
            : state === "not_sent"
              ? "Your address is saved, but no verification message was sent."
              : "No verification message has been requested.";
  return { configured: true, email: email.email, maskedEmail: maskEmail(email.email), verified: Boolean(email.verifiedAt), delivery: { state, detail, lastAttemptAt: latest?.updatedAt ?? null, reason: latest?.lastError ?? null } };
}

export function searchResearchSources(queryValue: unknown, cursorValue?: unknown, limitValue = 25) {
  const query = normalizeWorkText(cleanText(queryValue, 300));
  const terms = query.split(" ").filter(Boolean);
  const cursor = cleanText(cursorValue, 200);
  const limit = Math.max(1, Math.min(50, Math.trunc(limitValue)));
  const rows = Object.entries(allSources)
    .map(([id, source]) => ({
      id,
      title: source.title,
      authors: source.authors ?? [],
      doi: normalizeWorkDoi(source.doi) || null,
      journal: source.journal ?? null,
      year: source.year ?? null,
      placements: findPagesUsingSource(id, 200).length,
    }))
    .filter((row) => {
      if (!terms.length) return true;
      const haystack = normalizeWorkText([row.id, row.title, row.authors.join(" "), row.doi, row.journal, row.year].join(" "));
      return terms.every((term) => haystack.includes(term));
    })
    .sort((a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id));
  const start = cursor ? Math.max(0, rows.findIndex((row) => row.id === cursor) + 1) : 0;
  const results = rows.slice(start, start + limit);
  return { results, nextCursor: start + limit < rows.length ? results.at(-1)?.id ?? null : null, total: rows.length };
}

async function fetchPublicOrcidWorks(account: ResearcherSession): Promise<OrcidWork[]> {
  const runtime = await runtimeEnv();
  if (!runtime.ORCID_CLIENT_ID || !runtime.ORCID_CLIENT_SECRET) throw new Error("orcid_not_configured");
  const tokenResponse = await fetch(`${orcidRegistryBase(runtime)}/oauth/token`, {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: runtime.ORCID_CLIENT_ID, client_secret: runtime.ORCID_CLIENT_SECRET, grant_type: "client_credentials", scope: "/read-public" }),
  });
  if (!tokenResponse.ok) throw new Error("orcid_token_error");
  const token = await tokenResponse.json() as { access_token?: string };
  if (!token.access_token) throw new Error("orcid_token_error");
  const response = await fetch(`${orcidApiBase(runtime)}/v3.0/${account.orcid}/works`, { headers: { accept: "application/json", authorization: `Bearer ${token.access_token}` } });
  if (!response.ok) throw new Error(response.status === 429 ? "orcid_rate_limited" : "orcid_api_error");
  const payload = await response.json() as { group?: Array<{ "last-modified-date"?: { value?: number }; "work-summary"?: Array<Record<string, unknown>> }> };
  const works: OrcidWork[] = [];
  for (const group of payload.group ?? []) {
    for (const summary of group["work-summary"] ?? []) {
      const titleRecord = summary.title as { title?: { value?: string } } | undefined;
      const externalIds = summary["external-ids"] as { "external-id"?: Array<{ "external-id-type"?: string; "external-id-value"?: string }> } | undefined;
      const doi = externalIds?.["external-id"]?.find((item) => item["external-id-type"]?.toLowerCase() === "doi")?.["external-id-value"];
      const putCode = summary["put-code"] == null ? null : String(summary["put-code"]);
      const title = cleanText(titleRecord?.title?.value, 1000);
      if (!title) continue;
      const publication = summary["publication-date"] as { year?: { value?: string } } | undefined;
      const journal = summary["journal-title"] as { value?: string } | undefined;
      works.push({
        workKey: normalizeWorkDoi(doi) || `orcid:${putCode || normalizeWorkText(title).slice(0, 160)}`,
        putCode,
        doi: normalizeWorkDoi(doi) || null,
        title,
        year: publication?.year?.value && /^\d{4}$/.test(publication.year.value) ? Number(publication.year.value) : null,
        journal: cleanText(journal?.value, 500) || null,
        sourceUpdatedAt: group["last-modified-date"]?.value ? new Date(group["last-modified-date"].value).toISOString() : null,
      });
    }
  }
  return [...new Map(works.map((work) => [work.workKey, work])).values()];
}

export async function syncResearcherWorks(account: ResearcherSession, mode: "automatic" | "manual" = "automatic") {
  const db = await getResearchDb();
  const state = (await db.select().from(orcidSyncState).where(eq(orcidSyncState.accountId, account.accountId)).limit(1))[0];
  const now = new Date();
  if (mode === "manual" && state?.nextAllowedAt && new Date(state.nextAllowedAt) > now) throw new Error("Manual refresh is available once per day.");
  if (mode === "automatic" && state?.lastSuccessAt && Date.now() - new Date(state.lastSuccessAt).valueOf() < AUTO_SYNC_AGE) return { skipped: true, state };
  const nowIso = now.toISOString();
  await db.insert(orcidSyncState).values({ accountId: account.accountId, status: "syncing", lastAttemptAt: nowIso, updatedAt: nowIso }).onConflictDoUpdate({ target: orcidSyncState.accountId, set: { status: "syncing", lastAttemptAt: nowIso, updatedAt: nowIso, errorCode: null } });
  try {
    const works = await fetchPublicOrcidWorks(account);
    const existing = await db.select().from(researcherWorks).where(eq(researcherWorks.accountId, account.accountId));
    const existingByKey = new Map(existing.map((work) => [work.workKey, work]));
    const sourceRows = Object.entries(allSources);
    for (const work of works) {
      const id = existingByKey.get(work.workKey)?.id ?? crypto.randomUUID();
      await db.insert(researcherWorks).values({ id, accountId: account.accountId, ...work, authorsJson: JSON.stringify([account.displayName]), syncedAt: nowIso }).onConflictDoUpdate({ target: [researcherWorks.accountId, researcherWorks.workKey], set: { putCode: work.putCode, doi: work.doi, title: work.title, authorsJson: JSON.stringify([account.displayName]), year: work.year, journal: work.journal, sourceUpdatedAt: work.sourceUpdatedAt, syncedAt: nowIso } });
      for (const [sourceId, source] of sourceRows) {
        const match = classifyWorkMatch({ ...work, authorName: account.displayName }, source);
        if (!match) continue;
        await db.insert(workMatchSuggestions).values({ id: crypto.randomUUID(), accountId: account.accountId, researcherWorkId: id, sourceId, matchType: match.matchType, confidence: match.confidence }).onConflictDoUpdate({ target: [workMatchSuggestions.accountId, workMatchSuggestions.sourceId], set: { researcherWorkId: id, matchType: match.matchType, confidence: match.confidence, updatedAt: nowIso } });
      }
    }
    const currentKeys = new Set(works.map((work) => work.workKey));
    const removed = existing.filter((work) => !currentKeys.has(work.workKey));
    if (removed.length) {
      const removedIds = removed.map((work) => work.id);
      await db.batch([
        db.delete(workMatchSuggestions).where(inArray(workMatchSuggestions.researcherWorkId, removedIds)),
        db.delete(researcherWorks).where(inArray(researcherWorks.id, removedIds)),
      ]);
    }
    const nextAllowedAt = new Date(Date.now() + ONE_DAY).toISOString();
    await db.update(orcidSyncState).set({ status: "ready", publicWorkCount: works.length, lastSuccessAt: nowIso, nextAllowedAt, errorCode: null, updatedAt: nowIso }).where(eq(orcidSyncState.accountId, account.accountId));
    await recordAudit(account.accountId, "orcid.works_synced", "account", account.accountId, { publicWorkCount: works.length, mode });
    return { skipped: false, publicWorkCount: works.length, nextAllowedAt };
  } catch (error) {
    const code = error instanceof Error ? error.message.slice(0, 80) : "orcid_api_error";
    await db.update(orcidSyncState).set({ status: "error", errorCode: code, updatedAt: new Date().toISOString() }).where(eq(orcidSyncState.accountId, account.accountId));
    await recordAudit(account.accountId, "orcid.works_sync_failed", "account", account.accountId, { code, mode });
    throw new Error("ORCID public works could not be refreshed. Your sign-in and existing WikiBiome data are unaffected.");
  }
}

export async function listResearcherWorkDiscovery(accountId: string) {
  const db = await getResearchDb();
  const [works, matches, claims, submissions, sync] = await Promise.all([
    db.select().from(researcherWorks).where(eq(researcherWorks.accountId, accountId)).orderBy(desc(researcherWorks.year), asc(researcherWorks.title)).limit(500),
    db.select().from(workMatchSuggestions).where(eq(workMatchSuggestions.accountId, accountId)).orderBy(desc(workMatchSuggestions.confidence), desc(workMatchSuggestions.updatedAt)).limit(500),
    db.select().from(sourceClaims).where(eq(sourceClaims.accountId, accountId)).limit(500),
    db.select().from(workSubmissions).where(eq(workSubmissions.accountId, accountId)).limit(500),
    db.select().from(orcidSyncState).where(eq(orcidSyncState.accountId, accountId)).limit(1).then((rows) => rows[0] ?? null),
  ]);
  const workMap = new Map(works.map((work) => [work.id, work]));
  const claimMap = new Map(claims.map((claim) => [claim.sourceId, claim]));
  const submissionsByDoi = new Map(submissions.filter((submission) => submission.identifierType === "doi").map((submission) => [normalizeWorkDoi(submission.identifierValue), submission.status]));
  return {
    sync,
    works: works.map((work) => ({ ...work, submissionStatus: work.doi ? submissionsByDoi.get(normalizeWorkDoi(work.doi)) ?? null : null })),
    matches: matches.map((match) => ({ ...match, work: workMap.get(match.researcherWorkId) ?? null, source: getSource(match.sourceId) ?? null, claim: claimMap.get(match.sourceId) ?? null })),
  };
}

export async function submitSyncedOrcidWork(account: ResearcherSession, workIdValue: unknown) {
  assertVerified(account);
  const workId = cleanText(workIdValue, 100);
  const work = (await (await getResearchDb()).select().from(researcherWorks).where(and(eq(researcherWorks.id, workId), eq(researcherWorks.accountId, account.accountId))).limit(1))[0];
  if (!work) throw new Error("ORCID work not found. Refresh your public works and try again.");
  const doi = normalizeWorkDoi(work.doi);
  if (!doi) throw new Error("This ORCID work has no DOI. Use the full submission form with a PMID or preprint URL.");
  const metadata = await lookupResearchMetadata({ type: "doi", value: doi });
  const submission = await createWorkSubmission({
    account,
    identifierType: "doi",
    identifierValue: doi,
    title: metadata.title || work.title,
    authors: metadata.authors,
    year: metadata.year || work.year || undefined,
    abstractText: metadata.abstractText,
    metadata: { ...((metadata.raw && typeof metadata.raw === "object") ? metadata.raw : {}), orcidWorkKey: work.workKey, importedFromOrcid: true },
    rightsAttested: false,
    license: metadata.license,
  });
  await recordAudit(account.accountId, "orcid.work_submitted", "work_submission", submission.id, { researcherWorkId: work.id, doi });
  return submission;
}

export async function confirmWorkMatch(account: ResearcherSession, matchIdValue: unknown, decisionValue: unknown) {
  assertVerified(account);
  await enforceV2RateLimit(account.accountId, "work_match.decision", 50, 1440);
  const matchId = cleanText(matchIdValue, 100);
  const decision = cleanText(decisionValue, 20);
  if (!matchId || !["confirm", "dismiss"].includes(decision)) throw new Error("Choose a valid match action.");
  const db = await getResearchDb();
  const match = (await db.select().from(workMatchSuggestions).where(and(eq(workMatchSuggestions.id, matchId), eq(workMatchSuggestions.accountId, account.accountId))).limit(1))[0];
  if (!match) throw new Error("Work match not found.");
  if (decision === "dismiss") {
    await db.update(workMatchSuggestions).set({ status: "dismissed", updatedAt: new Date().toISOString() }).where(eq(workMatchSuggestions.id, match.id));
    await recordAudit(account.accountId, "orcid.match_dismissed", "source", match.sourceId, { matchId });
    return { status: "dismissed", claim: null };
  }
  const exact = match.matchType === "exact_doi";
  const source = getSource(match.sourceId);
  if (!source) throw new Error("The matching WikiBiome source is no longer available.");
  const normalized = normalizeDoi(source.doi);
  const claim = (await db.select().from(sourceClaims).where(and(eq(sourceClaims.sourceId, match.sourceId), eq(sourceClaims.accountId, account.accountId))).limit(1))[0];
  const claimStatus = exact ? "verified" : "pending";
  const claimId = claim?.id ?? crypto.randomUUID();
  if (claim) await db.update(sourceClaims).set({ status: claim.status === "verified" ? "verified" : claimStatus, verificationMethod: exact ? "orcid_confirmed_exact_doi" : "orcid_possible_match_manual_review", updatedAt: new Date().toISOString() }).where(eq(sourceClaims.id, claim.id));
  else await db.insert(sourceClaims).values({ id: claimId, sourceId: match.sourceId, sourceDoi: normalized.status === "valid" ? normalized.bare : null, accountId: account.accountId, status: claimStatus, verificationMethod: exact ? "orcid_confirmed_exact_doi" : "orcid_possible_match_manual_review", evidenceNote: exact ? "Confirmed from the researcher’s public ORCID works." : "Researcher confirmed a possible title/year match." });
  await db.update(workMatchSuggestions).set({ status: "confirmed", updatedAt: new Date().toISOString() }).where(eq(workMatchSuggestions.id, match.id));
  if (claimStatus === "verified") await recalculateInferredExpertise(account.accountId);
  await recordAudit(account.accountId, "orcid.match_confirmed", "source", match.sourceId, { matchId, matchType: match.matchType, claimStatus });
  return { status: "confirmed", claim: { id: claimId, status: claimStatus, sourceId: match.sourceId } };
}

export async function setFollow(account: ResearcherSession, targetTypeValue: unknown, targetIdValue: unknown, enabled: boolean) {
  assertVerified(account);
  await enforceV2RateLimit(account.accountId, "follow.update", 100, 1440);
  const targetType = cleanText(targetTypeValue, 30) as (typeof followTypes)[number];
  const targetId = cleanText(targetIdValue, 180);
  if (!followTypes.includes(targetType) || !targetId) throw new Error("Choose a valid follow target.");
  if (targetType === "article" && !getWikiPage(targetId)) throw new Error("Article not found.");
  if (targetType === "source" && !getSource(targetId)) throw new Error("Source not found.");
  const db = await getResearchDb();
  if (targetType === "researcher" && !(await db.select({ id: researcherProfiles.accountId }).from(researcherProfiles).where(eq(researcherProfiles.accountId, targetId)).limit(1))[0]) throw new Error("Researcher not found.");
  if (targetType === "thread" && !(await db.select({ id: discussionThreads.id }).from(discussionThreads).where(and(eq(discussionThreads.id, targetId), eq(discussionThreads.status, "published"))).limit(1))[0]) throw new Error("Discussion not found.");
  if (enabled) await db.insert(researcherFollows).values({ id: crypto.randomUUID(), accountId: account.accountId, targetType, targetId }).onConflictDoNothing();
  else await db.delete(researcherFollows).where(and(eq(researcherFollows.accountId, account.accountId), eq(researcherFollows.targetType, targetType), eq(researcherFollows.targetId, targetId)));
  await recordAudit(account.accountId, enabled ? "follow.created" : "follow.removed", targetType, targetId, {});
  return { following: enabled };
}

export async function isFollowing(accountId: string | undefined, targetType: string, targetId: string) {
  if (!accountId) return false;
  try {
    const db = await getResearchDb();
    return Boolean((await db.select({ id: researcherFollows.id }).from(researcherFollows).where(and(eq(researcherFollows.accountId, accountId), eq(researcherFollows.targetType, targetType), eq(researcherFollows.targetId, targetId))).limit(1))[0]);
  } catch {
    return false;
  }
}

export async function createInAppNotification(input: InAppNotificationInput) {
  if (input.accountId === input.actorAccountId) return null;
  const db = await getResearchDb();
  const row = {
    id: crypto.randomUUID(),
    accountId: input.accountId,
    kind: cleanText(input.kind, 80),
    actorAccountId: input.actorAccountId ?? null,
    targetType: cleanText(input.targetType, 40),
    targetId: cleanText(input.targetId, 180),
    title: cleanText(input.title, 240),
    body: cleanText(input.body, 1000),
    href: safeHref(input.href),
    dedupeKey: cleanText(input.dedupeKey, 240),
  };
  const inserted = await db.insert(researcherNotifications).values(row).onConflictDoNothing().returning({ id: researcherNotifications.id });
  if (!inserted.length) return null;
  if (input.emailMode && input.emailMode !== "none") {
    const email = (await db.select().from(researcherEmails).where(eq(researcherEmails.accountId, input.accountId)).limit(1))[0];
    if (email?.verifiedAt && email.researchNotifications) {
      const activity = { title: row.title, body: row.body, href: row.href };
      if (input.emailMode === "digest") {
        const existing = (await db.select().from(notificationOutbox).where(and(eq(notificationOutbox.accountId, input.accountId), eq(notificationOutbox.email, email.email), eq(notificationOutbox.kind, "research_activity_digest"), eq(notificationOutbox.status, "pending"))).orderBy(asc(notificationOutbox.scheduledAt)).limit(1))[0];
        const existingPayload = existing ? parseJsonObject(existing.payloadJson) : {};
        const existingEvents = Array.isArray(existingPayload.events) ? existingPayload.events.slice(0, 50) : [];
        if (existing && existingEvents.length < 50) await db.update(notificationOutbox).set({ payloadJson: JSON.stringify({ events: [...existingEvents, activity] }), updatedAt: new Date().toISOString() }).where(eq(notificationOutbox.id, existing.id));
        else await db.insert(notificationOutbox).values({ id: crypto.randomUUID(), accountId: input.accountId, email: email.email, kind: "research_activity_digest", payloadJson: JSON.stringify({ events: [activity] }), scheduledAt: new Date(Date.now() + 12 * 60 * 60_000).toISOString() });
      } else {
        const outboxId = crypto.randomUUID();
        await db.insert(notificationOutbox).values({ id: outboxId, accountId: input.accountId, email: email.email, kind: "research_activity", payloadJson: JSON.stringify(activity), scheduledAt: new Date().toISOString() });
        try { await (await import("@/lib/research-email")).flushNotification(outboxId); } catch { /* In-app delivery remains authoritative when email is unavailable. */ }
      }
    }
  }
  return row;
}

export async function listNotifications(accountId: string, before?: string) {
  const db = await getResearchDb();
  const rows = await db.select().from(researcherNotifications).where(and(eq(researcherNotifications.accountId, accountId), ...(before ? [lt(researcherNotifications.createdAt, before)] : []))).orderBy(desc(researcherNotifications.createdAt)).limit(100);
  return rows;
}

export async function unreadNotificationCount(accountId: string) {
  try {
    const db = await getResearchDb();
    const [{ value }] = await db.select({ value: count() }).from(researcherNotifications).where(and(eq(researcherNotifications.accountId, accountId), isNull(researcherNotifications.readAt)));
    return Number(value);
  } catch {
    return 0;
  }
}

export async function markNotificationsRead(accountId: string, idsValue?: unknown) {
  const ids = textList(idsValue, 100, 100);
  const now = new Date().toISOString();
  const db = await getResearchDb();
  if (ids.length) await db.update(researcherNotifications).set({ readAt: now }).where(and(eq(researcherNotifications.accountId, accountId), inArray(researcherNotifications.id, ids)));
  else await db.update(researcherNotifications).set({ readAt: now }).where(and(eq(researcherNotifications.accountId, accountId), isNull(researcherNotifications.readAt)));
  return { readAt: now };
}

export async function notifyDiscussionActivity(input: { actor: Pick<ResearcherSession, "accountId" | "displayName">; threadId: string; targetType: "article" | "source" | "proposal"; targetId: string; title: string; body?: string; parentPostId?: string | null; postId: string }) {
  const db = await getResearchDb();
  await db.insert(researcherFollows).values({ id: crypto.randomUUID(), accountId: input.actor.accountId, targetType: "thread", targetId: input.threadId }).onConflictDoNothing();
  const [followers, thread, posts, claims, proposal] = await Promise.all([
    db.select().from(researcherFollows).where(or(and(eq(researcherFollows.targetType, input.targetType), eq(researcherFollows.targetId, input.targetId)), and(eq(researcherFollows.targetType, "thread"), eq(researcherFollows.targetId, input.threadId)), and(eq(researcherFollows.targetType, "researcher"), eq(researcherFollows.targetId, input.actor.accountId)))),
    db.select().from(discussionThreads).where(eq(discussionThreads.id, input.threadId)).limit(1).then((rows) => rows[0]),
    db.select().from(discussionPosts).where(eq(discussionPosts.threadId, input.threadId)).limit(300),
    input.targetType === "source" ? db.select().from(sourceClaims).where(and(eq(sourceClaims.sourceId, input.targetId), eq(sourceClaims.status, "verified"))) : Promise.resolve([]),
    input.targetType === "proposal" ? db.select().from(contentProposals).where(eq(contentProposals.id, input.targetId)).limit(1).then((rows) => rows[0] ?? null) : Promise.resolve(null),
  ]);
  const recipients = new Set([...followers.map((item) => item.accountId), ...posts.map((item) => item.accountId), ...claims.map((item) => item.accountId)]);
  const immediateRecipients = new Set<string>();
  if (thread) recipients.add(thread.createdByAccountId);
  if (proposal) recipients.add(proposal.accountId);
  if (input.parentPostId) {
    const parent = posts.find((post) => post.id === input.parentPostId);
    if (parent) { recipients.add(parent.accountId); immediateRecipients.add(parent.accountId); }
  }
  const mentionedOrcids = [...new Set((input.body || "").match(/\d{4}-\d{4}-\d{4}-\d{3}[\dX]/gi)?.map((value) => value.toUpperCase()) ?? [])].slice(0, 10);
  const mentioned = mentionedOrcids.length ? await db.select().from(researcherProfiles).where(inArray(researcherProfiles.orcid, mentionedOrcids)) : [];
  for (const profile of mentioned) { recipients.add(profile.accountId); immediateRecipients.add(profile.accountId); }
  const targetHref = input.targetType === "proposal" ? `/proposals/${input.targetId}#discussion` : `/${input.targetType}/${input.targetId}#discussion`;
  for (const accountId of recipients) await createInAppNotification({ accountId, actorAccountId: input.actor.accountId, kind: "discussion_reply", targetType: input.targetType, targetId: input.targetId, title: input.title, body: `${input.actor.displayName} contributed to a discussion you follow.`, href: targetHref, dedupeKey: `discussion:${input.postId}:${accountId}`, emailMode: immediateRecipients.has(accountId) ? "immediate" : "digest" });
  for (const profile of mentioned) await createInAppNotification({ accountId: profile.accountId, actorAccountId: input.actor.accountId, kind: "mention", targetType: input.targetType, targetId: input.targetId, title: `${input.actor.displayName} mentioned your ORCID iD`, body: cleanText(input.body, 240), href: targetHref, dedupeKey: `mention:${input.postId}:${profile.accountId}`, emailMode: "immediate" });
}

export async function createProposal(account: ResearcherSession, input: Record<string, unknown>) {
  assertVerified(account);
  await enforceV2RateLimit(account.accountId, "proposal.create", 10, 1440);
  const validated = validateProposalInput(input);
  const targetId = cleanText(input.targetId, 180) || null;
  if (validated.proposalType !== "new_page" && !targetId) throw new Error("Choose the existing WikiBiome page this proposal affects.");
  if (targetId && !getWikiPage(targetId)) throw new Error("The selected WikiBiome page does not exist.");
  const title = cleanText(input.title, 240);
  const rationale = cleanText(input.rationale, 8000);
  const proposedContent = cleanText(input.proposedContent, 16000);
  const mechanismConnection = cleanText(input.mechanismConnection, 8000);
  const causalLimitations = cleanText(input.causalLimitations, 8000);
  if (!title || !rationale || !proposedContent || !mechanismConnection || !causalLimitations) throw new Error("Complete every scientific proposal field.");
  const id = crypto.randomUUID();
  const db = await getResearchDb();
  await db.batch([
    db.insert(contentProposals).values({ id, accountId: account.accountId, proposalType: validated.proposalType, targetId, title, primaryAnchor: validated.primaryAnchor, secondaryDomainsJson: JSON.stringify(validated.secondaryDomains), rationale, proposedContent, mechanismConnection, causalLimitations, conflictDisclosure: cleanText(input.conflictDisclosure, 3000) }),
    db.insert(proposalEvents).values({ id: crypto.randomUUID(), proposalId: id, actorAccountId: account.accountId, kind: "submitted", visibility: "private", metadataJson: JSON.stringify({ primaryAnchor: validated.primaryAnchor }) }),
    ...validated.sources.map((source: { identifierType: string; identifierValue: string }, position: number) => db.insert(proposalSources).values({ id: crypto.randomUUID(), proposalId: id, identifierType: source.identifierType, identifierValue: source.identifierValue, position })),
  ]);
  await recordAudit(account.accountId, "proposal.submitted", "proposal", id, { proposalType: validated.proposalType, targetId, primaryAnchor: validated.primaryAnchor });
  return { id, status: "pending" };
}

export async function listProposalsForAccount(accountId: string) {
  const db = await getResearchDb();
  const proposals = await db.select().from(contentProposals).where(eq(contentProposals.accountId, accountId)).orderBy(desc(contentProposals.createdAt)).limit(200);
  const sources = proposals.length ? await db.select().from(proposalSources).where(inArray(proposalSources.proposalId, proposals.map((item) => item.id))).orderBy(asc(proposalSources.position)) : [];
  return proposals.map((proposal) => ({ ...proposal, secondaryDomains: parseList(proposal.secondaryDomainsJson), sources: sources.filter((source) => source.proposalId === proposal.id) }));
}

export async function listAcceptedProposals(targetId?: string) {
  try {
    const db = await getResearchDb();
    const proposals = await db.select().from(contentProposals).where(and(eq(contentProposals.status, "accepted"), ...(targetId ? [eq(contentProposals.targetId, targetId)] : []))).orderBy(desc(contentProposals.publicAt)).limit(100);
    const people = await getPublicResearchersByAccountIds(proposals.map((item) => item.accountId));
    return proposals.flatMap((proposal) => {
      const researcher = people.get(proposal.accountId);
      return researcher ? [{ ...proposal, secondaryDomains: parseList(proposal.secondaryDomainsJson), researcher }] : [];
    });
  } catch {
    return [];
  }
}

export async function getPublicProposal(idValue: unknown) {
  try {
    const id = cleanText(idValue, 100);
    const db = await getResearchDb();
    const proposal = (await db.select().from(contentProposals).where(and(eq(contentProposals.id, id), eq(contentProposals.status, "accepted"))).limit(1))[0];
    if (!proposal) return null;
    const [researcher, sources, events] = await Promise.all([
      getPublicResearchersByAccountIds([proposal.accountId]).then((people) => people.get(proposal.accountId) ?? null),
      db.select().from(proposalSources).where(eq(proposalSources.proposalId, proposal.id)).orderBy(asc(proposalSources.position)),
      db.select().from(proposalEvents).where(and(eq(proposalEvents.proposalId, proposal.id), eq(proposalEvents.visibility, "public"))).orderBy(asc(proposalEvents.createdAt)),
    ]);
    return researcher ? { ...proposal, secondaryDomains: parseList(proposal.secondaryDomainsJson), researcher, sources, events } : null;
  } catch {
    return null;
  }
}

export async function withdrawProposal(account: ResearcherSession, idValue: unknown) {
  const id = cleanText(idValue, 100);
  const db = await getResearchDb();
  const proposal = (await db.select().from(contentProposals).where(and(eq(contentProposals.id, id), eq(contentProposals.accountId, account.accountId))).limit(1))[0];
  if (!proposal || !["pending", "needs_revision"].includes(proposal.status)) throw new Error("Only pending proposals can be withdrawn.");
  const now = new Date().toISOString();
  await db.batch([
    db.update(contentProposals).set({ status: "withdrawn", publicAt: null, updatedAt: now }).where(eq(contentProposals.id, id)),
    db.insert(proposalEvents).values({ id: crypto.randomUUID(), proposalId: id, actorAccountId: account.accountId, kind: "withdrawn", visibility: "private" }),
  ]);
  await recordAudit(account.accountId, "proposal.withdrawn", "proposal", id, {});
  return { id, status: "withdrawn" };
}

export async function moderateProposal(account: ResearcherSession, input: { id: unknown; status: unknown; note?: unknown; publishedCommit?: unknown }) {
  if (!isModeratorRole(account.role)) throw new Error("Moderator access is required.");
  const id = cleanText(input.id, 100);
  const status = cleanText(input.status, 40);
  const note = cleanText(input.note, 4000);
  if (!["accepted", "needs_revision", "declined", "withdrawn", "published"].includes(status)) throw new Error("Choose a valid proposal decision.");
  const db = await getResearchDb();
  const proposal = (await db.select().from(contentProposals).where(eq(contentProposals.id, id)).limit(1))[0];
  if (!proposal) throw new Error("Proposal not found.");
  const now = new Date().toISOString();
  if (status === "accepted") {
    await db.batch([
      db.update(contentProposals).set({ status, moderatorNote: note || null, publicAt: now, updatedAt: now }).where(eq(contentProposals.id, id)),
      db.insert(proposalEvents).values({ id: crypto.randomUUID(), proposalId: id, actorAccountId: account.accountId, kind: "accepted", visibility: "public", metadataJson: JSON.stringify({ note }) }),
      db.insert(editorialChangePackets).values({ id: crypto.randomUUID(), submissionId: `proposal:${id}`, payloadJson: JSON.stringify({ kind: "content_proposal", proposalId: id, proposalType: proposal.proposalType, targetId: proposal.targetId, title: proposal.title, primaryAnchor: proposal.primaryAnchor, secondaryDomains: parseList(proposal.secondaryDomainsJson), rationale: proposal.rationale, proposedContent: proposal.proposedContent, mechanismConnection: proposal.mechanismConnection, causalLimitations: proposal.causalLimitations, conflictDisclosure: proposal.conflictDisclosure, editorialNote: note }) }).onConflictDoNothing(),
    ]);
  } else if (status === "published") {
    const commit = cleanText(input.publishedCommit, 80);
    if (proposal.status !== "accepted") throw new Error("Only an accepted proposal can be linked to publication.");
    if (!/^[a-f0-9]{40}$/i.test(commit)) throw new Error("Add the complete upstream publication commit.");
    const publishedPage = proposal.targetId ? getWikiPage(proposal.targetId) : null;
    const publishedText = [publishedPage?.overview || "", ...(publishedPage?.sections || []).map(section => section.body)].join("\n");
    if (commit !== publicationManifest.source.commit || !publishedPage || !publishedText.includes(proposal.proposedContent)) throw new Error("The current deployed corpus must contain the proposed content at its target article before publication credit is recorded.");
    await db.batch([
      db.update(contentProposals).set({ status: "accepted", publishedCommit: commit, updatedAt: now }).where(eq(contentProposals.id, id)),
      db.insert(proposalEvents).values({ id: crypto.randomUUID(), proposalId: id, actorAccountId: account.accountId, kind: "published", visibility: "public", metadataJson: JSON.stringify({ commit }) }),
    ]);
  } else {
    await db.batch([
      db.update(contentProposals).set({ status, moderatorNote: note || null, publicAt: null, updatedAt: now }).where(eq(contentProposals.id, id)),
      db.insert(proposalEvents).values({ id: crypto.randomUUID(), proposalId: id, actorAccountId: account.accountId, kind: status, visibility: "private", metadataJson: JSON.stringify({ note }) }),
    ]);
  }
  await createInAppNotification({ accountId: proposal.accountId, actorAccountId: account.accountId, kind: "proposal_decision", targetType: "proposal", targetId: id, title: `Proposal ${status.replaceAll("_", " ")}`, body: note, href: "/researcher/proposals", dedupeKey: `proposal:${id}:${status}:${now}`, emailMode: "immediate" });
  await recordAudit(account.accountId, "proposal.moderated", "proposal", id, { status, note, publishedCommit: cleanText(input.publishedCommit, 80) || null });
  await recalculateRecognition(proposal.accountId);
  return { id, status };
}

export async function afterModerationDecision(account: ResearcherSession, input: { kind: string; id: string; status: string; note?: unknown }) {
  const db = await getResearchDb();
  let recipientId = "";
  let href = "/researcher/dashboard";
  let publishedDiscussion: { post: typeof discussionPosts.$inferSelect; thread: typeof discussionThreads.$inferSelect } | null = null;
  if (input.kind === "claim") {
    const item = (await db.select().from(sourceClaims).where(eq(sourceClaims.id, input.id)).limit(1))[0];
    recipientId = item?.accountId ?? "";
    href = item ? `/source/${item.sourceId}/claim` : href;
  } else if (input.kind === "author_review") {
    const item = (await db.select().from(authorReviews).where(eq(authorReviews.id, input.id)).limit(1))[0];
    recipientId = item?.accountId ?? "";
    href = item ? `/source/${item.sourceId}#author-context` : href;
  } else if (input.kind === "work_submission") {
    const item = (await db.select().from(workSubmissions).where(eq(workSubmissions.id, input.id)).limit(1))[0];
    recipientId = item?.accountId ?? "";
    href = "/researcher/dashboard";
  } else if (input.kind === "discussion_thread") {
    const item = (await db.select().from(discussionThreads).where(eq(discussionThreads.id, input.id)).limit(1))[0];
    recipientId = item?.createdByAccountId ?? "";
    href = item ? item.targetType === "proposal" ? `/proposals/${item.targetId}#discussion` : `/${item.targetType}/${item.targetId}#discussion` : href;
    if (item && input.status === "published") {
      const firstPublished = (await db.select().from(discussionPosts).where(and(eq(discussionPosts.threadId, item.id), eq(discussionPosts.status, "published"))).orderBy(asc(discussionPosts.createdAt)).limit(1))[0];
      if (firstPublished) publishedDiscussion = { post: firstPublished, thread: item };
    }
  } else if (input.kind === "discussion_post") {
    const item = (await db.select().from(discussionPosts).where(eq(discussionPosts.id, input.id)).limit(1))[0];
    recipientId = item?.accountId ?? "";
    if (item) {
      const thread = (await db.select().from(discussionThreads).where(eq(discussionThreads.id, item.threadId)).limit(1))[0];
      if (thread) href = thread.targetType === "proposal" ? `/proposals/${thread.targetId}#discussion` : `/${thread.targetType}/${thread.targetId}#discussion`;
      if (thread?.status === "published" && input.status === "published") publishedDiscussion = { post: item, thread };
    }
  }
  if (recipientId) await createInAppNotification({ accountId: recipientId, actorAccountId: account.accountId, kind: `${input.kind}_decision`, targetType: input.kind, targetId: input.id, title: `${input.kind.replaceAll("_", " ")} ${input.status.replaceAll("_", " ")}`, body: cleanText(input.note, 1000), href, dedupeKey: `moderation:${input.kind}:${input.id}:${input.status}`, emailMode: "immediate" });
  if (publishedDiscussion) {
    const author = (await getPublicResearchersByAccountIds([publishedDiscussion.post.accountId])).get(publishedDiscussion.post.accountId);
    if (author) await notifyDiscussionActivity({ actor: { accountId: author.accountId, displayName: author.name }, threadId: publishedDiscussion.thread.id, targetType: publishedDiscussion.thread.targetType as "article" | "source" | "proposal", targetId: publishedDiscussion.thread.targetId, title: publishedDiscussion.thread.title, body: publishedDiscussion.post.body, parentPostId: publishedDiscussion.post.parentPostId, postId: publishedDiscussion.post.id });
  }
  if ((input.kind === "author_review" || input.kind === "work_submission") && input.status === "accepted" && recipientId) await recalculateRecognition(recipientId);
}

export async function moderateMessageReport(account: ResearcherSession, input: { id: unknown; status: unknown; note?: unknown }) {
  if (!isModeratorRole(account.role)) throw new Error("Moderator access is required.");
  const id = cleanText(input.id, 100);
  const status = cleanText(input.status, 20);
  if (!["resolved", "dismissed"].includes(status)) throw new Error("Choose resolved or dismissed.");
  const db = await getResearchDb();
  const report = (await db.select().from(messageReports).where(eq(messageReports.id, id)).limit(1))[0];
  if (!report) throw new Error("Message report not found.");
  await db.update(messageReports).set({ status }).where(eq(messageReports.id, id));
  if (status === "resolved") await db.update(researcherMessages).set({ status: "hidden" }).where(eq(researcherMessages.id, report.messageId));
  await recordAudit(account.accountId, "message.report_moderated", "message_report", id, { status, note: cleanText(input.note, 2000) });
  return { id, status };
}

export async function setMessagingPreference(account: ResearcherSession, enabled: boolean) {
  assertVerified(account);
  const db = await getResearchDb();
  await db.update(researcherProfiles).set({ messagingEnabled: enabled, updatedAt: new Date().toISOString() }).where(eq(researcherProfiles.accountId, account.accountId));
  await recordAudit(account.accountId, "messaging.preference_updated", "account", account.accountId, { enabled });
  return { enabled };
}

async function messagingBlocked(accountA: string, accountB: string) {
  const db = await getResearchDb();
  return Boolean((await db.select({ id: researcherBlocks.id }).from(researcherBlocks).where(or(and(eq(researcherBlocks.blockerAccountId, accountA), eq(researcherBlocks.blockedAccountId, accountB)), and(eq(researcherBlocks.blockerAccountId, accountB), eq(researcherBlocks.blockedAccountId, accountA)))).limit(1))[0]);
}

export async function createContactRequest(account: ResearcherSession, recipientOrcidValue: unknown, subjectValue: unknown) {
  assertVerified(account);
  await enforceV2RateLimit(account.accountId, "message.contact", 10, 1440);
  const recipientOrcid = cleanText(recipientOrcidValue, 32);
  const subject = cleanText(subjectValue, 180);
  if (!subject) throw new Error("Add a short reason for contacting this researcher.");
  const db = await getResearchDb();
  const recipient = (await db.select().from(researcherProfiles).where(eq(researcherProfiles.orcid, recipientOrcid)).limit(1))[0];
  if (!recipient || recipient.accountId === account.accountId) throw new Error("Choose another WikiBiome researcher.");
  if (!recipient.messagingEnabled) throw new Error("This researcher is not accepting contact requests.");
  if (await messagingBlocked(account.accountId, recipient.accountId)) throw new Error("Messaging is unavailable between these accounts.");
  const key = participantKey(account.accountId, recipient.accountId);
  const existing = (await db.select().from(messageThreads).where(eq(messageThreads.participantKey, key)).limit(1))[0];
  if (existing) return existing;
  const thread = { id: crypto.randomUUID(), participantKey: key, initiatorAccountId: account.accountId, recipientAccountId: recipient.accountId, subject };
  await db.insert(messageThreads).values(thread);
  await createInAppNotification({ accountId: recipient.accountId, actorAccountId: account.accountId, kind: "contact_request", targetType: "message_thread", targetId: thread.id, title: "New researcher contact request", body: subject, href: "/researcher/messages", dedupeKey: `contact:${thread.id}`, emailMode: "immediate" });
  await recordAudit(account.accountId, "message.contact_requested", "message_thread", thread.id, { recipientAccountId: recipient.accountId });
  return { ...thread, status: "pending" };
}

export async function respondToContactRequest(account: ResearcherSession, threadIdValue: unknown, decisionValue: unknown) {
  assertVerified(account);
  const threadId = cleanText(threadIdValue, 100);
  const decision = cleanText(decisionValue, 20);
  if (!["accept", "decline"].includes(decision)) throw new Error("Choose accept or decline.");
  const db = await getResearchDb();
  const thread = (await db.select().from(messageThreads).where(and(eq(messageThreads.id, threadId), eq(messageThreads.recipientAccountId, account.accountId))).limit(1))[0];
  if (!thread || thread.status !== "pending") throw new Error("Pending contact request not found.");
  const status = decision === "accept" ? "accepted" : "declined";
  const now = new Date().toISOString();
  await db.update(messageThreads).set({ status, acceptedAt: status === "accepted" ? now : null, updatedAt: now }).where(eq(messageThreads.id, threadId));
  await createInAppNotification({ accountId: thread.initiatorAccountId, actorAccountId: account.accountId, kind: "contact_decision", targetType: "message_thread", targetId: threadId, title: `Contact request ${status}`, body: thread.subject, href: "/researcher/messages", dedupeKey: `contact:${threadId}:${status}`, emailMode: "immediate" });
  await recordAudit(account.accountId, "message.contact_decided", "message_thread", threadId, { status });
  return { id: threadId, status };
}

export async function sendResearcherMessage(account: ResearcherSession, threadIdValue: unknown, bodyValue: unknown) {
  assertVerified(account);
  const threadId = cleanText(threadIdValue, 100);
  const body = [...cleanText(bodyValue, 8000)].filter((character) => {
    const code = character.codePointAt(0) ?? 0;
    return code === 9 || code === 10 || code === 13 || (code >= 32 && code !== 127);
  }).join("");
  if (!body) throw new Error("Write a message before sending.");
  const db = await getResearchDb();
  const thread = (await db.select().from(messageThreads).where(and(eq(messageThreads.id, threadId), or(eq(messageThreads.initiatorAccountId, account.accountId), eq(messageThreads.recipientAccountId, account.accountId)))).limit(1))[0];
  if (!thread || thread.status !== "accepted") throw new Error("Both researchers must accept contact before messages can be sent.");
  if (await messagingBlocked(thread.initiatorAccountId, thread.recipientAccountId)) throw new Error("Messaging is unavailable between these accounts.");
  const since = new Date(Date.now() - 60 * 60_000).toISOString();
  const [{ value }] = await db.select({ value: count() }).from(researcherMessages).where(and(eq(researcherMessages.senderAccountId, account.accountId), gt(researcherMessages.createdAt, since)));
  if (Number(value) >= 30) throw new Error("You have reached the messaging limit for this hour.");
  const message = { id: crypto.randomUUID(), threadId, senderAccountId: account.accountId, body };
  await db.batch([db.insert(researcherMessages).values(message), db.update(messageThreads).set({ updatedAt: new Date().toISOString() }).where(eq(messageThreads.id, threadId))]);
  const recipient = thread.initiatorAccountId === account.accountId ? thread.recipientAccountId : thread.initiatorAccountId;
  await createInAppNotification({ accountId: recipient, actorAccountId: account.accountId, kind: "private_message", targetType: "message_thread", targetId: threadId, title: `Message from ${account.displayName}`, body: body.slice(0, 180), href: `/researcher/messages?thread=${threadId}`, dedupeKey: `message:${message.id}`, emailMode: "immediate" });
  await recordAudit(account.accountId, "message.sent", "message_thread", threadId, { messageId: message.id });
  return message;
}

export async function listMessageThreads(accountId: string) {
  const db = await getResearchDb();
  const threads = await db.select().from(messageThreads).where(or(eq(messageThreads.initiatorAccountId, accountId), eq(messageThreads.recipientAccountId, accountId))).orderBy(desc(messageThreads.updatedAt)).limit(100);
  const messages = threads.length ? await db.select().from(researcherMessages).where(and(inArray(researcherMessages.threadId, threads.map((thread) => thread.id)), eq(researcherMessages.status, "visible"))).orderBy(asc(researcherMessages.createdAt)).limit(1000) : [];
  const accountIds = [...new Set(threads.flatMap((thread) => [thread.initiatorAccountId, thread.recipientAccountId]))];
  const people = await getPublicResearchersByAccountIds(accountIds);
  return threads.map((thread) => ({ ...thread, initiator: people.get(thread.initiatorAccountId) ?? null, recipient: people.get(thread.recipientAccountId) ?? null, messages: messages.filter((message) => message.threadId === thread.id) }));
}

export async function reportResearcherMessage(account: ResearcherSession, messageIdValue: unknown, reasonValue: unknown) {
  assertVerified(account);
  await enforceV2RateLimit(account.accountId, "message.report", 10, 1440);
  const messageId = cleanText(messageIdValue, 100);
  const reason = cleanText(reasonValue, 3000);
  if (!reason) throw new Error("Explain the safety, identity, or conduct concern.");
  const db = await getResearchDb();
  const message = (await db.select().from(researcherMessages).where(eq(researcherMessages.id, messageId)).limit(1))[0];
  if (!message) throw new Error("Message not found.");
  const thread = (await db.select().from(messageThreads).where(and(eq(messageThreads.id, message.threadId), or(eq(messageThreads.initiatorAccountId, account.accountId), eq(messageThreads.recipientAccountId, account.accountId)))).limit(1))[0];
  if (!thread) throw new Error("You cannot report a message outside your conversations.");
  await db.insert(messageReports).values({ id: crypto.randomUUID(), messageId, accountId: account.accountId, reason }).onConflictDoNothing();
  await recordAudit(account.accountId, "message.reported", "message", messageId, { threadId: thread.id });
  return { reported: true };
}

export async function getRoundtableInterest(accountId: string) {
  const db = await getResearchDb();
  const record = (await db.select().from(roundtableInterests).where(eq(roundtableInterests.accountId, accountId)).limit(1))[0];
  if (!record) return null;
  const eventTypes = parseList(record.eventTypesJson);
  return { ...record, eventTypes: eventTypes.length ? eventTypes : ["roundtable"], roles: parseList(record.rolesJson), tracks: parseList(record.tracksJson) };
}

export async function saveRoundtableInterest(account: ResearcherSession, input: Record<string, unknown>) {
  assertVerified(account);
  const eventTypes = textList(input.eventTypes, 3, 40).filter((value) => ["roundtable", "conference", "workshop"].includes(value));
  const roles = textList(input.roles, 4, 40).filter((value) => ["attending", "speaking", "moderating", "organizing"].includes(value));
  const tracks = textList(input.tracks, 12, 100);
  const formatPreference = cleanText(input.formatPreference, 20);
  if (!eventTypes.length) throw new Error("Choose at least one kind of researcher event.");
  if (!roles.length) throw new Error("Choose at least one way you would like to participate.");
  if (!tracks.length) throw new Error("Choose at least one scientific track.");
  if (!["virtual", "in_person", "either"].includes(formatPreference)) throw new Error("Choose a valid meeting format.");
  const now = new Date().toISOString();
  const updatesConsent = input.updatesConsent === true;
  const earlyInviteConsent = input.earlyInviteConsent === true;
  const values = { eventTypesJson: JSON.stringify(eventTypes), rolesJson: JSON.stringify(roles), tracksJson: JSON.stringify(tracks), formatPreference, location: cleanText(input.location, 240), availability: cleanText(input.availability, 1000), proposedQuestion: cleanText(input.proposedQuestion, 4000), updatesConsent, consentedAt: updatesConsent ? now : null, earlyInviteConsent, earlyInviteConsentedAt: earlyInviteConsent ? now : null, withdrawnAt: null, status: "interested", updatedAt: now };
  const db = await getResearchDb();
  await db.insert(roundtableInterests).values({ accountId: account.accountId, ...values }).onConflictDoUpdate({ target: roundtableInterests.accountId, set: values });
  await recordAudit(account.accountId, "roundtable.interest_saved", "account", account.accountId, { eventTypes, roles, tracks, updatesConsent, earlyInviteConsent });
  return { ...values, eventTypes, roles, tracks };
}

export async function withdrawRoundtableInterest(account: ResearcherSession) {
  const now = new Date().toISOString();
  const db = await getResearchDb();
  await db.update(roundtableInterests).set({ status: "withdrawn", updatesConsent: false, earlyInviteConsent: false, withdrawnAt: now, updatedAt: now }).where(eq(roundtableInterests.accountId, account.accountId));
  await recordAudit(account.accountId, "roundtable.interest_withdrawn", "account", account.accountId, {});
  return { status: "withdrawn" };
}

export async function recalculateRecognition(accountId: string) {
  const db = await getResearchDb();
  const [reviews, publications, proposals] = await Promise.all([
    db.select().from(authorReviews).where(and(eq(authorReviews.accountId, accountId), eq(authorReviews.status, "accepted"))),
    db.select().from(paperPublications).where(eq(paperPublications.accountId, accountId)),
    db.select().from(contentProposals).where(and(eq(contentProposals.accountId, accountId), eq(contentProposals.status, "accepted"))),
  ]);
  // Accepted author context is already publicly visible. Papers require a verified
  // deployment receipt; legacy metadata acceptance is not publication evidence.
  const contributions = [
    ...reviews.map(item => ({ accepted: true, type: "author_context", id: item.id, recordId: item.sourceId })),
    ...publications.map(item => ({ accepted: true, type: "paper_publication", id: item.sourceId, recordId: item.sourceId })),
    ...proposals.filter(item => Boolean(item.publishedCommit)).map(item => ({ accepted: true, type: "proposal", id: item.id, recordId: item.targetId || item.id })),
  ];
  const milestones = recognitionMilestones(contributions);
  const unearned = [1, 2, 3].filter(level => !milestones.includes(level));
  if (unearned.length) await db.update(recognitionEvents).set({ status: "revoked", reason: "The account no longer meets this published-contribution milestone." }).where(and(eq(recognitionEvents.accountId, accountId), eq(recognitionEvents.policyVersion, "publication_v2"), inArray(recognitionEvents.level, unearned)));
  for (const level of milestones) {
    const trigger = contributions[level === 1 ? 0 : level === 2 ? 2 : 4];
    const reason = level === 1 ? "First published scientific contribution" : level === 2 ? "Three published contributions across at least two records" : "Five published contributions spanning at least two contribution types";
    await db.insert(recognitionEvents).values({ id: crypto.randomUUID(), accountId, level, kind: "automatic_quality_milestone", policyVersion: "publication_v2", sourceType: trigger?.type ?? "contribution", sourceId: trigger?.id ?? accountId, reason }).onConflictDoUpdate({ target: [recognitionEvents.accountId, recognitionEvents.level], set: { status: "active", reason, policyVersion: "publication_v2", sourceType: trigger?.type ?? "contribution", sourceId: trigger?.id ?? accountId }, setWhere: eq(recognitionEvents.policyVersion, "publication_v2") });
  }
  return milestones;
}

export async function awardHumanRecognition(account: ResearcherSession, input: { accountId: unknown; level: unknown; sourceType?: unknown; sourceId?: unknown; reason?: unknown }) {
  if (!isModeratorRole(account.role)) throw new Error("Moderator access is required.");
  const targetAccountId = cleanText(input.accountId, 100);
  const level = Number(input.level);
  if (![4, 5].includes(level)) throw new Error("Human review is required only for four- and five-star recognition.");
  const reason = cleanText(input.reason, 2000);
  if (!reason) throw new Error("Record the quality and conduct basis for this recognition.");
  const db = await getResearchDb();
  const [target, profile, prerequisite] = await Promise.all([
    db.select().from(accounts).where(eq(accounts.id, targetAccountId)).limit(1).then((rows) => rows[0] ?? null),
    db.select().from(researcherProfiles).where(eq(researcherProfiles.accountId, targetAccountId)).limit(1).then((rows) => rows[0] ?? null),
    db.select().from(recognitionEvents).where(and(eq(recognitionEvents.accountId, targetAccountId), eq(recognitionEvents.level, level - 1), eq(recognitionEvents.status, "active"))).limit(1).then((rows) => rows[0] ?? null),
  ]);
  if (!target || !profile) throw new Error("Researcher account not found.");
  if (!prerequisite) throw new Error(`Active ${level - 1}-star recognition is required first.`);
  await db.insert(recognitionEvents).values({ id: crypto.randomUUID(), accountId: targetAccountId, level, kind: level === 4 ? "moderator_cross_omics_bridge" : "topic_steward_review", sourceType: cleanText(input.sourceType, 40) || "account", sourceId: cleanText(input.sourceId, 180) || targetAccountId, reason, awardedByAccountId: account.accountId }).onConflictDoUpdate({ target: [recognitionEvents.accountId, recognitionEvents.level], set: { status: "active", reason, awardedByAccountId: account.accountId } });
  if (level === 5 && ["researcher", "trusted_contributor", "topic_steward"].includes(target.role)) await db.update(accounts).set({ role: "topic_steward", updatedAt: new Date().toISOString() }).where(eq(accounts.id, targetAccountId));
  await recordAudit(account.accountId, "recognition.awarded", "account", targetAccountId, { level, reason });
  return { accountId: targetAccountId, level };
}

export async function revokeRecognition(account: ResearcherSession, input: { accountId: unknown; level: unknown; reason?: unknown }) {
  if (!isModeratorRole(account.role)) throw new Error("Moderator access is required.");
  const targetAccountId = cleanText(input.accountId, 100);
  const level = Number(input.level);
  const reason = cleanText(input.reason, 2000);
  if (!targetAccountId || ![1, 2, 3, 4, 5].includes(level) || !reason) throw new Error("Account, star level, and an appeal-visible reason are required.");
  const db = await getResearchDb();
  await db.update(recognitionEvents).set({ status: "revoked", reason }).where(and(eq(recognitionEvents.accountId, targetAccountId), eq(recognitionEvents.level, level)));
  if (level === 5) {
    const target = (await db.select().from(accounts).where(eq(accounts.id, targetAccountId)).limit(1))[0];
    if (target?.role === "topic_steward") {
      const published = await db.select({ id: discussionPosts.id }).from(discussionPosts).where(and(eq(discussionPosts.accountId, targetAccountId), eq(discussionPosts.status, "published"))).limit(3);
      await db.update(accounts).set({ role: published.length >= 3 ? "trusted_contributor" : "researcher", updatedAt: new Date().toISOString() }).where(eq(accounts.id, targetAccountId));
    }
  }
  await recordAudit(account.accountId, "recognition.revoked", "account", targetAccountId, { level, reason });
  return { accountId: targetAccountId, level, status: "revoked" };
}

export async function listRoundtableShortlist(account: ResearcherSession) {
  if (!isModeratorRole(account.role)) throw new Error("Moderator access is required.");
  const db = await getResearchDb();
  const [interests, recognition] = await Promise.all([
    db.select().from(roundtableInterests).where(eq(roundtableInterests.status, "interested")),
    db.select().from(recognitionEvents).where(eq(recognitionEvents.status, "active")),
  ]);
  const highest = new Map<string, number>();
  for (const event of recognition) highest.set(event.accountId, Math.max(highest.get(event.accountId) ?? 0, event.level));
  const eligible = interests.filter((item) => item.earlyInviteConsent && (highest.get(item.accountId) ?? 0) >= 4);
  const people = await getPublicResearchersByAccountIds(eligible.map((item) => item.accountId));
  return eligible.flatMap((interest) => {
    const researcher = people.get(interest.accountId);
    return researcher ? [{ ...interest, eventTypes: parseList(interest.eventTypesJson), roles: parseList(interest.rolesJson), tracks: parseList(interest.tracksJson), stars: highest.get(interest.accountId) ?? 0, researcher }] : [];
  });
}

export async function listPublicRecognition(accountId: string) {
  try {
    const db = await getResearchDb();
    return await db.select().from(recognitionEvents).where(and(eq(recognitionEvents.accountId, accountId), eq(recognitionEvents.status, "active"))).orderBy(asc(recognitionEvents.level));
  } catch {
    return [];
  }
}

export async function getCollaborationSummary(targetType: "article" | "source", targetId: string, viewerAccountId?: string) {
  try {
    const db = await getResearchDb();
    const [threads, posts, proposals, authorContext, following, unread] = await Promise.all([
      db.select({ value: count() }).from(discussionThreads).where(and(eq(discussionThreads.targetType, targetType), eq(discussionThreads.targetId, targetId), eq(discussionThreads.status, "published"))).then((rows) => Number(rows[0]?.value ?? 0)),
      db.select({ value: count() }).from(discussionPosts).innerJoin(discussionThreads, eq(discussionPosts.threadId, discussionThreads.id)).where(and(eq(discussionThreads.targetType, targetType), eq(discussionThreads.targetId, targetId), eq(discussionThreads.status, "published"), eq(discussionPosts.status, "published"))).then((rows) => Number(rows[0]?.value ?? 0)),
      targetType === "article" ? db.select().from(contentProposals).where(and(eq(contentProposals.targetId, targetId), eq(contentProposals.status, "accepted"))).then((rows) => rows.filter(isPublishedProposalChange).length) : Promise.resolve(0),
      targetType === "source" ? db.select().from(authorReviews).where(and(eq(authorReviews.sourceId, targetId), eq(authorReviews.status, "accepted"))).then((rows) => rows.filter(isPublishedAuthorContext).length) : Promise.resolve(0),
      isFollowing(viewerAccountId, targetType, targetId),
      viewerAccountId ? db.select({ value: count() }).from(researcherNotifications).where(and(eq(researcherNotifications.accountId, viewerAccountId), eq(researcherNotifications.targetType, targetType), eq(researcherNotifications.targetId, targetId), isNull(researcherNotifications.readAt))).then((rows) => Number(rows[0]?.value ?? 0)) : Promise.resolve(0),
    ]);
    return { threads, posts, acceptedChanges: proposals + authorContext, following, unread };
  } catch {
    return { threads: 0, posts: 0, acceptedChanges: 0, following: false, unread: 0 };
  }
}

export async function listPageActivity(targetType: "article" | "source", targetId: string) {
  try {
    const db = await getResearchDb();
    const [proposals, reviews] = await Promise.all([
      targetType === "article" ? db.select().from(contentProposals).where(and(eq(contentProposals.targetId, targetId), eq(contentProposals.status, "accepted"))).orderBy(desc(contentProposals.updatedAt)).limit(100) : Promise.resolve([]),
      targetType === "source" ? db.select().from(authorReviews).where(and(eq(authorReviews.sourceId, targetId), eq(authorReviews.status, "accepted"))).orderBy(desc(authorReviews.updatedAt)).limit(100) : Promise.resolve([]),
    ]);
    const events = [
      ...proposals.filter(isPublishedProposalChange).map((item) => ({ id: `proposal:${item.id}`, kind: "published page change", accountId: item.accountId, title: item.title, detail: `${item.proposedContent.slice(0, 180)} · Published in ${item.publishedCommit?.slice(0, 10)}`, createdAt: item.updatedAt, href: `/proposals/${item.id}`, publishedCommit: item.publishedCommit })),
      ...reviews.filter(isPublishedAuthorContext).map((item) => ({ id: `author:${item.id}`, kind: "published author context", accountId: item.accountId, title: `Published author context: ${item.context.slice(0, 140)}${item.context.length > 140 ? "…" : ""}`, detail: item.context.slice(0, 180), createdAt: item.updatedAt, href: `#author-context`, publishedCommit: null })),
    ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const people = await getPublicResearchersByAccountIds(events.map((event) => event.accountId));
    return events.map((event) => ({ ...event, researcher: people.get(event.accountId) ?? null }));
  } catch {
    return [];
  }
}

export { maskEmail, proposalTypes };
