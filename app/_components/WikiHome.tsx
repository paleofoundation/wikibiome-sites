import Link from "@/app/_components/NativeLink";
import { ResearcherAccountControl } from "@/app/_components/ResearcherAccountControl";
import { getArticleMedia } from "@/lib/article-media";
import { categories, categoryLabel, getCategoryCount, getWikiPage, plainText, wikiStats, type WikiPage } from "@/lib/wikibiome";

const bodyLinks = [
  { id: "alzheimers-disease", label: "Alzheimer’s disease", kind: "Disease", side: "right", className: "body-point-brain" },
  { id: "helicobacter-pylori", label: "H. pylori", kind: "Microbe", side: "left", className: "body-point-stomach" },
  { id: "nickel", label: "Nickel", kind: "Metal", side: "right", className: "body-point-nickel" },
  { id: "akkermansia-muciniphila", label: "Akkermansia", kind: "Microbe", side: "right", className: "body-point-gut" },
  { id: "dysbiosis", label: "Dysbiosis", kind: "Mechanism", side: "left", className: "body-point-dysbiosis" },
  { id: "iron", label: "Iron", kind: "Metal", side: "left", className: "body-point-iron" },
  { id: "colorectal-cancer", label: "Colorectal cancer", kind: "Disease", side: "right", className: "body-point-colon" },
];

const featuredIds = ["gut-microbiome", "helicobacter-pylori", "akkermansia-muciniphila", "dysbiosis", "alzheimers-disease"];
const trailIds = ["nickel", "helicobacter-pylori", "urease", "gut-metal-microbiome", "gastric-cancer"];
const portalIds = ["akkermansia-muciniphila", "nickel", "alzheimers-disease", "dysbiosis"];

function resolvePages(ids: string[]) {
  return ids.map(getWikiPage).filter((page): page is WikiPage => Boolean(page));
}

