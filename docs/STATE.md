# GAFAIG — Authoritative State (Repo Truth)

Last updated: 2026-02-23

## What GAFAIG is
GAFAIG is a governance assurance platform that helps evaluate organizations against governance standards (e.g., “HG v1.0”), collect evidence, map evidence to findings, and produce auditable summaries stored in Snowflake (optionally Cortex-backed).

## What works right now (local dev)
### Admin auth (demo)
- Admin login page works:
  - http://localhost:3000/admin/login
- Clicking **Enable demo access** sets an admin cookie/session (demo mode).

### Admin Applications page (Snowflake-backed)
- Applications list loads successfully after fixes:
  - http://localhost:3000/admin/applications
- API powering it:
  - /api/admin/submissions

### Evidence list (local JSON-backed) + summary API (Snowflake-backed)
- Evidence page:
  - http://localhost:3000/admin/verification/CASE-0001/evidence
- Evidence items appear (demo data / local store).
- Summary API can return stored rows from Snowflake EVIDENCE_SUMMARIES **when evidence IDs exist there**.

## Current known issues / warnings
### Warning: VERIFICATION_EVIDENCE mapping in Snowflake appears empty
The summary route tries to:
1) Look up evidence IDs for (caseId + orgId) in Snowflake table `GAFAIG_DB.CORE.VERIFICATION_EVIDENCE`
2) Then fetch summary rows from `GAFAIG_DB.CORE.EVIDENCE_SUMMARIES`

Observed warning in console/response:
- “Snowflake VERIFICATION_EVIDENCE has 0 rows for this case/org. Using evidenceIds provided…”

Meaning:
- Your UI shows evidence items, but they are not currently written/linked into Snowflake’s `VERIFICATION_EVIDENCE` table for that case/org.

### Admin cookie required for summaries POST
If you call the summary endpoint without being logged in (demo access cookie), you can get:
- 401 Unauthorized (missing admin cookie)

Fix:
- Go to /admin/login and click Enable demo access first, then try again.

## How to run locally
1) Install deps:
   - npm install
2) Ensure `.env.local` contains required env vars (see docs/ENV_CHECKLIST.md)
3) Start dev server:
   - npm run dev
4) Open:
   - http://localhost:3000

## Snowflake connection state
Snowflake is connected via server-side Node runtime routes (`runtime = "nodejs"`).
Key expected context values:
- DB: GAFAIG_DB
- Schema: CORE
- Role/User/Warehouse: (see ENV_CHECKLIST.md; names only)

## Where we are on the roadmap (high-level)
✅ Phase 1 (MVP demo, Snowflake integrated for key data)
- Admin demo auth
- Admin applications list (Snowflake view)
- Evidence page + summaries endpoint (Snowflake summaries)

➡️ Next up (Phase 2)
- Make evidence ↔ case linking fully consistent between UI and Snowflake (write to VERIFICATION_EVIDENCE)
- Generate missing summaries via Cortex (or stub generation, then Cortex)
- Findings ↔ evidence mapping UI + APIs
- Decisions + scoring pages end-to-end demo flow