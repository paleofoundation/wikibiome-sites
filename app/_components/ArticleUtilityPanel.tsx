import Link from "@/app/_components/NativeLink";
import { ArticleTools } from "@/app/_components/ArticleTools";
import { formatDate } from "@/lib/wikibiome";

export function ArticleUtilityPanel({ title, pageId, updated }: { title: string; pageId: string; updated?: string }) {
  return <section className="article-utility-panel" aria-label="Article tools">
    <header><h2>Article tools</h2>{updated && <p>Updated <time dateTime={updated}>{formatDate(updated)}</time></p>}</header>
    <nav aria-label="Article editing and history"><Link href={`/article/${pageId}/history`}>Revision history</Link><Link href={`/article/${pageId}/suggest`}>Suggest an edit</Link></nav>
    <ArticleTools title={title} canonicalPath={`/article/${pageId}`} updated={updated} />
  </section>;
}
