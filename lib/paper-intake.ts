import { env } from "cloudflare:workers";
import {
  allSources,
  allWikiPages,
  canonicalArticleId,
  getSource,
  getWikiPage,
} from "@/lib/wikibiome";
import manifest from "@/data/content-manifest.generated.json";
import {
  assertPaperDecision,
  assertFreshTargets,
  hasPaperConflict,
  normalizePaperDoi,
  paperIdentity,
  publicationEligible,
  validateEvidencePacket,
} from "@/lib/paper-intake-policy.mjs";
import {
  enforceRateLimit,
  isModeratorRole,
  type ResearcherSession,
} from "@/lib/research-network";
import type { Paper, PaperPacket, PaperRow } from "@/lib/paper-intake-types";

export const paperRuntime = () =>
  env as unknown as {
    DB: D1Database;
    MANUSCRIPTS?: R2Bucket;
    WIKIBIOME_INTAKE_SERVICE_URL?: string;
    WIKIBIOME_INTAKE_SERVICE_SECRET?: string;
    WIKIBIOME_INTAKE_BRIDGE_SECRET?: string;
    WIKIBIOME_PAPER_UPLOADS_ENABLED?: string;
  };
const db = () => paperRuntime().DB;
export const q = (sql: string, ...values: unknown[]) =>
  db()
    .prepare(sql)
    .bind(...values);
