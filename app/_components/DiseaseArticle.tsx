import Link from "@/app/_components/NativeLink";
import { ArticleMediaFigure } from "@/app/_components/ArticleMediaFigure";
import { ArticleUtilityPanel } from "@/app/_components/ArticleUtilityPanel";
import { ResearchDiscussion } from "@/app/_components/ResearchDiscussion";
import { PageActivityTrail, PageCollaborationBar } from "@/app/_components/PageCollaboration";
import { prepareArticleSections } from "@/lib/content-model";
import { getArticleMedia } from "@/lib/article-media";
import { getRevisionHistory } from "@/lib/revisions";
import {
  ArticleNetwork,
  ArticleRevisionNote,
  ClaimProvenance,
  EvidenceIntegrity,
  EditorialStatusNotice,
  OpenQuestionsSection,
  ParadoxLinkIndex,
  ReferencesSection,
  RichText,
  WikiHeader,
  expandMetalNames,
  isDietaryParadoxHeading,
  slugify,
} from "@/app/_components/WikiArticle";
import {
  categories,
  categoryLabel,
  diseaseReconciliationStats,
  getCategoryCount,
  getWikiPage,
  normalizeWikiId,
  resolveRelated,
  wikiStats,
  type DiseaseRecord,
  type DiseaseSignature,
  type SignatureTaxon,
} from "@/lib/wikibiome";

const layers = [
  { id: "metallomic-layer", number: "01", label: "Metallomic" },
  { id: "taxonomic-layer", number: "02", label: "Taxonomic" },
  { id: "immunity-layer", number: "03", label: "Nutritional immunity" },
  { id: "ecological-layer", number: "04", label: "Ecological state" },
  { id: "virulence-layer", number: "05", label: "Virulence functions" },
] as const;

function signatureLayerCount(signature: DiseaseSignature, layerId: (typeof layers)[number]["id"]) {
  if (layerId === "metallomic-layer") return signature.metallomicSignature.elevated.length + signature.metallomicSignature.depleted.length;
  if (layerId === "taxonomic-layer") return signature.taxonomicSignature.enriched.length + signature.taxonomicSignature.depleted.length;
  if (layerId === "immunity-layer") return signature.nutritionalImmunity.elevated.length + signature.nutritionalImmunity.depleted.length;
  if (layerId === "ecological-layer") return signature.ecologicalFeatures.length;
  return signature.virulenceEnzymes.length;
}

function parseTerm(value: string) {
  const match = value.match(/^\[\[([^\]|]+)(?:\|([^\]]+))?\]\]$/);
  const id = normalizeWikiId(match?.[1] ?? value);
  const linkedPage = getWikiPage(id);
  const label = match?.[2] || linkedPage?.title || value
    .replace(/^\[\[|\]\]$/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
  return { id, label: expandMetalNames(label), linkedPage };
}

function Signal({ value, tone = "neutral" }: { value: string; tone?: "up" | "down" | "neutral" }) {
  const term = parseTerm(value);
  const content = <><i aria-hidden="true" />{term.label}</>;
  return term.linkedPage
    ? <Link className={`signature-signal ${tone}`} href={`/article/${term.id}`}>{content}</Link>
    : <span className={`signature-signal ${tone}`}>{content}</span>;
}

function EcologyNode({ feature, index }: { feature: string; index: number }) {
  const term = parseTerm(feature);
  const content = (
    <>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <div><i aria-hidden="true" /><b>{term.label}</b><small>indexed ecological state</small></div>
      <em aria-hidden="true">{term.linkedPage ? "↗" : "•"}</em>
    </>
  );
  return term.linkedPage
    ? <Link className="ecology-node" href={`/article/${term.id}`}>{content}</Link>
    : <div className="ecology-node">{content}</div>;
}

function SignalGroup({ title, items, tone }: { title: string; items: string[]; tone: "up" | "down" | "neutral" }) {
  return (
    <section className={`signal-group ${tone}`}>
      <header><span>{tone === "up" ? "↑" : tone === "down" ? "↓" : "•"}</span><h4>{title}</h4><b>{items.length}</b></header>
      <div>{items.length ? items.map((item) => <Signal value={item} tone={tone} key={item} />) : <p className="signature-empty">No structured signals indexed yet.</p>}</div>
    </section>
  );
}

