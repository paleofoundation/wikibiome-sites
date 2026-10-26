const PROPOSAL_TYPES = new Set(["new_page", "new_section", "cross_page_connection", "framework_correction"]);
const PRIMARY_ANCHORS = new Set(["microbiome", "metallomics", "both"]);
const SECONDARY_DOMAINS = new Set([
  "genomics",
  "metabolomics",
  "transcriptomics",
  "proteomics",
  "immunology",
  "exposomics",
  "clinical_evidence",
  "other",
]);

export function maskEmail(value) {
  const [local = "", domain = ""] = String(value || "").trim().split("@");
  if (!local || !domain) return "";
  const visible = local.length <= 2 ? local.slice(0, 1) : local.slice(0, 2);
  return `${visible}${"•".repeat(Math.max(3, Math.min(8, local.length - visible.length)))}@${domain}`;
}

export function normalizeWorkText(value) {
  return String(value || "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/https?:\/\/(?:dx\.)?doi\.org\//g, "")
    .replace(/^doi:\s*/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function normalizeWorkDoi(value) {
  return String(value || "")
    .trim()
    .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "")
    .toLowerCase();
}

export function classifyWorkMatch(work, source) {
  const workDoi = normalizeWorkDoi(work?.doi);
  const sourceDoi = normalizeWorkDoi(source?.doi);
  if (workDoi && sourceDoi && workDoi === sourceDoi) return { matchType: "exact_doi", confidence: 100 };

  const workTitle = normalizeWorkText(work?.title);
  const sourceTitle = normalizeWorkText(source?.title);
  if (!workTitle || !sourceTitle) return null;
  const researcherName = normalizeWorkText(work?.authorName);
  const familyName = researcherName.split(" ").filter(Boolean).at(-1) || "";
  const sourceAuthors = Array.isArray(source?.authors) ? source.authors.map(normalizeWorkText) : [];
  const authorMatches = familyName.length >= 2 && sourceAuthors.some((author) => author === researcherName || author.split(" ").includes(familyName));
  if (!authorMatches) return null;
  const yearMatches = !work?.year || !source?.year || Number(work.year) === Number(source.year);
  if (!yearMatches) return null;
  if (workTitle === sourceTitle) return { matchType: "possible_title_author_year", confidence: 85 };
  const workTokens = new Set(workTitle.split(" ").filter((token) => token.length > 2));
  const sourceTokens = new Set(sourceTitle.split(" ").filter((token) => token.length > 2));
  const overlap = [...workTokens].filter((token) => sourceTokens.has(token)).length;
  const denominator = Math.max(workTokens.size, sourceTokens.size, 1);
  const score = overlap / denominator;
  return score >= 0.82 ? { matchType: "possible_title_author_year", confidence: Math.round(score * 80) } : null;
}

export function validateProposalInput(input) {
  const proposalType = String(input?.proposalType || "").trim();
  const primaryAnchor = String(input?.primaryAnchor || "").trim();
  const secondaryDomains = [...new Set(Array.isArray(input?.secondaryDomains) ? input.secondaryDomains.map(String) : [])]
    .filter((value) => SECONDARY_DOMAINS.has(value))
    .slice(0, 8);
  const sources = (Array.isArray(input?.sources) ? input.sources : [])
    .map((item) => ({
      identifierType: String(item?.identifierType || "").trim().toLowerCase(),
      identifierValue: String(item?.identifierValue || "").trim().slice(0, 300),
    }))
    .filter((item) => ["doi", "pmid"].includes(item.identifierType) && item.identifierValue)
    .slice(0, 20);

  if (!PROPOSAL_TYPES.has(proposalType)) throw new Error("Choose a supported proposal type.");
  if (!PRIMARY_ANCHORS.has(primaryAnchor)) throw new Error("Choose microbiome, metallomics, or both as the primary scientific anchor.");
  if (!String(input?.title || "").trim()) throw new Error("Add a proposal title.");
  if (!String(input?.rationale || "").trim()) throw new Error("Explain why this change improves the evidence framework.");
  if (!String(input?.proposedContent || "").trim()) throw new Error("Add a proposed outline or text.");
  if (!String(input?.mechanismConnection || "").trim()) throw new Error("Describe the mechanistic connection.");
  if (!String(input?.causalLimitations || "").trim()) throw new Error("State the causal limitations.");
  if (!sources.length) throw new Error("Add at least one supporting DOI or PMID.");
  return { proposalType, primaryAnchor, secondaryDomains, sources };
}

export function participantKey(accountA, accountB) {
  const values = [String(accountA || ""), String(accountB || "")].sort();
  return `${values[0]}:${values[1]}`;
}

export function recognitionMilestones(contributions) {
  const accepted = (Array.isArray(contributions) ? contributions : []).filter((item) => item?.accepted === true);
  const unique = new Map();
  for (const item of accepted) {
    const key = `${item.type}:${item.id}`;
    if (!unique.has(key)) unique.set(key, item);
  }
  const values = [...unique.values()];
  const records = new Set(values.map((item) => item.recordId).filter(Boolean));
  const types = new Set(values.map((item) => item.type).filter(Boolean));
  const levels = [];
  if (values.length >= 1) levels.push(1);
  if (values.length >= 3 && records.size >= 2) levels.push(2);
  if (values.length >= 5 && types.size >= 2) levels.push(3);
  return levels;
}

export function mayPublishRecognition(level, humanReviewed) {
  if (level <= 3) return true;
  return humanReviewed === true;
}

export function deliveryCopy(delivery, maskedEmail) {
  if (delivery?.sent) return `Verification email sent to ${maskedEmail}.`;
  if (delivery?.reason === "suppressed") return `${maskedEmail} is suppressed after an unsubscribe, bounce, or complaint. Change the address or contact privacy@wikibiome.com.`;
  if (delivery?.reason === "email_not_configured") return `Your address was saved as ${maskedEmail}, but email delivery is not active yet. No message was sent.`;
  if (delivery?.reason === "provider_error") return `Your address was saved as ${maskedEmail}, but the email provider could not accept the message. You can resend later.`;
  return `Your address was saved as ${maskedEmail}, but delivery was not attempted.`;
}
