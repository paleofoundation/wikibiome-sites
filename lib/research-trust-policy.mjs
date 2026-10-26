const directPublishingRoles = new Set(["trusted_contributor", "topic_steward", "moderator", "site_admin"]);

export function discussionPublishingDecision(role, priorPostStatuses = []) {
  if (directPublishingRoles.has(role)) return { status: "published", promoteTo: null };
  if (role !== "researcher") return { status: "pending", promoteTo: null };
  const publishedCount = priorPostStatuses.filter((status) => status === "published").length;
  return publishedCount >= 3
    ? { status: "published", promoteTo: "trusted_contributor" }
    : { status: "pending", promoteTo: null };
}

export function institutionEmailMatchesAuthoritativeDomains(email, authoritativeDomains = []) {
  const emailDomain = typeof email === "string" ? email.trim().toLowerCase().split("@").at(-1) ?? "" : "";
  if (!emailDomain || !emailDomain.includes(".")) return false;
  return authoritativeDomains
    .map(normalizeInstitutionDomain)
    .filter(Boolean)
    .some((domain) => emailDomain === domain || emailDomain.endsWith(`.${domain}`));
}

export function normalizeInstitutionDomain(value) {
  if (typeof value !== "string") return "";
  const candidate = value.trim().toLowerCase();
  if (!candidate) return "";
  try {
    return new URL(candidate.includes("://") ? candidate : `https://${candidate}`).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
