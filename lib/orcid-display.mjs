// ORCID identifiers belong in link targets and structured data, never name labels.
export function researcherDisplayName(value) {
  const name = String(value || "").replace(/(?:ORCID\s*|https?:\/\/(?:www\.)?orcid\.org\/)?\d{4}-\d{4}-\d{4}-\d{3}[\dX]/gi, "").trim();
  return name || "Researcher";
}
