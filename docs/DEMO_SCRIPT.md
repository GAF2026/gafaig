
---

## 3) docs/DB_SCHEMA.md

```md
# GAFAIG — Snowflake Objects (DB Schema + Views)

Last updated: 2026-02-23

## Database context (expected)
- Database: GAFAIG_DB
- Schema: CORE

## Core objects referenced by the app
### 1) V_ADMIN_SUBMISSIONS (view)
Used by:
- /api/admin/submissions
Purpose:
- Provides unified list of submissions for Admin → Applications UI.

Expected columns (logical):
- REQUEST_ID
- SUBMISSION_TYPE
- STATUS
- ORG_NAME
- CONTACT_EMAIL
- CREATED_AT
- UPDATED_AT

### 2) VERIFICATION_EVIDENCE (table)
Used by:
- /api/admin/verification/[caseId]/summaries
Purpose:
- Maps a verification CASE_ID + ORG_ID to EVIDENCE_IDs

Expected columns (logical):
- CASE_ID
- ORG_ID
- EVIDENCE_ID
- CREATED_AT (and/or UPDATED_AT)

Known current behavior:
- In some local flows the UI evidence exists but this table has 0 rows for the case/org.
- That causes the summaries route to rely on evidenceIds passed from client (if provided).

### 3) EVIDENCE_SUMMARIES (table)
Used by:
- /api/admin/verification/[caseId]/summaries
Purpose:
- Stores summary outputs for evidence items (optionally produced by Cortex).

Expected columns (logical):
- EVIDENCE_ID
- STYLE
- MODEL
- SUMMARY
- PROMPT_VERSION
- INPUT_CHARS
- OUTPUT_CHARS
- CORTEX_AVAILABLE
- CORTEX_ERROR
- CREATED_AT
- UPDATED_AT

## Notes on “demo vs real”
- Demo data may exist in views/tables for walkthrough.
- “Real” flow requires:
  - Evidence created/ingested
  - Evidence linked to case/org (VERIFICATION_EVIDENCE)
  - Summaries generated + stored (EVIDENCE_SUMMARIES)

## Next DB additions (Phase 2+)
- Findings table (per standard)
- Finding ↔ evidence link table
- Decisions table (approve/deny + rationale)
- Score/metrics table (band/tier + subscores)