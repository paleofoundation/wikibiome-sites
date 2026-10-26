import { SEARCH_SOURCES } from "@/lib/search-observability.mjs";
import { assertSameOriginRequest } from "@/lib/research-network";

const pathPattern = /^\/(?:[a-z0-9][a-z0-9./_-]*)?$/;
const searchSources = new Set(SEARCH_SOURCES);
const metricNames = new Set(["CLS", "INP", "LCP"]);
const metricRatings = new Set(["good", "needs-improvement", "poor"]);
const navigationTypes = new Set(["navigate", "reload", "back-forward", "back-forward-cache", "prerender", "restore", "soft-navigation"]);

export async function POST(request: Request) {
  try {
    assertSameOriginRequest(request);
  } catch {
    return response(403);
  }

  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return response(403);

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 1024) return response(413);

  let payload: unknown;
  try {
    const body = await request.text();
    if (body.length > 1024) return response(413);
    payload = JSON.parse(body);
  } catch {
    return response(400);
  }

  const event = validate(payload);
  if (!event) return response(400);

  // WB-COST-KILL-1: the client collector is unmounted. Discard valid events
  // from already-open tabs without writing request or per-path metric logs.
  return response(204);
}

function validate(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const payload = value as Record<string, unknown>;
  if (payload.version !== 1 || typeof payload.path !== "string" || !pathPattern.test(payload.path) || payload.path.length > 240) return undefined;

  if (payload.event === "search_landing" && typeof payload.source === "string" && searchSources.has(payload.source)) {
    return { version: 1, event: "search_landing", path: payload.path, source: payload.source };
  }

  if (
    payload.event === "core_web_vital"
    && typeof payload.metric === "string"
    && metricNames.has(payload.metric)
    && typeof payload.value === "number"
    && Number.isFinite(payload.value)
    && payload.value >= 0
    && payload.value <= (payload.metric === "CLS" ? 10 : 120_000)
    && typeof payload.rating === "string"
    && metricRatings.has(payload.rating)
    && typeof payload.navigationType === "string"
    && navigationTypes.has(payload.navigationType)
  ) {
    return {
      version: 1,
      event: "core_web_vital",
      path: payload.path,
      metric: payload.metric,
      value: payload.value,
      rating: payload.rating,
      navigationType: payload.navigationType,
    };
  }

  return undefined;
}

function response(status: number) {
  return new Response(null, {
    status,
    headers: {
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
