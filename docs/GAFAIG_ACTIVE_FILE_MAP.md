# GAFAIG_ACTIVE_FILE_MAP.md
Last Updated: 2026-05-04

PURPOSE

This document defines the complete active file map for GAFAIG (Global Authority for AI Governance). It serves as the authoritative reference for:

All Snowflake SQL files (tables, views, procedures)
All API routes (Next.js App Router)
All UI pages (admin + public)
Data flow ownership
Contract boundaries

This file MUST remain:

Complete (no sections removed)
Deterministic
Aligned with Snowflake as the sole source of truth

---

CORE SYSTEM PRINCIPLE

GAFAIG is a deterministic Snowflake-first system.

STRICT RULES:

Snowflake = Source of Truth  
API = Pass-through only (NO computation)  
UI = Display only (NO derivation)  
Registry = Append-only  
IDs = Generated ONLY in Snowflake  

---

ID PARITY RULE (CRITICAL)

All IDs must be:

Generated in Snowflake ONLY  
Never generated in API or UI  
Passed through unchanged  

Applies to:

APPLICATION_ID  
REQUEST_ID  
CASE_ID  
FINDING_ID  
EVIDENCE_ID  
EVENT_ID  
REGISTRY_ID  
SNAPSHOT_ID  

Violation = System corruption

---

CANONICAL DATA FLOW

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

SNOWFLAKE FILE MAP (CANONICAL ORDER)

00 — ENVIRONMENT  
00_CORE_SETUP.sql  

01 — REBUILD  
01_REBUILD_ENVIRONMENT_CANONICAL.sql  

---

11 — APPLICATIONS  
11_TABLES_APPLICATIONS.sql  
Creates: CORE.APPLICATIONS  

---

12 — PARTICIPANTS ⚠️ BROKEN FILE (FIX FIRST)  
12_TABLES_PARTICIPANTS.sql  
Creates: CORE.PARTICIPANTS  

⚠️ MUST FIX BEFORE ANY PIPELINE EXECUTION  

---

13 — FINDINGS (CRITICAL)  
13_TABLES_FINDINGS.sql  
Creates: CORE.VERIFICATION_FINDINGS  

Required Fields:
FINDING_ID  
CASE_ID  
CONTROL_ID  
CONTROL_TITLE  
RESULT  
RATIONALE  
SEVERITY  
EVIDENCE_IDS  
CREATED_AT  
UPDATED_AT  

---

14 — EVIDENCE  
14_TABLES_EVIDENCE.sql  
Creates: CORE.VERIFICATION_EVIDENCE  

---

14 — REGISTRY AI SYSTEMS  
14_TABLES_REGISTRY_AI_SYSTEMS.sql  
Creates: CORE.REGISTRY_AI_SYSTEMS  

---

15 — EVENTS ⚠️ BROKEN FILE (FIX FIRST)  
15_TABLES_EVENTS.sql  
Creates: CORE.VERIFICATION_EVENTS  

⚠️ MUST FIX BEFORE ANY PIPELINE EXECUTION  

---

16 — SCORING SNAPSHOTS  
16_TABLES_CASE_SCORE_SNAPSHOTS.sql  
Creates: CORE.CASE_SCORE_SNAPSHOTS  

---

17 — DECISIONS  
17_TABLES_DECISIONS.sql  
Creates: CORE.DECISIONS  

---

18 — REGISTRY ENTITIES  
18_TABLES_REGISTRY_ENTITIES.sql  
Creates: CORE.REGISTRY_ENTITIES  

---

PROCEDURES

APPLICATION → CASE  
23_SP_CREATE_CASE_FROM_APPLICATION.sql  
Creates: CORE.SP_CREATE_CASE_FROM_APPLICATION  

---

APPLICATION INTAKE  
24_PROCEDURES_APPLICATION_INTAKE.sql  

---

SCORING (CRITICAL OWNER)  
25_SP_SCORE_CASE_ENTERPRISE.sql  

---

APPROVAL  
25_PROCEDURES_APPROVAL.sql  

---

FINDINGS (CRITICAL)  
26_PROCEDURES_FINDINGS.sql  

Creates: CORE.SP_CREATE_FINDING  

REQUIRED SIGNATURE:

CALL CORE.SP_CREATE_FINDING(  
CASE_ID,  
TITLE,  
SEVERITY,  
STATUS,  
CATEGORY  
)

MUST:

Generate FINDING_ID via sequence  
Insert into CORE.VERIFICATION_FINDINGS  
Return OBJECT:

{
  findingId,
  caseId
}

---

EVIDENCE  
27_PROCEDURES_EVIDENCE.sql  

---

FINDING ↔ EVIDENCE LINK  
28_PROCEDURES_FINDING_EVIDENCE.sql  

---

REGISTRY PUBLISH (CRITICAL OWNER)  
GAFAIG - CORE.REGISTRY_PUBLISH.sql  

Creates: SP_PUBLISH_CASE_TO_REGISTRY_V3  

RULE:

ALL registry writes MUST go through this procedure  

NEVER insert into:
CORE.REGISTRY_SNAPSHOTS  
CORE.REGISTRY_AI_SYSTEMS  

NEVER delete from registry tables  

---

VIEWS

PUBLIC REGISTRY (CRITICAL CONTRACT)  
21_VIEWS_PUBLIC_REGISTRY.sql  

