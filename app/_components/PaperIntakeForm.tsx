"use client";
import { useState, type FormEvent } from "react";
export function PilotIntakeButton() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <button
        className="paper-primary"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const r = await fetch("/api/paper-intake/pilot", {
              method: "POST",
            });
            const p = (await r.json()) as { error: string; id: string };
            if (!r.ok) throw new Error(p.error);
            window.location.assign(`/researcher/submissions/${p.id}`);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Pilot unavailable.");
            setBusy(false);
          }
        }}
      >
        Open prepared pilot
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
export function PaperIntakeForm({
  topics,
  uploads,
}: {
  topics: { id: string; title: string }[];
  uploads: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/paper-intake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(form),
          rightsAttested: form.get("rightsAttested") === "on",
          isAuthor: form.get("isAuthor") === "on",
        }),
      });
      const result = (await response.json()) as {
        error: string;
        id: string;
        duplicate: boolean;
      };
      if (!response.ok) throw new Error(result.error);
      if (result.duplicate && !result.id)
        throw new Error(
          "This paper is already in the editorial queue. An editor can reconcile your contribution with the existing submission.",
        );
      const id = result.id;
      setSavedId(id);
      const file = form.get("file");
      if (!result.duplicate && file instanceof File && file.size) {
        const upload = await fetch(`/api/paper-intake/${id}/file`, {
          method: "PUT",
          headers: { "content-type": "application/pdf" },
          body: file,
        });
        const body = (await upload.json()) as { error: string };
        if (!upload.ok) throw new Error(body.error);
      }
      window.location.assign(`/researcher/submissions/${id}`);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Your submission could not be saved.",
      );
      setBusy(false);
    }
  }
  return (
    <form className="paper-form" onSubmit={submit}>
      <label>
        Paper title
        <input name="title" required maxLength={1000} />
      </label>
      <div className="paper-form-pair">
        <label>
          Authors <small>Separate names with semicolons</small>
          <input name="authors" required placeholder="Karen Pendergrass; …" />
        </label>
        <label>
          Publication year
          <input
            name="year"
            type="number"
            min="1600"
            max="2100"
            defaultValue={new Date().getFullYear()}
          />
        </label>
      </div>
      <div className="paper-form-pair">
        <label>
          DOI <small>Optional</small>
          <input name="doi" placeholder="10.…" />
        </label>
        <label>
          Primary topic
          <select name="topic" defaultValue="microbial-metallomics">
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="paper-form-pair">
        <label>
          Publication status
          <select name="publicationStatus">
            <option>Not yet verified</option>
            <option>Peer-reviewed publication</option>
            <option>Preprint; external peer review not completed</option>
            <option>
              Institutional technical report; external peer review not completed
            </option>
          </select>
        </label>
        <label>
          License or rights note
          <input name="license" placeholder="CC BY 4.0, author manuscript, …" />
        </label>
      </div>
      {uploads ? (
        <label>
          PDF manuscript <small>Optional at this step · up to 25 MB</small>
          <input name="file" type="file" accept="application/pdf,.pdf" />
        </label>
      ) : (
        <div className="paper-notice">
          You can save your paper’s details now. PDF uploads will open when the
          processing service and appointed reviewers are available.
        </div>
      )}
      <label className="paper-check">
        <input name="isAuthor" type="checkbox" />I am an author of this paper.
      </label>
      <label className="paper-check">
        <input name="rightsAttested" type="checkbox" required />I have
        permission to provide this paper for private processing and editorial
        review, including AI-assisted extraction.
      </label>
      <button className="paper-primary" disabled={busy || Boolean(savedId)}>
        {busy ? "Saving…" : "Save paper & continue"}
      </button>
      {error && <p role="alert">{error}</p>}
      {savedId && (
        <a href={`/researcher/submissions/${savedId}`}>
          Continue with the saved submission
        </a>
      )}
    </form>
  );
}
