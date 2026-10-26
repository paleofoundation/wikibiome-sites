#!/usr/bin/env node

import content from "../data/content.generated.json" with { type: "json" };
import manifest from "../data/content-manifest.generated.json" with { type: "json" };
import sourceAliasRegistry from "../data/source-id-aliases.json" with { type: "json" };
import { isStructuralParentSection, substantiveMarkdown } from "./public-content-policy.mjs";
import {
  editorialRecordKey,
  getExpandedEditorialStatuses,
  validateEditorialStatusRegistry,
} from "./editorial-status-policy.mjs";

const asJson = process.argv.includes("--json");
const strict = process.argv.includes("--strict");
const includeRecords = process.argv.includes("--records");
const suggestStatuses = process.argv.includes("--suggest-statuses");

const normalizeId = (value) => String(value ?? "")
  .replace(/\.md$/i, "")
  .toLowerCase()
  .trim()
  .replace(/\s+/g, "-")
  .replace(/[^a-z0-9-]/g, "");

const sourceAliases = Object.fromEntries(
  Object.entries(sourceAliasRegistry.aliases ?? {}).map(([alias, target]) => [normalizeId(alias), normalizeId(target)]),
);
const sourceIds = new Set(Object.keys(content.sourceLookup).map(normalizeId));
const pageIds = new Set(content.pages.map((page) => normalizeId(page.id)));
validateEditorialStatusRegistry(manifest.source?.commit, content.pages);
const registeredEditorialStatuses = getExpandedEditorialStatuses();

function canonicalRouteId(page) {
  const id = normalizeId(page.id);
  return page.category === "signature" ? id.replace(/-signature$/, "") : id;
}

function sourceReferences(page) {
  const references = [];
  const add = (value) => {
    const rawId = normalizeId(value);
    const id = sourceAliases[rawId] ?? rawId;
    if (id && !references.includes(id)) references.push(id);
  };

  const body = [
    page.overview ?? "",
    ...(page.sections ?? []).map((section) => section.body ?? ""),
  ].join("\n");
  for (const match of body.matchAll(/\[?\[\[([^\]|]+?)(?:\|[^\]]+)?\]\]\]?/g)) {
    const rawId = normalizeId(match[1]);
    const canonicalId = sourceAliases[rawId] ?? rawId;
    const looksLikeSource = sourceIds.has(canonicalId) || /^[a-z]+-(?:[a-z]+-)*\d{4}-/.test(rawId);
    if (rawId && !pageIds.has(rawId) && looksLikeSource) add(rawId);
  }
  for (const value of [
    ...(Array.isArray(page.sources) ? page.sources : []),
    ...(Array.isArray(page.frontmatter?.sources) ? page.frontmatter.sources : []),
  ]) add(value);
  return references;
}

function canonicalReferences(page) {
  if (page.category !== "signature") return sourceReferences(page);
  const canonicalId = canonicalRouteId(page);
  return [...new Set(content.pages
    .filter((candidate) => (
      (candidate.category === "disease" && normalizeId(candidate.id) === canonicalId)
        || (candidate.category === "signature" && canonicalRouteId(candidate) === canonicalId)
    ))
    .flatMap(sourceReferences))];
}