Creates:
CORE.V_REGISTRY_PUBLIC  
CORE.V_REGISTRY_LATEST_APPROVED  

RULES:

One row per CASE_ID  
Latest DECISION only  
Latest REGISTRY SNAPSHOT only  
No internal scoring exposure  

---

AI SYSTEMS PUBLIC  
22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql  

Creates:
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC  

RULES:

MUST JOIN on CASE_ID  
MUST NOT expose score or internal decision logic  
ONLY public contract fields allowed  

---

CASE RENEWAL  
26_VIEWS_CASE_RENEWAL_STATUS.sql  

Creates:
CORE.V_CASE_RENEWAL_STATUS  

RULE:

Publishability is NEVER stored  
Always derived from:

DECISION_STATUS = 'APPROVED'  
AND CURRENT_TIMESTAMP BETWEEN VALID_FROM AND VALID_TO  

---

EXPLORER + SEARCH

GAFAIG - Public Registry Search View.sql  
22_VIEWS_EXPLORER_STATS.sql  
GAFAIG - SCORE_BREAKDOWN_PUBLIC.sql  

---

SEED FILE POLICY (CRITICAL)

SINGLE SEED RULE (MANDATORY)

GAFAIG uses ONE canonical seed file only.

Active seed:

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql  

STRICT RULES:

NEVER create additional seed files  
NEVER split seed logic across files  
NEVER manually insert into registry tables  
NEVER delete from registry tables  

ALLOWED:

Modify master seed file  
Expand dataset inside master seed  
Add lifecycle realism (expired, revoked)  
Perform CASE-level cleanup ONLY (pre-publish)  

REQUIRED BEHAVIOR:

Seed must:

Insert APPLICATIONS  
Create CASES  
Insert FINDINGS / EVIDENCE / EVENTS  
Call scoring procedure  
Call approval procedure  
Call publish procedure  

---

NEXT.JS API ROUTES

ADMIN

/app/api/admin/applications/route.ts  
/app/api/admin/applications/[requestId]/route.ts  
/app/api/admin/applications/[requestId]/convert/route.ts  

Calls: SP_CREATE_CASE_FROM_APPLICATION  

---

/app/api/admin/verification/[caseId]/findings/route.ts  

GET: CORE.VERIFICATION_FINDINGS  
POST: CORE.SP_CREATE_FINDING  

---

/app/api/admin/verification/[caseId]/evidence/route.ts  

---

PUBLIC

/app/api/verify/[registryId]/route.ts  
/app/api/registry/route.ts  
/app/api/badge/[registryId]/route.ts  
/app/api/.well-known/gafaig-public-key/route.ts  

---

ADMIN UI PAGES

/app/admin/applications/page.tsx  
/app/admin/applications/[requestId]/page.tsx  
/app/admin/verification/[caseId]/page.tsx  

Displays:

Evidence count  
Findings count  
Score  
Decision  
Publish state  

---

PUBLIC UI PAGES

/app/page.tsx  
/app/verify/page.tsx  
/app/verify/[registryId]/page.tsx  
/app/registry/page.tsx  
/app/registry/[registryId]/page.tsx  
/app/explorer/page.tsx  
/app/explorer/organizations/page.tsx  
/app/explorer/countries/page.tsx  
/app/explorer/systems/page.tsx  
/app/developers/page.tsx  
/app/widget-preview/[registryId]/page.tsx  

---

TRUST SURFACE (CRITICAL)

/public/widget/gafaig-widget.v1.js  
/public/sdk/gafaig.v1.js  

---

CURRENT STATE (WHERE WE LEFT OFF)

WORKING:

Full verification API (signed, Ed25519)  
Registry pipeline deterministic end-to-end  
Public registry stable (V_REGISTRY_PUBLIC)  
Explorer UI hardened (null-safe rendering)  
Widget + SDK operational  
Public key endpoint working  
Decision lifecycle enforced (VALID_FROM / VALID_TO)  
No direct registry writes  
Public pages fully aligned (registry, verify, proof, widget)  

---

ACTIVE FOCUS

Snowflake pipeline validation (end-to-end)  
Fix broken canonical files:
12_TABLES_PARTICIPANTS.sql  
15_TABLES_EVENTS.sql  

Ensure deterministic rebuild capability  
Validate public view contract (V_REGISTRY_PUBLIC)  
Dataset expansion (multi-case, multi-industry)  

---

NEXT REQUIRED STEP

BUILD CANONICAL VALIDATION RUNNER  

Create:

99_RUN_CANONICAL_PIPELINE.sql  

Must:

Execute full pipeline in order  
Validate tables, views, procedures  
Validate registry output  
Detect drift automatically  

---

FUTURE PHASE (POST-VALIDATION)

AI INTELLIGENCE LAYER (SEPARATE SYSTEM)

AI must:

Observe  
Learn  
Recommend  

AI must NOT:

Score  
Certify  
Publish  
Modify registry  

AI layer feeds:

Human review → Approved → Canonical updates  

---

ENGINEERING RULES (ENFORCED)

Snowflake computes everything  
API performs no business logic  
UI performs no computation  
Registry is append-only  
Views define public contract  
Seed follows platform (never overrides it)  

---

STATUS SUMMARY

System Phase:
Phase 9 — PUBLIC TRUST LAYER COMPLETE

Current Focus:
Snowflake validation  
Pipeline integrity  
Deterministic rebuild  
System hardening before AI layer  

---

END OF FILE