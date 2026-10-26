import { normalizeInstitutionDomain } from "@/lib/research-trust-policy.mjs";

export type ResearchWorkMetadata = {
  identifierType: "doi" | "pmid" | "preprint";
  identifierValue: string;
  title: string;
  authors: string[];
  year?: number;
  abstractText?: string;
  journal?: string;
  doi?: string;
  pmid?: string;
  license?: string;
  raw: unknown;
};

export type RorOrganization = {
  ror: string;
  name: string;
  country: string;
  domains: string[];
};

export function parseResearchIdentifier(typeValue: unknown, value: unknown) {
  const type = cleanText(typeValue, 20).toLowerCase();
  const raw = cleanText(value, 1000);
  if (type === "doi") {
    const doi = raw.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "").replace(/^doi:\s*/i, "").replace(/[.,;:\s]+$/g, "");
    if (!/^10\.\d{4,9}\/[._;()/:A-Za-z0-9<>+-]+$/.test(doi)) throw new Error("Enter a valid DOI.");
    return { type: "doi" as const, value: doi.toLowerCase() };
  }
  if (type === "pmid") {
    const pmid = raw.replace(/^pmid:\s*/i, "");
    if (!/^\d{1,12}$/.test(pmid)) throw new Error("Enter a valid PMID.");
    return { type: "pmid" as const, value: pmid };
  }
  if (type === "preprint") {
    const url = cleanUrl(raw);
    if (!url) throw new Error("Enter the HTTPS URL for the preprint record.");
    return { type: "preprint" as const, value: url };
  }
  throw new Error("Choose DOI, PMID, or preprint URL.");
}

export async function lookupResearchMetadata(input: { type: "doi" | "pmid" | "preprint"; value: string; preprintTitle?: unknown }) : Promise<ResearchWorkMetadata> {
  if (input.type === "doi") return lookupCrossref(input.value);
  if (input.type === "pmid") return lookupPubmed(input.value);
  const title = cleanText(input.preprintTitle, 1000);
  if (!title) throw new Error("Add the preprint title so the editorial team can identify it.");
  return { identifierType: "preprint", identifierValue: input.value, title, authors: [], raw: { url: input.value } };
}

export async function lookupRorOrganization(value: unknown): Promise<RorOrganization> {
  const ror = cleanText(value, 64).replace(/^https?:\/\/ror\.org\//i, "");
  if (!/^0[a-z0-9]{8}$/i.test(ror)) throw new Error("Enter a valid ROR identifier.");
  const response = await fetch(`https://api.ror.org/v2/organizations/${encodeURIComponent(ror)}`, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(response.status === 404 ? "That ROR organization was not found." : "ROR metadata is temporarily unavailable.");
  const record = await response.json() as Record<string, unknown>;
  const names = Array.isArray(record.names) ? record.names as Array<Record<string, unknown>> : [];
  const display = names.find((item) => Array.isArray(item.types) && item.types.includes("ror_display"));
  const name = cleanText(display?.value || names[0]?.value, 300);
  const locations = Array.isArray(record.locations) ? record.locations as Array<Record<string, unknown>> : [];
  const geonames = (locations[0]?.geonames_details && typeof locations[0].geonames_details === "object" ? locations[0].geonames_details : {}) as Record<string, unknown>;
  const links = Array.isArray(record.links) ? record.links as Array<Record<string, unknown>> : [];
  const registeredDomains = Array.isArray(record.domains) ? record.domains.map((item) => normalizeInstitutionDomain(item)) : [];
  const websiteDomains = links
    .filter((item) => item.type === "website")
    .map((item) => normalizeInstitutionDomain(item.value));
  const domains = [...new Set([...registeredDomains, ...websiteDomains].filter(Boolean))];
  if (!name) throw new Error("ROR returned incomplete organization metadata.");
  return { ror: ror.toLowerCase(), name, country: cleanText(geonames.country_name, 100), domains: [...new Set(domains)] };
}

async function lookupCrossref(doi: string): Promise<ResearchWorkMetadata> {
  const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}?mailto=hello@wikibiome.com`, {
    headers: { accept: "application/json", "user-agent": "WikiBiome/1.0 (mailto:hello@wikibiome.com)" },
  });
  if (!response.ok) throw new Error(response.status === 404 ? "Crossref could not find that DOI." : "Crossref metadata is temporarily unavailable.");
  const payload = await response.json() as { message?: Record<string, unknown> };
  const work = payload.message ?? {};
  const title = arrayFirst(work.title);
  if (!title) throw new Error("The DOI record does not contain a title.");
  const authors = Array.isArray(work.author)
    ? work.author.map((item) => {
      const author = item as Record<string, unknown>;
      return [cleanText(author.given, 160), cleanText(author.family, 160)].filter(Boolean).join(" ");
    }).filter(Boolean)
    : [];
  const dateParts = ((work.published as { "date-parts"?: number[][] } | undefined)?.["date-parts"] ?? (work.issued as { "date-parts"?: number[][] } | undefined)?.["date-parts"] ?? []);
  const year = Number(dateParts[0]?.[0]) || undefined;
  const abstractText = cleanText(typeof work.abstract === "string" ? work.abstract.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ") : "", 12000);
  return {
    identifierType: "doi",
    identifierValue: doi,
    title,
    authors,
    year,
    abstractText,
    journal: arrayFirst(work["container-title"]),
    doi,
    license: Array.isArray(work.license) ? cleanText((work.license[0] as Record<string, unknown>)?.URL, 500) : undefined,
    raw: work,
  };
}

async function lookupPubmed(pmid: string): Promise<ResearchWorkMetadata> {
  const response = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${encodeURIComponent(pmid)}&retmode=json&tool=wikibiome&email=hello%40wikibiome.com`, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error("PubMed metadata is temporarily unavailable.");
  const payload = await response.json() as { result?: Record<string, unknown> };
  const record = payload.result?.[pmid] as Record<string, unknown> | undefined;
  if (!record || record.error) throw new Error("PubMed could not find that PMID.");
  const title = cleanText(record.title, 1000);
  const authors = Array.isArray(record.authors)
    ? record.authors.map((item) => cleanText((item as Record<string, unknown>).name, 320)).filter(Boolean)
    : [];
  const doi = Array.isArray(record.articleids)
    ? cleanText((record.articleids.find((item) => (item as Record<string, unknown>).idtype === "doi") as Record<string, unknown> | undefined)?.value, 500)
    : "";
  const yearMatch = cleanText(record.pubdate, 100).match(/\b(19|20)\d{2}\b/);
  return {
    identifierType: "pmid",
    identifierValue: pmid,
    title,
    authors,
    year: yearMatch ? Number(yearMatch[0]) : undefined,
    journal: cleanText(record.fulljournalname || record.source, 500),
    doi: doi || undefined,
    pmid,
    raw: record,
  };
}

function arrayFirst(value: unknown) {
  return cleanText(Array.isArray(value) ? value[0] : value, 1000);
}

function cleanText(value: unknown, limit: number) {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

function cleanUrl(value: unknown) {
  const source = cleanText(value, 1000);
  if (!source) return "";
  try {
    const url = new URL(source);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}
