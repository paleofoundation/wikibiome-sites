import { WorkflowEntrypoint } from "cloudflare:workers";
import { Container } from "@cloudflare/containers";
import {
  extractionSchema,
  extractionInstructions,
  rankCandidates,
  responsePacket,
} from "./extraction.mjs";
const hash = async (text) =>
  [
    ...new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)),
    ),
  ]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
async function auth(request, expected) {
  if (!expected || expected.length < 32) return false;
  return (
    (await hash(request.headers.get("authorization") || "")) ===
    (await hash(`Bearer ${expected}`))
  );
}
export class PaperParser extends Container {
  defaultPort = 8080;
  sleepAfter = "5m";
}
async function site(env, path, options = {}) {
  const response = await fetch(new URL(path, env.SITE_ORIGIN), {
    ...options,
    headers: {
      authorization: `Bearer ${env.BRIDGE_SECRET}`,
      ...options.headers,
    },
    redirect: "error",
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok)
    throw new Error(`Site intake request failed (${response.status}).`);
  return response;
}
export class PaperWorkflow extends WorkflowEntrypoint {
  async run(event, step) {
    const job = event.payload;
    let info;
    let scanStatus = "scan_failed";
    try {
      info = await step.do("read-intake", async () =>
        (
          await site(
            this.env,
            `/api/paper-intake/bridge?id=${encodeURIComponent(job.id)}`,
          )
        ).json(),
      );
      if (info.hash !== job.hash || info.revision !== job.revision)
        throw new Error("Stale intake job.");
      const extraction = await step.do(
        "scan-and-extract",
        {
          retries: { limit: 2, delay: "20 seconds", backoff: "exponential" },
          timeout: "10 minutes",
        },
        async () => {
          const pdf = await site(
            this.env,
            `/api/paper-intake/bridge?id=${encodeURIComponent(job.id)}&file=1`,
          );
          const parser = this.env.PARSER.getByName(job.hash.slice(0, 2));
          const result = await parser.fetch(
            new Request("http://parser/extract", {
              method: "POST",
              headers: {
                "content-type": "application/pdf",
                "x-document-sha256": job.hash,
                "content-length": pdf.headers.get("content-length") || "",
              },
              body: pdf.body,
            }),
          );
          if (!result.ok)
            throw new Error(`Private parser unavailable (${result.status}).`);
          return result.json();
        },
      );
      scanStatus = extraction.scanStatus;
      if (scanStatus !== "clean")
        throw new Error(
          extraction.error || "The document did not pass scanning.",
        );
      const packet = await step.do(
        "extract-evidence",
        {
          retries: { limit: 2, delay: "30 seconds", backoff: "exponential" },
          timeout: "10 minutes",
        },
        async () => {
          if (!this.env.OPENAI_API_KEY || !this.env.OPENAI_MODEL)
            throw new Error("AI extraction is not configured.");
          const { pages } = await (
            await site(this.env, "/api/paper-intake/corpus")
          ).json();
          const candidates = rankCandidates(
            pages,
            info.metadata,
            info.topic,
            extraction.pages.map((p) => p.text).join("\n"),
          );
          const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
              authorization: `Bearer ${this.env.OPENAI_API_KEY}`,
              "content-type": "application/json",
            },
            body: JSON.stringify({
              model: this.env.OPENAI_MODEL,
              store: false,
              max_output_tokens: 16000,
              input: [
                { role: "system", content: extractionInstructions },
                {
                  role: "user",
                  content: JSON.stringify({
                    metadata: info.metadata,
                    topic: info.topic,
                    pages: extraction.pages,
                    candidates,
                  }),
                },
              ],
              text: {
                format: {
                  type: "json_schema",
                  name: "paper_evidence_packet",
                  strict: true,
                  schema: extractionSchema,
                },
              },
            }),
            signal: AbortSignal.timeout(540000),
          });
          if (!response.ok)
            throw new Error(`AI extraction unavailable (${response.status}).`);
          const packet = responsePacket(await response.json());
          packet.provenance = {
            mode: "automated_extraction",
            documentHash: job.hash,
            pageCount: extraction.pages.length,
            scanStatus: "clean",
            model: this.env.OPENAI_MODEL,
            parserVersion: extraction.parserVersion,
          };
          return packet;
        },
      );
      await step.do(
        "deliver-review-packet",
        { retries: { limit: 5, delay: "30 seconds", backoff: "exponential" } },
        async () => {
          const resultId = await hash(
            JSON.stringify({ hash: job.hash, revision: job.revision, packet }),
          );
          await site(this.env, "/api/paper-intake/bridge", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              id: job.id,
              revision: info.revision,
              hash: job.hash,
              resultId,
              scanStatus: "clean",
              packet,
              pages: extraction.pages,
            }),
          });
          return { resultId };
        },
      );
      return { id: job.id, status: "metadata_review" };
    } catch (error) {
      await step.do("record-processing-failure", async () => {
        const message = String(error.message || "Processing failed.").slice(
          0,
          800,
        );
        await site(this.env, "/api/paper-intake/bridge", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            id: job.id,
            revision: info?.revision || job.revision,
            hash: job.hash,
            resultId: await hash(
              `${job.hash}:${job.revision}:failure:${message}`,
            ),
            scanStatus,
            error: message,
          }),
        });
        return { recorded: true };
      });
      throw error;
    }
  }
}
export default {
  async fetch(request, env) {
    if (!(await auth(request, env.SERVICE_SECRET)))
      return Response.json(
        { error: "Service authorization required." },
        { status: 401 },
      );
    if (request.method === "GET")
      return Response.json({
        configured: Boolean(
          env.OPENAI_API_KEY && env.OPENAI_MODEL && env.BRIDGE_SECRET,
        ),
        service: "paper-ingestion",
      });
    if (request.method !== "POST") return new Response(null, { status: 405 });
    const job = await request.json();
    if (
      !/^[a-zA-Z0-9-]{1,100}$/.test(job.id) ||
      !/^[a-f0-9]{64}$/.test(job.hash) ||
      !Number.isInteger(job.revision)
    )
      return Response.json({ error: "Invalid job." }, { status: 400 });
    const id = `${job.id}-${job.revision}`;
    try {
      await env.INTAKE.create({ id, params: job });
    } catch (error) {
      try {
        await env.INTAKE.get(id);
      } catch {
        throw error;
      }
    }
    return Response.json({ id, status: "queued" }, { status: 202 });
  },
};
