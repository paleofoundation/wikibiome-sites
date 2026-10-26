# Paper intake operations

The Sites app stores private submissions in existing D1/R2 bindings. `services/paper-ingestion` separately deploys Cloudflare Workflows and an isolated ClamAV/PDF/OCR container. Do not add unsupported Workflows/Containers bindings to the Sites hosting manifest.

## Rollout gate

Deploy the application and pilot with general uploads disabled. Activation requires a production processing service, OpenAI API credentials and independent editorial staff; none are invented or seeded.

The pilot `metals-microbiome-pilot` belongs to ORCID `0000-0002-2348-7259`. POST `/api/paper-intake/pilot` using the owner's/editor's session or dedicated bridge secret to import it idempotently. It contains nine changes and 50 transcribed references and starts at metadata confirmation. Its provenance records manual evidence preparation and a successful local ClamAV scan of the exact document hash. No corpus publication or award occurs.

## Configure the service

1. Obtain an OpenAI API key through the OpenAI Developers plugin's API-key skill. Set ingestion Worker secret `OPENAI_API_KEY` and server-side `OPENAI_MODEL` to an available model supporting Responses Structured Outputs. Model identity is retained in extraction provenance.
2. Use an authorized Cloudflare account with Workflows and Containers. Start Docker, run `npm ci` in `services/paper-ingestion`, then `npm run deploy`. The lockfile and Wrangler configuration define this separate service.
3. Generate separate random secrets of at least 32 bytes. Configure ingestion Worker `SERVICE_SECRET` and `BRIDGE_SECRET`; put their corresponding values on the site as `WIKIBIOME_INTAKE_SERVICE_SECRET` and `WIKIBIOME_INTAKE_BRIDGE_SECRET`. Never commit values. Set service `SITE_ORIGIN` and site `WIKIBIOME_INTAKE_SERVICE_URL` to exact deployed endpoints.
4. In staging, run the PDF through real scanning/extraction, OCR, callbacks, private access, retry, reviewer and editor flows. Appoint an independent reviewer and editor. Only after these checks set site `WIKIBIOME_PAPER_UPLOADS_ENABLED=1`.

Workflow identity includes submission and revision. Callbacks require document hash, revision and result digest; duplicate results acknowledge without another revision. Extraction never grants publication or review authority. Logs must exclude manuscripts, private contact data and credentials. A parser unit test is not a substitute for an actual antivirus integration test.

## Review and publication

Site administrators use `/researcher/review` to appoint email-verified researchers to canonical topics. Editors assign papers to those reviewers. Reviewers recommend; separate editors decide. Authors/submitters cannot self-approve. Known author names and ORCIDs are checked, with explicit conflict disclosure for additional relationships.

Revising a packet clears its earlier review. Article fingerprints block approval/export when targets change. An independent editor downloads the approved JSON packet. In a clean isolated upstream checkout at its recorded commit:

```
node scripts/apply-paper-packet.mjs APPROVED.json UPSTREAM_CHECKOUT
```

This prepares source/article Markdown; it does not merge or deploy. Corrections append qualified sections for editorial reconciliation and do not destructively replace unrelated text. Existing source thresholds, revision generation, corpus audits, upstream review and Sites publication remain mandatory. A framework article lacking sufficient verified evidence cannot bypass these gates.

After deployment, an independent editor selects **Verify live publication**. The server checks its audited deployed corpus for the source and every approved passage/citation. No client-supplied success flag or commit proves publication. Partial publication awards nothing. The source receipt is unique, and verification retries do not duplicate credit.

One paper counts once, not once per destination or cited reference. Accepted author context is already public; standalone proposals need verified publication. Historical awards retain their recorded policy. Authorship still requires the existing ORCID claim-verification flow; uploading does not verify authorship or confer Keystone status.

## Checks

Run `npm run typecheck`, `node --test tests/paper-intake*.test.mjs tests/researcher-network-contract.test.mjs`, and the existing build. Run `npm ci` and `npm run check` inside `services/paper-ingestion`. Real container tests require Docker and fresh ClamAV signatures. Keep rollout disabled while any external prerequisite is unavailable.
