#!/usr/bin/env node
// Prepare an approved packet in an isolated upstream checkout; never merge/deploy.
import {
  readFileSync,
  writeFileSync,
  existsSync,
  readdirSync,
  realpathSync,
  lstatSync,
} from "node:fs";
import { resolve, join, relative } from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
const [packetFile, checkout] = process.argv.slice(2);
if (!packetFile || !checkout)
  throw new Error(
    "Usage: node scripts/apply-paper-packet.mjs APPROVED.json UPSTREAM_CHECKOUT",
  );
const packet = JSON.parse(readFileSync(resolve(packetFile), "utf8"));
const { packetHash, ...payload } = packet;
if (
  createHash("sha256").update(JSON.stringify(payload)).digest("hex") !==
  packetHash
)
  throw new Error(
    "Publication packet digest mismatch. Download a fresh approved packet.",
  );
if (
  packet.schemaVersion !== 1 ||
  packet.review?.recommendation !== "accept" ||
  !packet.approval ||
  !/^[a-f0-9]{40}$/.test(packet.baseCommit)
)
  throw new Error("The packet does not record independent editorial approval.");
const root = realpathSync(resolve(checkout));
const git = (...args) =>
  execFileSync("git", ["-C", root, ...args], { encoding: "utf8" }).trim();
if (git("rev-parse", "HEAD") !== packet.baseCommit)
  throw new Error(
    "Upstream has changed. Refresh snapshots and obtain a new review.",
  );
if (git("status", "--porcelain"))
  throw new Error("Use a clean, isolated upstream checkout.");
const valid = (id) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
if (!valid(packet.sourceId) || !packet.changes.every((c) => valid(c.targetId)))
  throw new Error("Invalid canonical identifier.");
function markdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isSymbolicLink()
      ? []
      : e.isDirectory()
        ? markdownFiles(join(dir, e.name))
        : e.name.endsWith(".md")
          ? [join(dir, e.name)]
          : [],
  );
}
const files = markdownFiles(join(root, "wiki"));
const edits = [];
const sourcePath = join(root, "wiki", "sources", `${packet.sourceId}.md`);
if (existsSync(sourcePath)) {
  if (readFileSync(sourcePath, "utf8") !== packet.sourceMarkdown)
    throw new Error("Existing source metadata needs editorial reconciliation.");
} else edits.push([sourcePath, packet.sourceMarkdown]);
for (const c of packet.changes) {
  const matches = files.filter((f) => f.endsWith(`/${c.targetId}.md`));
  if (matches.length > 1)
    throw new Error(
      `Ambiguous article path: ${c.targetId}. Resolve the canonical file first.`,
    );
  if (!matches.length) {
    if (c.kind !== "new_page")
      throw new Error(`Existing article missing: ${c.targetId}`);
    edits.push([
      join(root, "wiki", "concepts", `${c.targetId}.md`),
      `---\nid: ${JSON.stringify(c.targetId)}\ntitle: ${JSON.stringify(c.title)}\ntype: concept\nsources: [${JSON.stringify(packet.sourceId)}]\n---\n\n# ${c.title}\n\n## ${c.section}\n\n${c.proposedText} [[${packet.sourceId}]]\n`,
    ]);
  } else {
    const path = matches[0];
    const before = readFileSync(path, "utf8");
    if (before.includes(c.proposedText)) continue;
    edits.push([
      path,
      `${before.trimEnd()}\n\n## ${c.section}\n\n${c.proposedText} [[${packet.sourceId}]]\n`,
    ]);
  }
}
for (const [file] of edits) {
  if (
    relative(root, file).startsWith("..") ||
    (existsSync(file) && lstatSync(file).isSymbolicLink())
  )
    throw new Error("Unsafe publication path.");
}
for (const [file, text] of edits) writeFileSync(file, text);
console.log(
  `Prepared ${edits.length} source/article files. Review the diff, run the corpus audits, and open an upstream pull request. Nothing was merged or deployed.`,
);
