"use client";

import { useEffect } from "react";
import { onCLS, onINP, onLCP, type Metric } from "web-vitals";
import { classifySearchReferrer } from "@/lib/search-observability.mjs";

const CORE_WEB_VITAL_SAMPLE_RATE = 0.1;

function send(payload: Record<string, unknown>) {
  const body = JSON.stringify({ version: 1, path: window.location.pathname, ...payload });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/search-observability", new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch("/api/search-observability", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
  });
}

function reportVital(metric: Metric) {
  send({
    event: "core_web_vital",
    metric: metric.name,
    value: Number(metric.value.toFixed(metric.name === "CLS" ? 4 : 0)),
    rating: metric.rating,
    navigationType: metric.navigationType,
  });
}

export function SearchObservability() {
  useEffect(() => {
    const source = classifySearchReferrer(document.referrer);
    if (source) send({ event: "search_landing", source });

    if (Math.random() > CORE_WEB_VITAL_SAMPLE_RATE) return;
    onCLS(reportVital);
    onINP(reportVital);
    onLCP(reportVital);
  }, []);

  return null;
}
