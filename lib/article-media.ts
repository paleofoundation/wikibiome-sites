import { articleMediaFileNames, articleMediaPolicy, articleMediaRegistry } from "@/lib/article-media-registry.mjs";

export type ScientificIdentifier = {
  authority: string;
  propertyID: string;
  value: string;
  compact: string;
  url: string;
};

export type ScientificMediaReference = {
  title: string;
  authority: string;
  role: string;
  url: string;
};

export type ArticleMedia = {
  pageId: string;
  assetType: "morphology" | "pathology" | "technical-specimen" | "microbial-community" | "mechanism" | "intervention" | "host-defense" | "clinical-caution" | "evidence-index";
  revision: number;
  title: string;
  label: string;
  publishedFile: string;
  socialFile: string;
  src: string;
  socialSrc: string;
  masterSource: string;
  width: number;
  height: number;
  socialWidth: number;
  socialHeight: number;
  alt: string;
  caption: string;
  description: string;
  credit: string;
  provenance: string;
  masterProvenance: string;
  scientificReferences: readonly ScientificMediaReference[];
  created: string;
  subjectKind: "taxon" | "element" | "condition" | "biological-process" | "intervention" | "host-defense" | "clinical-caution" | "evidence-index";
  subjectName: string;
  scientificName?: string;
  alternateName?: string;
  taxonomicRank?: string;
  scientificIdentifiers: readonly ScientificIdentifier[];
  license: string;
  reviewStatus: "editorial-review-complete";
  identifierReviewStatus: "authority-verified";
  accessibilityReviewStatus: "validated";
  publicationStatus: "published-reviewed";
  generationMethod: "trained-algorithmic-media";
  digitalSourceType: string;
  disclosure: string;
  reviewedOn: string;
  reviewLogKey: string;
  canonicalArticleUrl?: string;
};

export const ARTICLE_MEDIA_DIGITAL_SOURCE_TYPE =
  articleMediaPolicy.digitalSource.type;
export const ARTICLE_MEDIA_LICENSE = articleMediaPolicy.license.url;
export const ARTICLE_MEDIA_LICENSE_LABEL = articleMediaPolicy.license.shortName;

const articleMedia = articleMediaRegistry as Record<string, ArticleMedia>;

