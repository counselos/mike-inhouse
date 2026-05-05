# Mike-InHouse

A fork of [willchen96/mike](https://github.com/willchen96/mike) extended for in-house counsel.

The original Mike was built for small and mid-sized law firms doing transactional finance work, with built-in workflows for credit agreements, conditions precedent, and shareholder agreements. This fork adds five workflows an in-house lawyer actually runs alongside those, and changes three default behaviours that matter before pointing an AI system at privileged documents.

## What's different

Five new workflows added alongside Mike's original three:

- NDA Review Against Playbook. Flag every deviation from your standards as RED, AMBER, or GREEN with proposed redlines.
- DPA Review (GDPR Article 28). Eight-row Article 28 compliance matrix, transfer-mechanism table, sub-processor list, plus an ACCEPT/NEGOTIATE/REJECT recommendation.
- AI Vendor Addendum Review under the EU AI Act. Article 50 transparency, GPAI obligations under Articles 53 to 55, customer-facing risk allocation.
- MSA and SaaS order-form red-flag review. Plain-English traffic-light memo for the business owner who has to sign.
- Vendor Intake Triage. Risk tier, applicable regulations (GDPR, AI Act, DORA, NIS2), required approvers, documents needed, and an SLA for legal turnaround.

Tabular review presets for EU work cover sub-processors, transfer mechanism, and AI Act role allocation.

Three default behaviours changed:

- Document text and prompts stay off disk by default. Raw LLM stream events, document filenames, storage paths, extracted text snippets, and full system prompts are gated behind `MIKE_DEBUG_STREAMS=1`. With the flag off, none of it lands in container logs, backups, or your SIEM. Set the flag only when actively debugging.
- Document download tokens require a deployment-specific signing secret with no fallback. The server will not sign download URLs unless `DOWNLOAD_SIGNING_SECRET` is set to at least 32 characters.
- The server refuses to boot if `DOWNLOAD_SIGNING_SECRET` is missing. Forgetting to set it produces a clear startup error instead of a silent vulnerability.

## Setup

Same as upstream Mike with one extra step for the signing secret. Install dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

Create local env files and generate a signing secret:

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
- S3-compatible object storage such as Cloudflare R2
- An Anthropic or Google API key (per-user in account settings, or via env-level fallback in dev)
- LibreOffice for DOC and DOCX to PDF conversion

## Environment flags

| Variable | Required | Purpose |
|---|---|---|
| `DOWNLOAD_SIGNING_SECRET` | Yes | HMAC secret for download URLs. Minimum 32 characters. Server refuses to boot without it. |
| `MIKE_DEBUG_STREAMS` | No | Set to `1` to enable raw LLM stream logs and document-pipeline diagnostics. Off by default. |

## Checks

```bash
npm run build --prefix backend
npm run build --prefix frontend
npm run lint --prefix frontend
```

## Credit

This is a fork of [willchen96/mike](https://github.com/willchen96/mike) by Will Chen. The document pipeline, tracked-changes engine, project model, and tabular review feature are his work. Go star the original.

## License

AGPL-3.0-only, same as upstream. See `LICENSE`.
