import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { researcherDisplayName } from "../lib/orcid-display.mjs";
const require = createRequire(import.meta.url);
const code = ts.transpileModule(readFileSync(new URL("../app/_components/OrcidLink.tsx", import.meta.url), "utf8"), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS } }).outputText;
const module = { exports: {} };
new Function("require", "module", "exports", code)(name => name === "@/lib/orcid-display.mjs" ? { researcherDisplayName } : require(name), module, module.exports);
const { OrcidLink } = module.exports;
test("author ORCID is an accessible icon link, with no numeric label", () => {
 const id = "0000-0002-2348-7259";
 const html = renderToStaticMarkup(React.createElement(OrcidLink, { orcid: id, name: "Karen Pendergrass" }));
 assert.match(html, /href="https:\/\/orcid.org\/0000-0002-2348-7259"/);
 assert.match(html, /src="\/orcid-id.svg"/);
 assert.match(html, /aria-label="View Karen Pendergrass’s ORCID profile"/);
 assert.doesNotMatch(html.replace(/href="[^"]*"/g, ""), /0000-0002-2348-7259/);
 assert.equal(html.replace(/<[^>]*>/g, ""), "");
});
test("legacy numeric names cannot leak through labels", () => {
 assert.equal(researcherDisplayName("ORCID 0000-0002-2348-7259"), "Researcher");
 assert.equal(researcherDisplayName("Karen Pendergrass"), "Karen Pendergrass");
});
test("invalid identifiers never produce a broken or unsafe author link", () => {
 assert.equal(renderToStaticMarkup(React.createElement(OrcidLink, { orcid: "javascript:alert(1)", name: "Author" })), "");
});
