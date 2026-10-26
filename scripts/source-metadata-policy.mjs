export const SOURCE_METADATA_POLICY_VERSION = 1;

const DOI_PATTERN = /^10\.\d{4,9}\/\S+$/i;
const PLACEHOLDER_PATTERN = /^(?:n\/?a|none|not available|not yet verified|pending|tbd|unknown)$/i;

export function normalizeSourceYear(value) {
  if (value === undefined || value === null || value === "") return { status: "missing" };
  const year = typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isFinite(year) || !Number.isInteger(year)) return { status: "invalid" };
  return { status: typeof value === "number" ? "valid" : "normalized", value: year };
}

export function normalizeSourceDoi(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return { status: "missing" };
  if (PLACEHOLDER_PATTERN.test(raw)) return { status: "placeholder" };
  const bare = raw
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "")
    .replace(/[.,;:\s]+$/g, "")
    .trim();
  if (!DOI_PATTERN.test(bare)) return { status: "malformed" };
  return { status: bare === raw ? "valid" : "normalized", value: bare };
}

export function normalizeSourceMetadata(content) {
  const normalizedYears = [];
  const omittedYears = [];
  const normalizedDois = [];
  const omittedDois = [];
  const sourceLookup = Object.fromEntries(Object.entries(content.sourceLookup ?? {}).map(([id, source]) => {
    const normalized = { ...source };
    if (Object.hasOwn(source, "year")) {
      const year = normalizeSourceYear(source.year);
      if (year.status === "valid") normalized.year = year.value;
      else if (year.status === "normalized") {
        normalized.year = year.value;
        normalizedYears.push({ id, value: source.year, normalized: year.value });
      } else {
        delete normalized.year;
        if (year.status === "invalid") omittedYears.push({ id, value: source.year, reason: "not-a-finite-integer" });
      }
    }
    if (Object.hasOwn(source, "doi")) {
      const doi = normalizeSourceDoi(source.doi);
      if (doi.status === "valid") normalized.doi = doi.value;
      else if (doi.status === "normalized") {
        normalized.doi = doi.value;
        normalizedDois.push({ id, value: source.doi, normalized: doi.value });
      } else {
        delete normalized.doi;
        if (doi.status !== "missing" || String(source.doi ?? "").length) {
          omittedDois.push({ id, value: source.doi, reason: doi.status });
        }
      }
    }
    return [id, normalized];
  }));

  return {
    content: { ...content, sourceLookup },
    audit: { normalizedYears, omittedYears, normalizedDois, omittedDois },
  };
}
