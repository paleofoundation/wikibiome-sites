"use client";

import { useEffect, useState } from "react";

type Work = {
  id: string;
  title: string;
  doi: string | null;
  journal: string | null;
  year: number | null;
};

type Discovery = {
  works?: Work[];
  matches?: Array<{ status: string }>;
  syncWarning?: string;
  error?: string;
};

export function DashboardOrcidWorks() {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [works, setWorks] = useState<Work[]>([]);
  const [suggestions, setSuggestions] = useState(0);
  const [message, setMessage] = useState("Importing your public ORCID works…");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/researcher/works", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const result = await response.json() as Discovery;
        if (!response.ok) throw new Error(result.error || "ORCID works could not be imported.");
        setWorks(result.works || []);
        setSuggestions((result.matches || []).filter((match) => match.status === "suggested").length);
        setMessage(result.syncWarning || "Your public ORCID record is up to date.");
        setState(result.syncWarning ? "error" : "ready");
      })
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setMessage(error instanceof Error ? error.message : "ORCID works could not be imported.");
        setState("error");
      });
    return () => controller.abort();
  }, []);

  return <section className="dashboard-orcid-works" aria-live="polite">
    <header><div><span>Automatic ORCID import</span><h2>Your papers</h2></div><a href="/researcher/works">Review all and confirm matches</a></header>
    {state === "loading" ? <p className="empty-state">{message}</p> : <>
      <p className={`form-message ${state === "error" ? "error" : "saved"}`}>{message}</p>
      {works.length ? <div className="dashboard-work-list">{works.slice(0, 6).map((work) => <article key={work.id}><span>{work.year || "Year pending"}</span><div><b>{work.title}</b><small>{[work.journal, work.doi].filter(Boolean).join(" · ")}</small></div></article>)}</div> : <p className="empty-state">No public works were returned by ORCID. You can still search WikiBiome or submit a paper manually.</p>}
      <footer><b>{works.length} public ORCID work{works.length === 1 ? "" : "s"}</b><span>{suggestions} connection{suggestions === 1 ? "" : "s"} ready for your confirmation</span></footer>
    </>}
    <small>Importing a public work does not make an authorship claim public. You confirm every WikiBiome connection first.</small>
  </section>;
}
