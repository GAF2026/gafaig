# CURRENT_FOCUS.md
Last Updated: 2026-04-10

============================================================
CURRENT PHASE: REGISTRY STABILIZATION COMPLETE → ENRICHMENT REBUILD
============================================================

The GAFAIG platform has successfully exited the instability phase.

All blocking issues have been resolved:
- TypeScript build failures across Explorer and Registry
- Snowflake authentication (MFA vs password vs key-pair)
- Broken query layer assumptions
- Invalid Snowflake column references
- Seed file inconsistency and over-complexity
- Runtime crashes in /explorer and /registry routes

The system is now running in a **minimal, stable configuration**.

------------------------------------------------------------
WHAT IS WORKING (CONFIRMED)
------------------------------------------------------------

✔ Snowflake connection (MFA-compatible path established)
✔ Next.js build completes successfully
✔ All API routes respond without crashing
✔ /registry loads from CORE.V_REGISTRY_PUBLIC
✔ /explorer pages render without runtime failure
✔ /registry/ai-systems and /explorer/systems render
✔ Canonical seed successfully produces a registry record (CASE-0001)
✔ Publish pipeline is functional (SP_PUBLISH_CASE_TO_REGISTRY_V3)

------------------------------------------------------------
CURRENT SYSTEM MODE
------------------------------------------------------------

MODE: MINIMAL REGISTRY COMPATIBILITY

The system is intentionally running with a reduced schema to guarantee stability.

Active public data source:
CORE.V_REGISTRY_PUBLIC

Current fields in use:
- REGISTRY_ID
- APPLICATION_ID
- CASE_ID
- ENTITY_NAME
- COUNTRY
- DECISION_STATUS (partial / fallback)

Explorer and Registry UI have been downgraded to match this schema exactly.

------------------------------------------------------------
WHAT WAS REMOVED (TEMPORARILY)
------------------------------------------------------------

The following fields were removed from active usage due to instability:

- ENTITY_TYPE
- CERTIFIED_SCORE
- CERTIFIED_TIER
- CERTIFIED_BAND
- CERTIFIED_AT
- VALID_FROM
- VALID_TO

These fields previously caused:
- Snowflake query failures
- TypeScript contract mismatches
- Runtime crashes

------------------------------------------------------------
WHY THIS WAS NECESSARY
------------------------------------------------------------

The system drifted into a broken state where:
- UI assumed fields that did not exist
- Query layer referenced invalid columns
- Snowflake views were partially inconsistent
- Seed data did not align with schema

The correct decision was made:
→ Stabilize FIRST
→ Rebuild SECOND

------------------------------------------------------------
CURRENT PRIORITY (DO THIS NEXT)
------------------------------------------------------------

PHASE: CANONICAL REGISTRY ENRICHMENT REBUILD

Objective:
Rebuild CORE.V_REGISTRY_PUBLIC as a fully enriched, canonical view.

This is the ONLY correct next step.

------------------------------------------------------------
ENRICHMENT TARGET (DEFINE CLEARLY)
------------------------------------------------------------

The rebuilt CORE.V_REGISTRY_PUBLIC MUST include:

FROM REGISTRY_SNAPSHOTS:
- REGISTRY_ID
- CASE_ID
- ENTITY_NAME
- VERIFICATION_TYPE
- SCORE
- TIER
- BAND
- CERTIFIED_SCORE
- CERTIFIED_TIER
- CERTIFIED_BAND
- CERTIFIED_AT
- APPROVED_AT
- PUBLISHED_AT

FROM DECISIONS:
- DECISION_STATUS
- VALID_FROM
- VALID_TO

FROM APPLICATIONS:
- ENTITY_TYPE
- COUNTRY

------------------------------------------------------------
STRICT RULE FOR REBUILD
------------------------------------------------------------

DO NOT GUESS FIELDS.

Every field must:
✔ Exist in a real table
✔ Be explicitly selected
✔ Be validated with DESCRIBE or SELECT

------------------------------------------------------------
AFTER VIEW REBUILD (SEQUENCE)
------------------------------------------------------------

STEP 1:
Rebuild CORE.V_REGISTRY_PUBLIC (ENRICHED)

STEP 2:
Validate with direct Snowflake query:
SELECT * FROM CORE.V_REGISTRY_PUBLIC LIMIT 10;

STEP 3:
Update lib/queries/registry.ts to include new fields

STEP 4:
Update lib/queries/explorer.ts to remove placeholders

STEP 5:
Re-run:
npm run build

STEP 6:
Verify:
- /registry
- /explorer
- /explorer/organizations
- /explorer/countries
- /explorer/systems

------------------------------------------------------------
DO NOT DO (CRITICAL)
------------------------------------------------------------

🚫 Do NOT modify frontend to “fix” missing data
🚫 Do NOT reintroduce guessed columns
🚫 Do NOT bypass publish procedure
🚫 Do NOT patch queries before Snowflake is correct
🚫 Do NOT reintroduce legacy seed complexity

------------------------------------------------------------
SUCCESS CRITERIA
------------------------------------------------------------

The system is considered fully restored when:

✔ CORE.V_REGISTRY_PUBLIC contains full enriched dataset
✔ Query layer uses only real fields (no placeholders)
✔ Explorer pages display:
  - organization counts
  - country breakdowns
  - certification tiers
✔ Registry detail pages show certification data
✔ No TypeScript errors
✔ No runtime Snowflake errors

------------------------------------------------------------
STRATEGIC POSITION
------------------------------------------------------------

You are no longer debugging.

You are now:
→ Rebuilding the canonical public trust surface of GAFAIG

This is the transition from:
“make it work”
to:
“make it correct and scalable”

------------------------------------------------------------
NEXT CHAT INSTRUCTION
------------------------------------------------------------

Start next chat with:

"This is the continuation chat for building GAFAIG. Load MASTER_STATE.md, CURRENT_FOCUS.md, ENGINEERING_RULES.md. Snowflake is the source of truth. Do not re-architect. Begin rebuilding CORE.V_REGISTRY_PUBLIC as the canonical enriched registry view."

============================================================
END OF FILE
============================================================