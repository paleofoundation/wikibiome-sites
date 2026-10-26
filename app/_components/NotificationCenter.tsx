"use client";

import { useState } from "react";

type Notification = { id: string; kind: string; title: string; body: string; href: string; readAt: string | null; createdAt: string };

export function NotificationCenter({ initial, initialNextCursor = null }: { initial: Notification[]; initialNextCursor?: string | null }) {
  const [items, setItems] = useState(initial);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [message, setMessage] = useState("");
  async function markAll() {
    const response = await fetch("/api/researcher/notifications", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({}) });
    if (!response.ok) { setMessage("Notifications could not be marked read."); return; }
    const now = new Date().toISOString(); setItems((rows) => rows.map((item) => ({ ...item, readAt: item.readAt || now }))); setMessage("All notifications marked read.");
  }
  async function loadOlder() {
    if (!nextCursor) return;
    const response = await fetch(`/api/researcher/notifications?before=${encodeURIComponent(nextCursor)}`, { cache: "no-store" });
    const result = await response.json() as { notifications?: Notification[]; nextCursor?: string | null };
    if (!response.ok) { setMessage("Older notifications could not be loaded."); return; }
    setItems((current) => [...current, ...(result.notifications || [])]);
    setNextCursor(result.nextCursor || null);
  }
  return <section className="notification-center"><header><div><span>Research activity</span><h2>Notifications</h2><p>Replies, proposal comments and decisions, claim decisions, submission decisions, contact requests, and messages appear here.</p></div><button onClick={markAll} disabled={!items.some((item) => !item.readAt)}>Mark all read</button></header>{items.length ? items.map((item) => <a href={item.href} className={item.readAt ? "read" : "unread"} key={item.id}><span>{item.kind.replaceAll("_", " ")}</span><div><h3>{item.title}</h3>{item.body && <p>{item.body}</p>}<small>{formatDate(item.createdAt)}</small></div></a>) : <p className="empty-state">No notifications yet. Follow a page, source, thread, or researcher to build your activity feed.</p>}{nextCursor && <button className="secondary" type="button" onClick={loadOlder}>Load older notifications</button>}{message && <p className="form-message" role="status">{message}</p>}</section>;
}
function formatDate(value: string) { const date = new Date(value); return Number.isNaN(date.valueOf()) ? "" : new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(date); }
