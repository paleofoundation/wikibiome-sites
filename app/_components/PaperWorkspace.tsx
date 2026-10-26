"use client";
import { useState, type FormEvent } from "react";
import type { Paper } from "@/lib/paper-intake-types";
import { paperStatusLabels } from "@/lib/paper-intake-policy.mjs";
export function PaperWorkspace({
  initial,
  owner,
  editor,
  reviewer,
  independent,
  roster,
}: {
  initial: Paper;
  owner: boolean;
  editor: boolean;
  reviewer: boolean;
  independent: boolean;
  roster: {
    orcid: string;
    display_name: string;
    topic: string;
    active: number;
  }[];
}) {
  const [paper, setPaper] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const editable =
    (owner || editor) &&
    [
      "metadata_review",
      "needs_revision",
      "awaiting_reviewer",
      "in_review",
      "recommended",
      "approved",
    ].includes(paper.status);
  async function act(input: Record<string, unknown>) {
    setBusy(true);
    setMessage("");
    try {
      const r = await fetch(`/api/paper-intake/${paper.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...input, revision: paper.revision }),
      });
      const p = (await r.json()) as { error: string; paper: Paper };
      if (!r.ok) throw new Error(p.error);
      setPaper(p.paper);
      setMessage("Saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to save.");
    } finally {
      setBusy(false);
    }
  }
  function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const texts = Object.fromEntries(
      paper.packet.changes.map((c) => [
        c.targetId,
        f.get(`change:${c.targetId}`),
      ]),
    );
    const resolutions = Object.fromEntries(
      paper.packet.flags.map((flag) => [flag.id, f.get(`flag:${flag.id}`)]),
    );
    void act({
      action: paper.status === "metadata_review" ? "confirm" : "revise",
      title: f.get("title"),
      authors: f.get("authors"),
      doi: f.get("doi"),
      year: f.get("year"),
      affiliations: f.get("affiliations"),
      publicationStatus: f.get("publicationStatus"),
      license: f.get("license"),
      selectedTargets: f.getAll("selectedTargets"),
      texts,
      resolutions,
    });
  }
  function decide(e: FormEvent<HTMLFormElement>, action: string) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    void act({
      ...Object.fromEntries(f),
      action,
      confirmedIndependent: f.get("confirmedIndependent") === "on",
    });
  }
  const packet = paper.packet;
  return (
    <>
      <div className="paper-status-line">
        <span className="paper-status">
          {paperStatusLabels[paper.status as keyof typeof paperStatusLabels] ||
            paper.status}
        </span>
        <span>Revision {paper.revision}</span>
        {paper.status === "published" && (
          <a href={`/source/${packet.metadata.sourceId}`}>
            View published source
          </a>
        )}
      </div>
      <ol className="paper-progress" aria-label="Paper workflow">
        {["Upload", "Extract", "Review", "Publish", "Credit"].map((s, i) => (
          <li
            key={s}
            className={
              paper.status === "published" ||
              (packet.claims.length > 0 && i < 2)
                ? "done"
                : ""
            }
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            {s}
          </li>
        ))}
      </ol>
      <div className="paper-layout">
        <div>
          <form onSubmit={save}>
            <section className="paper-section">
              <header>
                <h2>Paper details</h2>
                <span>
                  {packet.provenance.pageCount || "—"} pages ·{" "}
                  {packet.references.length} references
                </span>
              </header>
              {editable ? (
                <div className="paper-form">
                  <label>
                    Title
                    <textarea
                      name="title"
                      defaultValue={packet.metadata.title}
                      rows={3}
                      required
                    />
                  </label>
                  <label>
                    Authors <small>Separate names with semicolons</small>
                    <input
                      name="authors"
                      defaultValue={packet.metadata.authors.join("; ")}
                      required
                    />
                  </label>
                  <div className="paper-form-pair">
                    <label>
                      DOI
                      <input name="doi" defaultValue={packet.metadata.doi} />
                    </label>
                    <label>
                      Year
                      <input
                        name="year"
                        type="number"
                        min="1600"
                        max="2100"
                        defaultValue={packet.metadata.year}
                        required
                      />
                    </label>
                  </div>
                  <label>
                    Named affiliations{" "}
                    <small>Separate organization names with semicolons</small>
                    <input
                      name="affiliations"
                      defaultValue={packet.metadata.affiliations.join("; ")}
                    />
                  </label>
                  <label>
                    Publication & review status
                    <textarea
                      name="publicationStatus"
                      defaultValue={packet.metadata.publicationStatus}
                      rows={2}
                      required
                    />
                  </label>
                  <label>
                    License
                    <input
                      name="license"
                      defaultValue={packet.metadata.license}
                    />
                  </label>
                </div>
              ) : (
                <p>{packet.metadata.publicationStatus}</p>
              )}
              <p>
                {packet.metadata.authors.join("; ")} · {packet.metadata.year}
              </p>
              <p className="paper-muted">
                {packet.metadata.affiliations.join(" · ")}
              </p>
              {packet.metadata.doi && <p>DOI: {packet.metadata.doi}</p>}
              <p>{packet.metadata.abstract}</p>
            </section>
            {!!packet.flags.length && (
              <section className="paper-section">
                <header>
                  <h2>Needs attention</h2>
                  <span>
                    {packet.flags.filter((f) => !f.resolved).length} open
                  </span>
                </header>
                {packet.flags.map((flag) => (
                  <div className="paper-flag" key={flag.id}>
                    <strong>
                      {flag.resolved
                        ? "Resolution recorded"
                        : flag.blocking
                          ? "Resolve before approval"
                          : "Editorial check"}
                    </strong>
                    <p>{flag.message}</p>
                    {editable ? (
                      <label>
                        Evidence or correction
                        <textarea
                          name={`flag:${flag.id}`}
                          defaultValue={flag.resolution}
                          placeholder="Record the source checked and the resolution. Reviewers will assess this explanation."
                          rows={2}
                        />
                      </label>
                    ) : (
                      flag.resolution && <p>{flag.resolution}</p>
                    )}
                  </div>
                ))}
              </section>
            )}
            <section className="paper-section">
              <header>
                <h2>Proposed article changes</h2>
                <span>{packet.changes.length} destinations</span>
              </header>
              {!packet.changes.length && (
                <p>
                  The engine has not extracted this paper yet. No changes have
                  been proposed.
                </p>
              )}
              {packet.changes.map((change, i) => (
                <details
                  className="paper-change"
                  key={change.targetId}
                  open={i === 0}
                >
                  <summary>
                    <span>
                      <b>{change.title}</b>
                      <small>{change.section}</small>
                    </span>
                    <span>{change.kind.replaceAll("_", " ")}</span>
                  </summary>
                  <p>{change.rationale}</p>
                  {editable && (
                    <label className="paper-check">
                      <input
                        type="checkbox"
                        name="selectedTargets"
                        value={change.targetId}
                        defaultChecked
                      />
                      Include this article in the publication packet
                    </label>
                  )}
                  <div className="paper-comparison">
                    <div>
                      <h3>Current article</h3>
                      <p className="paper-passage">{change.currentText}</p>
                      <a
                        href={`/article/${change.targetId}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open article ↗
                      </a>
                    </div>
                    <div>
                      <h3>Proposed wording</h3>
                      {editable ? (
                        <textarea
                          aria-label={`Proposed wording for ${change.title}`}
                          name={`change:${change.targetId}`}
                          defaultValue={change.proposedText}
                          rows={9}
                        />
                      ) : (
                        <p className="paper-passage">{change.proposedText}</p>
                      )}
                    </div>
                  </div>
                  <h3>Supporting passages</h3>
                  {change.claimIds.map((id) => {
                    const c = packet.claims.find((c) => c.id === id);
                    return c ? (
                      <article className="paper-evidence" key={id}>
                        <div>
                          <span>PDF page {c.page}</span>
                          <span>{c.evidenceType.replaceAll("_", " ")}</span>
                          <span>
                            {c.support === "secondary_citation"
                              ? "Reported through this synthesis"
                              : "This paper’s interpretation"}
                          </span>
                        </div>
                        <blockquote>{c.passage}</blockquote>
                        <p>
                          <b>Population:</b> {c.population} ·{" "}
                          <b>Compartment:</b> {c.compartment}
                        </p>
                        <p>
                          <b>Outcome:</b> {c.outcome}
                        </p>
                        <p>
                          <b>Limits:</b> {c.limitations}
                        </p>
                        {c.references.length > 0 && (
                          <small>
                            References {c.references.join(", ")} · check the
                            underlying studies before treating these as direct
                            evidence.
                          </small>
                        )}
                      </article>
                    ) : null;
                  })}
                </details>
              ))}
            </section>
            {editable && (
              <div className="paper-save">
                <p>
                  Saving changes clears earlier recommendations and returns the
                  packet for a fresh review.
                </p>
                <button className="paper-primary" disabled={busy}>
                  {paper.status === "metadata_review"
                    ? "Confirm details & request review"
                    : "Save revisions & request a new review"}
                </button>
              </div>
            )}
          </form>
          <section className="paper-section">
            <details>
              <summary>
                Bibliography · {packet.references.length} references
              </summary>
              <ol className="paper-bibliography">
                {packet.references.map((r) => (
                  <li key={r.number} value={r.number}>
                    <p>{r.text}</p>
                    <small>{r.status}</small>
                    {r.matchedSourceId && (
                      <a href={`/source/${r.matchedSourceId}`}>
                        Existing WikiBiome source
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </details>
          </section>
        </div>
        <aside className="paper-side">
          <section>
            <h2>Editorial progress</h2>
            {paper.status === "awaiting_reviewer" && (
              <p>
                No review is underway yet. An editor must assign an independent
                reviewer appointed for this topic.
              </p>
            )}
            {paper.status === "metadata_review" && (
              <p>
                Confirm the extracted details and inspect the proposed changes
                before requesting review.
              </p>
            )}
            {paper.packet.processingError && (
              <p role="alert">{paper.packet.processingError}</p>
            )}
            {["awaiting_processing", "processing_failed"].includes(
              paper.status,
            ) && (
              <button disabled={busy} onClick={() => act({ action: "retry" })}>
                Retry processing
              </button>
            )}
            {paper.status === "awaiting_file" && owner && (
              <label>
                Attach PDF
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  disabled={busy}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setBusy(true);
                    try {
                      const r = await fetch(
                        `/api/paper-intake/${paper.id}/file`,
                        {
                          method: "PUT",
                          headers: { "content-type": "application/pdf" },
                          body: file,
                        },
                      );
                      const p = (await r.json()) as {
                        error: string;
                        paper: Paper;
                      };
                      if (!r.ok) throw new Error(p.error);
                      setPaper(p.paper);
                    } catch (e) {
                      setMessage(
                        e instanceof Error ? e.message : "Upload failed.",
                      );
                    } finally {
                      setBusy(false);
                    }
                  }}
                />
              </label>
            )}
            {editor &&
              ["awaiting_reviewer", "in_review", "recommended"].includes(
                paper.status,
              ) && (
                <form
                  className="paper-form"
                  onSubmit={(e) => decide(e, "assign")}
                >
                  <label>
                    Assign an appointed reviewer
                    <select name="orcid" required defaultValue="">
                      <option value="" disabled>
                        Choose reviewer
                      </option>
                      {roster
                        .filter((r) => r.active && r.topic === paper.topic)
                        .map((r) => (
                          <option key={r.orcid} value={r.orcid}>
                            {r.display_name}
                          </option>
                        ))}
                    </select>
                  </label>
                  <button disabled={busy}>Assign review</button>
                  <a href="/researcher/review">Manage reviewer appointments</a>
                </form>
              )}
            {independent &&
              ((reviewer && paper.status === "in_review") ||
                (editor && paper.status === "recommended")) && (
                <form
                  className="paper-form"
                  onSubmit={(e) =>
                    decide(
                      e,
                      paper.status === "in_review" ? "recommend" : "approve",
                    )
                  }
                >
                  <h3>
                    {paper.status === "in_review"
                      ? "Your recommendation"
                      : "Editor decision"}
                  </h3>
                  <label>
                    Decision
                    <select
                      name={
                        paper.status === "in_review"
                          ? "recommendation"
                          : "decision"
                      }
                    >
                      <option value="revise">Request revisions</option>
                      <option value="accept">Accept proposed changes</option>
                      <option value="decline">Decline</option>
                    </select>
                  </label>
                  <label>
                    Evidence and reasoning
                    <textarea name="note" rows={5} required />
                  </label>
                  <label>
                    Competing interests
                    <textarea
                      name="disclosure"
                      rows={3}
                      required
                      placeholder="State any relevant relationships, or state none."
                    />
                  </label>
                  <label className="paper-check">
                    <input
                      type="checkbox"
                      name="confirmedIndependent"
                      required
                    />
                    I am not an author or submitter and can assess this paper
                    independently.
                  </label>
                  <button className="paper-primary" disabled={busy}>
                    Record decision
                  </button>
                </form>
              )}
            {packet.review && (
              <div className="paper-review-note">
                <strong>Reviewer: {packet.review.recommendation}</strong>
                <p>{packet.review.note}</p>
                <small>Disclosure: {packet.review.disclosure}</small>
              </div>
            )}
            {packet.approval && (
              <div className="paper-review-note">
                <strong>Editor decision recorded</strong>
                <p>{packet.approval.note}</p>
              </div>
            )}
            {editor && independent && paper.status === "approved" && (
              <div className="paper-form">
                <a
                  className="paper-primary"
                  href={`/api/paper-intake/${paper.id}/export`}
                >
                  Download approved publication packet
                </a>
                <p>
                  After publication, verify that every approved passage is
                  present on the live site.
                </p>
                <button
                  disabled={busy}
                  onClick={() => act({ action: "verify_publication" })}
                >
                  Verify live publication
                </button>
              </div>
            )}
          </section>
          <section>
            <h2>Contribution credit</h2>
            <span className="paper-credit">
              {paper.status === "published" ? "★" : "☆"}
            </span>
            <p>
              {paper.status === "published"
                ? "One published paper contribution recorded."
                : "No star awarded yet."}
            </p>
            <p>
              Your first qualifying published contribution earns one star. This
              paper counts once, even if it improves several articles.
            </p>
            <small>
              Authorship and Keystone designation are assessed separately.
            </small>
          </section>
          {paper.status === "published" && (
            <section>
              <h2>Published results</h2>
              <a href={`/source/${packet.metadata.sourceId}`}>
                View the source, article connections, and authorship
                verification
              </a>
            </section>
          )}
          <section>
            <h2>Document record</h2>
            <p>{packet.provenance.mode}</p>
            <small>
              Scan: {packet.provenance.scanStatus.replaceAll("_", " ")}
            </small>
            {packet.provenance.scanStatus === "clean" && paper.fileKey && (
              <p>
                <a href={`/api/paper-intake/${paper.id}/file`}>
                  Download scanned PDF
                </a>
              </p>
            )}
            <details>
              <summary>Document fingerprint</summary>
              <code className="paper-hash">
                {packet.provenance.documentHash || "Awaiting PDF"}
              </code>
            </details>
          </section>
          {message && (
            <p className="paper-message" role="status">
              {message}
            </p>
          )}
        </aside>
      </div>
    </>
  );
}
export function ReviewerAppointmentForm({
  topics,
}: {
  topics: { id: string; title: string }[];
}) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <form
      className="paper-form"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        setBusy(true);
        try {
          const r = await fetch("/api/paper-intake/appointments", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              orcid: f.get("orcid"),
              topic: f.get("topic"),
              active: f.get("active") === "yes",
            }),
          });
          const p = (await r.json()) as { error: string; paper: Paper };
          if (!r.ok) throw new Error(p.error);
          window.location.reload();
        } catch (e) {
          setMessage(
            e instanceof Error ? e.message : "Unable to save appointment.",
          );
          setBusy(false);
        }
      }}
    >
      <label>
        Researcher ORCID
        <input name="orcid" required placeholder="Paste the researcher’s ORCID iD" />
      </label>
      <label>
        Review topic
        <select name="topic" defaultValue="microbial-metallomics">
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>
      </label>
      <label>
        Appointment
        <select name="active">
          <option value="yes">Appoint / reactivate</option>
          <option value="no">Revoke appointment</option>
        </select>
      </label>
      <button disabled={busy}>Save appointment</button>
      {message && <p role="alert">{message}</p>}
    </form>
  );
}
