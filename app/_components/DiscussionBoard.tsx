"use client";

import { OrcidLink } from "@/app/_components/OrcidLink";
import { useState, type FormEvent } from "react";
import { FollowButton } from "@/app/_components/FollowButton";

type Researcher = { orcid: string; name: string; affiliations: string[]; role: string };
type Post = { id: string; accountId: string; body: string; sourceUrl: string | null; conflictDisclosure: string; revision: number; createdAt: string; revisions?: Array<{ id: string; revision: number; body: string; sourceUrl: string | null; createdAt: string }> };
type Thread = { id: string; title: string; category: string; createdByAccountId: string; createdAt: string };
type Discussion = { thread: Thread; posts: Post[]; people: Record<string, Researcher>; following: boolean };

export function DiscussionBoard({ targetType, targetId, viewer, initialDiscussions }: { targetType: "article" | "source" | "proposal"; targetId: string; viewer?: { signedIn: boolean; emailVerified: boolean; accountId?: string }; initialDiscussions: Discussion[] }) {
  const [discussions, setDiscussions] = useState<Discussion[]>(initialDiscussions);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function refresh() {
    const response = await fetch(`/api/discussions?targetType=${targetType}&targetId=${encodeURIComponent(targetId)}`);
    const result = await response.json() as { discussions?: Discussion[] };
    setDiscussions(result.discussions || []);
  }

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/discussions", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ targetType, targetId, title: form.get("title"), category: form.get("category"), body: form.get("body"), sourceUrl: form.get("sourceUrl"), conflictDisclosure: form.get("conflictDisclosure") }) });
    const result = await response.json() as { status?: string; error?: string };
    if (!response.ok) { setState("error"); setMessage(result.error || "The discussion could not be created."); return; }
    setState("saved");
    setMessage(result.status === "pending" ? "Submitted to the new-researcher moderation queue." : "Discussion published.");
    event.currentTarget.reset();
    await refresh();
  }

  async function reply(event: FormEvent<HTMLFormElement>, threadId: string) {
    event.preventDefault();
    setState("saving");
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/discussions/${threadId}/posts`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ body: form.get("body"), sourceUrl: form.get("sourceUrl"), conflictDisclosure: form.get("conflictDisclosure") }) });
    const result = await response.json() as { status?: string; error?: string };
    if (!response.ok) { setState("error"); setMessage(result.error || "The reply could not be posted."); return; }
    setState("saved");
    setMessage(result.status === "pending" ? "Reply submitted for moderation." : "Reply published.");
    event.currentTarget.reset();
    await refresh();
  }

  async function report(event: FormEvent<HTMLFormElement>, postId: string) {
    event.preventDefault();
    setState("saving");
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/discussions/posts/${postId}/report`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reason: form.get("reason") }) });
    const result = await response.json() as { error?: string };
    if (!response.ok) { setState("error"); setMessage(result.error || "The report could not be submitted."); return; }
    setState("saved");
    setMessage("Report submitted to the moderation queue.");
    event.currentTarget.reset();
  }

  async function edit(event: FormEvent<HTMLFormElement>, postId: string) {
    event.preventDefault(); setState("saving");
    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/discussions/posts/${postId}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ body: form.get("body"), sourceUrl: form.get("sourceUrl"), conflictDisclosure: form.get("conflictDisclosure") }) });
    const result = await response.json() as { error?: string };
    if (!response.ok) { setState("error"); setMessage(result.error || "The post could not be edited."); return; }
    setState("saved"); setMessage("Post updated. The previous version remains in immutable revision history."); await refresh();
  }

  async function block(orcid: string, blockedAccountId: string) {
    const response = await fetch(`/api/researchers/${encodeURIComponent(orcid)}/block`, { method: "POST" });
    const result = await response.json() as { error?: string };
    if (!response.ok) { setState("error"); setMessage(result.error || "The researcher could not be blocked."); return; }
    setDiscussions((current) => current
      .filter((item) => item.thread.createdByAccountId !== blockedAccountId)
      .map((item) => ({ ...item, posts: item.posts.filter((post) => post.accountId !== blockedAccountId) })));
    setState("saved");
    setMessage("Researcher blocked. Their discussions and posts are hidden from your signed-in view.");
  }

  return (
    <section className="discussion-board" id="discussion" aria-labelledby={`discussion-${targetType}-${targetId}`}>
      <header><div><span>Researcher discussion</span><h2 id={`discussion-${targetType}-${targetId}`}>Connect the evidence</h2><p>Publicly readable discussion by ORCID-authenticated researchers. Questions, interpretation, methods, corrections, and new evidence stay attached to this record.</p></div><b>{discussions.reduce((total, item) => total + item.posts.length, 0)} posts</b></header>
      <div className="discussion-list">
        {!discussions.length && <p className="discussion-empty">No discussion yet. Start with a precise question or a source-backed observation.</p>}
        {discussions.map(({ thread, posts, people, following }) => (
          <article className="discussion-thread" key={thread.id}>
            <header><span>{thread.category.replaceAll("_", " ")}</span><h3>{thread.title}</h3><small>{formatDate(thread.createdAt)}</small><FollowButton targetType="thread" targetId={thread.id} initialFollowing={following} canFollow={Boolean(viewer?.emailVerified)}/></header>
            <div>{posts.map((post) => { const person = people[post.accountId]; return <section className="discussion-post" key={post.id}><aside><b>{person?.name || "Verified researcher"}</b>{person?.orcid && <OrcidLink orcid={person.orcid} name={person.name} />}<small>{person?.affiliations?.[0] || "Affiliation not listed"}</small>{viewer?.emailVerified && person?.orcid && post.accountId !== viewer.accountId && <button className="discussion-block" type="button" onClick={() => block(person.orcid, post.accountId)}>Block researcher</button>}</aside><div><p>{post.body}</p>{post.sourceUrl && <a href={post.sourceUrl} target="_blank" rel="noreferrer">Supporting source ↗</a>}{post.conflictDisclosure && <small>Disclosure: {post.conflictDisclosure}</small>}{post.revision > 1 && <details className="discussion-revisions"><summary>Edited · {post.revision} immutable revisions</summary><ol>{post.revisions?.map((revision) => <li key={revision.id}><small>Revision {revision.revision} · {formatDate(revision.createdAt)}</small><p>{revision.body}</p></li>)}</ol></details>}{viewer?.accountId === post.accountId && <details className="discussion-edit"><summary>Edit your post</summary><form onSubmit={(event) => edit(event, post.id)}><textarea name="body" rows={4} required defaultValue={post.body}/><input name="sourceUrl" required={thread.category !== "question"} defaultValue={post.sourceUrl || ""} placeholder={thread.category === "question" ? "Supporting DOI, PMID, or URL (optional)" : "Supporting DOI, PMID, or URL (required)"}/><input name="conflictDisclosure" defaultValue={post.conflictDisclosure} placeholder="Conflict disclosure"/><button disabled={state === "saving"}>Save revision</button></form></details>}{viewer?.emailVerified && post.accountId !== viewer.accountId && <details className="discussion-report"><summary>Report this post</summary><form onSubmit={(event) => report(event, post.id)}><textarea name="reason" rows={2} required placeholder="Explain the safety, evidence, identity, or conduct concern." /><button disabled={state === "saving"}>Send report</button></form></details>}</div></section>; })}</div>
            {viewer?.emailVerified && <details className="discussion-reply"><summary>Reply to this discussion</summary><form onSubmit={(event) => reply(event, thread.id)}><textarea name="body" rows={4} required placeholder="Add a focused, collegial response." /><input name="sourceUrl" required={thread.category !== "question"} placeholder={thread.category === "question" ? "Supporting DOI, PMID, or URL (optional)" : "Supporting DOI, PMID, or URL (required)"} /><input name="conflictDisclosure" placeholder="Relevant conflict-of-interest disclosure" /><button disabled={state === "saving"}>Post reply</button></form></details>}
          </article>
        ))}
      </div>
      {viewer?.emailVerified ? (
        <details className="discussion-create"><summary>Start a discussion topic</summary><form className="research-form" onSubmit={create}><div className="research-form-grid"><label><span>Category</span><select name="category"><option value="question">Question</option><option value="interpretation">Interpretation</option><option value="methodology">Methodology</option><option value="new_evidence">New evidence</option><option value="correction">Correction</option></select></label><label><span>Topic title</span><input name="title" required maxLength={240} /></label></div><label><span>Opening post</span><textarea name="body" rows={6} required /></label><label><span>DOI, PMID, or source URL <small>Required except for questions</small></span><input name="sourceUrl" /></label><label><span>Conflict-of-interest disclosure</span><input name="conflictDisclosure" /></label><footer><p>New researchers are premoderated until three posts are approved, which records promotion to trusted contributor.</p><button disabled={state === "saving"}>Start topic</button></footer></form></details>
      ) : (
        <aside className="discussion-signin"><b>{viewer?.signedIn ? "Verify your email to participate" : "Researchers participate with ORCID"}</b><p>Reading is open to everyone. Posting requires an authenticated ORCID iD and a private, verified email.</p><a href={viewer?.signedIn ? "/researcher/dashboard" : `/api/auth/orcid/start?returnTo=${encodeURIComponent(targetType === "proposal" ? `/proposals/${targetId}#discussion` : `/${targetType}/${targetId}#discussion`)}`}>{viewer?.signedIn ? "Complete researcher profile" : "Connect ORCID"} →</a></aside>
      )}
      {message && <p className={`form-message ${state}`} role="status">{message}</p>}
    </section>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "" : new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}
