# MASTER_STATE.md
Last Updated: 2026-04-14

============================================================
GAFAIG — MASTER SYSTEM STATE
============================================================

GAFAIG = Global Authority for AI Governance  
GAFAIG is the world’s first searchable AI governance registry.

This document is the single source of truth for:
- System architecture
- Data flow
- Canonical contracts
- Current operational state

============================================================
SYSTEM ARCHITECTURE (LOCKED)
============================================================

Snowflake (Source of Truth)
→ Query Layer (lib/queries)
→ API Layer (Next.js routes)
→ UI Layer (Next.js pages)
→ Vercel (Production)

Core Rule:
ALL computation, scoring, certification, and decisions happen ONLY in Snowflake.

The application layer:
- Does NOT compute
- Does NOT score
- Does NOT infer
- Only transports and renders

============================================================
CANONICAL DATA PIPELINE (LOCKED)
============================================================

CASE
→ FINDINGS
→ EVIDENCE
→ EVENTS
→ SCORING
→ SCORE SNAPSHOT
→ DECISION
→ REGISTRY SNAPSHOT
→ PUBLIC VIEWS
→ API
→ UI

All steps are deterministic and append-only.

============================================================
CORE SNOWFLAKE OBJECTS
============================================================

Tables:
- CORE.VERIFICATION_CASES
- CORE.VERIFICATION_FINDINGS
- CORE.VERIFICATION_EVIDENCE
- CORE.VERIFICATION_FINDING_EVIDENCE
- CORE.VERIFICATION_EVENTS
- CORE.CASE_SCORE_SNAPSHOTS_V2
- CORE.DECISIONS
- CORE.REGISTRY_SNAPSHOTS
- CORE.APPLICATIONS
- CORE.REGISTRY_AI_SYSTEMS

Views:
- CORE.V_CASE_SCORE_ENTERPRISE
- CORE.V_CASE_TIER_BAND
- CORE.V_GOVERNANCE_SCORE_CASE
- CORE.V_REGISTRY_LATEST_APPROVED
- CORE.V_REGISTRY_PUBLIC
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

Procedures:
- CORE.SP_SCORE_CASE_ENTERPRISE
- CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3
- CORE.SP_CREATE_CASE_FROM_APPLICATION

============================================================
PUBLIC DATA CONTRACT (CRITICAL)
============================================================

ALL public-facing data must come from:

CORE.V_REGISTRY_PUBLIC

This is the ONLY allowed source for:
- Registry pages
- Explorer pages
- API responses
- Badge rendering

No direct table access allowed in UI or API.

============================================================
RECORD TYPES (LOCKED LOGIC)
============================================================

1. CERTIFIED RECORD

Defined by:
- CERTIFIED_AT NOT NULL

Contains:
- CERTIFIED_SCORE
- CERTIFIED_TIER
- CERTIFIED_BAND
- Certification timestamp
- Governance proof

Appears in:
- Registry
- Explorer

------------------------------------------------------------

2. APPROVED-ONLY RECORD

Defined by:
- DECISION_STATUS = APPROVED
- CERTIFIED_AT = NULL

Contains:
- Approval decision only
- No certification data

Appears in:
- Explorer (primary)
- Registry (optional depending on UX policy)

------------------------------------------------------------

CRITICAL RULE:
UI MUST NOT fabricate certification data.

============================================================
REGISTRY SNAPSHOT MODEL
============================================================

CORE.REGISTRY_SNAPSHOTS is append-only.

Each publish:
- Creates a new snapshot
- Does NOT update prior rows

Latest state resolved via:
- CORE.V_REGISTRY_LATEST_APPROVED

Registry ID:
- Stable per case
- Reused across publishes

============================================================
SCORING MODEL
============================================================

Scoring is deterministic and executed via:

CORE.SP_SCORE_CASE_ENTERPRISE

Outputs:
- SCORE
- SUBSCORES
- TIER
- BAND

Stored in:
- CORE.CASE_SCORE_SNAPSHOTS_V2

============================================================
DECISION MODEL
============================================================

CORE.DECISIONS defines:
- Approval status
- Certification tier/band
- Validity window

Used to enrich:
- CORE.V_REGISTRY_PUBLIC

============================================================
PUBLISH MODEL
============================================================

CORE.SP_PUBLISH_CASE_TO_REGISTRY_V3

Performs:
1. Validates case is approved
2. Reads governance score
3. Generates / reuses REGISTRY_ID
4. Inserts append-only snapshot
5. Aligns registry systems

Outputs:
- Registry record visible in public views

============================================================
DEMO DATA STATE
============================================================

Canonical demo system is ACTIVE.

Current dataset:
- 6 total registry records
- 2 certified records
- 4 approved-only records

Seed file:
- GAFAIG - FINAL_CANONICAL_DEMO_SEED.sql

Status:
- Fully operational in Snowflake

============================================================
APPLICATION LAYER STATE
============================================================

Query Layer:
- lib/queries/registry.ts → ❌ CURRENTLY UNSTABLE

Issues:
- Interface mismatch with API
- Missing/incorrect filters
- Export inconsistencies
- Prior incorrect filtering logic

API Layer:
- /api/registry → depends on query layer
- /api/registry/search → depends on query layer
- /api/badge → depends on query layer

UI Layer:
- Pages render correctly when data is valid
- Currently impacted by query instability

============================================================
CURRENT PRIMARY BLOCKER
============================================================

The system is broken at:

lib/queries/registry.ts

NOT Snowflake
NOT UI

This file must:
- Match API expectations
- Match Snowflake schema
- Normalize certified vs approved records
- Provide correct exports

============================================================
IMMEDIATE PRIORITY (NEXT ACTION)
============================================================

1. Fix lib/queries/registry.ts
2. Align with API routes
3. Restore build stability
4. Verify:
   - /registry
   - /explorer
   - /registry/[registryId]

DO NOT modify:
- Snowflake
- UI layout

============================================================
ENGINEERING RULES (ENFORCED)
============================================================

- Snowflake is the source of truth
- No scoring outside Snowflake
- No certification logic outside Snowflake
- API = transport only
- UI = presentation only
- No re-architecture
- No duplication of logic
- Maintain deterministic pipeline

============================================================
SYSTEM STATUS SUMMARY
============================================================

Snowflake:
- ✅ Stable
- ✅ Canonical
- ✅ Production-ready

Application Layer:
- ❌ Unstable (query layer issue)

UI:
- ⚠️ Dependent on query layer fix

============================================================
END
============================================================