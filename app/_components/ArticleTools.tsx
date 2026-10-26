"use client";

import { useEffect, useState } from "react";

type ArticleToolsProps = {
  title: string;
  canonicalPath: string;
  updated?: string;
  kind?: "article" | "source";
};

function canonicalUrl(path: string) {
  return new URL(path, "https://www.wikibiome.com").toString();
}

export function ArticleTools({ title, canonicalPath, updated, kind = "article" }: ArticleToolsProps) {
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(""), 2200);
    return () => window.clearTimeout(timer);
  }, [status]);

  async function copy(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus(`${label} copied`);
    } catch {
      setStatus("Copy unavailable");
    }
  }

  const url = canonicalUrl(canonicalPath);
  const year = updated ? new Date(updated).getUTCFullYear() : new Date().getUTCFullYear();
  const citation = `WikiBiome contributors. (${year}). ${title}. WikiBiome. ${url}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(`${title} — WikiBiome`);

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} — WikiBiome`, text: `Explore this evidence-linked WikiBiome ${kind}.`, url });
        setStatus("Shared");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await copy(url, "Link");
  }

  return (
    <details className="article-tools">
      <summary aria-label={`Share or cite ${title}`}><span aria-hidden="true">↗</span> Share & cite</summary>
      <div className="article-tools-panel">
        <header><span>Article tools</span><strong>{title}</strong></header>
        <button type="button" onClick={share}><span aria-hidden="true">⌁</span><b>Share this page</b><small>Use your device share sheet</small></button>
        <button type="button" onClick={() => copy(url, "Link")}><span aria-hidden="true">⧉</span><b>Copy link</b><small>Canonical page address</small></button>
        <button type="button" onClick={() => copy(citation, "Citation")}><span aria-hidden="true">“</span><b>Copy citation</b><small>WikiBiome web citation</small></button>
        <nav aria-label="Share on social media">
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn">in</a>
          <a href={`https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noreferrer" aria-label="Share on Bluesky">◌</a>
          <a href={`https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}`} target="_blank" rel="noreferrer" aria-label="Share on X">𝕏</a>
          <a href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`} aria-label="Share by email">@</a>
        </nav>
        <p aria-live="polite">{status || "Links open in a new tab."}</p>
      </div>
    </details>
  );
}
