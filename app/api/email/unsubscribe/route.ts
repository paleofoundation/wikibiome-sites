import { suppressEmail } from "@/lib/research-network";
import { verifyUnsubscribeToken } from "@/lib/research-email";

async function unsubscribe(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email") || "";
  const token = url.searchParams.get("token") || "";
  if (!await verifyUnsubscribeToken(email, token)) return new Response("This unsubscribe link is invalid or expired.", { status: 400, headers: { "content-type": "text/plain; charset=utf-8" } });
  await suppressEmail(email, "recipient_unsubscribe");
  return Response.redirect(new URL("/privacy?email=unsubscribed", request.url), 303);
}

export async function GET(request: Request) { return unsubscribe(request); }
export async function POST(request: Request) { return unsubscribe(request); }
