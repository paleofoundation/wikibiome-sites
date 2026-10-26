"use client";

import { OrcidLink } from "@/app/_components/OrcidLink";
import { useState, type FormEvent } from "react";

type Account = {
  displayName: string;
  orcid: string;
  biography: string;
  affiliations: string[];
  expertiseSelf: string[];
  messagingEnabled: boolean;
  email: string | null;
  emailVerified: boolean;
  preferences: { researchNotifications: boolean; communityDigest: boolean; fundraising: boolean };
};

export function ResearcherAccountForm({ account }: { account: Account }) {
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/account", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        biography: form.get("biography"),
        affiliations: form.get("affiliations"),
        expertise: form.get("expertise"),
        email: form.get("email"),
        researchNotifications: form.get("researchNotifications") === "on",
        communityDigest: form.get("communityDigest") === "on",
      }),
    });
    const result = await response.json() as { error?: string; verificationPending?: boolean; verificationUrl?: string; delivery?: { sent?: boolean; reason?: string }; emailStatus?: { maskedEmail?: string } };
    if (!response.ok) {
      setState("error");
      setMessage(result.error || "Your profile could not be saved.");
      return;
    }
    setState("saved");
    const masked = result.emailStatus?.maskedEmail || "your private address";
    if (!result.verificationPending) setMessage("Profile saved.");
    else if (result.delivery?.sent) setMessage(`Verification email sent to ${masked}.`);
    else if (result.delivery?.reason === "email_not_configured") setMessage(`Profile saved, but email delivery is not active yet. No message was sent to ${masked}.`);
    else if (result.delivery?.reason === "suppressed") setMessage(`${masked} is suppressed after an unsubscribe, bounce, or complaint. Change the address or contact privacy@wikibiome.com.`);
    else if (result.delivery?.reason === "provider_error") setMessage(`Profile saved, but the email provider could not accept a message for ${masked}. You can resend later.`);
    else setMessage(`Profile saved, but delivery was not attempted for ${masked}.`);
    if (result.verificationUrl) setMessage(`Profile saved. Development verification link: ${result.verificationUrl}`);
  }

  return (
    <form className="research-form account-form" onSubmit={submit}>
      <div className="research-form-grid">
        <label><span>Public name</span><input name="name" defaultValue={account.displayName} required maxLength={180} /></label>
        <div><span>Authenticated ORCID</span><OrcidLink orcid={account.orcid} name={account.displayName} /></div>
      </div>
      <label><span>Private contact email <small>{account.emailVerified ? "Verified · never displayed publicly" : "Verification required for claims, submissions, and discussions"}</small></span><input id="researcher-contact-email" name="email" type="email" defaultValue={account.email || ""} required autoComplete="email" /></label>
      <label><span>Public biography</span><textarea name="biography" defaultValue={account.biography} rows={5} maxLength={3000} /></label>
      <div className="research-form-grid">
        <label><span>Affiliations <small>One per line</small></span><textarea name="affiliations" defaultValue={account.affiliations.join("\n")} rows={5} /></label>
        <label><span>Self-declared expertise <small>One per line</small></span><textarea name="expertise" defaultValue={account.expertiseSelf.join("\n")} rows={5} /></label>
      </div>
      <fieldset className="consent-options"><legend>Email preferences</legend>
        <label><input type="checkbox" name="researchNotifications" defaultChecked={account.preferences.researchNotifications} /><span><b>Research activity</b> Replies, claim decisions, and editorial updates.</span></label>
        <label><input type="checkbox" name="communityDigest" defaultChecked={account.preferences.communityDigest} /><span><b>Community digest</b> An occasional summary of cross-disciplinary work.</span></label>
      </fieldset>
      <aside className="roundtable-invite"><b>Conferences and Microbiome Roundtables</b><p>Join the separate interest registry for early invitation consideration to future interdisciplinary events. This is not registration for a scheduled event.</p><a href="/roundtable">Choose event interests →</a></aside>
      <footer><p>Email choices are separate and can be changed here at any time. Historical fundraising consent is preserved but is not requested during researcher onboarding.</p><button disabled={state === "saving"}>{state === "saving" ? "Saving…" : account.emailVerified ? "Save profile" : "Save and verify email"}</button></footer>
      {message && <p className={`form-message ${state}`} role="status">{message}</p>}
    </form>
  );
}
