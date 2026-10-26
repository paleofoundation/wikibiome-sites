import { WikiHeader } from "@/app/_components/WikiArticle";
import { PaperWorkspace } from "@/app/_components/PaperWorkspace";
import { getResearcherSession, isModeratorRole } from "@/lib/research-network";
import {
  appointed,
  paperAccess,
  paperEvents,
  reviewerRoster,
} from "@/lib/paper-intake";
import { hasPaperConflict } from "@/lib/paper-intake-policy.mjs";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Paper workspace — WikiBiome",
  robots: { index: false, follow: false },
};
export default async function PaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const a = await getResearcherSession();
  const { id } = await params;
  if (!a)
    return (
      <>
        <WikiHeader />
        <main className="paper-page">
          <h1>Paper workspace</h1>
          <a
            href={`/api/auth/orcid/start?returnTo=${encodeURIComponent(`/researcher/submissions/${id}`)}`}
          >
            Sign in with ORCID to view this paper
          </a>
        </main>
      </>
    );
  try {
    const p = await paperAccess(a, id);
    const editor = isModeratorRole(a.role);
    const [events, roster, active] = await Promise.all([
      paperEvents(id),
      editor ? reviewerRoster() : Promise.resolve([]),
      appointed(a.accountId, p.topic),
    ]);
    return (
      <>
        <WikiHeader />
        <main className="paper-page">
          <header className="paper-page-heading">
            <div>
              <a href="/researcher/submissions">My papers</a>
              <h1>{p.title}</h1>
            </div>
          </header>
          <PaperWorkspace
            initial={p}
            owner={p.accountId === a.accountId}
            editor={editor}
            reviewer={active && p.reviewerAccountId === a.accountId}
            independent={!hasPaperConflict(a, p)}
            roster={
              roster as {
                orcid: string;
                display_name: string;
                topic: string;
                active: number;
              }[]
            }
          />
          <section className="paper-section">
            <h2>Review history</h2>
            {events.length ? (
              <ol className="paper-history">
                {events.map((e, i) => (
                  <li key={i}>
                    <b>{String(e.kind).replaceAll("_", " ")}</b>
                    <span>
                      {String(e.actor || "Processing service")} · revision{" "}
                      {String(e.revision)} · {String(e.created_at)}
                    </span>
                    <p>
                      {String(
                        (JSON.parse(String(e.detail_json)) as { note?: string })
                          .note || "",
                      )}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p>
                Prepared for inspection. No reviewer or editor decision has been
                recorded.
              </p>
            )}
          </section>
        </main>
      </>
    );
  } catch {
    return (
      <>
        <WikiHeader />
        <main className="paper-page">
          <h1>Paper workspace unavailable</h1>
          <p>
            This paper is private to its submitter, assigned reviewer, and
            editors. If you have access, try again shortly.
          </p>
          <a href="/researcher/submissions">Return to my papers</a>
        </main>
      </>
    );
  }
}
