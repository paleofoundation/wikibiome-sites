import type { Metadata } from "next";
import Link from "@/app/_components/NativeLink";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { getResearcherSession } from "@/lib/research-network";
import { publicPageMetadata } from "@/lib/search-discovery";

export const dynamic = "force-dynamic";
export const metadata: Metadata = publicPageMetadata({
  title: "Contribute — WikiBiome",
  description: "Suggest sourced improvements to WikiBiome articles through a moderated revision workflow.",
  path: "/contribute",
});

export default async function ContributePage() {
  const [user, researcher] = await Promise.all([getChatGPTUser(), getResearcherSession()]);
  return (
    <>
      <WikiHeader />
      <main className="contribute-page">
        <header className="contribute-hero"><span>Community knowledge · moderated evidence</span><h1>Help build WikiBiome.</h1><p>Researchers use an ORCID-authenticated proposal pathway for sourced corrections, new pages, missing sections, cross-page connections, and framework improvements. Proposed changes are attributed and reviewed before they can affect a public article.</p><div><Link href="/propose">{researcher ? "Open your proposal workspace" : "Continue with ORCID to propose"}</Link><Link href="/search">Browse articles first</Link>{user && <Link href="/contributions">View legacy ChatGPT submissions</Link>}</div></header>
        <section className="contribution-steps" aria-labelledby="contribution-steps-title"><header><span>How it works</span><h2 id="contribution-steps-title">Wikipedia-like participation, with an evidence gate.</h2></header><div><article><b>01</b><h3>Choose the scope</h3><p>Propose a page, section, connection, or framework correction through the unified researcher workflow.</p></article><article><b>02</b><h3>Anchor the science</h3><p>Choose microbiome, metallomics, or both, then add supporting DOI or PMID records.</p></article><article><b>03</b><h3>State mechanisms and limits</h3><p>Explain the cross-omics connection, causal boundaries, and conflicts for editorial review.</p></article><article><b>04</b><h3>Editorial review</h3><p>A moderator accepts, declines, or requests revision. Accepted proposals still cannot bypass upstream publication.</p></article></div></section>
        <section className="contribution-principles"><div><span>Permanent attribution</span><p>Every accepted change can become part of the page’s visible revision history.</p></div><div><span>Recoverable revisions</span><p>Changes remain traceable to the source record and exact public diff.</p></div><div><span>No anonymous medical rewriting</span><p>Identity is required for submissions and scientific claims require evidence.</p></div></section>
      </main>
    </>
  );
}
