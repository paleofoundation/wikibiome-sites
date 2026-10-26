export function selectArticleMediaRecordsForProcessing(registry, promotions) {
  if (promotions.length === 0) return Object.values(registry);

  const seen = new Set();
  return promotions.map(({ pageId }) => {
    if (seen.has(pageId)) throw new Error(`${pageId}: duplicate promotion argument.`);
    seen.add(pageId);
    const media = registry[pageId];
    if (!media) throw new Error(`${pageId}: promotion is forbidden until a fully reviewed registry record exists.`);
    return media;
  });
}
