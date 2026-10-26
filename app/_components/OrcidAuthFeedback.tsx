"use client";

import { useSyncExternalStore } from "react";
import { getOrcidAuthMessage } from "@/lib/orcid-auth.mjs";

function subscribeToLocation(callback: () => void) {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
}

function currentStatus() {
  const params = new URLSearchParams(window.location.search);
  return `${params.get("orcid") || ""}|${params.get("email") || ""}`;
}

export function OrcidAuthFeedback() {
  const status = useSyncExternalStore(subscribeToLocation, currentStatus, () => "|");
  const [orcidStatus, emailStatus] = status.split("|");
  const message = getOrcidAuthMessage(orcidStatus) || emailMessage(emailStatus);
  if (!message) return null;

  function dismiss() {
    const url = new URL(window.location.href);
    url.searchParams.delete(orcidStatus ? "orcid" : "email");
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }

  return (
    <aside className="orcid-auth-feedback" role={orcidStatus === "cancelled" || emailStatus === "verified" ? "status" : "alert"} aria-live={orcidStatus === "cancelled" || emailStatus === "verified" ? "polite" : "assertive"} aria-atomic="true">
      <div>
        <span>Researcher sign-in</span>
        <strong>{message.title}</strong>
        <p>{message.detail}</p>
        {orcidStatus === "not_configured" || orcidStatus === "configuration_error" || orcidStatus === "token_error" || orcidStatus === "identity_error" ? <a href="/contact">Contact WikiBiome →</a> : null}
        {emailStatus === "expired" || emailStatus === "invalid" ? <a href="/researcher/dashboard">Request a new verification email →</a> : null}
      </div>
      <button type="button" onClick={dismiss} aria-label="Dismiss ORCID sign-in message">×</button>
    </aside>
  );
}

function emailMessage(status: string) {
  if (status === "verified") return { title: "Private email verified", detail: "Your researcher participation features are now available." };
  if (status === "expired") return { title: "Verification link expired", detail: "No account change was made. Request a fresh single-use link from your researcher dashboard." };
  if (status === "invalid") return { title: "Verification link unavailable", detail: "This link is invalid or has already been used. Request a replacement from your researcher dashboard." };
  return null;
}
