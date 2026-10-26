import yaml from "js-yaml";

export const PAGE_HISTORY_POLICY_VERSION = 2;
export const PAGE_HISTORY_DESCRIPTION = "This record shows only material changes published on this page, including changes to its content, evidence, conclusions, or author context. Internal processes and discussion activity are excluded. Pending, declined, and withdrawn proposals remain private.";

// Only fields consumed as public article content qualify. Operational fields,
// timestamps, review bookkeeping and source-count maintenance do not.
const PUBLIC_FIELDS = ["title", "type", "subtype", "name", "description", "summary", "sources", "confidence", "evidence_level", "key_enzymes", "metal_dependencies", "associated_conditions"];
function normalize(value) {
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map(key => [key, normalize(value[key])]));
  return typeof value === "string" ? value.replace(/\s+/g, " ").trim() : value;
}
export function publicPageSnapshot(markdown) {
  const match = String(markdown || "").match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  let metadata = {};
  if (match) {
    try { metadata = yaml.load(match[1], { json: true }) || {}; }
    catch {
      // Historical source files contain malformed YAML. Preserve their public
      // field text for comparison; never confuse a parse failure with no content.
      for (const key of PUBLIC_FIELDS) {
        const field = match[1].match(new RegExp(`^${key}:([^\\n]*(?:\\n[ \t]+[^\\n]*)*)`, "m"));
        if (field) metadata[key] = field[1].trim();
      }
    }
  }
  const body = String(markdown || "").slice(match?.[0].length || 0)
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^\s*[-*_]{3,}\s*$/gm, "")
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_match, target, label) => label || target.replace(/-/g, " "))
    .replace(/(\*\*|__)([^\n]+?)\1/g, "$2")
    .replace(/\s+/g, " ").trim();
  return { metadata: normalize(Object.fromEntries(PUBLIC_FIELDS.filter(key => metadata[key] !== undefined).map(key => [key, metadata[key]]))), body };
}
export function materialPageChange(before, after) {
  const previous = publicPageSnapshot(before);
  const current = publicPageSnapshot(after);
  if (JSON.stringify(previous) === JSON.stringify(current)) return null;
  if (!current.body && !Object.keys(current.metadata).length) return null;
  const changes = describePageChanges(before, after, previous, current);
  const title = changes[0].replace(/: changed “(.+)” to “(.+)”\.$/, ": now reads “$2”.");
  return { materialChange: true, summary: excerpt(title, 280), description: changes.join("\n\n") };

}

export function isPublishedProposalChange(proposal) {
  return proposal.status === "accepted" && /^[a-f0-9]{40}$/i.test(proposal.publishedCommit || "") && Boolean(proposal.proposedContent?.trim());
}
export function isPublishedAuthorContext(review) {
  return review.status === "accepted" && Boolean(review.context?.trim());
}

const FIELD_LABELS = {
  title: "Title", name: "Scientific name", type: "Article type", subtype: "Classification",
  description: "Description", summary: "Summary", sources: "References", confidence: "Confidence",
  evidence_level: "Evidence level", key_enzymes: "Key enzymes", metal_dependencies: "Metal dependencies",
  associated_conditions: "Associated conditions",
};

