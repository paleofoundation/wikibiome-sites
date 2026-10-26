import { OrcidLink } from "@/app/_components/OrcidLink";
import { appointed } from "@/lib/paper-intake";
import type { Metadata } from "next";
import Link from "@/app/_components/NativeLink";
import { InstitutionBatchForm } from "@/app/_components/InstitutionBatchForm";
import { ResearcherAssociationsForm } from "@/app/_components/ResearcherAssociationsForm";
import { ResearcherAccountForm } from "@/app/_components/ResearcherAccountForm";
import { ResearcherPhotoForm } from "@/app/_components/ResearcherPhotoForm";
import { EmailVerificationPanel } from "@/app/_components/EmailVerificationPanel";
import { DashboardOrcidWorks } from "@/app/_components/DashboardOrcidWorks";
import { ResearcherWorkspaceNav } from "@/app/_components/ResearcherWorkspaceNav";
import { WikiHeader } from "@/app/_components/WikiArticle";
import { getResearcherSession, isModeratorRole, listClaimsForAccount, listInstitutionAccess, listWorkSubmissions } from "@/lib/research-network";
import { getEmailVerificationStatus, unreadNotificationCount } from "@/lib/research-network-v2";
import { findPagesUsingSource, getSource } from "@/lib/wikibiome";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Researcher dashboard — WikiBiome", robots: { index: false, follow: false } };

