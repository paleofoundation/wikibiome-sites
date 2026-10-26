"use client";

import { OrcidLink } from "@/app/_components/OrcidLink";
import { useState, type FormEvent } from "react";

type ShortlistEntry = {
  accountId: string;
  stars: number;
  eventTypes: string[];
  roles: string[];
  tracks: string[];
  researcher: { name: string; orcid: string };
};

export function ResearchNetworkAdminControls({ initialShortlist }: { initialShortlist: ShortlistEntry[] }) {
  const [shortlist, setShortlist] = useState(initialShortlist);
  const [message, setMessage] = useState("");

  async function publishProposal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/research-network/moderation", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind: "proposal", id: form.get("proposalId"), status: "published", publishedCommit: form.get("publishedCommit"), note: form.get("note") }),
    });
    const result = await response.json() as { error?: string };
    setMessage(response.ok ? "Proposal linked to its upstream publication commit." : result.error || "Publication link could not be recorded.");
    if (response.ok) event.currentTarget.reset();
  }

  async function recognize(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/research-network/recognition", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ accountId: form.get("accountId"), level: Number(form.get("level")), sourceType: form.get("sourceType"), sourceId: form.get("sourceId"), reason: form.get("reason") }),
    });
    const result = await response.json() as { error?: string };
    setMessage(response.ok ? "Human-reviewed recognition recorded with its public reason." : result.error || "Recognition could not be recorded.");
    if (response.ok) { event.currentTarget.reset(); await refreshShortlist(); }
  }

  async function refreshShortlist() {
    const response = await fetch("/api/research-network/recognition", { cache: "no-store" });
    const result = await response.json() as { shortlist?: ShortlistEntry[] };
    if (response.ok) setShortlist(result.shortlist || []);
  }

  return <section className="research-admin-controls" aria-labelledby="research-admin-title">
    <header><span>Human review controls</span><h2 id="research-admin-title">Publication, recognition, and event shortlist</h2><p>These actions never deploy content or send invitations. They record reviewed decisions and exact upstream evidence.</p></header>
    <div>
      <form className="research-form" onSubmit={publishProposal}><h3>Link an accepted proposal to publication</h3><label><span>Proposal ID</span><input name="proposalId" required/></label><label><span>Complete upstream Git commit</span><input name="publishedCommit" required pattern="[a-fA-F0-9]{40}"/></label><label><span>Editorial note</span><textarea name="note" rows={3}/></label><button>Record publication link</button></form>
      <form className="research-form" onSubmit={recognize}><h3>Award reviewed recognition</h3><label><span>Researcher account ID</span><input name="accountId" required/></label><div className="research-form-grid"><label><span>Level</span><select name="level"><option value="4">4 — cross-omics bridge</option><option value="5">5 — Topic Steward</option></select></label><label><span>Evidence type</span><input name="sourceType" required placeholder="proposal, source, or account"/></label></div><label><span>Evidence ID</span><input name="sourceId" required/></label><label><span>Public quality and conduct reason</span><textarea name="reason" rows={4} required/></label><button>Award after human review</button></form>
    </div>
    <section className="roundtable-shortlist"><header><h3>Private early-invitation shortlist</h3><button className="secondary" type="button" onClick={refreshShortlist}>Refresh</button></header>{shortlist.length ? shortlist.map((entry) => <article key={entry.accountId}><b>{entry.researcher.name}</b><span>{entry.stars} stars <OrcidLink orcid={entry.researcher.orcid} name={entry.researcher.name} /></span><small>{entry.eventTypes.join(", ")} · {entry.roles.join(", ")} · {entry.tracks.join(", ")}</small></article>) : <p>No active four- or five-star researchers currently meet the separate early-invitation opt-in threshold.</p>}<p>Shortlisting is not an invitation. Organizers must still review subject fit, conflicts, conduct, and interdisciplinary representation.</p></section>
    {message && <p className="form-message" role="status">{message}</p>}
  </section>;
}
