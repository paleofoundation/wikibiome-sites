/* eslint-disable @next/next/no-img-element -- Photos are served by WikiBiome's versioned R2-backed route. */
"use client";

import { useState, type FormEvent } from "react";

type Props = {
  orcid: string;
  name: string;
  initialPhotoAvailable: boolean;
  initialPhotoAlt: string;
  initialPhotoUpdatedAt: string | null;
};

export function ResearcherPhotoForm({ orcid, name, initialPhotoAvailable, initialPhotoAlt, initialPhotoUpdatedAt }: Props) {
  const [photoAvailable, setPhotoAvailable] = useState(initialPhotoAvailable);
  const [photoVersion, setPhotoVersion] = useState(initialPhotoUpdatedAt);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const file = form.get("photo");
    if (!(file instanceof File) || !file.size) { setState("error"); setMessage("Choose a photo first."); return; }
    setState("saving"); setMessage("");
    const alt = String(form.get("photoAlt") || "");
    const response = await fetch(`/api/researcher/profile-photo?alt=${encodeURIComponent(alt)}`, { method: "PUT", headers: { "content-type": file.type }, body: file });
    const result = await response.json() as { photoUpdatedAt?: string; error?: string };
    if (!response.ok || !result.photoUpdatedAt) { setState("error"); setMessage(result.error || "The photo could not be uploaded."); return; }
    setPhotoAvailable(true); setPhotoVersion(result.photoUpdatedAt); setState("saved"); setMessage("Professional photo published on your public profile.");
  }

  async function remove() {
    setState("saving"); setMessage("");
    const response = await fetch("/api/researcher/profile-photo", { method: "DELETE" });
    const result = await response.json() as { error?: string };
    if (!response.ok) { setState("error"); setMessage(result.error || "The photo could not be removed."); return; }
    setPhotoAvailable(false); setPhotoVersion(null); setState("saved"); setMessage("Public profile photo removed.");
  }

  const src = `/researchers/${orcid}/photo${photoVersion ? `?v=${encodeURIComponent(photoVersion)}` : ""}`;
  return <section id="researcher-profile-photo" className="researcher-photo-editor">
    <header><span>Public professional photo</span><h3>Help collaborators recognize you</h3><p>Use a clear, professional headshot. The image is public wherever your researcher profile appears.</p></header>
    <div className="researcher-photo-layout">
      <div className="researcher-avatar large">{photoAvailable ? <img src={src} alt={initialPhotoAlt || `Professional portrait of ${name}`} /> : <span aria-hidden="true">{initials(name)}</span>}</div>
      <form onSubmit={submit}>
        <label><span>Photo</span><input name="photo" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" required /></label>
        <label><span>Image description <small>Used by screen readers</small></span><input name="photoAlt" defaultValue={initialPhotoAlt || `Professional portrait of ${name}`} maxLength={180} /></label>
        <div><button disabled={state === "saving"}>{state === "saving" ? "Saving…" : photoAvailable ? "Replace photo" : "Upload photo"}</button>{photoAvailable && <button className="secondary" type="button" onClick={remove} disabled={state === "saving"}>Remove</button>}</div>
      </form>
    </div>
    <small>JPEG, PNG, or WebP · 5 MB maximum · no SVG files</small>
    {message && <p className={`form-message ${state}`} role="status">{message}</p>}
  </section>;
}

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "R";
}
