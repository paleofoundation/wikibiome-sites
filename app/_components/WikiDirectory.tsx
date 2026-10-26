import Link from "@/app/_components/NativeLink";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { getArticleMedia } from "@/lib/article-media";
import { OrganizationDirectory } from "@/app/_components/OrganizationDirectory";
import { searchOrganizationProfiles } from "@/lib/organization-profiles.mjs";
import {
  categories,
  categoryLabel,
  getCategoryCount,
  plainText,
  wikiStats,
  type WikiPage,
} from "@/lib/wikibiome";

function DirectoryRail() {
  return (
    <aside className="directory-rail">
      <p>Browse WikiBiome</p>
      <Link href="/">Featured article</Link>
      <Link href="/institutions">Organizations &amp; projects</Link>
      {categories.map((category) => <Link href={`/category/${category.id}`} key={category.id}>{category.label}<b>{getCategoryCount(category.id)}</b></Link>)}
      <div><strong>{wikiStats.totalPages}</strong><span>public articles</span><strong>{wikiStats.sources.toLocaleString()}</strong><span>indexed sources</span></div>
    </aside>
  );
}

export function WikiDirectory({
  title,
  kicker,
  description,
  pages,
  query = "",
  searchCategory = "all",
  showSearchFilters = false,
}: {
  title: string;
  kicker: string;
  description: string;
  pages: WikiPage[];
  query?: string;
  searchCategory?: string;
  showSearchFilters?: boolean;
}) {
  const alphabetical = pages.every((page, index) => index === 0 || pages[index - 1].title.localeCompare(page.title) <= 0);
  const letters = alphabetical ? Array.from(new Set(pages.map((page) => page.title[0]?.toUpperCase()).filter(Boolean))).sort() : [];

  return (
    <>
      <WikiHeader query={query} />
      <main className="directory-shell">
        <DirectoryRail />
        <div className="directory-main">
          <div className="directory-breadcrumbs"><Link href="/">WikiBiome</Link><span>/</span><b>{title}</b></div>
          <header className="directory-header">
            <span>{kicker}</span>
            <h1>{title}</h1>
            <p>{description}</p>
            <div><b>{pages.length}</b> records in this view</div>
          </header>
          {showSearchFilters && (
            <nav className="search-domain-filters" aria-label="Filter search by knowledge domain">
              <Link className={searchCategory === "all" ? "active" : ""} href={`/search?q=${encodeURIComponent(query)}`}>All</Link>
              {categories.map((category) => <Link className={searchCategory === category.id ? "active" : ""} href={`/search?q=${encodeURIComponent(query)}&category=${category.id}`} key={category.id}>{category.label}<b>{getCategoryCount(category.id)}</b></Link>)}
            </nav>
          )}
          {!!letters.length && <nav className="letter-nav" aria-label="Available initial letters">{letters.map((letter) => <a href={`#letter-${letter}`} key={letter}>{letter}</a>)}</nav>}
          {showSearchFilters && searchCategory === "all" && <OrganizationDirectory profiles={searchOrganizationProfiles(query)} title="Organizations & projects" />}
          <div className="directory-results">
            {pages.map((page, index) => {
              const letter = page.title[0]?.toUpperCase();
              const showLetter = alphabetical && (index === 0 || pages[index - 1]?.title[0]?.toUpperCase() !== letter);
              const media = getArticleMedia(page.id);
              return (
                <div className="directory-record-wrap" id={showLetter ? `letter-${letter}` : undefined} key={page.id}>
                  {showLetter && <span className="directory-letter">{letter}</span>}
                  <article className={media ? "directory-record has-media" : "directory-record"}>
                    {media && (
                      <Link className="directory-record-media" href={`/article/${page.id}`} aria-label={`Open ${page.title}`}>
                        {/* Canonical reviewed media already has optimized, immutable WebP derivatives. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={media.src} alt={media.alt} width={media.width} height={media.height} loading="lazy" decoding="async" />
                      </Link>
                    )}
                    <div><span>{categoryLabel(page.category)}</span><b>{page.sourceCount ?? 0} sources</b></div>
                    <h2><Link href={`/article/${page.id}`}>{page.title}</Link></h2>
                    <p>{plainText(page.overview).slice(0, 270) || "This knowledge-base record is being expanded from WikiBiome’s evidence graph."}{plainText(page.overview).length > 270 ? "…" : ""}</p>
                    <footer>{page.tags?.slice(0, 5).map((tag) => <Link href={`/search?q=${encodeURIComponent(tag)}`} key={tag}>{tag}</Link>)}<Link href={`/article/${page.id}`}>Open article →</Link></footer>
                  </article>
                </div>
              );
            })}
            {!pages.length && <div className="directory-empty"><span>0</span><h2>No matching article yet.</h2><p>Try a broader scientific term or browse a knowledge domain.</p><Link href="/category/mechanism">Browse mechanisms →</Link></div>}
          </div>
        </div>
      </main>
    </>
  );
}

export { DirectoryRail };
