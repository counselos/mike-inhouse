# Mike-InHouse

> A fork of [willchen96/mike](https://github.com/willchen96/mike) repositioned for in-house counsel. Same engine. Different desk. Safer defaults.

The original Mike was built for small-to-mid law firms running transactional finance — credit agreements, conditions precedent, shareholder agreements. This fork strips that out and ships five workflows in-house counsel actually run, plus three production defaults that need to be true before pointing an AI system at privileged documents.

## What's different

**Workflows for in-house, not law firms:**

- **NDA Review Against Playbook** — flag every deviation from your standards as RED / AMBER / GREEN with proposed redlines.
- **DPA Review (GDPR Art. 28)** — eight-row Article 28 compliance matrix, transfer-mechanism table, sub-processor list, ACCEPT / NEGOTIATE / REJECT recommendation.
- **AI Vendor Addendum Review (EU AI Act)** — Article 50 transparency, GPAI / Art. 53–55 obligations, customer-facing risk allocation.
- **MSA / Order Form Red-Flag Review** — plain-English traffic-light memo for the business owner who has to sign.
- **Vendor Intake Triage** — risk tier, applicable regulations (GDPR / AI Act / DORA / NIS2), required approvers, documents needed, SLA.

**Tabular review presets for EU work:** sub-processors, transfer mechanism, AI Act role.

**Production defaults that respect privilege:**

- **Document text and prompts don't get written to disk.** By default, raw LLM stream events, document filenames, storage paths, extracted text snippets, and full system prompts are not logged. Nothing in your backups, nothing in your SIEM, nothing in your container logs to subpoena. Set `MIKE_DEBUG_STREAMS=1` only when actively debugging.
- **Document download tokens are cryptographically scoped to your install.** No hidden fallback secret in the public source. The server refuses to sign URLs unless `DOWNLOAD_SIGNING_SECRET` is set to a value of at least 32 characters.
- **The server refuses to boot with insecure defaults.** Forgetting to set `DOWNLOAD_SIGNING_SECRET` produces a clear startup error rather than a silent vulnerability.

## Setup

Same as upstream Mike, plus generating a signing secret. Install dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

Create local env files (and set `DOWNLOAD_SIGNING_SECRET`):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
echo "DOWNLOAD_SIGNING_SECRET=$(openssl rand -hex 32)" >> backend/.env
```

Run `backend/migrations/000_one_shot_schema.sql` in the Supabase SQL editor for a fresh database.

Start the backend and frontend:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

Open `http://localhost:3000`.

## Required services

- Supabase Auth and Postgres
- S3-compatible object storage (e.g. Cloudflare R2)
- An Anthropic or Google API key (configurable per user in account → models, or via env-level fallback in dev)
- LibreOffice for DOC/DOCX to PDF conversion

## Environment flags

| Variable | Required | Purpose |
|---|---|---|
| `DOWNLOAD_SIGNING_SECRET` | Yes | HMAC secret for download URLs. Min 32 chars. Server refuses to boot without it. |
| `MIKE_DEBUG_STREAMS` | No | Set to `1` to enable raw LLM stream logs and document-pipeline diagnostics. Off by default. |

## Checks

```bash
npm run build --prefix backend
npm run build --prefix frontend
npm run lint --prefix frontend
```

## Credit

This is a fork of [willchen96/mike](https://github.com/willchen96/mike) by Will Chen. The hard work — the document pipeline, tracked-changes engine, project model, tabular review feature — is his. Go star the original.

## License

AGPL-3.0-only, same as upstream. See `LICENSE`.