function warningsFor(page) {
  const sections = page.sections ?? [];
  const ownReferences = sourceReferences(page);
  const references = canonicalReferences(page);
  const warnings = [];
  const notices = [];
  const emptyLeafSections = sections.filter((section, index) => (
    !String(section.body ?? "").trim() && !isStructuralParentSection(sections, index)
  ));
  const suppressedPlaceholders = sections.filter((section, index) => (
    String(section.body ?? "").trim()
      && !substantiveMarkdown(section.body)
      && !isStructuralParentSection(sections, index)
  ));
  const structuralHeadings = sections.filter((section, index) => isStructuralParentSection(sections, index));
  const missingMetadata = references.filter((id) => !sourceIds.has(id));

  if (!substantiveMarkdown(page.overview)) warnings.push("missing_introduction");
  if (!substantiveMarkdown(page.overview)
      && !sections.some((section) => substantiveMarkdown(section.body))) warnings.push("no_substantive_content");
  if (emptyLeafSections.length) warnings.push("empty_public_sections");
  if (!references.length) warnings.push("no_references");
  if (missingMetadata.length) warnings.push("orphaned_evidence");
  const belowThreshold = page.category === "signature"
    ? references.length < Number(page.threshold ?? 0)
    : page.belowThreshold;
  const ownBelowThreshold = page.category === "signature"
    && ownReferences.length < Number(page.threshold ?? 0);
  if (belowThreshold && !page.isStub) warnings.push("below_evidence_threshold");
  if (page.category === "signature" && !ownReferences.length && references.length) notices.push("canonical_signature_reference_reconciliation");
  if (ownBelowThreshold && !belowThreshold && !page.isStub) notices.push("canonical_signature_threshold_reconciliation");
  if (page.category === "signature" && page.belowThreshold && !ownBelowThreshold && !page.isStub) notices.push("generated_signature_threshold_reconciliation");
  if (structuralHeadings.length) notices.push("structural_parent_headings");
  if (suppressedPlaceholders.length) notices.push("suppressed_source_placeholders");

  return {
    warnings,
    notices,
    references,
    ownReferences,
    missingMetadata,
    emptyLeafSections: emptyLeafSections.map((section) => section.heading),
    structuralHeadings: structuralHeadings.map((section) => section.heading),
    suppressedPlaceholders: suppressedPlaceholders.map((section) => section.heading),
  };
}

const editorialOccurrences = new Map();
const records = content.pages.map((page, index) => {
  const audit = warningsFor(page);
  const status = page.editorialStatus ?? null;
  const baseRecordKey = editorialRecordKey(page);
  const occurrence = (editorialOccurrences.get(baseRecordKey) ?? 0) + 1;
  editorialOccurrences.set(baseRecordKey, occurrence);
  const exactRecordKey = editorialRecordKey(page, occurrence);
  const recordKey = registeredEditorialStatuses[exactRecordKey] ? exactRecordKey : baseRecordKey;
  const justifiedWarnings = status
    ? audit.warnings.filter((code) => status.resolves.includes(code))
    : [];
  const unresolvedWarnings = audit.warnings.filter((code) => !justifiedWarnings.includes(code));
  return {
    key: `${normalizeId(page.id)}:${index + 1}`,
    recordKey,
    id: normalizeId(page.id),
    routeId: canonicalRouteId(page),
    title: page.title,
    category: page.category,
    ...audit,
    status,
    justifiedWarnings,
    unresolvedWarnings,
  };
});

const warningCodes = [...new Set(records.flatMap((record) => record.warnings))].sort();
const noticeCodes = [...new Set(records.flatMap((record) => record.notices))].sort();
const unresolvedWarningCodes = [...new Set(records.flatMap((record) => record.unresolvedWarnings))].sort();
const justifiedWarningCodes = [...new Set(records.flatMap((record) => record.justifiedWarnings))].sort();
const warningSummary = Object.fromEntries(warningCodes.map((code) => {
  const affected = records.filter((record) => record.warnings.includes(code));
  return [code, {
    records: affected.length,
    routes: new Set(affected.map((record) => record.routeId)).size,
    samples: affected.slice(0, 8).map((record) => record.id),
  }];
}));
const noticeSummary = Object.fromEntries(noticeCodes.map((code) => {
  const affected = records.filter((record) => record.notices.includes(code));
  return [code, {
    records: affected.length,
    routes: new Set(affected.map((record) => record.routeId)).size,
    samples: affected.slice(0, 8).map((record) => record.id),
  }];
}));
const unresolvedWarningSummary = Object.fromEntries(unresolvedWarningCodes.map((code) => {
  const affected = records.filter((record) => record.unresolvedWarnings.includes(code));
  return [code, {
    records: affected.length,
    routes: new Set(affected.map((record) => record.routeId)).size,
    samples: affected.slice(0, 8).map((record) => record.id),
  }];
}));
const justifiedWarningSummary = Object.fromEntries(justifiedWarningCodes.map((code) => {
  const affected = records.filter((record) => record.justifiedWarnings.includes(code));
  return [code, {
    records: affected.length,
    routes: new Set(affected.map((record) => record.routeId)).size,
    samples: affected.slice(0, 8).map((record) => record.id),
  }];
}));

