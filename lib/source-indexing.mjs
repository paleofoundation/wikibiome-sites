// Citation records have no article body with three supporting references.
// WIKIBIOME-BUILDOUT-1 supersedes the earlier 37-source exception. Preserve
// the review registry and every source route for citations and author work.
export function isIndexableSource(_id) {
  void _id; // Keep the existing caller contract while the exception is retired.
  return false;
}
