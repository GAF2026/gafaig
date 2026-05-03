GAFAIG_ACTIVE_FILE_MAP.md

Last Updated: 2026-05-02

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

CORE SYSTEM PRINCIPLE

GAFAIG is a deterministic Snowflake-first system.

STRICT RULES:

Snowflake = Source of Truth
API = Pass-through only (NO computation)
UI = Display only (NO derivation)
Registry = Append-only
IDs = Generated ONLY in Snowflake

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

SNOWFLAKE FILE MAP (CANONICAL ORDER)

00 — ENVIRONMENT
00_CORE_SETUP.sql

01 — REBUILD
01_REBUILD_ENVIRONMENT_CANONICAL.sql

11 — APPLICATIONS
11_TABLES_APPLICATIONS.sql

Creates:
CORE.APPLICATIONS

12 — PARTICIPANTS ⚠️ BROKEN FILE (FIX FIRST)
12_TABLES_PARTICIPANTS.sql

Creates:
CORE.PARTICIPANTS

⚠️ MUST FIX BEFORE ANY PIPELINE EXECUTION

13 — FINDINGS (CRITICAL)
13_TABLES_FINDINGS.sql

Creates:
CORE.VERIFICATION_FINDINGS

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

14 — REGISTRY AI SYSTEMS
14_TABLES_REGISTRY_AI_SYSTEMS.sql

Creates:
CORE.REGISTRY_AI_SYSTEMS

14 — EVIDENCE
14_TABLES_EVIDENCE.sql

Creates:
CORE.VERIFICATION_EVIDENCE

15 — EVENTS ⚠️ BROKEN FILE (FIX FIRST)
15_TABLES_EVENTS.sql

Creates:
CORE.VERIFICATION_EVENTS

⚠️ MUST FIX BEFORE ANY PIPELINE EXECUTION

16 — SCORING SNAPSHOTS
16_TABLES_CASE_SCORE_SNAPSHOTS.sql

Creates:
CORE.CASE_SCORE_SNAPSHOTS

17 — DECISIONS
17_TABLES_DECISIONS.sql

Creates:
CORE.DECISIONS

18 — REGISTRY ENTITIES
18_TABLES_REGISTRY_ENTITIES.sql

Creates:
CORE.REGISTRY_ENTITIES

PROCEDURES

APPLICATION → CASE
23_SP_CREATE_CASE_FROM_APPLICATION.sql

Creates:
CORE.SP_CREATE_CASE_FROM_APPLICATION

APPLICATION INTAKE
24_PROCEDURES_APPLICATION_INTAKE.sql

FINDINGS (CRITICAL)
26_PROCEDURES_FINDINGS.sql

Creates:
CORE.SP_CREATE_FINDING

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
Return OBJECT

EVIDENCE
27_PROCEDURES_EVIDENCE.sql

FINDING ↔ EVIDENCE LINK
28_PROCEDURES_FINDING_EVIDENCE.sql

SCORING
25_SP_SCORE_CASE_ENTERPRISE.sql

APPROVAL
25_PROCEDURES_APPROVAL.sql

REGISTRY PUBLISH (CRITICAL OWNER)
GAFAIG - CORE.REGISTRY_PUBLISH.sql

Creates:
SP_PUBLISH_CASE_TO_REGISTRY_V3

RULE:

ALL registry writes MUST go through this procedure

NEVER insert into registry tables
NEVER delete from registry tables

VIEWS

PUBLIC REGISTRY
21_VIEWS_PUBLIC_REGISTRY.sql

Creates:
CORE.V_REGISTRY_PUBLIC
CORE.V_REGISTRY_LATEST_APPROVED

AI SYSTEMS PUBLIC
22_VIEWS_REGISTRY_AI_SYSTEMS_PUBLIC.sql

Creates:
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

RULE:

MUST JOIN on CASE_ID
MUST NOT expose score

CASE RENEWAL
26_VIEWS_CASE_RENEWAL_STATUS.sql

Creates:
CORE.V_CASE_RENEWAL_STATUS

EXPLORER + SEARCH

GAFAIG - Public Registry Search View.sql
22_VIEWS_EXPLORER_STATS.sql

SEED FILE POLICY (CRITICAL)

Single canonical seed file only:

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql

Strict rules enforced

NEXT.JS API ROUTES

/app/api/admin/applications/route.ts
/app/api/admin/applications/[requestId]/route.ts
/app/api/admin/applications/[requestId]/convert/route.ts

/app/api/admin/verification/[caseId]/findings/route.ts
/app/api/admin/verification/[caseId]/evidence/route.ts

PUBLIC:

/app/api/verify/[registryId]/route.ts
/app/api/registry/route.ts
/app/api/badge/[registryId]/route.ts
/app/api/.well-known/gafaig-public-key/route.ts
/app/api/explorer/route.ts

PUBLIC UI PAGES

/app/page.tsx
/app/verify/[registryId]/page.tsx
/app/registry/page.tsx
/app/registry/[registryId]/page.tsx
/app/explorer/page.tsx
/app/explorer/organizations/page.tsx
/app/explorer/countries/page.tsx
/app/explorer/systems/page.tsx
/app/developers/page.tsx
/app/widget-preview/[registryId]/page.tsx

🔴 ACTIVE FRONTEND FOCUS (NEW — CRITICAL)

app/page.tsx

✔ Homepage conversion update completed locally
✔ CTA hierarchy optimized
✔ Messaging aligned to verification + proof

🔴 NOT DEPLOYED — blocked by Explorer build failure

lib/queries/explorer.ts

🔴 IMMEDIATE BLOCKER

Must:

Restore ALL required exports
Align with explorer pages
Match row shapes expected by UI

Missing or broken exports cause:

Build failure
Explorer failure
Deployment failure

Explorer pages:

/app/explorer/page.tsx
/app/explorer/organizations/page.tsx
/app/explorer/countries/page.tsx
/app/explorer/systems/page.tsx

🔴 MUST be restored and aligned before ANY production push

CRITICAL DEPLOYMENT DEPENDENCY

Production deployment is BLOCKED until:

Explorer query layer is fixed
Explorer pages compile
npm run build passes

ONLY THEN:

Homepage can be deployed

CURRENT STATE (WHERE WE LEFT OFF)

WORKING:

Verification API
Registry pipeline
Public registry
SDK + widget
Public key
Decision lifecycle
Append-only enforcement

ACTIVE FOCUS

Explorer query contract restoration
Frontend deployment unblock
Homepage deployment readiness
Certification funnel optimization (NEXT)

NEXT REQUIRED STEP

FIX EXPLORER (BLOCKER)

Then:

Run npm run build
Deploy homepage
Validate Explorer
Proceed to certification page optimization

ENGINEERING RULES (ENFORCED)

Snowflake computes everything
API performs no business logic
UI performs no computation
Registry is append-only
Views define public contract

STATUS SUMMARY

System Phase:
Phase 9 — PUBLIC TRUST LAYER STABLE

Current Focus:

Explorer restoration (blocking)
Frontend deployment readiness
Public trust surface completion

END OF FILE