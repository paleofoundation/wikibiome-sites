import type { Metadata } from "next";
import Link from "@/app/_components/NativeLink";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { publicPageMetadata } from "@/lib/search-discovery";

export const metadata: Metadata = publicPageMetadata({
  title: "Explore and collaborate | WikiBiome",
  description: "Explore the free, ad-free WikiBiome encyclopedia and contribute evidence for editorial review.",
  path: "/support",
});

export default function SupportPage() {
  return <><WikiHeader /><main className="support-page">
    <header className="support-hero">
      <div><span>Free · ad-free · evidence-linked</span><h1>Explore and collaborate.</h1>
        <p>Read the microbiome encyclopedia, follow its sources, and contribute research for editorial review.</p>
        <div><Link href="/explore">Explore the encyclopedia</Link><Link href="/submit-work">Submit research for review</Link></div>
      </div>
      <div className="support-orbit" aria-hidden="true"><i /><i /><i /><span>W</span><strong>knowledge<br />stays open</strong></div>
    </header>
    <section className="support-impact" aria-labelledby="collaborate-title">
      <header><span>Continue your research</span><h2 id="collaborate-title">Follow the evidence.</h2></header>
      <div>
        <article><b>01</b><h3>Encyclopedia</h3><p>Explore articles and their evidence records.</p><Link href="/explore">Explore WikiBiome →</Link></article>
        <article><b>02</b><h3>Researcher network</h3><p>Find cited work and submit contributions for review.</p><Link href="/researchers">Explore researcher profiles →</Link></article>
        <article><b>03</b><h3>Microbiome Medicine</h3><p>Learn about the organization behind WikiBiome.</p><a href="/organizations/microbiome-medicine">Explore Microbiome Medicine →</a></article>
        <article><b>04</b><h3>Corrections</h3><p>Suggest a sourced correction to an encyclopedia article.</p><Link href="/contribute">Suggest an edit →</Link></article>
      </div>
    </section>
    <aside className="support-independence"><span>Editorial independence</span><h2>Evidence guides inclusion.</h2><p>Submissions are reviewed for sourcing, relevance, and conflicts of interest. Inclusion and citations are never for sale.</p><Link href="/research-standard">Read the research standard →</Link></aside>
  </main></>;
}
