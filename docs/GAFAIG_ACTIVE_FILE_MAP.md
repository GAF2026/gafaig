# GAFAIG_ACTIVE_FILE_MAP.md
Last Updated: 2026-04-10

------------------------------------------------------------
SYSTEM STATUS
------------------------------------------------------------
GAFAIG is now stabilized at the infrastructure and query layer after resolving:
- Snowflake authentication alignment (JWT key-pair compatible)
- Query layer schema mismatches with CORE.V_REGISTRY_PUBLIC
- Explorer + Registry TypeScript contract failures
- Build-breaking TypeScript errors across explorer pages

System is currently operating on a **minimal registry surface**:
- CORE.V_REGISTRY_PUBLIC is the active source of truth
- Query layer has been downgraded to match actual Snowflake schema
- Explorer + Registry pages are aligned to minimal fields

------------------------------------------------------------
CRITICAL ARCHITECTURAL RULE (RECONFIRMED)
------------------------------------------------------------
Snowflake is the ONLY source of truth.

UI and API layers MUST NOT assume fields.
All fields MUST exist in Snowflake views before being used.

------------------------------------------------------------
ACTIVE SNOWFLAKE OBJECTS
------------------------------------------------------------

PRIMARY PUBLIC SURFACE:
- CORE.V_REGISTRY_PUBLIC
  → CURRENT FIELDS (CONFIRMED SAFE):
    REGISTRY_ID
    APPLICATION_ID
    CASE_ID
    ENTITY_NAME
    COUNTRY
    DECISION_STATUS (may be null depending on seed)

REGISTRY SNAPSHOTS:
- CORE.REGISTRY_SNAPSHOTS
  → append-only canonical registry storage

LATEST APPROVED VIEW:
- CORE.V_REGISTRY_LATEST_APPROVED
  → used internally for snapshot resolution

AI SYSTEMS:
- CORE.REGISTRY_AI_SYSTEMS
- CORE.V_REGISTRY_AI_SYSTEMS_PUBLIC

SCORING:
- CORE.SP_SCORE_CASE_ENTERPRISE
- CORE.CASE_SCORE_SNAPSHOTS_V2
- CORE.V_CASE_SCORE_ENTERPRISE
- CORE.V_CASE_TIER_BAND

DECISIONS:
- CORE.DECISIONS

APPLICATION PIPELINE:
- CORE.APPLICATIONS
- CORE.SP_CREATE_CASE_FROM_APPLICATION

------------------------------------------------------------
ACTIVE API ROUTES
------------------------------------------------------------

Registry:
- app/api/registry/route.ts
  → uses lib/queries/registry.ts

Explorer:
- app/api/explorer/route.ts
  → uses lib/queries/explorer.ts

Verification:
- app/api/verify/[registryId]/route.ts

AI Systems:
- app/api/registry-ai-systems (via query layer)

------------------------------------------------------------
ACTIVE QUERY LAYER (CRITICAL)
------------------------------------------------------------

PRIMARY:
- lib/queries/registry.ts
  → STRICTLY ALIGNED to minimal V_REGISTRY_PUBLIC
  → NO OPTIONAL / ASSUMED FIELDS

- lib/queries/explorer.ts
  → FULLY PATCHED to:
    - remove invalid fields (ENTITY_TYPE, CERTIFIED_*)
    - return synthetic safe fields where UI requires them
    - maintain TypeScript compatibility

Key functions:
- getRegistryRecords
- searchRegistryRecords
- getRegistryRecordByRegistryId

Explorer functions:
- getExplorerSummary
- getRecentRegistryRecords (alias of getLatestRegistryRecords)
- getExplorerOrganizations
- getExplorerCountries
- getExplorerSystems

------------------------------------------------------------
FRONTEND PAGES (ACTIVE)
------------------------------------------------------------

Registry:
- app/registry/page.tsx
- app/registry/[registryId]/page.tsx

Explorer:
- app/explorer/page.tsx
- app/explorer/organizations/page.tsx
- app/explorer/countries/page.tsx
- app/explorer/systems/page.tsx

AI Systems:
- app/registry/ai-systems/page.tsx

------------------------------------------------------------
CORE INFRASTRUCTURE
------------------------------------------------------------

Snowflake Connection:
- lib/snowflake.ts
  → MUST support:
    - SNOWFLAKE_JWT (key pair auth)
    - fallback handling removed or minimized
  → current bug source resolved:
    - MFA conflict eliminated by using key pair

------------------------------------------------------------
SEED SYSTEM (CURRENT STATE)
------------------------------------------------------------

ACTIVE FILE:
- GAFAIG - CANONICAL_DEMO_SEED_MASTER.sql

STATUS:
- Rebuilt as MINIMAL REGISTRY SEED
- Only populates:
  CASE → SCORE → DECISION → REGISTRY_SNAPSHOT

REMOVED:
- legacy multi-table seed complexity
- inconsistent evidence/finding dependencies

KNOWN LIMITATION:
- does NOT fully populate:
  - ENTITY_TYPE
  - CERTIFIED_* fields
  - system-level metadata

------------------------------------------------------------
CURRENT LIMITATIONS (INTENTIONAL)
------------------------------------------------------------

The system is currently running in **minimal compatibility mode**:

MISSING FROM VIEW:
- ENTITY_TYPE
- CERTIFIED_SCORE
- CERTIFIED_TIER
- CERTIFIED_BAND
- CERTIFIED_AT
- VALID_FROM / VALID_TO

These are temporarily removed to:
→ stabilize system
→ eliminate runtime failures
→ allow forward rebuild cleanly

------------------------------------------------------------
NEXT PHASE (CLEAR DIRECTION)
------------------------------------------------------------

DO NOT PATCH FRONTEND FURTHER

INSTEAD:

1) Rebuild Snowflake canonical layer:

TARGET:
- CORE.V_REGISTRY_PUBLIC (ENRICHED)

TO INCLUDE:
- ENTITY_TYPE (from APPLICATIONS)
- CERTIFIED_SCORE / TIER / BAND
- CERTIFIED_AT
- VALID_FROM / VALID_TO
- DECISION_STATUS (canonicalized)

2) Restore query layer to canonical contract

3) Remove synthetic/null placeholders from explorer.ts

------------------------------------------------------------
DO NOT BREAK RULES
------------------------------------------------------------

- Do NOT add fields in TypeScript unless they exist in Snowflake
- Do NOT modify working Snowflake procedures without validation
- Do NOT reintroduce APPLICATION joins blindly
- Do NOT compute certification logic in API or UI
- Do NOT bypass SP_PUBLISH_CASE_TO_REGISTRY_V3

------------------------------------------------------------
CURRENT SYSTEM STATE SUMMARY
------------------------------------------------------------

STATUS: STABLE (MINIMAL MODE)

✔ Build passes (after query alignment)
✔ Snowflake connection working (JWT compatible path identified)
✔ Explorer pages compile (after type fixes)
✔ Registry loads from Snowflake

⚠ Data is minimal (by design)
⚠ Enrichment layer temporarily removed

------------------------------------------------------------
END OF FILE
------------------------------------------------------------