function assertMediaRegistry() {
  for (const [id, media] of Object.entries(articleMedia)) {
    if (id !== media.pageId) throw new Error(`Article media key ${id} does not match pageId ${media.pageId}.`);
    const expectedFiles = articleMediaFileNames(media.pageId, media.assetType, media.revision);
    if (media.publishedFile !== expectedFiles.publishedFile || media.socialFile !== expectedFiles.socialFile || media.src !== expectedFiles.src || media.socialSrc !== expectedFiles.socialSrc || media.masterSource !== expectedFiles.masterSource) {
      throw new Error(`Article media ${id} does not follow the canonical filename convention.`);
    }
    if (!media.scientificIdentifiers.length) throw new Error(`Article media ${id} has no controlled scientific identifier.`);
    if (media.license !== ARTICLE_MEDIA_LICENSE) throw new Error(`Article media ${id} does not use the registry license.`);
    if (!articleMediaPolicy.reviewStatuses[media.reviewStatus]) throw new Error(`Article media ${id} has an unknown review status.`);
    if (!articleMediaPolicy.identifierReviewStatuses[media.identifierReviewStatus]) throw new Error(`Article media ${id} has an unknown identifier review status.`);
    if (!articleMediaPolicy.accessibilityReviewStatuses[media.accessibilityReviewStatus]) throw new Error(`Article media ${id} has an unknown accessibility review status.`);
    if (!articleMediaPolicy.publicationStatuses[media.publicationStatus]) throw new Error(`Article media ${id} is not reviewed for publication.`);
    if (media.digitalSourceType !== ARTICLE_MEDIA_DIGITAL_SOURCE_TYPE || media.generationMethod !== "trained-algorithmic-media") throw new Error(`Article media ${id} has an invalid trained-algorithmic-media disclosure.`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(media.reviewedOn)) throw new Error(`Article media ${id} has an invalid review date.`);
    if (!media.scientificReferences.length) throw new Error(`Article media ${id} has no scientific visual references.`);
    if (media.reviewLogKey !== `${media.pageId}|${media.publishedFile}`) throw new Error(`Article media ${id} has an invalid review-log key.`);
    const authorities = new Set(media.scientificIdentifiers.map((identifier) => identifier.authority));
    const required = articleMediaPolicy.requiredAuthorities[media.subjectKind];
    for (const authority of required) {
      if (!authorities.has(authority)) throw new Error(`Article media ${id} is missing required ${authority} identification.`);
    }
    const propertyIDs = new Set(media.scientificIdentifiers.map((identifier) => identifier.propertyID));
    for (const propertyID of articleMediaPolicy.requiredPropertyIDs[media.subjectKind]) {
      if (!propertyIDs.has(propertyID)) throw new Error(`Article media ${id} is missing required ${propertyID} identification.`);
    }
    if (media.subjectKind === "taxon" && (!media.scientificName || !media.taxonomicRank)) {
      throw new Error(`Article media ${id} requires a scientific name and taxonomic rank.`);
    }
    for (const identifier of media.scientificIdentifiers) {
      if (!/^https:\/\//.test(identifier.url)) throw new Error(`Article media ${id} has a non-HTTPS scientific identifier.`);
    }
    for (const reference of media.scientificReferences) {
      if (!reference.title || !reference.authority || !reference.role || !/^https:\/\//.test(reference.url)) {
        throw new Error(`Article media ${id} has an incomplete scientific visual reference.`);
      }
    }
  }
}

assertMediaRegistry();

export function getArticleMedia(pageId: string) {
  return articleMedia[pageId];
}

export function getArticleMediaEntries() {
  return Object.values(articleMedia);
}

export function getArticleMediaReviewLabel(media: ArticleMedia) {
  return articleMediaPolicy.reviewStatuses[media.reviewStatus].label;
}

export function getArticleMediaIdentifierReviewLabel(media: ArticleMedia) {
  return articleMediaPolicy.identifierReviewStatuses[media.identifierReviewStatus].label;
}

export function getArticleMediaAccessibilityReviewLabel(media: ArticleMedia) {
  return articleMediaPolicy.accessibilityReviewStatuses[media.accessibilityReviewStatus].label;
}

function subjectStructuredData(media: ArticleMedia) {
  const schemaType = articleMediaPolicy.subjectSchemaTypes[media.subjectKind];
  const sameAs = [...new Set(media.scientificIdentifiers.map((identifier) => identifier.url))];
  const alternateName = media.alternateName
    ?? (media.scientificName !== media.subjectName ? media.scientificName : undefined);
  return {
    "@type": schemaType,
    "@id": sameAs[0],
    name: media.subjectName,
    ...(alternateName ? { alternateName } : {}),
    ...(media.taxonomicRank ? { taxonRank: media.taxonomicRank } : {}),
    identifier: media.scientificIdentifiers.map((identifier) => ({
      "@type": "PropertyValue",
      propertyID: identifier.propertyID,
      value: identifier.value,
      name: identifier.authority,
      url: identifier.url,
    })),
    sameAs,
  };
}

export function articleMediaStructuredData(media: ArticleMedia, origin: string, articlePath: string) {
  const articleUrl = new URL(articlePath, origin).toString();
  const imageUrl = new URL(media.src, origin).toString();
  const subject = subjectStructuredData(media);
  const editor = {
    "@type": "Organization",
    name: "WikiBiome, a project of Microbiome Medicine",
    url: "https://www.wikibiome.com",
  };
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${articleUrl}#webpage`,
    url: articleUrl,
    name: media.title,
    about: subject,
    primaryImageOfPage: {
      "@type": "ImageObject",
      "@id": `${articleUrl}#primaryimage`,
      contentUrl: imageUrl,
      thumbnailUrl: imageUrl,
      name: media.title,
      caption: media.caption,
      description: media.description,
      encodingFormat: "image/webp",
      width: media.width,
      height: media.height,
      representativeOfPage: true,
      about: subject,
      identifier: media.scientificIdentifiers.map((identifier) => ({
        "@type": "PropertyValue",
        propertyID: identifier.propertyID,
        value: identifier.value,
        name: identifier.authority,
        url: identifier.url,
      })),
      keywords: media.scientificIdentifiers.map((identifier) => identifier.compact),
      isBasedOn: media.scientificReferences.map((reference) => ({
        "@type": "CreativeWork",
        name: reference.title,
        url: reference.url,
        description: `${reference.authority}: ${reference.role}`,
      })),
      creditText: media.credit,
      creator: editor,
      editor,
      copyrightHolder: editor,
      copyrightNotice: `© ${media.created.slice(0, 4)} ${media.credit}. Licensed ${ARTICLE_MEDIA_LICENSE_LABEL}.`,
      license: media.license,
      creativeWorkStatus: [
        {
          "@type": "DefinedTerm",
          termCode: media.reviewStatus,
          name: getArticleMediaReviewLabel(media),
          description: articleMediaPolicy.reviewStatuses[media.reviewStatus].description,
          inDefinedTermSet: `${origin}/about#editorial-principles`,
        },
        {
          "@type": "DefinedTerm",
          termCode: media.identifierReviewStatus,
          name: getArticleMediaIdentifierReviewLabel(media),
          description: articleMediaPolicy.identifierReviewStatuses[media.identifierReviewStatus].description,
          inDefinedTermSet: `${origin}/about#editorial-principles`,
        },
        {
          "@type": "DefinedTerm",
          termCode: media.accessibilityReviewStatus,
          name: getArticleMediaAccessibilityReviewLabel(media),
          description: articleMediaPolicy.accessibilityReviewStatuses[media.accessibilityReviewStatus].description,
          inDefinedTermSet: `${origin}/about#editorial-principles`,
        },
        {
          "@type": "DefinedTerm",
          termCode: media.publicationStatus,
          name: articleMediaPolicy.publicationStatuses[media.publicationStatus].label,
          description: articleMediaPolicy.publicationStatuses[media.publicationStatus].description,
          inDefinedTermSet: `${origin}/about#editorial-principles`,
        },
      ],
      publishingPrinciples: `${origin}/about#editorial-principles`,
      review: {
        "@type": "Review",
        name: "WikiBiome scientific media review",
        reviewBody: media.disclosure,
        datePublished: media.reviewedOn,
        identifier: media.reviewLogKey,
        author: editor,
      },
      digitalSourceType: media.digitalSourceType,
      usageInfo: media.disclosure,
      dateCreated: media.created,
      dateModified: media.reviewedOn,
    },
  };
}
