"use client";

import { useState, type FormEvent } from "react";

type PageOption = { id: string; title: string; category: string };

export function ProposalForm({ pages, initialTarget = "" }: { pages: PageOption[]; initialTarget?: string }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("new_page");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState("saving"); setMessage("");
    const form = new FormData(event.currentTarget);
    const sources = String(form.get("sources") || "").split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
      const [prefix, ...rest] = line.split(":");
      return { identifierType: prefix.toLowerCase() === "pmid" ? "pmid" : "doi", identifierValue: prefix.toLowerCase() === "pmid" || prefix.toLowerCase() === "doi" ? rest.join(":").trim() : line };
    });
    const response = await fetch("/api/researcher/proposals", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({
      proposalType: form.get("proposalType"), targetId: form.get("targetId"), title: form.get("title"), primaryAnchor: form.get("primaryAnchor"),
      secondaryDomains: form.getAll("secondaryDomains"), rationale: form.get("rationale"), proposedContent: form.get("proposedContent"),
      mechanismConnection: form.get("mechanismConnection"), causalLimitations: form.get("causalLimitations"), conflictDisclosure: form.get("conflictDisclosure"), sources,
    }) });
    const result = await response.json() as { error?: string; id?: string };
    if (!response.ok) { setState("error"); setMessage(result.error || "The proposal could not be submitted."); return; }
    setState("saved"); setMessage(`Proposal submitted for editorial review. Reference: ${result.id}`); event.currentTarget.reset(); setType("new_page");
  }

  const domains = ["genomics", "metabolomics", "transcriptomics", "proteomics", "immunology", "exposomics", "clinical_evidence", "other"];
  return <form className="research-form proposal-form" onSubmit={submit}>
    <div className="research-form-grid"><label><span>Proposal type</span><select name="proposalType" value={type} onChange={(event) => setType(event.target.value)}><option value="new_page">New page</option><option value="new_section">New section</option><option value="cross_page_connection">Cross-page connection</option><option value="framework_correction">Framework or taxonomy correction</option></select></label><label><span>Existing page {type === "new_page" && <small>Optional for new pages</small>}</span><input name="targetId" list="wikibiome-page-options" defaultValue={initialTarget} required={type !== "new_page"} placeholder="Start typing a page title or ID"/><datalist id="wikibiome-page-options">{pages.map((page) => <option key={page.id} value={page.id}>{page.title} · {page.category}</option>)}</datalist></label></div>
    <label><span>Proposal title</span><input name="title" required maxLength={240}/></label>
    <fieldset className="proposal-anchor"><legend>Required primary anchor</legend><p>Every proposal must remain grounded in microbiome science, metallomics, or both.</p><label><input type="radio" name="primaryAnchor" value="microbiome" required/> Microbiome</label><label><input type="radio" name="primaryAnchor" value="metallomics"/> Metallomics</label><label><input type="radio" name="primaryAnchor" value="both"/> Both</label></fieldset>
    <fieldset className="proposal-domains"><legend>Secondary multi-omics connections</legend>{domains.map((domain) => <label key={domain}><input type="checkbox" name="secondaryDomains" value={domain}/>{domain.replaceAll("_", " ")}</label>)}</fieldset>
    <label><span>Why this belongs in WikiBiome</span><textarea name="rationale" rows={5} required placeholder="Explain the gap, interdisciplinary value, and likely readers."/></label>
    <label><span>Proposed outline or text</span><textarea name="proposedContent" rows={8} required placeholder="Outline the page or section, or provide review-ready draft text."/></label>
    <div className="research-form-grid"><label><span>Mechanistic connection</span><textarea name="mechanismConnection" rows={6} required placeholder="Connect organisms, metals, pathways, host systems, or disease state."/></label><label><span>Causal limitations</span><textarea name="causalLimitations" rows={6} required placeholder="State what the evidence cannot establish and important confounders."/></label></div>
    <label><span>Supporting identifiers <small>One per line as DOI: value or PMID: value</small></span><textarea name="sources" rows={5} required placeholder={"DOI: 10.1000/example\nPMID: 12345678"}/></label>
    <label><span>Conflict-of-interest disclosure</span><textarea name="conflictDisclosure" rows={3} placeholder="Funding, authorship, institutional, commercial, or other relevant relationship. Enter ‘None’ when none applies."/></label>
    <aside className="editorial-firewall"><b>Editorial firewall</b><p>Accepted proposals create review packets. They never write directly to the public corpus and never guarantee citation, visibility, favorable treatment, or Keystone status.</p></aside>
    <footer><p>Only accepted proposals are publicly attributed. Pending, declined, and withdrawn proposals remain visible only to you and moderators.</p><button disabled={state === "saving"}>{state === "saving" ? "Submitting…" : "Submit scientific proposal"}</button></footer>
    {message && <p className={`form-message ${state}`} role="status">{message}</p>}
  </form>;
}
