"use client";

import { useState } from "react";

export function FollowButton({ targetType, targetId, initialFollowing, canFollow, returnTo }: { targetType: "article" | "source" | "thread" | "researcher"; targetId: string; initialFollowing: boolean; canFollow: boolean; returnTo?: string }) {
  const [following, setFollowing] = useState(initialFollowing);
  const [message, setMessage] = useState("");
  const loginReturnTo = returnTo || (targetType === "researcher" ? "/researchers" : `/${targetType}/${targetId}`);
  if (!canFollow) return <a className="follow-button" href={`/api/auth/orcid/start?returnTo=${encodeURIComponent(loginReturnTo)}`}>Log in to follow</a>;
  async function toggle() { const response = await fetch("/api/researcher/follows", { method: following ? "DELETE" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ targetType, targetId }) }); const result = await response.json() as { error?: string }; if (response.ok) { setFollowing(!following); setMessage(!following ? "Following" : "Not following"); } else setMessage(result.error || "Follow could not be updated."); }
  return <span className="follow-control"><button className="follow-button" type="button" aria-pressed={following} onClick={toggle}>{following ? "Following" : "Follow"}</button><span className="sr-only" role="status">{message}</span></span>;
}
