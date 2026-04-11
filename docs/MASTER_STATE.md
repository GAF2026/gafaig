# MASTER_STATE.md
Last Updated: 2026-04-10

============================================================
GAFAIG — MASTER SYSTEM STATE (CANONICAL)
============================================================

GAFAIG (Global Authority for AI Governance) is a deterministic, append-only AI governance registry platform built on Snowflake as the single source of truth, with a Next.js frontend and API layer deployed via Vercel.

The system is designed to function as a global certification and registry infrastructure for AI systems, organizations, and governance compliance.

------------------------------------------------------------
CURRENT SYSTEM STATUS
------------------------------------------------------------

STATUS: STABLE (MINIMAL MODE)

The system has been stabilized after resolving multiple critical issues:
- Snowflake authentication (MFA vs key-pair mismatch)
- Broken query layer assumptions
- TypeScript contract failures across explorer and registry
- Invalid column references in Snowflake views
- Seed data inconsistencies

All build-breaking and runtime-blocking issues have been resolved.

The platform is currently operating in a **minimal registry mode**, where only verified Snowflake fields are used.

------------------------------------------------------------
CORE ARCHITECTURE (LOCKED)
------------------------------------------------------------

Snowflake is the authoritative computation engine.

System flow:

APPLICATION → CASE → FINDINGS → EVIDENCE → EVENTS → SCORING → DECISION → REGISTRY SNAPSHOT → PUBLIC VIEW → API → UI

Key principles:
- Append-only data model
- Deterministic scoring
- No computation in API or UI layers
- Public registry exposes only certified outputs (no raw evidence)

------------------------------------------------------------
SNOWFLAKE ENVIRONMENT
------------------------------------------------------------

Account: duglhtd-cm14952
Database: GAFAIG_DB
Schema: CORE
Warehouse: GAFAIG_WH

Primary runtime user:
- GAFAIG_APP_USER (RSA key-pair enabled)
- Default role: GAFAIG_APP_ROLE

Authentication:
- Key-pair (SNOWFLAKE_JWT) required for MFA-compliant access
- Password authentication is no longer valid for runtime

------------------------------------------------------------
ACTIVE TABLES
------------------------------------------------------------

CORE.APPLICATIONS
CORE.VERIFICATION_CASES
CORE.VERIFICATION_FINDINGS
CORE.VERIFICATION_EVIDENCE
CORE.VERIFICATION_EVENTS
CORE.CASE_SCORE_SNAPSHOTS_V2
CORE.DECISIONS
CORE.REGISTRY_SNAPSHOTS
CORE.REGISTRY_AI_SYSTEMS

------------------------------------------------------------
ACTIVE VIEWS
------------------------------------------------------------

PRIMARY PUBLIC VIEW:
CORE.V_REGISTRY_PUBLIC

CURRENT SAFE COLUMN SET:
- REGISTRY_ID
- APPLICATION_ID
- CASE_ID
- ENTITY_NAME
- COUNTRY
- DECISION_STATUS (may be null)

LATEST SNAPSHOT VIEW:
CORE.V_REGISTRY_LATEST_APPROVED

AI SYSTEMS VIEW:
CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

------------------------------------------------------------
SCORING ENGINE
------------------------------------------------------------

Procedure:
CORE.SP_SCORE_CASE_ENTERPRISE

Supporting views:
- CORE.V_CASE_SCORE_ENTERPRISE
- CORE.V_CASE_TIER_BAND
- CORE.V_FINDING_UNMAPPED_CONTROLS

Snapshots:
- CORE.CASE_SCORE_SNAPSHOTS_V2

------------------------------------------------------------
REGISTRY PUBLISHING
------------------------------------------------------------

Procedure:
CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

Responsibilities:
- Validate approved case
- Read deterministic score
- Generate/reuse REGISTRY_ID
- Insert append-only REGISTRY_SNAPSHOTS row
- Align AI systems with registry

------------------------------------------------------------
QUERY LAYER (CRITICAL STATE)
------------------------------------------------------------

Files:
- lib/queries/registry.ts
- lib/queries/explorer.ts

Status:
- Fully aligned to minimal Snowflake schema
- All non-existent fields removed
- Synthetic/null placeholders added ONLY where UI requires types

RULE:
Query layer must EXACTLY match Snowflake views

------------------------------------------------------------
API LAYER
------------------------------------------------------------

Registry:
app/api/registry/route.ts

Explorer:
app/api/explorer/route.ts

Verification:
app/api/verify/[registryId]/route.ts

Pattern:
Snowflake → Query Layer → API → UI

No business logic in API

------------------------------------------------------------
FRONTEND (NEXT.JS)
------------------------------------------------------------

Framework:
Next.js 14 (App Router)

Pages:

Registry:
- /registry
- /registry/[registryId]

Explorer:
- /explorer
- /explorer/organizations
- /explorer/countries
- /explorer/systems

AI Systems:
- /registry/ai-systems

Status:
- All pages compile successfully
- All runtime crashes resolved
- UI currently reflects minimal dataset

------------------------------------------------------------
SNOWFLAKE CONNECTION
------------------------------------------------------------

File:
lib/snowflake.ts

Status:
- Updated to support key-pair authentication
- Compatible with MFA-enabled Snowflake accounts

Requirements:
- SNOWFLAKE_PRIVATE_KEY or PRIVATE_KEY_PATH must be set
- SNOWFLAKE_JWT authenticator must be used

------------------------------------------------------------
SEED SYSTEM (CURRENT)
------------------------------------------------------------

File:
GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql

Status:
- Rebuilt as minimal deterministic seed
- Creates:
  CASE → SCORE → DECISION → REGISTRY SNAPSHOT

Removes:
- legacy evidence/finding complexity
- inconsistent relationships

Purpose:
- Provide stable test registry record (CASE-0001)

------------------------------------------------------------
CURRENT LIMITATIONS
------------------------------------------------------------

The system is intentionally running without enrichment.

Missing from CORE.V_REGISTRY_PUBLIC:
- ENTITY_TYPE
- CERTIFIED_SCORE
- CERTIFIED_TIER
- CERTIFIED_BAND
- CERTIFIED_AT
- VALID_FROM / VALID_TO

Explorer layer uses placeholders for compatibility.

------------------------------------------------------------
NEXT PHASE (MANDATORY)
------------------------------------------------------------

Rebuild canonical enriched registry view:

TARGET:
CORE.V_REGISTRY_PUBLIC (ENRICHED)

Add:
- ENTITY_TYPE (from APPLICATIONS)
- CERTIFIED_SCORE / TIER / BAND
- CERTIFIED_AT
- VALID_FROM / VALID_TO
- normalized DECISION_STATUS

Then:
- Update query layer to use real fields
- Remove all synthetic placeholders
- Restore full registry UX

------------------------------------------------------------
DO NOT BREAK RULES
------------------------------------------------------------

- Do NOT compute scores in API/UI
- Do NOT assume fields not in Snowflake
- Do NOT bypass publish procedure
- Do NOT mutate snapshot history
- Do NOT reintroduce broken joins

------------------------------------------------------------
SUMMARY
------------------------------------------------------------

GAFAIG is now:

✔ Architecturally correct
✔ Deterministic
✔ Build-stable
✔ Runtime-stable
✔ Snowflake-aligned

Remaining work is controlled and forward-only:
→ Reintroduce enrichment cleanly at the Snowflake layer

============================================================
END OF FILE
============================================================