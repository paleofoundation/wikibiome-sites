"use client";

import { useState, type FormEvent } from "react";

type InstitutionAccess = { institutionId: string; status: string; role: string; institution: { name: string } };

export function InstitutionBatchForm({ access }: { access: InstitutionAccess[] }) {
  const approved = access.filter((item) => item.status === "approved" && item.role === "admin");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  if (!approved.length) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/institutions/batches", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ institutionId: form.get("institutionId"), format: form.get("format"), identifiers: form.get("identifiers") }) });
    const result = await response.json() as { batch?: { recordCount: number }; error?: string };
    if (!response.ok) { setState("error"); setMessage(result.error || "The batch could not be submitted."); return; }
    setState("saved");
    setMessage(`${result.batch?.recordCount || 0} records entered the institution review queue.`);
    event.currentTarget.reset();
  }

  return <form className="research-form institution-batch" onSubmit={submit}><header><span>Approved institution workflow</span><h2>Submit a research batch</h2><p>Batch acceptance does not guarantee citation and cannot claim authorship on behalf of an individual.</p></header><div className="research-form-grid"><label><span>Institution</span><select name="institutionId">{approved.map((item) => <option value={item.institutionId} key={item.institutionId}>{item.institution.name}</option>)}</select></label><label><span>Format</span><select name="format"><option value="doi">DOI list</option><option value="pmid">PMID list</option><option value="csv">CSV records</option><option value="ris">RIS records</option><option value="bibtex">BibTeX records</option></select></label></div><label><span>Identifiers or records <small>One per line</small></span><textarea name="identifiers" rows={8} required /></label><footer><p>Each batch remains pending until editorial review.</p><button disabled={state === "saving"}>{state === "saving" ? "Submitting…" : "Submit institution batch"}</button></footer>{message && <p className={`form-message ${state}`} role="status">{message}</p>}</form>;
}
