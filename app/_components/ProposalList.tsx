"use client";

import { useState } from "react";

type Proposal = { id: string; title: string; proposalType: string; targetId: string | null; primaryAnchor: string; status: string; moderatorNote: string | null; publishedCommit: string | null; createdAt: string; sources: Array<{ identifierType: string; identifierValue: string }> };

export function ProposalList({ initial }: { initial: Proposal[] }) {
  const [proposals, setProposals] = useState(initial);
  const [message, setMessage] = useState("");
  async function withdraw(id: string) {
    const response = await fetch("/api/researcher/proposals", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) });
    const result = await response.json() as { error?: string };
    if (!response.ok) { setMessage(result.error || "The proposal could not be withdrawn."); return; }
    setProposals((rows) => rows.map((item) => item.id === id ? { ...item, status: "withdrawn" } : item)); setMessage("Proposal withdrawn.");
  }
  return <section className="proposal-list"><header><span>Private proposal ledger</span><h2>Your proposals</h2></header>{proposals.length ? proposals.map((proposal) => <article key={proposal.id}><header><span>{proposal.status.replaceAll("_", " ")}</span><h3>{proposal.title}</h3><small>{proposal.proposalType.replaceAll("_", " ")} · {proposal.primaryAnchor} · {formatDate(proposal.createdAt)}</small></header><p>{proposal.targetId ? <>Target: <a href={`/article/${proposal.targetId}`}>{proposal.targetId}</a></> : "Proposed new page"}</p><footer>{proposal.sources.map((source) => <span key={`${source.identifierType}:${source.identifierValue}`}>{source.identifierType.toUpperCase()} {source.identifierValue}</span>)}{proposal.status === "accepted" && <a href={`/proposals/${proposal.id}`}>Public permalink</a>}{["pending", "needs_revision"].includes(proposal.status) && <button type="button" onClick={() => withdraw(proposal.id)}>Withdraw</button>}</footer>{proposal.moderatorNote && <aside><b>Editorial note</b><p>{proposal.moderatorNote}</p></aside>}{proposal.status === "accepted" && !proposal.publishedCommit && <small>Accepted for the editorial pipeline; not yet published in the WikiBiome corpus.</small>}{proposal.publishedCommit && <a href={`https://github.com/paleofoundation/wikibiome/commit/${proposal.publishedCommit}`}>Inspect publication diff ↗</a>}</article>) : <p className="empty-state">No proposals yet. Suggest a page, section, connection, or framework correction.</p>}{message && <p className="form-message" role="status">{message}</p>}</section>;
}

function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.valueOf()) ? "" : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date); }