export async function digest(value: string | ArrayBuffer) {
  return [
    ...new Uint8Array(
      await crypto.subtle.digest(
        "SHA-256",
        typeof value === "string" ? new TextEncoder().encode(value) : value,
      ),
    ),
  ]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
export async function articleHash(id: string) {
  const p = getWikiPage(id);
  return p
    ? digest(
        JSON.stringify({
          id: p.id,
          overview: p.overview,
          sections: p.sections,
          sources: p.sources,
        }),
      )
    : "new";
}
export function fromRow(row: PaperRow): Paper {
  return {
    id: row.id,
    accountId: row.account_id,
    title: row.title,
    topic: row.topic,
    status: row.status,
    packet: JSON.parse(row.packet_json),
    fileKey: row.file_key,
    fileHash: row.file_hash,
    revision: row.revision,
    reviewerAccountId: row.reviewer_account_id,
    editorAccountId: row.editor_account_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
export async function rawPaper(id: string) {
  const r = await q(
    "SELECT * FROM paper_intakes WHERE id = ?",
    id,
  ).first<PaperRow>();
  return r ? fromRow(r) : null;
}
export async function appointed(accountId: string, topic?: string) {
  return Boolean(
    await q(
      `SELECT account_id FROM paper_reviewers WHERE account_id = ? AND active = 1${topic ? " AND topic = ?" : ""} LIMIT 1`,
      ...[accountId, ...(topic ? [topic] : [])],
    ).first(),
  );
}
export async function paperAccess(account: ResearcherSession, id: string) {
  const paper = await rawPaper(id);
  if (
    !paper ||
    !(
      paper.accountId === account.accountId ||
      isModeratorRole(account.role) ||
      (paper.reviewerAccountId === account.accountId &&
        (await appointed(account.accountId, paper.topic)))
    )
  )
    throw new Error("Paper not found or access unavailable.");
  return paper;
}
export async function paperCapabilities() {
  const r = paperRuntime();
  const processing = Boolean(
    r.WIKIBIOME_INTAKE_SERVICE_URL?.startsWith("https://") &&
    r.WIKIBIOME_INTAKE_SERVICE_SECRET &&
    r.WIKIBIOME_INTAKE_BRIDGE_SECRET,
  );
  const staff = Number(
    (
      await q(
        "SELECT COUNT(*) AS n FROM paper_reviewers WHERE active = 1",
      ).first<{ n: number }>()
    )?.n || 0,
  );
  return {
    processing,
    reviewers: staff,
    uploads:
      processing &&
      staff > 0 &&
      r.WIKIBIOME_PAPER_UPLOADS_ENABLED === "1" &&
      Boolean(r.MANUSCRIPTS),
  };
}
export async function listPapers(account: ResearcherSession, review = false) {
  const where = review
    ? isModeratorRole(account.role)
      ? "1 = 1"
      : "reviewer_account_id = ?"
    : "account_id = ?";
  const args =
    review && isModeratorRole(account.role) ? [] : [account.accountId];
  const rows = await q(
    `SELECT * FROM paper_intakes WHERE ${where} ORDER BY updated_at DESC LIMIT 100`,
    ...args,
  ).all<PaperRow>();
  return rows.results.map(fromRow);
}
export async function reviewerRoster() {
  return (
    await q(
      "SELECT r.*, a.display_name, p.orcid FROM paper_reviewers r JOIN accounts a ON a.id = r.account_id LEFT JOIN researcher_profiles p ON p.account_id = a.id ORDER BY a.display_name",
    ).all()
  ).results;
}
export async function appointReviewer(
  actor: ResearcherSession,
  orcid: string,
  topic: string,
  active: boolean,
) {
  if (actor.role !== "site_admin")
    throw new Error("Administrator access is required to appoint reviewers.");
  if (!getWikiPage(topic) || canonicalArticleId(topic) !== topic)
    throw new Error("Choose an existing canonical topic.");
  const person = await q(
    "SELECT p.account_id FROM researcher_profiles p JOIN researcher_emails e ON e.account_id = p.account_id WHERE p.orcid = ? AND e.verified_at IS NOT NULL LIMIT 1",
    orcid.trim(),
  ).first<{ account_id: string }>();
  if (!person)
    throw new Error(
      "The reviewer needs an ORCID profile and verified private email.",
    );
  await db().batch([
    q(
      "INSERT INTO paper_reviewers (account_id, topic, active, appointed_by) VALUES (?, ?, ?, ?) ON CONFLICT(account_id, topic) DO UPDATE SET active = excluded.active, appointed_by = excluded.appointed_by",
      person.account_id,
      topic,
      active ? 1 : 0,
      actor.accountId,
    ),
    q(
      "INSERT INTO paper_events (id, intake_id, actor_id, kind, revision, detail_json) VALUES (?, 'reviewer-roster', ?, 'reviewer_appointment', 1, ?)",
      crypto.randomUUID(),
      actor.accountId,
      JSON.stringify({ accountId: person.account_id, topic, active }),
    ),
  ]);
}
export async function savePaper(
  paper: Paper,
  actorId: string | null,
  kind: string,
  detail: unknown,
  extra: D1PreparedStatement[] = [],
) {
  const mutationId = crypto.randomUUID();
  const packet = JSON.stringify({ ...paper.packet, mutationId });
  const results = await db().batch([
    q(
      "UPDATE paper_intakes SET title = ?, identity_key = ?, status = ?, topic = ?, packet_json = ?, file_key = ?, file_hash = ?, reviewer_account_id = ?, editor_account_id = ?, revision = revision + 1, updated_at = ? WHERE id = ? AND revision = ?",
      paper.packet.metadata.title,
      paperIdentity(paper.packet.metadata),
      paper.status,
      paper.topic,
      packet,
      paper.fileKey,
      paper.fileHash,
      paper.reviewerAccountId,
      paper.editorAccountId,
      new Date().toISOString(),
      paper.id,
      paper.revision,
    ),
    q(
      "INSERT INTO paper_events (id, intake_id, actor_id, kind, revision, detail_json) SELECT ?, id, ?, ?, revision, ? FROM paper_intakes WHERE id = ? AND json_extract(packet_json, '$.mutationId') = ?",
      mutationId,
      actorId,
      kind,
      JSON.stringify(detail),
      paper.id,
      mutationId,
    ),
    ...extra,
  ]);
  if (!results[0].meta.changes)
    throw new Error(
      "This paper changed in another session. Reload before trying again.",
    );
  return (await rawPaper(paper.id))!;
}
export async function createPaper(
  account: ResearcherSession,
  input: Record<string, unknown>,
) {
  if (!account.emailVerified)
    throw new Error("Verify your private email before submitting a paper.");
  await enforceRateLimit(account.accountId, "paper.create", 10, 1440);
  const title = String(input.title || "")
    .trim()
    .slice(0, 1000);
  const topic = canonicalArticleId(String(input.topic || ""));
  const authors = String(input.authors || "")
    .split(";")
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, 100);
  const doi = normalizePaperDoi(input.doi);
  if (!title || !authors.length || !getWikiPage(topic))
    throw new Error("Add a title, authors, and an existing topic.");
  if (doi && !/^10\.\d{4,9}\/\S+$/.test(doi))
    throw new Error("Check the DOI, or leave it blank.");
  if (input.rightsAttested !== true)
    throw new Error(
      "Confirm that you have permission to provide this paper for private ingestion.",
    );
  const metadata: PaperPacket["metadata"] = {
    title,
    authors,
    authorOrcids: input.isAuthor === true ? [account.orcid] : [],
    year: Number(input.year) || new Date().getFullYear(),
    doi,
    publicationStatus: String(
      input.publicationStatus || "Not yet verified",
    ).slice(0, 300),
    license: String(
      input.license || "Rights attested for private ingestion",
    ).slice(0, 300),
    sourceId: "",
    affiliations: [],
    abstract: "",
  };
  const identity = paperIdentity(metadata);
  const duplicate = await q(
    "SELECT id, account_id FROM paper_intakes WHERE identity_key = ?",
    identity,
  ).first<{ id: string; account_id: string }>();
  if (duplicate)
    return {
      duplicate: true,
      id: duplicate.account_id === account.accountId ? duplicate.id : null,
    };
  const existing = doi
    ? Object.entries(allSources).find(
        ([, s]) => normalizePaperDoi(s.doi) === doi,
      )
    : null;
  const id = crypto.randomUUID();
  metadata.sourceId = existing?.[0] || `paper-${id}`;
  const packet: PaperPacket = {
    metadata,
    claims: [],
    changes: [],
    references: [],
    flags: existing
      ? [
          {
            id: "existing-source",
            message:
              "This source is already in WikiBiome. Propose improvements to its existing record.",
            blocking: false,
          },
        ]
      : [],
    provenance: {
      mode: "researcher_upload",
      documentHash: "",
      pageCount: 0,
      scanStatus: "awaiting_file",
    },
  };
  await db().batch([
    q(
      "INSERT INTO paper_intakes (id, account_id, identity_key, title, topic, packet_json) VALUES (?, ?, ?, ?, ?, ?)",
      id,
      account.accountId,
      identity,
      title,
      topic,
      JSON.stringify(packet),
    ),
    q(
      "INSERT INTO paper_events (id, intake_id, actor_id, kind, revision, detail_json) VALUES (?, ?, ?, 'created', 1, ?)",
      crypto.randomUUID(),
      id,
      account.accountId,
      JSON.stringify({ rightsAttested: true }),
    ),
  ]);
  return { id, duplicate: false };
}
export async function hydratePacket(packet: PaperPacket) {
  for (const change of packet.changes) {
    change.targetId = canonicalArticleId(change.targetId);
    const page = getWikiPage(change.targetId);
    change.title = page?.title || change.title;
    change.baseHash = await articleHash(change.targetId);
    change.currentText =
      page?.sections?.find((s) => s.heading === change.section)?.body ||
      page?.overview ||
      "New article";
  }
  for (const ref of packet.references) {
    const match =
      ref.doi &&
      Object.entries(allSources).find(
        ([, s]) => normalizePaperDoi(s.doi) === normalizePaperDoi(ref.doi),
      );
    ref.matchedSourceId = match ? match[0] : null;
    ref.status = match
      ? "Existing source · passage verification required"
      : "Secondary citation · underlying source not checked";
  }
  return packet;
}
export async function actOnPaper(
  account: ResearcherSession,
  id: string,
  input: Record<string, unknown>,
) {
  const paper = await paperAccess(account, id);
  if (paper.revision !== Number(input.revision))
    throw new Error("This paper has changed. Reload before saving.");
  const action = String(input.action);
  if (action === "assign") {
    if (
      !isModeratorRole(account.role) ||
      !["awaiting_reviewer", "in_review", "recommended"].includes(paper.status)
    )
      throw new Error("Only editors can assign a paper ready for review.");
    const reviewer = await q(
      "SELECT a.id AS accountId, a.display_name AS displayName, p.orcid FROM accounts a JOIN researcher_profiles p ON p.account_id = a.id WHERE p.orcid = ?",
      String(input.orcid || "").trim(),
    ).first<{ accountId: string; displayName: string; orcid: string }>();
    if (
      !reviewer ||
      !(await appointed(reviewer.accountId, paper.topic)) ||
      hasPaperConflict(reviewer, paper)
    )
      throw new Error(
        "Choose an independent reviewer appointed for this topic.",
      );
    paper.reviewerAccountId = reviewer.accountId;
    paper.editorAccountId = null;
    paper.status = "in_review";
    delete paper.packet.review;
    delete paper.packet.approval;
  } else if (action === "confirm" || action === "revise") {
    if (paper.accountId !== account.accountId && !isModeratorRole(account.role))
      throw new Error(
        "Only the submitter or an editor can revise this packet.",
      );
    if (
      ![
        "metadata_review",
        "needs_revision",
        "awaiting_reviewer",
        "in_review",
        "recommended",
        "approved",
      ].includes(paper.status)
    )
      throw new Error("This paper is not editable at this stage.");
    paper.packet.provenance.knownAuthors = [
      ...new Set([
        ...(paper.packet.provenance.knownAuthors || []),
        ...paper.packet.metadata.authors,
      ]),
    ];
    paper.packet.provenance.knownAuthorOrcids = [
      ...new Set([
        ...(paper.packet.provenance.knownAuthorOrcids || []),
        ...paper.packet.metadata.authorOrcids,
      ]),
    ];
    if (typeof input.authors === "string") {
      const names = input.authors
        .split(";")
        .map((n) => n.trim())
        .filter(Boolean)
        .slice(0, 100);
      if (!names.length)
        throw new Error("Keep at least one author in the citation record.");
      paper.packet.metadata.authors = names;
    }
    if (typeof input.doi === "string") {
      const doi = normalizePaperDoi(input.doi);
      if (doi && !/^10\.\d{4,9}\/\S+$/.test(doi))
        throw new Error("Check the DOI format.");
      paper.packet.metadata.doi = doi;
    }
    if (input.year) {
      const year = Number(input.year);
      if (!Number.isInteger(year) || year < 1600 || year > 2100)
        throw new Error("Check the publication year.");
      paper.packet.metadata.year = year;
    }
    if (typeof input.affiliations === "string")
      paper.packet.metadata.affiliations = input.affiliations
        .split(";")
        .map((n) => n.trim())
        .filter(Boolean)
        .slice(0, 20);
    if (input.title)
      paper.packet.metadata.title = String(input.title).trim().slice(0, 1000);
    if (input.publicationStatus)
      paper.packet.metadata.publicationStatus = String(input.publicationStatus)
        .trim()
        .slice(0, 300);
    if (input.license)
      paper.packet.metadata.license = String(input.license)
        .trim()
        .slice(0, 300);
    const texts = input.texts as Record<string, string> | undefined;
    if (texts)
      for (const c of paper.packet.changes)
        if (texts[c.targetId]?.trim())
          c.proposedText = texts[c.targetId].trim().slice(0, 18000);
    if (Array.isArray(input.selectedTargets)) {
      const selected = new Set(input.selectedTargets.map(String));
      if (
        !selected.size ||
        [...selected].some(
          (id) => !paper.packet.changes.some((c) => c.targetId === id),
        )
      )
        throw new Error(
          "Select at least one of this packet's proposed destinations.",
        );
      paper.packet.changes = paper.packet.changes.filter((c) =>
        selected.has(c.targetId),
      );
    }
    const resolutions = input.resolutions as Record<string, string> | undefined;
    if (resolutions)
      for (const flag of paper.packet.flags)
        if (resolutions[flag.id]?.trim()) {
          flag.resolved = true;
          flag.resolution = resolutions[flag.id].trim().slice(0, 4000);
        }
    await hydratePacket(paper.packet);
    paper.packet.metadataConfirmed = true;
    delete paper.packet.review;
    delete paper.packet.approval;
    paper.reviewerAccountId = null;
    paper.editorAccountId = null;
    paper.status = "awaiting_reviewer";
  } else if (action === "recommend" || action === "approve") {
    assertPaperDecision({
      actor: account,
      paper,
      action,
      appointed: await appointed(account.accountId, paper.topic),
      disclosure: input.disclosure,
      confirmedIndependent: input.confirmedIndependent === true,
    });
    const note = String(input.note || "")
      .trim()
      .slice(0, 8000);
    if (!note)
      throw new Error("Explain your decision with reference to the evidence.");
    const hashes = Object.fromEntries(
      await Promise.all(
        paper.packet.changes.map(async (c) => [
          c.targetId,
          await articleHash(c.targetId),
        ]),
      ),
    );
    assertFreshTargets(paper.packet.changes, hashes);
    if (action === "recommend") {
      const recommendation = String(input.recommendation);
      if (!["accept", "revise", "decline"].includes(recommendation))
        throw new Error("Choose a review recommendation.");
      paper.packet.review = {
        recommendation,
        note,
        disclosure: String(input.disclosure),
        revision: paper.revision + 1,
      };
      paper.status =
        recommendation === "revise" ? "needs_revision" : "recommended";
    } else {
      if (!(await appointed(paper.reviewerAccountId || "", paper.topic)))
        throw new Error(
          "The reviewer appointment is no longer active. Assign another reviewer.",
        );
      const decision = String(input.decision);
      if (!["accept", "revise", "decline"].includes(decision))
        throw new Error("Choose an editorial decision.");
      if (
        decision === "accept" &&
        (paper.packet.review?.recommendation !== "accept" ||
          paper.packet.flags.some((f) => f.blocking && !f.resolved))
      )
        throw new Error(
          "An accepting review and resolution of blocking evidence issues are required.",
        );
      paper.packet.approval = {
        note,
        disclosure: String(input.disclosure),
        revision: paper.revision + 1,
      };
      paper.editorAccountId = account.accountId;
      paper.status =
        decision === "accept"
          ? "approved"
          : decision === "revise"
            ? "needs_revision"
            : "declined";
    }
  } else if (action === "retry") {
    if (paper.accountId !== account.accountId && !isModeratorRole(account.role))
      throw new Error("Only the submitter or an editor can retry processing.");
    if (
      !["processing_failed", "awaiting_processing"].includes(paper.status) ||
      !paper.fileKey
    )
      throw new Error("There is no failed job to retry.");
    paper.status = "awaiting_processing";
  } else throw new Error("Unknown paper action.");
  const saved = await savePaper(paper, account.accountId, action, {
    note: input.note || "",
    decision: input.decision || input.recommendation || "",
    reviewer: paper.reviewerAccountId,
  });
  if (action === "retry") return dispatchPaper(saved);
  return saved;
}
export async function dispatchPaper(paper: Paper) {
  const runtime = paperRuntime();
  if (
    !runtime.WIKIBIOME_INTAKE_SERVICE_URL ||
    !runtime.WIKIBIOME_INTAKE_SERVICE_SECRET
  )
    return paper;
  paper.status = "processing";
  paper = await savePaper(paper, null, "processing_started", {});
  try {
    const response = await fetch(runtime.WIKIBIOME_INTAKE_SERVICE_URL, {
      method: "POST",
      headers: {
        authorization: `Bearer ${runtime.WIKIBIOME_INTAKE_SERVICE_SECRET}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: paper.id,
        revision: paper.revision,
        hash: paper.fileHash,
      }),
      signal: AbortSignal.timeout(10000),
      redirect: "error",
    });
    if (!response.ok)
      throw new Error(
        "Processing service unavailable. Your PDF is saved; retry processing later.",
      );
    return paper;
  } catch {
    paper.status = "processing_failed";
    paper.packet.processingError =
      "Processing service unavailable. Your PDF is saved; retry processing later.";
    return savePaper(paper, null, "dispatch_failed", {});
  }
}
export async function paperEvents(id: string) {
  return (
    await q(
      "SELECT e.kind, e.revision, e.detail_json, e.created_at, a.display_name AS actor FROM paper_events e LEFT JOIN accounts a ON a.id = e.actor_id WHERE intake_id = ? ORDER BY e.created_at, e.rowid",
      id,
    ).all()
  ).results;
}
export function corpusForIntake() {
  return allWikiPages.map((p) => ({
    id: p.id,
    title: p.title,
    overview: p.overview?.slice(0, 1800),
    sections: p.sections?.map((s) => s.heading),
  }));
}
export async function verifyPaperPublication(
  account: ResearcherSession,
  id: string,
) {
  const paper = await paperAccess(account, id);
  if (!isModeratorRole(account.role) || hasPaperConflict(account, paper))
    throw new Error("An independent editor must verify publication.");
  if (paper.status === "published") {
    const { recalculateRecognition } =
      await import("@/lib/research-network-v2");
    await recalculateRecognition(paper.accountId);
    return paper;
  }
  const source = getSource(paper.packet.metadata.sourceId);
  const targets = Object.fromEntries(
    paper.packet.changes.map((c) => {
      const p = getWikiPage(c.targetId);
      const body = p?.sections?.map((s) => s.body).join("\n") || "";
      return [
        c.targetId,
        {
          hasSource: Boolean(
            p?.sources?.includes(paper.packet.metadata.sourceId) ||
            body.includes(`[[${paper.packet.metadata.sourceId}]]`),
          ),
          hasText: body.includes(c.proposedText),
        },
      ];
    }),
  );
  const doiMatches =
    source &&
    normalizePaperDoi(source.doi) ===
      normalizePaperDoi(paper.packet.metadata.doi);
  const valid = publicationEligible(paper, {
    sourceExists: Boolean(source),
    sameCommit: /^[a-f0-9]{40}$/.test(manifest.source.commit || ""),
    sourceMetadataMatches: Boolean(
      doiMatches && source?.title === paper.packet.metadata.title,
    ),
    targets,
  });
  if (!valid)
    throw new Error(
      "Publication is not yet verified: the deployed corpus must contain the source and every approved passage. No credit was awarded.",
    );
  // This check executes in the deployed site, against its own audited corpus manifest.
  // It never accepts a client-supplied commit or success boolean as publication proof.
  paper.status = "published";
  const published = await savePaper(
    paper,
    account.accountId,
    "published",
    {
      sourceId: paper.packet.metadata.sourceId,
      sourceCommit: manifest.source.commit,
      targets: paper.packet.changes.map((c) => c.targetId),
    },
    [
      q(
        "INSERT INTO paper_publications (source_id, intake_id, account_id, source_commit, targets_json) SELECT ?, id, account_id, ?, ? FROM paper_intakes WHERE id = ? AND status = 'published' AND revision = ? ON CONFLICT(source_id) DO NOTHING",
        paper.packet.metadata.sourceId,
        manifest.source.commit,
        JSON.stringify(paper.packet.changes.map((c) => c.targetId)),
        id,
        paper.revision + 1,
      ),
    ],
  );
  const { recalculateRecognition } = await import("@/lib/research-network-v2");
  await recalculateRecognition(paper.accountId);
  return published;
}

export async function publishedPaperDetails(sourceId: string) {
  try {
    if (!getSource(sourceId)) return null;
    const row = await q(
      "SELECT p.packet_json, x.published_at FROM paper_publications x JOIN paper_intakes p ON p.id = x.intake_id WHERE x.source_id = ? AND p.status = 'published'",
      sourceId,
    ).first<{ packet_json: string; published_at: string }>();
    if (!row) return null;
    const packet = JSON.parse(row.packet_json) as PaperPacket;
    return {
      metadata: packet.metadata,
      publishedAt: row.published_at,
      targets: packet.changes.map((c) => ({ id: c.targetId, title: c.title })),
      reviewNote: packet.review?.note,
      editorNote: packet.approval?.note,
    };
  } catch {
    return null;
  }
}
export async function publishedOrganizationPapers(name: string) {
  try {
    const rows = await q(
      "SELECT x.source_id, p.packet_json FROM paper_publications x JOIN paper_intakes p ON p.id = x.intake_id WHERE p.status = 'published' ORDER BY x.published_at DESC LIMIT 200",
    ).all<{ source_id: string; packet_json: string }>();
    const norm = (s: string) =>
      s
        .toLowerCase()
        .replace(/\s*\(ics\)/g, "")
        .trim();
    return rows.results.flatMap((row) => {
      const m = (JSON.parse(row.packet_json) as PaperPacket).metadata;
      return getSource(row.source_id) &&
        m.affiliations.some((a) => norm(a) === norm(name))
        ? [{ id: row.source_id, title: m.title, status: m.publicationStatus }]
        : [];
    });
  } catch {
    return [];
  }
}

export async function publishedResearcherPapers(accountId: string) {
  try {
    const rows = await q(
      "SELECT x.source_id, x.published_at, p.packet_json FROM paper_publications x JOIN paper_intakes p ON p.id = x.intake_id WHERE x.account_id = ? AND p.status = 'published' ORDER BY x.published_at DESC LIMIT 200",
      accountId,
    ).all<{ source_id: string; published_at: string; packet_json: string }>();
    return rows.results.flatMap((row) => {
      const packet = JSON.parse(row.packet_json) as PaperPacket;
      return getSource(row.source_id)
        ? [
            {
              id: row.source_id,
              title: packet.metadata.title,
              publishedAt: row.published_at,
              status: packet.metadata.publicationStatus,
              targets: packet.changes.map((change) => ({
                id: change.targetId,
                title: change.title,
              })),
            },
          ]
        : [];
    });
  } catch {
    return [];
  }
}
