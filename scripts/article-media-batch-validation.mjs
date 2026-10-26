import { createHash } from "node:crypto";

export const activeMediaReviewStatuses = new Set(["awaiting-control-review", "approved-awaiting-promotion"]);

const promptMarkerPattern = /<!-- PROMPT ([a-z0-9-]+) START -->\n```text\n([\s\S]*?)\n```\n<!-- PROMPT \1 END -->/g;

export function parseStrictJson(source, label = "JSON") {
  let offset = 0;

  function fail(message) {
    throw new Error(`${label}: ${message} at character ${offset}.`);
  }

  function skipWhitespace() {
    while (/\s/.test(source[offset] ?? "")) offset += 1;
  }

  function parseStringToken() {
    if (source[offset] !== '"') fail("expected a string");
    const start = offset;
    offset += 1;
    while (offset < source.length) {
      if (source[offset] === "\\") {
        offset += source[offset + 1] === "u" ? 6 : 2;
        continue;
      }
      if (source[offset] === '"') {
        offset += 1;
        return JSON.parse(source.slice(start, offset));
      }
      offset += 1;
    }
    fail("unterminated string");
  }

  function parseValue() {
    skipWhitespace();
    if (source[offset] === "{") return parseObject();
    if (source[offset] === "[") return parseArray();
    if (source[offset] === '"') return void parseStringToken();
    const start = offset;
    while (offset < source.length && !/[\s,}\]]/.test(source[offset])) offset += 1;
    if (start === offset) fail("expected a value");
    JSON.parse(source.slice(start, offset));
  }

  function parseObject() {
    offset += 1;
    skipWhitespace();
    const keys = new Set();
    if (source[offset] === "}") return void (offset += 1);
    while (offset < source.length) {
      const key = parseStringToken();
      if (keys.has(key)) throw new Error(`${label}: duplicate key ${JSON.stringify(key)} in the same object.`);
      keys.add(key);
      skipWhitespace();
      if (source[offset] !== ":") fail("expected ':' after an object key");
      offset += 1;
      parseValue();
      skipWhitespace();
      if (source[offset] === "}") return void (offset += 1);
      if (source[offset] !== ",") fail("expected ',' or '}' in an object");
      offset += 1;
      skipWhitespace();
    }
    fail("unterminated object");
  }

  function parseArray() {
    offset += 1;
    skipWhitespace();
    if (source[offset] === "]") return void (offset += 1);
    while (offset < source.length) {
      parseValue();
      skipWhitespace();
      if (source[offset] === "]") return void (offset += 1);
      if (source[offset] !== ",") fail("expected ',' or ']' in an array");
      offset += 1;
      skipWhitespace();
    }
    fail("unterminated array");
  }

  parseValue();
  skipWhitespace();
  if (offset !== source.length) fail("unexpected trailing content");
  return JSON.parse(source);
}

export function assertBatchPromptIntegrity(batch, promptRecord, batchName = "media batch") {
  const promptMatches = [...promptRecord.matchAll(promptMarkerPattern)];
  if (promptMatches.length === 0) return { mode: "legacy-unmarked", verified: 0 };

  const manifestRecords = Object.values(batch)
    .filter(Array.isArray)
    .flat()
    .filter((record) => record?.pageId);
  const seen = new Set();
  for (const match of promptMatches) {
    const [, pageId, prompt] = match;
    if (seen.has(pageId)) throw new Error(`${batchName}/${pageId}: immutable prompt appears more than once.`);
    seen.add(pageId);
    const actual = createHash("sha256").update(prompt).digest("hex");
    const records = manifestRecords.filter((record) => record.pageId === pageId);
    if (records.length === 0) throw new Error(`${batchName}/${pageId}: immutable prompt has no matching manifest record.`);
    const frozenHashes = records.map((record) => record.promptSha256).filter(Boolean);
    if (frozenHashes.length > 0 && !frozenHashes.includes(actual)) {
      throw new Error(`${batchName}/${pageId}: immutable prompt SHA-256 differs from every matching manifest record.`);
    }
  }

  for (const asset of batch.assets ?? []) {
    if (seen.has(asset.pageId) && !/^[a-f0-9]{64}$/.test(asset.promptSha256 ?? "")) {
      throw new Error(`${batchName}/${asset.pageId}: immutable prompt SHA-256 is missing or invalid.`);
    }
    if (asset.promptSha256 && !seen.has(asset.pageId)) {
      throw new Error(`${batchName}/${asset.pageId}: hashed asset has no immutable prompt block.`);
    }
  }
  const verified = [...seen].filter((pageId) =>
    manifestRecords.some((record) => record.pageId === pageId && record.promptSha256),
  ).length;
  return { mode: "marker-bound", verified };
}

export function assertMediaOutputAudit(asset, batchName = "media batch") {
  const audit = asset.outputAudit;
  if (!audit?.reviewedBy || !/^\d{4}-\d{2}-\d{2}$/.test(audit.reviewedOn ?? "")) {
    throw new Error(`${batchName}/${asset.pageId}: human output audit identity or date is missing.`);
  }
  if (audit.promptCountTrusted !== false) {
    throw new Error(`${batchName}/${asset.pageId}: a generated prompt cannot serve as count evidence.`);
  }
  if (!audit.observedSubjectDescription || audit.metadataConsistency !== "pass") {
    throw new Error(`${batchName}/${asset.pageId}: visible subject count/grouping does not have a passing metadata reconciliation.`);
  }
}
