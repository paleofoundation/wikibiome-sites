import { env } from "cloudflare:workers";
import { and, asc, eq, lte } from "drizzle-orm";
import { getDb } from "@/db";
import { emailWebhookEvents, notificationOutbox, suppressionList } from "@/db/schema";
import { cleanEmail, cleanText, sha256, suppressEmail } from "@/lib/research-network";

type NotificationPayload = {
  verificationUrl?: string;
  researcherName?: string;
  sourceTitle?: string;
  sourceUrl?: string;
  claimUrl?: string;
  unsubscribeUrl?: string;
  title?: string;
  body?: string;
  href?: string;
  events?: Array<{ title?: string; body?: string; href?: string }>;
};

export async function flushNotification(id: string) {
  const db = getDb();
  const message = (await db.select().from(notificationOutbox).where(eq(notificationOutbox.id, id)).limit(1))[0];
  if (!message || message.status !== "pending") return { sent: false, reason: "not_pending" };
  if (message.kind === "email_verification" && Date.now() - new Date(message.createdAt).valueOf() >= 24 * 60 * 60_000) {
    await db.update(notificationOutbox).set({ status: "failed", lastError: "verification_expired", updatedAt: new Date().toISOString() }).where(eq(notificationOutbox.id, id));
    return { sent: false, reason: "verification_expired" };
  }
  const blocked = (await db.select().from(suppressionList).where(eq(suppressionList.email, message.email)).limit(1))[0];
  if (blocked) {
    await db.update(notificationOutbox).set({ status: "suppressed", updatedAt: new Date().toISOString() }).where(eq(notificationOutbox.id, id));
    return { sent: false, reason: "suppressed" };
  }
  const runtime = env as unknown as Record<string, string | undefined>;
  if (!runtime.RESEND_API_KEY || !runtime.WIKIBIOME_EMAIL_FROM) return { sent: false, reason: "email_not_configured" };
  const payload = parsePayload(message.payloadJson);
  const publicOrigin = (runtime.WIKIBIOME_PUBLIC_ORIGIN || "https://www.wikibiome.com").replace(/\/$/, "");
  if (payload.href?.startsWith("/")) payload.href = `${publicOrigin}${payload.href}`;
  if (payload.events) payload.events = payload.events.map((event) => ({ ...event, href: event.href?.startsWith("/") ? `${publicOrigin}${event.href}` : event.href }));
  const content = renderNotification(message.kind, payload);
  const unsubscribe = await unsubscribeToken(message.email);
  const unsubscribeUrl = unsubscribe
    ? `${publicOrigin}/api/email/unsubscribe?email=${encodeURIComponent(message.email)}&token=${encodeURIComponent(unsubscribe)}`
    : "";
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${runtime.RESEND_API_KEY}`,
        "content-type": "application/json",
        "idempotency-key": message.id,
      },
      body: JSON.stringify({
        from: runtime.WIKIBIOME_EMAIL_FROM,
        reply_to: runtime.WIKIBIOME_EMAIL_REPLY_TO || "hello@wikibiome.com",
        to: [message.email],
        subject: content.subject,
        html: content.html,
        text: content.text,
        ...(unsubscribeUrl ? { headers: { "List-Unsubscribe": `<${unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } } : {}),
      }),
    });
    const result = await response.json().catch(() => ({})) as { id?: string; message?: string };
    if (!response.ok || !result.id) throw new Error(result.message || `Email provider returned ${response.status}.`);
    await db.update(notificationOutbox).set({ status: "sent", providerId: result.id, attempts: message.attempts + 1, lastError: null, updatedAt: new Date().toISOString() }).where(eq(notificationOutbox.id, id));
    return { sent: true, providerId: result.id };
  } catch (error) {
    await db.update(notificationOutbox).set({ status: "failed", attempts: message.attempts + 1, lastError: error instanceof Error ? error.message.slice(0, 1000) : "Email delivery failed.", updatedAt: new Date().toISOString() }).where(eq(notificationOutbox.id, id));
    return { sent: false, reason: "provider_error" };
  }
}

export async function flushPendingNotifications(limit = 20) {
  const messages = await getDb().select().from(notificationOutbox).where(and(eq(notificationOutbox.status, "pending"), lte(notificationOutbox.scheduledAt, new Date().toISOString()))).orderBy(asc(notificationOutbox.scheduledAt)).limit(Math.max(1, Math.min(100, Math.trunc(limit))));
  const results = [];
  for (const message of messages) results.push(await flushNotification(message.id));
  return results;
}

export async function verifyResendWebhook(request: Request, rawBody: string) {
  const runtime = env as unknown as Record<string, string | undefined>;
  const secret = runtime.RESEND_WEBHOOK_SECRET;
  if (!secret) return false;
  const messageId = request.headers.get("svix-id") ?? "";
  const timestamp = request.headers.get("svix-timestamp") ?? "";
  const signatures = request.headers.get("svix-signature") ?? "";
  if (!messageId || !timestamp || !signatures) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 5 * 60) return false;
  const key = decodeSecret(secret.replace(/^whsec_/, ""));
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(`${messageId}.${timestamp}.${rawBody}`));
  const expected = bytesToBase64(new Uint8Array(signature));
  return signatures.split(" ").some((candidate) => candidate.replace(/^v1,/, "") === expected);
}

