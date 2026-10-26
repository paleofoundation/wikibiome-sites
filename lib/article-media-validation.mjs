import { articleMediaFileNames, articleMediaPolicy } from "./article-media-registry.mjs";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const requiredTextFields = [
  "pageId",
  "title",
  "label",
  "alt",
  "caption",
  "description",
  "credit",
  "provenance",
  "masterProvenance",
  "subjectName",
  "disclosure",
];

export function assertArticleMediaRecord(media) {
  for (const field of requiredTextFields) {
    if (typeof media[field] !== "string" || !media[field].trim()) {
      throw new Error(`${media.pageId ?? "Unknown media record"}: missing required ${field}.`);
    }
  }

  const expectedFiles = articleMediaFileNames(media.pageId, media.assetType, media.revision);
  for (const [field, expected] of Object.entries(expectedFiles)) {
    if (media[field] !== expected) throw new Error(`${media.pageId}: ${field} does not match the canonical media convention.`);
  }
  if (media.reviewLogKey !== `${media.pageId}|${media.publishedFile}`) throw new Error(`${media.pageId}: invalid review-log key.`);
  for (const dimension of ["width", "height", "socialWidth", "socialHeight"]) {
    if (!Number.isInteger(media[dimension]) || media[dimension] < 1) {
      throw new Error(`${media.pageId}: ${dimension} must be a positive integer.`);
    }
  }
  for (const qualityField of ["articleWebpQuality", "socialWebpQuality"]) {
    if (media[qualityField] !== undefined && (!Number.isInteger(media[qualityField]) || media[qualityField] < 1 || media[qualityField] > 100)) {
      throw new Error(`${media.pageId}: ${qualityField} must be an integer from 1 to 100.`);
    }
  }
  if (media.socialResizeFit !== undefined && !["cover", "contain"].includes(media.socialResizeFit)) {
    throw new Error(`${media.pageId}: unsupported social resize fit ${media.socialResizeFit}.`);
  }
  if (media.socialResizePosition !== undefined && !["attention", "centre"].includes(media.socialResizePosition)) {
    throw new Error(`${media.pageId}: unsupported social resize position ${media.socialResizePosition}.`);
  }
  if (media.socialResizeFit === "contain" && (typeof media.socialBackground !== "string" || !/^#[0-9a-f]{6}$/i.test(media.socialBackground))) {
    throw new Error(`${media.pageId}: contained social derivatives require a six-digit hexadecimal background.`);
  }
  if (media.alt.length < 25 || media.alt.length > 220) throw new Error(`${media.pageId}: alt text must contain 25–220 characters.`);
  if (/^(?:an? )?(?:image|photo|picture|graphic|illustration) of\b/i.test(media.alt)) {
    throw new Error(`${media.pageId}: alt text must describe the subject directly without an “image of” preamble.`);
  }
  if (media.alt === media.caption || media.alt === media.description) {
    throw new Error(`${media.pageId}: alt text, caption, and description must serve distinct accessibility and editorial purposes.`);
  }
  if (!datePattern.test(media.created) || !datePattern.test(media.reviewedOn)) throw new Error(`${media.pageId}: invalid creation or review date.`);
  if (media.reviewedOn < media.created) throw new Error(`${media.pageId}: review date precedes creation date.`);
  if (media.embeddedCreationDate !== undefined && media.embeddedCreationDate !== media.created) {
    throw new Error(`${media.pageId}: embedded creation date must match the reviewed registry creation date.`);
  }
  if (media.canonicalArticleUrl !== undefined && media.canonicalArticleUrl !== `https://www.wikibiome.com/article/${media.pageId}`) {
    throw new Error(`${media.pageId}: canonical article URL does not match the canonical page.`);
  }
  if (media.license !== articleMediaPolicy.license.url) throw new Error(`${media.pageId}: license does not match the media policy.`);
  if (!articleMediaPolicy.reviewStatuses[media.reviewStatus]) throw new Error(`${media.pageId}: unknown review status.`);
  if (!articleMediaPolicy.identifierReviewStatuses[media.identifierReviewStatus]) throw new Error(`${media.pageId}: controlled identifiers are not authority-verified.`);
  if (!articleMediaPolicy.accessibilityReviewStatuses[media.accessibilityReviewStatus]) throw new Error(`${media.pageId}: accessibility is not validated.`);
  if (!articleMediaPolicy.publicationStatuses[media.publicationStatus]) throw new Error(`${media.pageId}: asset is not reviewed for publication.`);
  if (media.generationMethod !== "trained-algorithmic-media" || media.digitalSourceType !== articleMediaPolicy.digitalSource.type || media.disclosure !== articleMediaPolicy.digitalSource.disclosure) {
    throw new Error(`${media.pageId}: trained-algorithmic-media disclosure is incomplete.`);
  }

  const requiredAuthorities = articleMediaPolicy.requiredAuthorities[media.subjectKind];
  const requiredPropertyIDs = articleMediaPolicy.requiredPropertyIDs[media.subjectKind];
  if (!requiredAuthorities || !requiredPropertyIDs || !articleMediaPolicy.subjectSchemaTypes[media.subjectKind]) {
    throw new Error(`${media.pageId}: unsupported subject kind ${media.subjectKind}.`);
  }
  if (!Array.isArray(media.scientificIdentifiers) || !media.scientificIdentifiers.length) {
    throw new Error(`${media.pageId}: missing controlled scientific identifier.`);
  }
  const authorities = new Set(media.scientificIdentifiers.map((identifier) => identifier.authority));
  const propertyIDs = new Set(media.scientificIdentifiers.map((identifier) => identifier.propertyID));
  for (const authority of requiredAuthorities) {
    if (!authorities.has(authority)) throw new Error(`${media.pageId}: missing required ${authority} identifier.`);
  }
  for (const propertyID of requiredPropertyIDs) {
    if (!propertyIDs.has(propertyID)) throw new Error(`${media.pageId}: missing required ${propertyID} identifier.`);
  }
  for (const identifier of media.scientificIdentifiers) {
    if (!identifier.authority || !identifier.propertyID || !identifier.value || !identifier.compact || !/^https:\/\//.test(identifier.url)) {
      throw new Error(`${media.pageId}: incomplete controlled scientific identifier.`);
    }
  }
  if (media.subjectKind === "taxon" && (!media.scientificName || !media.taxonomicRank)) {
    throw new Error(`${media.pageId}: taxa require a scientific name and taxonomic rank.`);
  }
  if (!Array.isArray(media.scientificReferences) || media.scientificReferences.length < 2) {
    throw new Error(`${media.pageId}: at least two scientific visual references are required.`);
  }
  for (const reference of media.scientificReferences) {
    if (!reference.title || !reference.authority || !reference.role || !/^https:\/\//.test(reference.url)) {
      throw new Error(`${media.pageId}: incomplete scientific visual reference.`);
    }
  }
}
