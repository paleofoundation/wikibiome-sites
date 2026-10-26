import { articleMediaPolicy } from "./article-media-registry.mjs";

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function bag(values) {
  return values.map((value) => `<rdf:li>${escapeXml(value)}</rdf:li>`).join("");
}

export function articleMediaXmp(media) {
  const identifiers = media.scientificIdentifiers.flatMap((identifier) => [identifier.compact, identifier.url]);
  const references = media.scientificReferences.flatMap((reference) => [reference.title, reference.url]);
  const review = articleMediaPolicy.reviewStatuses[media.reviewStatus];
  const accessibilityReview = articleMediaPolicy.accessibilityReviewStatuses[media.accessibilityReviewStatus];
  const publication = articleMediaPolicy.publicationStatuses[media.publicationStatus];
  const creationDate = media.embeddedCreationDate
    ? `\n      <photoshop:DateCreated>${escapeXml(media.embeddedCreationDate)}</photoshop:DateCreated>`
    : "";
  const canonicalArticle = media.canonicalArticleUrl
    ? `\n      <wb:CanonicalArticle>${escapeXml(media.canonicalArticleUrl)}</wb:CanonicalArticle>`
    : "";
  return `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/" xmlns:iptcExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/" xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/" xmlns:cc="http://creativecommons.org/ns#" xmlns:wb="https://wikibiome.com/ns/media/2.0/">
      <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${escapeXml(media.title)}</rdf:li></rdf:Alt></dc:title>
      <dc:description><rdf:Alt><rdf:li xml:lang="x-default">${escapeXml(media.description)}</rdf:li></rdf:Alt></dc:description>
      <dc:creator><rdf:Seq><rdf:li>${escapeXml(media.credit)}</rdf:li></rdf:Seq></dc:creator>
      <dc:subject><rdf:Bag>${bag([...identifiers, ...references])}</rdf:Bag></dc:subject>
      <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">© ${escapeXml(media.created.slice(0, 4))} ${escapeXml(media.credit)}. Licensed ${escapeXml(articleMediaPolicy.license.shortName)}.</rdf:li></rdf:Alt></dc:rights>${creationDate}
      <photoshop:Headline>${escapeXml(media.caption)}</photoshop:Headline>
      <photoshop:Credit>${escapeXml(media.credit)}</photoshop:Credit>
      <iptcExt:DigitalSourceType>${escapeXml(media.digitalSourceType)}</iptcExt:DigitalSourceType>
      <xmpRights:Marked>True</xmpRights:Marked>
      <xmpRights:WebStatement>${escapeXml(media.license)}</xmpRights:WebStatement>
      <xmpRights:UsageTerms><rdf:Alt><rdf:li xml:lang="x-default">${escapeXml(articleMediaPolicy.license.name)}; attribution to ${escapeXml(articleMediaPolicy.license.attributionName)}.</rdf:li></rdf:Alt></xmpRights:UsageTerms>
      <cc:license rdf:resource="${escapeXml(media.license)}"/>
      <wb:AltText>${escapeXml(media.alt)}</wb:AltText>
      <wb:Caption>${escapeXml(media.caption)}</wb:Caption>
      <wb:Description>${escapeXml(media.description)}</wb:Description>
      <wb:Provenance>${escapeXml(media.provenance)}</wb:Provenance>
      <wb:MasterProvenance>${escapeXml(media.masterProvenance)}</wb:MasterProvenance>
      <wb:Disclosure>${escapeXml(media.disclosure)}</wb:Disclosure>
      <wb:GenerationMethod>${escapeXml(media.generationMethod)}</wb:GenerationMethod>
      <wb:SubjectKind>${escapeXml(media.subjectKind)}</wb:SubjectKind>
      <wb:ReviewStatus>${escapeXml(media.reviewStatus)}</wb:ReviewStatus>
      <wb:ReviewStatusLabel>${escapeXml(review.label)}</wb:ReviewStatusLabel>
      <wb:IdentifierReviewStatus>${escapeXml(media.identifierReviewStatus)}</wb:IdentifierReviewStatus>
      <wb:AccessibilityReviewStatus>${escapeXml(media.accessibilityReviewStatus)}</wb:AccessibilityReviewStatus>
      <wb:AccessibilityReviewStatusLabel>${escapeXml(accessibilityReview.label)}</wb:AccessibilityReviewStatusLabel>
      <wb:PublicationStatus>${escapeXml(media.publicationStatus)}</wb:PublicationStatus>
      <wb:PublicationStatusLabel>${escapeXml(publication.label)}</wb:PublicationStatusLabel>
      <wb:ReviewLogKey>${escapeXml(media.reviewLogKey)}</wb:ReviewLogKey>
      <wb:ReviewedOn>${escapeXml(media.reviewedOn)}</wb:ReviewedOn>${canonicalArticle}
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}

export function requiredEmbeddedMetadataTokens(media) {
  return [
    "wb:AltText",
    "wb:Caption",
    "wb:Description",
    "wb:Provenance",
    "wb:MasterProvenance",
    "wb:Disclosure",
    "wb:AccessibilityReviewStatus",
    "wb:PublicationStatus",
    "wb:ReviewLogKey",
    media.title,
    media.alt,
    media.caption,
    media.description,
    media.provenance,
    media.masterProvenance,
    media.license,
    media.digitalSourceType,
    media.generationMethod,
    media.reviewStatus,
    media.identifierReviewStatus,
    media.accessibilityReviewStatus,
    media.publicationStatus,
    media.reviewLogKey,
    ...(media.canonicalArticleUrl ? ["wb:CanonicalArticle", media.canonicalArticleUrl] : []),
    ...(media.embeddedCreationDate ? ["photoshop:DateCreated", media.embeddedCreationDate] : []),
    ...media.scientificIdentifiers.flatMap((identifier) => [identifier.compact, identifier.url]),
    ...media.scientificReferences.flatMap((reference) => [reference.title, reference.url]),
  ].map(escapeXml);
}
