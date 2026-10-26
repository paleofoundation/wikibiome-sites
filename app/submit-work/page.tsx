import type { Metadata } from "next";
import Link from "@/app/_components/NativeLink";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { PaperIntakeForm, PilotIntakeButton } from "@/app/_components/PaperIntakeForm";
import { paperCapabilities } from "@/lib/paper-intake";
import { allWikiPages } from "@/lib/wikibiome";
import { WorkSubmissionForm } from "@/app/_components/WorkSubmissionForm";
import { getResearcherSession, getResearchNetworkCapabilities } from "@/lib/research-network";
import { publicPageMetadata } from "@/lib/search-discovery";

export const dynamic = "force-dynamic";
export const metadata: Metadata = publicPageMetadata({ title: "Submit research — WikiBiome", description: "Submit a DOI, PMID, or preprint to WikiBiome’s moderated research intake.", path: "/submit-work" });

export default async function SubmitWorkPage() {
  const [account, capabilities] = await Promise.all([getResearcherSession(), getResearchNetworkCapabilities()]);
  const intake = await paperCapabilities().catch(() => ({ uploads: false, processing: false, reviewers: 0 }));
  const topics = allWikiPages.map(p => ({ id: p.id, title: p.title })).sort((a,b) => a.title.localeCompare(b.title));
  return <><WikiHeader/><main className="paper-page"><header className="paper-page-heading"><div><span className="organization-eyebrow">Research intake</span><h1>Add a paper</h1><p>Turn research into traceable improvements across WikiBiome.</p></div>{account&&<Link href="/researcher/submissions">My papers</Link>}</header><div className="paper-layout"><section>{!account?<section className="paper-section"><h2>Connect your researcher profile</h2><p>Sign in with ORCID to submit work and follow its progress.</p><a className="paper-primary" href="/api/auth/orcid/start?returnTo=/submit-work">Sign in with ORCID</a></section>:!account.emailVerified?<section className="paper-section"><h2>Verify your private email</h2><Link href="/researcher/dashboard">Open your researcher dashboard</Link></section>:<><section className="paper-section"><PaperIntakeForm topics={topics} uploads={intake.uploads}/></section>{account.orcid==='0000-0002-2348-7259'&&<section className="paper-section"><h2>Your prepared pilot</h2><p>Metals, microbial ecology, and disease pathogenesis · proposed changes and page-linked evidence ready to inspect.</p><PilotIntakeButton/></section>}<details className="paper-section"><summary>Submit a DOI or PMID through the existing metadata intake</summary><WorkSubmissionForm manuscriptUploadsEnabled={capabilities.manuscriptUploads}/></details></>}</section><aside className="paper-side"><section><h2>What happens next</h2><ol className="paper-process"><li><b>Extract evidence</b><p>A private scan and extraction identify findings, limitations, references, and relevant articles.</p></li><li><b>Inspect proposed changes</b><p>Confirm the paper’s details and see the passages supporting each proposed edit.</p></li><li><b>Independent review</b><p>An appointed topic reviewer assesses the packet; a separate editor decides what can be published.</p></li><li><b>Publish & credit</b><p>Verified publication counts once toward contribution recognition, even when a paper improves many pages.</p></li></ol></section><section><h2>Intake availability</h2><p>{intake.uploads?'PDF intake is available.':'PDF intake is being prepared. You can save metadata and inspect prepared packets now.'}</p><p>Unassigned submissions explicitly show “Awaiting reviewer assignment.” Uploading does not award a star.</p><Link href="/researcher/review">About review access</Link></section></aside></div></main></>;
}
