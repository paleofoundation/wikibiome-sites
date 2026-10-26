/** @typedef {{ name: string, url: string }} ResearcherAssociation */

export const MAX_RESEARCHER_ASSOCIATIONS = 12;

/** Validate user-supplied links before storage or public rendering.
 * @param {unknown} input
 * @returns {ResearcherAssociation[]}
 */
export function normalizeResearcherAssociations(input) {
  if (!Array.isArray(input)) throw new Error("Associations must be a list of names and website addresses.");
  if (input.length > MAX_RESEARCHER_ASSOCIATIONS) throw new Error(`Add up to ${MAX_RESEARCHER_ASSOCIATIONS} associations.`);
  const seen = new Set();
  return input.flatMap((entry) => {
    if (!entry || typeof entry !== "object" || typeof entry.name !== "string" || typeof entry.url !== "string") throw new Error("Each association needs a name and website address.");
    const name = entry.name.trim();
    const rawUrl = entry.url.trim();
    if (!name && !rawUrl) return [];
    if (!name || name.length > 140) throw new Error("Give each association a name of up to 140 characters.");
    if (!rawUrl || rawUrl.length > 2048) throw new Error(`Enter a valid website address for ${name}.`);
    let url;
    try {
      url = new URL(/^[a-z][a-z\d+.-]*:/i.test(rawUrl) ? rawUrl : `https://${rawUrl}`);
    } catch {
      throw new Error(`Enter a valid website address for ${name}.`);
    }
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || !url.hostname.includes(".")) throw new Error(`Use a public http:// or https:// website address for ${name}.`);
    const address = url.href;
    if (seen.has(address)) throw new Error(`The website ${url.hostname} is listed more than once.`);
    seen.add(address);
    return [{ name, url: address }];
  });
}

/** @param {string} json @returns {ResearcherAssociation[]} */
export function readResearcherAssociations(json) {
  try { return normalizeResearcherAssociations(JSON.parse(json)); } catch { return []; }
}
