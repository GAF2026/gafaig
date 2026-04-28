# GAFAIG_ACTIVE_FILE_MAP.md
Last Updated: 2026-04-28

## PURPOSE
This document defines the **complete active file map** for GAFAIG (Global Authority for AI Governance). It serves as the authoritative reference for:

- All Snowflake SQL files (tables, views, procedures)
- All API routes (Next.js App Router)
- All UI pages (admin + public)
- Data flow ownership
- Contract boundaries

This file MUST remain:
- Complete (no sections removed)
- Deterministic
- Aligned with Snowflake as the sole source of truth

---

# CORE SYSTEM PRINCIPLE

GAFAIG is a **deterministic Snowflake-first system**

STRICT RULES:

- Snowflake = Source of Truth
- API = Pass-through only (NO computation)
- UI = Display only (NO derivation)
- Registry = Append-only
- IDs = Generated ONLY in Snowflake

---

# ID PARITY RULE (CRITICAL)

All IDs must be:

- Generated in Snowflake ONLY
- Never generated in API or UI
- Passed through unchanged

Applies to:

- APPLICATION_ID
- REQUEST_ID
- CASE_ID
- FINDING_ID
- EVIDENCE_ID
- EVENT_ID
- REGISTRY_ID
- SNAPSHOT_ID

Violation = System corruption

---

# CANONICAL DATA FLOW

APPLICATION  
→ CASE  
→ FINDINGS  
→ EVIDENCE  
→ EVENTS  
→ SCORING  
→ DECISION  
→ REGISTRY SNAPSHOT  
→ PUBLIC VIEWS  
→ API  
→ UI  

---

# SNOWFLAKE FILE MAP (CANONICAL ORDER)

## 00 — ENVIRONMENT
- 00_CORE_SETUP.sql

## 01 — REBUILD
- 01_REBUILD_ENVIRONMENT_CANONICAL.sql

---

## 11 — APPLICATIONS
- 11_TABLES_APPLICATIONS.sql

Creates:
- CORE.APPLICATIONS

---

## 12 — PARTICIPANTS ⚠️ BROKEN FILE (FIX FIRST)
- 12_TABLES_PARTICIPANTS.sql

Creates:
- CORE.PARTICIPANTS

⚠️ MUST FIX BEFORE ANY PIPELINE EXECUTION

---

## 14 — EVIDENCE
- 14_TABLES_EVIDENCE.sql

Creates:
- CORE.VERIFICATION_EVIDENCE

---

## 15 — EVENTS ⚠️ BROKEN FILE (FIX FIRST)
- 15_TABLES_EVENTS.sql

Creates:
- CORE.VERIFICATION_EVENTS

⚠️ MUST FIX BEFORE ANY PIPELINE EXECUTION

---

## 16 — SCORING SNAPSHOTS
- 16_TABLES_CASE_SCORE_SNAPSHOTS.sql

Creates:
- CORE.CASE_SCORE_SNAPSHOTS

---

## 17 — DECISIONS
- 17_TABLES_DECISIONS.sql

Creates:
- CORE.DECISIONS

---

## 18 — REGISTRY ENTITIES
- 18_TABLES_REGISTRY_ENTITIES.sql

Creates:
- CORE.REGISTRY_ENTITIES

---

## FINDINGS (CRITICAL)
- 13_TABLES_FINDINGS.sql (or equivalent canonical file)

Creates:
- CORE.VERIFICATION_FINDINGS

Fields REQUIRED:

- FINDING_ID
- CASE_ID
- CONTROL_ID
- CONTROL_TITLE
- RESULT
- RATIONALE
- SEVERITY
- EVIDENCE_IDS
- CREATED_AT
- UPDATED_AT

---

# PROCEDURES

## APPLICATION → CASE
- 23_SP_CREATE_CASE_FROM_APPLICATION.sql

Creates:
- CORE.SP_CREATE_CASE_FROM_APPLICATION

---

## APPLICATION INTAKE
- 24_PROCEDURES_APPLICATION_INTAKE.sql

---

## FINDINGS (CRITICAL)
- 26_PROCEDURES_FINDINGS.sql

Creates:
- CORE.SP_CREATE_FINDING

REQUIRED SIGNATURE:

CALL CORE.SP_CREATE_FINDING(
  CASE_ID,
  TITLE,
  SEVERITY,
  STATUS,
  CATEGORY
)

MUST:

- Generate FINDING_ID via sequence
- Insert into CORE.VERIFICATION_FINDINGS
- Return OBJECT:
  {
    findingId,
    caseId
  }

---

## EVIDENCE
- 27_PROCEDURES_EVIDENCE.sql

---

