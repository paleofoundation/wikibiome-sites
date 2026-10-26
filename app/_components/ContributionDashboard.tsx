"use client";

import { useState } from "react";

type Contribution = {
  id: string;
  pageTitle: string;
  pageId: string;
  section: string;
  contributionType: string;
  proposedText: string;
  rationale: string;
  sourceUrl: string | null;
  contributorName: string;
  contributorEmail: string;
  status: string;
  moderatorNote: string | null;
  createdAt: string;
};

export function ContributionDashboard({ own, queue, moderator }: { own: Contribution[]; queue: Contribution[]; moderator: boolean }) {
  const [pendingQueue, setPendingQueue] = useState(queue);
  const [busy, setBusy] = useState<string | null>(null);

  async function decide(id: string, status: "accepted" | "declined" | "needs_revision") {
    const moderatorNote = window.prompt("Optional reviewer note") ?? "";
    setBusy(id);
    const response = await fetch(`/api/contributions/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status, moderatorNote }) });
    setBusy(null);
    if (response.ok) setPendingQueue((items) => items.filter((item) => item.id !== id));
  }

  return (
    <div className="contribution-dashboard">
      <section aria-labelledby="my-contributions-title">
        <header><span>Your activity</span><h2 id="my-contributions-title">Submitted changes</h2><b>{own.length}</b></header>
        <div className="contribution-list">{own.map((item) => <ContributionCard item={item} key={item.id} />)}{!own.length && <p className="contribution-empty">You have not submitted an article change yet.</p>}</div>
      </section>
      {moderator && <section aria-labelledby="moderation-title"><header><span>Editorial review</span><h2 id="moderation-title">Pending queue</h2><b>{pendingQueue.length}</b></header><div className="contribution-list">{pendingQueue.map((item) => <ContributionCard item={item} moderator busy={busy === item.id} onDecision={(status) => decide(item.id, status)} key={item.id} />)}{!pendingQueue.length && <p className="contribution-empty">The moderation queue is clear.</p>}</div></section>}
    </div>
  );
}

function ContributionCard({ item, moderator = false, busy = false, onDecision }: { item: Contribution; moderator?: boolean; busy?: boolean; onDecision?: (status: "accepted" | "declined" | "needs_revision") => void }) {
  const linkedSource = item.sourceUrl && /^https?:\/\//i.test(item.sourceUrl);
  return <article className="contribution-card"><header><span className={`contribution-status status-${item.status}`}>{item.status.replace("_", " ")}</span><time>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(item.createdAt))}</time></header><h3>{item.pageTitle}</h3><small>{item.section} · {item.contributionType.replaceAll("_", " ")}</small><p>{item.proposedText}</p><details><summary>Rationale and source</summary><div><p>{item.rationale}</p>{linkedSource && <a href={item.sourceUrl!} target="_blank" rel="noreferrer">{item.sourceUrl}</a>}{item.sourceUrl && !linkedSource && <code>{item.sourceUrl}</code>}{moderator && <small>{item.contributorName} · {item.contributorEmail}</small>}</div></details>{item.moderatorNote && <blockquote>{item.moderatorNote}</blockquote>}{moderator && <footer><button disabled={busy} onClick={() => onDecision?.("accepted")}>Accept</button><button disabled={busy} onClick={() => onDecision?.("needs_revision")}>Request revision</button><button disabled={busy} onClick={() => onDecision?.("declined")}>Decline</button></footer>}</article>;
}
