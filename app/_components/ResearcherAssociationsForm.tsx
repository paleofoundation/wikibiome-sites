"use client";

import { useRef, useState, type FormEvent } from "react";
import { MAX_RESEARCHER_ASSOCIATIONS, type ResearcherAssociation } from "@/lib/researcher-associations.mjs";

type Row = ResearcherAssociation & { id: number };

export function ResearcherAssociationsForm({ associations }: { associations: ResearcherAssociation[] }) {
  const [rows, setRows] = useState<Row[]>(() => associations.map((item, id) => ({ ...item, id })));
  const nextId = useRef(associations.length);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);

  function change(id: number, field: "name" | "url", value: string) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, [field]: value } : row));
    setMessage("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError(false);
    try {
      const response = await fetch("/api/account", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ associations: rows.map(({ name, url }) => ({ name, url })) }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Your associations could not be saved.");
      setMessage("Associations saved to your public profile.");
    } catch (failure) {
      setError(true);
      setMessage(failure instanceof Error ? failure.message : "Unable to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return <section id="researcher-associations" className="researcher-associations-editor" aria-labelledby="associations-editor-title">
    <header><h3 id="associations-editor-title">Associations</h3><p>Link to organizations, projects, and websites you’re associated with. These appear on your public profile.</p></header>
    <form onSubmit={submit}>
      <fieldset disabled={saving}>
        <legend className="sr-only">Your association links</legend>
        {rows.length === 0 && <p className="association-empty">No association links yet.</p>}
        {rows.map((row, index) => <div className="association-editor-row" key={row.id}>
          <label htmlFor={`association-name-${row.id}`}>Association name<input id={`association-name-${row.id}`} value={row.name} onChange={(event) => change(row.id, "name", event.target.value)} maxLength={140} required placeholder="Organization or project" /></label>
          <label htmlFor={`association-url-${row.id}`}>Website<input id={`association-url-${row.id}`} value={row.url} onChange={(event) => change(row.id, "url", event.target.value)} type="text" inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={2048} required placeholder="https://example.com" /></label>
          <button type="button" className="association-remove" aria-label={`Remove association ${index + 1}${row.name ? `: ${row.name}` : ""}`} onClick={() => { setRows((current) => current.filter((item) => item.id !== row.id)); setMessage(""); }}>Remove</button>
        </div>)}
        <footer>
          <button type="button" className="association-add" disabled={rows.length >= MAX_RESEARCHER_ASSOCIATIONS} onClick={() => { setRows((current) => [...current, { id: nextId.current++, name: "", url: "" }]); setMessage(""); }}>+ Add association</button>
          <button type="submit" className="association-save">{saving ? "Saving…" : "Save associations"}</button>
        </footer>
      </fieldset>
      {message && <p className={`association-message${error ? " error" : ""}`} role={error ? "alert" : "status"}>{message}</p>}
    </form>
  </section>;
}
