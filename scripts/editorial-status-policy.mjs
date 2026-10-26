import registry from "../data/editorial-statuses.json" with { type: "json" };

export const EDITORIAL_STATUS_POLICY_VERSION = 1;

const ALLOWED_DISPOSITIONS = new Set([
  "evidence_insufficient",
  "source_structure_deferred",
  "structural_exemption",
]);
const NON_WAIVABLE_WARNINGS = new Set(["empty_public_sections", "orphaned_evidence"]);
const KNOWN_WARNINGS = new Set([
  "below_evidence_threshold",
  "empty_public_sections",
  "missing_introduction",
  "no_references",
  "no_substantive_content",
  "orphaned_evidence",
]);

export function normalizeEditorialId(value) {
  return String(value ?? "")
    .replace(/\.md$/i, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function editorialRecordKey(page, occurrence) {
  const base = `${normalizeEditorialId(page.id)}::${normalizeEditorialId(page.category)}`;
  return occurrence ? `${base}::${occurrence}` : base;
}

export function getExpandedEditorialStatuses() {
  const statuses = {};
  for (const group of registry.groups ?? []) {
    for (const key of group.records ?? []) {
      if (statuses[key]) throw new Error(`Editorial record ${key} appears in more than one status group.`);
      statuses[key] = {
        group: group.id,
        disposition: group.disposition,
        approved: group.approved,
        resolves: group.resolves,
        rationale: group.rationale,
        publicLabel: group.publicLabel,
      };
    }
  }
  return statuses;
}

export function validateEditorialStatusRegistry(sourceCommit, pages) {
  if (registry.schemaVersion !== EDITORIAL_STATUS_POLICY_VERSION) {
    throw new Error(`Editorial status registry schema ${registry.schemaVersion} does not match policy ${EDITORIAL_STATUS_POLICY_VERSION}.`);
  }
  if (!sourceCommit || registry.sourceCommit !== sourceCommit) {
    throw new Error(`Editorial statuses were reviewed for ${registry.sourceCommit}, not ${sourceCommit ?? "an unknown source commit"}. Re-audit statuses before synchronizing.`);
  }
  if (!String(registry.reviewedAt ?? "").trim() || !String(registry.authority ?? "").trim()) {
    throw new Error("The editorial status registry must name its review date and approval authority.");
  }

  const occurrences = new Map();
  const pageKeys = new Set();
  for (const page of pages ?? []) {
    const baseKey = editorialRecordKey(page);
    const occurrence = (occurrences.get(baseKey) ?? 0) + 1;
    occurrences.set(baseKey, occurrence);
    pageKeys.add(baseKey);
    pageKeys.add(editorialRecordKey(page, occurrence));
  }
  const statuses = getExpandedEditorialStatuses();
  const groupIds = new Set();
  for (const group of registry.groups ?? []) {
    if (!String(group.id ?? "").trim()) throw new Error("Every editorial status group requires a stable id.");
    if (groupIds.has(group.id)) throw new Error(`Editorial status group ${group.id} is duplicated.`);
    groupIds.add(group.id);
    if (!Array.isArray(group.records) || !group.records.length) throw new Error(`Editorial status group ${group.id} must list its reviewed records.`);
  }
  for (const [key, status] of Object.entries(statuses)) {
    if (!pageKeys.has(key)) throw new Error(`Editorial status ${key} does not match a canonical corpus record.`);
    if (!ALLOWED_DISPOSITIONS.has(status.disposition)) throw new Error(`Editorial status ${key} has unsupported disposition ${status.disposition}.`);
    if (status.approved !== true) throw new Error(`Editorial status ${key} is not explicitly approved.`);
    if (!Array.isArray(status.resolves) || !status.resolves.length) throw new Error(`Editorial status ${key} must name the warning codes it resolves.`);
    if (status.resolves.some((code) => !KNOWN_WARNINGS.has(code))) {
      throw new Error(`Editorial status ${key} names an unknown warning code.`);
    }
    if (status.resolves.some((code) => NON_WAIVABLE_WARNINGS.has(code))) {
      throw new Error(`Editorial status ${key} attempts to waive a non-waivable integrity warning.`);
    }
    if (!String(status.rationale ?? "").trim()) throw new Error(`Editorial status ${key} must record its evidence-based rationale.`);
    if (!String(status.publicLabel ?? "").trim()) throw new Error(`Editorial status ${key} must provide a public label.`);
  }
  return registry;
}

export function applyEditorialStatusPolicy(content, sourceCommit) {
  validateEditorialStatusRegistry(sourceCommit, content.pages);
  const statuses = getExpandedEditorialStatuses();
  const occurrences = new Map();
  const pages = content.pages.map((page) => {
    const baseKey = editorialRecordKey(page);
    const occurrence = (occurrences.get(baseKey) ?? 0) + 1;
    occurrences.set(baseKey, occurrence);
    const status = statuses[editorialRecordKey(page, occurrence)] ?? statuses[baseKey];
    return status ? { ...page, editorialStatus: { ...status } } : page;
  });
  return {
    content: { ...content, pages },
    appliedCount: pages.filter((page) => page.editorialStatus).length,
    registeredCount: Object.keys(statuses).length,
  };
}

export function getEditorialStatusRegistry() {
  return registry;
}
