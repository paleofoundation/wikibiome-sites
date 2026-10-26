"use client";

import { useState } from "react";

type Queue = Record<string, Array<{ id: string; status: string; createdAt?: string; sourceId?: string; title?: string; name?: string; reason?: string; messageBody?: string; senderAccountId?: string | null; threadId?: string | null }>>;

const kindByQueue: Record<string, string> = {
  claims: "claim",
  reviews: "author_review",
  submissions: "work_submission",
  threads: "discussion_thread",
  posts: "discussion_post",
  reports: "report",
  institutions: "institution",
  institution_memberships: "institution_membership",
  institution_batches: "institution_batch",
  proposals: "proposal",
  message_reports: "message_report",
};

export function ResearchModerationDashboard({ initialQueue }: { initialQueue: Queue }) {
  const [queue, setQueue] = useState<Queue>(initialQueue);
  const [message, setMessage] = useState("");

  async function refresh() {
    const response = await fetch("/api/research-network/moderation");
    const result = await response.json() as { queue?: Queue; error?: string };
    setQueue(result.queue || {});
    setMessage(response.ok ? "" : result.error || "Queue unavailable.");
  }

  async function decide(kind: string, id: string, status: string) {
    const response = await fetch("/api/research-network/moderation", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind, id, status }) });
    const result = await response.json() as { error?: string };
    setMessage(response.ok ? "Decision recorded in the immutable audit log." : result.error || "Decision failed.");
    if (response.ok) await refresh();
  }

  return (
    <div className="moderation-queue">
      {Object.entries(queue).map(([name, items]) => (
        <section key={name}><header><h2>{name.replaceAll("_", " ")}</h2><b>{items.length}</b></header>{items.length ? items.map((item) => <article key={item.id}><div><strong>{item.title || item.name || item.sourceId || item.id}</strong><small>{item.createdAt || item.status}</small>{item.reason && <p><b>Report:</b> {item.reason}</p>}{item.messageBody && <blockquote>{item.messageBody}</blockquote>}{item.senderAccountId && <small>Sender account: {item.senderAccountId} · Thread: {item.threadId}</small>}</div><footer>{actions(kindByQueue[name]).map((action) => <button key={action} onClick={() => decide(kindByQueue[name], item.id, action)}>{action.replaceAll("_", " ")}</button>)}</footer></article>) : <p>Queue clear.</p>}</section>
      ))}
      {message && <p className="form-message" role="status">{message}</p>}
    </div>
  );
}

function actions(kind: string) {
  if (kind === "claim") return ["verified", "rejected"];
  if (kind === "author_review") return ["accepted", "needs_revision", "declined"];
  if (kind === "work_submission") return ["accepted", "needs_revision", "declined"];
  if (kind === "report") return ["resolved", "dismissed"];
  if (kind === "institution") return ["approved", "declined"];
  if (kind === "institution_membership") return ["approved", "declined"];
  if (kind === "institution_batch") return ["accepted", "declined"];
  if (kind === "proposal") return ["accepted", "needs_revision", "declined"];
  if (kind === "message_report") return ["resolved", "dismissed"];
  return ["published", "rejected"];
}