function TaxonColumn({ title, items, tone }: { title: string; items: SignatureTaxon[]; tone: "up" | "down" }) {
  return (
    <section className={`taxon-column ${tone}`}>
      <header><span>{title}</span><strong>{items.length}</strong></header>
      <div>
        {items.length ? items.map((item) => {
          const term = parseTerm(item.taxon);
          return (
            <article className="taxon-card" key={term.id}>
              <div><i aria-hidden="true" />{term.linkedPage ? <Link href={`/article/${term.id}`}>{term.label}</Link> : <strong>{term.label}</strong>}</div>
              {item.role && <p>{expandMetalNames(item.role)}</p>}
            </article>
          );
        }) : <p className="signature-empty">No structured taxa indexed yet.</p>}
      </div>
    </section>
  );
}

function LayerHeader({ number, title, description, confidence }: { number: string; title: string; description: string; confidence?: string }) {
  return (
    <header className="signature-layer-header">
      <span>{number}</span>
      <div><p>Evidence layer</p><h3>{title}</h3><small>{description}</small></div>
      {confidence && <b>{confidence} confidence</b>}
    </header>
  );
}

function ParadoxSection({ heading, pageId }: { heading: string; pageId: string }) {
  const id = `article-${slugify(heading)}`;
  return (
    <section className="wiki-section level-2 paradox-section" id={id}>
      <h2>{heading}<a href={`#${id}`} aria-label={`Link to ${heading}`}>#</a></h2>
      <ParadoxLinkIndex pageId={pageId} />
    </section>
  );
}

function DiseaseRail({ record }: { record: DiseaseRecord }) {
  return (
    <aside className="wiki-rail disease-rail">
      <nav aria-label="Encyclopedia navigation">
        <p className="rail-label">Navigate</p>
        <Link className="rail-home" href="/"><span>⌂</span> Main page</Link>
        <Link href="/category/disease"><span>◇</span> All diseases</Link>
        <div className="rail-rule" />
        <p className="rail-label">Knowledge domains</p>
        {categories.map((category) => (
          <Link href={`/category/${category.id}`} key={category.id}>
            <span className={`rail-dot ${category.id}`} />
            {category.label}
            <b>{getCategoryCount(category.id)}</b>
          </Link>
        ))}
      </nav>
      <nav className="contents-nav disease-contents" aria-label="Table of contents">
        <p className="rail-label">On this page</p>
        <a href="#overview"><i>00</i>Overview</a>
        <a href="#signature"><i>01</i>Integrated signature</a>
        <a href="#article"><i>02</i>Disease article</a>
        <a href="#references"><i>R</i>References</a>
        <a href="#discussion"><i>D</i>Discussion</a>
      </nav>
      <div className="rail-license">{record.contentRecordCount} vault records reconciled<br />into one canonical disease page</div>
    </aside>
  );
}

function DiseaseInfobox({ record }: { record: DiseaseRecord }) {
  const { page, signature, evidence } = record;
  const media = getArticleMedia(page.id);
  const totalSignals = signature.metallomicSignature.elevated.length
    + signature.metallomicSignature.depleted.length
    + signature.taxonomicSignature.enriched.length
    + signature.taxonomicSignature.depleted.length
    + signature.nutritionalImmunity.elevated.length
    + signature.nutritionalImmunity.depleted.length
    + signature.ecologicalFeatures.length
    + signature.virulenceEnzymes.length;
  const related = resolveRelated(page, 5);

  return (
    <aside className="article-aside disease-aside" aria-label={`${page.title} record summary`}>
      <div className="infobox disease-infobox">
        {media ? <ArticleMediaFigure media={media} /> : (
          <div className="infobox-visual infobox-disease">
            <img src="/wikibiome-human-system-v2.png" alt="" />
            <span>{page.title.slice(0, 2)}</span><i /><i /><i />
            <small>Integrated host–microbiome map</small>
          </div>
        )}
        <div className="infobox-title"><span>Canonical disease record</span><strong>{page.title}</strong></div>
        <dl>
          <div><dt>Domain</dt><dd><Link href="/category/disease">Diseases</Link></dd></div>
          <div><dt>Signature</dt><dd>5 evidence layers integrated</dd></div>
          <div><dt>Signals</dt><dd>{totalSignals} indexed observations</dd></div>
          <div><dt>References</dt><dd>{evidence.references.length} unique records</dd></div>
          <div><dt>Reconciled</dt><dd>{record.contentRecordCount} source pages</dd></div>
        </dl>
        <div className="signature-completeness">
          <span>Signature coverage</span>
          <div>{layers.map((layer) => <i className={signatureLayerCount(signature, layer.id) ? "populated" : ""} title={layer.label} key={layer.id} />)}</div>
          <small>{layers.filter((layer) => signatureLayerCount(signature, layer.id)).length} of 5 layers contain structured data</small>
        </div>
        {!!page.tags?.length && <div className="tag-list">{page.tags.slice(0, 8).map((tag) => <Link href={`/search?q=${encodeURIComponent(tag)}`} key={tag}>{tag}</Link>)}</div>}
      </div>
      {!!related.length && (
        <div className="related-card">
          <span>Connected conditions and mechanisms</span>
          {related.map((item) => <Link href={`/article/${item.id}`} key={item.id}><i>{item.title.slice(0, 1)}</i><b>{item.title}</b><em>↗</em></Link>)}
        </div>
      )}
      <div className="corpus-note"><strong>{diseaseReconciliationStats.pairedRecords}</strong><span>paired disease signatures now use this generator</span></div>
    </aside>
  );
}

