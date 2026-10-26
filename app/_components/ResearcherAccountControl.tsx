"use client";

import { useEffect, useState, type MouseEvent } from "react";

type AccountState = {
  account: { displayName: string; orcid: string };
  unreadNotifications: number;
};

export function ResearcherAccountControl() {
  const [account, setAccount] = useState<AccountState | null | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/account", { cache: "no-store", signal: controller.signal })
      .then(async (response) => response.status === 204 ? null : response.ok ? response.json() as Promise<AccountState> : null)
      .then((next) => {
        setAccount(next);
        if (next) void fetch("/api/researcher/works", { cache: "no-store" }).catch(() => undefined);
      })
      .catch(() => setAccount(null));
    return () => controller.abort();
  }, []);

  function preserveReturnTo(event: MouseEvent<HTMLAnchorElement>) {
    const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    event.currentTarget.href = `/api/auth/orcid/start?returnTo=${encodeURIComponent(returnTo)}`;
  }

  if (!account) {
    return <a className="orcid-account-login" href="/api/auth/orcid/start?returnTo=%2Fresearcher%2Fdashboard" onClick={preserveReturnTo}>Log in with ORCID</a>;
  }

  return (
    <details className="researcher-account-control">
      <summary aria-label={`Researcher account for ${account.account.displayName}`}>
        <span aria-hidden="true">iD</span><b>{account.account.displayName}</b>
        {account.unreadNotifications > 0 && <i aria-label={`${account.unreadNotifications} unread notifications`}>{Math.min(99, account.unreadNotifications)}</i>}
      </summary>
      <nav aria-label="Researcher account">
        <a href="/researcher/dashboard">Dashboard</a>
        <a href={`/researchers/${account.account.orcid}`}>Public profile</a>
        <a href="/researcher/works">Find my work</a>
        <a href="/researcher/proposals">Proposals</a>
        <a href="/researcher/notifications">Notifications{account.unreadNotifications > 0 ? ` (${account.unreadNotifications})` : ""}</a>
        <a href="/researcher/messages">Messages</a>
        <a href="/roundtable">Roundtable</a>
        <form action="/api/auth/orcid/signout" method="post"><button type="submit">Sign out</button></form>
      </nav>
    </details>
  );
}
