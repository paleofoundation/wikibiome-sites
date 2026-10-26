import { OrcidLink } from "@/app/_components/OrcidLink";
import Link from "@/app/_components/NativeLink";
import { FollowButton } from "@/app/_components/FollowButton";
import { getResearcherSession } from "@/lib/research-network";
import { getCollaborationSummary, listPageActivity } from "@/lib/research-network-v2";
import { PAGE_HISTORY_DESCRIPTION } from "@/lib/public-page-history-policy.mjs";
import { getRevisionHistory } from "@/lib/revisions";
import { getWikiPage } from "@/lib/wikibiome";
import type { RevisionEntry } from "@/lib/revisions";

export async function PageCollaborationBar({ targetType, targetId }: { targetType: "article" | "source"; targetId: string }) {
  const account = await getResearcherSession();
  const [summary, activity] = await Promise.all([getCollaborationSummary(targetType, targetId, account?.accountId), listPageActivity(targetType, targetId)]);
  const page = targetType === "article" ? getWikiPage(targetId) : null;
  const revisions = page ? getRevisionHistory(page).revisions : [];
  const changes = revisions.length + activity.filter(event => !revisions.some(revision => revision.hash === event.publishedCommit)).length;
  return <nav className="collaboration-bar" aria-label="Research collaboration"><a href="#discussion">Discussion <b>{summary.posts}</b></a><a href="#activity">Page changes <b>{changes}</b></a>{summary.unread > 0 && <span>{summary.unread} unread</span>}<FollowButton targetType={targetType} targetId={targetId} initialFollowing={summary.following} canFollow={Boolean(account?.emailVerified)}/>{targetType === "article" && <Link href={`/propose?target=${encodeURIComponent(targetId)}`}>Propose a change</Link>}</nav>;
}

export async function PageActivityTrail({ targetType, targetId, revisions = [], repository }: { targetType: "article" | "source"; targetId: string; revisions?: RevisionEntry[]; repository?: string }) {
  const activity = await listPageActivity(targetType, targetId);
  const events = [
    ...activity.filter(event => !revisions.some(revision => revision.hash === event.publishedCommit)),
    ...revisions.filter(revision => revision.materialChange === true).map((revision) => ({ id: `revision:${revision.hash}:${revision.path}`, kind: "published revision", accountId: "", title: revision.summary, detail: `${revision.description !== revision.summary ? `${revision.description} · ` : ""}${revision.author} · +${revision.additions} −${revision.deletions}`, createdAt: revision.date, href: `${repository}/commit/${revision.hash}`, researcher: null, external: true })),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return <section className="page-activity" id="activity" aria-labelledby={`activity-${targetType}-${targetId}`}><header><div><span>Transparent record</span><h2 id={`activity-${targetType}-${targetId}`}>Published page changes</h2><p>{PAGE_HISTORY_DESCRIPTION}</p></div><b>{events.length} changes</b></header>{events.length ? <ol>{events.map((event) => <li id={event.id.replaceAll(":", "-")} key={event.id}><time dateTime={event.createdAt}>{formatDate(event.createdAt)}</time><div><span>{event.kind}</span><h3>{event.title}</h3><p>{event.detail}</p>{event.researcher && <span className="researcher-identity"><Link href={`/researchers/${event.researcher.orcid}`}>{event.researcher.name}</Link><OrcidLink orcid={event.researcher.orcid} name={event.researcher.name} /></span>}{event.href.startsWith("http") ? <a href={event.href} target="_blank" rel="noreferrer">Inspect exact Git diff ↗</a> : <a href={event.href}>Open event</a>}</div></li>)}</ol> : <p className="empty-state">No material page changes have been recorded yet.</p>}</section>;
}

function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.valueOf()) ? "" : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date); }
