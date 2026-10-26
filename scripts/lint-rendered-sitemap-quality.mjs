#!/usr/bin/env node
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import net from "node:net";
import { setTimeout } from "node:timers/promises";
import { report } from "./lint-sitemap-quality.mjs";
import { renderedArticleQuality } from "../lib/rendered-article-quality.mjs";

const externalBase = process.argv.find((arg) => arg.startsWith("--base-url="))?.slice(11);
let worker;
let state;
let base = externalBase;
try {
  if (!base) {
    const listener = net.createServer();
    await new Promise((resolve, reject) => { listener.once("error", reject); listener.listen(0, "127.0.0.1", resolve); });
    const port = listener.address().port;
    await new Promise((resolve) => listener.close(resolve));
    base = `http://127.0.0.1:${port}`;
    state = mkdtempSync(join(tmpdir(), "wikibiome-quality-"));
    const require = createRequire(import.meta.url);
    worker = spawn(process.execPath, [require.resolve("wrangler/bin/wrangler.js"), "dev", "--config", "dist/server/wrangler.json", "--local", "--ip", "127.0.0.1", "--port", String(port), "--persist-to", state], { env: { ...process.env, WRANGLER_SEND_METRICS: "false", WRANGLER_LOG_PATH: ".wrangler/quality.log" }, stdio: "ignore" });
    let ready = false;
    for (let attempt = 0; attempt < 120; attempt++) {
      if (worker.exitCode !== null) throw new Error("Local Worker exited before the quality check");
      try { ready = (await fetch(`${base}/sitemap.xml`, { signal: AbortSignal.timeout(1000) })).status === 200; } catch { /* Local startup. */ }
      if (ready) break;
      await setTimeout(250);
    }
    if (!ready) throw new Error("Local Worker did not become ready");
  }
  const response = await fetch(`${base}/sitemap.xml`, { signal: AbortSignal.timeout(10000) });
  if (response.status !== 200) throw new Error(`Sitemap HTTP ${response.status}`);
  const urls = [...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  if (JSON.stringify(urls) !== JSON.stringify(report.urls)) throw new Error("Built sitemap differs from source gate");
  const pending = [...report.rows.map(({ path }) => path), ...report.publicRoutes, ...report.citationSourcePaths];
  const results = [];
  const failures = [];
  let noindexChecks = 0;
  let publicRouteChecks = 0;
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (pending.length) {
      const path = pending.shift();
      if (!path) break;
      const row = report.rows.find((item) => item.path === path);
      const page = await fetch(`${base}${path}`, { redirect: "manual", signal: AbortSignal.timeout(10000) });
      const html = await page.text();
      if (report.publicRoutes.includes(path)) {
        publicRouteChecks++;
        if (page.status !== 200 || !/<meta name="robots" content="index, follow"/.test(html)) failures.push(`${path}: expected public HTTP 200, index, follow`);
        if (!urls.includes(`https://www.wikibiome.com${path}`)) failures.push(`${path}: public route missing from sitemap`);
        continue;
      }
      if (!row?.eligible) {
        noindexChecks++;
        if (page.status !== 200 || !/<meta name="robots" content="noindex, follow"/.test(html)) failures.push(`${path}: expected retained HTTP 200, noindex, follow`);
        continue;
      }
      const quality = renderedArticleQuality(html, row);
      if (page.status !== 200) quality.reasons.push(`HTTP ${page.status}`);
      results.push({ section: row.section, ...quality });
      for (const reason of quality.reasons) failures.push(`${path}: ${reason}`);
    }
  }));
  for (const section of [...new Set(results.map((row) => row.section))].sort()) {
    const rows = results.filter((row) => row.section === section);
    console.log(`Rendered ${section}: PASS ${rows.filter((row) => !row.reasons.length).length}, FAIL ${rows.filter((row) => row.reasons.length).length}`);
  }
  console.log(`Rendered sitemap: ${urls.length} URLs; ${failures.length} failures`);
  console.log(`Noindex checks: ${noindexChecks} retained article/source URLs`);
  console.log(`Public crawl entry points: ${publicRouteChecks} HTTP 200, index, follow, in sitemap`);
  if (failures.length) throw new Error(failures.join("\n"));
} finally {
  if (worker && worker.exitCode === null) {
    worker.kill("SIGTERM");
    await new Promise((resolve) => worker.once("exit", resolve));
  }
  if (state) rmSync(state, { recursive: true, force: true });
}
