import { WikiHeader } from "@/app/_components/WikiArticle";
import { ReviewerAppointmentForm } from "@/app/_components/PaperWorkspace";
import { getResearcherSession, isModeratorRole } from "@/lib/research-network";
import {
  appointed,
  listPapers,
  paperCapabilities,
  reviewerRoster,
} from "@/lib/paper-intake";
import { allWikiPages } from "@/lib/wikibiome";
import { paperStatusLabels } from "@/lib/paper-intake-policy.mjs";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Review work — WikiBiome",
  robots: { index: false, follow: false },
};
export default async function ReviewPage() {
  const a = await getResearcherSession();
  if (!a)
    return (
      <>
        <WikiHeader />
        <main className="paper-page">
          <h1>Review work</h1>
          <a href="/api/auth/orcid/start?returnTo=/researcher/review">
            Sign in with ORCID
          </a>
        </main>
      </>
    );
  try {
    const editor = isModeratorRole(a.role);
    const active = await appointed(a.accountId);
    if (!editor && !active)
      return (
        <>
          <WikiHeader />
          <main className="paper-page">
            <h1>Review work</h1>
            <p>
              Reviewers are appointed by administrators for specific topics.
              Researcher sign-in alone does not grant review authority.
            </p>
            <a href="/researcher/submissions">View your submissions</a>
          </main>
        </>
      );
    const [papers, roster, cap] = await Promise.all([
      listPapers(a, true),
      editor ? reviewerRoster() : Promise.resolve([]),
      paperCapabilities(),
    ]);
    const topics = allWikiPages
      .map((p) => ({ id: p.id, title: p.title }))
      .sort((a, b) => a.title.localeCompare(b.title));
    return (
      <>
        <WikiHeader />
        <main className="paper-page">
          <header className="paper-page-heading">
            <div>
              <a href="/researcher/dashboard">Researcher dashboard</a>
              <h1>Review work</h1>
              <p>
                {editor
                  ? "Assign independent reviewers, inspect recommendations, and authorize publication."
                  : "Your assigned papers. Recommendations go to a separate editor for a publication decision."}
              </p>
            </div>
          </header>
          {editor && (
            <div className="paper-notice">
              Processing service:{" "}
              {cap.processing ? "configured" : "not configured"} · Active topic
              appointments: {cap.reviewers}.{" "}
              {cap.uploads
                ? "General PDF intake is open."
                : "General PDF intake is not open."}
            </div>
          )}
          <div className="paper-layout">
            <section>
              <div className="paper-list">
                {papers.map((p) => (
                  <a key={p.id} href={`/researcher/submissions/${p.id}`}>
                    <span className="paper-status">
                      {
                        paperStatusLabels[
                          p.status as keyof typeof paperStatusLabels
                        ]
                      }
                    </span>
                    <h2>{p.title}</h2>
                    <p>
                      {p.topic.replaceAll("-", " ")} · {p.packet.changes.length}{" "}
                      proposed changes
                    </p>
                  </a>
                ))}
                {!papers.length && <p>No papers are assigned for review.</p>}
              </div>
            </section>
            {editor && (
              <aside className="paper-side">
                {a.role === "site_admin" && (
                  <section>
                    <h2>Appoint a reviewer</h2>
                    <p>
                      The researcher must have verified their private email.
                      Appointments grant review access only to assigned papers
                      in the selected topic.
                    </p>
                    <ReviewerAppointmentForm topics={topics} />
                  </section>
                )}
                <section>
                  <h2>Reviewer appointments</h2>
                  {roster.length ? (
                    roster.map((r, i) => (
                      <p key={i}>
                        <b>{String(r.display_name)}</b>
                        <br />
                        {String(r.topic).replaceAll("-", " ")} ·{" "}
                        {r.active ? "Active" : "Revoked"}
                      </p>
                    ))
                  ) : (
                    <p>
                      No reviewers appointed. Papers will remain waiting for
                      assignment.
                    </p>
                  )}
                </section>
              </aside>
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
          <h1>Review work</h1>
          <p>
            The review workspace is temporarily unavailable. Please try again
            shortly.
          </p>
        </main>
      </>
    );
  }
}
