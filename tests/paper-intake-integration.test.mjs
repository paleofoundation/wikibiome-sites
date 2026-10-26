import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { build } from "esbuild";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
const root = resolve(import.meta.dirname, "..");
const people = {
  owner: {
    accountId: "owner",
    orcid: "0000-0002-2348-7259",
    displayName: "Karen Pendergrass",
    role: "researcher",
    emailVerified: true,
  },
  reviewer: {
    accountId: "reviewer",
    orcid: "0000-0001-1111-1111",
    displayName: "Reviewer One",
    role: "researcher",
    emailVerified: true,
  },
  editor: {
    accountId: "editor",
    orcid: "0000-0001-2222-2222",
    displayName: "Editor Two",
    role: "moderator",
    emailVerified: true,
  },
};
class Statement {
  constructor(db, sql, values = []) {
    this.db = db;
    this.sql = sql;
    this.values = values;
  }
  bind(...values) {
    return new Statement(this.db, this.sql, values);
  }
  async first() {
    return this.db.prepare(this.sql).get(...this.values) || null;
  }
  async all() {
    return { results: this.db.prepare(this.sql).all(...this.values) };
  }
  async run() {
    const r = this.db.prepare(this.sql).run(...this.values);
    return { meta: { changes: Number(r.changes) } };
  }
}
test("real SQL workflow: independent review, stale changes, verified publication and single credit", async () => {
  const dir = mkdtempSync(join(tmpdir(), "paper-intake-integration-"));
  const db = new DatabaseSync(":memory:");
  for (const file of readdirSync(join(root, "drizzle"))
    .filter((f) => f.endsWith(".sql"))
    .sort())
    db.exec(readFileSync(join(root, "drizzle", file), "utf8"));
  for (const a of Object.values(people)) {
    db.prepare("INSERT INTO accounts(id,display_name,role) VALUES(?,?,?)").run(
      a.accountId,
      a.displayName,
      a.role,
    );
    db.prepare(
      "INSERT INTO researcher_profiles(account_id,orcid,name) VALUES(?,?,?)",
    ).run(a.accountId, a.orcid, a.displayName);
    db.prepare(
      "INSERT INTO researcher_emails(id,account_id,email,verified_at) VALUES(?,?,?,?)",
    ).run(a.accountId, a.accountId, `${a.accountId}@example.org`, "2026-09-14");
  }
  globalThis.__paperTest = {
    env: {
      DB: {
        prepare: (sql) => new Statement(db, sql),
        batch: async (stmts) => {
          db.exec("BEGIN");
          try {
            const r = [];
            for (const s of stmts) r.push(await s.run());
            db.exec("COMMIT");
            return r;
          } catch (e) {
            db.exec("ROLLBACK");
            throw e;
          }
        },
      },
    },
    pages: {
      nickel: {
        id: "nickel",
        title: "Nickel",
        overview: "Original",
        sections: [],
        sources: [],
      },
    },
    sources: {},
    credits: [],
  };
  await build({
    entryPoints: [join(root, "lib/paper-intake.ts")],
    outfile: join(dir, "intake.mjs"),
    bundle: true,
    platform: "node",
    format: "esm",
    logLevel: "silent",
    plugins: [
      {
        name: "test-runtime",
        setup(b) {
          b.onResolve({ filter: /^cloudflare:workers$/ }, () => ({
            path: "runtime",
            namespace: "mock",
          }));
          b.onResolve({ filter: /^@\/lib\/research-network$/ }, () => ({
            path: "network",
            namespace: "mock",
          }));
          b.onResolve({ filter: /^@\/lib\/research-network-v2$/ }, () => ({
            path: "recognition",
            namespace: "mock",
          }));
          b.onResolve({ filter: /^@\/lib\/wikibiome$/ }, () => ({
            path: "wiki",
            namespace: "mock",
          }));
          b.onLoad({ filter: /.*/, namespace: "mock" }, ({ path }) => ({
            contents:
              path === "runtime"
                ? "export const env=globalThis.__paperTest.env"
                : path === "network"
                  ? 'export const enforceRateLimit=async()=>{};export const isModeratorRole=r=>["moderator","site_admin"].includes(r);'
                  : path === "recognition"
                    ? "export const recalculateRecognition=async id=>globalThis.__paperTest.credits.push(id);"
                    : "export const allSources=globalThis.__paperTest.sources;export const allWikiPages=Object.values(globalThis.__paperTest.pages);export const canonicalArticleId=id=>id;export const getWikiPage=id=>globalThis.__paperTest.pages[id];export const getSource=id=>globalThis.__paperTest.sources[id];",
            loader: "js",
          }));
        },
      },
    ],
  });
  const api = await import(pathToFileURL(join(dir, "intake.mjs")));
  try {
    await assert.rejects(
      () =>
        api.appointReviewer(
          people.owner,
          people.reviewer.orcid,
          "nickel",
          true,
        ),
      /Administrator access/,
    );
    await assert.rejects(
      () =>
        api.appointReviewer(
          people.editor,
          people.reviewer.orcid,
          "nickel",
          true,
        ),
      /Administrator access/,
    );
    await api.appointReviewer(
      { ...people.editor, role: "site_admin" },
      people.reviewer.orcid,
      "nickel",
      true,
    );
    const created = await api.createPaper(people.owner, {
      title: "Pilot",
      authors: "Karen Pendergrass",
      doi: "10.1234/pilot",
      topic: "nickel",
      rightsAttested: true,
      isAuthor: true,
    });
    assert.equal(
      (
        await api.createPaper(people.owner, {
          title: "Pilot",
          authors: "Karen Pendergrass",
          doi: "https://doi.org/10.1234/PILOT",
          topic: "nickel",
          rightsAttested: true,
        })
      ).duplicate,
      true,
    );
    let paper = await api.rawPaper(created.id);
    paper.status = "metadata_review";
    paper.packet.claims = [
      {
        id: "c1",
        page: 1,
        passage: "Observed in mice.",
        statement: "Observed in mice.",
        evidenceType: "animal",
        support: "paper",
        references: [],
        population: "mice",
        compartment: "gut",
        outcome: "change",
        limitations: "Not a human trial.",
      },
    ];
    paper.packet.changes = [
      {
        targetId: "nickel",
        title: "Nickel",
        section: "Evidence",
        kind: "addition",
        proposedText: "Observed in mice; not established in humans.",
        rationale: "Preserve limits",
        claimIds: ["c1"],
        baseHash: await api.articleHash("nickel"),
        currentText: "Original",
      },
    ];
    paper = await api.savePaper(paper, null, "test_extraction", {});
    paper = await api.actOnPaper(people.owner, paper.id, {
      action: "confirm",
      revision: paper.revision,
    });
    assert.equal(paper.status, "awaiting_reviewer");
    await assert.rejects(
      () => api.paperAccess(people.reviewer, paper.id),
      /access/,
    );
    paper = await api.actOnPaper(people.editor, paper.id, {
      action: "assign",
      orcid: people.reviewer.orcid,
      revision: paper.revision,
    });
    const decision = {
      action: "recommend",
      recommendation: "accept",
      note: "Evidence and qualifications checked.",
      disclosure: "None.",
      confirmedIndependent: true,
    };
    await assert.rejects(
      () =>
        api.actOnPaper({ ...people.owner, role: "moderator" }, paper.id, {
          ...decision,
          revision: paper.revision,
        }),
      /own paper/,
    );
    globalThis.__paperTest.pages.nickel.overview = "Changed after extraction";
    await assert.rejects(
      () =>
        api.actOnPaper(people.reviewer, paper.id, {
          ...decision,
          revision: paper.revision,
        }),
      /new review/,
    );
    paper = await api.actOnPaper(people.owner, paper.id, {
      action: "revise",
      revision: paper.revision,
    });
    assert.equal(paper.reviewerAccountId, null);
    paper = await api.actOnPaper(people.editor, paper.id, {
      action: "assign",
      orcid: people.reviewer.orcid,
      revision: paper.revision,
    });
    paper = await api.actOnPaper(people.reviewer, paper.id, {
      ...decision,
      revision: paper.revision,
    });
    assert.equal(paper.status, "recommended");
    await assert.rejects(
      () =>
        api.actOnPaper({ ...people.reviewer, role: "moderator" }, paper.id, {
          action: "approve",
          decision: "accept",
          note: "Reviewed",
          disclosure: "None",
          confirmedIndependent: true,
          revision: paper.revision,
        }),
      /separate editor/,
    );
    paper = await api.actOnPaper(people.editor, paper.id, {
      action: "approve",
      decision: "accept",
      note: "Approved exact changes",
      disclosure: "None",
      confirmedIndependent: true,
      revision: paper.revision,
    });
    await assert.rejects(
      () => api.verifyPaperPublication(people.editor, paper.id),
      /not yet verified/,
    );
    assert.equal(
      db.prepare("SELECT COUNT(*) n FROM paper_publications").get().n,
      0,
    );
    assert.equal(globalThis.__paperTest.credits.length, 0);
    const sourceId = paper.packet.metadata.sourceId;
    globalThis.__paperTest.sources[sourceId] = {
      title: "Pilot",
      doi: "10.1234/pilot",
    };
    globalThis.__paperTest.pages.nickel.sources = [sourceId];
    globalThis.__paperTest.pages.nickel.sections = [
      { heading: "Evidence", body: paper.packet.changes[0].proposedText },
    ];
    paper = await api.verifyPaperPublication(people.editor, paper.id);
    assert.equal(paper.status, "published");
    await api.verifyPaperPublication(people.editor, paper.id);
    assert.equal(
      db.prepare("SELECT COUNT(*) n FROM paper_publications").get().n,
      1,
    );
    assert.deepEqual(globalThis.__paperTest.credits, ["owner", "owner"]);
    assert.ok(
      db
        .prepare("SELECT COUNT(*) n FROM paper_events WHERE intake_id = ?")
        .get(paper.id).n >= 7,
    );
  } finally {
    db.close();
    rmSync(dir, { recursive: true, force: true });
    delete globalThis.__paperTest;
  }
});
