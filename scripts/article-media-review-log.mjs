const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export function mergeApprovedMediaReviews(reviewLog, additions, updatedOn) {
  if (reviewLog?.schemaVersion !== 2 || !isRecord(reviewLog.reviews) || !isRecord(reviewLog.reviewingAuthorities)) {
    throw new Error("Scientific media review log schema is invalid.");
  }
  if (!isRecord(additions) || Object.keys(additions).length === 0) {
    throw new Error("At least one approved review record is required.");
  }
  if (!datePattern.test(updatedOn ?? "")) throw new Error("Review-log update date must use YYYY-MM-DD.");

  for (const [key, review] of Object.entries(additions)) {
    assertApprovedMediaReview(key, review, reviewLog.reviewingAuthorities);
    if (reviewLog.reviews[key]) throw new Error(`${key}: refusing to overwrite an existing review record.`);
  }

  return {
    ...reviewLog,
    updatedOn,
    reviews: { ...reviewLog.reviews, ...additions },
  };
}

export function assertApprovedMediaReview(key, review, reviewingAuthorities) {
  if (!isRecord(review)) throw new Error(`${key}: review record must be an object.`);
  if (key !== `${review.pageId}|${review.publishedFile}`) throw new Error(`${key}: review key does not match pageId and publishedFile.`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(review.pageId ?? "")) throw new Error(`${key}: invalid canonical pageId.`);
  if (!Number.isInteger(review.revision) || review.revision < 1) throw new Error(`${key}: revision must be a positive integer.`);
  if (!datePattern.test(review.reviewedOn ?? "")) throw new Error(`${key}: review date must use YYYY-MM-DD.`);
  if (review.disposition !== "approved") throw new Error(`${key}: only approved review records may be merged.`);
  const authority = reviewingAuthorities[review.reviewingAuthority];
  if (!authority?.name || !authority?.reviewerId || !authority?.scope) throw new Error(`${key}: reviewing authority is not registered or complete.`);
  for (const field of ["publishedFile", "masterSource", "socialFile"]) {
    if (typeof review[field] !== "string" || !review[field]) throw new Error(`${key}: ${field} is missing.`);
  }
  const escapedPageId = review.pageId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const publishedPattern = new RegExp(`^${escapedPageId}-(?:morphology|pathology|technical-specimen|microbial-community|mechanism|intervention|host-defense|clinical-caution|evidence-index)-v${review.revision}\\.webp$`);
  if (!publishedPattern.test(review.publishedFile)) throw new Error(`${key}: published filename is not canonical.`);
  const stem = review.publishedFile.slice(0, -5);
  if (review.masterSource !== `${stem}-master.png` || review.socialFile !== `${stem}-social.webp`) {
    throw new Error(`${key}: master or social filename is not canonical.`);
  }
  if (review.scientificReferenceCheck?.status !== "pass" || review.scientificReferenceCheck.checkedUrls?.length < 2 || !review.scientificReferenceCheck.notes) {
    throw new Error(`${key}: scientific reference check is incomplete.`);
  }
  if (review.subjectReview?.status !== "pass" || !review.subjectReview.notes) throw new Error(`${key}: subject review is incomplete.`);
  if (review.accessibilityReview?.status !== "pass" || !review.accessibilityReview.notes) throw new Error(`${key}: accessibility review is incomplete.`);
  if (!review.notes || !isRecord(review.revisionLinkage)) throw new Error(`${key}: notes or revision linkage are missing.`);
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
