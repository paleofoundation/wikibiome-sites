import Link from "@/app/_components/NativeLink";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { ResearcherWorkspaceNav } from "@/app/_components/ResearcherWorkspaceNav";
import { PilotIntakeButton } from "@/app/_components/PaperIntakeForm";
import { getResearcherSession } from "@/lib/research-network";
import { listPapers } from "@/lib/paper-intake";
import { paperStatusLabels } from "@/lib/paper-intake-policy.mjs";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "My papers — WikiBiome",
  robots: { index: false, follow: false },
};
export default async function PapersPage() {
  const a = await getResearcherSession();
  if (!a)
    return (
      <>
        <WikiHeader />
        <main className="paper-page">
          <h1>My papers</h1>
          <a href="/api/auth/orcid/start?returnTo=/researcher/submissions">
            Sign in with ORCID
          </a>
        </main>
      </>
    );
  try {
    const papers = await listPapers(a);
    return (
      <>
        <WikiHeader />
        <main className="paper-page">
          <ResearcherWorkspaceNav active="submissions" />
          <header className="paper-page-heading">
            <div>
              <span className="organization-eyebrow">Researcher workspace</span>
              <h1>My papers</h1>
              <p>
                Follow each paper from evidence extraction to published
                contributions.
              </p>
            </div>
            <Link className="paper-primary" href="/submit-work">
              Add a paper
            </Link>
          </header>
          {a.orcid === "0000-0002-2348-7259" &&
            !papers.some((p) => p.id === "metals-microbiome-pilot") && (
              <section className="paper-section">
                <h2>Your prepared pilot</h2>
                <p>
                  Metals, microbial ecology, and disease pathogenesis · 9
                  proposed article changes · 50 references.
                </p>
                <PilotIntakeButton />
              </section>
            )}
          <div className="paper-list">
            {papers.map((p) => (
              <Link key={p.id} href={`/researcher/submissions/${p.id}`}>
                <span className="paper-status">
                  {
                    paperStatusLabels[
                      p.status as keyof typeof paperStatusLabels
                    ]
                  }
                </span>
                <h2>{p.title}</h2>
                <p>
                  {p.packet.changes.length} proposed destinations ·{" "}
                  {p.packet.claims.length} extracted claims
                </p>
                <small>{p.packet.metadata.publicationStatus}</small>
              </Link>
            ))}
            {!papers.length && (
              <p>
                No papers submitted yet. Add a paper or open your prepared
                pilot.
              </p>
            )}
          </div>
        </main>
      </>
    );
  } catch {
    return (
      <>
        <WikiHeader />
        <main className="paper-page">
          <h1>My papers</h1>
          <p>
            Your paper workspace is temporarily unavailable. Please try again
            shortly.
          </p>
        </main>
      </>
    );
  }
}