## FINDING ↔ EVIDENCE LINK
- 28_PROCEDURES_FINDING_EVIDENCE.sql

---

## SCORING
- 25_SP_SCORE_CASE_ENTERPRISE.sql

---

## APPROVAL
- 25_PROCEDURES_APPROVAL.sql

---

## REGISTRY PUBLISH
- CORE.REGISTRY_PUBLISH.sql

Creates:
- SP_PUBLISH_CASE_TO_REGISTRY_V3

---

# VIEWS

## PUBLIC REGISTRY
- 21_VIEWS_PUBLIC_REGISTRY.sql

Creates:
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_LATEST_APPROVED

---

## AI SYSTEMS PUBLIC
- 22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql

Creates:
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

---

## CASE RENEWAL
- 26_VIEWS_CASE_RENEWAL_STATUS.sql

---

# SEED FILES

## CANONICAL DEMO
- GAFAIG - FINAL_CANONICAL_DEMO_SEED.sql

## MULTI-SEED (IN PROGRESS)
- GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

---

# NEXT.JS API ROUTES

## APPLICATIONS
/app/api/admin/applications/route.ts

---

## APPLICATION DETAIL
/app/api/admin/applications/[requestId]/route.ts

---

## CREATE CASE
/app/api/admin/applications/[requestId]/convert/route.ts

Calls:
- SP_CREATE_CASE_FROM_APPLICATION

---

## FINDINGS (CRITICAL)

### LIST + CREATE
/app/api/admin/verification/[caseId]/findings/route.ts

GET:
- Reads from CORE.VERIFICATION_FINDINGS

POST:
- Calls CORE.SP_CREATE_FINDING

---

## EVIDENCE
/app/api/admin/verification/[caseId]/evidence/route.ts

---

## VERIFY (PUBLIC)
/app/api/verify/[registryId]/route.ts

---

## REGISTRY
/app/api/registry/route.ts

---

## BADGE
/app/api/badge/[registryId]/route.ts

---

# ADMIN UI PAGES

## APPLICATION LIST
/app/admin/applications/page.tsx

---

## APPLICATION DETAIL
/app/admin/applications/[requestId]/page.tsx

---

## CASE PAGE (CRITICAL)
/app/admin/verification/[caseId]/page.tsx

Displays:

- Evidence count
- Findings count
- Score
- Decision
- Publish state

Buttons:

- Add Test Evidence
- Create Test Finding

---

# CURRENT STATE (WHERE WE LEFT OFF)

## ✅ WORKING

- Application → Case conversion
- Evidence creation
- Case page rendering
- Procedure execution (Snowflake)

---

## ⚠️ CURRENT ISSUE

Findings show:

- UI = 0
- API = sometimes error OR empty
- Snowflake = no rows inserted

---

## ROOT CAUSES IDENTIFIED

1. ❌ Wrong SELECT columns (`TITLE` instead of `CONTROL_TITLE`) → FIXED  
2. ❌ Procedure mismatch risk  
3. ❌ Insert not confirmed  
4. ❌ API may hit wrong route variant  
5. ❌ No verification of DB write after POST  

---

# REQUIRED NEXT STEP (IMMEDIATE)

## VERIFY FINDING INSERT

Run:

SELECT *
FROM GAFAIG_DB.CORE.VERIFICATION_FINDINGS
WHERE CASE_ID = '<YOUR_CASE_ID>'
ORDER BY CREATED_AT DESC;

---

## EXPECTED RESULT

At least 1 row:

- FINDING_ID exists
- CONTROL_TITLE populated
- CASE_ID correct

---

# IF NO ROWS

Then:

👉 SP_CREATE_FINDING is not inserting  
👉 Must debug procedure (NOT API)

---

# IF ROWS EXIST BUT UI = 0

Then:

👉 API route issue  
👉 OR wrong endpoint being called  
👉 OR caching mismatch  

---

# CANONICAL VALIDATION STEP (FUTURE — REQUIRED)

## 🔴 MUST IMPLEMENT

File:

99_RUN_CANONICAL_PIPELINE.sql

Purpose:

- Execute ALL SQL files in correct order
- Validate:
  - Tables
  - Views
  - Procedures
  - End-to-end pipeline

Also include:

- Smoke tests
- Insert → select validation
- Procedure execution tests

---

# ENGINEERING RULES (ENFORCED)

- No UI-generated IDs
- No API computation logic
- No missing fields in inserts
- No non-deterministic queries
- No silent failures

---

# STATUS SUMMARY

System Phase:  
→ Phase 7 — PRIVATE WORKFLOW (ACTIVE)

Current focus:

- Findings pipeline stabilization
- Procedure correctness
- API ↔ Snowflake alignment
- Deterministic validation

---

# END OF FILE