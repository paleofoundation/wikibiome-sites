import { OrcidLink, OrcidIcon } from "@/app/_components/OrcidLink";
import type { Metadata } from "next";
import Link from "@/app/_components/NativeLink";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { publicPageMetadata } from "@/lib/search-discovery";
import { wikiStats } from "@/lib/wikibiome";

export const metadata: Metadata = publicPageMetadata({
  title: "About WikiBiome",
  description: "WikiBiome is an open, evidence-linked human microbiome encyclopedia and a project of Microbiome Medicine.",
  path: "/about",
});

const profile = {
  name: "Karen Pendergrass",
  orcid: "https://orcid.org/0000-0002-2348-7259",
  website: "https://karenpendergrass.com",
};

export default function AboutPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    image: "https://www.wikibiome.com/karen-pendergrass.avif",
    url: profile.website,
    sameAs: [profile.orcid, "https://microbiomemedicine.com", "https://heavymetalindex.com"],
    jobTitle: "Translational microbiome scientist and founder of Microbiome Medicine",
  };
  return (
    <>
      <WikiHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replaceAll("<", "\\u003c") }} />
      <main className="about-page">
        <header className="about-hero"><div><span>About WikiBiome</span><h1>An encyclopedia for the relationships ordinary indexes miss.</h1><p>WikiBiome maps organisms, metals, host defenses, environmental pressures, and disease signatures as one traceable scientific system.</p><dl><div><dt>{wikiStats.totalPages}</dt><dd>public articles</dd></div><div><dt>{wikiStats.sources.toLocaleString()}</dt><dd>indexed sources</dd></div><div><dt>{wikiStats.signatures}</dt><dd>disease signatures</dd></div></dl></div><figure><div><img src="/karen-pendergrass.avif" width="1023" height="1537" alt="Karen Pendergrass, founder and scientific editor of WikiBiome" /></div><figcaption><span>Founder and scientific editor</span><strong>Karen Pendergrass</strong><OrcidLink orcid={profile.orcid} name="Karen Pendergrass" /></figcaption></figure></header>

        <section className="about-introduction"><aside><span>01</span><strong>The project</strong></aside><div><h2>Open scientific education, generated from evidence.</h2><p>WikiBiome is the open human microbiome encyclopedia and a project of <Link href="/organizations/microbiome-medicine">Microbiome Medicine</Link>. It exists to make cross-disciplinary microbiome research readable without separating organisms from the metals, enzymes, ecological conditions, and host responses that help explain their behavior.</p><p>Most reference resources answer which organisms have been reported. WikiBiome also asks why those organisms may be present, which biochemical dependencies connect them, and what evidence supports each connection. Every generated article preserves its source trail so readers can move from an accessible synthesis back to the underlying research.</p></div></section>

        <section className="about-founder"><aside><span>02</span><strong>Founder</strong></aside><div><h2>Karen Pendergrass</h2><p>Karen Pendergrass is a translational microbiome scientist working at the intersection of the gut microbiome, trace metals, and chronic disease. Her research focuses on microbiome–metallomic signatures, multi-omic data integration, microbial trace-metal utilization, mismetallation, and nutritional immunity.</p><p>Her work examines how those systems can inform diagnostic, therapeutic, and regulatory tools across chronic kidney disease, endometriosis, metabolic disorders, and neurodegenerative disease. WikiBiome is the public knowledge layer for making those relationships inspectable and reusable.</p><div className="about-links"><a href={profile.orcid} target="_blank" rel="noreferrer"><span>Persistent researcher identity</span><strong><OrcidIcon /></strong></a><a href={profile.website} target="_blank" rel="noreferrer"><span>Profile and current work</span><strong>KarenPendergrass.com ↗</strong></a><a href="https://microbiomemedicine.com" target="_blank" rel="noreferrer"><span>Parent research project</span><strong>Microbiome Medicine ↗</strong></a></div></div></section>

        <section className="about-principles" id="editorial-principles"><header><span>03 · Editorial principles</span><h2>Built like a wiki. Governed like an evidence system.</h2></header><div><article><span>Traceability</span><h3>Claims keep their source trail.</h3><p>Inline citations, reference records, revision histories, and source dependencies remain attached to the pages generated from them.</p></article><article><span>Canonical structure</span><h3>One subject, one public record.</h3><p>Legacy disease and disease-signature pages reconcile into one canonical article rather than dividing the same scientific subject across competing URLs.</p></article><article><span>Open participation</span><h3>Readers can improve the record.</h3><p>Suggestions enter a review queue with a rationale and supporting source. Public editing is deliberately moderated while the contribution and revision systems mature.</p><Link href="/contribute">Suggest an improvement →</Link></article><article><span>Editorial firewall</span><h3>Support cannot purchase influence.</h3><p>Financial support cannot purchase citations, inclusion, favorable treatment, or visibility. Evidence and editorial relevance determine what appears.</p><Link href="/support">Read the support policy →</Link></article></div></section>

        <section className="about-structure"><div><span>04 · Stewardship</span><h2>How the project is organized</h2></div><dl><div><dt>WikiBiome</dt><dd>The public evidence-linked encyclopedia and research-tool layer.</dd></div><div><dt>Microbiome Medicine</dt><dd>The research project responsible for WikiBiome’s scientific direction and development.</dd></div><div><dt>Microbiome Signatures LLC</dt><dd>The parent company of WikiBiome and Microbiome Medicine and the entity through which support payments are processed.</dd></div></dl><p>WikiBiome content is educational and does not provide medical diagnosis or treatment.</p></section>
      </main>
    </>
  );
}
