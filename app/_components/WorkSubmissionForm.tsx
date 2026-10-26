"use client";

import { useState, type FormEvent } from "react";

type CreatedSubmission = { id: string; title: string; status: string };

export function WorkSubmissionForm({ manuscriptUploadsEnabled }: { manuscriptUploadsEnabled: boolean }) {
  const [state, setState] = useState<"idle" | "saving" | "uploading" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [submission, setSubmission] = useState<CreatedSubmission | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const file = form.get("manuscript");
    if (file instanceof File && file.size > 0 && form.get("rightsAttested") !== "on") {
      setState("error");
      setMessage("Confirm the manuscript rights attestation before uploading a PDF.");
      return;
    }
    const response = await fetch("/api/work-submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        identifierType: form.get("identifierType"),
        identifierValue: form.get("identifierValue"),
        preprintTitle: form.get("preprintTitle"),
        rightsAttested: form.get("rightsAttested") === "on",
        license: form.get("license"),
      }),
    });
    const result = await response.json() as { submission?: CreatedSubmission; metadata?: { title?: string }; error?: string };
    if (!response.ok || !result.submission) { setState("error"); setMessage(result.error || "The work could not be submitted."); return; }
    setSubmission(result.submission);
    if (file instanceof File && file.size > 0) {
      setState("uploading");
      const upload = await fetch(`/api/work-submissions/${result.submission.id}/manuscript`, { method: "PUT", headers: { "content-type": "application/pdf", "x-filename": file.name }, body: file });
      const uploadResult = await upload.json() as { error?: string };
      if (!upload.ok) { setState("error"); setMessage(`Metadata was submitted, but the manuscript was not attached: ${uploadResult.error || "upload failed"}`); return; }
    }
    setState("saved");
    setMessage(`“${result.metadata?.title || result.submission.title}” entered the editorial queue. It has not changed the public corpus.`);
    event.currentTarget.reset();
  }

  return (
    <form className="research-form submission-form" onSubmit={submit}>
      <header><span>Moderated intake</span><h2>Add a research work</h2><p>WikiBiome imports authoritative metadata, checks for duplicates, and creates an editorial packet. Submissions never publish automatically.</p></header>
      <div className="research-form-grid">
        <label><span>Identifier type</span><select name="identifierType" defaultValue="doi"><option value="doi">DOI</option><option value="pmid">PMID</option><option value="preprint">Preprint URL</option></select></label>
        <label><span>DOI, PMID, or preprint URL</span><input name="identifierValue" required placeholder="10.1038/…" /></label>
      </div>
      <label><span>Preprint title <small>Only required when submitting a preprint URL</small></span><input name="preprintTitle" /></label>
      <div className="research-form-grid">
        {manuscriptUploadsEnabled ? <label><span>Optional PDF manuscript <small>25 MB maximum; author manuscript or open version only</small></span><input name="manuscript" type="file" accept="application/pdf,.pdf" /></label> : <aside className="submission-guardrail"><b>Metadata-only intake</b><span>Private manuscript uploads remain disabled until the scanning queue passes its production gate.</span></aside>}
        <label><span>License or rights note</span><input name="license" placeholder="CC BY 4.0, accepted author manuscript, …" /></label>
      </div>
      {manuscriptUploadsEnabled && <><label className="rights-attestation"><input name="rightsAttested" type="checkbox" /><span>I attest that any uploaded PDF is an author manuscript or openly licensed version that I have the right to provide for private editorial ingestion.</span></label><aside className="submission-guardrail"><b>Quarantine by default</b><span>PDFs are private, rejected if encrypted or active, and remain unavailable until a clean scan is recorded.</span></aside></>}
      <footer><p>DOI and PMID metadata are retrieved from Crossref and PubMed.</p><button disabled={state === "saving" || state === "uploading"}>{state === "saving" ? "Importing metadata…" : state === "uploading" ? "Quarantining manuscript…" : "Submit for editorial review"}</button></footer>
      {message && <p className={`form-message ${state}`} role="status">{message}</p>}
      {submission && <small className="submission-reference">Submission reference: {submission.id}</small>}
    </form>
  );
}
