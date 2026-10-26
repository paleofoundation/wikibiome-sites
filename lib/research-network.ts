import { researcherDisplayName } from "@/lib/orcid-display.mjs";
import { normalizeResearcherAssociations, readResearcherAssociations, type ResearcherAssociation } from "@/lib/researcher-associations.mjs";
import { cookies } from "next/headers";
import { and, asc, count, desc, eq, gt, inArray, isNull, lt, or } from "drizzle-orm";
import {
  accountIdentities,
  accounts,
  accountSessions,
  auditEvents,
  authorReviews,
  contentProposals,
  contributions,
  discussionPosts,
  discussionPostRevisions,
  discussionReports,
  discussionThreads,
  emailVerificationTokens,
  editorialChangePackets,
  institutionBatches,
  institutionMemberships,
  institutions,
  messageReports,
  researcherMessages,
  notificationOutbox,
  oauthStates,
  outreachContacts,
  rateLimitEvents,
  researcherEmails,
  researcherFollows,
  researcherBlocks,
  researcherProfiles,
  recognitionEvents,
  sourceClaims,
  submissionFiles,
  suppressionList,
  workSubmissions,
} from "@/db/schema";
import { getSource, getWikiPage, normalizeDoi } from "@/lib/wikibiome";
import { lookupRorOrganization } from "@/lib/research-metadata";
import { buildResearchImpact, normalizeOrganizationSlug } from "@/lib/researcher-discovery";
import { discussionPublishingDecision, institutionEmailMatchesAuthoritativeDomains } from "@/lib/research-trust-policy.mjs";

export const researcherRoles = ["researcher", "trusted_contributor", "topic_steward", "moderator", "institution_admin", "site_admin"] as const;
export const discussionCategories = ["question", "interpretation", "methodology", "new_evidence", "correction"] as const;
export const submissionStatuses = ["draft", "validating", "pending_review", "needs_revision", "accepted", "declined", "withdrawn"] as const;
export const claimStatuses = ["pending", "verified", "rejected", "revoked"] as const;

export type ResearcherRole = (typeof researcherRoles)[number];
export type DiscussionCategory = (typeof discussionCategories)[number];

export type ResearcherSession = {
  accountId: string;
  displayName: string;
  role: ResearcherRole;
  orcid: string;
  biography: string;
  affiliations: string[];
  associations: ResearcherAssociation[];
  expertiseSelf: string[];
  expertiseInferred: string[];
  photoAvailable: boolean;
  photoAlt: string;
  photoUpdatedAt: string | null;
  messagingEnabled: boolean;
  email: string | null;
  emailVerified: boolean;
  preferences: {
    researchNotifications: boolean;
    communityDigest: boolean;
    fundraising: boolean;
  };
};

export type PublicResearcher = {
  accountId: string;
  orcid: string;
  name: string;
  biography: string;
  affiliations: string[];
  associations: ResearcherAssociation[];
  verifiedAffiliations: Array<{ name: string; identifier: string; ror: string | null; identityStatus: string; websiteUrl: string | null }>;
  expertiseSelf: string[];
  expertiseInferred: string[];
  photoAvailable: boolean;
  photoAlt: string;
  photoUpdatedAt: string | null;
  role: ResearcherRole;
};

export type ResearchNetworkCapabilities = {
  manuscriptUploads: boolean;
  outreach: boolean;
};

const SESSION_COOKIE = "wikibiome_researcher_session";
const SESSION_DAYS = 30;

async function getResearchDb() {
  const database = await import("@/db");
  return database.getDb();
}

async function getRuntimeEnv() {
  try {
    const runtime = await import("cloudflare:workers");
    return runtime.env as unknown as Record<string, string | undefined>;
  } catch {
    return process.env as Record<string, string | undefined>;
  }
}

export async function getResearchNetworkCapabilities(): Promise<ResearchNetworkCapabilities> {
  const runtime = await getRuntimeEnv();
  return {
    manuscriptUploads: runtime.WIKIBIOME_MANUSCRIPT_UPLOADS_ENABLED === "1" && Boolean(runtime.WIKIBIOME_SCAN_WEBHOOK_SECRET),
    outreach: runtime.WIKIBIOME_OUTREACH_ENABLED === "1" && Boolean(runtime.RESEND_API_KEY && runtime.WIKIBIOME_EMAIL_FROM && runtime.WIKIBIOME_UNSUBSCRIBE_SECRET),
  };
}

export function cleanText(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

export function cleanEmail(value: unknown) {
  const email = cleanText(value, 320).toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

export function cleanUrl(value: unknown) {
  const source = cleanText(value, 1000);
  if (!source) return "";
  try {
    const url = new URL(source);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

export function normalizeOrcid(value: unknown) {
  const match = cleanText(value, 64).match(/(?:orcid\.org\/)?(\d{4}-\d{4}-\d{4}-\d{3}[\dX])/i);
  return match?.[1]?.toUpperCase() ?? "";
}

export function safeReturnTo(value: unknown, fallback = "/researcher/dashboard") {
  const path = cleanText(value, 500);
  if (!path.startsWith("/") || path.startsWith("//")) return fallback;
  try {
    const url = new URL(path, "https://www.wikibiome.com");
    return url.origin === "https://www.wikibiome.com" ? `${url.pathname}${url.search}${url.hash}` : fallback;
  } catch {
    return fallback;
  }
}

export function assertSameOriginRequest(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (origin && new URL(origin).origin !== requestUrl.origin) throw new Error("Cross-site requests are not accepted.");
  if (fetchSite === "cross-site") throw new Error("Cross-site requests are not accepted.");
}

export async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return base64Url(new Uint8Array(digest));
}

export function randomToken(bytes = 32) {
  const data = new Uint8Array(bytes);
  crypto.getRandomValues(data);
  return base64Url(data);
}

function base64Url(data: Uint8Array) {
  let binary = "";
  for (const byte of data) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/g, "");
}

export async function getResearcherSession(): Promise<ResearcherSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    return getResearcherSessionFromToken(token);
  } catch {
    return null;
  }
}

export async function getResearcherSessionFromRequest(request: Request) {
  const token = parseCookie(request.headers.get("cookie"), SESSION_COOKIE);
  if (!token) return null;
  try {
    return getResearcherSessionFromToken(token);
  } catch {
    return null;
  }
}

export async function revokeResearcherSessionFromRequest(request: Request) {
  const token = parseCookie(request.headers.get("cookie"), SESSION_COOKIE);
  if (!token) return false;
  try {
    await (await getResearchDb()).delete(accountSessions).where(eq(accountSessions.tokenHash, await sha256(token)));
    return true;
  } catch {
    return false;
  }
}

async function getResearcherSessionFromToken(token: string): Promise<ResearcherSession | null> {
  const tokenHash = await sha256(token);
  const now = new Date().toISOString();
  const db = (await getResearchDb());
  const session = (await db.select().from(accountSessions).where(and(eq(accountSessions.tokenHash, tokenHash), gt(accountSessions.expiresAt, now))).limit(1))[0];
  if (!session) return null;
  const [account, profile, email] = await Promise.all([
    db.select().from(accounts).where(eq(accounts.id, session.accountId)).limit(1).then((rows) => rows[0]),
    db.select().from(researcherProfiles).where(eq(researcherProfiles.accountId, session.accountId)).limit(1).then((rows) => rows[0]),
    db.select().from(researcherEmails).where(eq(researcherEmails.accountId, session.accountId)).limit(1).then((rows) => rows[0]),
  ]);
  if (!account || !profile) return null;
  return {
    accountId: account.id,
    displayName: researcherDisplayName(account.displayName),
    role: isResearcherRole(account.role) ? account.role : "researcher",
    orcid: profile.orcid,
    biography: profile.biography,
    affiliations: parseStringArray(profile.affiliationsJson),
    associations: readResearcherAssociations(profile.associationsJson),
    expertiseSelf: parseStringArray(profile.expertiseSelfJson),
    expertiseInferred: parseStringArray(profile.expertiseInferredJson),
    photoAvailable: Boolean(profile.photoR2Key),
    photoAlt: profile.photoAlt,
    photoUpdatedAt: profile.photoUpdatedAt,
    messagingEnabled: Boolean(profile.messagingEnabled),
    email: email?.email ?? null,
    emailVerified: Boolean(email?.verifiedAt),
    preferences: {
      researchNotifications: Boolean(email?.researchNotifications),
      communityDigest: Boolean(email?.communityDigest),
      fundraising: Boolean(email?.fundraising),
    },
  };
}

export async function createSession(accountId: string) {
  const token = randomToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86400000).toISOString();
  await (await getResearchDb()).insert(accountSessions).values({ tokenHash: await sha256(token), accountId, expiresAt });
  return { token, expiresAt };
}