function OriginalDiseaseArticle({ record }: { record: DiseaseRecord }) {
  const sections = prepareArticleSections(record.page);
  const metallomicStart = sections.findIndex((section) => slugify(section.heading) === "metallomic-signature");
  const metallomicLevel = metallomicStart >= 0 ? sections[metallomicStart].level : -1;
  const nextPeer = sections.findIndex((section, index) => index > metallomicStart && section.level <= metallomicLevel);
  const metallomicEnd = nextPeer >= 0 ? nextPeer : sections.length;
  const consumedParadoxSections = new Set<number>();
  sections.forEach((section, index) => {
    if (!isDietaryParadoxHeading(section.heading)) return;
    const end = sections.findIndex((candidate, candidateIndex) => candidateIndex > index && candidate.level <= section.level);
    const boundary = end >= 0 ? end : sections.length;
    const subsections = sections.slice(index + 1, boundary);
    subsections.forEach((_subsection, childIndex) => consumedParadoxSections.add(index + childIndex + 1));
  });
  return (
    <section className="disease-narrative" id="article" aria-labelledby="disease-article-title">
      <header className="disease-section-heading">
        <span>Encyclopedia article</span>
        <h2 id="disease-article-title">The disease record, in full.</h2>
        <p>The original WikiBiome disease narrative remains intact beneath the generated signature atlas.</p>
      </header>
      {sections.map((section, index) => {
        if (consumedParadoxSections.has(index)) return null;
        if (slugify(section.heading) === "open-questions") {
          return <OpenQuestionsSection body={section.body} citationNumbers={record.evidence.citationNumbers} id="article-open-questions" key={`${section.heading}-${section.level}`} />;
        }
        if (isDietaryParadoxHeading(section.heading)) {
          return <ParadoxSection heading={section.heading} pageId={record.page.id} key={`${section.heading}-${section.level}`} />;
        }
        const id = `article-${slugify(section.heading)}`;
        const Heading = section.level === 2 ? "h2" : "h3";
        const continuousMetallomicProse = metallomicStart >= 0 && index >= metallomicStart && index < metallomicEnd;
        const continuousNarrativeProse = continuousMetallomicProse || section.renderAsProse;
        return (
          <section className={`wiki-section level-${section.level}${continuousNarrativeProse ? " continuous-prose-section" : ""}`} id={id} key={`${section.heading}-${section.level}`}>
            <Heading>{section.heading}<a href={`#${id}`} aria-label={`Link to ${section.heading}`}>#</a></Heading>
            {section.body && <RichText text={section.body} citationNumbers={record.evidence.citationNumbers} prose={continuousNarrativeProse} />}
          </section>
        );
      })}
    </section>
  );
}