export async function applyResendEvent(payload: Record<string, unknown>, eventIdValue?: string) {
  const type = cleanText(payload.type, 80);
  const data = (payload.data && typeof payload.data === "object" ? payload.data : {}) as Record<string, unknown>;
  const recipients = Array.isArray(data.to) ? data.to.map(cleanEmail).filter(Boolean) : [];
  const providerId = cleanText(data.email_id || data.id, 200);
  const eventId = cleanText(eventIdValue || payload.id, 200);
  if (eventId) {
    const inserted = await getDb().insert(emailWebhookEvents).values({ id: crypto.randomUUID(), providerId: eventId, eventType: type }).onConflictDoNothing().returning({ id: emailWebhookEvents.id });
    if (!inserted.length) return { type, recipients: [], replayed: true };
  }
  if (providerId) {
    const status = type === "email.delivered" ? "delivered" : type === "email.bounced" ? "bounced" : type === "email.complained" ? "complained" : "sent";
    await getDb().update(notificationOutbox).set({ status, updatedAt: new Date().toISOString() }).where(eq(notificationOutbox.providerId, providerId));
  }
  if (type === "email.bounced" || type === "email.complained") {
    for (const email of recipients) await suppressEmail(email, type === "email.bounced" ? "provider_bounce" : "provider_complaint");
  }
  return { type, recipients, replayed: false };
}

export async function unsubscribeToken(email: string) {
  const runtime = env as unknown as Record<string, string | undefined>;
  const secret = runtime.WIKIBIOME_UNSUBSCRIBE_SECRET;
  if (!secret) return "";
  return sha256(`${cleanEmail(email)}:${secret}`);
}

export async function verifyUnsubscribeToken(email: string, token: string) {
  const expected = await unsubscribeToken(email);
  return expected && timingSafeEqual(expected, token);
}

function renderNotification(kind: string, payload: NotificationPayload) {
  if (kind === "email_verification") {
    const name = escapeHtml(payload.researcherName || "researcher");
    const url = safeHref(payload.verificationUrl);
    return {
      subject: "Verify your private email for WikiBiome",
      text: `Hello ${payload.researcherName || "researcher"},\n\nVerify your private email for WikiBiome: ${payload.verificationUrl}\n\nThis verifies your contact address only. It does not subscribe you to fundraising messages.`,
      html: `<p>Hello ${name},</p><p>Verify your private email to claim work, submit research, and participate in WikiBiome discussions.</p><p><a href="${url}">Verify email</a></p><p><small>This verifies your contact address only. It does not subscribe you to fundraising messages.</small></p>`,
    };
  }
  if (kind === "citation_notice") {
    const title = escapeHtml(payload.sourceTitle || "your research");
    return {
      subject: "Your work is cited on WikiBiome",
      text: `WikiBiome cites “${payload.sourceTitle || "your research"}”. Review where it appears: ${payload.sourceUrl}\n\nIf you are an author, you can claim it and tell the editorial team whether the representation is accurate: ${payload.claimUrl}\n\nThis is a one-time citation notice. It contains no fundraising request. Opt out: ${payload.unsubscribeUrl}`,
      html: `<p>WikiBiome cites <strong>${title}</strong>.</p><p><a href="${safeHref(payload.sourceUrl)}">Review where the work appears</a>.</p><p>If you are an author, you can <a href="${safeHref(payload.claimUrl)}">claim the work and review its representation</a>.</p><p><small>This is a one-time factual citation notice. It contains no fundraising request. <a href="${safeHref(payload.unsubscribeUrl)}">Do not contact me again</a>.</small></p>`,
    };
  }
  if (kind === "research_activity") {
    const title = escapeHtml(payload.title || "WikiBiome research activity");
    const body = escapeHtml(payload.body || "There is new activity in your WikiBiome research network.");
    const href = safeHref(payload.href);
    return {
      subject: payload.title || "WikiBiome research activity",
      text: `${payload.title || "WikiBiome research activity"}\n\n${payload.body || "There is new activity in your WikiBiome research network."}\n\nOpen WikiBiome: ${payload.href || "https://www.wikibiome.com/researcher/notifications"}`,
      html: `<p><strong>${title}</strong></p><p>${body}</p><p><a href="${href}">Open WikiBiome</a></p><p><small>You receive research activity email only because you enabled that separate preference. Change it from your researcher dashboard.</small></p>`,
    };
  }
  if (kind === "research_activity_digest") {
    const events = (payload.events || []).slice(0, 50);
    const textItems = events.map((event) => `• ${event.title || "WikiBiome activity"}\n  ${event.body || ""}\n  ${event.href || "https://www.wikibiome.com/researcher/notifications"}`);
    const htmlItems = events.map((event) => `<li><strong>${escapeHtml(event.title || "WikiBiome activity")}</strong>${event.body ? `<p>${escapeHtml(event.body)}</p>` : ""}<a href="${safeHref(event.href)}">Open activity</a></li>`).join("");
    return {
      subject: `WikiBiome research digest${events.length ? ` · ${events.length} update${events.length === 1 ? "" : "s"}` : ""}`,
      text: `Your WikiBiome research digest\n\n${textItems.join("\n\n")}\n\nChange research-email preferences from your dashboard.`,
      html: `<p><strong>Your WikiBiome research digest</strong></p><ul>${htmlItems}</ul><p><small>You receive this digest only because you enabled research notifications. Change the preference from your researcher dashboard.</small></p>`,
    };
  }
  throw new Error(`Unsupported notification kind: ${kind}`);
}

function parsePayload(value: string): NotificationPayload {
  try { return JSON.parse(value) as NotificationPayload; } catch { return {}; }
}

function safeHref(value: string | undefined) {
  if (!value) return "#";
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? escapeHtml(url.toString()) : "#";
  } catch {
    return "#";
  }
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

function decodeSecret(value: string) {
  const binary = atob(value.replaceAll("-", "+").replaceAll("_", "/"));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function bytesToBase64(data: Uint8Array) {
  let binary = "";
  for (const byte of data) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let difference = 0;
  for (let index = 0; index < a.length; index += 1) difference |= a.charCodeAt(index) ^ b.charCodeAt(index);
  return difference === 0;
}
