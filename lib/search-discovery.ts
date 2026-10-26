import type { Metadata } from "next";
import type { ArticleMedia } from "@/lib/article-media";
import { canonicalArticleId, type SourceRecord, type WikiPage } from "@/lib/wikibiome";

export const PUBLIC_ORIGIN = "https://www.wikibiome.com";
export const SITE_NAME = "WikiBiome";
export const SITE_DESCRIPTION =
  "Explore the organisms, ecological pressures, and molecular conversations shaping human health through an evidence-linked encyclopedia.";

const DEFAULT_SOCIAL_IMAGE = {
  url: "/og-blue.png",
  width: 1732,
  height: 909,
  alt: "WikiBiome — the human microbiome encyclopedia",
};

type PublicMetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  image?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
  index?: boolean;
};

export function absolutePublicUrl(path: string) {
  return new URL(path, PUBLIC_ORIGIN).toString();
}

export function publicPageMetadata({
  title,
  description,
  path,
  type = "website",
  image = DEFAULT_SOCIAL_IMAGE,
  index = true,
}: PublicMetadataInput): Metadata {
  const canonicalUrl = absolutePublicUrl(path);
  const socialImage = {
    ...image,
    url: absolutePublicUrl(image.url),
  };

  return {
    title,
    description,
    alternates: { canonical: path },
    robots: {
      index,
      follow: true,
      googleBot: {
        index,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title,
      description,
      type,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage.url],
    },
  };
}

const organizationId = `${PUBLIC_ORIGIN}/#organization`;
const websiteId = `${PUBLIC_ORIGIN}/#website`;

const organizationReference = { "@id": organizationId };
const websiteReference = { "@id": websiteId };

export function siteIdentityStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: "WikiBiome, a project of Microbiome Medicine",
        alternateName: "WikiBiome",
        url: `${PUBLIC_ORIGIN}/`,
        logo: {
          "@type": "ImageObject",
          url: `${PUBLIC_ORIGIN}/wikibiome-logo.png`,
        },
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${PUBLIC_ORIGIN}/`,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: organizationReference,
      },
    ],
  };
}

function subjectStructuredData(media: ArticleMedia) {
  const schemaType = media.subjectKind === "taxon"
    ? "Taxon"
    : media.subjectKind === "element"
      ? "ChemicalSubstance"
      : "MedicalCondition";
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

function imageStructuredData(media: ArticleMedia, articleUrl: string) {
  const subject = subjectStructuredData(media);
  return {
    "@type": "ImageObject",
    "@id": `${articleUrl}#primaryimage`,
    contentUrl: absolutePublicUrl(media.src),
    thumbnailUrl: absolutePublicUrl(media.src),
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
    creditText: media.credit,
    creator: organizationReference,
    editor: organizationReference,
    copyrightHolder: organizationReference,
    copyrightNotice: `© ${media.created.slice(0, 4)} ${media.credit}. Licensed CC BY-SA 4.0.`,
    license: media.license,
    acquireLicensePage: `${PUBLIC_ORIGIN}/terms#licensing-and-third-party-material`,
    creativeWorkStatus: [media.reviewStatus, media.identifierReviewStatus],
    publishingPrinciples: `${PUBLIC_ORIGIN}/about#editorial-principles`,
    digitalSourceType: "https://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia",
    dateCreated: media.created,
    dateModified: media.reviewedOn,
  };
}

export function articleStructuredData({
  page,
  canonicalId,
  description,
  updated,
  media,
}: {
  page: WikiPage;
  canonicalId: string;
  description: string;
  updated?: string;
  media?: ArticleMedia;
}) {
  const articleUrl = absolutePublicUrl(`/article/${canonicalId}`);
  const articleId = `${articleUrl}#article`;
  const image = media ? imageStructuredData(media, articleUrl) : undefined;
  const subject = media ? subjectStructuredData(media) : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${articleUrl}#webpage`,
        url: articleUrl,
        name: page.title,
        description,
        inLanguage: "en",
        isPartOf: websiteReference,
        mainEntity: { "@id": articleId },
        ...(subject ? { about: subject } : {}),
        ...(image ? { primaryImageOfPage: { "@id": image["@id"] } } : {}),
      },
      {
        "@type": "Article",
        "@id": articleId,
        url: articleUrl,
        headline: page.title,
        description,
        articleSection: page.category,
        inLanguage: "en",
        mainEntityOfPage: { "@id": `${articleUrl}#webpage` },
        author: organizationReference,
        publisher: organizationReference,
        ...(page.created ? { datePublished: page.created } : {}),
        ...(updated ? { dateModified: updated } : {}),
        ...(image ? { image: { "@id": image["@id"] } } : {}),
      },
      ...(image ? [image] : []),
    ],
  };
}

export function sourceStructuredData(id: string, source: SourceRecord) {
  const url = absolutePublicUrl(`/source/${id}`);
  const doi = source.doi?.replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "").replace(/^doi:\s*/i, "").trim();
  const workId = `${url}#work`;
  const workType = source.journal && !/(?:conference|manuscript|preprint)/i.test(source.journal)
    ? "ScholarlyArticle"
    : "CreativeWork";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: source.title,
        isPartOf: websiteReference,
        mainEntity: { "@id": workId },
      },
      {
        "@type": workType,
        "@id": workId,
        name: source.title,
        headline: source.title,
        url,
        ...(source.authors?.length
          ? { author: source.authors.map((name) => ({ "@type": "Person", name })) }
          : {}),
        ...(source.year ? { datePublished: String(source.year) } : {}),
        ...(source.journal ? { isPartOf: { "@type": "Periodical", name: source.journal } } : {}),
        ...(doi
          ? {
              identifier: { "@type": "PropertyValue", propertyID: "DOI", value: doi },
              sameAs: `https://doi.org/${doi}`,
            }
          : {}),
      },
    ],
  };
}

export function collectionStructuredData({
  path,
  name,
  description,
  pages,
}: {
  path: string;
  name: string;
  description: string;
  pages: WikiPage[];
}) {
  const url = absolutePublicUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collection`,
    url,
    name,
    description,
    inLanguage: "en",
    isPartOf: websiteReference,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: pages.length,
      itemListElement: pages.slice(0, 100).map((page, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: page.title,
        url: absolutePublicUrl(`/article/${canonicalArticleId(page.id)}`),
      })),
    },
  };
}

export function researchToolStructuredData({
  path,
  name,
  description,
}: {
  path: string;
  name: string;
  description: string;
}) {
  const url = absolutePublicUrl(path);
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "@id": `${url}#tool`,
    url,
    name,
    description,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    isAccessibleForFree: true,
    inLanguage: "en",
    publisher: organizationReference,
    isPartOf: websiteReference,
  };
}