export default async function ResearcherDashboardPage() {
  const account = await getResearcherSession();
  if (!account) return <><WikiHeader /><main className="research-gate"><span>Researcher account</span><h1>Connect your ORCID iD.</h1><p>ORCID establishes researcher identity. WikiBiome then asks you to verify a separate private email before you can claim, post, or submit.</p><a href="/api/auth/orcid/start?returnTo=/researcher/dashboard">Continue with ORCID</a><small>Existing ChatGPT contribution history is linked when the identities are connected.</small></main></>;

  const [claims, submissions, institutionAccess, emailStatus, unread] = await Promise.all([listClaimsForAccount(account.accountId), listWorkSubmissions(account.accountId), listInstitutionAccess(account.accountId), getEmailVerificationStatus(account.accountId), unreadNotificationCount(account.accountId)]);
  const canReview = isModeratorRole(account.role) || await appointed(account.accountId).catch(() => false);
  const verifiedClaims = claims.filter((claim) => claim.status === "verified");
  const placements = new Set(verifiedClaims.flatMap((claim) => findPagesUsingSource(claim.sourceId, 500).map((page) => page.id))).size;
  const keystoneWorks = verifiedClaims.filter((claim) => getSource(claim.sourceId)?.keystone).length;
  const readiness = [account.emailVerified, account.photoAvailable, Boolean(account.biography), account.expertiseSelf.length > 0, verifiedClaims.length > 0];
  const readinessCount = readiness.filter(Boolean).length;
  return (
    <><WikiHeader /><main className="research-dashboard"><header><div><span>Researcher workspace</span><h1>{account.displayName}</h1><p><OrcidLink orcid={account.orcid} name={account.displayName} /> · {account.emailVerified ? "Private email verified" : "Email verification required"}</p></div><nav><Link href="/submit-work">Submit work</Link>{canReview && <Link href="/researcher/review">Review work</Link>}<Link href={`/researchers/${account.orcid}`}>Public profile</Link>{isModeratorRole(account.role) && <Link href="/researcher/moderation">Moderation</Link>}<form action="/api/auth/orcid/signout" method="post"><button>Sign out</button></form></nav></header>
      <ResearcherWorkspaceNav active="dashboard" unread={unread}/>
      <EmailVerificationPanel initialStatus={emailStatus}/>
      <DashboardOrcidWorks />
      <section className="research-impact"><article><span>Verified works</span><strong>{verifiedClaims.length}</strong><small>{claims.length - verifiedClaims.length} awaiting review</small></article><article><span>Keystone works</span><strong>{keystoneWorks}</strong><small>Separate from contribution recognition</small></article><article><span>WikiBiome articles</span><strong>{placements}</strong><small>Unique pages supported by verified work</small></article><article><span>Profile readiness</span><strong>{readinessCount}/5</strong><small>Useful identity and evidence fields</small></article></section>
      <section className="researcher-next-steps" aria-labelledby="next-steps-title">
        <header>
          <span className="next-steps-eyebrow">Your researcher profile</span>
          <h2 id="next-steps-title">Next useful steps</h2>
          <p>A few details help collaborators find you and connect with your work.</p>
        </header>
        <ol>
          {[
            { title: "Private email", complete: account.emailVerified, detail: account.emailVerified ? "Verified and ready for participation" : "Verify your email to claim, submit, and discuss work.", href: "#researcher-contact-email", action: "Verify email" },
            { title: "Profile photo", complete: account.photoAvailable, detail: account.photoAvailable ? "Visible on your public profile" : "Help collaborators recognize you.", href: "#researcher-profile-photo", action: "Add photo" },
            { title: "Verified work", complete: verifiedClaims.length > 0, detail: verifiedClaims.length ? `${verifiedClaims.length} verified work${verifiedClaims.length === 1 ? "" : "s"} connected` : "Connect publications from your public ORCID record.", href: "/researcher/works", action: "Review works", alwaysAction: true },
            { title: "Organization", complete: institutionAccess.some((item) => item.status === "approved"), detail: institutionAccess.length ? `${institutionAccess.length} relationship request${institutionAccess.length === 1 ? "" : "s"} · view status` : "Add an affiliation. An ROR identifier is optional.", href: "/institutions", action: "View organizations", alwaysAction: true },
          ].map((step, index) => (
            <li key={step.title} className={step.complete ? "complete" : ""}>
              <span className="next-step-marker" aria-hidden="true">{step.complete ? "✓" : String(index + 1).padStart(2, "0")}</span>
              <div className="next-step-copy"><h3>{step.title}{step.complete && <span className="sr-only"> — Complete</span>}</h3><p>{step.detail}</p></div>
              {step.alwaysAction || !step.complete ? <Link className="next-step-action" href={step.href}>{step.action}<span aria-hidden="true">↗</span></Link> : <span className="next-step-status">Complete</span>}
            </li>
          ))}
        </ol>
      </section>
      <section className="dashboard-columns"><div><h2>Profile and private contact</h2><ResearcherPhotoForm orcid={account.orcid} name={account.displayName} initialPhotoAvailable={account.photoAvailable} initialPhotoAlt={account.photoAlt} initialPhotoUpdatedAt={account.photoUpdatedAt}/><ResearcherAssociationsForm associations={account.associations} /><ResearcherAccountForm account={account} /><InstitutionBatchForm access={institutionAccess} /></div><aside><section><header><h2>Claims</h2><Link href="/researcher/works">Find my work</Link></header>{claims.length ? claims.map((claim) => { const source = getSource(claim.sourceId); return <Link className="dashboard-record" href={`/source/${claim.sourceId}/claim`} key={claim.id}><span>{claim.status}{source?.keystone ? " · Keystone" : ""}</span><b>{source?.title || claim.sourceId}</b><small>{findPagesUsingSource(claim.sourceId).length} WikiBiome placements</small></Link>; }) : <p>No work claimed yet. Search by paper title, author, DOI, journal, or year—or compare public ORCID works automatically.</p>}</section><section><header><h2>Proposals</h2><Link href="/propose">Suggest content</Link></header><p>Propose new pages, sections, cross-page connections, and framework corrections anchored in microbiome or metallomics.</p></section><section><header><h2>Organizations</h2><Link href="/institutions">Request free profile</Link></header>{institutionAccess.length ? institutionAccess.map((item) => <div className="dashboard-record" key={item.id}><span>{item.status}</span><b>{item.institution.name}</b><small>{item.role.replaceAll("_", " ")}{item.domainVerified ? " · domain verified" : " · manual verification available"}</small></div>) : <p>No organization relationships yet. ROR is preferred but not required.</p>}</section><section><header><h2>Submissions</h2><Link href="/submit-work">Add work</Link></header>{submissions.length ? submissions.map((item) => <div className="dashboard-record" key={item.id}><span>{item.status.replaceAll("_", " ")}</span><b>{item.title}</b><small>{item.identifierType.toUpperCase()} · {item.identifierValue}</small></div>) : <p>No additional work submitted yet.</p>}</section></aside></section>
    </main></>
  );
}