const recordsWithWarnings = records.filter((record) => record.warnings.length);
const recordsWithUnresolvedWarnings = records.filter((record) => record.unresolvedWarnings.length);
const recordsWithJustifiedWarnings = records.filter((record) => record.justifiedWarnings.length);
const statusCoverageProblems = [];
for (const record of records.filter((candidate) => candidate.status)) {
  if (!registeredEditorialStatuses[record.recordKey]) {
    statusCoverageProblems.push(`${record.recordKey}: generated content has an unregistered editorial status`);
  }
}
for (const [key, registered] of Object.entries(registeredEditorialStatuses)) {
  const matching = records.filter((record) => record.recordKey === key);
  const presentCodes = new Set(matching.flatMap((record) => record.warnings));
  for (const code of registered.resolves) {
    if (!presentCodes.has(code)) statusCoverageProblems.push(`${key}: registered resolution ${code} no longer matches a current warning`);
  }
  if (matching.some((record) => JSON.stringify(record.status) !== JSON.stringify(registered))) {
    statusCoverageProblems.push(`${key}: generated content annotation differs from the source-bound registry`);
  }
}

if (suggestStatuses) {
  const grouped = new Map();
  for (const record of recordsWithUnresolvedWarnings) {
    grouped.set(record.recordKey, [...(grouped.get(record.recordKey) ?? []), record]);
  }
  const suggestedRecords = [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([key, matching]) => {
    const pageMatches = content.pages.filter((page) => editorialRecordKey(page) === key);
    const warnings = [...new Set(matching.flatMap((record) => record.unresolvedWarnings))].sort();
    const referenceCount = Math.min(...matching.map((record) => record.references.length));
    const declaredSourceCount = Math.min(...pageMatches.map((page) => Number(page.sourceCount ?? 0)));
    const threshold = Math.max(...pageMatches.map((page) => Number(page.threshold ?? 0)));
    const firstHeading = pageMatches.map((page) => page.sections?.[0]?.heading).find(Boolean) ?? null;
    const category = matching[0].category;
    let disposition = "evidence_insufficient";
    let publicLabel = "Evidence-limited source record";
    let rationale;
    if (category === "reference") {
      disposition = "structural_exemption";
      publicLabel = "Reference index";
      rationale = "The authoritative record is a navigation/reference index rather than a claim-bearing article. Article source-density and generated-reference requirements do not apply.";
    } else if (warnings.length === 1 && warnings[0] === "missing_introduction") {
      disposition = "source_structure_deferred";
      publicLabel = "Source structure awaiting an upstream lead";
      rationale = `The authoritative ${category} record begins at “${firstHeading ?? "its first section"}” and has ${referenceCount} resolved reference${referenceCount === 1 ? "" : "s"}, but it provides no general introduction. No lead was synthesized or inferred.`;
    } else if (warnings.includes("no_substantive_content")) {
      rationale = `The authoritative Markdown contains only an auto-created maintenance marker and no claim-bearing prose. Its ${referenceCount} resolved reference${referenceCount === 1 ? "" : "s"} remain indexed, but no article text was inferred from source titles.`;
    } else if (warnings.includes("no_references")) {
      rationale = `The authoritative record provides no resolvable references against its ${threshold}-source threshold. It remains explicitly evidence-insufficient; no citation, finding, or conclusion was inferred.`;
    } else {
      rationale = `The authoritative record declares ${declaredSourceCount} source${declaredSourceCount === 1 ? "" : "s"} against its ${threshold}-source threshold. It remains explicitly evidence-insufficient pending source-backed expansion.`;
    }
    return {
      key,
      disposition,
      approved: true,
      resolves: warnings,
      rationale,
      publicLabel,
      evidence: { declaredSourceCount, generatedReferenceCount: referenceCount, threshold, firstHeading },
    };
  });
  const groupedSuggestions = new Map();
  for (const status of suggestedRecords) {
    const groupKey = `${status.disposition}::${status.resolves.join("+")}`;
    const existing = groupedSuggestions.get(groupKey) ?? { ...status, records: [] };
    existing.records.push(status.key);
    groupedSuggestions.set(groupKey, existing);
  }
  const groups = [...groupedSuggestions.entries()].map(([id, status]) => ({
    id,
    disposition: status.disposition,
    approved: true,
    resolves: status.resolves,
    rationale: status.disposition === "structural_exemption"
      ? "The authoritative records are navigation/reference indexes rather than claim-bearing articles. Article source-density and generated-reference requirements do not apply."
      : status.disposition === "source_structure_deferred"
        ? "The authoritative records begin at scoped, evidence-bearing sections but provide no general introduction. No lead was synthesized or inferred."
        : status.resolves.includes("no_substantive_content")
          ? "The authoritative Markdown contains only an auto-created maintenance marker and no claim-bearing prose. Declared references remain indexed, but no article text was inferred from source titles."
          : status.resolves.includes("no_references")
            ? "The authoritative records provide no resolvable references and do not meet their type-specific source thresholds. They remain explicitly evidence-insufficient; no citation, finding, or conclusion was inferred."
            : "The authoritative records do not meet their type-specific declared-source thresholds. They remain explicitly evidence-insufficient pending source-backed expansion.",
    publicLabel: status.publicLabel,
    records: status.records,
  }));
  console.log(JSON.stringify({
    schemaVersion: 1,
    sourceCommit: manifest.source.commit,
    reviewedAt: "2026-09-01",
    authority: "WikiBiome delegated editorial-completion audit",
    groups,
  }));
  process.exit(0);
}
const report = {
  sourceCommit: manifest.source?.commit ?? null,
  generatedAt: manifest.generatedAt,
  records: records.length,
  canonicalRoutes: new Set(records.map((record) => record.routeId)).size,
  warningRecords: recordsWithWarnings.length,
  warningRoutes: new Set(recordsWithWarnings.map((record) => record.routeId)).size,
  unjustifiedWarningRecords: recordsWithUnresolvedWarnings.length,
  unjustifiedWarningRoutes: new Set(recordsWithUnresolvedWarnings.map((record) => record.routeId)).size,
  justifiedWarningRecords: recordsWithJustifiedWarnings.length,
  justifiedWarningRoutes: new Set(recordsWithJustifiedWarnings.map((record) => record.routeId)).size,
  blockedRecords: records.filter((record) => record.unresolvedWarnings.includes("orphaned_evidence")).length,
  registeredStatuses: Object.keys(registeredEditorialStatuses).length,
  appliedStatusRecords: records.filter((record) => record.status).length,
  statusCoverageProblems,
  warnings: warningSummary,
  unjustifiedWarnings: unresolvedWarningSummary,
  justifiedWarnings: justifiedWarningSummary,
  notices: noticeSummary,
  ...(includeRecords ? {
    warningRecordDetails: recordsWithWarnings.map((record) => ({
      recordKey: record.recordKey,
      id: record.id,
      routeId: record.routeId,
      title: record.title,
      category: record.category,
      warnings: record.warnings,
      ownReferenceCount: record.ownReferences.length,
      canonicalReferenceCount: record.references.length,
      status: record.status,
    })),
  } : {}),
};

if (asJson) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`WikiBiome editorial audit: ${report.records} records, ${report.canonicalRoutes} canonical routes.`);
  console.log(`${report.unjustifiedWarningRecords} records across ${report.unjustifiedWarningRoutes} routes retain unjustified warnings; ${report.justifiedWarningRecords} records carry explicit dispositions; ${report.blockedRecords} records are blocked.`);
  for (const [code, summary] of Object.entries(report.warnings)) {
    console.log(`- ${code}: ${summary.records} records / ${summary.routes} routes (${summary.samples.join(", ")}${summary.records > summary.samples.length ? ", …" : ""})`);
  }
  for (const [code, summary] of Object.entries(report.notices)) {
    console.log(`- notice ${code}: ${summary.records} records / ${summary.routes} routes`);
  }
  if (statusCoverageProblems.length) statusCoverageProblems.forEach((problem) => console.error(`- status error: ${problem}`));
}

if (strict && (recordsWithUnresolvedWarnings.length || statusCoverageProblems.length)) process.exit(1);