function readable(value) {
  if (Array.isArray(value)) return value.map(readable).join("; ");
  if (value && typeof value === "object") return Object.entries(value).map(([key, item]) => `${key}: ${readable(item)}`).join("; ");
  return String(value ?? "")
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_match, target, label) => label || target.replace(/-/g, " "))
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
}
function excerpt(value, limit = 200) {
  const text = readable(value);
  if (text.length <= limit) return text;
  const boundary = text.lastIndexOf(" ", limit);
  return `${text.slice(0, boundary > limit / 2 ? boundary : limit)}…`;
}
function sections(markdown, citations = new Set()) {
  const body = String(markdown || "").replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "").replace(/<!--[\s\S]*?-->/g, "");
  const result = new Map();
  let heading = "Introduction";
  let lines = [];
  const flush = () => {
    const text = publicPageSnapshot(lines.join("\n").replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, (match, target) => citations.has(target) ? "" : match)).body.replace(/\s+([.,;:])/g, "$1");
    if (text) result.set(heading, [result.get(heading), text].filter(Boolean).join(" "));
  };
  for (const line of body.split(/\r?\n/)) {
    const match = line.match(/^#{1,6}\s+(.+?)\s*#*$/);
    if (match) { flush(); heading = readable(match[1]); lines = []; }
    else lines.push(line);
  }
  flush();
  return result;
}
function changedPassages(before, after) {
  const oldWords = before.split(/\s+/);
  const newWords = after.split(/\s+/);
  let start = 0;
  while (start < oldWords.length && start < newWords.length && oldWords[start] === newWords[start]) start++;
  let oldEnd = oldWords.length;
  let newEnd = newWords.length;
  while (oldEnd > start && newEnd > start && oldWords[oldEnd - 1] === newWords[newEnd - 1]) { oldEnd--; newEnd--; }
  // Include surrounding words so a changed number or scientific term has context.
  const from = Math.max(0, start - 6);
  return [excerpt(oldWords.slice(from, Math.min(oldWords.length, oldEnd + 6)).join(" ")),
    excerpt(newWords.slice(from, Math.min(newWords.length, newEnd + 6)).join(" "))];
}
export function describePageChanges(before, after, previous = publicPageSnapshot(before), current = publicPageSnapshot(after)) {
  const citations = new Set([...(Array.isArray(previous.metadata.sources) ? previous.metadata.sources : []), ...(Array.isArray(current.metadata.sources) ? current.metadata.sources : [])]);
  for (const match of `${before}\n${after}`.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)) {
    if (/(?:19|20)\d{2}|^(?:ncbi-taxonomy-|lpsn-)/.test(match[1])) citations.add(match[1]);
  }
  const oldSections = sections(before, citations);
  const newSections = sections(after, citations);
  const oldCitations = citationsBySection(before, citations);
  const newCitations = citationsBySection(after, citations);
  const changes = [];
  if (!previous.body && !Object.keys(previous.metadata).length) {
    const title = readable(current.metadata.title || current.metadata.name || newSections.keys().next().value || "article");
    changes.push(`Created “${title}”: ${excerpt(newSections.get("Introduction") || [...newSections.values()][0] || readable(current.metadata.description || current.metadata.summary))}`);
    const headings = [...newSections.keys()].filter(heading => heading !== "Introduction");
    if (headings.length) changes.push(`Published sections: ${headings.join("; ")}.`);
    return changes;
  }
  for (const [heading, text] of newSections) {
    const oldText = oldSections.get(heading);
    if (oldText === text) continue;
    if (!oldText) changes.push(`Added “${heading}”: ${excerpt(text)}`);
    else {
      const [oldPassage, newPassage] = changedPassages(oldText, text);
      changes.push(`Revised “${heading}”: changed “${oldPassage}” to “${newPassage}”.`);
    }
  }
  for (const [heading, text] of oldSections) {
    if (!newSections.has(heading)) changes.push(`Removed “${heading}”: ${excerpt(text)}`);
  }
  for (const heading of new Set([...oldCitations.keys(), ...newCitations.keys()])) {
    const oldIds = oldCitations.get(heading) || [];
    const newIds = newCitations.get(heading) || [];
    const added = newIds.filter(id => !oldIds.includes(id));
    const removed = oldIds.filter(id => !newIds.includes(id));
    if (added.length) changes.push(`Added citations to “${heading}”: ${added.map(id => id.replace(/-/g, " ")).join("; ")}.`);
    if (removed.length) changes.push(`Removed citations from “${heading}”: ${removed.map(id => id.replace(/-/g, " ")).join("; ")}.`);
  }
  for (const key of PUBLIC_FIELDS) {
    const oldValue = previous.metadata[key];
    const newValue = current.metadata[key];
    if (JSON.stringify(oldValue) === JSON.stringify(newValue)) continue;
    if (Array.isArray(oldValue) || Array.isArray(newValue)) {
      const oldItems = Array.isArray(oldValue) ? oldValue : [];
      const newItems = Array.isArray(newValue) ? newValue : [];
      const added = newItems.filter(item => !oldItems.some(old => JSON.stringify(old) === JSON.stringify(item)));
      const removed = oldItems.filter(item => !newItems.some(next => JSON.stringify(next) === JSON.stringify(item)));
      if (added.length) changes.push(`Added ${FIELD_LABELS[key].toLowerCase()}: ${readable(added)}.`);
      if (removed.length) changes.push(`Removed ${FIELD_LABELS[key].toLowerCase()}: ${readable(removed)}.`);
      for (const item of [...new Map([...oldItems, ...newItems].map(value => [JSON.stringify(value), value])).values()]) {
        const oldCount = oldItems.filter(value => JSON.stringify(value) === JSON.stringify(item)).length;
        const newCount = newItems.filter(value => JSON.stringify(value) === JSON.stringify(item)).length;
        if (oldCount > newCount && newCount > 0) changes.push(`Removed duplicate ${FIELD_LABELS[key].toLowerCase()} entries for ${readable(item)} (${oldCount} entries → ${newCount}).`);
        if (newCount > oldCount && oldCount > 0) changes.push(`Added another ${FIELD_LABELS[key].toLowerCase()} entry for ${readable(item)} (${oldCount} entries → ${newCount}).`);
      }
      if (!added.length && !removed.length && oldItems.length === newItems.length) changes.push(`Reordered ${FIELD_LABELS[key].toLowerCase()}: ${readable(newItems)}.`);
    } else {
      changes.push(oldValue == null ? `Added ${FIELD_LABELS[key].toLowerCase()}: “${readable(newValue)}”.`
        : newValue == null ? `Removed ${FIELD_LABELS[key].toLowerCase()}: “${readable(oldValue)}”.`
        : `${FIELD_LABELS[key]} changed from “${readable(oldValue)}” to “${readable(newValue)}”.`);
    }
  }
  // A heading-only change is visible content too; include the actual wording.
  if (!changes.length) {
    const [oldPassage, newPassage] = changedPassages(previous.body, current.body);
    changes.push(`Changed “${oldPassage}” to “${newPassage}”.`);
  }
  return changes;
}

function citationsBySection(markdown, citations) {
  const result = new Map();
  let heading = "Introduction";
  const body = String(markdown || "").replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, "").replace(/<!--[\s\S]*?-->/g, "");
  for (const line of body.split(/\r?\n/)) {
    const match = line.match(/^#{1,6}\s+(.+?)\s*#*$/);
    if (match) { heading = readable(match[1]); continue; }
    for (const link of line.matchAll(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g)) {
      if (citations.has(link[1])) result.set(heading, [...new Set([...(result.get(heading) || []), link[1]])]);
    }
  }
  return result;
}
