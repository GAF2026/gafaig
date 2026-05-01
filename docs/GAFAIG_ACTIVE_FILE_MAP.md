GAFAIG_ACTIVE_FILE_MAP.md

Last Updated: 2026-04-30

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

GAFAIG is a deterministic Snowflake-first system

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
FINDINGS (CRITICAL)
13_TABLES_FINDINGS.sql (or equivalent canonical file)

Creates:

CORE.VERIFICATION_FINDINGS

Fields REQUIRED:

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
Return OBJECT:
{
findingId,
caseId
}
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
NEVER insert into:
CORE.REGISTRY_SNAPSHOTS
CORE.REGISTRY_AI_SYSTEMS
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
MUST NOT expose:
score
internal decision logic
ONLY public contract fields allowed
CASE RENEWAL
26_VIEWS_CASE_RENEWAL_STATUS.sql
EXPLORER + SEARCH
GAFAIG - Public Registry Search View.sql
22_VIEWS_EXPLORER_STATS.sql
GAFAIG - SCORE_BREAKDOWN_PUBLIC.sql
SEED FILE POLICY (CRITICAL)
SINGLE SEED RULE (MANDATORY)

GAFAIG uses:

ONE canonical seed file ONLY

Active seed:

GAFAIG - FINAL_CANONICAL_MULTI_SEED.sql
STRICT RULES
❌ NEVER create additional seed files
❌ NEVER split seed logic across files
❌ NEVER manually insert into registry tables
❌ NEVER delete from registry tables
ALLOWED
✅ Modify master seed file
✅ Expand dataset inside master seed
✅ Add lifecycle realism (expired, revoked)
✅ Perform CASE-level cleanup ONLY (pre-publish)
REQUIRED BEHAVIOR

Seed must:

Insert APPLICATIONS
Create CASES
Insert FINDINGS / EVIDENCE / EVENTS
Call scoring procedure
Call approval procedure
Call publish procedure
NEXT.JS API ROUTES
APPLICATIONS

/app/api/admin/applications/route.ts

APPLICATION DETAIL

/app/api/admin/applications/[requestId]/route.ts

CREATE CASE

/app/api/admin/applications/[requestId]/convert/route.ts

Calls:

SP_CREATE_CASE_FROM_APPLICATION
FINDINGS (CRITICAL)
LIST + CREATE

/app/api/admin/verification/[caseId]/findings/route.ts

GET:

Reads from CORE.VERIFICATION_FINDINGS

POST:

Calls CORE.SP_CREATE_FINDING
EVIDENCE

/app/api/admin/verification/[caseId]/evidence/route.ts

VERIFY (PUBLIC)

/app/api/verify/[registryId]/route.ts

REGISTRY

/app/api/registry/route.ts

BADGE

/app/api/badge/[registryId]/route.ts

PUBLIC KEY (CRITICAL)

/app/api/.well-known/gafaig-public-key/route.ts

ADMIN UI PAGES
APPLICATION LIST

/app/admin/applications/page.tsx

APPLICATION DETAIL

/app/admin/applications/[requestId]/page.tsx

CASE PAGE (CRITICAL)

/app/admin/verification/[caseId]/page.tsx

Displays:

Evidence count
Findings count
Score
Decision
Publish state
PUBLIC UI PAGES

/app/page.tsx
/app/verify/[registryId]/page.tsx
/app/registry/page.tsx
/app/registry/[registryId]/page.tsx
/app/explorer/page.tsx
/app/developers/page.tsx
/app/widget-preview/[registryId]/page.tsx

TRUST SURFACE (CRITICAL)

/public/widget/gafaig-widget.v1.js
/public/sdk/gafaig.v1.js

CURRENT STATE (WHERE WE LEFT OFF)
✅ WORKING
Full verification API (signed, Ed25519)
Widget rendering externally
SDK layer operational
Public key endpoint working
AI systems public view fixed
Seed producing certified records
⚠️ ACTIVE ISSUES (RESOLVED / IN PROGRESS)
❌ SCORE leakage into views → REMOVED
❌ DECISION_STATUS misuse → corrected
❌ registry direct writes → removed
❌ multi-seed conflicts → eliminated
NEXT REQUIRED STEP
🔴 BUILD CANONICAL VALIDATION RUNNER

Create:

99_RUN_CANONICAL_PIPELINE.sql

Must:

Execute full pipeline in order
Validate:
tables
views
procedures
registry output
Detect drift automatically
ENGINEERING RULES (ENFORCED)
Snowflake computes everything
API does zero business logic
UI does zero computation
Registry is append-only
Views define contract
Seed follows platform (never overrides it)
STATUS SUMMARY

System Phase:
→ Phase 9 — PUBLIC TRUST LAYER COMPLETE

Current Focus:

Deterministic validation layer
Canonical pipeline runner
Scale registry dataset
External adoption (SDK + widget)
END OF FILE