export function DiseaseArticle({ record }: { record: DiseaseRecord }) {
  const { page, signature, evidence } = record;
  const media = getArticleMedia(page.id);
  const history = getRevisionHistory(page);
  const related = resolveRelated(page, 6);
  const signatureSourceCount = new Set(record.signaturePages.flatMap((item) => item.sources ?? []).map(normalizeWikiId)).size;
  const namedLayers = layers.filter((layer) => signatureLayerCount(signature, layer.id)).length;
  const editorialStatuses = [...new Map(
    [page.editorialStatus, ...record.signaturePages.map((signaturePage) => signaturePage.editorialStatus)]
      .filter((status): status is NonNullable<typeof page.editorialStatus> => Boolean(status))
      .map((status) => [status.group, status]),
  ).values()];

  return (
    <>
      <WikiHeader />
      <div className="wiki-shell">
        <DiseaseRail record={record} />
        <main className="article-page disease-page">
          <div className="article-breadcrumbs"><Link href="/">WikiBiome</Link><span>/</span><Link href="/category/disease">Diseases</Link><span>/</span><b>{page.title}</b></div>
          <header className="article-header disease-header">
            <div className="article-system-art disease-system-art" aria-hidden="true">
              <span className="system-orbit orbit-one" /><span className="system-orbit orbit-two" />
              <img src="/wikibiome-human-system-v2.png" alt="" /><i /><i /><i />
              <b>metals · microbes · host</b>
            </div>
            <div className="article-heading-copy">
              <p>Disease dossier · {namedLayers ? "signature integrated" : "signature scaffold ready"} · {evidence.references.length} generated references</p>
              <h1>{page.title}</h1>
              <span>{namedLayers ? "One canonical record connecting the disease narrative to its five-layer microbiome signature." : "A canonical disease record prepared to absorb a five-layer microbiome signature as the vault grows."}</span>
            </div>
            <div className="article-tabs">
              <a className="active" href="#overview">Overview</a>
              <a href="#signature">Signature <b>{namedLayers}/5</b></a>
              <a href="#article">Article</a>
              <a href="#references">Evidence <b>{evidence.references.length}</b></a>
            </div>
            <PageCollaborationBar targetType="article" targetId={page.id} />
          </header>

          <div className="article-grid disease-grid" id="overview">
            <article className="article-body disease-body">
              {media && <div className="article-mobile-media"><ArticleMediaFigure media={media} /></div>}
              {editorialStatuses.map((status) => <EditorialStatusNotice status={status} key={status.group} />)}
              {page.overview && <div className="lead-copy disease-lead"><RichText text={page.overview} citationNumbers={evidence.citationNumbers} /></div>}
              <EvidenceIntegrity evidence={evidence} />
              <ClaimProvenance evidence={evidence} />

              <aside className="reconciliation-note" aria-label="Page reconciliation summary">
                <span>One canonical page</span>
                <p>{record.signaturePages.length ? <><strong>{record.contentRecordCount} existing vault records</strong> are reconciled here: the disease narrative and {record.signaturePages.length} signature {record.signaturePages.length === 1 ? "record" : "records"}. The generator deduplicates their evidence without discarding either source.</> : <><strong>The disease narrative is canonical.</strong> No signature file is paired yet; the same generator keeps all five evidence slots ready to populate automatically when structured data arrives.</>}</p>
                <div><b>{signatureSourceCount}</b><small>signature sources</small><b>{evidence.references.length}</b><small>combined references</small><b>{namedLayers}/5</b><small>layers populated</small></div>
              </aside>

              <section className="signature-atlas" id="signature" aria-labelledby="signature-title">
                <header className="disease-section-heading signature-heading">
                  <span>Integrated microbiome signature</span>
                  <h2 id="signature-title">One disease. Five evidence layers.</h2>
                  <p>A generated systems view of the metals, organisms, host sequestration signals, ecological conditions, and microbial functions indexed for {page.title}.</p>
                </header>

                <nav className="layer-index" aria-label="Signature layers">
                  {layers.map((layer) => <a href={`#${layer.id}`} key={layer.id}><i>{layer.number}</i><span>{layer.label}</span></a>)}
                </nav>

                <section className="signature-layer metallomic-layer" id="metallomic-layer">
                  <LayerHeader number="01" title="Metallomic signature" description="Elements and antioxidants reported as elevated, accumulated, depleted, or systemically altered." confidence={record.confidence.metallomic} />
                  <div className="paired-signals">
                    <SignalGroup title="Elevated or accumulated" items={signature.metallomicSignature.elevated} tone="up" />
                    <SignalGroup title="Depleted or redistributed" items={signature.metallomicSignature.depleted} tone="down" />
                  </div>
                </section>

                <section className="signature-layer taxonomic-layer" id="taxonomic-layer">
                  <LayerHeader number="02" title="Taxonomic signature" description="Organisms reported as enriched or depleted, with their indexed functional context kept beside the name." confidence={record.confidence.taxonomic} />
                  <div className="taxon-grid">
                    <TaxonColumn title="Enriched taxa" items={signature.taxonomicSignature.enriched} tone="up" />
                    <TaxonColumn title="Depleted taxa" items={signature.taxonomicSignature.depleted} tone="down" />
                  </div>
                </section>

                <section className="signature-layer immunity-layer" id="immunity-layer">
                  <LayerHeader number="03" title="Nutritional immunity" description="Host metal-withholding, inflammatory, antioxidant, and microbial-metabolite signals indexed in the signature." confidence={record.confidence.nutritional_immunity} />
                  <div className="paired-signals">
                    <SignalGroup title="Elevated host signals" items={signature.nutritionalImmunity.elevated} tone="up" />
                    <SignalGroup title="Depleted protective signals" items={signature.nutritionalImmunity.depleted} tone="down" />
                  </div>
                </section>

                <section className="signature-layer ecological-layer" id="ecological-layer">
                  <LayerHeader number="04" title="Ecological state" description="The environmental conditions that connect the organism-level observations into a system." confidence={record.confidence.ecological} />
                  <div className="ecology-console">
                    <header><span><i aria-hidden="true" />WB.ECO / SYSTEM MODEL</span><b>{signature.ecologicalFeatures.length} connected states</b></header>
                    <div className="ecology-console-body">
                      <div className="ecology-core" aria-hidden="true">
                        <i className="ecology-orbit orbit-a" /><i className="ecology-orbit orbit-b" /><i className="ecology-orbit orbit-c" />
                        <div><small>Layer 04</small><strong>Ecological<br />state</strong><span>host · biome · environment</span></div>
                      </div>
                      <div className="ecology-signal-grid">
                        {signature.ecologicalFeatures.length
                          ? signature.ecologicalFeatures.map((feature, index) => <EcologyNode feature={feature} index={index} key={feature} />)
                          : <p className="signature-empty">No structured ecological features indexed yet.</p>}
                      </div>
                    </div>
                    <footer><span>Environment</span><i /><span>Community structure</span><i /><span>Host response</span></footer>
                  </div>
                </section>

                <section className="signature-layer virulence-layer" id="virulence-layer">
                  <LayerHeader number="05" title="Virulence functions" description="Microbial structures, enzymes, and acquisition systems implicated by the linked evidence." confidence={record.confidence.virulence_enzymes} />
                  <div className="function-cloud">{signature.virulenceEnzymes.length ? signature.virulenceEnzymes.map((feature, index) => <Signal value={feature} key={`${feature}-${index}`} />) : <p className="signature-empty">No structured virulence functions indexed yet.</p>}</div>
                  {!!signature.stops.length && (
                    <aside className="signature-caution"><span>Evidence boundary</span><p>WikiBiome flags {signature.stops.length} condition-specific STOP record{signature.stops.length === 1 ? "" : "s"}. These are evidence cautions, not individualized medical advice.</p><div>{signature.stops.map((item) => <Signal value={item} key={item} />)}</div></aside>
                  )}
                </section>
              </section>

              <OriginalDiseaseArticle record={record} />
              <ReferencesSection evidence={evidence} />
              <ArticleNetwork page={page} />
              <ResearchDiscussion targetType="article" targetId={page.id} />
              <PageActivityTrail targetType="article" targetId={page.id} revisions={history.revisions} repository={history.repository} />
              <ArticleRevisionNote page={page} />
              {!!related.length && (
                <div className="article-end">
                  <span>Continue exploring</span>
                  <h2>Follow the disease network.</h2>
                  <div>{related.map((item) => <Link href={`/article/${item.id}`} key={item.id}><small>{categoryLabel(item.category)}</small><b>{item.title}</b><span>Read article →</span></Link>)}</div>
                </div>
              )}
              <footer className="article-provenance" id="provenance">
                <p>Generated from the WikiBiome Markdown vault; disease and signature records are reconciled at build time.</p>
                <span>{evidence.references.length} references · {record.contentRecordCount} content records · {wikiStats.totalPages} corpus pages</span>
              </footer>
            </article>
            <div className="article-right-column"><ArticleUtilityPanel title={page.title} pageId={page.id} updated={record.updated}/><DiseaseInfobox record={record} /></div>
          </div>
        </main>
      </div>
    </>
  );
}
