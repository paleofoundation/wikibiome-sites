"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const types = [
  ["new_evidence", "Add new evidence"],
  ["correction", "Correct a scientific claim"],
  ["clarification", "Clarify existing prose"],
  ["copy_edit", "Copy or accessibility edit"],
  ["link_update", "Repair or improve a link"],
] as const;

export function ContributionForm({ pageId, sections }: { pageId: string; sections: string[] }) {
  const router = useRouter();
  const [state, setState] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/contributions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        pageId,
        contributionType: form.get("contributionType"),
        section: form.get("section"),
        originalText: form.get("originalText"),
        proposedText: form.get("proposedText"),
        rationale: form.get("rationale"),
        sourceUrl: form.get("sourceUrl"),
      }),
    });
    const result = await response.json() as { error?: string };
    if (!response.ok) {
      setState("error");
      setMessage(result.error ?? "The contribution could not be submitted.");
      return;
    }
    router.push("/contributions?submitted=1");
    router.refresh();
  }

  return (
    <form className="contribution-form" onSubmit={submit}>
      <div className="contribution-form-grid">
        <label><span>Contribution type</span><select name="contributionType" defaultValue="new_evidence">{types.map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></label>
        <label><span>Article section</span><select name="section" defaultValue="Introduction"><option>Introduction</option>{sections.map((section) => <option value={section} key={section}>{section}</option>)}</select></label>
      </div>
      <label><span>Existing passage <small>Optional—paste the text you are addressing</small></span><textarea name="originalText" rows={5} /></label>
      <label><span>Proposed text</span><textarea name="proposedText" rows={8} required /></label>
      <label><span>Why this improves the article</span><textarea name="rationale" rows={5} required /></label>
      <label><span>DOI, PMID, or source URL <small>Required for scientific claims and evidence changes</small></span><input name="sourceUrl" inputMode="url" placeholder="https://doi.org/…" /></label>
      <footer><p>Submissions enter a review queue. They never alter the public article automatically.</p><button disabled={state === "saving"} type="submit">{state === "saving" ? "Submitting…" : "Submit for review"}</button></footer>
      {state === "error" && <p className="contribution-error" role="alert">{message}</p>}
    </form>
  );
}