export function researcherSessionCookie(token: string, requestUrl: string) {
  const secure = new URL(requestUrl).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_DAYS * 86400}${secure}`;
}

export function clearResearcherSessionCookie(requestUrl: string) {
  const secure = new URL(requestUrl).protocol === "https:" ? "; Secure" : "";
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export async function createOauthState(input: {
  returnTo?: string;
  sourceId?: string;
  linkAccountId?: string;
  chatgptUserId?: string;
  chatgptEmail?: string;
  chatgptName?: string;
}) {
  const state = randomToken();
  await (await getResearchDb()).insert(oauthStates).values({
    stateHash: await sha256(state),
    provider: "orcid",
    returnTo: safeReturnTo(input.returnTo),
    sourceId: input.sourceId || null,
    linkAccountId: input.linkAccountId || null,
    chatgptUserId: input.chatgptUserId || null,
    chatgptEmail: input.chatgptEmail || null,
    chatgptName: input.chatgptName || null,
    expiresAt: new Date(Date.now() + 10 * 60_000).toISOString(),
  });
  return state;
}

export async function consumeOauthState(state: string) {
  const db = (await getResearchDb());
  const stateHash = await sha256(state);
  const record = (await db.select().from(oauthStates).where(and(eq(oauthStates.stateHash, stateHash), gt(oauthStates.expiresAt, new Date().toISOString()))).limit(1))[0];
  if (!record) return null;
  await db.delete(oauthStates).where(eq(oauthStates.stateHash, stateHash));
  return record;
}

export async function createOrLinkOrcidAccount(input: {
  orcid: string;
  name: string;
  linkAccountId?: string | null;
  chatgptUserId?: string | null;
  chatgptEmail?: string | null;
  chatgptName?: string | null;
}) {
  const db = (await getResearchDb());
  const orcid = normalizeOrcid(input.orcid);
  if (!orcid) throw new Error("ORCID returned an invalid identifier.");
  const existingOrcidIdentity = (await db.select().from(accountIdentities).where(and(eq(accountIdentities.provider, "orcid"), eq(accountIdentities.providerSubject, orcid))).limit(1))[0];
  const existingChatgptIdentity = input.chatgptUserId
    ? (await db.select().from(accountIdentities).where(and(eq(accountIdentities.provider, "chatgpt"), eq(accountIdentities.providerSubject, input.chatgptUserId))).limit(1))[0]
    : null;
  const linkedOrcidIdentity = input.linkAccountId
    ? (await db.select().from(accountIdentities).where(and(eq(accountIdentities.provider, "orcid"), eq(accountIdentities.accountId, input.linkAccountId))).limit(1))[0]
    : null;
  if (linkedOrcidIdentity && linkedOrcidIdentity.providerSubject !== orcid) throw new Error("This WikiBiome account is already linked to a different ORCID iD.");
  if (existingOrcidIdentity && input.linkAccountId && existingOrcidIdentity.accountId !== input.linkAccountId) throw new Error("This ORCID iD is already linked to another WikiBiome account.");
  const accountId = existingOrcidIdentity?.accountId ?? input.linkAccountId ?? existingChatgptIdentity?.accountId ?? crypto.randomUUID();
  const name = cleanText(input.name || input.chatgptName || input.chatgptEmail || "Researcher", 180);
  const existingAccount = (await db.select().from(accounts).where(eq(accounts.id, accountId)).limit(1))[0];
  const configuredModerators = String((await getRuntimeEnv()).WIKIBIOME_MODERATOR_IDS ?? "").split(",").map((item) => item.trim()).filter(Boolean);
  const linkedModerator = Boolean(input.chatgptUserId && configuredModerators.includes(input.chatgptUserId));

  if (!existingAccount) await db.insert(accounts).values({ id: accountId, displayName: name, role: linkedModerator ? "moderator" : "researcher" });
  else await db.update(accounts).set({ displayName: name, ...(linkedModerator && existingAccount.role === "researcher" ? { role: "moderator" } : {}), updatedAt: new Date().toISOString() }).where(eq(accounts.id, accountId));

  if (!existingOrcidIdentity) await db.insert(accountIdentities).values({ id: crypto.randomUUID(), accountId, provider: "orcid", providerSubject: orcid });
  if (input.chatgptUserId) {
    if (!existingChatgptIdentity) await db.insert(accountIdentities).values({ id: crypto.randomUUID(), accountId, provider: "chatgpt", providerSubject: input.chatgptUserId });
    else if (existingChatgptIdentity.accountId !== accountId) await db.update(accountIdentities).set({ accountId }).where(eq(accountIdentities.id, existingChatgptIdentity.id));
    await db.update(contributions).set({ accountId }).where(eq(contributions.contributorUserId, input.chatgptUserId));
  }

  const profile = (await db.select().from(researcherProfiles).where(eq(researcherProfiles.accountId, accountId)).limit(1))[0];
  if (!profile) await db.insert(researcherProfiles).values({ accountId, orcid, name });
  else await db.update(researcherProfiles).set({ orcid, name, updatedAt: new Date().toISOString() }).where(eq(researcherProfiles.accountId, accountId));

  await recordAudit(accountId, "identity.orcid_linked", "account", accountId, { orcid, chatgptLinked: Boolean(input.chatgptUserId) });
  return accountId;
}

export async function updateResearcherAccount(accountId: string, input: {
  name?: unknown;
  biography?: unknown;
  affiliations?: unknown;
  associations?: unknown;
  expertise?: unknown;
}) {
  const name = cleanText(input.name, 180);
  const biography = cleanText(input.biography, 3000);
  const affiliations = cleanStringList(input.affiliations, 12, 180);
  const expertise = cleanStringList(input.expertise, 20, 100);
  const associations = input.associations === undefined ? undefined : normalizeResearcherAssociations(input.associations);
  const db = (await getResearchDb());
  if (name) await db.update(accounts).set({ displayName: name, updatedAt: new Date().toISOString() }).where(eq(accounts.id, accountId));
  await db.update(researcherProfiles).set({
    ...(name ? { name } : {}),
    ...(input.biography !== undefined ? { biography } : {}),
    ...(input.affiliations !== undefined ? { affiliationsJson: JSON.stringify(affiliations) } : {}),
    ...(input.expertise !== undefined ? { expertiseSelfJson: JSON.stringify(expertise) } : {}),
    ...(associations !== undefined ? { associationsJson: JSON.stringify(associations) } : {}),
    updatedAt: new Date().toISOString(),
  }).where(eq(researcherProfiles.accountId, accountId));
  await recordAudit(accountId, "profile.updated", "account", accountId, {});
}

export async function setResearcherProfilePhoto(account: ResearcherSession, input: { r2Key: string; mimeType: string; alt: unknown }) {
  assertVerifiedResearcher(account);
  const db = await getResearchDb();
  const profile = (await db.select().from(researcherProfiles).where(eq(researcherProfiles.accountId, account.accountId)).limit(1))[0];
  if (!profile) throw new Error("Researcher profile not found.");
  const updatedAt = new Date().toISOString();
  await db.update(researcherProfiles).set({
    photoR2Key: cleanText(input.r2Key, 500),
    photoMimeType: cleanText(input.mimeType, 100),
    photoAlt: cleanText(input.alt, 180) || `Professional portrait of ${profile.name}`,
    photoUpdatedAt: updatedAt,
    updatedAt,
  }).where(eq(researcherProfiles.accountId, account.accountId));
  await recordAudit(account.accountId, "profile.photo_updated", "account", account.accountId, {});
  return { previousR2Key: profile.photoR2Key, photoUpdatedAt: updatedAt };
}

export async function removeResearcherProfilePhoto(account: ResearcherSession) {
  assertVerifiedResearcher(account);
  const db = await getResearchDb();
  const profile = (await db.select().from(researcherProfiles).where(eq(researcherProfiles.accountId, account.accountId)).limit(1))[0];
  if (!profile) throw new Error("Researcher profile not found.");
  await db.update(researcherProfiles).set({ photoR2Key: null, photoMimeType: null, photoAlt: "", photoUpdatedAt: null, updatedAt: new Date().toISOString() }).where(eq(researcherProfiles.accountId, account.accountId));
  await recordAudit(account.accountId, "profile.photo_removed", "account", account.accountId, {});
  return { previousR2Key: profile.photoR2Key };
}

export async function getResearcherProfilePhoto(orcid: unknown) {
  try {
    const profile = (await (await getResearchDb()).select({
      r2Key: researcherProfiles.photoR2Key,
      mimeType: researcherProfiles.photoMimeType,
      updatedAt: researcherProfiles.photoUpdatedAt,
    }).from(researcherProfiles).where(eq(researcherProfiles.orcid, normalizeOrcid(orcid))).limit(1))[0];
    return profile?.r2Key && profile.mimeType ? { r2Key: profile.r2Key, mimeType: profile.mimeType, updatedAt: profile.updatedAt } : null;
  } catch {
    return null;
  }
}

export async function recalculateInferredExpertise(accountId: string) {
  const db = await getResearchDb();
  const claims = await db.select({ sourceId: sourceClaims.sourceId }).from(sourceClaims).where(and(eq(sourceClaims.accountId, accountId), eq(sourceClaims.status, "verified"))).limit(500);
  const inferred = buildResearchImpact(claims.map((claim) => claim.sourceId)).inferredExpertise;
  await db.update(researcherProfiles).set({ expertiseInferredJson: JSON.stringify(inferred), updatedAt: new Date().toISOString() }).where(eq(researcherProfiles.accountId, accountId));
  return inferred;
}

export async function beginEmailVerification(accountId: string, input: {
  email: unknown;
  researchNotifications?: unknown;
  communityDigest?: unknown;
  fundraising?: unknown;
}) {
  const email = cleanEmail(input.email);
  if (!email) throw new Error("Enter a valid email address.");
  const db = (await getResearchDb());
  const suppressed = (await db.select().from(suppressionList).where(eq(suppressionList.email, email)).limit(1))[0];
  if (suppressed) throw new Error("This address is on the do-not-contact list.");
  const owned = (await db.select().from(researcherEmails).where(eq(researcherEmails.email, email)).limit(1))[0];
  if (owned && owned.accountId !== accountId) throw new Error("That email is already linked to another WikiBiome account.");

  const byAccount = (await db.select().from(researcherEmails).where(eq(researcherEmails.accountId, accountId)).limit(1))[0];
  const preferences = {
    researchNotifications: input.researchNotifications === true,
    communityDigest: input.communityDigest === true,
    // Fundraising consent is retained for historical records but is no longer
    // requested or changed by researcher onboarding.
    fundraising: typeof input.fundraising === "boolean" ? input.fundraising : Boolean(byAccount?.fundraising),
  };
  const alreadyVerified = byAccount?.email === email && Boolean(byAccount.verifiedAt);
  if (!alreadyVerified) await enforceRateLimit(accountId, "email.verify", 5, 1440);
  if (byAccount) {
    await db.update(researcherEmails).set({ email, verifiedAt: byAccount.email === email ? byAccount.verifiedAt : null, ...preferences, updatedAt: new Date().toISOString() }).where(eq(researcherEmails.id, byAccount.id));
  } else {
    await db.insert(researcherEmails).values({ id: crypto.randomUUID(), accountId, email, ...preferences });
  }

  if (alreadyVerified) {
    await recordAudit(accountId, "email.preferences_updated", "account", accountId, {});
    return { token: "", email, alreadyVerified: true };
  }

  const token = randomToken();
  const replacedAt = new Date().toISOString();
  await db.batch([
    db.update(emailVerificationTokens).set({ usedAt: replacedAt }).where(and(eq(emailVerificationTokens.accountId, accountId), isNull(emailVerificationTokens.usedAt))),
    db.insert(emailVerificationTokens).values({
      tokenHash: await sha256(token),
      accountId,
      email,
      expiresAt: new Date(Date.now() + 24 * 60 * 60_000).toISOString(),
    }),
  ]);
  await recordAudit(accountId, "email.verification_requested", "account", accountId, { email });
  return { token, email, alreadyVerified: false };
}

export async function verifyResearcherEmail(token: string) {
  const db = (await getResearchDb());
  const tokenHash = await sha256(token);
  const record = (await db.select().from(emailVerificationTokens).where(eq(emailVerificationTokens.tokenHash, tokenHash)).limit(1))[0];
  if (!record || record.usedAt) return { state: "invalid" as const, accountId: null };
  if (record.expiresAt <= new Date().toISOString()) return { state: "expired" as const, accountId: record.accountId };
  const now = new Date().toISOString();
  await db.batch([
    db.update(emailVerificationTokens).set({ usedAt: now }).where(eq(emailVerificationTokens.tokenHash, tokenHash)),
    db.update(researcherEmails).set({ verifiedAt: now, updatedAt: now }).where(and(eq(researcherEmails.accountId, record.accountId), eq(researcherEmails.email, record.email))),
  ]);
  await recordAudit(record.accountId, "email.verified", "account", record.accountId, {});
  return { state: "verified" as const, accountId: record.accountId };
}

export async function getPublicResearcher(orcid: string): Promise<PublicResearcher | null> {
  try {
    const profile = (await (await getResearchDb()).select().from(researcherProfiles).where(eq(researcherProfiles.orcid, normalizeOrcid(orcid))).limit(1))[0];
    if (!profile) return null;
    return (await getPublicResearchersByAccountIds([profile.accountId])).get(profile.accountId) ?? null;
  } catch {
    return null;
  }
}

export async function getPublicResearchersByAccountIds(accountIds: string[]) {
  const unique = [...new Set(accountIds)];
  const result = new Map<string, PublicResearcher>();
  if (!unique.length) return result;
  try {
    const db = await getResearchDb();
    for (let offset = 0; offset < unique.length; offset += 90) {
      const ids = unique.slice(offset, offset + 90);
      const [accountRows, profileRows, memberships] = await Promise.all([
        db.select().from(accounts).where(inArray(accounts.id, ids)),
        db.select().from(researcherProfiles).where(inArray(researcherProfiles.accountId, ids)),
        db.select().from(institutionMemberships).where(and(inArray(institutionMemberships.accountId, ids), eq(institutionMemberships.status, "approved"))),
      ]);
      const institutionIds = [...new Set(memberships.map((item) => item.institutionId))];
      const institutionRows = institutionIds.length ? await db.select().from(institutions).where(and(inArray(institutions.id, institutionIds), eq(institutions.status, "approved"))) : [];
      const profiles = new Map(profileRows.map((item) => [item.accountId, item]));
      const institutionMap = new Map(institutionRows.map((item) => [item.id, item]));
      for (const account of accountRows) {
        const profile = profiles.get(account.id);
        if (!profile) continue;
        const verifiedAffiliations = memberships
          .filter((item) => item.accountId === account.id)
          .flatMap((item) => {
            const institution = institutionMap.get(item.institutionId);
            if (!institution) return [];
            return [{
              name: institution.name,
              identifier: institution.slug || institution.ror,
              ror: institution.identityStatus === "ror_verified" ? institution.ror : null,
              identityStatus: institution.identityStatus,
              websiteUrl: institution.websiteUrl,
            }];
          });
        result.set(account.id, publicResearcher(account, profile, verifiedAffiliations));
      }
    }
  } catch {
    // Public corpus routes must stay readable while a new migration is pending.
  }
  return result;
}

export async function listPublicResearcherDirectory() {
  try {
    const db = await getResearchDb();
    const profiles = await db.select({ accountId: researcherProfiles.accountId }).from(researcherProfiles).orderBy(asc(researcherProfiles.name)).limit(500);
    const ids = profiles.map((profile) => profile.accountId);
    const [people, claims, recognition] = await Promise.all([
      getPublicResearchersByAccountIds(ids),
      ids.length ? db.select({ accountId: sourceClaims.accountId, sourceId: sourceClaims.sourceId }).from(sourceClaims).where(and(inArray(sourceClaims.accountId, ids), eq(sourceClaims.status, "verified"))).limit(5000) : Promise.resolve([]),
      ids.length ? db.select({ accountId: recognitionEvents.accountId, level: recognitionEvents.level }).from(recognitionEvents).where(and(inArray(recognitionEvents.accountId, ids), eq(recognitionEvents.status, "active"))).limit(2500) : Promise.resolve([]),
    ]);
    return [...people.values()].map((researcher) => {
      const impact = buildResearchImpact(claims.filter((claim) => claim.accountId === researcher.accountId).map((claim) => claim.sourceId));
      const contributionLevel = recognition.filter((event) => event.accountId === researcher.accountId).reduce((level, event) => Math.max(level, event.level), 0);
      return {
        ...researcher,
        expertiseInferred: [...new Set([...researcher.expertiseInferred, ...impact.inferredExpertise])],
        impact,
        contributionLevel,
      };
    });
  } catch {
    return [];
  }
}

export async function createSourceClaim(input: { sourceId: string; account: ResearcherSession; evidenceNote?: unknown }) {
  if (!input.account.emailVerified) throw new Error("Verify your private email before claiming a work.");
  await enforceRateLimit(input.account.accountId, "source.claim", 20, 1440);
  const source = getSource(input.sourceId);
  if (!source) throw new Error("The selected source does not exist.");
  const normalized = normalizeDoi(source.doi);
  const doi = normalized.status === "valid" ? normalized.bare : null;
  const verification = doi ? await verifyOrcidWork(input.account.orcid, doi) : { verified: false, method: "manual_review" };
  const db = (await getResearchDb());
  const existing = (await db.select().from(sourceClaims).where(and(eq(sourceClaims.sourceId, input.sourceId), eq(sourceClaims.accountId, input.account.accountId))).limit(1))[0];
  if (existing) return existing;
  const claim = {
    id: crypto.randomUUID(),
    sourceId: input.sourceId,
    sourceDoi: doi,
    accountId: input.account.accountId,
    status: verification.verified ? "verified" : "pending",
    verificationMethod: verification.method,
    evidenceNote: cleanText(input.evidenceNote, 2000),
  };
  await db.insert(sourceClaims).values(claim);
  await recordAudit(input.account.accountId, "source.claimed", "source", input.sourceId, { status: claim.status, verificationMethod: claim.verificationMethod });
  return claim;
}

export async function listClaimsForAccount(accountId: string) {
  return (await getResearchDb()).select().from(sourceClaims).where(eq(sourceClaims.accountId, accountId)).orderBy(desc(sourceClaims.createdAt)).limit(200);
}

export async function listPublicClaimsForResearcher(accountId: string) {
  try {
    return (await getResearchDb()).select().from(sourceClaims).where(and(eq(sourceClaims.accountId, accountId), eq(sourceClaims.status, "verified"))).orderBy(desc(sourceClaims.createdAt)).limit(200);
  } catch {
    return [];
  }
}

export async function listPublicClaimsForSource(sourceId: string) {
  try {
    const claims = await (await getResearchDb()).select().from(sourceClaims).where(and(eq(sourceClaims.sourceId, sourceId), eq(sourceClaims.status, "verified"))).orderBy(asc(sourceClaims.createdAt)).limit(100);
    const people = await getPublicResearchersByAccountIds(claims.map((item) => item.accountId));
    return claims.flatMap((claim) => {
      const researcher = people.get(claim.accountId);
      return researcher ? [{ ...claim, researcher }] : [];
    });
  } catch {
    return [];
  }
}

export async function createAuthorReview(input: {
  account: ResearcherSession;
  claimId: unknown;
  accuracy: unknown;
  context: unknown;
  sourceUrl?: unknown;
  conflictDisclosure?: unknown;
}) {
  await enforceRateLimit(input.account.accountId, "author_review.create", 20, 1440);
  const claimId = cleanText(input.claimId, 100);
  const accuracy = cleanText(input.accuracy, 40);
  const allowed = new Set(["accurate", "needs_correction", "missing_context"]);
  if (!allowed.has(accuracy)) throw new Error("Choose how accurately WikiBiome represents this work.");
  const context = cleanText(input.context, 8000);
  if (!context) throw new Error("Add the context you want the editorial team to review.");
  const claim = (await (await getResearchDb()).select().from(sourceClaims).where(and(eq(sourceClaims.id, claimId), eq(sourceClaims.accountId, input.account.accountId))).limit(1))[0];
  if (!claim) throw new Error("Claim not found.");
  const review = {
    id: crypto.randomUUID(),
    claimId,
    sourceId: claim.sourceId,
    accountId: input.account.accountId,
    accuracy,
    context,
    sourceUrl: cleanUrl(input.sourceUrl) || null,
    conflictDisclosure: cleanText(input.conflictDisclosure, 2000),
  };
  await (await getResearchDb()).insert(authorReviews).values(review);
  await recordAudit(input.account.accountId, "author_review.created", "source", claim.sourceId, { accuracy });
  return review;
}

export async function listPublicAuthorReviews(sourceId: string) {
  try {
    const reviews = await (await getResearchDb()).select().from(authorReviews).where(and(eq(authorReviews.sourceId, sourceId), eq(authorReviews.status, "accepted"))).orderBy(desc(authorReviews.createdAt)).limit(50);
    const people = await getPublicResearchersByAccountIds(reviews.map((item) => item.accountId));
    return reviews.flatMap((review) => {
      const researcher = people.get(review.accountId);
      return researcher ? [{ ...review, researcher }] : [];
    });
  } catch {
    return [];
  }
}

export async function createWorkSubmission(input: {
  account: ResearcherSession;
  identifierType: string;
  identifierValue: string;
  title: string;
  authors: string[];
  year?: number;
  abstractText?: string;
  metadata?: unknown;
  rightsAttested: boolean;
  license?: string;
}) {
  if (!input.account.emailVerified) throw new Error("Verify your private email before submitting work.");
  await enforceRateLimit(input.account.accountId, "work.submit", 10, 1440);
  const fingerprint = await sha256(`${normalizeFingerprintPart(input.title)}|${input.authors.slice(0, 5).map(normalizeFingerprintPart).join("|")}|${input.year ?? ""}`);
  const existing = (await (await getResearchDb()).select().from(workSubmissions).where(or(and(eq(workSubmissions.identifierType, input.identifierType), eq(workSubmissions.identifierValue, input.identifierValue)), eq(workSubmissions.fingerprint, fingerprint))).limit(1))[0];
  if (existing) throw new Error("That work is already in the submission queue.");
  const submission = {
    id: crypto.randomUUID(),
    accountId: input.account.accountId,
    identifierType: input.identifierType,
    identifierValue: input.identifierValue,
    fingerprint,
    title: cleanText(input.title, 1000),
    authorsJson: JSON.stringify(input.authors.slice(0, 100)),
    year: input.year ?? null,
    abstractText: cleanText(input.abstractText, 12000),
    metadataJson: JSON.stringify(input.metadata ?? {}),
    status: "pending_review",
    rightsAttested: input.rightsAttested,
    license: cleanText(input.license, 200) || null,
  };
  await (await getResearchDb()).insert(workSubmissions).values(submission);
  await recordAudit(input.account.accountId, "work.submitted", "work_submission", submission.id, { identifierType: submission.identifierType, identifierValue: submission.identifierValue });
  return submission;
}

export async function listWorkSubmissions(accountId: string) {
  return (await getResearchDb()).select().from(workSubmissions).where(eq(workSubmissions.accountId, accountId)).orderBy(desc(workSubmissions.createdAt)).limit(100);
}

export async function addSubmissionFile(input: { account: ResearcherSession; submissionId: string; filename: string; byteSize: number; r2Key: string }) {
  const submission = (await (await getResearchDb()).select().from(workSubmissions).where(and(eq(workSubmissions.id, input.submissionId), eq(workSubmissions.accountId, input.account.accountId))).limit(1))[0];
  if (!submission) throw new Error("Submission not found.");
  if (!submission.rightsAttested) throw new Error("Rights attestation is required before a manuscript can be uploaded.");
  const file = { id: crypto.randomUUID(), submissionId: input.submissionId, r2Key: input.r2Key, filename: input.filename, byteSize: input.byteSize, mimeType: "application/pdf" };
  await (await getResearchDb()).insert(submissionFiles).values(file);
  await recordAudit(input.account.accountId, "work.file_quarantined", "work_submission", input.submissionId, { byteSize: input.byteSize });
  return file;
}

export async function listPublicDiscussions(targetType: "article" | "source" | "proposal", targetId: string, viewerAccountId?: string, before?: string) {
  try {
    const db = await getResearchDb();
    const threads = await db.select().from(discussionThreads).where(and(eq(discussionThreads.targetType, targetType), eq(discussionThreads.targetId, targetId), eq(discussionThreads.status, "published"), ...(before ? [lt(discussionThreads.updatedAt, before)] : []))).orderBy(desc(discussionThreads.updatedAt)).limit(50);
    const [blockedRows, followedRows] = viewerAccountId ? await Promise.all([
      db.select().from(researcherBlocks).where(eq(researcherBlocks.blockerAccountId, viewerAccountId)),
      threads.length ? db.select().from(researcherFollows).where(and(eq(researcherFollows.accountId, viewerAccountId), eq(researcherFollows.targetType, "thread"), inArray(researcherFollows.targetId, threads.map((thread) => thread.id)))) : Promise.resolve([]),
    ]) : [[], []];
    const blockedIds = new Set(blockedRows.map((item) => item.blockedAccountId));
    const followedIds = new Set(followedRows.map((item) => item.targetId));
    const result = [];
    for (const thread of threads) {
      if (blockedIds.has(thread.createdByAccountId)) continue;
      const posts = await db.select().from(discussionPosts).where(and(eq(discussionPosts.threadId, thread.id), eq(discussionPosts.status, "published"))).orderBy(asc(discussionPosts.createdAt)).limit(200);
      const visiblePosts = posts.filter((post) => !blockedIds.has(post.accountId));
      const revisions = visiblePosts.length ? await db.select().from(discussionPostRevisions).where(inArray(discussionPostRevisions.postId, visiblePosts.map((post) => post.id))).orderBy(asc(discussionPostRevisions.revision)) : [];
      result.push({ thread, following: followedIds.has(thread.id), posts: visiblePosts.map((post) => ({ ...post, revisions: revisions.filter((revision) => revision.postId === post.id) })) });
    }
    const accountIds = result.flatMap((item) => [item.thread.createdByAccountId, ...item.posts.map((post) => post.accountId)]);
    const people = await getPublicResearchersByAccountIds(accountIds);
    return result.map((item) => ({ ...item, people: Object.fromEntries(people) }));
  } catch {
    return [];
  }
}

export async function createDiscussionThread(input: {
  account: ResearcherSession;
  targetType: unknown;
  targetId: unknown;
  title: unknown;
  category: unknown;
  body: unknown;
  sourceUrl?: unknown;
  conflictDisclosure?: unknown;
}) {
  assertVerifiedResearcher(input.account);
  await enforceRateLimit(input.account.accountId, "discussion.create", 5, 60);
  const targetType = cleanText(input.targetType, 20);
  if (targetType !== "article" && targetType !== "source" && targetType !== "proposal") throw new Error("Choose a valid discussion target.");
  const targetId = cleanText(input.targetId, 180);
  const publicProposal = targetType === "proposal" ? (await (await getResearchDb()).select().from(contentProposals).where(and(eq(contentProposals.id, targetId), eq(contentProposals.status, "accepted"))).limit(1))[0] : null;
  if ((targetType === "source" && !getSource(targetId)) || (targetType === "article" && !getWikiPage(targetId)) || (targetType === "proposal" && !publicProposal)) throw new Error("The selected discussion target does not exist or is not public.");
  const category = cleanText(input.category, 40) as DiscussionCategory;
  if (!discussionCategories.includes(category)) throw new Error("Choose a valid discussion category.");
  const sourceUrl = cleanUrl(input.sourceUrl);
  if (category !== "question" && !sourceUrl) throw new Error("Scientific assertions require a DOI, PMID, or source URL.");
  const title = cleanText(input.title, 240);
  const body = cleanText(input.body, 12000);
  if (!title || !body) throw new Error("A title and opening post are required.");
  const status = await initialPostStatus(input.account);
  const threadId = crypto.randomUUID();
  const postId = crypto.randomUUID();
  const now = new Date().toISOString();
  const db = (await getResearchDb());
  await db.batch([
    db.insert(discussionThreads).values({ id: threadId, targetType, targetId, title, category, createdByAccountId: input.account.accountId, status, createdAt: now, updatedAt: now }),
    db.insert(discussionPosts).values({ id: postId, threadId, accountId: input.account.accountId, body, sourceUrl: sourceUrl || null, conflictDisclosure: cleanText(input.conflictDisclosure, 2000), status, createdAt: now, updatedAt: now }),
    db.insert(discussionPostRevisions).values({ id: crypto.randomUUID(), postId, revision: 1, body, sourceUrl: sourceUrl || null, conflictDisclosure: cleanText(input.conflictDisclosure, 2000), createdAt: now }),
  ]);
  await recordAudit(input.account.accountId, "discussion.created", targetType, targetId, { threadId, status, category });
  return { threadId, postId, status };
}

export async function createDiscussionReply(input: { account: ResearcherSession; threadId: unknown; parentPostId?: unknown; body: unknown; sourceUrl?: unknown; conflictDisclosure?: unknown }) {
  assertVerifiedResearcher(input.account);
  await enforceRateLimit(input.account.accountId, "discussion.reply", 12, 60);
  const threadId = cleanText(input.threadId, 100);
  const thread = (await (await getResearchDb()).select().from(discussionThreads).where(eq(discussionThreads.id, threadId)).limit(1))[0];
  if (!thread || thread.status !== "published") throw new Error("This discussion is unavailable for replies.");
  const body = cleanText(input.body, 12000);
  if (!body) throw new Error("Reply text is required.");
  const sourceUrl = cleanUrl(input.sourceUrl);
  if (thread.category !== "question" && !sourceUrl) throw new Error("Scientific assertions require a DOI, PMID, or source URL.");
  const status = await initialPostStatus(input.account);
  const postId = crypto.randomUUID();
  const now = new Date().toISOString();
  await (await getResearchDb()).batch([
    (await getResearchDb()).insert(discussionPosts).values({ id: postId, threadId, parentPostId: cleanText(input.parentPostId, 100) || null, accountId: input.account.accountId, body, sourceUrl: sourceUrl || null, conflictDisclosure: cleanText(input.conflictDisclosure, 2000), status, createdAt: now, updatedAt: now }),
    (await getResearchDb()).insert(discussionPostRevisions).values({ id: crypto.randomUUID(), postId, revision: 1, body, sourceUrl: sourceUrl || null, conflictDisclosure: cleanText(input.conflictDisclosure, 2000), createdAt: now }),
    (await getResearchDb()).update(discussionThreads).set({ updatedAt: now }).where(eq(discussionThreads.id, threadId)),
  ]);
  await recordAudit(input.account.accountId, "discussion.replied", "discussion_thread", threadId, { postId, status });
  return { postId, status, threadId, targetType: thread.targetType as "article" | "source" | "proposal", targetId: thread.targetId, title: thread.title, parentPostId: cleanText(input.parentPostId, 100) || null };
}

export async function editDiscussionPost(input: { account: ResearcherSession; postId: unknown; body: unknown; sourceUrl?: unknown; conflictDisclosure?: unknown }) {
  assertVerifiedResearcher(input.account);
  await enforceRateLimit(input.account.accountId, "discussion.edit", 20, 60);
  const postId = cleanText(input.postId, 100);
  const db = await getResearchDb();
  const post = (await db.select().from(discussionPosts).where(and(eq(discussionPosts.id, postId), eq(discussionPosts.accountId, input.account.accountId))).limit(1))[0];
  if (!post || ["hidden", "rejected"].includes(post.status)) throw new Error("This post cannot be edited.");
  const thread = (await db.select().from(discussionThreads).where(eq(discussionThreads.id, post.threadId)).limit(1))[0];
  if (!thread) throw new Error("The discussion for this post no longer exists.");
  const body = cleanText(input.body, 12000);
  if (!body) throw new Error("Post text is required.");
  const revision = post.revision + 1;
  const now = new Date().toISOString();
  const sourceUrl = cleanUrl(input.sourceUrl) || null;
  if (thread.category !== "question" && !sourceUrl) throw new Error("Scientific assertions require a DOI, PMID, or source URL.");
  const conflictDisclosure = cleanText(input.conflictDisclosure, 2000);
  await db.batch([
    db.update(discussionPosts).set({ body, sourceUrl, conflictDisclosure, revision, updatedAt: now }).where(eq(discussionPosts.id, postId)),
    db.insert(discussionPostRevisions).values({ id: crypto.randomUUID(), postId, revision, body, sourceUrl, conflictDisclosure, createdAt: now }),
  ]);
  await recordAudit(input.account.accountId, "discussion.edited", "discussion_post", postId, { revision });
  return { postId, revision, updatedAt: now };
}

export async function reportDiscussionPost(input: { account: ResearcherSession; postId: unknown; reason: unknown }) {
  assertVerifiedResearcher(input.account);
  const postId = cleanText(input.postId, 100);
  const reason = cleanText(input.reason, 2000);
  if (!reason) throw new Error("Add a reason for the report.");
  if (!(await (await getResearchDb()).select({ id: discussionPosts.id }).from(discussionPosts).where(eq(discussionPosts.id, postId)).limit(1))[0]) throw new Error("Discussion post not found.");
  const report = { id: crypto.randomUUID(), postId, accountId: input.account.accountId, reason };
  await (await getResearchDb()).insert(discussionReports).values(report);
  await recordAudit(input.account.accountId, "discussion.reported", "discussion_post", postId, {});
  return report;
}

export async function blockResearcher(input: { account: ResearcherSession; orcid: unknown }) {
  assertVerifiedResearcher(input.account);
  const profile = (await (await getResearchDb()).select().from(researcherProfiles).where(eq(researcherProfiles.orcid, normalizeOrcid(input.orcid))).limit(1))[0];
  if (!profile) throw new Error("Researcher not found.");
  if (profile.accountId === input.account.accountId) throw new Error("You cannot block your own account.");
  await (await getResearchDb()).insert(researcherBlocks).values({ id: crypto.randomUUID(), blockerAccountId: input.account.accountId, blockedAccountId: profile.accountId }).onConflictDoNothing();
  await recordAudit(input.account.accountId, "researcher.blocked", "account", profile.accountId, {});
  return { blockedAccountId: profile.accountId };
}

export async function getInstitutionByRor(ror: string) {
  try {
    return (await (await getResearchDb()).select().from(institutions).where(eq(institutions.ror, cleanText(ror, 64))).limit(1))[0] ?? null;
  } catch {
    return null;
  }
}

export async function getInstitutionByIdentifier(identifier: string) {
  try {
    const value = cleanText(identifier, 100);
    return (await (await getResearchDb()).select().from(institutions).where(or(eq(institutions.ror, value), eq(institutions.slug, value))).limit(1))[0] ?? null;
  } catch {
    return null;
  }
}

export function institutionPublicIdentifier(institution: { ror: string; slug: string | null }) {
  return institution.slug || institution.ror;
}

export async function listApprovedInstitutions() {
  try {
    return await (await getResearchDb()).select().from(institutions).where(eq(institutions.status, "approved")).orderBy(asc(institutions.name)).limit(500);
  } catch {
    return [];
  }
}

export async function listInstitutionResearchers(institutionId: string) {
  try {
    const memberships = await (await getResearchDb()).select().from(institutionMemberships).where(and(eq(institutionMemberships.institutionId, institutionId), eq(institutionMemberships.status, "approved"))).limit(500);
    const people = await getPublicResearchersByAccountIds(memberships.map((item) => item.accountId));
    return memberships.flatMap((membership) => {
      const researcher = people.get(membership.accountId);
      return researcher ? [{ ...membership, researcher }] : [];
    });
  } catch {
    return [];
  }
}

export async function listAcceptedInstitutionBatches(institutionId: string) {
  try {
    return (await getResearchDb()).select().from(institutionBatches).where(and(eq(institutionBatches.institutionId, institutionId), eq(institutionBatches.status, "accepted"))).orderBy(desc(institutionBatches.createdAt)).limit(100);
  } catch {
    return [];
  }
}

export async function listInstitutionAccess(accountId: string) {
  try {
    const db = await getResearchDb();
    const memberships = await db.select().from(institutionMemberships).where(eq(institutionMemberships.accountId, accountId)).orderBy(desc(institutionMemberships.createdAt)).limit(100);
    const institutionIds = [...new Set(memberships.map((item) => item.institutionId))];
    const organizationRows = institutionIds.length ? await db.select().from(institutions).where(inArray(institutions.id, institutionIds)) : [];
    const organizations = new Map(organizationRows.map((item) => [item.id, item]));
    return memberships.flatMap((membership) => { const institution = organizations.get(membership.institutionId); return institution ? [{ ...membership, institution }] : []; });
  } catch {
    return [];
  }
}

export async function createInstitution(input: {
  account: ResearcherSession;
  ror?: unknown;
  name?: unknown;
  website?: unknown;
  organizationType?: unknown;
  relationship?: unknown;
  description?: unknown;
  evidenceNote?: unknown;
}) {
  assertVerifiedResearcher(input.account);
  await enforceRateLimit(input.account.accountId, "institution.request", 3, 1440);
  const db = await getResearchDb();
  const requestedRor = cleanText(input.ror, 64);
  const organizationType = cleanText(input.organizationType, 40) || "research_institute";
  if (!["research_institute", "research_program", "nonprofit", "professional_association", "publisher", "data_resource"].includes(organizationType)) throw new Error("Choose a valid organization type.");
  const relationship = cleanText(input.relationship, 40) || "member";
  if (!["founder", "director", "researcher", "administrator", "member"].includes(relationship)) throw new Error("Choose your relationship to the organization.");

  let organization: { ror: string; name: string; country: string; domains: string[]; websiteUrl: string | null; slug: string; identityStatus: string };
  let existingInstitution: typeof institutions.$inferSelect | undefined;
  if (requestedRor) {
    const ror = await lookupRorOrganization(requestedRor);
    existingInstitution = (await db.select().from(institutions).where(eq(institutions.ror, ror.ror)).limit(1))[0];
    if (!existingInstitution && ror.domains.length) {
      const provisional = await db.select().from(institutions).where(eq(institutions.identityStatus, "provisional")).limit(500);
      existingInstitution = provisional.find((candidate) => websiteMatchesAuthoritativeDomains(candidate.websiteUrl, ror.domains));
    }
    organization = { ...ror, websiteUrl: existingInstitution?.websiteUrl || cleanUrl(input.website) || null, slug: existingInstitution?.slug || await availableInstitutionSlug(db, ror.name), identityStatus: "ror_verified" };
    if (existingInstitution) await db.update(institutions).set({
      ror: organization.ror,
      slug: organization.slug,
      name: organization.name,
      country: organization.country || null,
      domainsJson: JSON.stringify(organization.domains),
      websiteUrl: organization.websiteUrl,
      identityStatus: "ror_verified",
      updatedAt: new Date().toISOString(),
    }).where(eq(institutions.id, existingInstitution.id));
  } else {
    const name = cleanText(input.name, 300);
    const websiteUrl = cleanUrl(input.website);
    const evidenceNote = cleanText(input.evidenceNote, 3000);
    if (name.length < 2) throw new Error("Add the organization name.");
    if (!websiteUrl) throw new Error("Add the organization’s public website while ROR is pending.");
    if (!evidenceNote) throw new Error("Add a public way for moderators to verify the organization and your relationship to it.");
    const hostname = new URL(websiteUrl).hostname.replace(/^www\./i, "");
    existingInstitution = (await db.select().from(institutions).where(eq(institutions.websiteUrl, websiteUrl)).limit(1))[0];
    const institutionId = existingInstitution?.id ?? crypto.randomUUID();
    organization = {
      ror: existingInstitution?.ror || `provisional:${institutionId}`,
      name,
      country: "",
      domains: [hostname],
      websiteUrl,
      slug: existingInstitution?.slug || await availableInstitutionSlug(db, name),
      identityStatus: "provisional",
    };
  }

  const domainVerified = Boolean(input.account.emailVerified && institutionEmailMatchesAuthoritativeDomains(input.account.email, organization.domains));
  const institutionId = existingInstitution?.id ?? crypto.randomUUID();
  const existingMembership = (await db.select().from(institutionMemberships).where(and(eq(institutionMemberships.institutionId, institutionId), eq(institutionMemberships.accountId, input.account.accountId))).limit(1))[0];
  if (existingMembership) throw new Error("You already have an access request for this organization.");
  const membershipId = crypto.randomUUID();
  if (existingInstitution) {
    await db.insert(institutionMemberships).values({ id: membershipId, institutionId, accountId: input.account.accountId, role: relationship, domainVerified });
  } else {
    await db.batch([
      db.insert(institutions).values({
        id: institutionId,
        ror: organization.ror,
        slug: organization.slug,
        name: organization.name,
        country: organization.country || null,
        domainsJson: JSON.stringify(organization.domains),
        websiteUrl: organization.websiteUrl,
        organizationType,
        identityStatus: organization.identityStatus,
        evidenceNote: cleanText(input.evidenceNote, 3000),
        description: cleanText(input.description, 3000),
      }),
      db.insert(institutionMemberships).values({ id: membershipId, institutionId, accountId: input.account.accountId, role: relationship, domainVerified }),
    ]);
  }
  await recordAudit(input.account.accountId, "institution.requested", "institution", institutionId, { ror: requestedRor ? organization.ror : null, domainVerified, domainSource: requestedRor ? "ror_api" : "website_and_manual_review", relationship });
  return { institutionId, identifier: organization.slug || organization.ror, ror: requestedRor ? organization.ror : null, organization };
}

export async function createInstitutionBatch(input: { account: ResearcherSession; institutionId: unknown; format: unknown; identifiers: unknown }) {
  assertVerifiedResearcher(input.account);
  const institutionId = cleanText(input.institutionId, 100);
  const membership = (await (await getResearchDb()).select().from(institutionMemberships).where(and(eq(institutionMemberships.institutionId, institutionId), eq(institutionMemberships.accountId, input.account.accountId))).limit(1))[0];
  if (!membership || membership.status !== "approved" || !["founder", "director", "administrator", "admin"].includes(membership.role)) throw new Error("An approved organization administrator is required.");
  const format = cleanText(input.format, 20);
  if (!["doi", "pmid", "csv", "ris", "bibtex"].includes(format)) throw new Error("Choose a supported batch format.");
  const identifiers = cleanStringList(input.identifiers, 1000, 1000);
  if (!identifiers.length) throw new Error("Add at least one identifier.");
  const batch = { id: crypto.randomUUID(), institutionId, submittedByAccountId: input.account.accountId, format, recordCount: identifiers.length, identifiersJson: JSON.stringify(identifiers) };
  await (await getResearchDb()).insert(institutionBatches).values(batch);
  await recordAudit(input.account.accountId, "institution.batch_submitted", "institution", institutionId, { batchId: batch.id, recordCount: batch.recordCount });
  return batch;
}

export async function listModerationQueue(account: ResearcherSession) {
  if (!isModeratorRole(account.role)) throw new Error("Moderator access is required.");
  const db = (await getResearchDb());
  const [claims, reviews, submissions, threads, posts, reports, institutionRequests, memberships, batches, proposals, messageReportRows] = await Promise.all([
    db.select().from(sourceClaims).where(eq(sourceClaims.status, "pending")).orderBy(asc(sourceClaims.createdAt)).limit(100),
    db.select().from(authorReviews).where(eq(authorReviews.status, "pending")).orderBy(asc(authorReviews.createdAt)).limit(100),
    db.select().from(workSubmissions).where(eq(workSubmissions.status, "pending_review")).orderBy(asc(workSubmissions.createdAt)).limit(100),
    db.select().from(discussionThreads).where(eq(discussionThreads.status, "pending")).orderBy(asc(discussionThreads.createdAt)).limit(100),
    db.select().from(discussionPosts).where(eq(discussionPosts.status, "pending")).orderBy(asc(discussionPosts.createdAt)).limit(100),
    db.select().from(discussionReports).where(eq(discussionReports.status, "open")).orderBy(asc(discussionReports.createdAt)).limit(100),
    db.select().from(institutions).where(eq(institutions.status, "pending")).orderBy(asc(institutions.createdAt)).limit(100),
    db.select().from(institutionMemberships).where(eq(institutionMemberships.status, "pending")).orderBy(asc(institutionMemberships.createdAt)).limit(100),
    db.select().from(institutionBatches).where(eq(institutionBatches.status, "pending_review")).orderBy(asc(institutionBatches.createdAt)).limit(100),
    db.select().from(contentProposals).where(eq(contentProposals.status, "pending")).orderBy(asc(contentProposals.createdAt)).limit(100),
    db.select().from(messageReports).where(eq(messageReports.status, "open")).orderBy(asc(messageReports.createdAt)).limit(100),
  ]);
  const reportedMessages = messageReportRows.length
    ? await db.select().from(researcherMessages).where(inArray(researcherMessages.id, messageReportRows.map((report) => report.messageId)))
    : [];
  const messagesById = new Map(reportedMessages.map((message) => [message.id, message]));
  const reportedMessageQueue = messageReportRows.map((report) => {
    const message = messagesById.get(report.messageId);
    return { ...report, messageBody: message?.body ?? "", senderAccountId: message?.senderAccountId ?? null, threadId: message?.threadId ?? null };
  });
  return { claims, reviews, submissions, threads, posts, reports, institutions: institutionRequests, institution_memberships: memberships, institution_batches: batches, proposals, message_reports: reportedMessageQueue };
}

export async function moderateResearchItem(account: ResearcherSession, input: { kind: unknown; id: unknown; status: unknown; note?: unknown }) {
  if (!isModeratorRole(account.role)) throw new Error("Moderator access is required.");
  const kind = cleanText(input.kind, 40);
  const id = cleanText(input.id, 100);
  const status = cleanText(input.status, 40);
  const note = cleanText(input.note, 4000);
  const now = new Date().toISOString();
  const db = (await getResearchDb());
  if (kind === "claim" && claimStatuses.includes(status as (typeof claimStatuses)[number])) {
    const claim = (await db.select().from(sourceClaims).where(eq(sourceClaims.id, id)).limit(1))[0];
    if (!claim) throw new Error("Source claim not found.");
    await db.update(sourceClaims).set({ status, reviewerNote: note || null, updatedAt: now }).where(eq(sourceClaims.id, id));
    await recalculateInferredExpertise(claim.accountId);
  }
  else if (kind === "author_review" && ["accepted", "declined", "needs_revision"].includes(status)) await db.update(authorReviews).set({ status, moderatorNote: note || null, updatedAt: now }).where(eq(authorReviews.id, id));
  else if (kind === "work_submission" && submissionStatuses.includes(status as (typeof submissionStatuses)[number])) {
    const submission = (await db.select().from(workSubmissions).where(eq(workSubmissions.id, id)).limit(1))[0];
    if (!submission) throw new Error("Work submission not found.");
    if (status === "accepted") {
      await db.batch([
        db.update(workSubmissions).set({ status, editorialNote: note || null, updatedAt: now }).where(eq(workSubmissions.id, id)),
        db.insert(editorialChangePackets).values({ id: crypto.randomUUID(), submissionId: id, payloadJson: JSON.stringify({ identifierType: submission.identifierType, identifierValue: submission.identifierValue, title: submission.title, authors: parseStringArray(submission.authorsJson), year: submission.year, abstractText: submission.abstractText, metadata: parseJsonObject(submission.metadataJson), editorialNote: note }) }).onConflictDoNothing(),
      ]);
    } else await db.update(workSubmissions).set({ status, editorialNote: note || null, updatedAt: now }).where(eq(workSubmissions.id, id));
  }
  else if (kind === "discussion_thread" && ["published", "rejected", "locked"].includes(status)) await db.update(discussionThreads).set({ status, updatedAt: now }).where(eq(discussionThreads.id, id));
  else if (kind === "discussion_post" && ["published", "rejected", "hidden"].includes(status)) await db.update(discussionPosts).set({ status, updatedAt: now }).where(eq(discussionPosts.id, id));
  else if (kind === "report" && ["resolved", "dismissed"].includes(status)) await db.update(discussionReports).set({ status }).where(eq(discussionReports.id, id));
  else if (kind === "institution" && ["approved", "declined"].includes(status)) await db.update(institutions).set({ status, updatedAt: now }).where(eq(institutions.id, id));
  else if (kind === "institution_membership" && ["approved", "declined"].includes(status)) {
    const membership = (await db.select().from(institutionMemberships).where(eq(institutionMemberships.id, id)).limit(1))[0];
    if (!membership) throw new Error("Institution membership not found.");
    if (status === "approved" && !membership.domainVerified && !note) throw new Error("Record the public evidence used for manual relationship verification.");
    await db.update(institutionMemberships).set({ status }).where(eq(institutionMemberships.id, id));
  }
  else if (kind === "institution_batch" && ["accepted", "declined"].includes(status)) await db.update(institutionBatches).set({ status }).where(eq(institutionBatches.id, id));
  else throw new Error("Choose a valid moderation action.");
  await recordAudit(account.accountId, "moderation.decided", kind, id, { status, note });
  return { kind, id, status };
}

export async function enqueueNotification(input: { accountId?: string; email: string; kind: string; payload: Record<string, unknown> }) {
  const email = cleanEmail(input.email);
  if (!email) throw new Error("A valid delivery address is required.");
  const suppressed = (await (await getResearchDb()).select().from(suppressionList).where(eq(suppressionList.email, email)).limit(1))[0];
  if (suppressed) throw new Error("This address is suppressed.");
  const row = { id: crypto.randomUUID(), accountId: input.accountId || null, email, kind: cleanText(input.kind, 80), payloadJson: JSON.stringify(input.payload) };
  await (await getResearchDb()).insert(notificationOutbox).values(row);
  return row;
}

export async function createCitationNoticeContact(account: ResearcherSession, input: { email: unknown; sourceId: unknown; provenance: unknown; jurisdictionRule: unknown }) {
  if (!isModeratorRole(account.role)) throw new Error("Moderator access is required.");
  if (!(await getResearchNetworkCapabilities()).outreach) throw new Error("Citation outreach is disabled until counsel approval and production email safeguards are configured.");
  const email = cleanEmail(input.email);
  const sourceId = cleanText(input.sourceId, 180);
  const provenance = cleanText(input.provenance, 1000);
  const jurisdictionRule = cleanText(input.jurisdictionRule, 500);
  if (!email || !getSource(sourceId)) throw new Error("A valid address and WikiBiome source are required.");
  if (!provenance || !jurisdictionRule) throw new Error("Address provenance and the counsel-approved jurisdiction rule are required.");
  const db = await getResearchDb();
  const suppressed = (await db.select().from(suppressionList).where(eq(suppressionList.email, email)).limit(1))[0];
  if (suppressed) throw new Error("This address is suppressed.");
  const existing = (await db.select().from(outreachContacts).where(and(eq(outreachContacts.email, email), eq(outreachContacts.sourceId, sourceId))).limit(1))[0];
  if (existing?.lastSentAt || existing?.status === "queued") throw new Error("A citation notice for this address and work is already queued or sent.");
  const [{ value }] = await db.select({ value: count() }).from(outreachContacts);
  if (!existing && Number(value) >= 100) throw new Error("The 100-contact pilot cap has been reached.");
  const token = randomToken();
  const tokenHash = await sha256(token);
  const claimTokenExpiresAt = new Date(Date.now() + 14 * 86400000).toISOString();
  const id = existing?.id ?? crypto.randomUUID();
  if (existing) await db.update(outreachContacts).set({ provenance, jurisdictionRule, status: "queued", claimTokenHash: tokenHash, claimTokenExpiresAt, claimTokenUsedAt: null }).where(eq(outreachContacts.id, id));
  else await db.insert(outreachContacts).values({ id, email, sourceId, provenance, jurisdictionRule, status: "queued", claimTokenHash: tokenHash, claimTokenExpiresAt });
  await recordAudit(account.accountId, "citation_notice.queued", "source", sourceId, { contactId: id, provenance, jurisdictionRule });
  return { id, email, sourceId, token };
}

export async function markCitationNoticeSent(contactId: string) {
  await (await getResearchDb()).update(outreachContacts).set({ status: "sent", lastSentAt: new Date().toISOString() }).where(eq(outreachContacts.id, contactId));
}

export async function consumeCitationNoticeToken(contactId: unknown, token: unknown) {
  const id = cleanText(contactId, 100);
  const provided = cleanText(token, 200);
  if (!id || !provided) return null;
  const db = await getResearchDb();
  const contact = (await db.select().from(outreachContacts).where(and(eq(outreachContacts.id, id), gt(outreachContacts.claimTokenExpiresAt, new Date().toISOString()))).limit(1))[0];
  if (!contact?.claimTokenHash || contact.claimTokenUsedAt || !timingSafeEqual(contact.claimTokenHash, await sha256(provided))) return null;
  await db.update(outreachContacts).set({ claimTokenUsedAt: new Date().toISOString() }).where(eq(outreachContacts.id, id));
  await recordAudit(null, "citation_notice.opened", "source", contact.sourceId, { contactId: id });
  return contact.sourceId;
}

export async function suppressEmail(emailValue: unknown, reasonValue: unknown) {
  const email = cleanEmail(emailValue);
  if (!email) return false;
  const reason = cleanText(reasonValue, 240) || "unsubscribe";
  await (await getResearchDb()).insert(suppressionList).values({ email, reason }).onConflictDoUpdate({ target: suppressionList.email, set: { reason } });
  await (await getResearchDb()).update(researcherEmails).set({ researchNotifications: false, communityDigest: false, fundraising: false, updatedAt: new Date().toISOString() }).where(eq(researcherEmails.email, email));
  await recordAudit(null, "email.suppressed", "email", email, { reason });
  return true;
}

export async function recordAudit(actorAccountId: string | null, action: string, targetType: string, targetId: string, metadata: unknown) {
  await (await getResearchDb()).insert(auditEvents).values({ id: crypto.randomUUID(), actorAccountId, action, targetType, targetId, metadataJson: JSON.stringify(metadata ?? {}) });
}

export function isModeratorRole(role: ResearcherRole) {
  return role === "moderator" || role === "site_admin";
}

function isResearcherRole(value: string): value is ResearcherRole {
  return researcherRoles.includes(value as ResearcherRole);
}

function parseCookie(header: string | null, name: string) {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return difference === 0;
}

function parseStringArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function parseJsonObject(value: string) {
  try { const parsed = JSON.parse(value); return parsed && typeof parsed === "object" ? parsed : {}; } catch { return {}; }
}

function cleanStringList(value: unknown, maxItems: number, maxLength: number) {
  const items = Array.isArray(value) ? value : typeof value === "string" ? value.split(/[\n,]/) : [];
  return [...new Set(items.map((item) => cleanText(item, maxLength)).filter(Boolean))].slice(0, maxItems);
}

function normalizeFingerprintPart(value: unknown) {
  return cleanText(value, 1000).normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

async function availableInstitutionSlug(db: Awaited<ReturnType<typeof getResearchDb>>, name: string) {
  const base = normalizeOrganizationSlug(name);
  const existing = (await db.select({ id: institutions.id }).from(institutions).where(eq(institutions.slug, base)).limit(1))[0];
  return existing ? `${base}-${crypto.randomUUID().slice(0, 8)}` : base;
}

function websiteMatchesAuthoritativeDomains(websiteUrl: string | null, domains: string[]) {
  if (!websiteUrl) return false;
  try {
    const hostname = new URL(websiteUrl).hostname.toLowerCase().replace(/^www\./, "");
    return domains.some((value) => {
      const domain = value.toLowerCase().replace(/^www\./, "");
      return hostname === domain || hostname.endsWith(`.${domain}`) || domain.endsWith(`.${hostname}`);
    });
  } catch {
    return false;
  }
}

function publicResearcher(account: typeof accounts.$inferSelect, profile: typeof researcherProfiles.$inferSelect, verifiedAffiliations: PublicResearcher["verifiedAffiliations"] = []): PublicResearcher {
  return {
    accountId: account.id,
    orcid: profile.orcid,
    name: researcherDisplayName(profile.name),
    biography: profile.biography,
    affiliations: parseStringArray(profile.affiliationsJson),
    associations: readResearcherAssociations(profile.associationsJson),
    verifiedAffiliations,
    expertiseSelf: parseStringArray(profile.expertiseSelfJson),
    expertiseInferred: parseStringArray(profile.expertiseInferredJson),
    photoAvailable: Boolean(profile.photoR2Key),
    photoAlt: profile.photoAlt,
    photoUpdatedAt: profile.photoUpdatedAt,
    role: isResearcherRole(account.role) ? account.role : "researcher",
  };
}

function assertVerifiedResearcher(account: ResearcherSession) {
  if (!account.orcid) throw new Error("Connect an authenticated ORCID iD first.");
  if (!account.emailVerified) throw new Error("Verify your private email before participating.");
}

async function initialPostStatus(account: ResearcherSession) {
  const db = await getResearchDb();
  const published = account.role === "researcher"
    ? await db.select({ status: discussionPosts.status }).from(discussionPosts).where(and(eq(discussionPosts.accountId, account.accountId), eq(discussionPosts.status, "published"))).limit(3)
    : [];
  const decision = discussionPublishingDecision(account.role, published.map((post) => post.status));
  if (decision.promoteTo) {
    await db.update(accounts).set({ role: decision.promoteTo, updatedAt: new Date().toISOString() }).where(and(eq(accounts.id, account.accountId), eq(accounts.role, "researcher")));
    await recordAudit(account.accountId, "trust.promoted", "account", account.accountId, { role: decision.promoteTo, publishedPosts: published.length });
  }
  return decision.status;
}

export async function enforceRateLimit(accountId: string, action: string, limit: number, minutes: number) {
  const since = new Date(Date.now() - minutes * 60_000).toISOString();
  const db = (await getResearchDb());
  const [{ value }] = await db.select({ value: count() }).from(rateLimitEvents).where(and(eq(rateLimitEvents.accountId, accountId), eq(rateLimitEvents.action, action), gt(rateLimitEvents.createdAt, since)));
  if (Number(value) >= limit) throw new Error("You have reached the participation limit for now. Please try again later.");
  await db.insert(rateLimitEvents).values({ id: crypto.randomUUID(), accountId, action });
}

async function verifyOrcidWork(orcid: string, doi: string) {
  try {
    const crossref = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}?mailto=hello@wikibiome.com`, { headers: { "user-agent": "WikiBiome/1.0 (mailto:hello@wikibiome.com)" } });
    if (crossref.ok) {
      const payload = await crossref.json() as { message?: { author?: Array<{ ORCID?: string; "authenticated-orcid"?: boolean }> } };
      const author = payload.message?.author?.find((item) => normalizeOrcid(item.ORCID) === orcid);
      if (author?.["authenticated-orcid"]) return { verified: true, method: "crossref_authenticated_orcid" };
      if (author) return { verified: false, method: "crossref_orcid_manual_review" };
    }
  } catch {
    // Continue to the ORCID public-record check.
  }

  try {
    const runtime = await getRuntimeEnv();
    if (!runtime.ORCID_CLIENT_ID || !runtime.ORCID_CLIENT_SECRET) return { verified: false, method: "manual_review" };
    const tokenResponse = await fetch(`${orcidRegistryBase(runtime)}/oauth/token`, {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ client_id: runtime.ORCID_CLIENT_ID, client_secret: runtime.ORCID_CLIENT_SECRET, grant_type: "client_credentials", scope: "/read-public" }),
    });
    if (!tokenResponse.ok) return { verified: false, method: "manual_review" };
    const token = await tokenResponse.json() as { access_token?: string };
    if (!token.access_token) return { verified: false, method: "manual_review" };
    const worksResponse = await fetch(`${orcidApiBase(runtime)}/v3.0/${orcid}/works`, { headers: { accept: "application/json", authorization: `Bearer ${token.access_token}` } });
    if (!worksResponse.ok) return { verified: false, method: "manual_review" };
    const works = await worksResponse.json() as unknown;
    if (JSON.stringify(works).toLowerCase().includes(doi.toLowerCase())) return { verified: true, method: "orcid_public_work" };
  } catch {
    // Manual review is the safe fallback for external metadata failures.
  }
  return { verified: false, method: "manual_review" };
}

function orcidRegistryBase(runtime: Record<string, string | undefined>) {
  return runtime.ORCID_ENVIRONMENT === "sandbox" ? "https://sandbox.orcid.org" : "https://orcid.org";
}

function orcidApiBase(runtime: Record<string, string | undefined>) {
  return runtime.ORCID_ENVIRONMENT === "sandbox" ? "https://pub.sandbox.orcid.org" : "https://pub.orcid.org";
}
