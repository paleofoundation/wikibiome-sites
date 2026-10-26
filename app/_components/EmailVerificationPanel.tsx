"use client";

import { useState } from "react";

type EmailStatus = { maskedEmail: string; verified: boolean; delivery: { state: string; detail: string; reason?: string | null } };

export function EmailVerificationPanel({ initialStatus }: { initialStatus: EmailStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState("");

  async function resend() {
    setWorking(true);
    setMessage("");
    const response = await fetch("/api/account/email/resend", { method: "POST" });
    const result = await response.json() as { error?: string; delivery?: { sent?: boolean; reason?: string }; emailStatus?: EmailStatus; verificationUrl?: string };
    setWorking(false);
    if (!response.ok) { setMessage(result.error || "Verification could not be requested."); return; }
    if (result.emailStatus) setStatus(result.emailStatus);
    if (result.delivery?.sent) setMessage(`Verification email sent to ${result.emailStatus?.maskedEmail || status.maskedEmail}.`);
    else if (result.delivery?.reason === "email_not_configured") setMessage("Email delivery is not active. No message was sent; your address remains saved.");
    else if (result.delivery?.reason === "provider_error") setMessage("The provider could not accept the message. Try again later or change the address.");
    else if (result.delivery?.reason === "suppressed") setMessage("This address is suppressed. Change it or contact privacy@wikibiome.com.");
    else setMessage("No verification message was sent.");
    if (result.verificationUrl) setMessage(`Development verification link: ${result.verificationUrl}`);
  }

  if (status.verified) return <aside className="verification-panel verified"><span aria-hidden="true">✓</span><div><b>Private email verified</b><p>{status.maskedEmail} is ready for researcher participation.</p></div></aside>;
  return <aside className={`verification-panel ${status.delivery.state}`}><span aria-hidden="true">!</span><div><b>Email verification required</b><p>{status.delivery.detail}{status.maskedEmail ? ` Destination: ${status.maskedEmail}.` : ""}</p><footer><button type="button" disabled={working || !status.maskedEmail} onClick={resend}>{working ? "Requesting…" : "Resend verification"}</button><a href="#researcher-contact-email">Change address</a></footer>{message && <p className="form-message" role="status">{message}</p>}</div></aside>;
}
