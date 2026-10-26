"use client";

import { useState, type FormEvent } from "react";

export function InstitutionRequestForm() {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/institutions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ror: form.get("ror"),
        name: form.get("name"),
        website: form.get("website"),
        organizationType: form.get("organizationType"),
        relationship: form.get("relationship"),
        description: form.get("description"),
        evidenceNote: form.get("evidenceNote"),
      }),
    });
    const result = await response.json() as { organization?: { name: string; identityStatus: string }; institution?: { identifier: string; ror: string | null }; error?: string };
    if (!response.ok) {
      setState("error");
      setMessage(result.error || "The institution request could not be submitted.");
      return;
    }
    setState("saved");
    setMessage(`${result.organization?.name || "Organization"} was sent for review. ${result.institution?.ror ? "Its ROR identity was matched." : "WikiBiome can publish a provisional profile while its ROR request is pending."}`);
    event.currentTarget.reset();
  }

  return (
    <form className="research-form institution-request" onSubmit={submit}>
      <header><span>Free organization access</span><h2>Request a research-organization profile</h2><p>ROR is preferred, but it is no longer a gate. A stable research organization, program, association, publisher, or data resource can request a provisional WikiBiome profile while ROR review is pending.</p></header>
      <label><span>ROR identifier <small>Optional</small></span><input name="ror" placeholder="https://ror.org/012345678" /></label>
      <div className="research-form-grid">
        <label><span>Organization name <small>Required without ROR</small></span><input name="name" maxLength={300} placeholder="Institute of Contaminant Standards" /></label>
        <label><span>Public website <small>Required without ROR</small></span><input name="website" type="url" placeholder="https://example.org" /></label>
      </div>
      <div className="research-form-grid">
        <label><span>Organization type</span><select name="organizationType" defaultValue="research_institute"><option value="research_institute">Research institute</option><option value="research_program">Research program or project</option><option value="nonprofit">Nonprofit</option><option value="professional_association">Professional association</option><option value="publisher">Publisher</option><option value="data_resource">Data or evidence resource</option></select></label>
        <label><span>Your relationship</span><select name="relationship" defaultValue="researcher"><option value="founder">Founder</option><option value="director">Director</option><option value="researcher">Researcher</option><option value="administrator">Administrator</option><option value="member">Member</option></select></label>
      </div>
      <label><span>How will the organization participate?</span><textarea name="description" rows={4} maxLength={3000} placeholder="Describe the research program, relevant collections, and intended contribution to WikiBiome." /></label>
      <label><span>Public verification evidence <small>Required without ROR</small></span><textarea name="evidenceNote" rows={4} maxLength={3000} placeholder="Link to an organization page, publication affiliation, team page, or another public record that verifies the organization and your relationship." /></label>
      <aside className="submission-guardrail"><b>No pay-to-play</b><span>Profiles and institutional access are free. Approval confirms identity and relationship only; it does not grant editorial control, ranking, or guaranteed citation.</span></aside>
      <footer><p>Public pages remain human-reviewed. ROR can be attached later without creating a duplicate organization.</p><button disabled={state === "saving"}>{state === "saving" ? "Submitting…" : "Request free profile"}</button></footer>
      {message && <p className={`form-message ${state}`} role="status">{message}</p>}
    </form>
  );
}