export function WikiHome() {
  const featured = resolvePages(featuredIds);
  const trail = resolvePages(trailIds);
  const portals = resolvePages(portalIds);

  return (
    <main className="wiki-home">
      <section className="home-hero">
        <header className="home-nav">
          <Link className="home-wordmark" href="/">
            <span className="home-logo"><img src="/wikibiome-logo.png" alt="" /></span>
            <span className="home-word"><b>Wiki</b><em>Biome</em><small>The human microbiome encyclopedia</small></span>
          </Link>
          <nav aria-label="Primary navigation">
            <Link href="/category/microbe">Microorganisms</Link>
            <Link href="/category/disease">Diseases</Link>
            <Link href="/category/mechanism">Mechanisms</Link>
            <Link href="/category/signature">Signatures</Link>
          </nav>
          <div className="home-nav-actions">
            <ResearcherAccountControl />
            <Link className="home-random" href="/article/gut-microbiome">Begin exploring <span>↗</span></Link>
          </div>
        </header>

        <div className="home-grid">
          <div className="home-copy">
            <p className="home-eyebrow"><span /> A living map of the invisible world</p>
            <h1><span>Every body</span><span>is a <em>world.</em></span></h1>
            <p className="home-intro">Explore the organisms, ecological pressures, and molecular conversations shaping human health—one evidence-linked connection at a time.</p>
            <form className="home-search" action="/search" role="search">
              <label className="sr-only" htmlFor="home-search">Search WikiBiome</label>
              <i aria-hidden="true">⌕</i>
              <input id="home-search" name="q" placeholder={`Search ${wikiStats.totalPages} articles`} />
              <button type="submit">Search <span>→</span></button>
            </form>
            <div className="home-examples">
              <span>Try an article</span>
              <Link href="/article/gut-microbiome">Gut microbiome</Link>
              <Link href="/article/helicobacter-pylori">H. pylori</Link>
              <Link href="/article/dysbiosis">Dysbiosis</Link>
              <Link href="/article/nickel">Nickel</Link>
            </div>
          </div>

          <div className="body-stage" aria-label="Explore WikiBiome through a map of the human ecosystem">
            <div className="body-halo" />
            <div className="body-orbit body-orbit-one" /><div className="body-orbit body-orbit-two" />
            <div className="body-figure-advanced" aria-hidden="true">
              <img src="/wikibiome-human-system-v2.png" alt="" />
              <span className="body-scan" /><span className="body-axis" />
            </div>
            {bodyLinks.map((item) => <Link aria-label={`${item.kind}: ${item.label}`} className={`body-point side-${item.side} ${item.className}`} href={`/article/${item.id}`} key={item.id}><i /><span><small>{item.kind}</small><b>{item.label}</b></span></Link>)}
            <div className="body-caption"><span>The human ecosystem</span><b>Follow a named connection</b></div>
          </div>
        </div>

        <div className="home-stats">
          <p><strong>{wikiStats.totalPages}</strong><span>articles</span></p>
          <p><strong>{wikiStats.sources.toLocaleString()}</strong><span>scientific sources</span></p>
          <p><strong>{wikiStats.signatures}</strong><span>disease signatures</span></p>
          <p><strong>{wikiStats.entities + wikiStats.concepts}</strong><span>connected concepts</span></p>
          <a href="#discover"><span>Scroll to discover</span><i>↓</i></a>
        </div>
      </section>

      <section className="home-discover" id="discover">
        <header className="home-section-heading">
          <div><span>01</span><p>Featured pathways into the encyclopedia</p></div>
          <h2>Start anywhere.<br /><em>Follow the blue.</em></h2>
          <p>These are real WikiBiome articles—not placeholders. Each one opens into the complete evidence-linked record, with its sources, related concepts, and cross-references intact.</p>
        </header>
        <div className="featured-articles">
          {featured.map((page, index) => (
            <article className={index === 0 ? "featured-primary" : "featured-secondary"} key={page.id}>
              {index === 0 && <div className="featured-image"><span>Foundation article</span><i /><i /><i /></div>}
              <div className="featured-copy">
                <p><span>{categoryLabel(page.category)}</span><b>{page.sourceCount ?? 0} sources</b></p>
                <h3><Link href={`/article/${page.id}`}>{page.title}</Link></h3>
                <div>{plainText(page.overview).slice(0, index === 0 ? 360 : 175)}…</div>
                <footer>{page.tags?.slice(0, index === 0 ? 5 : 3).map((tag) => <Link href={`/search?q=${encodeURIComponent(tag)}`} key={tag}>{tag}</Link>)}<Link href={`/article/${page.id}`}>Read article <span>↗</span></Link></footer>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-portals" id="portals">
        <header>
          <span>02 · The current corpus, reimagined</span>
          <h2>One system.<br /><em>Every kind of page.</em></h2>
          <p>The redesign is attached to WikiBiome’s shared article structure—not a static concept. Open four real records below to see the same visual grammar carry organisms, elements, conditions, and mechanisms without disturbing their content model.</p>
        </header>
        <div className="portal-grid">
          {portals.map((page, index) => {
            const media = getArticleMedia(page.id);
            return (
              <Link className={`portal-card portal-card-${index}`} href={`/article/${page.id}`} key={page.id}>
                <div className="portal-preview">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {media ? (
                    <img
                      src={media.src}
                      alt={media.alt}
                      width={media.width}
                      height={media.height}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </div>
                <p>{categoryLabel(page.category)} · {page.sourceCount ?? 0} sources</p>
                <h3>{page.title}</h3>
                <span className="portal-description">{plainText(page.overview).slice(0, 150)}…</span>
                <b>Open actual article <em>↗</em></b>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="home-trail">
        <div className="trail-intro">
          <span>03 · A connected reading experience</span>
          <h2>One question becomes<br /><em>a trail of evidence.</em></h2>
          <p>WikiBiome is designed for lateral discovery. A metal becomes a microbial dependency; that dependency becomes an enzyme; the enzyme opens a disease mechanism.</p>
          <Link href="/article/gut-metal-microbiome">Open the metal–microbiome interface →</Link>
        </div>
        <div className="trail-map">
          <span className="trail-line" />
          {trail.map((page, index) => <Link className={`trail-node trail-node-${index}`} href={`/article/${page.id}`} key={page.id}><i>{String(index + 1).padStart(2, "0")}</i><span><small>{categoryLabel(page.category)}</small><b>{page.title}</b></span><em>↗</em></Link>)}
        </div>
      </section>

      <section className="home-domains">
        <div className="domains-copy"><span>04 · The index</span><h2>Seven domains.<br /><em>One human ecosystem.</em></h2><p>Browse the public knowledge base the way you think: by organism, disease, mechanism, intervention, or the evidence connecting them.</p></div>
        <div className="domain-list">
          {categories.map((category, index) => <Link href={`/category/${category.id}`} key={category.id}><i>{String(index + 1).padStart(2, "0")}</i><span>{category.label}</span><b>{getCategoryCount(category.id)}</b><em>Explore →</em></Link>)}
        </div>
      </section>

      <section className="home-evidence">
        <div className="evidence-orbit" aria-hidden="true"><span><img src="/wikibiome-logo.png" alt="" /></span>{["Microbe","Metal","Host","Disease","Source"].map((item, index) => <i className={`evidence-node evidence-node-${index}`} key={item}>{item}</i>)}</div>
        <div className="evidence-copy"><span>05 · Open scientific education</span><h2>Readable enough to enter.<br /><em>Rigorous enough to trace.</em></h2><p>Every blue term is a doorway. Every evidence claim retains its scientific context. WikiBiome turns a large research corpus into a navigable public reference without flattening uncertainty.</p><div><p><b>{wikiStats.sources.toLocaleString()}</b><span>sources indexed</span></p><p><b>{wikiStats.totalPages}</b><span>public articles</span></p><p><b>{wikiStats.signatures}</b><span>disease signatures</span></p></div><Link href="/article/gut-microbiome">Read the foundation article →</Link></div>
      </section>

    </main>
  );
}
