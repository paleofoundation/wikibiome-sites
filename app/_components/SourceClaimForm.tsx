"use client";

import { useState, type FormEvent } from "react";

type Claim = { id: string; status: string; verificationMethod: string };

export function SourceClaimForm({ sourceId, existingClaim }: { sourceId: string; existingClaim?: Claim | null }) {
  const [claim, setClaim] = useState<Claim | null>(existingClaim ?? null);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function claimWork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/source-claims", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ sourceId, evidenceNote: form.get("evidenceNote") }) });
    const result = await response.json() as { claim?: Claim; error?: string };
    if (!response.ok || !result.claim) { setState("error"); setMessage(result.error || "The claim could not be created."); return; }
    setClaim(result.claim);
    setState("saved");
    setMessage(result.claim.status === "verified" ? "Authorship was verified from persistent-identifier metadata." : "Claim received for editorial verification.");
  }

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!claim) return;
    setState("saving");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/author-reviews", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ claimId: claim.id, accuracy: form.get("accuracy"), context: form.get("context"), sourceUrl: form.get("sourceUrl"), conflictDisclosure: form.get("conflictDisclosure") }) });
    const result = await response.json() as { error?: string };
    if (!response.ok) { setState("error"); setMessage(result.error || "The author review could not be submitted."); return; }
    setState("saved");
    setMessage("Author context submitted for editorial review.");
    event.currentTarget.reset();
  }

  return (
    <div className="claim-workspace">
      {!claim ? (
        <form className="research-form" onSubmit={claimWork}>
          <header><span>Step 1</span><h2>Confirm your authorship</h2><p>Claims are non-exclusive. Every coauthor may independently connect this work to their authenticated ORCID profile.</p></header>
          <label><span>Supporting note <small>Optional if your ORCID record already contains the DOI</small></span><textarea name="evidenceNote" rows={4} placeholder="For example: corresponding author, former affiliation, or metadata discrepancy." /></label>
          <footer><p>A claim verifies authorship identity. It does not transfer copyright or editorial control.</p><button disabled={state === "saving"}>{state === "saving" ? "Checking…" : "Claim this work"}</button></footer>
        </form>
      ) : (
        <>
          <aside className={`claim-status status-${claim.status}`}><span>Authorship claim</span><strong>{claim.status.replaceAll("_", " ")}</strong><small>{claim.verificationMethod.replaceAll("_", " ")}</small></aside>
          <form className="research-form" onSubmit={submitReview}>
            <header><span>Step 2</span><h2>Review WikiBiome’s representation</h2><p>Your response is moderated and, when accepted, appears as attributed author context without replacing the independent synthesis.</p></header>
            <label><span>How does it look?</span><select name="accuracy" defaultValue="accurate"><option value="accurate">Accurate</option><option value="needs_correction">Needs correction</option><option value="missing_context">Important context is missing</option></select></label>
            <label><span>Author context</span><textarea name="context" rows={7} required placeholder="Explain what is accurate, what should change, or which limitation readers need to understand." /></label>
            <label><span>Supporting DOI, PMID, or URL <small>Recommended for corrections</small></span><input name="sourceUrl" placeholder="https://doi.org/…" /></label>
            <label><span>Conflict-of-interest disclosure</span><textarea name="conflictDisclosure" rows={3} placeholder="Funding, commercial relationships, or other interests relevant to this response." /></label>
            <footer><p>Public content never changes automatically.</p><button disabled={state === "saving"}>{state === "saving" ? "Submitting…" : "Submit author context"}</button></footer>
          </form>
        </>
      )}
      {message && <p className={`form-message ${state}`} role="status">{message}</p>}
    </div>
  );
}
